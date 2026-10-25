"""Modal Labs GPU Provider Implementation"""

import os
import time
from typing import Any, Dict, Optional
import asyncio
from .base_provider import BaseGPUProvider, GPUProviderResponse, ProviderStatus


class ModalProvider(BaseGPUProvider):
    """Modal Labs GPU provider integration"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        config = config or {}
        super().__init__("Modal Labs", config)
        self.token_id = config.get('token_id') or os.getenv('MODAL_TOKEN_ID')
        self.token_secret = config.get('token_secret') or os.getenv('MODAL_TOKEN_SECRET')
        self.modal_client = None

    async def initialize(self) -> bool:
        """Initialize Modal Labs connection"""
        try:
            # Import modal here to avoid issues if not installed
            import modal

            if not self.token_id or not self.token_secret:
                print(f"[{self.name}] Warning: API credentials not configured")
                self._status = ProviderStatus.UNAVAILABLE
                return False

            # Set up Modal authentication
            os.environ['MODAL_TOKEN_ID'] = self.token_id
            os.environ['MODAL_TOKEN_SECRET'] = self.token_secret

            # Create a stub for testing
            stub = modal.Stub("gradio-planning-gpu")
            self.modal_client = stub

            self._status = ProviderStatus.AVAILABLE
            print(f"[{self.name}] Initialized successfully")
            return True

        except ImportError:
            print(f"[{self.name}] Modal SDK not installed. Run: pip install modal")
            self._status = ProviderStatus.UNAVAILABLE
            return False
        except Exception as e:
            print(f"[{self.name}] Initialization failed: {e}")
            self._status = ProviderStatus.ERROR
            return False

    async def execute(self, task: Dict[str, Any]) -> GPUProviderResponse:
        """Execute task on Modal Labs GPU"""
        start_time = time.time()

        try:
            if self._status != ProviderStatus.AVAILABLE:
                return GPUProviderResponse(
                    success=False,
                    data=None,
                    error=f"Provider not available: {self._status.value}",
                    provider=self.name
                )

            # Import modal functions
            import modal

            # Define the GPU function dynamically
            image = modal.Image.debian_slim().pip_install("torch", "transformers", "numpy")

            @self.modal_client.function(
                image=image,
                gpu="any",  # Use any available GPU
                timeout=300
            )
            def run_gpu_task(task_data: Dict[str, Any]) -> Dict[str, Any]:
                """Run the actual task on Modal GPU"""
                task_type = task_data.get('type', 'inference')

                if task_type == 'inference':
                    # Placeholder for model inference
                    return {
                        'result': f"Modal GPU execution completed for: {task_data.get('prompt', 'N/A')}",
                        'provider': 'modal',
                        'gpu_used': True
                    }
                elif task_type == 'planning':
                    # Planning-specific logic
                    return {
                        'plan': task_data.get('input', 'No input provided'),
                        'steps': ['Step 1: Analyzed on Modal GPU', 'Step 2: Generated plan'],
                        'provider': 'modal'
                    }
                else:
                    return {'result': 'Task completed', 'provider': 'modal'}

            # Execute the task
            with self.modal_client.run():
                result = run_gpu_task.remote(task)

            execution_time = time.time() - start_time

            return GPUProviderResponse(
                success=True,
                data=result,
                provider=self.name,
                execution_time=execution_time,
                metadata={'gpu': 'modal-any'}
            )

        except Exception as e:
            execution_time = time.time() - start_time
            print(f"[{self.name}] Execution error: {e}")
            return GPUProviderResponse(
                success=False,
                data=None,
                error=str(e),
                provider=self.name,
                execution_time=execution_time
            )

    async def check_availability(self) -> ProviderStatus:
        """Check Modal Labs availability"""
        try:
            if not self.token_id or not self.token_secret:
                self._status = ProviderStatus.UNAVAILABLE
            else:
                # Simple check - could be enhanced with actual API ping
                self._status = ProviderStatus.AVAILABLE
        except Exception as e:
            print(f"[{self.name}] Availability check failed: {e}")
            self._status = ProviderStatus.ERROR

        return self._status

    async def cleanup(self):
        """Cleanup Modal resources"""
        try:
            if self.modal_client:
                # Modal handles cleanup automatically
                pass
            self._status = ProviderStatus.UNAVAILABLE
            print(f"[{self.name}] Cleaned up successfully")
        except Exception as e:
            print(f"[{self.name}] Cleanup error: {e}")
