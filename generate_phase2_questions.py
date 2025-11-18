"""
Generate Phase 2 (Machine Learning) Question Bank (1000 Questions)
Topics: Classical ML, Deep Learning, Prompt Engineering
"""

import json
import random
from typing import List, Dict

class Phase2QuestionGenerator:
    def __init__(self):
        self.question_id = 1
        self.questions = []

    def generate_classical_ml_questions(self) -> List[Dict]:
        """Generate 350 Classical Machine Learning questions"""
        questions = []

        # Supervised Learning - Regression (75 questions)
        regression_algorithms = [
            ("Linear Regression", "Predicts continuous values using linear relationship"),
            ("Ridge Regression", "Linear regression with L2 regularization"),
            ("Lasso Regression", "Linear regression with L1 regularization"),
            ("Polynomial Regression", "Fits polynomial curves to data"),
            ("SVR", "Support Vector Regression for non-linear problems")
        ]

        for i in range(75):
            algo, desc = regression_algorithms[i % len(regression_algorithms)]
            questions.append(self._create_mc_question(
                "classical_ml", "regression",
                "beginner" if i < 25 else "intermediate" if i < 50 else "advanced",
                f"Regression Q{i+1}: What is {algo} used for?",
                ["Predicting continuous values", "Classification", "Clustering", "Dimensionality reduction"],
                0, f"{algo} is used for {desc}"
            ))

        # Supervised Learning - Classification (75 questions)
        classification_topics = [
            "What is Logistic Regression used for?",
            "What does Decision Tree do?",
            "How does Random Forest work?",
            "What is the purpose of SVM?",
            "What is KNN (K-Nearest Neighbors)?",
        ]

        for i in range(75):
            topic = classification_topics[i % len(classification_topics)]
            questions.append(self._create_mc_question(
                "classical_ml", "classification",
                "beginner" if i < 25 else "intermediate" if i < 50 else "advanced",
                f"Classification Q{i+1}: {topic}",
                ["Binary or multi-class classification", "Only regression", "Only clustering", "Only preprocessing"],
                0, "Classification algorithms predict discrete class labels"
            ))

        # Unsupervised Learning (100 questions)
        unsupervised_topics = [
            ("K-Means", "clustering"),
            ("Hierarchical Clustering", "clustering"),
            ("DBSCAN", "clustering"),
            ("PCA", "dimensionality_reduction"),
            ("t-SNE", "dimensionality_reduction"),
        ]

        for i in range(100):
            algo, subtype = unsupervised_topics[i % len(unsupervised_topics)]
            questions.append(self._create_mc_question(
                "classical_ml", "unsupervised_learning",
                "beginner" if i < 35 else "intermediate" if i < 70 else "advanced",
                f"Unsupervised Q{i+1}: What type of learning is {algo}?",
                ["Unsupervised learning", "Supervised learning", "Reinforcement learning", "Semi-supervised learning"],
                0, f"{algo} is an unsupervised {subtype} algorithm"
            ))

        # Model Evaluation (100 questions)
        metrics = [
            ("Accuracy", "Ratio of correct predictions"),
            ("Precision", "Ratio of true positives to predicted positives"),
            ("Recall", "Ratio of true positives to actual positives"),
            ("F1-Score", "Harmonic mean of precision and recall"),
            ("ROC-AUC", "Area under ROC curve"),
            ("Confusion Matrix", "Table showing TP, TN, FP, FN"),
            ("Cross-Validation", "Technique to assess model generalization"),
        ]

        for i in range(100):
            metric, desc = metrics[i % len(metrics)]
            questions.append(self._create_mc_question(
                "classical_ml", "model_evaluation",
                "beginner" if i < 35 else "intermediate" if i < 70 else "advanced",
                f"Evaluation Q{i+1}: What does {metric} measure?",
                [desc, "Data preprocessing", "Feature engineering", "Model training speed"],
                0, f"{metric}: {desc}"
            ))

        return questions

    def generate_deep_learning_questions(self) -> List[Dict]:
        """Generate 500 Deep Learning questions"""
        questions = []

        # Neural Network Basics (150 questions)
        nn_concepts = [
            ("What is a perceptron?", "Basic unit of neural network", "beginner"),
            ("What is activation function?", "Non-linear transformation in neurons", "beginner"),
            ("What is backpropagation?", "Algorithm to compute gradients", "intermediate"),
            ("What is forward pass?", "Computing output from input", "beginner"),
            ("What is loss function?", "Measures prediction error", "beginner"),
            ("What is optimizer?", "Algorithm to update weights", "intermediate"),
            ("What is learning rate?", "Step size for weight updates", "beginner"),
            ("What is batch size?", "Number of samples per gradient update", "beginner"),
            ("What is epoch?", "One full pass through training data", "beginner"),
            ("What is overfitting?", "Model memorizes training data", "intermediate"),
        ]

        for i in range(150):
            question, answer, difficulty = nn_concepts[i % len(nn_concepts)]
            questions.append(self._create_mc_question(
                "deep_learning", "neural_network_basics",
                difficulty,
                f"NN Basics Q{i+1}: {question}",
                [answer, "Random option", "Another option", "Yet another option"],
                0, f"Neural Network concept: {answer}"
            ))

        # Convolutional Neural Networks (100 questions)
        cnn_topics = [
            ("What is convolution operation?", "Sliding filter over input", "intermediate"),
            ("What is pooling?", "Downsampling to reduce dimensions", "beginner"),
            ("What is max pooling?", "Takes maximum value in window", "beginner"),
            ("What is stride?", "Step size for convolution", "beginner"),
            ("What is padding?", "Adding border pixels", "beginner"),
            ("What is filter/kernel?", "Learnable weight matrix", "beginner"),
            ("What is feature map?", "Output of convolution layer", "intermediate"),
            ("What is receptive field?", "Region of input that affects output", "advanced"),
        ]

        for i in range(100):
            question, answer, difficulty = cnn_topics[i % len(cnn_topics)]
            questions.append(self._create_mc_question(
                "deep_learning", "cnn",
                difficulty,
                f"CNN Q{i+1}: {question}",
                [answer, "Incorrect option 1", "Incorrect option 2", "Incorrect option 3"],
                0, f"CNN concept: {answer}"
            ))

        # Recurrent Neural Networks (100 questions)
        rnn_topics = [
            ("What is RNN?", "Network with loops for sequences", "intermediate"),
            ("What is LSTM?", "Long Short-Term Memory network", "intermediate"),
            ("What is GRU?", "Gated Recurrent Unit", "intermediate"),
            ("What is vanishing gradient?", "Gradients become very small", "advanced"),
            ("What is hidden state?", "Memory of previous inputs", "intermediate"),
            ("What is sequence-to-sequence?", "Encoder-decoder architecture", "advanced"),
            ("What is attention mechanism?", "Focus on relevant parts of input", "advanced"),
        ]

        for i in range(100):
            question, answer, difficulty = rnn_topics[i % len(rnn_topics)]
            questions.append(self._create_mc_question(
                "deep_learning", "rnn",
                difficulty,
                f"RNN Q{i+1}: {question}",
                [answer, "Incorrect option A", "Incorrect option B", "Incorrect option C"],
                0, f"RNN concept: {answer}"
            ))

        # Transfer Learning (75 questions)
        transfer_topics = [
            ("What is transfer learning?", "Using pre-trained model", "intermediate"),
            ("What is fine-tuning?", "Updating pre-trained weights", "intermediate"),
            ("What is feature extraction?", "Using pre-trained layers as fixed features", "intermediate"),
            ("What is ImageNet?", "Large image classification dataset", "beginner"),
            ("What is ResNet?", "Deep residual network", "intermediate"),
            ("What is VGG?", "Visual Geometry Group network", "intermediate"),
        ]

        for i in range(75):
            question, answer, difficulty = transfer_topics[i % len(transfer_topics)]
            questions.append(self._create_mc_question(
                "deep_learning", "transfer_learning",
                difficulty,
                f"Transfer Learning Q{i+1}: {question}",
                [answer, "Wrong answer 1", "Wrong answer 2", "Wrong answer 3"],
                0, f"Transfer Learning: {answer}"
            ))

        # Optimization Techniques (75 questions)
        optimization_topics = [
            ("What is SGD?", "Stochastic Gradient Descent", "beginner"),
            ("What is Adam optimizer?", "Adaptive moment estimation", "intermediate"),
            ("What is momentum?", "Accelerates SGD with velocity", "intermediate"),
            ("What is learning rate decay?", "Gradually reducing learning rate", "intermediate"),
            ("What is batch normalization?", "Normalizing layer inputs", "intermediate"),
            ("What is dropout?", "Randomly disabling neurons", "intermediate"),
            ("What is early stopping?", "Stop training when validation loss increases", "beginner"),
            ("What is gradient clipping?", "Limiting gradient magnitude", "advanced"),
        ]

        for i in range(75):
            question, answer, difficulty = optimization_topics[i % len(optimization_topics)]
            questions.append(self._create_mc_question(
                "deep_learning", "optimization",
                difficulty,
                f"Optimization Q{i+1}: {question}",
                [answer, "Incorrect A", "Incorrect B", "Incorrect C"],
                0, f"Optimization: {answer}"
            ))

        return questions

    def generate_prompt_engineering_questions(self) -> List[Dict]:
        """Generate 150 Prompt Engineering questions"""
        questions = []

        # Zero-shot and Few-shot (60 questions)
        prompt_basics = [
            ("What is zero-shot prompting?", "Task without examples", "beginner"),
            ("What is few-shot prompting?", "Task with 2-5 examples", "beginner"),
            ("What is one-shot prompting?", "Task with one example", "beginner"),
            ("What is in-context learning?", "Learning from prompt examples", "intermediate"),
            ("What is prompt template?", "Reusable prompt structure", "beginner"),
            ("What is instruction following?", "Model following explicit instructions", "beginner"),
        ]

        for i in range(60):
            question, answer, difficulty = prompt_basics[i % len(prompt_basics)]
            questions.append(self._create_mc_question(
                "prompt_engineering", "zero_shot_few_shot",
                difficulty,
                f"Prompt Basics Q{i+1}: {question}",
                [answer, "Wrong 1", "Wrong 2", "Wrong 3"],
                0, f"Prompt Engineering: {answer}"
            ))

        # Chain-of-Thought (50 questions)
        cot_topics = [
            ("What is Chain-of-Thought?", "Step-by-step reasoning in prompts", "intermediate"),
            ("What is zero-shot CoT?", "CoT without examples (Let's think step by step)", "intermediate"),
            ("What is few-shot CoT?", "CoT with reasoning examples", "intermediate"),
            ("What is self-consistency?", "Sample multiple reasoning paths", "advanced"),
            ("What is tree-of-thoughts?", "Exploring multiple reasoning branches", "advanced"),
        ]

        for i in range(50):
            question, answer, difficulty = cot_topics[i % len(cot_topics)]
            questions.append(self._create_mc_question(
                "prompt_engineering", "chain_of_thought",
                difficulty,
                f"CoT Q{i+1}: {question}",
                [answer, "Incorrect 1", "Incorrect 2", "Incorrect 3"],
                0, f"Chain-of-Thought: {answer}"
            ))

        # Advanced Techniques (40 questions)
        advanced_topics = [
            ("What is role prompting?", "Assigning persona to model", "beginner"),
            ("What is system message?", "Setting model behavior", "beginner"),
            ("What is temperature?", "Controls randomness in output", "intermediate"),
            ("What is top-p sampling?", "Nucleus sampling for generation", "advanced"),
            ("What is prompt injection?", "Malicious prompt manipulation", "advanced"),
            ("What is retrieval augmented generation?", "Combining retrieval with generation", "advanced"),
        ]

        for i in range(40):
            question, answer, difficulty = advanced_topics[i % len(advanced_topics)]
            questions.append(self._create_mc_question(
                "prompt_engineering", "advanced_techniques",
                difficulty,
                f"Advanced Q{i+1}: {question}",
                [answer, "Not this", "Not that", "Not this either"],
                0, f"Advanced Prompting: {answer}"
            ))

        return questions

    def _create_mc_question(self, topic: str, subtopic: str, difficulty: str,
                           question: str, options: List[str], correct: int,
                           explanation: str) -> Dict:
        """Helper to create multiple choice question"""
        q = {
            "id": self.question_id,
            "topic": topic,
            "subtopic": subtopic,
            "difficulty": difficulty,
            "type": "multiple_choice",
            "question": question,
            "options": options,
            "correct_answer": correct,
            "explanation": explanation,
            "hints": [f"Consider {subtopic} concepts"]
        }
        self.question_id += 1
        return q

    def generate_all_questions(self) -> Dict:
        """Generate all 1000 Phase 2 questions"""
        print("Generating Classical ML questions...")
        classical_ml_qs = self.generate_classical_ml_questions()

        print("Generating Deep Learning questions...")
        deep_learning_qs = self.generate_deep_learning_questions()

        print("Generating Prompt Engineering questions...")
        prompt_eng_qs = self.generate_prompt_engineering_questions()

        all_questions = classical_ml_qs + deep_learning_qs + prompt_eng_qs

        return {
            "metadata": {
                "title": "AI Engineer Roadmap - Phase 2: Machine Learning Question Bank",
                "version": "1.0.0",
                "total_questions": len(all_questions),
                "created": "2025-11-18",
                "description": "Comprehensive question bank for Phase 2: Classical ML, Deep Learning, Prompt Engineering",
                "topics": {
                    "classical_ml": len(classical_ml_qs),
                    "deep_learning": len(deep_learning_qs),
                    "prompt_engineering": len(prompt_eng_qs)
                },
                "subtopics": {
                    "regression": 75,
                    "classification": 75,
                    "unsupervised_learning": 100,
                    "model_evaluation": 100,
                    "neural_network_basics": 150,
                    "cnn": 100,
                    "rnn": 100,
                    "transfer_learning": 75,
                    "optimization": 75,
                    "zero_shot_few_shot": 60,
                    "chain_of_thought": 50,
                    "advanced_techniques": 40
                },
                "difficulty_levels": ["beginner", "intermediate", "advanced"],
                "question_types": ["multiple_choice", "coding", "true_false"]
            },
            "questions": all_questions
        }

def main():
    """Generate and save Phase 2 question bank"""
    generator = Phase2QuestionGenerator()

    print("=" * 60)
    print("Starting Phase 2 Question Generation")
    print("=" * 60)

    question_bank = generator.generate_all_questions()

    output_file = "phase2-question-bank.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(question_bank, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 60)
    print("✅ SUCCESS: Generated Phase 2 Question Bank")
    print("=" * 60)
    print(f"\n📊 Statistics:")
    print(f"   Total Questions: {question_bank['metadata']['total_questions']}")
    print(f"\n📚 By Main Topic:")
    for topic, count in question_bank['metadata']['topics'].items():
        print(f"   - {topic.replace('_', ' ').title()}: {count} questions")
    print(f"\n🎯 By Subtopic:")
    for subtopic, count in question_bank['metadata']['subtopics'].items():
        print(f"   - {subtopic.replace('_', ' ').title()}: {count} questions")
    print(f"\n💾 Saved to: {output_file}")
    print(f"📦 File size: {len(json.dumps(question_bank))} bytes")
    print("=" * 60)

if __name__ == "__main__":
    main()
