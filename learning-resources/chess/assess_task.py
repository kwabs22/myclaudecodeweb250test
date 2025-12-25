#!/usr/bin/env python3
"""
Task Complexity Assessor
Helps determine the minimum model needed for a coding task
"""

import json
import sys
from typing import Dict, List, Tuple


class TaskAssessor:
    """Assess task complexity and recommend models"""

    def __init__(self, config_path: str = "task_complexity_grading.json"):
        with open(config_path, 'r') as f:
            data = json.load(f)
            self.framework = data['task_grading_framework']

    def assess_by_keywords(self, task_description: str) -> str:
        """Quick assessment based on keywords"""
        task_lower = task_description.lower()

        # Level 1: Trivial
        trivial_keywords = [
            'add button', 'fix typo', 'rename variable', 'add comment',
            'change text', 'add class', 'remove', 'simple fix', 'console.log'
        ]
        if any(kw in task_lower for kw in trivial_keywords):
            if len(task_lower.split()) < 10:  # Very short description
                return 'level_1_trivial'

        # Level 5: Expert
        expert_keywords = [
            'architecture', 'microservices', 'refactor entire', 'optimize database',
            'security audit', 'distributed', 'design system', 'implement protocol',
            'zero downtime', 'machine learning pipeline', 'event sourcing'
        ]
        if any(kw in task_lower for kw in expert_keywords):
            return 'level_5_expert'

        # Level 4: Complex
        complex_keywords = [
            'authentication system', 'payment', 'real-time', 'websocket',
            'graphql', 'migration', 'caching layer', 'ci/cd', 'oauth',
            'error tracking', 'monitoring', 'infrastructure'
        ]
        if any(kw in task_lower for kw in complex_keywords):
            return 'level_4_complex'

        # Level 3: Moderate
        moderate_keywords = [
            'api', 'rest', 'endpoint', 'state management', 'data table',
            'infinite scroll', 'file upload', 'search', 'notification',
            'refactor function', 'autocomplete', 'validation'
        ]
        if any(kw in task_lower for kw in moderate_keywords):
            return 'level_3_moderate'

        # Level 2: Simple (default for most features)
        simple_keywords = [
            'add feature', 'bookmark', 'form', 'validation', 'dark mode',
            'modal', 'pagination', 'filter', 'tooltip', 'toggle'
        ]
        if any(kw in task_lower for kw in simple_keywords):
            return 'level_2_simple'

        # Default to simple if unclear
        return 'level_2_simple'

    def interactive_assessment(self) -> str:
        """Interactive questionnaire to determine complexity"""
        print("\n=== Task Complexity Assessment ===\n")

        score = 0

        # Question 1: Files
        print("1. How many files need to be read/understood?")
        print("   a) 1 file")
        print("   b) 2-3 files")
        print("   c) 4-10 files")
        print("   d) 11-50 files")
        print("   e) 50+ files")
        answer = input("   Your answer (a-e): ").lower()

        file_scores = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}
        score += file_scores.get(answer, 2)

        # Question 2: Context
        print("\n2. How much context understanding is needed?")
        print("   a) Single function")
        print("   b) Single component")
        print("   c) Multiple components")
        print("   d) System architecture")
        print("   e) Entire codebase")
        answer = input("   Your answer (a-e): ").lower()

        context_scores = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}
        score += context_scores.get(answer, 2)

        # Question 3: Reasoning
        print("\n3. What level of reasoning is required?")
        print("   a) Pattern matching (copy similar code)")
        print("   b) Basic logic (if/else, loops)")
        print("   c) Business logic (validation, state)")
        print("   d) Architectural decisions")
        print("   e) System design")
        answer = input("   Your answer (a-e): ").lower()

        reasoning_scores = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}
        score += reasoning_scores.get(answer, 2)

        # Question 4: Impact
        print("\n4. What's the impact radius?")
        print("   a) Single UI element")
        print("   b) Single feature")
        print("   c) Multiple features")
        print("   d) System-wide")
        print("   e) Infrastructure")
        answer = input("   Your answer (a-e): ").lower()

        impact_scores = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5}
        score += impact_scores.get(answer, 2)

        # Calculate level
        avg_score = score / 4

        if avg_score <= 1.5:
            return 'level_1_trivial'
        elif avg_score <= 2.5:
            return 'level_2_simple'
        elif avg_score <= 3.5:
            return 'level_3_moderate'
        elif avg_score <= 4.5:
            return 'level_4_complex'
        else:
            return 'level_5_expert'

    def get_recommendations(self, level: str) -> Dict:
        """Get model recommendations for a complexity level"""
        level_info = self.framework['complexity_levels'][level]
        matrix = self.framework['model_selection_matrix']['recommendations']

        # Find matching recommendation
        for rec in matrix:
            if rec['level'] == level:
                return {
                    'level_name': level_info['name'],
                    'description': level_info['description'],
                    'minimum_model': level_info['minimum_model'],
                    'recommended_model': level_info['recommended_model'],
                    'min_gpu': level_info['min_gpu'],
                    'cost_range': level_info['estimated_cost_per_month'],
                    'context_needed': level_info['context_needed'],
                    'budget_option': rec['budget'],
                    'recommended_option': rec['recommended'],
                    'premium_option': rec['premium'],
                    'example_tasks': level_info['example_tasks'][:3]  # First 3
                }

        return {}

    def print_assessment(self, level: str, task_description: str = ""):
        """Print formatted assessment results"""
        rec = self.get_recommendations(level)

        print("\n" + "="*70)
        print("TASK COMPLEXITY ASSESSMENT RESULTS")
        print("="*70)

        if task_description:
            print(f"\nTask: {task_description}")

        print(f"\n📊 Complexity Level: {rec['level_name']}")
        print(f"   {rec['description']}")

        print(f"\n🎯 Minimum Model Requirements:")
        print(f"   Model: {rec['minimum_model']}")
        print(f"   GPU: {rec['min_gpu']}")
        print(f"   Cost: {rec['cost_range']}")
        print(f"   Context: {rec['context_needed']}")

        print(f"\n💰 Budget Option:")
        print(f"   Model: {rec['budget_option']['model']}")
        print(f"   GPU: {rec['budget_option']['gpu']}")
        print(f"   Cost: {rec['budget_option']['cost']}")

        print(f"\n⭐ Recommended Option:")
        print(f"   Model: {rec['recommended_option']['model']}")
        print(f"   GPU: {rec['recommended_option']['gpu']}")
        print(f"   Cost: {rec['recommended_option']['cost']}")

        print(f"\n🏆 Premium Option:")
        print(f"   Model: {rec['premium_option']['model']}")
        print(f"   GPU: {rec['premium_option']['gpu']}")
        print(f"   Cost: {rec['premium_option']['cost']}")

        print(f"\n📋 Similar Tasks at This Level:")
        for i, task in enumerate(rec['example_tasks'], 1):
            print(f"   {i}. {task['task']}")

        print("\n" + "="*70)

        # Provide actionable next step
        print(f"\n💡 Quick Start:")
        print(f"   Test with: python model_testing_suite.py test \\")
        print(f"     {rec['recommended_option']['model']} \\")
        print(f"     {rec['recommended_option']['gpu'].lower()}")
        print()

    def list_all_levels(self):
        """List all complexity levels with examples"""
        print("\n" + "="*70)
        print("TASK COMPLEXITY LEVELS")
        print("="*70)

        levels = [
            'level_1_trivial',
            'level_2_simple',
            'level_3_moderate',
            'level_4_complex',
            'level_5_expert'
        ]

        for level in levels:
            info = self.framework['complexity_levels'][level]
            print(f"\n{info['name'].upper()}")
            print(f"  {info['description']}")
            print(f"  Model: {info['minimum_model']} - {info['recommended_model']}")
            print(f"  Cost: {info['estimated_cost_per_month']}")
            print(f"  Examples:")
            for task in info['example_tasks'][:3]:
                print(f"    • {task['task']}")

        print("\n" + "="*70)


def main():
    assessor = TaskAssessor()

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "list":
            # List all levels
            assessor.list_all_levels()

        elif command == "interactive" or command == "i":
            # Interactive assessment
            level = assessor.interactive_assessment()
            assessor.print_assessment(level)

        else:
            # Treat as task description
            task = " ".join(sys.argv[1:])
            level = assessor.assess_by_keywords(task)
            assessor.print_assessment(level, task)

    else:
        # Show help
        print("""
╔════════════════════════════════════════════════════════════╗
║            Task Complexity Assessor                        ║
║     Determine minimum model for your coding task           ║
╚════════════════════════════════════════════════════════════╝

Usage:
  python assess_task.py <task_description>    # Quick assessment
  python assess_task.py interactive            # Interactive mode
  python assess_task.py list                   # List all levels

Examples:
  python assess_task.py "Add bookmarks to website"
  python assess_task.py "Build authentication system with OAuth"
  python assess_task.py "Refactor monolith to microservices"
  python assess_task.py interactive

Quick Reference:
  Trivial    (1.5B):  Simple edits, obvious fixes
  Simple     (3B):    Single features, basic logic
  Moderate   (7B):    Multi-component features
  Complex    (14B):   System integration, architecture
  Expert     (32B):   System design, optimization

For detailed guide:
  cat TASK_GRADING_GUIDE.md
        """)


if __name__ == "__main__":
    main()
