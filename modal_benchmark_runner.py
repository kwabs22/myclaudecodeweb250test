"""
Real Modal GPU Benchmark Runner
Uses actual Modal infrastructure to run performance tests
"""

import os
import time
import json
from typing import Dict, Any, List
import asyncio

# Check if modal is available
try:
    import modal
    MODAL_AVAILABLE = True
except ImportError:
    MODAL_AVAILABLE = False
    print("Warning: Modal not installed. Install with: pip install modal")


class ModalGPUBenchmarkRunner:
    """Run real benchmarks on Modal GPU infrastructure"""

    def __init__(self):
        if not MODAL_AVAILABLE:
            raise ImportError("Modal SDK is required. Install with: pip install modal")

        self.app = modal.App("gpu-benchmark-suite")

    def create_benchmark_function(self, gpu_type: str = "any"):
        """Create a Modal function with specified GPU"""

        # Define container image with dependencies
        image = (
            modal.Image.debian_slim(python_version="3.11")
            .pip_install(
                "torch",
                "transformers",
                "accelerate",
                "numpy",
            )
        )

        @self.app.function(
            image=image,
            gpu=gpu_type,
            timeout=600,
            retries=0
        )
        def benchmark_inference(
            prompt: str,
            max_tokens: int = 100,
            model_name: str = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
        ) -> Dict[str, Any]:
            """
            Run inference benchmark on Modal GPU
            Returns detailed timing information
            """
            import torch
            from transformers import AutoTokenizer, AutoModelForCausalLM
            import time

            device = "cuda" if torch.cuda.is_available() else "cpu"

            print(f"Loading model: {model_name}")
            print(f"Device: {device}")

            # Track model loading time
            load_start = time.time()

            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float16 if device == "cuda" else torch.float32,
                device_map="auto"
            )

            load_time = time.time() - load_start

            # Prepare input
            inputs = tokenizer(prompt, return_tensors="pt").to(device)
            input_length = inputs.input_ids.shape[1]

            # Track TTFT (time to first token)
            inference_start = time.time()

            # Generate with timing
            with torch.no_grad():
                # First token
                outputs = model.generate(
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
                    temperature=0.7,
                    top_p=0.9,
                    pad_token_id=tokenizer.eos_token_id
                )

            total_gen_time = time.time() - gen_start
            output_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
            output_length = outputs.shape[1] - input_length

            # Calculate metrics
            tokens_per_second = output_length / total_gen_time if total_gen_time > 0 else 0
            inter_token_latency_ms = (total_gen_time / output_length * 1000) if output_length > 0 else 0

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
                'model': model_name,
                'gpu_info': gpu_info,
                'model_load_time_s': load_time,
                'time_to_first_token_ms': ttft_ms,
                'total_generation_time_s': total_gen_time,
                'tokens_per_second': tokens_per_second,
                'inter_token_latency_ms': inter_token_latency_ms,
                'input_length': input_length,
                'output_length': output_length,
                'output_text': output_text[:200],  # First 200 chars
                'device': device
            }

        return benchmark_inference

    def run_benchmark(
        self,
        gpu_type: str,
        prompt: str,
        max_tokens: int = 100,
        model_name: str = "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
        iterations: int = 3
    ) -> List[Dict[str, Any]]:
        """Run benchmark and return results"""

        print(f"\n{'='*60}")
        print(f"Modal GPU Benchmark")
        print(f"GPU: {gpu_type}")
        print(f"Model: {model_name}")
        print(f"Iterations: {iterations}")
        print(f"{'='*60}\n")

        benchmark_fn = self.create_benchmark_function(gpu_type)
        results = []

        with self.app.run():
            for i in range(iterations):
                print(f"Running iteration {i+1}/{iterations}...")
                try:
                    result = benchmark_fn.remote(
                        prompt=prompt,
                        max_tokens=max_tokens,
                        model_name=model_name
                    )
                    results.append(result)

                    print(f"  ✓ Tokens/s: {result['tokens_per_second']:.2f}")
                    print(f"  ✓ TTFT: {result['time_to_first_token_ms']:.2f}ms")

                except Exception as e:
                    print(f"  ✗ Error: {str(e)}")
                    results.append({
                        'success': False,
                        'error': str(e)
                    })

        return results

    def run_multi_gpu_comparison(
        self,
        gpu_types: List[str],
        prompt: str = "Explain machine learning in simple terms.",
        max_tokens: int = 100
    ) -> Dict[str, List[Dict[str, Any]]]:
        """Compare performance across multiple GPU types"""

        all_results = {}

        for gpu_type in gpu_types:
            print(f"\n\n{'='*60}")
            print(f"Testing GPU: {gpu_type}")
            print(f"{'='*60}")

            results = self.run_benchmark(
                gpu_type=gpu_type,
                prompt=prompt,
                max_tokens=max_tokens,
                iterations=3
            )

            all_results[gpu_type] = results

            # Brief pause between GPU types
            time.sleep(2)

        return all_results

    @staticmethod
    def analyze_results(results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze benchmark results and compute statistics"""
        import statistics

        successful = [r for r in results if r.get('success', False)]

        if not successful:
            return {'error': 'No successful runs'}

        tps_values = [r['tokens_per_second'] for r in successful]
        ttft_values = [r['time_to_first_token_ms'] for r in successful]

        analysis = {
            'total_runs': len(results),
            'successful_runs': len(successful),
            'success_rate': len(successful) / len(results) * 100,
            'tokens_per_second': {
                'mean': statistics.mean(tps_values),
                'median': statistics.median(tps_values),
                'min': min(tps_values),
                'max': max(tps_values),
                'stdev': statistics.stdev(tps_values) if len(tps_values) > 1 else 0
            },
            'time_to_first_token_ms': {
                'mean': statistics.mean(ttft_values),
                'median': statistics.median(ttft_values),
                'min': min(ttft_values),
                'max': max(ttft_values),
                'stdev': statistics.stdev(ttft_values) if len(ttft_values) > 1 else 0
            },
            'gpu_info': successful[0].get('gpu_info', {}),
            'model': successful[0].get('model', 'unknown')
        }

        return analysis

    @staticmethod
    def print_analysis(analysis: Dict[str, Any], gpu_type: str):
        """Print formatted analysis"""
        print(f"\n{'='*60}")
        print(f"ANALYSIS: {gpu_type}")
        print(f"{'='*60}")

        if 'error' in analysis:
            print(f"Error: {analysis['error']}")
            return

        print(f"\nSuccess Rate: {analysis['success_rate']:.1f}%")
        print(f"Successful Runs: {analysis['successful_runs']}/{analysis['total_runs']}")

        print(f"\nTokens per Second:")
        print(f"  Mean:   {analysis['tokens_per_second']['mean']:.2f}")
        print(f"  Median: {analysis['tokens_per_second']['median']:.2f}")
        print(f"  Min:    {analysis['tokens_per_second']['min']:.2f}")
        print(f"  Max:    {analysis['tokens_per_second']['max']:.2f}")
        print(f"  StdDev: {analysis['tokens_per_second']['stdev']:.2f}")

        print(f"\nTime to First Token (ms):")
        print(f"  Mean:   {analysis['time_to_first_token_ms']['mean']:.2f}")
        print(f"  Median: {analysis['time_to_first_token_ms']['median']:.2f}")
        print(f"  Min:    {analysis['time_to_first_token_ms']['min']:.2f}")
        print(f"  Max:    {analysis['time_to_first_token_ms']['max']:.2f}")

        if analysis.get('gpu_info'):
            gpu_info = analysis['gpu_info']
            print(f"\nGPU Information:")
            print(f"  Name: {gpu_info.get('name', 'N/A')}")
            print(f"  Memory Allocated: {gpu_info.get('memory_allocated_gb', 0):.2f} GB")
            print(f"  Max Memory: {gpu_info.get('max_memory_allocated_gb', 0):.2f} GB")

        print(f"{'='*60}\n")


def main():
    """Main execution"""
    import sys

    if not MODAL_AVAILABLE:
        print("Error: Modal SDK not installed")
        print("Install with: pip install modal")
        return

    runner = ModalGPUBenchmarkRunner()

    # Parse command line arguments
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "single":
            # Single GPU test
            gpu_type = sys.argv[2] if len(sys.argv) > 2 else "any"
            results = runner.run_benchmark(
                gpu_type=gpu_type,
                prompt="Explain quantum computing in simple terms.",
                max_tokens=150,
                iterations=5
            )

            analysis = runner.analyze_results(results)
            runner.print_analysis(analysis, gpu_type)

            # Save results
            with open(f"modal_benchmark_{gpu_type}.json", 'w') as f:
                json.dump({
                    'gpu_type': gpu_type,
                    'results': results,
                    'analysis': analysis
                }, f, indent=2)

        elif command == "compare":
            # Compare multiple GPUs
            gpu_types = sys.argv[2:] if len(sys.argv) > 2 else ["any", "t4", "a10g"]

            all_results = runner.run_multi_gpu_comparison(
                gpu_types=gpu_types,
                prompt="Write a detailed explanation of neural networks.",
                max_tokens=200
            )

            # Analyze and print each
            print("\n\n" + "="*60)
            print("COMPARISON SUMMARY")
            print("="*60)

            comparison_table = []
            for gpu_type, results in all_results.items():
                analysis = runner.analyze_results(results)
                runner.print_analysis(analysis, gpu_type)

                if 'error' not in analysis:
                    comparison_table.append({
                        'gpu': gpu_type,
                        'tps': analysis['tokens_per_second']['mean'],
                        'ttft': analysis['time_to_first_token_ms']['mean']
                    })

            # Print comparison table
            print("\nComparison Table:")
            print(f"{'GPU':<15} {'Tokens/s':<15} {'TTFT (ms)':<15}")
            print("-" * 45)
            for row in sorted(comparison_table, key=lambda x: x['tps'], reverse=True):
                print(f"{row['gpu']:<15} {row['tps']:<15.2f} {row['ttft']:<15.2f}")

            # Save all results
            with open("modal_benchmark_comparison.json", 'w') as f:
                json.dump(all_results, f, indent=2)

        else:
            print(f"Unknown command: {command}")
            print("Available commands: single [gpu_type], compare [gpu_types...]")

    else:
        # Default: quick test
        print("Running quick benchmark test on 'any' GPU...")
        results = runner.run_benchmark(
            gpu_type="any",
            prompt="Hello, how are you?",
            max_tokens=50,
            iterations=3
        )

        analysis = runner.analyze_results(results)
        runner.print_analysis(analysis, "any")


if __name__ == "__main__":
    print("""
    ╔════════════════════════════════════════════════════════╗
    ║      Real Modal GPU Benchmark Runner                   ║
    ║   Run actual inference tests on Modal infrastructure   ║
    ╚════════════════════════════════════════════════════════╝

    Requirements:
      - Modal SDK installed (pip install modal)
      - Modal authentication configured (modal token set)

    Usage:
      python modal_benchmark_runner.py                    # Quick test
      python modal_benchmark_runner.py single [gpu]       # Single GPU
      python modal_benchmark_runner.py compare [gpus...]  # Compare GPUs

    Examples:
      python modal_benchmark_runner.py single a100
      python modal_benchmark_runner.py compare t4 a10g a100
      python modal_benchmark_runner.py compare any t4 l4 a10g a100

    Available GPU types:
      - any       (Modal selects available GPU)
      - t4        (NVIDIA T4)
      - a10g      (NVIDIA A10G)
      - l4        (NVIDIA L4)
      - a100      (NVIDIA A100 80GB)
      - a100-40gb (NVIDIA A100 40GB)
      - h100      (NVIDIA H100)
    """)

    main()
