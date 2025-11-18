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

    def __init__(self, config_path: str = "task_complexity_grading.json",
                 ultra_config_path: str = "ultra_complexity_levels_6_8.json"):
        with open(config_path, 'r') as f:
            data = json.load(f)
            self.framework = data['task_grading_framework']

        # Load ultra-complexity framework (Level 6-8)
        try:
            with open(ultra_config_path, 'r') as f:
                ultra_data = json.load(f)
                self.ultra_framework = ultra_data['ultra_complexity_framework']
        except FileNotFoundError:
            self.ultra_framework = None

    def assess_by_keywords(self, task_description: str) -> str:
        """Quick assessment based on keywords"""
        task_lower = task_description.lower()

        # Level 8: Impossible (check first)
        impossible_keywords = [
            'perfect', 'user-friendly', 'better', 'successful startup',
            'profitable business', 'predict', 'make money', 'enterprise-ready'
        ]
        vague_indicators = len([w for w in ['best', 'better', 'good', 'perfect', 'optimal']
                               if w in task_lower]) >= 2
        if any(kw in task_lower for kw in impossible_keywords) or vague_indicators:
            if not any(specific in task_lower for specific in ['button', 'api', 'feature', 'function']):
                return 'level_8_currently_impossible'

        # Level 7: Research-Grade
        research_keywords = [
            'novel', 'consensus algorithm', 'custom language', 'programming language',
            'from scratch', 'new protocol', 'research', 'distributed systems framework',
            'formally verify', 'theorem proving'
        ]
        if any(kw in task_lower for kw in research_keywords):
            return 'level_7_research_grade'

        # Level 6: Mega-Complex
        mega_keywords = [
            'migrate entire', '500k loc', 'enterprise platform', 'multiple services',
            'ai-powered ide', 'automated audit', 'orchestration', 'multi-model',
            '100+ files', 'entire codebase'
        ]
        if any(kw in task_lower for kw in mega_keywords):
            return 'level_6_mega_complex'

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

        # Question 5: Scale
        print("\n5. What's the project scale?")
        print("   a) Single feature in existing app")
        print("   b) Multiple features")
        print("   c) Entire new module/service")
        print("   d) Multiple services/systems")
        print("   e) Entire enterprise platform")
        answer = input("   Your answer (a-e): ").lower()

        scale_scores = {'a': 1, 'b': 2, 'c': 3, 'd': 5, 'e': 7}
        score += scale_scores.get(answer, 2)

        # Question 6: Novelty
        print("\n6. How novel/unique is this task?")
        print("   a) Well-established pattern (copy existing)")
        print("   b) Standard implementation")
        print("   c) Some customization needed")
        print("   d) Significant new design")
        print("   e) Never been done before / research required")
        answer = input("   Your answer (a-e): ").lower()

        novelty_scores = {'a': 1, 'b': 2, 'c': 3, 'd': 5, 'e': 8}
        score += novelty_scores.get(answer, 2)

        # Calculate level (now out of 6 questions)
        avg_score = score / 6

        if avg_score <= 1.5:
            return 'level_1_trivial'
        elif avg_score <= 2.5:
            return 'level_2_simple'
        elif avg_score <= 3.5:
            return 'level_3_moderate'
        elif avg_score <= 4.5:
            return 'level_4_complex'
        elif avg_score <= 5.5:
            return 'level_5_expert'
        elif avg_score <= 6.5:
            return 'level_6_mega_complex'
        elif avg_score <= 7.5:
            return 'level_7_research_grade'
        else:
            return 'level_8_currently_impossible'

    def get_recommendations(self, level: str) -> Dict:
        """Get model recommendations for a complexity level"""
        # Check if it's an ultra-complexity level (6-8)
        if level.startswith('level_6') or level.startswith('level_7') or level.startswith('level_8'):
            if not self.ultra_framework:
                return {'error': 'Ultra-complexity framework not loaded'}

            level_info = self.ultra_framework['complexity_levels'][level]
            return {
                'level_name': level_info['name'],
                'description': level_info['description'],
                'approach': level_info.get('approach', ''),
                'architecture': level_info.get('architecture', ''),
                'minimum_setup': level_info.get('minimum_setup', ''),
                'recommended_setup': level_info.get('recommended_setup', ''),
                'estimated_cost': level_info.get('estimated_cost_per_month', ''),
                'human_involvement': level_info.get('human_involvement', ''),
                'timeline': level_info.get('timeline', ''),
                'example_tasks': level_info.get('example_tasks', [])[:2],
                'is_ultra': True,
                'why_impossible': level_info.get('why_impossible', []),
                'how_to_make_possible': level_info.get('how_to_make_possible', {})
            }

        # Standard levels (1-5)
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
                    'example_tasks': level_info['example_tasks'][:3],  # First 3
                    'is_ultra': False
                }

        return {}

    def print_assessment(self, level: str, task_description: str = ""):
        """Print formatted assessment results"""
        rec = self.get_recommendations(level)

        if 'error' in rec:
            print(f"\n❌ Error: {rec['error']}")
            return

        print("\n" + "="*70)
        print("TASK COMPLEXITY ASSESSMENT RESULTS")
        print("="*70)

        if task_description:
            print(f"\nTask: {task_description}")

        print(f"\n📊 Complexity Level: {rec['level_name']}")
        print(f"   {rec['description']}")

        # Ultra-complexity levels (6-8) have different output
        if rec.get('is_ultra', False):
            if level == 'level_8_currently_impossible':
                print(f"\n⚠️  THIS TASK IS CURRENTLY IMPOSSIBLE FOR AI")
                print(f"\n❌ Why This Is Impossible:")
                for reason in rec.get('why_impossible', [])[:5]:
                    print(f"   • {reason}")

                print(f"\n💡 How to Make This Possible:")
                how_to = rec.get('how_to_make_possible', {})
                for key, value in list(how_to.items())[:4]:
                    print(f"   • {key.replace('_', ' ').title()}: {value}")

                print(f"\n✅ What AI CAN Help With:")
                print(f"   AI can handle specific, well-defined subtasks.")
                print(f"   Break down vague goals into concrete requirements.")

            else:
                # Level 6 or 7
                print(f"\n🏗️  Approach: {rec['approach']}")
                print(f"📐 Architecture: {rec['architecture']}")
                print(f"\n⚙️  Setup Requirements:")
                print(f"   Minimum: {rec['minimum_setup']}")
                print(f"   Recommended: {rec['recommended_setup']}")

                print(f"\n💰 Cost & Timeline:")
                print(f"   Estimated Cost: {rec['estimated_cost']}")
                print(f"   Timeline: {rec['timeline']}")
                print(f"   Human Involvement: {rec['human_involvement']}")

                print(f"\n📋 Example Tasks at This Level:")
                for i, task in enumerate(rec['example_tasks'], 1):
                    print(f"\n   {i}. {task.get('task', 'N/A')}")
                    if 'estimated_cost' in task:
                        print(f"      Cost: {task['estimated_cost']}")
                    if 'timeline' in task:
                        print(f"      Timeline: {task['timeline']}")

                print(f"\n💡 Next Steps:")
                print(f"   1. Break down task into parallelizable components")
                print(f"   2. Design multi-model orchestration pipeline")
                print(f"   3. Set up human oversight at critical stages")
                print(f"   4. Review ULTRA_COMPLEXITY_LEVEL_6_PLUS.md for details")

        else:
            # Standard levels (1-5)
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

            print(f"\n💡 Quick Start:")
            print(f"   Test with: python model_testing_suite.py test \\")
            print(f"     {rec['recommended_option']['model']} \\")
            print(f"     {rec['recommended_option']['gpu'].lower()}")

        print("\n" + "="*70)
        print()

    def list_all_levels(self):
        """List all complexity levels with examples"""
        print("\n" + "="*70)
        print("TASK COMPLEXITY LEVELS (1-8)")
        print("="*70)

        # Standard levels (1-5)
        print("\n🔹 SINGLE-MODEL TASKS (Levels 1-5)")
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

        # Ultra-complexity levels (6-8)
        if self.ultra_framework:
            print("\n\n🔹 MULTI-MODEL TASKS (Levels 6-8)")
            print("="*70)

            ultra_levels = [
                'level_6_mega_complex',
                'level_7_research_grade',
                'level_8_currently_impossible'
            ]

            for level in ultra_levels:
                info = self.ultra_framework['complexity_levels'][level]
                print(f"\n{info['name'].upper()}")
                print(f"  {info['description']}")

                if level == 'level_8_currently_impossible':
                    print(f"  Approach: {info['approach']}")
                    print(f"  Why Impossible:")
                    for reason in info.get('why_impossible', [])[:3]:
                        print(f"    • {reason}")
                else:
                    print(f"  Setup: {info.get('minimum_setup', 'N/A')}")
                    print(f"  Cost: {info.get('estimated_cost_per_month', 'N/A')}")
                    print(f"  Timeline: {info.get('timeline', 'N/A')}")
                    print(f"  Examples:")
                    for task in info.get('example_tasks', [])[:2]:
                        print(f"    • {task.get('task', 'N/A')}")

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
║         Task Complexity Assessor (Levels 1-8)              ║
║    Determine minimum model/setup for your coding task      ║
╚════════════════════════════════════════════════════════════╝

Usage:
  python assess_task.py <task_description>    # Quick assessment
  python assess_task.py interactive            # Interactive mode
  python assess_task.py list                   # List all levels

Examples:
  python assess_task.py "Add bookmarks to website"
  python assess_task.py "Build authentication system with OAuth"
  python assess_task.py "Migrate entire enterprise platform 500K LOC"
  python assess_task.py "Make my app better"
  python assess_task.py interactive

Quick Reference (Single-Model Tasks):
  Level 1 - Trivial    (1.5B):   Simple edits, obvious fixes
  Level 2 - Simple     (3B):     Single features, basic logic
  Level 3 - Moderate   (7B):     Multi-component features
  Level 4 - Complex    (14B):    System integration
  Level 5 - Expert     (32B):    System design, optimization

Quick Reference (Multi-Model Tasks):
  Level 6 - Mega       (3-10 models):  Enterprise migrations
                       Cost: $5K-15K/month
  Level 7 - Research   (10-20 models): Novel implementations
                       Cost: $15K-50K/month
  Level 8 - Impossible (Human):        Vague/subjective goals
                       Needs concrete requirements

For detailed guides:
  cat TASK_GRADING_GUIDE.md              # Levels 1-5
  cat ULTRA_COMPLEXITY_LEVEL_6_PLUS.md   # Levels 6-8
        """)


if __name__ == "__main__":
    main()
