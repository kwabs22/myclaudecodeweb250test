#!/usr/bin/env python3
"""
Generate Model Summary and Quick Reference
Creates human-readable summaries of model catalog
"""

import json
from typing import Dict, List, Any
from collections import defaultdict


class ModelSummaryGenerator:
    """Generate various summaries from model catalog"""

    def __init__(self, catalog_path: str = "model_catalog.json"):
        with open(catalog_path, 'r') as f:
            data = json.load(f)
            self.catalog = data['model_catalog']

    def print_gpu_summary(self):
        """Print summary of GPUs and compatible models"""
        print("\n" + "="*70)
        print("GPU COMPATIBILITY SUMMARY")
        print("="*70)

        for gpu_type, gpu_info in self.catalog['gpu_types'].items():
            print(f"\n{gpu_type.upper()}: {gpu_info['name']}")
            print(f"  VRAM: {gpu_info['vram_gb']}GB")
            print(f"  Cost Tier: {gpu_info['cost_tier']}")
            print(f"  Best For: {gpu_info['recommended_for']}")

            # Count compatible models
            compatible_count = self._count_compatible_models(gpu_type, gpu_info['vram_gb'])
            print(f"  Compatible Models: {compatible_count}")

    def _count_compatible_models(self, gpu_type: str, vram_gb: int) -> int:
        """Count models compatible with GPU"""
        count = 0
        for category_name, category in self.catalog['models'].items():
            if isinstance(category, dict) and 'models' in category:
                for model in category['models']:
                    if model['vram_required_gb'] <= vram_gb:
                        count += 1
        return count

    def print_model_matrix(self):
        """Print matrix of models vs GPUs"""
        print("\n" + "="*70)
        print("MODEL COMPATIBILITY MATRIX")
        print("="*70)
        print("\nLegend: ✓ = Compatible, ★ = Recommended, ✗ = Not enough VRAM\n")

        # Get all models
        all_models = []
        for category_name, category in self.catalog['models'].items():
            if isinstance(category, dict) and 'models' in category:
                for model in category['models']:
                    all_models.append(model)

        # Header
        gpus = ['t4', 'a10g', 'l4', 'a100-40gb', 'a100', 'h100']
        print(f"{'Model':<30} {'Params':<8} {'VRAM':<6} ", end='')
        for gpu in gpus:
            print(f"{gpu:<12}", end='')
        print()
        print("-" * 110)

        # Rows
        for model in all_models[:15]:  # Limit to first 15 for readability
            name = model['name'][:28]
            params = model['parameters']
            vram = f"{model['vram_required_gb']}GB"

            print(f"{name:<30} {params:<8} {vram:<6} ", end='')

            for gpu in gpus:
                gpu_info = self.catalog['gpu_types'][gpu]
                vram_avail = gpu_info['vram_gb']

                # Check if compatible
                if model['vram_required_gb'] <= vram_avail:
                    # Check if recommended
                    rec_gpus = model.get('recommended_gpu', [])
                    if gpu in rec_gpus:
                        symbol = "★"
                    else:
                        symbol = "✓"
                else:
                    symbol = "✗"

                print(f"{symbol:<12}", end='')

            print()

    def print_quality_tiers(self):
        """Print models grouped by quality tier"""
        print("\n" + "="*70)
        print("MODELS BY QUALITY TIER")
        print("="*70)

        # Group by quality
        by_quality = defaultdict(list)
        for category_name, category in self.catalog['models'].items():
            if isinstance(category, dict) and 'models' in category:
                for model in category['models']:
                    tier = model.get('quality_tier', 'unknown')
                    by_quality[tier].append(model)

        # Print by tier
        tier_order = ['exceptional', 'excellent', 'good', 'basic']
        for tier in tier_order:
            if tier in by_quality:
                models = by_quality[tier]
                print(f"\n{tier.upper()} ({len(models)} models):")
                for model in sorted(models, key=lambda m: m['parameters']):
                    print(f"  • {model['name']} ({model['parameters']}) - {model['use_case']}")

    def print_recommendations_by_use_case(self):
        """Print recommended models for common use cases"""
        print("\n" + "="*70)
        print("RECOMMENDATIONS BY USE CASE")
        print("="*70)

        use_cases = {
            "Code Generation": ["code", "programming"],
            "General Chat": ["chat", "instruction", "general"],
            "Long Context": ["long context"],
            "Fast Inference": ["fast", "efficient"],
        }

        for use_case, keywords in use_cases.items():
            print(f"\n{use_case}:")

            # Find matching models
            matches = []
            for category_name, category in self.catalog['models'].items():
                if isinstance(category, dict) and 'models' in category:
                    for model in category['models']:
                        use_case_text = model.get('use_case', '').lower()
                        if any(kw in use_case_text for kw in keywords):
                            matches.append(model)

            # Show top 3
            for model in matches[:3]:
                rec_gpu = model.get('recommended_gpu', ['any'])[0] if model.get('recommended_gpu') else 'any'
                print(f"  • {model['name']} on {rec_gpu.upper()}")
                print(f"    {model['use_case']}")

    def print_cost_comparison(self):
        """Print cost comparison for different configurations"""
        print("\n" + "="*70)
        print("COST COMPARISON (Estimated Monthly @ 24/7)")
        print("="*70)

        # Simplified pricing ($/hour)
        pricing = {
            't4': 0.60,
            'a10g': 1.20,
            'l4': 1.00,
            'a100-40gb': 3.50,
            'a100': 4.00,
            'h100': 8.00
        }

        print(f"\n{'GPU':<15} {'$/hour':<12} {'$/month':<12} {'Recommended Model':<30}")
        print("-" * 70)

        for gpu_type, price_per_hour in pricing.items():
            monthly = price_per_hour * 24 * 30

            # Get recommended model
            models = self._get_recommended_models_for_gpu(gpu_type)
            rec_model = models[0]['name'] if models else "N/A"

            print(f"{gpu_type.upper():<15} ${price_per_hour:<11.2f} ${monthly:<11.2f} {rec_model:<30}")

    def _get_recommended_models_for_gpu(self, gpu_type: str) -> List[Dict]:
        """Get recommended models for GPU"""
        gpu_info = self.catalog['gpu_types'][gpu_type]
        vram_available = gpu_info['vram_gb']

        models = []
        for category_name, category in self.catalog['models'].items():
            if isinstance(category, dict) and 'models' in category:
                for model in category['models']:
                    if model['vram_required_gb'] <= vram_available:
                        models.append(model)

        # Sort by quality and expected TPS
        quality_order = {'exceptional': 4, 'excellent': 3, 'good': 2, 'basic': 1}
        models.sort(
            key=lambda m: (
                quality_order.get(m.get('quality_tier', 'basic'), 0),
                m.get('expected_tps', {}).get(gpu_type, 0)
            ),
            reverse=True
        )

        return models[:5]

    def print_quick_reference(self):
        """Print quick reference card"""
        print("\n" + "="*70)
        print("QUICK REFERENCE CARD")
        print("="*70)

        scenarios = [
            ("Budget Development", "t4", "Phi-2", "Fast, cheap, good for testing"),
            ("Production (Best Value)", "l4", "Mistral-7B-Instruct", "Best price/performance"),
            ("Production (Premium)", "a100", "Mixtral-8x7B-Instruct", "Top quality"),
            ("Code Generation", "l4", "CodeLlama-7B-Instruct", "Specialized for code"),
            ("Maximum Speed", "h100", "Mixtral-8x7B-Instruct", "Fastest inference"),
        ]

        print(f"\n{'Scenario':<25} {'GPU':<10} {'Model':<25} {'Why':<30}")
        print("-" * 90)

        for scenario, gpu, model, why in scenarios:
            print(f"{scenario:<25} {gpu.upper():<10} {model:<25} {why:<30}")

    def generate_full_report(self):
        """Generate complete summary report"""
        self.print_gpu_summary()
        self.print_quality_tiers()
        self.print_recommendations_by_use_case()
        self.print_cost_comparison()
        self.print_model_matrix()
        self.print_quick_reference()

        print("\n" + "="*70)
        print("REPORT COMPLETE")
        print("="*70)
        print("\nFor detailed information:")
        print("  • Full guide: MODEL_SELECTION_GUIDE.md")
        print("  • Model catalog: model_catalog.json")
        print("  • Test models: python model_testing_suite.py")
        print()


def main():
    import sys

    generator = ModelSummaryGenerator()

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "gpu":
            generator.print_gpu_summary()
        elif command == "quality":
            generator.print_quality_tiers()
        elif command == "use-case":
            generator.print_recommendations_by_use_case()
        elif command == "cost":
            generator.print_cost_comparison()
        elif command == "matrix":
            generator.print_model_matrix()
        elif command == "quick":
            generator.print_quick_reference()
        elif command == "full":
            generator.generate_full_report()
        else:
            print(f"Unknown command: {command}")
            print("Available: gpu, quality, use-case, cost, matrix, quick, full")
    else:
        # Default: show quick reference
        generator.print_quick_reference()
        print("\nFor more details, run:")
        print("  python generate_model_summary.py full")


if __name__ == "__main__":
    main()
