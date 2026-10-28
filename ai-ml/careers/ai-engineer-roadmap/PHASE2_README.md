# Phase 2 quiz: machine learning, deep learning and prompt engineering

[Open the quiz](phase2-quiz-app.html). 487 multiple-choice questions. Every question is different.

| Topic | Questions | What it covers |
|---|---|---|
| Classical machine learning | 216 | Accuracy, precision, recall and F1 from a confusion matrix, regression error, Gini impurity and entropy, k-nearest neighbours, k-means, gradient descent, logistic regression, cross-validation, cosine similarity, PCA, regularisation, and concepts such as overfitting and data leakage |
| Deep learning | 220 | Parameter counts, convolution and pooling sizes, softmax and cross-entropy, activations, one-neuron backpropagation, RNN, LSTM and GRU sizes, embeddings, attention, normalisation and dropout, optimisers, and concepts |
| Prompt engineering | 51 | Written by hand: system prompts, few-shot and chain-of-thought prompting, temperature and top-p, structured output, hallucination, prompt injection, retrieval, and evaluating prompts |

Difficulty: 189 beginner, 220 intermediate, 78 advanced.

## How the answers are made

The numeric questions are built by a script that picks random numbers and **computes the answer with numpy or the standard library**. Some are checked a second way: the F1 score against its closed form, a least-squares fit against `numpy.polyfit`. The wrong options are plausible mistakes, such as precision in place of recall. About 100 conceptual questions (and all of prompt engineering) are written by hand in `p2_ml.py`, each with an explanation.

## Regenerate and check

```bash
pip install numpy
python generate_phase2_questions.py     # writes phase2-question-bank.json (the output is the same every time)
python check_question_banks.py
```

## Limits

- Prompt engineering is the smallest topic. Prompt advice changes quickly with new models, so check it against your model's own documentation.
- Questions are practice, not a certified exam.
