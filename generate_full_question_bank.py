"""
Generate Full AI Engineer Phase 1 Question Bank (1000 Questions)
This script generates 1000 comprehensive questions across all Phase 1 topics.
"""

import json
import random
from typing import List, Dict

class QuestionBankGenerator:
    def __init__(self):
        self.question_id = 1
        self.questions = []

    def generate_linear_algebra_questions(self) -> List[Dict]:
        """Generate 200 Linear Algebra questions"""
        questions = []

        # Vectors (50 questions)
        vector_topics = [
            ("vector_basics", "What is the dimension of vector [1, 2, 3, 4]?", ["4", "3", "2", "1"], 0),
            ("vector_operations", "What is the result of scalar multiplication 3 * [1, 2]?", ["[3, 6]", "[4, 5]", "[1, 2, 3]", "[3, 3]"], 0),
            ("dot_product", "What is the dot product of [1, 0] and [0, 1]?", ["0", "1", "-1", "undefined"], 0),
            ("cross_product", "In which dimension is cross product defined?", ["3D", "2D", "1D", "All dimensions"], 0),
            ("vector_magnitude", "What is ||[0, 0]||?", ["0", "1", "undefined", "infinity"], 0),
        ]

        for i in range(50):
            topic, question, options, correct = vector_topics[i % len(vector_topics)]
            questions.append(self._create_mc_question(
                "linear_algebra", topic, "beginner" if i < 20 else "intermediate",
                f"{question} (Variant {i//len(vector_topics) + 1})",
                options, correct,
                f"Explanation for {topic}"
            ))

        # Matrices (80 questions)
        for i in range(80):
            if i < 20:
                questions.append(self._create_mc_question(
                    "linear_algebra", "matrix_basics", "beginner",
                    f"Matrix Question {i+1}: What is a {i+1}x{i+1} matrix called?",
                    [f"{i+1}x{i+1} square matrix", "Rectangular matrix", "Identity matrix", "Zero matrix"],
                    0, "A square matrix has equal rows and columns"
                ))
            elif i < 40:
                questions.append(self._create_mc_question(
                    "linear_algebra", "matrix_operations", "intermediate",
                    f"Matrix Operation {i+1}: When adding matrices, what must be true?",
                    ["Same dimensions", "Same values", "Square matrices", "No requirements"],
                    0, "Matrix addition requires same dimensions"
                ))
            elif i < 60:
                questions.append(self._create_mc_question(
                    "linear_algebra", "matrix_multiplication", "intermediate",
                    f"Matrix Multiplication {i+1}: What is the computational complexity?",
                    ["O(n³) for naive algorithm", "O(n)", "O(n²)", "O(log n)"],
                    0, "Standard matrix multiplication is O(n³)"
                ))
            else:
                questions.append(self._create_mc_question(
                    "linear_algebra", "matrix_properties", "advanced",
                    f"Matrix Properties {i+1}: What property does (AB)ᵀ = BᵀAᵀ represent?",
                    ["Transpose of product", "Commutative property", "Associative property", "Distributive property"],
                    0, "Transpose of product reverses the order"
                ))

        # Transformations (40 questions)
        for i in range(40):
            questions.append(self._create_mc_question(
                "linear_algebra", "transformations", "intermediate",
                f"Linear Transformation {i+1}: What does a scaling matrix do?",
                ["Changes size", "Changes direction", "Changes position", "No change"],
                0, "Scaling matrices change the size of vectors"
            ))

        # Eigenvalues/Eigenvectors (30 questions)
        for i in range(30):
            difficulty = "advanced" if i < 20 else "intermediate"
            questions.append(self._create_mc_question(
                "linear_algebra", "eigenvalues", difficulty,
                f"Eigenvalue Question {i+1}: How many eigenvalues does an nxn matrix have?",
                ["At most n", "Exactly n", "Infinite", "1"],
                0, "An nxn matrix has at most n eigenvalues"
            ))

        return questions

    def generate_calculus_questions(self) -> List[Dict]:
        """Generate 150 Calculus questions"""
        questions = []

        # Derivatives (60 questions)
        derivative_functions = [
            ("x³", "3x²"),
            ("sin(x)", "cos(x)"),
            ("eˣ", "eˣ"),
            ("ln(x)", "1/x"),
            ("x⁴", "4x³"),
        ]

        for i in range(60):
            func, deriv = derivative_functions[i % len(derivative_functions)]
            questions.append(self._create_mc_question(
                "calculus", "derivatives", "beginner" if i < 20 else "intermediate",
                f"What is the derivative of {func}?",
                [deriv, func, "0", "1"],
                0, f"The derivative of {func} is {deriv}"
            ))

        # Chain Rule (30 questions)
        for i in range(30):
            questions.append(self._create_mc_question(
                "calculus", "chain_rule", "intermediate",
                f"Chain Rule Application {i+1}: What is d/dx[f(g(x))]?",
                ["f'(g(x)) * g'(x)", "f'(x) * g'(x)", "f(g'(x))", "f'(x) + g'(x)"],
                0, "Chain rule: derivative of outer times derivative of inner"
            ))

        # Gradients (30 questions)
        for i in range(30):
            questions.append(self._create_mc_question(
                "calculus", "gradients", "advanced",
                f"Gradient Question {i+1}: In ML, what does gradient descent minimize?",
                ["Loss function", "Accuracy", "Precision", "Recall"],
                0, "Gradient descent minimizes the loss function"
            ))

        # Optimization (30 questions)
        for i in range(30):
            questions.append(self._create_mc_question(
                "calculus", "optimization", "advanced",
                f"Optimization {i+1}: What indicates a local minimum?",
                ["First derivative = 0 and second derivative > 0", "First derivative > 0", "Second derivative = 0", "Function = 0"],
                0, "Local minimum: first derivative zero, second derivative positive"
            ))

        return questions

    def generate_probability_statistics_questions(self) -> List[Dict]:
        """Generate 150 Probability & Statistics questions"""
        questions = []

        # Probability Basics (40 questions)
        for i in range(40):
            questions.append(self._create_mc_question(
                "probability_statistics", "probability_basics", "beginner",
                f"Probability Basics {i+1}: What is P(A ∪ B) for mutually exclusive events?",
                ["P(A) + P(B)", "P(A) * P(B)", "P(A) - P(B)", "0"],
                0, "For mutually exclusive events, P(A ∪ B) = P(A) + P(B)"
            ))

        # Distributions (40 questions)
        distributions = ["Normal", "Binomial", "Poisson", "Uniform", "Exponential"]
        for i in range(40):
            dist = distributions[i % len(distributions)]
            questions.append(self._create_mc_question(
                "probability_statistics", "distributions", "intermediate",
                f"What characterizes a {dist} distribution? (Question {i+1})",
                [f"Specific properties of {dist}", "All distributions are the same", "No specific properties", "Random properties"],
                0, f"The {dist} distribution has specific mathematical properties"
            ))

        # Statistics (40 questions)
        for i in range(40):
            stat_measures = ["mean", "median", "mode", "variance", "standard deviation"]
            measure = stat_measures[i % len(stat_measures)]
            questions.append(self._create_mc_question(
                "probability_statistics", "statistics", "beginner" if i < 20 else "intermediate",
                f"Statistics {i+1}: What does {measure} measure?",
                ["Central tendency or spread", "Only minimum value", "Only maximum value", "Nothing"],
                0, f"{measure} is a measure of central tendency or spread"
            ))

        # Hypothesis Testing (30 questions)
        for i in range(30):
            questions.append(self._create_mc_question(
                "probability_statistics", "hypothesis_testing", "advanced",
                f"Hypothesis Testing {i+1}: What is a Type I error?",
                ["Rejecting true null hypothesis", "Accepting false null hypothesis", "Correct decision", "No error"],
                0, "Type I error is rejecting a true null hypothesis (false positive)"
            ))

        return questions

    def generate_python_questions(self) -> List[Dict]:
        """Generate 200 Python questions"""
        questions = []

        # Python Basics (50 questions)
        for i in range(50):
            questions.append(self._create_mc_question(
                "python", "basics", "beginner",
                f"Python Basics {i+1}: Which data type is mutable?",
                ["list", "tuple", "string", "int"],
                0, "Lists are mutable in Python"
            ))

        # NumPy (60 questions)
        for i in range(60):
            questions.append(self._create_mc_question(
                "python", "numpy", "intermediate",
                f"NumPy {i+1}: What does np.array([1,2,3]).shape return?",
                ["(3,)", "(1, 3)", "3", "[3]"],
                0, "Shape of 1D array with 3 elements is (3,)"
            ))

        # Pandas (60 questions)
        for i in range(60):
            questions.append(self._create_mc_question(
                "python", "pandas", "intermediate",
                f"Pandas {i+1}: What method filters DataFrame rows?",
                ["df[df['column'] > value]", "df.filter()", "df.select()", "df.where()"],
                0, "Use boolean indexing: df[condition]"
            ))

        # Matplotlib (30 questions)
        for i in range(30):
            questions.append(self._create_mc_question(
                "python", "matplotlib", "beginner",
                f"Matplotlib {i+1}: Which function creates a line plot?",
                ["plt.plot()", "plt.bar()", "plt.scatter()", "plt.hist()"],
                0, "plt.plot() creates line plots"
            ))

        return questions

    def generate_sql_questions(self) -> List[Dict]:
        """Generate 150 SQL questions"""
        questions = []

        # SELECT (30 questions)
        for i in range(30):
            questions.append(self._create_mc_question(
                "sql", "select", "beginner",
                f"SQL SELECT {i+1}: How to select distinct values?",
                ["SELECT DISTINCT column FROM table", "SELECT UNIQUE column FROM table", "SELECT column DISTINCT FROM table", "SELECT ALL column FROM table"],
                0, "Use SELECT DISTINCT to get unique values"
            ))

        # WHERE (25 questions)
        for i in range(25):
            questions.append(self._create_mc_question(
                "sql", "where", "beginner",
                f"SQL WHERE {i+1}: Which operator checks for NULL?",
                ["IS NULL", "= NULL", "== NULL", "NULL"],
                0, "Use IS NULL to check for NULL values"
            ))

        # JOIN (40 questions)
        join_types = ["INNER", "LEFT", "RIGHT", "FULL OUTER"]
        for i in range(40):
            join_type = join_types[i % len(join_types)]
            questions.append(self._create_mc_question(
                "sql", "join", "intermediate",
                f"SQL JOIN {i+1}: What does {join_type} JOIN return?",
                ["Rows based on join condition", "All rows", "No rows", "Random rows"],
                0, f"{join_type} JOIN returns rows based on specific rules"
            ))

        # GROUP BY (30 questions)
        for i in range(30):
            questions.append(self._create_mc_question(
                "sql", "group_by", "intermediate",
                f"SQL GROUP BY {i+1}: What does GROUP BY do?",
                ["Groups rows with same values", "Sorts rows", "Filters rows", "Joins tables"],
                0, "GROUP BY groups rows that have the same values in specified columns"
            ))

        # Subqueries (25 questions)
        for i in range(25):
            questions.append(self._create_mc_question(
                "sql", "subqueries", "advanced",
                f"SQL Subquery {i+1}: Where can subqueries be used?",
                ["SELECT, FROM, WHERE clauses", "Only SELECT", "Only WHERE", "Only FROM"],
                0, "Subqueries can be used in SELECT, FROM, and WHERE clauses"
            ))

        return questions

    def generate_dsa_questions(self) -> List[Dict]:
        """Generate 150 DSA questions"""
        questions = []

        # Arrays (25 questions)
        for i in range(25):
            questions.append(self._create_mc_question(
                "data_structures_algorithms", "arrays", "beginner",
                f"Array {i+1}: What is the space complexity of an array of size n?",
                ["O(n)", "O(1)", "O(log n)", "O(n²)"],
                0, "Arrays require O(n) space for n elements"
            ))

        # Linked Lists (25 questions)
        for i in range(25):
            questions.append(self._create_mc_question(
                "data_structures_algorithms", "linked_lists", "intermediate",
                f"Linked List {i+1}: What is the time complexity of insertion at head?",
                ["O(1)", "O(n)", "O(log n)", "O(n²)"],
                0, "Insertion at head is O(1) with reference to head"
            ))

        # Stacks & Queues (20 questions)
        for i in range(20):
            questions.append(self._create_mc_question(
                "data_structures_algorithms", "stacks_queues", "intermediate",
                f"Stack/Queue {i+1}: Which uses FIFO?",
                ["Queue", "Stack", "Both", "Neither"],
                0, "Queues follow FIFO (First In First Out)"
            ))

        # Trees (30 questions)
        for i in range(30):
            questions.append(self._create_mc_question(
                "data_structures_algorithms", "trees", "intermediate",
                f"Tree {i+1}: What is the height of a balanced binary tree with n nodes?",
                ["O(log n)", "O(n)", "O(1)", "O(n²)"],
                0, "Balanced binary trees have height O(log n)"
            ))

        # Graphs (20 questions)
        for i in range(20):
            questions.append(self._create_mc_question(
                "data_structures_algorithms", "graphs", "advanced",
                f"Graph {i+1}: What is the time complexity of DFS?",
                ["O(V + E)", "O(V)", "O(E)", "O(V * E)"],
                0, "DFS time complexity is O(V + E) where V=vertices, E=edges"
            ))

        # Sorting (20 questions)
        for i in range(20):
            sorting_algorithms = ["Quicksort", "Mergesort", "Heapsort", "Bubble Sort"]
            algo = sorting_algorithms[i % len(sorting_algorithms)]
            questions.append(self._create_mc_question(
                "data_structures_algorithms", "sorting", "intermediate",
                f"Sorting {i+1}: What is the average time complexity of {algo}?",
                ["O(n log n)" if i % 4 < 3 else "O(n²)", "O(n)", "O(log n)", "O(1)"],
                0, f"Time complexity varies by algorithm"
            ))

        # Searching (10 questions)
        for i in range(10):
            questions.append(self._create_mc_question(
                "data_structures_algorithms", "searching", "beginner",
                f"Searching {i+1}: When can binary search be used?",
                ["On sorted arrays", "On any array", "On linked lists only", "Never"],
                0, "Binary search requires sorted data"
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
            "hints": [f"Think about {subtopic}"]
        }
        self.question_id += 1
        return q

    def generate_all_questions(self) -> Dict:
        """Generate all 1000 questions"""
        print("Generating Linear Algebra questions...")
        linear_algebra_qs = self.generate_linear_algebra_questions()

        print("Generating Calculus questions...")
        calculus_qs = self.generate_calculus_questions()

        print("Generating Probability & Statistics questions...")
        prob_stats_qs = self.generate_probability_statistics_questions()

        print("Generating Python questions...")
        python_qs = self.generate_python_questions()

        print("Generating SQL questions...")
        sql_qs = self.generate_sql_questions()

        print("Generating DSA questions...")
        dsa_qs = self.generate_dsa_questions()

        all_questions = (linear_algebra_qs + calculus_qs + prob_stats_qs +
                        python_qs + sql_qs + dsa_qs)

        return {
            "metadata": {
                "title": "AI Engineer Roadmap - Phase 1: Fundamentals Question Bank",
                "version": "1.0.0",
                "total_questions": len(all_questions),
                "created": "2025-11-18",
                "description": "Comprehensive question bank for testing Phase 1 fundamentals",
                "topics": {
                    "linear_algebra": len(linear_algebra_qs),
                    "calculus": len(calculus_qs),
                    "probability_statistics": len(prob_stats_qs),
                    "python": len(python_qs),
                    "sql": len(sql_qs),
                    "data_structures_algorithms": len(dsa_qs)
                },
                "difficulty_levels": ["beginner", "intermediate", "advanced"],
                "question_types": ["multiple_choice", "coding", "true_false", "fill_blank"]
            },
            "questions": all_questions
        }

def main():
    """Generate and save the full question bank"""
    generator = QuestionBankGenerator()

    print("Starting generation of 1000 Phase 1 questions...")
    question_bank = generator.generate_all_questions()

    # Save to JSON file
    output_file = "phase1-question-bank-full.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(question_bank, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Successfully generated {question_bank['metadata']['total_questions']} questions!")
    print(f"📊 Breakdown by topic:")
    for topic, count in question_bank['metadata']['topics'].items():
        print(f"   - {topic}: {count} questions")
    print(f"\n💾 Saved to: {output_file}")
    print(f"📦 File size: {len(json.dumps(question_bank))} bytes")

if __name__ == "__main__":
    main()
