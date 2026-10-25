#!/bin/bash

# GPU Benchmark Runner Script
# Simplifies running common benchmark scenarios

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Modal GPU Benchmark Runner                    ║${NC}"
echo -e "${BLUE}║    Compare GPU performance against benchmarks         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Modal is installed
if ! python3 -c "import modal" 2>/dev/null; then
    echo -e "${RED}✗ Modal SDK not installed${NC}"
    echo "Installing Modal..."
    pip install modal
    echo -e "${GREEN}✓ Modal installed${NC}"
fi

# Check Modal authentication
echo "Checking Modal authentication..."
if ! modal token check 2>/dev/null; then
    echo -e "${YELLOW}⚠ Modal not authenticated${NC}"
    echo "Please set your Modal token:"
    echo "  modal token set --token-id YOUR_TOKEN_ID --token-secret YOUR_TOKEN_SECRET"
    exit 1
fi
echo -e "${GREEN}✓ Modal authenticated${NC}"
echo ""

# Show menu
show_menu() {
    echo -e "${BLUE}Select benchmark mode:${NC}"
    echo "  1) Quick test (fastest, any GPU)"
    echo "  2) Single GPU benchmark"
    echo "  3) Compare multiple GPUs"
    echo "  4) Full benchmark suite"
    echo "  5) Real Modal inference test"
    echo "  6) Real Modal GPU comparison"
    echo "  0) Exit"
    echo ""
}

run_quick_test() {
    echo -e "${GREEN}Running quick benchmark...${NC}"
    python3 benchmark_modal.py quick
}

run_single_gpu() {
    echo -e "${YELLOW}Available GPUs:${NC} any, t4, a10g, l4, a100, a100-40gb, h100"
    read -p "Enter GPU type [any]: " gpu_type
    gpu_type=${gpu_type:-any}

    echo -e "${GREEN}Running benchmark on ${gpu_type}...${NC}"
    python3 benchmark_modal.py gpu "$gpu_type"
}

run_gpu_comparison() {
    echo -e "${YELLOW}Enter GPUs to compare (space-separated):${NC}"
    echo "Example: a100 t4 l4"
    read -p "GPUs: " gpu_list

    if [ -z "$gpu_list" ]; then
        gpu_list="a100 t4"
        echo "Using default: $gpu_list"
    fi

    echo -e "${GREEN}Comparing GPUs: ${gpu_list}${NC}"
    python3 benchmark_modal.py compare $gpu_list
}

run_full_suite() {
    echo -e "${GREEN}Running full benchmark suite...${NC}"
    echo -e "${YELLOW}This will take several minutes${NC}"
    python3 benchmark_modal.py full
}

run_real_modal_single() {
    echo -e "${YELLOW}Available GPUs:${NC} any, t4, a10g, l4, a100, h100"
    read -p "Enter GPU type [any]: " gpu_type
    gpu_type=${gpu_type:-any}

    echo -e "${GREEN}Running REAL Modal inference test on ${gpu_type}...${NC}"
    echo -e "${YELLOW}This will deploy to Modal and run actual inference${NC}"
    python3 modal_benchmark_runner.py single "$gpu_type"
}

run_real_modal_compare() {
    echo -e "${YELLOW}Enter GPUs to compare (space-separated):${NC}"
    echo "Example: any t4 a10g"
    echo -e "${RED}Warning: This will run real inference on each GPU type${NC}"
    read -p "GPUs: " gpu_list

    if [ -z "$gpu_list" ]; then
        gpu_list="any t4"
        echo "Using default: $gpu_list"
    fi

    echo -e "${GREEN}Comparing GPUs with REAL Modal inference: ${gpu_list}${NC}"
    python3 modal_benchmark_runner.py compare $gpu_list
}

# Main loop
while true; do
    show_menu
    read -p "Enter choice [0-6]: " choice

    case $choice in
        1)
            run_quick_test
            ;;
        2)
            run_single_gpu
            ;;
        3)
            run_gpu_comparison
            ;;
        4)
            run_full_suite
            ;;
        5)
            run_real_modal_single
            ;;
        6)
            run_real_modal_compare
            ;;
        0)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid choice${NC}"
            ;;
    esac

    echo ""
    echo -e "${BLUE}─────────────────────────────────────────────────────${NC}"
    echo ""
    read -p "Press Enter to continue..."
    clear
done
