# GPU Benchmarking Guide

Complete guide to benchmarking Modal GPU performance against industry standards.

## 🎯 Overview

This benchmarking suite helps you:
- **Measure real performance** of Modal GPUs
- **Compare** different GPU types (T4, A10G, L4, A100, H100)
- **Validate** against industry benchmarks
- **Optimize** your GPU selection for cost/performance

## 📊 Key Metrics Measured

### 1. Tokens per Second (TPS)
- **What**: Number of output tokens generated per second
- **Why**: Primary throughput metric
- **Good values**:
  - H100: 150+ TPS
  - A100: 90-100 TPS
  - L4: 50-60 TPS
  - T4: 25-35 TPS

### 2. Time to First Token (TTFT)
- **What**: Latency until first token is generated (ms)
- **Why**: User-perceived responsiveness
- **Good values**:
  - H100: <50ms
  - A100: 50-70ms
  - L4: 70-90ms
  - T4: 100-150ms

### 3. Inter-token Latency
- **What**: Average time between consecutive tokens
- **Why**: Streaming smoothness
- **Good values**: Lower is better, typically 5-20ms for modern GPUs

### 4. Total Inference Time
- **What**: Complete generation time for the request
- **Why**: End-to-end performance
- **Formula**: `Total Time = TTFT + (num_tokens × inter-token latency)`

## 🚀 Quick Start

### Run a Quick Benchmark

```bash
python benchmark_modal.py quick
```

This runs a fast test to verify your setup.

### Test Specific GPU

```bash
python benchmark_modal.py gpu a100
```

Tests Modal A100 GPU with multiple benchmark scenarios.

### Compare GPUs

```bash
python benchmark_modal.py compare a100 t4 l4
```

Runs the same test on multiple GPUs and compares results.

## 🔬 Using the Real Modal Runner

The `modal_benchmark_runner.py` script runs **actual inference** on Modal's infrastructure.

### Prerequisites

```bash
# Install Modal SDK
pip install modal

# Authenticate with Modal
modal token set --token-id YOUR_TOKEN_ID --token-secret YOUR_TOKEN_SECRET
```

### Single GPU Test

```bash
python modal_benchmark_runner.py single a100
```

This will:
1. Deploy a Modal function with A100 GPU
2. Load TinyLlama model (1.1B params)
3. Run 5 inference iterations
4. Measure detailed performance metrics
5. Save results to `modal_benchmark_a100.json`

### Compare Multiple GPUs

```bash
python modal_benchmark_runner.py compare t4 a10g a100
```

Runs identical tests across multiple GPU types and generates comparison table.

## 📈 Understanding Results

### Sample Output

```
=== Benchmark Results ===
GPU: a100
Model: TinyLlama/TinyLlama-1.1B-Chat-v1.0

Performance Metrics:
  Tokens/Second: 87.45
  Time to First Token: 52.30 ms
  Inter-token Latency: 11.43 ms
  Total Inference Time: 1.145 s

Statistics (5 iterations):
  Mean Latency: 1145.23 ms
  Median Latency: 1138.50 ms
  P95 Latency: 1167.80 ms
  P99 Latency: 1167.80 ms
  Success Rate: 100.0%

Comparison to Reference:
  Reference TPS: 100.00
  Measured TPS: 87.45
  Performance: 87.5% - SLOWER
```

### Interpreting Performance

**✅ Good Performance Indicators:**
- TPS within 80-120% of reference
- Consistent latencies (low standard deviation)
- 100% success rate
- Low P95/P99 latencies

**⚠️ Warning Signs:**
- TPS < 70% of reference (possible cold start or network issues)
- High latency variance (inconsistent performance)
- Success rate < 95%
- P99 latency >> P95 latency (outliers)

## 🎮 Benchmark Tests Explained

### Quick Test
- **Purpose**: Fast validation
- **Tokens**: 50
- **Iterations**: 3
- **Use when**: Testing setup, debugging

### Standard Test
- **Purpose**: Typical workload
- **Tokens**: 256
- **Iterations**: 10
- **Use when**: Comparing GPUs, production planning

### Throughput Test
- **Purpose**: Max throughput measurement
- **Tokens**: 500
- **Iterations**: 5
- **Use when**: Optimizing for batch processing

### Latency Test
- **Purpose**: Minimum latency measurement
- **Tokens**: 10
- **Iterations**: 20
- **Use when**: Optimizing for responsiveness

### Stress Test
- **Purpose**: Large context handling
- **Tokens**: 1000
- **Iterations**: 3
- **Use when**: Testing long-form generation

## 🔧 Configuration

### Customizing Benchmarks

Edit `benchmark_config.json`:

```json
{
  "benchmark_tests": {
    "my_custom_test": {
      "description": "Custom benchmark for my use case",
      "prompt": "Your custom prompt here",
      "max_tokens": 300,
      "iterations": 5
    }
  }
}
```

### GPU Types Available on Modal

| GPU Type | Modal Flag | VRAM | Best For |
|----------|-----------|------|----------|
| Any | `"any"` | Varies | Development, fallback |
| T4 | `"t4"` | 16GB | Budget, small models |
| A10G | `"a10g"` | 24GB | Balanced workloads |
| L4 | `"l4"` | 24GB | Cost-effective inference |
| A100 40GB | `"a100-40gb"` | 40GB | Medium models |
| A100 80GB | `"a100"` | 80GB | Large models |
| H100 | `"h100"` | 80GB | Maximum performance |

## 📊 Using Gradio Interface

### Launch with Benchmarks

```bash
python gradio_planning_interface.py
```

Navigate to the **GPU Benchmarks** tab to:
1. Run quick benchmarks
2. Compare multiple GPUs
3. View reference benchmarks
4. See detailed metrics

## 💡 Optimization Tips

### 1. GPU Selection
- **Development**: Use `"any"` or `"t4"` for cost savings
- **Production**: Choose based on model size
  - <7B params: T4 or A10G
  - 7-13B params: L4 or A10G
  - 13-30B params: A100 40GB
  - 30-70B params: A100 80GB
  - 70B+ params: H100 or multiple GPUs

### 2. Model Optimization
- Use **quantization** (INT8, INT4) for faster inference
- Enable **FlashAttention** for long contexts
- Consider **model distillation** for smaller variants

### 3. Batch Processing
- Group requests when possible
- Larger batches = better GPU utilization
- Trade-off with latency requirements

### 4. Cold Start Mitigation
- Use Modal's **keep_warm** parameter
- Pre-load models with container images
- Consider dedicated deployments for critical paths

## 🔍 Troubleshooting

### Slow Performance

**Possible causes:**
- Cold start (first request loads model)
- Network latency
- CPU bottleneck in preprocessing
- Insufficient GPU memory

**Solutions:**
```python
@app.function(
    gpu="a100",
    keep_warm=1,  # Keep container warm
    timeout=300,
    container_idle_timeout=120
)
```

### Inconsistent Results

**Possible causes:**
- Variable network conditions
- GPU sharing with other workloads
- Thermal throttling

**Solutions:**
- Run more iterations (10+)
- Use median instead of mean
- Test at different times

### Out of Memory Errors

**Solutions:**
- Use smaller model or quantized version
- Reduce batch size
- Upgrade to larger GPU
- Enable gradient checkpointing

## 📈 Performance Comparison

### Cost vs Performance

Based on typical Modal pricing and performance:

| GPU | $/hour | TPS | Cost per 1M tokens | Best Use Case |
|-----|--------|-----|-------------------|---------------|
| T4 | ~$0.60 | 30 | ~$5.50 | Development |
| A10G | ~$1.20 | 50 | ~$6.60 | Small models |
| L4 | ~$1.00 | 60 | ~$4.60 | **Best value** |
| A100 | ~$4.00 | 100 | ~$11.00 | Large models |
| H100 | ~$8.00 | 150 | ~$14.70 | Max speed |

*Prices and performance are approximate. Check Modal's current pricing.*

### Sweet Spots

- **Best Value**: L4 (good performance, low cost)
- **Best Performance**: H100 (fastest, but expensive)
- **Balanced**: A10G (middle ground)

## 📝 Benchmark Results Format

Results are saved as JSON:

```json
{
  "timestamp": "2025-01-15T10:30:00",
  "total_tests": 10,
  "results": [
    {
      "gpu_type": "a100",
      "model_name": "test-model",
      "test_name": "Standard Test",
      "tokens_per_second": 95.3,
      "time_to_first_token_ms": 48.5,
      "iterations": 10,
      "success_rate": 100.0
    }
  ]
}
```

## 🎓 Advanced Usage

### Custom Model Testing

Modify `modal_benchmark_runner.py`:

```python
results = runner.run_benchmark(
    gpu_type="a100",
    prompt="Your custom prompt",
    max_tokens=200,
    model_name="mistralai/Mistral-7B-Instruct-v0.2",
    iterations=5
)
```

### Continuous Benchmarking

Set up automated benchmarking:

```bash
# Run daily benchmarks
crontab -e
0 2 * * * cd /path/to/project && python benchmark_modal.py full >> benchmark_log.txt
```

### CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/benchmark.yml
name: GPU Benchmarks
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run benchmarks
        run: |
          pip install -r requirements.txt
          python benchmark_modal.py full
      - name: Upload results
        uses: actions/upload-artifact@v2
        with:
          name: benchmark-results
          path: benchmark_results.json
```

## 🔗 Resources

- [Modal Documentation](https://modal.com/docs)
- [Artificial Analysis Benchmarks](https://artificialanalysis.ai/benchmarks/hardware)
- [HuggingFace Model Hub](https://huggingface.co/models)

## 📞 Support

Having issues with benchmarking?

1. Check Modal authentication: `modal token check`
2. Verify GPU availability: `modal gpu list`
3. Review error logs in benchmark output
4. Try with `gpu="any"` first to test connectivity

## 🎯 Next Steps

1. **Run your first benchmark**: `python benchmark_modal.py quick`
2. **Compare GPUs**: Test 2-3 GPU types for your use case
3. **Analyze results**: Look at TPS and cost per token
4. **Choose optimal GPU**: Balance performance and cost
5. **Production deployment**: Use selected GPU in your app

Happy benchmarking! 🚀
