"""Fallback Manager for GPU Providers"""

import os
import asyncio
from typing import List, Dict, Any, Optional
from .base_provider import BaseGPUProvider, GPUProviderResponse, ProviderStatus
from .modal_provider import ModalProvider
from .blaxel_provider import BlaxelProvider


class FallbackManager:
    """Manages fallback logic between multiple GPU providers"""

    def __init__(self, fallback_order: Optional[List[str]] = None):
        """
        Initialize the fallback manager

        Args:
            fallback_order: List of provider names in order of preference
                          Default: ['modal', 'blaxel']
        """
        self.fallback_order = fallback_order or self._get_default_fallback_order()
        self.providers: Dict[str, BaseGPUProvider] = {}
        self.retry_attempts = int(os.getenv('FALLBACK_RETRY_ATTEMPTS', '3'))
        self.initialized = False

    def _get_default_fallback_order(self) -> List[str]:
        """Get default fallback order from environment or use defaults"""
        env_order = os.getenv('GPU_FALLBACK_ORDER', 'modal,blaxel')
        return [p.strip() for p in env_order.split(',')]

    async def initialize(self):
        """Initialize all GPU providers"""
        print("\n=== Initializing GPU Providers ===")

        # Create provider instances
        provider_map = {
            'modal': ModalProvider(),
            'blaxel': BlaxelProvider()
        }

        # Initialize each provider in fallback order
        for provider_name in self.fallback_order:
            if provider_name in provider_map:
                provider = provider_map[provider_name]
                self.providers[provider_name] = provider
                await provider.initialize()

        self.initialized = True
        print(f"Initialized {len(self.providers)} providers")
        self.print_status()

    def print_status(self):
        """Print current status of all providers"""
        print("\n--- Provider Status ---")
        for name, provider in self.providers.items():
            print(f"  {name}: {provider.status.value}")
        print("----------------------\n")

    async def execute_with_fallback(self, task: Dict[str, Any]) -> GPUProviderResponse:
        """
        Execute task with automatic fallback between providers

        Args:
            task: Task dictionary containing type, input, and other parameters

        Returns:
            GPUProviderResponse with execution result
        """
        if not self.initialized:
            await self.initialize()

        errors = []
        task_description = task.get('type', 'unknown')

        print(f"\n=== Executing Task: {task_description} ===")

        # Try each provider in order
        for provider_name in self.fallback_order:
            if provider_name not in self.providers:
                continue

            provider = self.providers[provider_name]
            print(f"Trying provider: {provider_name}")

            # Check availability first
            status = await provider.check_availability()
            if status not in [ProviderStatus.AVAILABLE, ProviderStatus.BUSY]:
                error_msg = f"{provider_name}: Not available ({status.value})"
                print(f"  ✗ {error_msg}")
                errors.append(error_msg)
                continue

            # Attempt execution with retries
            for attempt in range(self.retry_attempts):
                try:
                    print(f"  Attempt {attempt + 1}/{self.retry_attempts}")
                    response = await provider.execute(task)

                    if response.success:
                        print(f"  ✓ Success! Execution time: {response.execution_time:.2f}s")
                        return response
                    else:
                        error_msg = f"{provider_name}: {response.error}"
                        print(f"  ✗ {error_msg}")
                        errors.append(error_msg)

                        # Don't retry if it's a clear failure
                        if response.error and 'not available' in response.error.lower():
                            break

                except Exception as e:
                    error_msg = f"{provider_name}: Unexpected error - {str(e)}"
                    print(f"  ✗ {error_msg}")
                    errors.append(error_msg)

                # Wait before retry
                if attempt < self.retry_attempts - 1:
                    await asyncio.sleep(1)

        # All providers failed
        print("\n✗ All providers failed!")
        all_errors = " | ".join(errors)
        return GPUProviderResponse(
            success=False,
            data=None,
            error=f"All providers failed: {all_errors}",
            provider="fallback_manager"
        )

    async def get_available_providers(self) -> List[str]:
        """Get list of currently available providers"""
        if not self.initialized:
            await self.initialize()

        available = []
        for name, provider in self.providers.items():
            status = await provider.check_availability()
            if status == ProviderStatus.AVAILABLE:
                available.append(name)

        return available

    async def cleanup(self):
        """Cleanup all providers"""
        print("\n=== Cleaning up GPU Providers ===")
        for name, provider in self.providers.items():
            await provider.cleanup()
        print("Cleanup complete\n")

    def get_provider_info(self) -> Dict[str, Any]:
        """Get information about all providers"""
        info = {
            'fallback_order': self.fallback_order,
            'retry_attempts': self.retry_attempts,
            'providers': {}
        }

        for name, provider in self.providers.items():
            info['providers'][name] = {
                'name': provider.name,
                'status': provider.status.value
            }

        return info
