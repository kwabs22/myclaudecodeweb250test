#!/bin/bash
# Setup script for GPU Planning Interface

echo "=========================================="
echo "GPU Planning Interface Setup"
echo "=========================================="
echo ""

# Check Python version
echo "Checking Python version..."
python3 --version

# Create virtual environment (optional but recommended)
read -p "Create virtual environment? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    echo "✓ Virtual environment created and activated"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "✗ Failed to install dependencies"
    exit 1
fi

# Check if .env exists
echo ""
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠ Please edit .env file with your API credentials"
    echo "  - MODAL_TOKEN_ID"
    echo "  - MODAL_TOKEN_SECRET"
    echo "  - BLAXEL_API_KEY"
else
    echo "✓ .env file already exists"
fi

# Test imports
echo ""
echo "Testing imports..."
python3 -c "
from gpu_providers import FallbackManager
from gpu_providers.base_provider import ProviderStatus
print('✓ All imports successful!')
" 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ Setup complete!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Edit .env file with your API credentials"
    echo "2. Run the demo: python demo_gpu_providers.py"
    echo "3. Start the interface: python gradio_planning_interface.py"
else
    echo "✗ Import test failed"
    exit 1
fi
