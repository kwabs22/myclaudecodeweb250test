# Quick Start Guide: OpenPose Video Annotation & Search

This guide will get you up and running quickly on a GPU renting server.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Setup (5 minutes)](#quick-setup-5-minutes)
3. [Usage Examples](#usage-examples)
4. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **GPU Server**: Vast.ai, RunPod, Lambda Labs, or similar
- **GPU**: NVIDIA GPU with at least 4GB VRAM (8GB+ recommended)
- **CUDA**: 11.8 or later
- **Docker**: Installed on the server (usually pre-installed)

---

## Quick Setup (5 minutes)

### Option A: Using Docker (RECOMMENDED - Easiest)

#### 1. Clone or Upload Files

```bash
# If you have git access
git clone <your-repo-url>
cd <repo-directory>

# OR upload these files manually:
# - Dockerfile.yolo
# - pose_search.py
# - openpose_notebook_template.ipynb
# - requirements.txt
```

#### 2. Build Docker Image

```bash
# Build YOLO version (faster, easier)
docker build -f Dockerfile.yolo -t yolo-jupyter .

# This takes ~5-10 minutes
```

#### 3. Run Container

```bash
# Run with GPU access
docker run --gpus all \
  -p 8888:8888 \
  -v $(pwd):/workspace \
  --name pose-analysis \
  yolo-jupyter
```

#### 4. Access Jupyter Notebook

```bash
# The container will output a URL like:
# http://127.0.0.1:8888/?token=...

# If on remote server, forward the port:
ssh -L 8888:localhost:8888 user@your-server-ip

# Then open in browser: http://localhost:8888
```

#### 5. Open Template Notebook

- In Jupyter, open: `openpose_notebook_template.ipynb`
- Run cells step by step
- Upload your videos to the `videos/` folder

---

### Option B: Direct Installation (No Docker)

#### 1. Install System Dependencies

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y python3-pip python3-dev libgl1-mesa-glx libglib2.0-0
```

#### 2. Install Python Packages

```bash
pip install -r requirements.txt
```

#### 3. Verify GPU Access

```python
import torch
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"GPU: {torch.cuda.get_device_name(0)}")
```

#### 4. Start Jupyter

```bash
jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser
```

---

## Usage Examples

### Example 1: Annotate a Single Video

```python
from ultralytics import YOLO

# Load model (downloads automatically first time)
model = YOLO('yolov8x-pose.pt')

# Process video
results = model.predict(
    source='videos/sample.mp4',
    save=True,
    conf=0.5
)

print(f"Processed {len(results)} frames")
```

### Example 2: Extract Keypoints

```python
import cv2
import json
from ultralytics import YOLO

model = YOLO('yolov8x-pose.pt')
cap = cv2.VideoCapture('videos/sample.mp4')

keypoints_data = []

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame, verbose=False)

    if results[0].keypoints is not None:
        kp = results[0].keypoints.xy.cpu().numpy()
        keypoints_data.append(kp[0].tolist())  # First person

cap.release()

# Save to JSON
with open('keypoints.json', 'w') as f:
    json.dump(keypoints_data, f)
```

### Example 3: Search for Similar Videos

```python
from pose_search import PoseSearchEngine

# Initialize
search_engine = PoseSearchEngine()

# Load videos
search_engine.load_video_keypoints('video1', 'output/video1_keypoints.json')
search_engine.load_video_keypoints('video2', 'output/video2_keypoints.json')
search_engine.load_video_keypoints('video3', 'output/video3_keypoints.json')

# Search
results = search_engine.search_similar_videos('video1', top_k=3)

for r in results:
    print(f"{r['video_id']}: similarity={r['similarity']:.3f}")
```

### Example 4: Find Specific Pose

```python
import numpy as np
from pose_search import PoseSearchEngine

# Load target pose from frame
target_pose = np.array([...])  # Your pose data

# Search across all videos
search_engine = PoseSearchEngine()
# ... load videos ...

matches = search_engine.search_by_pose(target_pose, threshold=0.8)

print(f"Found {len(matches)} matching poses")
for match in matches[:5]:
    print(f"Video: {match['video_id']}, Frame: {match['frame']}, "
          f"Similarity: {match['similarity']:.3f}")
```

---

## Troubleshooting

### GPU Not Detected

```bash
# Check NVIDIA driver
nvidia-smi

# Check CUDA in PyTorch
python3 -c "import torch; print(torch.cuda.is_available())"

# If False, reinstall PyTorch with CUDA:
pip uninstall torch torchvision
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### Out of Memory Error

```python
# Use smaller model
model = YOLO('yolov8n-pose.pt')  # nano instead of extra-large

# Or process in smaller batches
results = model.predict(source='video.mp4', stream=True)
for r in results:
    # Process one frame at a time
    pass
```

### Docker GPU Access Denied

```bash
# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker

# Test
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi
```

### Slow Processing on CPU

YOLO will run on CPU if GPU not available, but much slower. Ensure:
1. GPU server has NVIDIA GPU
2. CUDA drivers installed
3. PyTorch installed with CUDA support

### Import Error: dtaidistance

```bash
# DTW library needs compilation
pip install --upgrade dtaidistance

# If fails, install dependencies:
sudo apt-get install -y python3-dev build-essential
pip install cython numpy
pip install dtaidistance
```

---

## Performance Tips

### 1. Model Selection

- **yolov8n-pose.pt**: Fastest, least accurate (~10 FPS on 1080p)
- **yolov8s-pose.pt**: Balanced (~7 FPS)
- **yolov8m-pose.pt**: Good accuracy (~5 FPS)
- **yolov8x-pose.pt**: Best accuracy (~2 FPS)

### 2. Resolution

```python
# Process at lower resolution for speed
results = model.predict(
    source='video.mp4',
    imgsz=640  # Default 640, try 480 or 320 for speed
)
```

### 3. Batch Processing

```python
# Process multiple videos in parallel
from multiprocessing import Pool

def process_video(video_path):
    model = YOLO('yolov8n-pose.pt')
    return model.predict(source=video_path, save=True)

with Pool(4) as p:
    results = p.map(process_video, video_list)
```

### 4. Streaming

```python
# For long videos, use streaming to save memory
results = model.predict(source='long_video.mp4', stream=True)

for i, r in enumerate(results):
    # Process frame by frame
    if i % 100 == 0:
        print(f"Processed {i} frames")
```

---

## Next Steps

1. **Try the template notebook**: Open `openpose_notebook_template.ipynb`
2. **Process your videos**: Upload to `videos/` folder
3. **Build search index**: Run sections 4-6 in notebook
4. **Experiment with search**: Try different similarity thresholds
5. **Customize**: Modify `pose_search.py` for your needs

---

## Additional Resources

- **OpenPose Research**: See `openpose-research.md` for detailed documentation
- **YOLO Docs**: https://docs.ultralytics.com/
- **OpenPose GitHub**: https://github.com/CMU-Perceptual-Computing-Lab/openpose
- **DTW Library**: https://dtaidistance.readthedocs.io/

---

## Common GPU Server Providers

### Vast.ai
```bash
# Usually pre-configured with Docker and NVIDIA drivers
# Just upload files and run docker commands
```

### RunPod
```bash
# Select "PyTorch" template for pre-installed environment
# Or use "NVIDIA CUDA" for Docker setup
```

### Lambda Labs
```bash
# Comes with CUDA pre-installed
# Use Option B (Direct Installation) method
```

### Google Colab (Free GPU)
```python
# Install in Colab notebook:
!pip install ultralytics dtaidistance

# Upload files via Colab interface
# Run notebook cells directly
```

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify GPU is accessible with `nvidia-smi`
3. Check CUDA version matches PyTorch installation
4. Review error messages carefully
5. Consult `openpose-research.md` for detailed explanations

Happy pose detecting! 🎯
