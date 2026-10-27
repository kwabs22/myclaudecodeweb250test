# Phase 3: Generative AI Quiz - 96 Questions

A quiz for the third phase of the [AI engineer roadmap](ai-engineer-roadmap-github-repos.md): the OpenAI API, the Hugging Face ecosystem, embeddings and vector databases, RAG, and agents with LangChain and LangGraph. It follows the five sections of Phase 3 in the guide.

Open [phase3-quiz-app.html](phase3-quiz-app.html), or read the questions in [phase3-question-bank.json](phase3-question-bank.json).

## What is in it

| Topic | Questions | Covers |
|---|---|---|
| OpenAI API | 20 | Messages and roles, tokens and context, temperature and top_p, tool calling, structured output, streaming, rate limits, cost, security |
| Hugging Face | 19 | The Hub, tokenizers and attention masks, model families, generate(), 4-bit loading, LoRA and QLoRA, Trainer, datasets |
| Embeddings and vector databases | 19 | Similarity measures, ANN indexes (HNSW, IVF), pgvector and FAISS, metadata filters, hybrid search, reranking, quantisation |
| RAG | 19 | Chunking, retrieval settings, query rewriting, grounding prompts, evaluation, access control, GraphRAG |
| Agents and LangChain | 19 | The agent loop, ReAct, tool design and safety, LCEL, LangGraph state and checkpoints, MCP, tracing |

Difficulty: 26 beginner, 48 intermediate, 22 advanced.

## How it differs from Phases 1 and 2

The Phase 1 and Phase 2 banks were generated from templates and some wrong options are generic placeholders. Every question in this bank was written by hand with its own plausible wrong answers and a one-paragraph explanation, so there are about a tenth as many. To change or add questions, edit [generate_phase3_questions.py](generate_phase3_questions.py) and run it to rebuild the JSON.

## Using it

The page works like the other two: filter by topic and difficulty, answer, read the explanation, and see your statistics. The options are shuffled each time the page loads. Tools and model names change quickly in this field, so the questions test concepts that have stayed stable rather than specific product versions.
