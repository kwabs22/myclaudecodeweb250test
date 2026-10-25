# Benchmarking toolkit

The Python scripts, model catalogues and GPU provider code behind the [benchmarking guides](../BENCHMARK_GUIDE.md) and the [GPU planning interface](../../gradio/GPU_PLANNING_INTERFACE.md). Run everything from this folder: the scripts and the guides' commands assume it is the current directory.

| File | Purpose |
|---|---|
| `setup.sh`, `requirements.txt`, `.env.example` | Install and configure |
| `benchmark_modal.py`, `modal_benchmark_runner.py`, `model_testing_suite.py`, `run_benchmarks.sh`, `benchmark_config.json` | Run benchmarks on Modal GPUs |
| `model_catalog.json`, `model_catalog_2025.json`, `chinese_models_supplement.json`, `generate_model_summary.py` | The model catalogue (the [Model Explorer](../model-explorer/index.html) reads these) |
| `assess_task.py`, `task_complexity_grading.json`, `ultra_complexity_levels_6_8.json` | Task complexity grading (the [Task Triage](../task-assessor/index.html) page ports these rules) |
| `gradio_planning_interface.py`, `gradio_benchmark_tab.py`, `gpu_providers/`, `demo_gpu_providers.py` | Gradio planning interface with Modal and Blaxel fallback |
| [`TASK_GRADING_GUIDE.md`](TASK_GRADING_GUIDE.md), [`QUICKSTART_GPU_INTERFACE.md`](QUICKSTART_GPU_INTERFACE.md), [`WHATS_NEW_2025.md`](WHATS_NEW_2025.md) | Guides for the above |
