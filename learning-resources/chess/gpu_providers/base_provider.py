"""Base GPU Provider Interface"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from dataclasses import dataclass
from enum import Enum


class ProviderStatus(Enum):
    """Status of GPU provider"""
    AVAILABLE = "available"
    BUSY = "busy"
    ERROR = "error"
    UNAVAILABLE = "unavailable"


@dataclass
class GPUProviderResponse:
    """Standard response from GPU providers"""
    success: bool
    data: Any
    error: Optional[str] = None
    provider: Optional[str] = None
    execution_time: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None


class BaseGPUProvider(ABC):
    """Base class for all GPU providers"""

    def __init__(self, name: str, config: Dict[str, Any]):
        self.name = name
        self.config = config
        self._status = ProviderStatus.UNAVAILABLE

    @abstractmethod
    async def initialize(self) -> bool:
        """Initialize the provider"""
        pass

    @abstractmethod
    async def execute(self, task: Dict[str, Any]) -> GPUProviderResponse:
        """Execute a task on the GPU provider"""
        pass

    @abstractmethod
    async def check_availability(self) -> ProviderStatus:
        """Check if the provider is available"""
        pass

    @abstractmethod
    async def cleanup(self):
        """Cleanup resources"""
        pass

    @property
    def status(self) -> ProviderStatus:
        """Get current provider status"""
        return self._status

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(name={self.name}, status={self._status.value})"
