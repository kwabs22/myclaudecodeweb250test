"""
Modal GPU Benchmarking Suite
Measures performance metrics to compare against hardware benchmarks
"""

import json
import time
import asyncio
import statistics
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
import os


@dataclass
class BenchmarkResult:
    """Container for benchmark results"""
    gpu_type: str
    model_name: str
    test_name: str
    timestamp: str

    # Performance metrics
    tokens_per_second: float
    time_to_first_token_ms: float
    inter_token_latency_ms: float
    total_inference_time_s: float

    # Statistical data
    iterations: int
    mean_latency_ms: float
    median_latency_ms: float
    p95_latency_ms: float
    p99_latency_ms: float

    # Metadata
    prompt_length: int
    output_length: int
    success_rate: float
    errors: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def compare_to_reference(self, reference_tps: float) -> Dict[str, Any]:
        """Compare results to reference benchmark"""
        performance_ratio = self.tokens_per_second / reference_tps if reference_tps > 0 else 0

        return {
            'measured_tps': self.tokens_per_second,
            'reference_tps': reference_tps,
            'performance_ratio': performance_ratio,
            'performance_pct': f"{performance_ratio * 100:.1f}%",
            'verdict': 'FASTER' if performance_ratio > 1.0 else 'SLOWER' if performance_ratio < 1.0 else 'EQUAL'
        }


class ModalBenchmark:
    """Benchmark runner for Modal GPU performance"""

    def __init__(self, config_path: str = "benchmark_config.json"):
        """Initialize benchmark runner"""
        with open(config_path, 'r') as f:
            self.config = json.load(f)

        self.results: List[BenchmarkResult] = []

    def get_modal_gpu_types(self) -> List[str]:
        """Get list of available GPU types for Modal"""
        gpu_configs = self.config['reference_benchmarks']['gpu_configurations']
        return [cfg['modal_gpu_type'] for cfg in gpu_configs.values()]

    async def run_single_benchmark(
        self,
        gpu_type: str,
        test_config: Dict[str, Any],
        model_name: str = "test-model"
    ) -> BenchmarkResult:
        """Run a single benchmark test"""

        print(f"\n{'='*60}")
        print(f"Running: {test_config['description']}")
        print(f"GPU: {gpu_type} | Model: {model_name}")
        print(f"{'='*60}")

        iterations = test_config['iterations']
        prompt = test_config['prompt']
        max_tokens = test_config['max_tokens']

        # Timing data
        latencies = []
        ttft_times = []
        token_times = []
        successes = 0
        errors = []

        for i in range(iterations):
            try:
                print(f"  Iteration {i+1}/{iterations}...", end=' ')

                # Simulate benchmark execution
                # In real implementation, this would call Modal
                start_time = time.time()

                # TODO: Replace with actual Modal inference call
                result = await self._simulate_inference(
                    gpu_type=gpu_type,
                    prompt=prompt,
                    max_tokens=max_tokens
                )

                end_time = time.time()
                latency_ms = (end_time - start_time) * 1000

                latencies.append(latency_ms)
                ttft_times.append(result['ttft_ms'])
                token_times.append(result['inter_token_ms'])

                successes += 1
                print(f"✓ {latency_ms:.1f}ms")

            except Exception as e:
                errors.append(str(e))
                print(f"✗ {str(e)}")

        # Calculate statistics
        if latencies:
            sorted_latencies = sorted(latencies)
            mean_latency = statistics.mean(latencies)
            median_latency = statistics.median(latencies)
            p95_latency = sorted_latencies[int(len(sorted_latencies) * 0.95)] if len(sorted_latencies) > 1 else mean_latency
            p99_latency = sorted_latencies[int(len(sorted_latencies) * 0.99)] if len(sorted_latencies) > 1 else mean_latency

            avg_ttft = statistics.mean(ttft_times)
            avg_inter_token = statistics.mean(token_times)

            # Calculate tokens per second
            total_time_s = mean_latency / 1000
            tokens_per_second = max_tokens / total_time_s if total_time_s > 0 else 0
        else:
            mean_latency = median_latency = p95_latency = p99_latency = 0
            avg_ttft = avg_inter_token = 0
            tokens_per_second = 0

        success_rate = (successes / iterations) * 100 if iterations > 0 else 0

        result = BenchmarkResult(
            gpu_type=gpu_type,
            model_name=model_name,
            test_name=test_config['description'],
            timestamp=datetime.now().isoformat(),
            tokens_per_second=tokens_per_second,
            time_to_first_token_ms=avg_ttft,
            inter_token_latency_ms=avg_inter_token,
            total_inference_time_s=mean_latency / 1000,
            iterations=iterations,
            mean_latency_ms=mean_latency,
            median_latency_ms=median_latency,
            p95_latency_ms=p95_latency,
            p99_latency_ms=p99_latency,
            prompt_length=len(prompt),
            output_length=max_tokens,
            success_rate=success_rate,
            errors=errors
        )

        self.results.append(result)
        self._print_result_summary(result)

        return result

    async def _simulate_inference(
        self,
        gpu_type: str,
        prompt: str,
        max_tokens: int
    ) -> Dict[str, Any]:
        """
        Simulate inference for testing
        Replace this with actual Modal inference in production
        """
        # Simulate different GPU speeds
        gpu_speeds = {
            'h100': 0.005,      # 5ms per token (fastest)
            'a100': 0.008,      # 8ms per token
            'a100-40gb': 0.009, # 9ms per token
            'l4': 0.012,        # 12ms per token
            'a10g': 0.015,      # 15ms per token
            't4': 0.025,        # 25ms per token
            'any': 0.010        # 10ms per token (fallback)
        }

        time_per_token = gpu_speeds.get(gpu_type, 0.010)

        # Simulate TTFT (time to first token)
        ttft_ms = time_per_token * 1000 * 2  # First token takes ~2x longer
        await asyncio.sleep(ttft_ms / 1000)

        # Simulate token generation
        for _ in range(max_tokens):
            await asyncio.sleep(time_per_token)

        return {
            'ttft_ms': ttft_ms,
            'inter_token_ms': time_per_token * 1000,
            'total_tokens': max_tokens
        }

    def _print_result_summary(self, result: BenchmarkResult):
        """Print formatted result summary"""
        print(f"\n--- Results Summary ---")
        print(f"Tokens/sec:     {result.tokens_per_second:.2f}")
        print(f"TTFT:           {result.time_to_first_token_ms:.2f} ms")
        print(f"Inter-token:    {result.inter_token_latency_ms:.2f} ms")
        print(f"Total time:     {result.total_inference_time_s:.3f} s")
        print(f"Mean latency:   {result.mean_latency_ms:.2f} ms")
        print(f"P95 latency:    {result.p95_latency_ms:.2f} ms")
        print(f"Success rate:   {result.success_rate:.1f}%")
        print(f"----------------------")

    async def run_test_suite(
        self,
        gpu_type: str,
        test_names: Optional[List[str]] = None,
        model_name: str = "test-model"
    ) -> List[BenchmarkResult]:
        """Run a suite of benchmark tests"""

        tests = self.config['benchmark_tests']
        test_names = test_names or list(tests.keys())

        print(f"\n{'='*60}")
        print(f"BENCHMARK SUITE: {gpu_type}")
        print(f"Tests: {', '.join(test_names)}")
        print(f"{'='*60}")

        results = []
        for test_name in test_names:
            if test_name in tests:
                result = await self.run_single_benchmark(
                    gpu_type=gpu_type,
                    test_config=tests[test_name],
                    model_name=model_name
                )
                results.append(result)
                await asyncio.sleep(1)  # Brief pause between tests

        return results

    async def compare_gpus(
        self,
        gpu_types: List[str],
        test_name: str = "standard_test"
    ) -> Dict[str, BenchmarkResult]:
        """Compare different GPU types on the same test"""

        print(f"\n{'='*60}")
        print(f"GPU COMPARISON: {test_name}")
        print(f"GPUs: {', '.join(gpu_types)}")
        print(f"{'='*60}")

        test_config = self.config['benchmark_tests'][test_name]
        results = {}

        for gpu_type in gpu_types:
            result = await self.run_single_benchmark(
                gpu_type=gpu_type,
                test_config=test_config
            )
            results[gpu_type] = result

        # Print comparison table
        self._print_comparison_table(results)

        return results

    def _print_comparison_table(self, results: Dict[str, BenchmarkResult]):
        """Print comparison table for multiple GPU results"""
        print(f"\n{'='*60}")
        print("GPU COMPARISON TABLE")
        print(f"{'='*60}")
        print(f"{'GPU':<15} {'Tokens/s':<12} {'TTFT (ms)':<12} {'Latency (ms)':<15}")
        print(f"{'-'*60}")

        for gpu_type, result in results.items():
            print(f"{gpu_type:<15} {result.tokens_per_second:<12.2f} "
                  f"{result.time_to_first_token_ms:<12.2f} "
                  f"{result.mean_latency_ms:<15.2f}")

        print(f"{'='*60}\n")

    def compare_to_reference(
        self,
        result: BenchmarkResult
    ) -> Dict[str, Any]:
        """Compare result to reference benchmarks"""

        # Find matching GPU configuration
        gpu_configs = self.config['reference_benchmarks']['gpu_configurations']

        for config in gpu_configs.values():
            if config['modal_gpu_type'] == result.gpu_type:
                reference_tps = config['expected_tokens_per_sec']
                reference_ttft = config['expected_ttft_ms']

                comparison = result.compare_to_reference(reference_tps)
                comparison['reference_ttft_ms'] = reference_ttft
                comparison['measured_ttft_ms'] = result.time_to_first_token_ms
                comparison['ttft_ratio'] = reference_ttft / result.time_to_first_token_ms if result.time_to_first_token_ms > 0 else 0

                return comparison

        return {'error': 'No reference data found for this GPU type'}

    def save_results(self, filename: str = "benchmark_results.json"):
        """Save all results to JSON file"""
        output = {
            'timestamp': datetime.now().isoformat(),
            'total_tests': len(self.results),
            'results': [r.to_dict() for r in self.results]
        }

        with open(filename, 'w') as f:
            json.dump(output, f, indent=2)

        print(f"\n✓ Results saved to {filename}")

    def generate_report(self) -> str:
        """Generate markdown report of benchmark results"""

        report = []
        report.append("# Modal GPU Benchmark Report")
        report.append(f"\nGenerated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"\nTotal Tests: {len(self.results)}")
        report.append("\n## Results Summary\n")

        # Group by GPU type
        by_gpu = {}
        for result in self.results:
            if result.gpu_type not in by_gpu:
                by_gpu[result.gpu_type] = []
            by_gpu[result.gpu_type].append(result)

        for gpu_type, results in by_gpu.items():
            report.append(f"\n### {gpu_type.upper()}\n")
            report.append("| Test | Tokens/s | TTFT (ms) | Latency (ms) | Success % |")
            report.append("|------|----------|-----------|--------------|-----------|")

            for result in results:
                report.append(
                    f"| {result.test_name} | {result.tokens_per_second:.2f} | "
                    f"{result.time_to_first_token_ms:.2f} | {result.mean_latency_ms:.2f} | "
                    f"{result.success_rate:.1f}% |"
                )

        report.append("\n## Comparison to Reference Benchmarks\n")

        for result in self.results:
            comparison = self.compare_to_reference(result)
            if 'error' not in comparison:
                report.append(f"\n### {result.gpu_type} - {result.test_name}")
                report.append(f"- Measured: {comparison['measured_tps']:.2f} tokens/s")
                report.append(f"- Reference: {comparison['reference_tps']:.2f} tokens/s")
                report.append(f"- Performance: {comparison['performance_pct']} ({comparison['verdict']})")

        return "\n".join(report)


async def main():
    """Main benchmark execution"""
    import sys

    benchmark = ModalBenchmark()

    if len(sys.argv) > 1:
        mode = sys.argv[1]

        if mode == "quick":
            # Quick test on any GPU
            await benchmark.run_single_benchmark(
                gpu_type="any",
                test_config=benchmark.config['benchmark_tests']['quick_test']
            )

        elif mode == "gpu" and len(sys.argv) > 2:
            # Test specific GPU
            gpu_type = sys.argv[2]
            await benchmark.run_test_suite(gpu_type=gpu_type)

        elif mode == "compare":
            # Compare multiple GPUs
            gpu_types = sys.argv[2:] if len(sys.argv) > 2 else ["a100", "t4", "l4"]
            await benchmark.compare_gpus(gpu_types=gpu_types)

        elif mode == "full":
            # Run full benchmark suite
            gpu_types = benchmark.get_modal_gpu_types()
            for gpu_type in gpu_types:
                await benchmark.run_test_suite(gpu_type=gpu_type, test_names=["quick_test", "standard_test"])

        else:
            print(f"Unknown mode: {mode}")
            print("Available modes: quick, gpu <type>, compare [types...], full")
    else:
        # Default: quick test
        print("Running quick benchmark test...")
        await benchmark.run_single_benchmark(
            gpu_type="any",
            test_config=benchmark.config['benchmark_tests']['quick_test']
        )

    # Save and report
    if benchmark.results:
        benchmark.save_results()
        report = benchmark.generate_report()

        with open("benchmark_report.md", 'w') as f:
            f.write(report)

        print(f"\n✓ Report saved to benchmark_report.md")


if __name__ == "__main__":
    print("""
    ╔════════════════════════════════════════════════════════╗
    ║         Modal GPU Benchmark Suite                      ║
    ║    Compare performance against hardware benchmarks     ║
    ╚════════════════════════════════════════════════════════╝

    Usage:
      python benchmark_modal.py                    # Quick test
      python benchmark_modal.py quick              # Quick test
      python benchmark_modal.py gpu <type>         # Test specific GPU
      python benchmark_modal.py compare [types...] # Compare GPUs
      python benchmark_modal.py full               # Full suite

    Examples:
      python benchmark_modal.py gpu a100
      python benchmark_modal.py compare a100 h100 t4
      python benchmark_modal.py full
    """)

    asyncio.run(main())
