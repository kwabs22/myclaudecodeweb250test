# What's New in 2025 Model Catalog

## 🚀 Major Updates

### New GPUs Added

**NVIDIA B200 (Blackwell Architecture)**
- **VRAM**: 192GB (2.4x more than H100)
- **Performance**: 2.5x faster than H100 for LLM inference
- **Key Feature**: Native FP4 support for ultra-efficient quantization
- **Best For**: 405B models, multi-model serving, maximum capacity
- **Expected TPS**: 200+ for 7B, 60-80 for 70B, 25-30 for 405B

**NVIDIA GB200 Grace Blackwell Superchip**
- **VRAM**: 192GB unified memory
- **Architecture**: Integrated Grace CPU + Blackwell GPU
- **Performance**: 30x improvement for large language models
- **Best For**: Training, largest models (trillion parameters)
- **Use Case**: Multi-trillion parameter models, research

**NVIDIA L40S**
- **VRAM**: 48GB (2x L4)
- **Architecture**: Ada Lovelace
- **Best For**: 30-70B models without needing A100

### Top New Models

#### Qwen 2.5 Series (September 2024) ⭐⭐⭐
**Game changer!** Often outperforms much larger models.

| Model | Size | Context | Highlights |
|-------|------|---------|------------|
| **Qwen2.5-72B** | 72B | 128K | **Best open-source model**, rivals GPT-4 |
| Qwen2.5-32B | 32B | 128K | Competitive with 70B models |
| Qwen2.5-14B | 14B | 128K | Excellent mid-size |
| Qwen2.5-7B | 7B | 128K | **Best 7B model available** |
| Qwen2.5-3B | 3B | 128K | Excellent small model |
| Qwen2.5-1.5B | 1.5B | 128K | Best tiny model |
| Qwen2.5-0.5B | 0.5B | 32K | Ultra-fast edge deployment |

**Why Qwen2.5 is Special:**
- 128K context (vs 8-32K for most)
- Exceptional multilingual support (29 languages)
- Outstanding code generation
- Strong math and reasoning
- Competitive with much larger models

#### DeepSeek-V3 (December 2024) ⭐⭐⭐
**State-of-the-art MoE model**

- **Size**: 671B parameters (only 37B active per token)
- **Context**: 128K
- **Performance**: Rivals GPT-4, best open-source MoE
- **Efficiency**: MoE architecture makes it economical
- **Expected TPS**: 35 on H100, 70 on B200

#### Llama 3 Series Updates

**Llama 3.3-70B (December 2024)**
- Latest Llama release
- Improved over 3.1
- 128K context
- Better instruction following

**Llama 3.2 (September 2024)**
- Llama-3.2-1B: Smallest Llama, 128K context
- Llama-3.2-3B: Excellent small model
- Focus on efficiency and mobile deployment

**Llama 3.1-405B (July 2024)**
- Largest open-source model from Meta
- GPT-4 class performance
- Requires B200 or multi-GPU H100
- FP8 support for efficiency

#### Gemma 2 Series (June 2024)
- **Gemma-2-27B**: Google's largest, excellent quality
- **Gemma-2-9B**: Punches above its weight, competitive with 27B models
- **Gemma-2-2B**: Improved small model

#### Code Specialists

**Qwen2.5-Coder-32B (November 2024)** ⭐
- **Best open-source code model**
- Outperforms GPT-4 on coding tasks
- 128K context
- Supports 92 programming languages

**DeepSeek-Coder-V2-236B (June 2024)**
- 236B total, 21B active (MoE)
- 160K context (!!)
- Advanced code generation
- Fill-in-middle support

#### RAG Specialists

**Command R+ 104B (August 2024)**
- Specialized for RAG applications
- 128K context
- Grounded generation
- Multilingual (10 languages)

**Command R 35B (August 2024)**
- Mid-size RAG specialist
- 128K context
- Excellent for retrieval tasks

### Performance Expectations Updated

#### 7-9B Models on Different GPUs

| Model | T4 | L4 | A100 | H100 | B200 |
|-------|----|----|------|------|------|
| Qwen2.5-7B | 30 | 62 | 100 | 140 | 220 |
| Llama-3.1-8B | - | 58 | 95 | 135 | 210 |
| Gemma-2-9B | - | 55 | 92 | 130 | 205 |

#### 70B Models

| Model | H100 | B200 | GB200 |
|-------|------|------|-------|
| Qwen2.5-72B | 32 | 65 | - |
| Llama-3.3-70B | 32 | 62 | - |
| Llama-3.1-70B | 30 | 60 | - |

#### Ultra-Large Models (120B+)

| Model | H100 | B200 | GB200 |
|-------|------|------|-------|
| DeepSeek-V3 (671B MoE) | 35 | 70 | 120 |
| Llama-3.1-405B (FP8) | - | 25 | 45 |
| Nemotron-4-340B | - | - | 30 |

### Key Trends

1. **Context Length Explosion**
   - Standard is now 128K (vs 4-8K before)
   - Some models support 160K+
   - Long context is the new normal

2. **MoE Dominance**
   - DeepSeek-V3: 671B total, only 37B active
   - More efficient than dense models
   - Better quality per active parameter

3. **Quantization Improvements**
   - FP8 native support on H100/B200
   - FP4 support on B200
   - AWQ/GPTQ enable 72B on single A100

4. **Specialized Models**
   - Math: Qwen2.5-Math-72B
   - Code: Qwen2.5-Coder-32B
   - RAG: Command R/R+
   - Multilingual: All Qwen models

## 🎯 Updated Recommendations

### Best Overall by GPU (2025)

| GPU | Best Model | TPS | Why |
|-----|-----------|-----|-----|
| **T4** | Qwen2.5-7B-GPTQ | 45 | Best 7B, quantized for T4 |
| **L4** | **Qwen2.5-7B** | **62** | **Best value: top 7B + L4 efficiency** ⭐ |
| **L40S** | Qwen2.5-14B | 70 | Excellent 14B on 48GB |
| **A100** | Qwen2.5-32B | 38 | 32B rivals 70B models |
| **H100** | Qwen2.5-72B-AWQ | 45 | Best model on single GPU |
| **B200** | DeepSeek-V3 | 70 | State-of-the-art MoE |
| **GB200** | Llama-3.1-405B | 45 | Largest model, GPT-4 class |

### By Use Case (2025)

**General Chat/Assistant**
- Budget: T4 + Qwen2.5-3B
- **Best Value: L4 + Qwen2.5-7B** ⭐
- Premium: B200 + DeepSeek-V3

**Code Generation**
- Budget: T4 + Qwen2.5-Coder-7B (GPTQ)
- Best: A100 + Qwen2.5-Coder-32B
- Maximum: B200 + DeepSeek-Coder-V2-236B

**Long Context (100K+ tokens)**
- Qwen2.5-7B (128K)
- Llama-3.1-8B (128K)
- DeepSeek-Coder-V2 (160K!)

**Mathematics**
- Qwen2.5-Math-72B (best math reasoning)

**RAG Applications**
- Command R 35B
- Command R+ 104B

**Multilingual**
- Qwen2.5 series (29 languages)
- Command R/R+ (10 languages)

### What Changed from Old Recommendations?

**OLD (2024):**
- Best 7B: Mistral-7B-Instruct
- Best GPU: L4 + Mistral-7B
- Context: 32K was "long"
- Largest practical: 70B

**NEW (2025):**
- Best 7B: **Qwen2.5-7B** (significantly better)
- Best GPU: **L4 + Qwen2.5-7B** (same GPU, better model)
- Context: **128K is standard**
- Largest practical: **405B on B200**, **671B MoE**

## 📊 Performance Comparison: Old vs New

### 7B Models Evolution

| Metric | Mistral-7B (2023) | Qwen2.5-7B (2024) | Improvement |
|--------|------------------|-------------------|-------------|
| Context | 32K | 128K | 4x |
| Code Quality | Good | Excellent | +30% |
| Math | Good | Excellent | +40% |
| Multilingual | Limited | 29 languages | Massive |
| TPS on L4 | 60 | 62 | Similar |

**Winner: Qwen2.5-7B** - Much better quality, same speed

### GPU Evolution

| Metric | H100 | B200 | Improvement |
|--------|------|------|-------------|
| VRAM | 80GB | 192GB | 2.4x |
| Performance | Baseline | 2.5x | 2.5x |
| 7B TPS | 140 | 220 | 1.57x |
| 70B TPS | 32 | 65 | 2x |
| 405B Support | Multi-GPU | Single GPU | ✓ |

## 🔥 Top Picks for 2025

### 1. Qwen2.5-7B on L4 ⭐⭐⭐
**The New King of Value**
- **Why**: Best 7B model + efficient L4 GPU
- **Cost**: ~$720/month (24/7)
- **Performance**: 62 TPS, 128K context
- **Use**: General purpose, code, multilingual

### 2. Qwen2.5-72B-AWQ on H100 ⭐⭐⭐
**Best Single-GPU Model**
- **Why**: Rivals GPT-4, runs on 1x H100
- **Performance**: 45 TPS with quantization
- **Quality**: Best open-source model
- **Use**: When you need maximum quality

### 3. DeepSeek-V3 on B200 ⭐⭐⭐
**State-of-the-Art MoE**
- **Why**: 671B model, only 37B active
- **Performance**: 70 TPS on B200
- **Quality**: Rivals GPT-4, economical
- **Use**: Production inference at scale

### 4. Qwen2.5-Coder-32B on A100 ⭐⭐
**Best Code Model**
- **Why**: Outperforms GPT-4 on code
- **Performance**: 38 TPS
- **Context**: 128K
- **Use**: Code generation, debugging

### 5. Llama-3.2-3B on T4 ⭐
**Best Budget Option**
- **Why**: Meta quality, 128K context, cheap
- **Cost**: ~$432/month (24/7)
- **Performance**: 80 TPS
- **Use**: Development, testing, small apps

## 📈 Migration Guide

### If you're using...

**Mistral-7B → Qwen2.5-7B**
- ✅ Similar speed, much better quality
- ✅ 4x longer context (32K → 128K)
- ✅ Better code, math, multilingual
- ⚠️ Different prompt format

**Llama-2-70B → Qwen2.5-72B**
- ✅ Better quality overall
- ✅ 32x longer context (4K → 128K)
- ✅ Can run on single H100 with AWQ
- ⚠️ Requires HuggingFace (no restrictions)

**Mixtral-8x7B → DeepSeek-V3**
- ✅ Much larger (671B vs 46B)
- ✅ Better quality
- ✅ More efficient (MoE)
- ⚠️ Requires H100 or B200

### Performance Multipliers

When upgrading GPUs for the same model:

| From | To | Speed Multiplier | Cost Multiplier |
|------|----|--------------------|-----------------|
| T4 | L4 | 2x | 1.7x |
| L4 | A100 | 1.6x | 4x |
| A100 | H100 | 1.5x | 2x |
| H100 | B200 | 2x | TBD |

## 🎓 Quick Start with 2025 Models

```bash
# List latest models for your GPU
python model_testing_suite.py list l4 --catalog model_catalog_2025.json

# Test Qwen2.5-7B (best 7B)
python model_testing_suite.py test Qwen/Qwen2.5-7B-Instruct l4

# Compare top 2025 models
python model_testing_suite.py compare l4 \
  Qwen/Qwen2.5-7B-Instruct \
  meta-llama/Llama-3.1-8B-Instruct \
  google/gemma-2-9b-it

# Generate updated summary
python generate_model_summary.py full --catalog model_catalog_2025.json
```

## 📚 Resources

- **Qwen2.5 Technical Report**: https://qwenlm.github.io/blog/qwen2.5/
- **DeepSeek-V3 Paper**: https://github.com/deepseek-ai/DeepSeek-V3
- **Llama 3 Models**: https://llama.meta.com/
- **Modal GPU Docs**: https://modal.com/docs/guide/gpu

---

**Summary**: The landscape has changed dramatically. Qwen2.5 series dominates across all sizes, 128K context is standard, and B200 enables 400B+ models on single GPUs. If you haven't updated since 2024, you're missing out on massive improvements! 🚀
