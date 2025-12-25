# GPU Planning Interface with Blaxel and Modal Labs

A Gradio-based planning interface that uses **Blaxel** and **Modal Labs** as GPU providers with automatic fallback capabilities.

## 🚀 Features

- **Multiple GPU Providers**: Seamlessly switch between Modal Labs and Blaxel
- **Automatic Fallback**: If one provider fails, automatically tries the next
- **Retry Logic**: Configurable retry attempts for resilient execution
- **Real-time Monitoring**: Live provider status and execution history
- **User-Friendly Interface**: Clean Gradio UI for easy interaction
- **Configurable Priorities**: Set task priorities and provider preferences

## 📋 Prerequisites

- Python 3.8+
- API credentials for:
  - Modal Labs (token ID and secret)
  - Blaxel (API key)

## 🔧 Installation

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy the example environment file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Modal Labs credentials
MODAL_TOKEN_ID=your_modal_token_id
MODAL_TOKEN_SECRET=your_modal_token_secret

# Blaxel credentials
BLAXEL_API_KEY=your_blaxel_api_key
BLAXEL_API_URL=https://api.blaxel.com/v1

# Provider configuration
DEFAULT_GPU_PROVIDER=modal
GPU_FALLBACK_ORDER=modal,blaxel
FALLBACK_RETRY_ATTEMPTS=3
```

### 3. Set Up Modal (Optional)

If using Modal Labs, authenticate:

```bash
modal token set --token-id $MODAL_TOKEN_ID --token-secret $MODAL_TOKEN_SECRET
```

## 🎯 Usage

### Start the Interface

```bash
python gradio_planning_interface.py
```

The interface will be available at: `http://localhost:7860`

### Using the Planning Tab

1. **Enter your planning input**: Describe what you want to plan or analyze
2. **Select task type**: Choose from planning, inference, analysis, or custom
3. **Set priority**: Low, normal, or high
4. **Execute**: Click "Execute Plan" to run your task

The system will automatically:
- Try the first provider in your fallback order
- If it fails, move to the next provider
- Retry up to the configured number of attempts
- Display results and execution metrics

### Provider Status

Check the **Provider Status** panel to see:
- Which providers are available
- Current fallback order
- Retry configuration

### Execution History

View your past executions in the **History** tab:
- Timestamp of execution
- Provider used
- Success/failure status
- Execution time

### Advanced Configuration

In the **Advanced** tab, you can:
- Change fallback order on-the-fly
- Adjust retry attempts
- Test all providers with a sample task

## 🏗️ Architecture

### Project Structure

```
.
├── gradio_planning_interface.py   # Main Gradio application
├── gpu_providers/                 # GPU provider modules
│   ├── __init__.py
│   ├── base_provider.py          # Base provider interface
│   ├── modal_provider.py         # Modal Labs integration
│   ├── blaxel_provider.py        # Blaxel integration
│   └── fallback_manager.py       # Fallback logic coordinator
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment template
└── GPU_PLANNING_INTERFACE.md     # This file
```

### Provider System

**Base Provider** (`base_provider.py`)
- Abstract interface for all GPU providers
- Defines standard methods: `initialize()`, `execute()`, `check_availability()`, `cleanup()`
- Standardized response format via `GPUProviderResponse`

**Modal Provider** (`modal_provider.py`)
- Integrates with Modal Labs serverless GPU platform
- Dynamically creates GPU functions
- Supports custom Docker images and dependencies

**Blaxel Provider** (`blaxel_provider.py`)
- REST API integration with Blaxel
- Async HTTP client for optimal performance
- Health check and status monitoring

**Fallback Manager** (`fallback_manager.py`)
- Coordinates execution across multiple providers
- Implements retry logic and error handling
- Tracks provider status and availability

## 🔄 Fallback Logic

The fallback system works as follows:

1. **Initialize**: All providers are initialized at startup
2. **Check Availability**: Before execution, check if provider is available
3. **Execute**: Try to execute on the first available provider
4. **Retry**: If execution fails, retry up to N times
5. **Fallback**: If all retries fail, move to next provider
6. **Report**: Return result or aggregate error if all providers fail

```python
Order: Modal → Blaxel
Retries: 3 per provider
Total attempts: Up to 6 (3 × 2 providers)
```

## 📊 Task Types

### Planning
Strategic planning and task breakdown using GPU acceleration

```python
{
    'type': 'planning',
    'input': 'Plan a 3-month product roadmap',
    'priority': 'high'
}
```

### Inference
Run ML model inference on GPU

```python
{
    'type': 'inference',
    'prompt': 'Generate code for...',
    'priority': 'normal'
}
```

### Analysis
Data analysis and processing

```python
{
    'type': 'analysis',
    'input': 'Analyze user behavior patterns',
    'priority': 'normal'
}
```

### Custom
Custom tasks with specific requirements

```python
{
    'type': 'custom',
    'input': 'Your custom task',
    'endpoint': '/custom/endpoint',
    'priority': 'low'
}
```

## 🛠️ Development

### Adding a New Provider

1. Create a new provider class inheriting from `BaseGPUProvider`
2. Implement required methods: `initialize()`, `execute()`, `check_availability()`, `cleanup()`
3. Add provider to `FallbackManager.__init__()`
4. Update environment configuration

Example:

```python
from gpu_providers.base_provider import BaseGPUProvider, GPUProviderResponse

class NewProvider(BaseGPUProvider):
    def __init__(self, config=None):
        super().__init__("New Provider", config or {})
        # Your initialization

    async def initialize(self) -> bool:
        # Setup code
        self._status = ProviderStatus.AVAILABLE
        return True

    async def execute(self, task: Dict[str, Any]) -> GPUProviderResponse:
        # Execution logic
        return GPUProviderResponse(success=True, data=result, provider=self.name)
```

### Testing

Test individual providers:

```python
import asyncio
from gpu_providers import ModalProvider

async def test():
    provider = ModalProvider()
    await provider.initialize()

    task = {'type': 'planning', 'input': 'Test task'}
    response = await provider.execute(task)
    print(response)

asyncio.run(test())
```

## 🔐 Security Notes

- Never commit `.env` file with real credentials
- Use environment variables for all secrets
- Rotate API keys regularly
- Monitor provider usage and costs
- Implement rate limiting for production use

## 📈 Performance Tips

1. **Provider Selection**: Choose faster providers first in fallback order
2. **Retry Configuration**: Balance between resilience and latency
3. **Timeout Settings**: Adjust based on task complexity
4. **Batch Processing**: Group similar tasks when possible
5. **Monitoring**: Track provider performance metrics

## 🐛 Troubleshooting

### Modal Labs Issues

**Error: "Modal SDK not installed"**
```bash
pip install modal
```

**Error: "Authentication failed"**
```bash
# Re-authenticate
modal token set --token-id $MODAL_TOKEN_ID --token-secret $MODAL_TOKEN_SECRET
```

### Blaxel Issues

**Error: "API key not configured"**
- Check `.env` file has `BLAXEL_API_KEY`
- Verify API key is valid

**Error: "Connection timeout"**
- Check network connectivity
- Verify API URL is correct
- Increase timeout in configuration

### General Issues

**All providers unavailable**
- Verify all API credentials are set
- Check provider status dashboards
- Review error messages in console

**Slow execution**
- Check network latency
- Review provider quotas/limits
- Consider adjusting timeout values

## 📝 License

This project is provided as-is for educational and development purposes.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional GPU provider integrations
- Enhanced monitoring and metrics
- Advanced planning algorithms
- UI/UX improvements
- Performance optimizations

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review provider documentation
- Open an issue in the repository
