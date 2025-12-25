# Model Selection Guide for Modal GPUs

Complete guide to selecting and testing LLM models on Modal infrastructure.

## 🎯 Quick Selection by GPU Type

### T4 (16GB VRAM) - Budget Option

**Best For:** Development, testing, small production workloads

| Model | Size | Quality | TPS | Use Case |
|-------|------|---------|-----|----------|
| **TinyLlama-1.1B** | 1.1B | Basic | 80 | Ultra-fast, testing |
| **Phi-2** | 2.7B | Good | 60 | Code, reasoning, compact |
| **Gemma-2B** | 2B | Excellent | 65 | High quality small model |
| **Mistral-7B-GPTQ** | 7B (4-bit) | Excellent | 35 | Full quality, quantized |

**💡 Recommendation:** Start with **Phi-2** for development, upgrade to **Mistral-7B-GPTQ** for production.

---

### A10G (24GB VRAM) - Balanced Option

**Best For:** 7B models, production workloads, balanced cost/performance

| Model | Size | Quality | TPS | Use Case |
|-------|------|---------|-----|----------|
| **Mistral-7B-Instruct** | 7B | Excellent | 45 | General purpose, long context |
| **Llama-3-8B-Instruct** | 8B | Excellent | 40 | Latest Meta model |
| **CodeLlama-7B** | 7B | Excellent | 46 | Code generation specialist |
| **Gemma-7B** | 7B | Excellent | 42 | Google quality |

**💡 Recommendation:** **Mistral-7B-Instruct** for best all-around performance.

---

### L4 (24GB VRAM) - Best Value

**Best For:** Production 7B models, best price/performance ratio

| Model | Size | Quality | TPS | Use Case |
|-------|------|---------|-----|----------|
| **Mistral-7B-Instruct** | 7B | Excellent | 55 | **Best value** |
| **Llama-3-8B-Instruct** | 8B | Excellent | 50 | Latest from Meta |
| **CodeLlama-7B** | 7B | Excellent | 56 | Code generation |
| **Zephyr-7B-Beta** | 7B | Excellent | 54 | Aligned, safe responses |

**💡 Recommendation:** **L4 with Mistral-7B** is the sweet spot for most applications.

---

### A100 40GB (40GB VRAM) - High Performance

**Best For:** 13B models, quantized large models, fine-tuning

| Model | Size | Quality | TPS | Use Case |
|-------|------|---------|-----|----------|
| **Llama-2-13B-Chat** | 13B | Excellent | 58 | Higher quality than 7B |
| **Mixtral-8x7B-AWQ** | 46B (4-bit) | Exceptional | 45 | Top-tier quantized MoE |
| **Llama-2-70B-AWQ** | 70B (4-bit) | Exceptional | 25 | 70B on single GPU |

**💡 Recommendation:** **Llama-2-13B** for quality upgrade, **Mixtral-AWQ** for maximum capability.

---

### A100 80GB (80GB VRAM) - Maximum Capacity

**Best For:** Large models, multi-model serving, heavy workloads

| Model | Size | Quality | TPS | Use Case |
|-------|------|---------|-----|----------|
| **Mixtral-8x7B-Instruct** | 46B | Exceptional | 40 | Top open-source MoE |
| **Llama-2-70B-AWQ** | 70B (4-bit) | Exceptional | 28 | 70B quality, faster |
| **CodeLlama-34B** | 34B | Excellent | 30 | Advanced code generation |

**💡 Recommendation:** **Mixtral-8x7B** for best quality/speed balance at this tier.

---

### H100 (80GB VRAM) - Maximum Performance

**Best For:** Latency-critical applications, maximum throughput

| Model | Size | Quality | TPS | Use Case |
|-------|------|---------|-----|----------|
| **Mixtral-8x7B-Instruct** | 46B | Exceptional | 70 | Fastest MoE inference |
| **Llama-2-70B-AWQ** | 70B (4-bit) | Exceptional | 45 | 70B with low latency |

**💡 Recommendation:** Use H100 when latency is critical and budget allows.

---

## 📊 Model Categories Explained

### Tiny Models (<3B parameters)

**When to use:**
- Embedded systems or edge devices
- Extremely high throughput requirements
- Budget constraints
- Testing and development

**Best models:**
1. **Phi-2** (2.7B) - Best quality/size ratio
2. **Gemma-2B** - Google quality in tiny package
3. **TinyLlama-1.1B** - Fastest option

### Small Models (7-8B parameters)

**When to use:**
- Most production applications
- Balance of quality and cost
- General-purpose chatbots
- Content generation

**Best models:**
1. **Mistral-7B-Instruct** - Industry standard
2. **Llama-3-8B-Instruct** - Latest Meta model
3. **Gemma-7B** - Google quality
4. **CodeLlama-7B** - Code specialist

### Medium Models (13B parameters)

**When to use:**
- Need higher quality than 7B
- Complex reasoning tasks
- Professional applications
- Budget allows A100

**Best models:**
1. **Llama-2-13B-Chat** - Proven quality
2. **Vicuna-13B** - Community favorite

### Large Models (30B+ parameters)

**When to use:**
- Maximum quality requirements
- Complex tasks requiring deep reasoning
- Code generation at scale
- Enterprise applications

**Best models:**
1. **Mixtral-8x7B** (46B) - **Top recommendation**
2. **CodeLlama-34B** - Code specialist
3. **Llama-2-70B** - Maximum capability

---

## 🔧 Quantization Guide

### What is Quantization?

Quantization reduces model size by using lower-precision numbers, allowing larger models to fit on smaller GPUs with minimal quality loss.

### Quantization Types

| Type | Size Reduction | Quality Loss | Speed | Use When |
|------|----------------|--------------|-------|----------|
| **FP16** | Baseline | None | Baseline | VRAM available |
| **INT8** | ~50% | <5% | Faster | Good balance |
| **4-bit GPTQ** | ~75% | 5-10% | Much faster | Limited VRAM |
| **4-bit AWQ** | ~75% | 3-7% | Much faster | Better than GPTQ |

### Recommended Quantized Models

**7B models for T4:**
- Mistral-7B-GPTQ (6GB)
- Llama-3-8B-AWQ (7GB)

**13B models for A10G/L4:**
- Llama-2-13B-GPTQ (10GB)

**70B models for A100:**
- Llama-2-70B-AWQ (40GB)
- Mixtral-8x7B-AWQ (35GB)

---

## 🎯 Use Case Recommendations

### General Chat / Assistant

**Budget:** T4 + Phi-2
**Balanced:** L4 + Mistral-7B
**Premium:** A100 + Mixtral-8x7B

### Code Generation

**Budget:** T4 + Phi-2 (supports code)
**Balanced:** L4 + CodeLlama-7B
**Premium:** A100 + CodeLlama-34B

### Long Context (>8K tokens)

**Best options:**
- Mistral-7B (32K context)
- Mixtral-8x7B (32K context)
- CodeLlama variants (16K context)

### Content Generation

**Budget:** T4 + Gemma-2B
**Balanced:** L4 + Mistral-7B
**Premium:** A100 + Mixtral-8x7B

### Customer Support

**Requirements:** Fast, safe, accurate
**Recommendation:** L4 + Zephyr-7B-Beta (aligned model)

---

## 📈 Performance Expectations

### Tokens per Second by GPU

| Model Size | T4 | A10G | L4 | A100 | H100 |
|------------|----|----|----|----|-----|
| **1-3B** | 60-80 | 90-120 | 80-110 | 150+ | 200+ |
| **7B** | 22-35 | 40-46 | 50-56 | 85-91 | 120+ |
| **13B** | N/A | 25-35 | 32-42 | 55-60 | 80+ |
| **30B+** | N/A | N/A | N/A | 25-45 | 45-80 |

### Latency Expectations

| Model Size | TTFT (ms) | User Experience |
|------------|-----------|-----------------|
| **1-3B** | 20-40 | Instant |
| **7B** | 50-80 | Very fast |
| **13B** | 80-120 | Fast |
| **30B+** | 100-200 | Acceptable |

---

## 🧪 Testing Your Selection

### Quick Test

```bash
# List models for your GPU
python model_testing_suite.py list a10g

# See recommendations
python model_testing_suite.py recommended l4

# Test a specific model
python model_testing_suite.py test mistralai/Mistral-7B-Instruct-v0.2 l4
```

### Compare Multiple Models

```bash
# Compare top models on L4
python model_testing_suite.py compare l4

# Compare specific models
python model_testing_suite.py compare a100 \
  meta-llama/Llama-2-13b-chat-hf \
  mistralai/Mistral-7B-Instruct-v0.2
```

### Qualitative Testing

The testing suite automatically evaluates models on:

1. **Instruction Following** - How well it follows complex instructions
2. **Reasoning** - Logical problem-solving ability
3. **Code Generation** - Code quality and correctness
4. **Creativity** - Diverse and creative responses
5. **Long Context** - Handling long context windows
6. **Factual Accuracy** - Correctness of information
7. **Safety** - Appropriate refusals and safe responses
8. **Conversation** - Natural dialogue flow

---

## 💰 Cost Analysis

### Monthly Cost Estimates (24/7 usage)

Based on typical Modal pricing:

| GPU | $/hour | $/month | Best Model | Cost/1M tokens |
|-----|--------|---------|------------|----------------|
| **T4** | $0.60 | $432 | Mistral-7B-GPTQ | $4.80 |
| **A10G** | $1.20 | $864 | Mistral-7B | $6.60 |
| **L4** | $1.00 | $720 | Mistral-7B | $4.60 |
| **A100 40GB** | $3.50 | $2,520 | Llama-2-13B | $9.80 |
| **A100 80GB** | $4.00 | $2,880 | Mixtral-8x7B | $11.00 |
| **H100** | $8.00 | $5,760 | Mixtral-8x7B | $14.70 |

*Note: Use on-demand for development, reserved for production*

### Cost Optimization Tips

1. **Use quantized models** - Save 50-75% on GPU costs
2. **Choose L4** - Best price/performance for 7B models
3. **Batch requests** - Higher GPU utilization
4. **Scale to zero** - Modal's automatic scaling
5. **Start small** - T4 for dev, L4 for production

---

## 🚀 Quick Start Recommendations

### For Prototyping
**GPU:** T4
**Model:** Phi-2 (2.7B)
**Why:** Fast, cheap, good quality for testing

### For Production (Budget)
**GPU:** L4
**Model:** Mistral-7B-Instruct
**Why:** Best value, excellent quality, proven

### For Production (Premium)
**GPU:** A100 80GB
**Model:** Mixtral-8x7B-Instruct
**Why:** Top-tier quality, good speed, best open model

### For Code Generation
**GPU:** L4
**Model:** CodeLlama-7B-Instruct
**Why:** Specialized for code, fast, affordable

### For Maximum Quality
**GPU:** H100
**Model:** Mixtral-8x7B-Instruct
**Why:** Fastest inference for top-tier model

---

## 📚 Model Details

### Model Files Reference

All model details are in `model_catalog.json`:

```json
{
  "model_catalog": {
    "gpu_types": { ... },
    "models": {
      "tiny_models": { ... },
      "small_models_7b": { ... },
      "medium_models_13b": { ... },
      "large_models_30b_plus": { ... }
    },
    "qualitative_metrics": { ... }
  }
}
```

### Adding Custom Models

Edit `model_catalog.json` to add your models:

```json
{
  "name": "My-Custom-Model",
  "hf_id": "username/model-name",
  "parameters": "7B",
  "vram_required_gb": 16,
  "precision": "FP16",
  "context_length": 8192,
  "use_case": "Your use case",
  "expected_tps": {"l4": 50, "a100": 85},
  "quality_tier": "excellent"
}
```

---

## 🔍 Troubleshooting

### Model Won't Load

**Error:** Out of memory
- **Solution:** Use smaller model or quantized version
- **Solution:** Upgrade to GPU with more VRAM

**Error:** Model not found
- **Solution:** Check HuggingFace ID is correct
- **Solution:** May need HuggingFace token for gated models

### Slow Performance

**Issue:** TPS much lower than expected
- **Check:** Cold start (first request is slower)
- **Check:** Network latency to Modal
- **Solution:** Use keep_warm parameter

### Quality Issues

**Issue:** Poor quality responses
- **Check:** Are you using quantized version?
- **Check:** Temperature and sampling parameters
- **Solution:** Try different model or FP16 version

---

## 📖 Next Steps

1. **Review model catalog:** `cat model_catalog.json`
2. **List compatible models:** `python model_testing_suite.py list l4`
3. **Test recommended models:** `python model_testing_suite.py recommended l4`
4. **Run comparison:** `python model_testing_suite.py compare l4`
5. **Deploy to production:** Use best model from tests

## 🎓 Learning Resources

- **HuggingFace Model Hub:** https://huggingface.co/models
- **Modal Documentation:** https://modal.com/docs
- **Model Leaderboards:** https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard

---

**Ready to select your model!** Start with the recommendations above, then test and refine based on your specific needs. 🚀
