"""Blaxel GPU Provider Implementation"""

import os
import time
from typing import Any, Dict, Optional
import asyncio
import httpx
from .base_provider import BaseGPUProvider, GPUProviderResponse, ProviderStatus


class BlaxelProvider(BaseGPUProvider):
    """Blaxel GPU provider integration"""

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        config = config or {}
        super().__init__("Blaxel", config)
        self.api_key = config.get('api_key') or os.getenv('BLAXEL_API_KEY')
        self.api_url = config.get('api_url') or os.getenv('BLAXEL_API_URL', 'https://api.blaxel.com/v1')
        self.client = None
        self.timeout = config.get('timeout', 300)

    async def initialize(self) -> bool:
        """Initialize Blaxel connection"""
        try:
            if not self.api_key:
                print(f"[{self.name}] Warning: API key not configured")
                self._status = ProviderStatus.UNAVAILABLE
                return False

            # Create async HTTP client
            self.client = httpx.AsyncClient(
                base_url=self.api_url,
                headers={
                    'Authorization': f'Bearer {self.api_key}',
                    'Content-Type': 'application/json'
                },
                timeout=self.timeout
            )

            # Test connection
            try:
                response = await self.client.get('/health')
                if response.status_code == 200:
                    self._status = ProviderStatus.AVAILABLE
                    print(f"[{self.name}] Initialized successfully")
                    return True
                else:
                    print(f"[{self.name}] Health check failed: {response.status_code}")
                    self._status = ProviderStatus.ERROR
                    return False
            except httpx.ConnectError:
                # If health endpoint doesn't exist, assume available if we have credentials
                print(f"[{self.name}] Health check unavailable, assuming ready")
                self._status = ProviderStatus.AVAILABLE
                return True

        except Exception as e:
            print(f"[{self.name}] Initialization failed: {e}")
            self._status = ProviderStatus.ERROR
            return False

    async def execute(self, task: Dict[str, Any]) -> GPUProviderResponse:
        """Execute task on Blaxel GPU"""
        start_time = time.time()

        try:
            if self._status != ProviderStatus.AVAILABLE:
                return GPUProviderResponse(
                    success=False,
                    data=None,
                    error=f"Provider not available: {self._status.value}",
                    provider=self.name
                )

            if not self.client:
                await self.initialize()

            # Prepare request payload
            payload = {
                'task': task,
                'gpu_required': True,
                'priority': task.get('priority', 'normal')
            }

            # Make API request
            endpoint = task.get('endpoint', '/gpu/execute')
            response = await self.client.post(endpoint, json=payload)

            execution_time = time.time() - start_time

            if response.status_code == 200:
                result_data = response.json()
                return GPUProviderResponse(
                    success=True,
                    data=result_data,
                    provider=self.name,
                    execution_time=execution_time,
                    metadata={'status_code': response.status_code}
                )
            else:
                return GPUProviderResponse(
                    success=False,
                    data=None,
                    error=f"HTTP {response.status_code}: {response.text}",
                    provider=self.name,
                    execution_time=execution_time
                )

        except httpx.TimeoutException:
            execution_time = time.time() - start_time
            print(f"[{self.name}] Request timeout")
            return GPUProviderResponse(
                success=False,
                data=None,
                error="Request timeout",
                provider=self.name,
                execution_time=execution_time
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
        """Check Blaxel availability"""
        try:
            if not self.client or not self.api_key:
                self._status = ProviderStatus.UNAVAILABLE
                return self._status

            response = await self.client.get('/status')

            if response.status_code == 200:
                data = response.json()
                gpu_available = data.get('gpu_available', True)
                self._status = ProviderStatus.AVAILABLE if gpu_available else ProviderStatus.BUSY
            else:
                self._status = ProviderStatus.ERROR

        except httpx.ConnectError:
            # Assume available if we have credentials
            self._status = ProviderStatus.AVAILABLE
        except Exception as e:
            print(f"[{self.name}] Availability check failed: {e}")
            self._status = ProviderStatus.ERROR

        return self._status

    async def cleanup(self):
        """Cleanup Blaxel resources"""
        try:
            if self.client:
                await self.client.aclose()
            self._status = ProviderStatus.UNAVAILABLE
            print(f"[{self.name}] Cleaned up successfully")
        except Exception as e:
            print(f"[{self.name}] Cleanup error: {e}")
