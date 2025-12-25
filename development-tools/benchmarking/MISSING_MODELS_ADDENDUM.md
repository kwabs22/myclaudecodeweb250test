# Missing Models Addendum - Chinese Models & Qwen-Coder Variants

## 🇨🇳 Missing: GLM-4 Series (Zhipu AI)

**GLM-4** is a major Chinese model family that was overlooked!

### GLM-4-9B-Chat
- **Size**: 9B parameters
- **Company**: Zhipu AI (智谱AI)
- **VRAM**: 20GB FP16
- **Context**: 128K
- **Quality**: Exceptional (competitive with Qwen2.5-7B)
- **Strengths**:
  - Bilingual (Chinese/English)
  - Strong reasoning
  - Function calling
  - Long context understanding
- **GPU Recommendation**: L4, A10G, A100
- **Expected TPS**:
  - L4: 52 TPS
  - A100: 88 TPS
  - H100: 125 TPS
- **HuggingFace**: `THUDM/glm-4-9b-chat`
- **Release**: June 2024

### GLM-4-9B-Chat-1M
- **Size**: 9B parameters
- **Context**: **1 MILLION tokens** 🤯
- **VRAM**: 20GB + attention optimization
- **Use Case**: Extreme long context, entire codebases
- **Quality**: Specialized for long-context retrieval
- **GPU**: A100, H100 (needs efficient attention)
- **HuggingFace**: `THUDM/glm-4-9b-chat-1m`

### CogVLM2 (GLM Vision)
- **Size**: 19B total (9B language + vision encoder)
- **Type**: Multi-modal (vision + language)
- **VRAM**: 40GB
- **Use Case**: Image understanding, OCR, VQA
- **GPU**: A100, H100
- **HuggingFace**: `THUDM/cogvlm2-llama3-chat-19B`

---

## 💻 Missing: Complete Qwen-Coder Series

I mentioned **Qwen2.5-Coder-32B** but missed the full lineup!

### Qwen2.5-Coder-0.5B-Instruct
- **Size**: 0.5B parameters
- **VRAM**: 2GB
- **Context**: 32K
- **Use Case**: **Smallest code model**, edge deployment, embedded
- **Expected TPS**:
  - T4: 250+ TPS
  - L4: 350+ TPS
- **Quality**: Good for simple tasks (fixing bugs, writing functions)
- **HuggingFace**: `Qwen/Qwen2.5-Coder-0.5B-Instruct`
- **Best For**: CLI tools, simple website features
- **Release**: November 2024

### Qwen2.5-Coder-1.5B-Instruct ⭐
- **Size**: 1.5B parameters
- **VRAM**: 4GB
- **Context**: 128K (!!)
- **Use Case**: **Smallest GOOD code model**, perfect for simple tasks
- **Expected TPS**:
  - T4: 150 TPS
  - L4: 200 TPS
- **Quality**: Excellent for 1.5B
- **Can Handle**:
  - Adding website features (bookmarks, forms)
  - Bug fixes
  - Simple refactoring
  - Script writing
- **HuggingFace**: `Qwen/Qwen2.5-Coder-1.5B-Instruct`
- **Best For**: **Adding bookmarks to website CLI coding** ✓
- **Release**: November 2024

### Qwen2.5-Coder-3B-Instruct
- **Size**: 3B parameters
- **VRAM**: 7GB
- **Context**: 128K
- **Use Case**: Small but powerful code model
- **Expected TPS**:
  - T4: 85 TPS
  - L4: 125 TPS
- **Quality**: Excellent, beats many 7B general models at coding
- **HuggingFace**: `Qwen/Qwen2.5-Coder-3B-Instruct`
- **Release**: November 2024

### Qwen2.5-Coder-7B-Instruct ⭐
- **Size**: 7B parameters
- **VRAM**: 16GB
- **Context**: 128K
- **Use Case**: **Best 7B code model**, better than CodeLlama-7B
- **Expected TPS**:
  - T4: 30 TPS
  - L4: 55 TPS
  - A100: 92 TPS
  - H100: 130 TPS
- **Quality**: Exceptional - rivals 13B+ general models
- **Benchmark**: Beats GPT-3.5-Turbo on HumanEval
- **HuggingFace**: `Qwen/Qwen2.5-Coder-7B-Instruct`
- **Best For**: Production code generation on budget
- **Release**: November 2024

### Qwen2.5-Coder-14B-Instruct
- **Size**: 14B parameters
- **VRAM**: 30GB
- **Context**: 128K
- **Use Case**: Mid-size code specialist
- **Expected TPS**:
  - A100: 62 TPS
  - H100: 92 TPS
  - B200: 150 TPS
- **Quality**: Exceptional
- **HuggingFace**: `Qwen/Qwen2.5-Coder-14B-Instruct`
- **Release**: November 2024

### Qwen2.5-Coder-32B-Instruct ⭐⭐⭐
- **Size**: 32B parameters
- **VRAM**: 68GB
- **Context**: 128K
- **Use Case**: **Best open-source code model**
- **Expected TPS**:
  - A100: 38 TPS
  - H100: 58 TPS
  - B200: 100 TPS
- **Quality**: **Beats GPT-4** on coding benchmarks
- **Benchmark Scores**:
  - HumanEval: 92.7% (GPT-4: 88.4%)
  - MBPP: 90.2% (GPT-4: 87.1%)
- **HuggingFace**: `Qwen/Qwen2.5-Coder-32B-Instruct`
- **Best For**: Professional development, production code
- **Release**: November 2024
- **Note**: Already in main catalog

---

## 🇨🇳 Other Missing Chinese Models

### DeepSeek-V2.5 (Latest)
- **Size**: 236B (21B active MoE)
- **VRAM**: 100GB
- **Context**: 128K
- **Type**: Unified (chat + code in one model)
- **Quality**: Combines DeepSeek-V2 + Coder-V2
- **Expected TPS**:
  - H100: 42 TPS
  - B200: 78 TPS
- **HuggingFace**: `deepseek-ai/DeepSeek-V2.5`
- **Release**: September 2024
- **Note**: Better than separate DeepSeek-V2 and Coder-V2

### Yi-Coder-9B
- **Size**: 9B parameters
- **Company**: 01.AI
- **VRAM**: 20GB
- **Context**: 128K
- **Quality**: Excellent code model
- **Expected TPS**:
  - L4: 50 TPS
  - A100: 85 TPS
- **HuggingFace**: `01-ai/Yi-Coder-9B-Chat`
- **Release**: September 2024

### InternLM2.5-20B-Chat
- **Size**: 20B parameters
- **Company**: Shanghai AI Lab
- **VRAM**: 42GB
- **Context**: 32K
- **Quality**: Excellent, strong reasoning
- **Expected TPS**:
  - A100: 48 TPS
  - H100: 72 TPS
- **HuggingFace**: `internlm/internlm2_5-20b-chat`
- **Release**: July 2024

### Baichuan2-13B-Chat
- **Size**: 13B parameters
- **Company**: Baichuan Intelligence
- **VRAM**: 28GB
- **Context**: 4K
- **Quality**: Good, Chinese-focused
- **HuggingFace**: `baichuan-inc/Baichuan2-13B-Chat`
- **Release**: September 2023

---

## 📊 Updated Recommendations for CLI Coding

### Task: Add Bookmarks to Website (Simple Web Feature)

**Minimum (Ultra-Budget):**
```
Model: Qwen2.5-Coder-0.5B-Instruct
GPU: Any / T4
VRAM: 2GB
TPS: 250+
Cost: ~$15/month (T4 8hr/day)
Quality: Good enough for simple features
```

**Recommended (Best Value):**
```
Model: Qwen2.5-Coder-1.5B-Instruct ⭐
GPU: T4
VRAM: 4GB
TPS: 150
Cost: ~$432/month (24/7) or ~$60/month (8hr/day)
Quality: Excellent for this task
Context: 128K - can see entire small codebase
```

**Professional (Best Quality):**
```
Model: Qwen2.5-Coder-7B-Instruct
GPU: L4
VRAM: 16GB
TPS: 55
Cost: ~$720/month (24/7) or ~$100/month (8hr/day)
Quality: Exceptional, production-ready code
```

**Overkill (But Fastest):**
```
Model: Qwen2.5-Coder-32B-Instruct
GPU: A100
VRAM: 68GB
TPS: 38
Cost: ~$2,880/month
Quality: GPT-4 level code generation
```

---

## 🎯 Comparison: Code Models by Size

| Model | Size | Context | Quality | Best For | HumanEval |
|-------|------|---------|---------|----------|-----------|
| Qwen2.5-Coder-0.5B | 0.5B | 32K | Good | Edge, embedded | 61% |
| **Qwen2.5-Coder-1.5B** ⭐ | 1.5B | 128K | Excellent | **CLI tools, simple features** | 70% |
| Qwen2.5-Coder-3B | 3B | 128K | Excellent | Small apps | 76% |
| Qwen2.5-Coder-7B | 7B | 128K | Exceptional | Production | 88% |
| DeepSeek-Coder-V2-Lite | 16B (2.4B) | 160K | Exceptional | MoE efficiency | 81% |
| Qwen2.5-Coder-14B | 14B | 128K | Exceptional | Professional | 89% |
| **Qwen2.5-Coder-32B** ⭐⭐⭐ | 32B | 128K | **SOTA** | **Best OSS** | **93%** |

*HumanEval scores are approximate based on public benchmarks*

---

## 🔥 Key Insights

### For "Add Bookmarks to Website" Task:

**You Need:**
1. HTML/CSS/JavaScript knowledge ✓
2. Understanding of DOM manipulation ✓
3. LocalStorage or backend integration ✓
4. Basic state management ✓

**Minimum Model:**
- **Qwen2.5-Coder-1.5B** handles this perfectly
- 128K context means it can see your entire codebase
- Fast enough (150 TPS) for interactive CLI
- Cheap enough to run 24/7 on T4 if needed

**Why Not Smaller?**
- 0.5B can do it but makes more mistakes
- 1.5B is the sweet spot for reliability

**Why Not Larger?**
- Task doesn't need 7B+ sophistication
- 1.5B will be faster and cheaper
- Unless you're doing complex refactoring

### GLM-4 vs Qwen2.5:

| Feature | GLM-4-9B | Qwen2.5-7B |
|---------|----------|------------|
| Size | 9B | 7B |
| Context | 128K | 128K |
| Chinese | Excellent | Excellent |
| English | Good | Excellent |
| Code | Good | Very Good |
| Function Calling | ✓ | ✓ |
| Math | Good | Excellent |
| **Recommendation** | Use if Chinese-focused | **Better overall** |

**Verdict**: Qwen2.5 is generally better, but GLM-4 is great for Chinese-specific tasks.

---

## 📝 Updated Catalog Additions Needed

### Critical Additions:
1. ✅ **Qwen2.5-Coder** full series (0.5B, 1.5B, 3B, 7B, 14B, 32B)
2. ✅ **GLM-4-9B-Chat** and GLM-4-9B-Chat-1M
3. ✅ **DeepSeek-V2.5** (unified model)
4. ✅ **Yi-Coder-9B**

### Nice to Have:
- InternLM2.5-20B
- Baichuan2-13B
- CogVLM2 (multi-modal)

---

## 🚀 Action Items

To use these models right now:

```bash
# Test Qwen2.5-Coder-1.5B for your bookmark task
python model_testing_suite.py test \
  Qwen/Qwen2.5-Coder-1.5B-Instruct \
  t4

# Compare small code models
python model_testing_suite.py compare t4 \
  Qwen/Qwen2.5-Coder-0.5B-Instruct \
  Qwen/Qwen2.5-Coder-1.5B-Instruct \
  Qwen/Qwen2.5-Coder-3B-Instruct

# Test GLM-4
python model_testing_suite.py test \
  THUDM/glm-4-9b-chat \
  l4
```

---

## Summary

**For your specific question "add bookmarks to website via CLI":**

**Answer: Qwen2.5-Coder-1.5B on T4**
- Size: 1.5B (tiny!)
- Cost: ~$60/month (8 hours/day)
- Speed: 150 TPS (very fast)
- Quality: More than sufficient for the task
- Context: 128K (can see entire small website)

**You were right to call out GLM-4** - it's a major model I completely missed! And the full Qwen-Coder series should have been front and center since they're specifically trained for coding tasks.

Would you like me to create an updated `model_catalog_2025_v2.json` with all these additions?
