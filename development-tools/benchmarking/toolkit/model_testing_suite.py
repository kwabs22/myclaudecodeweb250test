"""
Model Testing Suite for Modal
Qualitative and quantitative comparison of LLM models across different GPUs
"""

import json
import asyncio
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
import time

# Modal imports
try:
    import modal
    MODAL_AVAILABLE = True
except ImportError:
    MODAL_AVAILABLE = False
    print("Warning: Modal not installed")


@dataclass
class ModelTestResult:
    """Result from testing a single model"""
    model_name: str
    model_hf_id: str
    gpu_type: str
    parameters: str

    # Performance metrics
    tokens_per_second: float
    time_to_first_token_ms: float
    total_inference_time_s: float

    # Qualitative metrics
    prompt: str
    response: str
    response_quality_score: Optional[float] = None

    # Metadata
    timestamp: str = ""
    vram_used_gb: Optional[float] = None
    success: bool = True
    error: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class ModelCatalog:
    """Manages model catalog and GPU compatibility"""

    def __init__(self, catalog_path: str = "model_catalog.json"):
        with open(catalog_path, 'r') as f:
            data = json.load(f)
            self.catalog = data['model_catalog']

    def get_models_for_gpu(self, gpu_type: str) -> List[Dict[str, Any]]:
        """Get all models compatible with a specific GPU"""
        gpu_info = self.catalog['gpu_types'].get(gpu_type)
        if not gpu_info:
            return []

        vram_available = gpu_info['vram_gb']
        compatible_models = []

        for category_name, category in self.catalog['models'].items():
            if isinstance(category, dict) and 'models' in category:
                for model in category['models']:
                    if model['vram_required_gb'] <= vram_available:
                        model_copy = model.copy()
                        model_copy['category'] = category_name
                        compatible_models.append(model_copy)

        return compatible_models

    def get_recommended_models_for_gpu(self, gpu_type: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Get top recommended models for a GPU type"""
        all_models = self.get_models_for_gpu(gpu_type)

        # Sort by quality tier and expected TPS
        quality_order = {'exceptional': 4, 'excellent': 3, 'good': 2, 'basic': 1}

        sorted_models = sorted(
            all_models,
            key=lambda m: (
                quality_order.get(m.get('quality_tier', 'basic'), 0),
                m.get('expected_tps', {}).get(gpu_type, 0)
            ),
            reverse=True
        )

        return sorted_models[:limit]

    def get_model_by_name(self, model_name: str) -> Optional[Dict[str, Any]]:
        """Find a model by its name or HuggingFace ID"""
        for category_name, category in self.catalog['models'].items():
            if isinstance(category, dict) and 'models' in category:
                for model in category['models']:
                    if model['name'] == model_name or model['hf_id'] == model_name:
                        return model
        return None

    def get_qualitative_tests(self, scenario: str = "quick_quality") -> Dict[str, Any]:
        """Get qualitative test scenario"""
        return self.catalog['testing_scenarios'].get(scenario, {})

    def get_test_prompts(self, dimensions: List[str] = None) -> List[Tuple[str, str]]:
        """Get test prompts for specific dimensions"""
        all_dimensions = self.catalog['qualitative_metrics']['dimensions']

        if dimensions is None:
            dimensions = [d['name'] for d in all_dimensions]

        prompts = []
        for dimension in all_dimensions:
            if dimension['name'] in dimensions:
                for prompt in dimension['test_prompts']:
                    prompts.append((dimension['name'], prompt))

        return prompts


class ModalModelTester:
    """Test models on Modal infrastructure"""

    def __init__(self):
        if not MODAL_AVAILABLE:
            raise ImportError("Modal SDK required")

        self.app = modal.App("model-testing-suite")
        self.catalog = ModelCatalog()
        self.results: List[ModelTestResult] = []

    def create_test_function(self, gpu_type: str = "any"):
        """Create Modal function for model testing"""

        image = (
            modal.Image.debian_slim(python_version="3.11")
            .pip_install(
                "torch",
                "transformers>=4.35.0",
                "accelerate",
                "bitsandbytes",  # For quantization
                "auto-gptq",     # For GPTQ models
                "autoawq",       # For AWQ models
            )
        )

        @self.app.function(
            image=image,
            gpu=gpu_type,
            timeout=900,
            retries=0
        )
        def test_model_inference(
            model_hf_id: str,
            prompt: str,
            max_tokens: int = 200,
            temperature: float = 0.7
        ) -> Dict[str, Any]:
            """Test a model with a specific prompt"""
            import torch
            from transformers import AutoTokenizer, AutoModelForCausalLM
            import time

            device = "cuda" if torch.cuda.is_available() else "cpu"

            try:
                print(f"Loading model: {model_hf_id}")
                load_start = time.time()

                # Load tokenizer
                tokenizer = AutoTokenizer.from_pretrained(
                    model_hf_id,
                    trust_remote_code=True
                )

                # Handle models that need special loading
                if "gptq" in model_hf_id.lower():
                    from auto_gptq import AutoGPTQForCausalLM
                    model = AutoGPTQForCausalLM.from_quantized(
                        model_hf_id,
                        device="cuda:0",
                        use_safetensors=True
                    )
                elif "awq" in model_hf_id.lower():
                    from awq import AutoAWQForCausalLM
                    model = AutoAWQForCausalLM.from_quantized(
                        model_hf_id,
                        fuse_layers=True,
                        trust_remote_code=True
                    )
                else:
                    model = AutoModelForCausalLM.from_pretrained(
                        model_hf_id,
                        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                        device_map="auto",
                        trust_remote_code=True
                    )

                load_time = time.time() - load_start

                # Prepare input
                inputs = tokenizer(prompt, return_tensors="pt").to(device)
                input_length = inputs.input_ids.shape[1]

                # Time to first token
                inference_start = time.time()
                with torch.no_grad():
                    first_output = model.generate(
                        **inputs,
                        max_new_tokens=1,
                        do_sample=False,
                        pad_token_id=tokenizer.eos_token_id
                    )
                ttft = time.time() - inference_start
                ttft_ms = ttft * 1000

                # Full generation
                gen_start = time.time()
                with torch.no_grad():
                    outputs = model.generate(
                        **inputs,
                        max_new_tokens=max_tokens,
                        do_sample=True,
                        temperature=temperature,
                        top_p=0.9,
                        pad_token_id=tokenizer.eos_token_id
                    )

                total_gen_time = time.time() - gen_start

                # Decode output
                full_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
                response = full_text[len(prompt):].strip()

                output_length = outputs.shape[1] - input_length
                tokens_per_second = output_length / total_gen_time if total_gen_time > 0 else 0

                # GPU info
                gpu_info = {}
                if torch.cuda.is_available():
                    gpu_info = {
                        'name': torch.cuda.get_device_name(0),
                        'memory_allocated_gb': torch.cuda.memory_allocated(0) / 1e9,
                        'memory_reserved_gb': torch.cuda.memory_reserved(0) / 1e9,
                        'max_memory_allocated_gb': torch.cuda.max_memory_allocated(0) / 1e9
                    }

                return {
                    'success': True,
                    'response': response,
                    'tokens_per_second': tokens_per_second,
                    'time_to_first_token_ms': ttft_ms,
                    'total_inference_time_s': total_gen_time,
                    'model_load_time_s': load_time,
                    'input_length': input_length,
                    'output_length': output_length,
                    'vram_used_gb': gpu_info.get('max_memory_allocated_gb', 0),
                    'gpu_info': gpu_info,
                    'device': device
                }

            except Exception as e:
                import traceback
                return {
                    'success': False,
                    'error': str(e),
                    'traceback': traceback.format_exc()
                }

        return test_model_inference

    def test_single_model(
        self,
        model_hf_id: str,
        gpu_type: str,
        prompts: List[Tuple[str, str]],
        max_tokens: int = 200
    ) -> List[ModelTestResult]:
        """Test a single model with multiple prompts"""

        print(f"\n{'='*60}")
        print(f"Testing Model: {model_hf_id}")
        print(f"GPU: {gpu_type}")
        print(f"Prompts: {len(prompts)}")
        print(f"{'='*60}")

        test_fn = self.create_test_function(gpu_type)
        results = []

        model_info = self.catalog.get_model_by_name(model_hf_id)
        model_name = model_info['name'] if model_info else model_hf_id
        parameters = model_info['parameters'] if model_info else "Unknown"

        with self.app.run():
            for dimension, prompt in prompts:
                print(f"\nTesting dimension: {dimension}")
                print(f"Prompt: {prompt[:80]}...")

                try:
                    result = test_fn.remote(
                        model_hf_id=model_hf_id,
                        prompt=prompt,
                        max_tokens=max_tokens
                    )

                    if result['success']:
                        test_result = ModelTestResult(
                            model_name=model_name,
                            model_hf_id=model_hf_id,
                            gpu_type=gpu_type,
                            parameters=parameters,
                            tokens_per_second=result['tokens_per_second'],
                            time_to_first_token_ms=result['time_to_first_token_ms'],
                            total_inference_time_s=result['total_inference_time_s'],
                            prompt=prompt,
                            response=result['response'],
                            timestamp=datetime.now().isoformat(),
                            vram_used_gb=result.get('vram_used_gb'),
                            success=True
                        )

                        print(f"  ✓ Success: {result['tokens_per_second']:.2f} tokens/s")
                        print(f"  Response: {result['response'][:100]}...")
                    else:
                        test_result = ModelTestResult(
                            model_name=model_name,
                            model_hf_id=model_hf_id,
                            gpu_type=gpu_type,
                            parameters=parameters,
                            tokens_per_second=0,
                            time_to_first_token_ms=0,
                            total_inference_time_s=0,
                            prompt=prompt,
                            response="",
                            success=False,
                            error=result['error']
                        )
                        print(f"  ✗ Error: {result['error']}")

                    results.append(test_result)
                    self.results.append(test_result)

                except Exception as e:
                    print(f"  ✗ Exception: {str(e)}")

        return results

    def compare_models_on_gpu(
        self,
        model_ids: List[str],
        gpu_type: str,
        test_scenario: str = "quick_quality"
    ) -> Dict[str, List[ModelTestResult]]:
        """Compare multiple models on the same GPU"""

        print(f"\n{'='*60}")
        print(f"MODEL COMPARISON ON {gpu_type.upper()}")
        print(f"Models: {len(model_ids)}")
        print(f"Scenario: {test_scenario}")
        print(f"{'='*60}")

        # Get test prompts
        scenario = self.catalog.get_qualitative_tests(test_scenario)
        dimensions = scenario.get('dimensions', ['instruction_following', 'reasoning'])
        prompts = self.catalog.get_test_prompts(dimensions)[:3]  # Limit to 3 prompts

        all_results = {}

        for model_id in model_ids:
            results = self.test_single_model(
                model_hf_id=model_id,
                gpu_type=gpu_type,
                prompts=prompts
            )
            all_results[model_id] = results
            time.sleep(2)  # Brief pause between models

        return all_results

    def generate_comparison_report(self, results: Dict[str, List[ModelTestResult]]) -> str:
        """Generate markdown comparison report"""

        report = []
        report.append("# Model Qualitative Comparison Report")
        report.append(f"\nGenerated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"\nModels Tested: {len(results)}")
        report.append("\n## Performance Summary\n")

        # Performance table
        report.append("| Model | Params | Avg TPS | Avg TTFT (ms) | Avg Time (s) | Success Rate |")
        report.append("|-------|--------|---------|---------------|--------------|--------------|")

        for model_id, model_results in results.items():
            if not model_results:
                continue

            successful = [r for r in model_results if r.success]
            if successful:
                avg_tps = sum(r.tokens_per_second for r in successful) / len(successful)
                avg_ttft = sum(r.time_to_first_token_ms for r in successful) / len(successful)
                avg_time = sum(r.total_inference_time_s for r in successful) / len(successful)
                success_rate = len(successful) / len(model_results) * 100
                params = successful[0].parameters
                model_name = successful[0].model_name
            else:
                avg_tps = avg_ttft = avg_time = 0
                success_rate = 0
                params = "Unknown"
                model_name = model_id

            report.append(
                f"| {model_name} | {params} | {avg_tps:.1f} | {avg_ttft:.1f} | "
                f"{avg_time:.2f} | {success_rate:.0f}% |"
            )

        report.append("\n## Response Quality Samples\n")

        # Show sample responses
        for model_id, model_results in results.items():
            successful = [r for r in model_results if r.success]
            if successful:
                report.append(f"\n### {successful[0].model_name}\n")

                # Show first response
                first = successful[0]
                report.append(f"**Prompt:** {first.prompt}\n")
                report.append(f"**Response:**")
                report.append(f"```")
                report.append(first.response[:500])
                report.append(f"```\n")
                report.append(f"*Performance: {first.tokens_per_second:.1f} tokens/s, "
                           f"{first.time_to_first_token_ms:.1f}ms TTFT*\n")

        return "\n".join(report)

    def save_results(self, filename: str = "model_test_results.json"):
        """Save all test results to JSON"""
        output = {
            'timestamp': datetime.now().isoformat(),
            'total_tests': len(self.results),
            'results': [r.to_dict() for r in self.results]
        }

        with open(filename, 'w') as f:
            json.dump(output, f, indent=2)

        print(f"\n✓ Results saved to {filename}")


async def main():
    """Main execution"""
    import sys

    if not MODAL_AVAILABLE:
        print("Error: Modal SDK not installed")
        print("Install with: pip install modal")
        return

    catalog = ModelCatalog()
    tester = ModalModelTester()

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "list":
            # List models for GPU type
            gpu_type = sys.argv[2] if len(sys.argv) > 2 else "a10g"
            models = catalog.get_models_for_gpu(gpu_type)

            print(f"\n{'='*60}")
            print(f"Models compatible with {gpu_type.upper()}")
            print(f"Total: {len(models)}")
            print(f"{'='*60}\n")

            for model in models:
                print(f"• {model['name']} ({model['parameters']})")
                print(f"  HF: {model['hf_id']}")
                print(f"  VRAM: {model['vram_required_gb']}GB")
                print(f"  Quality: {model['quality_tier']}")
                print(f"  Use: {model['use_case']}")
                print()

        elif command == "recommended":
            # Show recommended models
            gpu_type = sys.argv[2] if len(sys.argv) > 2 else "a10g"
            models = catalog.get_recommended_models_for_gpu(gpu_type, limit=10)

            print(f"\n{'='*60}")
            print(f"Top Recommended Models for {gpu_type.upper()}")
            print(f"{'='*60}\n")

            for i, model in enumerate(models, 1):
                expected_tps = model.get('expected_tps', {}).get(gpu_type, 'N/A')
                print(f"{i}. {model['name']} ({model['parameters']})")
                print(f"   Quality: {model['quality_tier']} | Expected TPS: {expected_tps}")
                print(f"   {model['use_case']}")
                print()

        elif command == "test":
            # Test single model
            if len(sys.argv) < 4:
                print("Usage: python model_testing_suite.py test <model_hf_id> <gpu_type>")
                return

            model_id = sys.argv[2]
            gpu_type = sys.argv[3]

            prompts = catalog.get_test_prompts(['instruction_following', 'reasoning'])[:2]
            results = tester.test_single_model(model_id, gpu_type, prompts)

            tester.save_results(f"test_{model_id.replace('/', '_')}_{gpu_type}.json")

        elif command == "compare":
            # Compare models
            if len(sys.argv) < 3:
                print("Usage: python model_testing_suite.py compare <gpu_type> [model_ids...]")
                return

            gpu_type = sys.argv[2]

            if len(sys.argv) > 3:
                model_ids = sys.argv[3:]
            else:
                # Use recommended models
                recommended = catalog.get_recommended_models_for_gpu(gpu_type, limit=3)
                model_ids = [m['hf_id'] for m in recommended]

            results = tester.compare_models_on_gpu(model_ids, gpu_type)

            report = tester.generate_comparison_report(results)
            with open(f"model_comparison_{gpu_type}.md", 'w') as f:
                f.write(report)

            print(f"\n✓ Report saved to model_comparison_{gpu_type}.md")
            tester.save_results(f"model_comparison_{gpu_type}.json")

        else:
            print(f"Unknown command: {command}")
            print("Available commands: list, recommended, test, compare")

    else:
        # Show help
        print("""
        Model Testing Suite - Help

        Commands:
          list <gpu_type>                  - List all compatible models
          recommended <gpu_type>           - Show top recommended models
          test <model_id> <gpu_type>       - Test single model
          compare <gpu_type> [model_ids]   - Compare models

        Examples:
          python model_testing_suite.py list a10g
          python model_testing_suite.py recommended l4
          python model_testing_suite.py test TinyLlama/TinyLlama-1.1B-Chat-v1.0 t4
          python model_testing_suite.py compare a10g
          python model_testing_suite.py compare a100 meta-llama/Llama-2-13b-chat-hf mistralai/Mistral-7B-Instruct-v0.2

        GPU Types: t4, a10g, l4, a100-40gb, a100, h100
        """)


if __name__ == "__main__":
    asyncio.run(main())
