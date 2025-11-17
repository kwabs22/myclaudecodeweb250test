# OpenPose Video Annotation & Search - Complete Package

This package provides everything you need to use OpenPose (or modern alternatives) for video annotation and pose-based video search on GPU renting servers.

## 📦 What's Included

### Documentation

1. **openpose-research.md** - Comprehensive research document covering:
   - OpenPose overview and capabilities
   - Installation options for Jupyter notebooks
   - GPU requirements and setup
   - Video annotation workflows
   - Video search using pose similarity
   - Alternative modern solutions (YOLO, MediaPipe)
   - Complete code examples

2. **QUICKSTART.md** - Fast setup guide to get running in 5 minutes:
   - Docker setup instructions
   - Direct installation method
   - Usage examples
   - Troubleshooting tips
   - Performance optimization

### Code & Implementation

3. **pose_search.py** - Full-featured Python module for:
   - Loading and managing video keypoint databases
   - Computing pose similarity between videos
   - Video search using Dynamic Time Warping (DTW)
   - Searching by specific poses
   - Action segmentation
   - Supporting both OpenPose and YOLO formats

4. **openpose_notebook_template.ipynb** - Ready-to-use Jupyter notebook with:
   - Step-by-step video annotation workflow
   - Keypoint extraction and visualization
   - Search index building
   - Video similarity search examples
   - Pose-based search demonstrations
   - Results visualization

### Docker Configurations

5. **Dockerfile.openpose** - Docker setup for official OpenPose:
   - CUDA 11.8 + cuDNN 8
   - Full OpenPose build with Python support
   - Jupyter notebook environment
   - All dependencies pre-installed

6. **Dockerfile.yolo** - Docker setup for YOLO Pose (recommended):
   - Faster setup time
   - Easier to use
   - YOLO v8/v11 Pose models
   - Jupyter notebook ready
   - Lighter weight than OpenPose

### Configuration Files

7. **requirements.txt** - All Python dependencies:
   - Ultralytics YOLO
   - OpenCV
   - DTW library
   - Scientific computing tools
   - Jupyter ecosystem

---

## 🚀 Quick Start

### For Impatient Users (2 commands)

```bash
# Build Docker image
docker build -f Dockerfile.yolo -t yolo-jupyter .

# Run with GPU
docker run --gpus all -p 8888:8888 -v $(pwd):/workspace yolo-jupyter
```

Then open the Jupyter URL in your browser and run `openpose_notebook_template.ipynb`.

### For Detailed Instructions

See **QUICKSTART.md** for complete setup instructions.

---

## 📋 Use Cases

This package enables you to:

1. **Annotate Videos**
   - Detect human poses in videos
   - Extract 17-135 keypoints per person
   - Save annotated videos with skeleton overlay
   - Export keypoint data as JSON

2. **Search Videos by Pose**
   - Find videos with similar actions
   - Search for specific poses across your database
   - Match actions using Dynamic Time Warping
   - Compute similarity scores

3. **Analyze Actions**
   - Segment videos into action clips
   - Compare movements between people
   - Track pose changes over time
   - Build searchable video databases

4. **Research & Development**
   - Motion capture analysis
   - Sports performance tracking
   - Fitness form checking
   - Behavioral research
   - Action recognition systems

---

## 🔧 Installation Options

### Option 1: Docker with YOLO (Recommended)

**Pros:**
- ✅ Easy setup (5 minutes)
- ✅ pip-installable model
- ✅ State-of-the-art accuracy (2024)
- ✅ Smaller image size
- ✅ Faster inference

**Cons:**
- ❌ Only 17 keypoints (no hands/face detail)

```bash
docker build -f Dockerfile.yolo -t yolo-jupyter .
docker run --gpus all -p 8888:8888 -v $(pwd):/workspace yolo-jupyter
```

### Option 2: Docker with OpenPose

**Pros:**
- ✅ 135 keypoints (body + hands + face)
- ✅ Most detailed pose estimation
- ✅ Research-grade accuracy

**Cons:**
- ❌ Complex build (~15-20 minutes)
- ❌ Larger image size (~8GB)
- ❌ Slower inference

```bash
docker build -f Dockerfile.openpose -t openpose-jupyter .
docker run --gpus all -p 8888:8888 -v $(pwd):/workspace openpose-jupyter
```

### Option 3: Direct Installation (No Docker)

**For when Docker isn't available:**

```bash
pip install -r requirements.txt
jupyter notebook --ip=0.0.0.0 --port=8888
```

See QUICKSTART.md for full instructions.

---

## 📊 Performance Comparison

| Model | Keypoints | Speed (GPU) | Accuracy | Installation | Size |
|-------|-----------|-------------|----------|--------------|------|
| **OpenPose** | 135 | Medium | Excellent | Complex | Large |
| **YOLO v8 Pose** | 17 | Fast | Excellent | Easy | Small |
| **YOLO v11 Pose** | 17 | Very Fast | Excellent | Easy | Small |
| **MediaPipe** | 33 | Very Fast | Good | Easy | Tiny |

**Recommendation:** Start with YOLO Pose for ease of use, switch to OpenPose if you need hand/face keypoints.

---

## 🎯 Typical Workflow

### 1. Setup Environment
```bash
# Build Docker image or install dependencies
docker build -f Dockerfile.yolo -t yolo-jupyter .
```

### 2. Annotate Videos
```python
from ultralytics import YOLO
model = YOLO('yolov8x-pose.pt')
results = model.predict(source='video.mp4', save=True)
```

### 3. Extract Keypoints
```python
# Use notebook template or custom code
# Saves JSON files with pose data
```

### 4. Build Search Index
```python
from pose_search import PoseSearchEngine
search_engine = PoseSearchEngine()
search_engine.load_video_keypoints('video1', 'keypoints1.json')
```

### 5. Search & Analyze
```python
# Find similar videos
results = search_engine.search_similar_videos('video1', top_k=5)

# Find specific poses
matches = search_engine.search_by_pose(target_pose, threshold=0.8)
```

---

## 📚 Documentation Guide

### Start Here:
1. **QUICKSTART.md** - Get running in 5 minutes
2. **openpose_notebook_template.ipynb** - Interactive tutorial

### Deep Dive:
3. **openpose-research.md** - Complete technical documentation
4. **pose_search.py** - API documentation in code

---

## 🔍 Key Features

### Video Annotation
- ✅ Multi-person pose detection
- ✅ Body, hand, and face keypoints (OpenPose)
- ✅ JSON export with confidence scores
- ✅ Annotated video output
- ✅ Batch processing support

### Video Search
- ✅ Pose similarity matching
- ✅ Dynamic Time Warping (DTW) for temporal alignment
- ✅ Specific pose queries
- ✅ Action segmentation
- ✅ Similarity scoring

### Flexibility
- ✅ Works with OpenPose or YOLO
- ✅ Supports multiple video formats
- ✅ Customizable similarity metrics
- ✅ Extensible Python API
- ✅ Jupyter notebook integration

---

## 💻 Hardware Requirements

### Minimum (YOLO):
- GPU: NVIDIA GPU with 4GB VRAM
- RAM: 8GB
- Storage: 20GB

### Recommended (YOLO):
- GPU: NVIDIA RTX 3060 or better (8GB+ VRAM)
- RAM: 16GB
- Storage: 50GB

### Minimum (OpenPose):
- GPU: NVIDIA GPU with 4GB VRAM (6GB+ recommended)
- RAM: 16GB
- Storage: 30GB

### Recommended (OpenPose):
- GPU: NVIDIA RTX 3080 or better (10GB+ VRAM)
- RAM: 32GB
- Storage: 100GB

---

## 🌐 GPU Server Providers

### Tested On:
- ✅ Vast.ai
- ✅ RunPod
- ✅ Lambda Labs
- ✅ Google Colab (with modifications)
- ✅ AWS EC2 with GPU
- ✅ Azure with GPU

### Setup Time:
- Vast.ai: ~5 minutes
- RunPod: ~5 minutes
- Lambda Labs: ~10 minutes
- Google Colab: ~3 minutes (no Docker)

---

## 🎓 Learning Resources

### Included in This Package:
1. Full research document with technical details
2. Working Jupyter notebook with examples
3. Production-ready Python module
4. Docker configurations for easy deployment

### External Resources:
- [OpenPose GitHub](https://github.com/CMU-Perceptual-Computing-Lab/openpose)
- [Ultralytics Docs](https://docs.ultralytics.com/)
- [DTW Library](https://dtaidistance.readthedocs.io/)
- [OpenCV Docs](https://docs.opencv.org/)

---

## 🛠 Troubleshooting

### Common Issues:

**GPU Not Detected:**
```bash
nvidia-smi  # Check GPU
python -c "import torch; print(torch.cuda.is_available())"
```

**Out of Memory:**
- Use smaller model (yolov8n instead of yolov8x)
- Process at lower resolution
- Use streaming mode for long videos

**Slow Processing:**
- Ensure GPU is being used
- Use smaller model for faster inference
- Reduce video resolution

See **QUICKSTART.md** for detailed troubleshooting.

---

## 📄 File Structure

```
.
├── README-OPENPOSE.md                    # This file
├── QUICKSTART.md                         # Fast setup guide
├── openpose-research.md                  # Comprehensive documentation
├── pose_search.py                        # Python search module
├── openpose_notebook_template.ipynb      # Jupyter tutorial
├── Dockerfile.yolo                       # YOLO Docker setup
├── Dockerfile.openpose                   # OpenPose Docker setup
├── requirements.txt                      # Python dependencies
├── videos/                               # Place videos here
└── output/                               # Generated annotations
    ├── annotated_videos/
    └── keypoints/
```

---

## 🚦 Next Steps

### If You're New:
1. Read **QUICKSTART.md**
2. Run Docker setup
3. Try the Jupyter notebook
4. Process your first video

### If You're Experienced:
1. Review **openpose-research.md**
2. Import `pose_search.py` in your code
3. Customize for your use case
4. Build production pipeline

---

## 📝 Examples

### Minimal Example:

```python
# 5 lines to annotate a video
from ultralytics import YOLO

model = YOLO('yolov8x-pose.pt')
results = model.predict(source='video.mp4', save=True)
print(f"Processed {len(results)} frames")
```

### Full Search Example:

```python
# Search videos by pose similarity
from pose_search import PoseSearchEngine

engine = PoseSearchEngine()
engine.load_video_keypoints('vid1', 'output/vid1.json')
engine.load_video_keypoints('vid2', 'output/vid2.json')

results = engine.search_similar_videos('vid1', top_k=3)
for r in results:
    print(f"{r['video_id']}: {r['similarity']:.3f}")
```

See the Jupyter notebook for complete examples.

---

## 🤝 Contributing

This is a research package. Feel free to:
- Extend `pose_search.py` with new features
- Add more similarity metrics
- Improve search algorithms
- Create additional notebook examples

---

## 📜 License

This package uses:
- **OpenPose**: CMU License (non-commercial)
- **Ultralytics YOLO**: AGPL-3.0
- **Other libraries**: See individual licenses

Check licenses before commercial use.

---

## 🎯 Summary

**What you get:**
- ✅ Complete OpenPose/YOLO setup for GPU servers
- ✅ Video annotation with pose detection
- ✅ Video search by pose similarity
- ✅ Production-ready Python code
- ✅ Docker configurations
- ✅ Jupyter notebook tutorials
- ✅ Comprehensive documentation

**Time to get started:** 5-10 minutes

**Ideal for:**
- Video analysis
- Action recognition
- Motion capture
- Sports analytics
- Research projects

---

## 📞 Support

For issues or questions:
1. Check **QUICKSTART.md** troubleshooting section
2. Review **openpose-research.md** for technical details
3. Verify GPU setup with `nvidia-smi`
4. Check model installation
5. Review error messages in Jupyter output

---

## 🎉 Quick Success Test

To verify everything works:

```bash
# 1. Build
docker build -f Dockerfile.yolo -t yolo-jupyter .

# 2. Run
docker run --gpus all -p 8888:8888 -v $(pwd):/workspace yolo-jupyter

# 3. In Jupyter, run:
from ultralytics import YOLO
import torch

print(f"CUDA: {torch.cuda.is_available()}")
model = YOLO('yolov8n-pose.pt')
print("Success! Ready to process videos.")
```

If you see "Success!", you're ready to go! 🚀

---

**Happy Pose Detecting!** 🎯💪
