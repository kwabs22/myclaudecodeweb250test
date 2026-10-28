# AI engineer roadmap: guide and quizzes

A repository guide for a six-phase AI engineer roadmap, a computed-answer quiz for each of the first two phases (1,148 and 487 questions), and a hand-written quiz for the third.

## Where each phase stands

| Phase | Topic | Quiz | Questions | Read this |
|---|---|---|---|---|
| 1 | Maths and programming fundamentals | [Phase 1 quiz](quiz-app.html) | 1,148: linear algebra 224, calculus 209, probability and statistics 220, Python 142, SQL 178, data structures and algorithms 175 | [PHASE1_README.md](PHASE1_README.md) |
| 2 | Machine learning and deep learning | [Phase 2 quiz](phase2-quiz-app.html) | 487: deep learning 220, classical ML 216, prompt engineering 51 (hand-written) | [PHASE2_README.md](PHASE2_README.md) |
| 3 | Generative AI | [Phase 3 quiz](phase3-quiz-app.html) | 96, hand-written: OpenAI API, Hugging Face, embeddings and vector databases, RAG, agents | [PHASE3_README.md](PHASE3_README.md) |
| 4 to 6 | MLOps, advanced topics, capstone | none yet | none | The [repository guide](ai-engineer-roadmap-github-repos.md) covers them |

The three READMEs are the same kind of document: how the quiz works, how the questions are split, how to study with it, and how to regenerate the question bank.

## Files

| File | What it is |
|---|---|
| [`ai-engineer-roadmap-github-repos.md`](ai-engineer-roadmap-github-repos.md) | The guide: more than 60 GitHub repositories mapped to the six phases, with learning paths and a week-one plan |
| `quiz-app.html`, `phase1-question-bank-full.json`, `generate_phase1_questions.py` | Phase 1: the quiz page, its questions, and the script that builds them (with `p1_math.py`, `p1_code.py`) |
| `phase1-question-bank.json` | A 50-question sample of Phase 1, kept from the first version |
| `phase2-quiz-app.html`, `phase2-question-bank.json`, `generate_phase2_questions.py` | Phase 2: the same three parts (with `p2_ml.py`) |
| `phase3-quiz-app.html`, `phase3-question-bank.json`, `generate_phase3_questions.py` | Phase 3: the same three parts, with questions written by hand |
| [`QuizApp.jsx`](QuizApp.jsx) | A React version of the Phase 1 quiz for use in your own app |

## Good to know

- Each question stores its correct answer as the first option. Both quiz pages shuffle the options when they load, so the answer is not always A.
- The Phase 1 and Phase 2 questions are built by script, and the script computes each answer by running code (numpy, sympy, SQLite, the Python interpreter), so no question repeats and the answers are not typed in by hand. A minority (about 70 in Phase 1, about 100 in Phase 2) are conceptual questions written by hand. `question_tools.py` is the shared helper and `check_question_banks.py` validates all three banks.
- An earlier version of the Phase 1 and 2 banks repeated a few dozen templates thousands of times; this version replaced it.
- There is no quiz for Phases 4 to 6 yet.
