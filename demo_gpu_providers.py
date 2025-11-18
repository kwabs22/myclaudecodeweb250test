"""Demo script to test GPU providers without Gradio UI"""

import asyncio
import json
from dotenv import load_dotenv
from gpu_providers import FallbackManager

# Load environment
load_dotenv()


async def demo_basic_execution():
    """Demo: Basic task execution with fallback"""
    print("\n" + "="*60)
    print("DEMO 1: Basic Task Execution")
    print("="*60)

    manager = FallbackManager()
    await manager.initialize()

    # Simple planning task
    task = {
        'type': 'planning',
        'input': 'Create a 3-step plan for building a web application',
        'priority': 'normal'
    }

    response = await manager.execute_with_fallback(task)

    if response.success:
        print("\n✓ Execution successful!")
        print(f"Provider: {response.provider}")
        print(f"Execution time: {response.execution_time:.2f}s")
        print("\nResult:")
        print(json.dumps(response.data, indent=2))
    else:
        print("\n✗ Execution failed!")
        print(f"Error: {response.error}")

    await manager.cleanup()


async def demo_provider_testing():
    """Demo: Test all providers individually"""
    print("\n" + "="*60)
    print("DEMO 2: Individual Provider Testing")
    print("="*60)

    manager = FallbackManager()
    await manager.initialize()

    test_task = {
        'type': 'inference',
        'prompt': 'Hello from GPU provider test',
        'priority': 'low'
    }

    for name, provider in manager.providers.items():
        print(f"\n--- Testing {name} ---")

        # Check availability
        status = await provider.check_availability()
        print(f"Status: {status.value}")

        if status.value in ['available', 'busy']:
            try:
                response = await provider.execute(test_task)
                if response.success:
                    print(f"✓ Success: {response.execution_time:.2f}s")
                    print(f"Result: {json.dumps(response.data, indent=2)}")
                else:
                    print(f"✗ Failed: {response.error}")
            except Exception as e:
                print(f"✗ Error: {str(e)}")
        else:
            print(f"⊘ Provider not available")

    await manager.cleanup()


async def demo_fallback_behavior():
    """Demo: Show fallback behavior when providers fail"""
    print("\n" + "="*60)
    print("DEMO 3: Fallback Behavior")
    print("="*60)

    # Create manager with custom fallback order
    manager = FallbackManager(fallback_order=['modal', 'blaxel'])
    await manager.initialize()

    print(f"\nFallback order: {manager.fallback_order}")
    print(f"Retry attempts: {manager.retry_attempts}")

    # Execute a task
    task = {
        'type': 'analysis',
        'input': 'Analyze system performance metrics',
        'priority': 'high'
    }

    print("\nExecuting task with automatic fallback...")
    response = await manager.execute_with_fallback(task)

    print("\n--- Final Result ---")
    print(f"Success: {response.success}")
    print(f"Provider used: {response.provider}")
    if response.success:
        print(f"Execution time: {response.execution_time:.2f}s")
        print(f"Data: {json.dumps(response.data, indent=2)}")
    else:
        print(f"Error: {response.error}")

    await manager.cleanup()


async def demo_provider_info():
    """Demo: Display provider information"""
    print("\n" + "="*60)
    print("DEMO 4: Provider Information")
    print("="*60)

    manager = FallbackManager()
    await manager.initialize()

    info = manager.get_provider_info()

    print("\n--- System Configuration ---")
    print(json.dumps(info, indent=2))

    print("\n--- Available Providers ---")
    available = await manager.get_available_providers()
    if available:
        for provider_name in available:
            print(f"  ✓ {provider_name}")
    else:
        print("  (none)")

    await manager.cleanup()


async def demo_custom_task():
    """Demo: Execute a custom task type"""
    print("\n" + "="*60)
    print("DEMO 5: Custom Task Execution")
    print("="*60)

    manager = FallbackManager()
    await manager.initialize()

    # Custom task with specific parameters
    custom_task = {
        'type': 'custom',
        'input': 'Custom processing task',
        'parameters': {
            'model': 'custom-model-v1',
            'temperature': 0.7,
            'max_tokens': 1000
        },
        'priority': 'normal'
    }

    print("\nTask details:")
    print(json.dumps(custom_task, indent=2))

    print("\nExecuting...")
    response = await manager.execute_with_fallback(custom_task)

    if response.success:
        print("\n✓ Custom task completed!")
        print(f"Provider: {response.provider}")
        print(f"Result: {json.dumps(response.data, indent=2)}")
    else:
        print(f"\n✗ Task failed: {response.error}")

    await manager.cleanup()


async def run_all_demos():
    """Run all demos"""
    demos = [
        ("Basic Execution", demo_basic_execution),
        ("Provider Testing", demo_provider_testing),
        ("Fallback Behavior", demo_fallback_behavior),
        ("Provider Info", demo_provider_info),
        ("Custom Task", demo_custom_task)
    ]

    print("\n" + "="*60)
    print("GPU PROVIDER DEMO SUITE")
    print("="*60)
    print(f"\nRunning {len(demos)} demos...\n")

    for name, demo_func in demos:
        try:
            await demo_func()
            await asyncio.sleep(1)  # Brief pause between demos
        except Exception as e:
            print(f"\n✗ Demo '{name}' failed: {str(e)}")

    print("\n" + "="*60)
    print("ALL DEMOS COMPLETE")
    print("="*60)


def main():
    """Main entry point"""
    import sys

    if len(sys.argv) > 1:
        demo_map = {
            '1': demo_basic_execution,
            '2': demo_provider_testing,
            '3': demo_fallback_behavior,
            '4': demo_provider_info,
            '5': demo_custom_task,
            'all': run_all_demos
        }

        demo = sys.argv[1]
        if demo in demo_map:
            asyncio.run(demo_map[demo]())
        else:
            print(f"Unknown demo: {demo}")
            print("Available demos: 1, 2, 3, 4, 5, all")
    else:
        # Run all demos by default
        asyncio.run(run_all_demos())


if __name__ == "__main__":
    print("""
    GPU Provider Demo Script
    ========================

    Usage:
      python demo_gpu_providers.py [demo_number]

    Demos:
      1   - Basic task execution
      2   - Individual provider testing
      3   - Fallback behavior demonstration
      4   - Provider information display
      5   - Custom task execution
      all - Run all demos (default)

    Example:
      python demo_gpu_providers.py 1
      python demo_gpu_providers.py all
    """)

    main()
