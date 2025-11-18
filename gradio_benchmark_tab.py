"""
Gradio Benchmark Tab Component
Add GPU benchmarking capabilities to the planning interface
"""

import gradio as gr
import asyncio
import json
from typing import Dict, Any, Tuple
from benchmark_modal import ModalBenchmark


class BenchmarkTab:
    """Benchmark tab for Gradio interface"""

    def __init__(self):
        self.benchmark = ModalBenchmark()
        self.current_results = []

    def create_tab(self) -> gr.Tab:
        """Create the benchmark tab UI"""

        with gr.Tab("GPU Benchmarks") as tab:
            gr.Markdown("""
            ## 🏎️ GPU Performance Benchmarking

            Test Modal GPU performance and compare against industry benchmarks.
            Measure tokens/second, latency, and throughput metrics.
            """)

            with gr.Row():
                with gr.Column(scale=1):
                    gr.Markdown("### Quick Benchmark")

                    gpu_select = gr.Dropdown(
                        choices=["any", "t4", "a10g", "l4", "a100", "a100-40gb", "h100"],
                        value="any",
                        label="GPU Type",
                        info="Select GPU to benchmark"
                    )

                    test_select = gr.Dropdown(
                        choices=["quick_test", "standard_test", "throughput_test", "latency_test"],
                        value="quick_test",
                        label="Benchmark Test",
                        info="Select benchmark type"
                    )

                    run_benchmark_btn = gr.Button("Run Benchmark", variant="primary")

                with gr.Column(scale=1):
                    gr.Markdown("### GPU Comparison")

                    gpu_list = gr.CheckboxGroup(
                        choices=["any", "t4", "a10g", "l4", "a100", "h100"],
                        value=["any", "t4"],
                        label="GPUs to Compare",
                        info="Select multiple GPUs"
                    )

                    compare_btn = gr.Button("Compare GPUs", variant="secondary")

            with gr.Row():
                benchmark_output = gr.Textbox(
                    label="Benchmark Results",
                    lines=15,
                    interactive=False
                )

            with gr.Row():
                with gr.Column():
                    metric_tps = gr.Textbox(
                        label="Tokens/Second",
                        interactive=False
                    )
                with gr.Column():
                    metric_ttft = gr.Textbox(
                        label="Time to First Token (ms)",
                        interactive=False
                    )
                with gr.Column():
                    metric_latency = gr.Textbox(
                        label="Mean Latency (ms)",
                        interactive=False
                    )

            with gr.Accordion("Benchmark Details", open=False):
                detailed_results = gr.JSON(label="Detailed Results")

            with gr.Accordion("Reference Benchmarks", open=False):
                gr.Markdown("""
                ### Industry GPU Benchmarks (Reference)

                These are typical performance ranges for different GPU types:

                | GPU | Tokens/sec | TTFT (ms) | VRAM | Use Case |
                |-----|-----------|-----------|------|----------|
                | **H100** | ~150 | 35 | 80GB | High-end inference |
                | **A100 80GB** | ~100 | 50 | 80GB | Production workloads |
                | **A100 40GB** | ~90 | 55 | 40GB | Medium workloads |
                | **L4** | ~60 | 70 | 24GB | Cost-effective inference |
                | **A10G** | ~50 | 80 | 24GB | Balanced performance |
                | **T4** | ~30 | 120 | 16GB | Budget-friendly |

                *Note: Actual performance varies by model size, batch size, and workload.*
                """)

            # Event handlers
            run_benchmark_btn.click(
                fn=self.run_single_benchmark,
                inputs=[gpu_select, test_select],
                outputs=[benchmark_output, metric_tps, metric_ttft, metric_latency, detailed_results]
            )

            compare_btn.click(
                fn=self.compare_gpus,
                inputs=[gpu_list],
                outputs=[benchmark_output, detailed_results]
            )

        return tab

    def run_single_benchmark(
        self,
        gpu_type: str,
        test_name: str
    ) -> Tuple[str, str, str, str, Dict]:
        """Run a single benchmark test"""

        result = asyncio.run(self._run_benchmark_async(gpu_type, test_name))
        return result

    async def _run_benchmark_async(
        self,
        gpu_type: str,
        test_name: str
    ) -> Tuple[str, str, str, str, Dict]:
        """Async benchmark execution"""

        test_config = self.benchmark.config['benchmark_tests'].get(test_name)

        if not test_config:
            return (
                f"Error: Test '{test_name}' not found",
                "", "", "",
                {}
            )

        # Run benchmark
        result = await self.benchmark.run_single_benchmark(
            gpu_type=gpu_type,
            test_config=test_config
        )

        # Format output
        output_lines = [
            f"=== Benchmark Results ===",
            f"GPU: {result.gpu_type}",
            f"Test: {result.test_name}",
            f"",
            f"Performance Metrics:",
            f"  Tokens/Second: {result.tokens_per_second:.2f}",
            f"  Time to First Token: {result.time_to_first_token_ms:.2f} ms",
            f"  Inter-token Latency: {result.inter_token_latency_ms:.2f} ms",
            f"  Total Inference Time: {result.total_inference_time_s:.3f} s",
            f"",
            f"Statistics ({result.iterations} iterations):",
            f"  Mean Latency: {result.mean_latency_ms:.2f} ms",
            f"  Median Latency: {result.median_latency_ms:.2f} ms",
            f"  P95 Latency: {result.p95_latency_ms:.2f} ms",
            f"  P99 Latency: {result.p99_latency_ms:.2f} ms",
            f"  Success Rate: {result.success_rate:.1f}%",
        ]

        # Compare to reference
        comparison = self.benchmark.compare_to_reference(result)
        if 'error' not in comparison:
            output_lines.extend([
                f"",
                f"Comparison to Reference:",
                f"  Reference TPS: {comparison['reference_tps']:.2f}",
                f"  Measured TPS: {comparison['measured_tps']:.2f}",
                f"  Performance: {comparison['performance_pct']} - {comparison['verdict']}"
            ])

        output_text = "\n".join(output_lines)

        return (
            output_text,
            f"{result.tokens_per_second:.2f}",
            f"{result.time_to_first_token_ms:.2f}",
            f"{result.mean_latency_ms:.2f}",
            result.to_dict()
        )

    def compare_gpus(
        self,
        gpu_list: List[str]
    ) -> Tuple[str, Dict]:
        """Compare multiple GPUs"""

        result = asyncio.run(self._compare_gpus_async(gpu_list))
        return result

    async def _compare_gpus_async(
        self,
        gpu_list: List[str]
    ) -> Tuple[str, Dict]:
        """Async GPU comparison"""

        if not gpu_list:
            return "Error: Please select at least one GPU", {}

        # Run comparison
        results = await self.benchmark.compare_gpus(
            gpu_types=gpu_list,
            test_name="standard_test"
        )

        # Format output
        output_lines = [
            f"=== GPU Comparison Results ===",
            f"GPUs tested: {', '.join(gpu_list)}",
            f"Test: Standard Test (256 tokens)",
            f"",
            f"{'GPU':<15} {'Tokens/s':<12} {'TTFT (ms)':<12} {'Latency (ms)':<15}",
            f"{'-' * 60}"
        ]

        # Sort by performance
        sorted_results = sorted(
            results.items(),
            key=lambda x: x[1].tokens_per_second,
            reverse=True
        )

        for gpu_type, result in sorted_results:
            output_lines.append(
                f"{gpu_type:<15} {result.tokens_per_second:<12.2f} "
                f"{result.time_to_first_token_ms:<12.2f} "
                f"{result.mean_latency_ms:<15.2f}"
            )

        # Add winner
        if sorted_results:
            winner = sorted_results[0]
            output_lines.extend([
                f"",
                f"🏆 Winner: {winner[0]} ({winner[1].tokens_per_second:.2f} tokens/s)"
            ])

        output_text = "\n".join(output_lines)

        # Create detailed results dict
        detailed = {
            gpu: result.to_dict()
            for gpu, result in results.items()
        }

        return output_text, detailed


def add_benchmark_tab_to_interface(demo: gr.Blocks) -> gr.Blocks:
    """
    Add benchmark tab to existing Gradio interface

    Usage:
        demo = create_interface()
        demo = add_benchmark_tab_to_interface(demo)
    """

    benchmark_tab = BenchmarkTab()

    with demo:
        benchmark_tab.create_tab()

    return demo
