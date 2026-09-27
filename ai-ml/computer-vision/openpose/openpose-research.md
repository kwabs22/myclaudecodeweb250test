# OpenPose Research: Jupyter Notebook Implementation for Video Annotation and Search

**Research Date:** 2025-11-17
**Repository:** https://github.com/CMU-Perceptual-Computing-Lab/openpose

---

## Table of Contents

1. [OpenPose Overview](#openpose-overview)
2. [Installation Options for Jupyter Notebooks](#installation-options-for-jupyter-notebooks)
3. [GPU Requirements](#gpu-requirements)
4. [Video Annotation Workflow](#video-annotation-workflow)
5. [Video Search Using Pose Similarity](#video-search-using-pose-similarity)
6. [Alternative Modern Solutions](#alternative-modern-solutions)
7. [Recommended Implementation Approach](#recommended-implementation-approach)

---

## OpenPose Overview

### What is OpenPose?

OpenPose is the **first real-time multi-person system** to jointly detect human body, hand, facial, and foot keypoints, totaling **135 keypoints** on single images. Developed at CMU's Perceptual Computing Lab, it enables simultaneous detection of multiple people's poses in real-time.

### Key Features

**2D Keypoint Detection:**
- Body/foot estimation: 15, 18, or 25 keypoints (BODY_25, COCO, MPI models)
- Hand detection: 2 × 21 keypoints (left and right hands)
- Face detection: 70 keypoints
- Runtime constant regardless of number of people detected

**3D Functionality:**
- Single-person 3D pose reconstruction via multi-view triangulation
- Compatible with Flir/Point Grey cameras

**Input/Output:**
- Multiple inputs: images, video files, webcam, IP cameras
- Output formats: PNG, JPG, AVI, JSON, XML, YML
- Real-time visualization with skeleton overlay

### Use Cases

- Motion capture and animation
- Fitness and sports tracking
- Action recognition
- Healthcare analysis
- Behavioral research
- Video content analysis and search

---

## Installation Options for Jupyter Notebooks

### Option 1: Official OpenPose (Most Accurate, Complex Setup)

#### Installation Steps

OpenPose requires **compilation from source** with Python bindings enabled:

1. **Enable Python Build in CMake:**
   ```bash
   cmake -DBUILD_PYTHON=ON ..
   ```

2. **Platform-Specific Build:**
   - **Ubuntu/Linux:**
     ```bash
     cd openpose
     mkdir build && cd build
     cmake -DBUILD_PYTHON=ON ..
     make -j`nproc`
     ```

   - **Windows:** Right-click OpenPose solution → "Build Solution" (not F5/Run)

3. **Post-Installation:**
   - Linux/Mac: Module installs to `/usr/local/python/openpose`
   - Windows: Copy `build/x{86/64}/Release`, `build/bin`, `build/python` folders

4. **Python Import:**
   ```python
   import sys
   sys.path.append('/path/to/openpose/python')
   import pyopenpose as op
   ```

#### Docker Approach (Recommended for GPU Servers)

For easier deployment on GPU renting servers:

```bash
# Using pre-built Docker image
docker pull cwaffles/openpose

# Or build from hmurari/openpose-docker for NVIDIA GPUs
git clone https://github.com/hmurari/openpose-docker
cd openpose-docker
docker build -t openpose-gpu .

# Run with GPU access and Jupyter
docker run --gpus all \
  -p 8888:8888 \
  -v $(pwd):/workspace \
  openpose-gpu \
  jupyter notebook --ip=0.0.0.0 --allow-root
```

#### Python API Usage Example

```python
import pyopenpose as op
import cv2
import numpy as np

# Configure OpenPose
params = {
    "model_folder": "/path/to/openpose/models/",
    "face": True,
    "hand": True,
    "write_json": "/output/json/folder/",
    "display": 0,
    "render_pose": 1
}

# Initialize
opWrapper = op.WrapperPython()
opWrapper.configure(params)
opWrapper.start()

# Process video
cap = cv2.VideoCapture("input_video.mp4")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Create datum object
    datum = op.Datum()
    datum.cvInputData = frame

    # Process
    opWrapper.emplaceAndPop(op.VectorDatum([datum]))

    # Access keypoints
    body_keypoints = datum.poseKeypoints  # Shape: (num_people, num_keypoints, 3)
    face_keypoints = datum.faceKeypoints
    hand_keypoints = datum.handKeypoints

    # Get rendered output
    output_image = datum.cvOutputData

cap.release()
opWrapper.stop()
```

### Option 2: Alternative Modern Solutions (Easier Setup)

For easier installation via pip, consider these alternatives:

#### MediaPipe (Google)

```bash
pip install mediapipe opencv-python
```

```python
import mediapipe as mp
import cv2

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

with mp_pose.Pose(min_detection_confidence=0.5) as pose:
    cap = cv2.VideoCapture("video.mp4")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        if results.pose_landmarks:
            mp_drawing.draw_landmarks(frame, results.pose_landmarks,
                                     mp_pose.POSE_CONNECTIONS)

            # Access keypoints
            landmarks = results.pose_landmarks.landmark
            # 33 keypoints available
```

**Pros:**
- Simple pip installation
- Faster on low-powered devices
- 33 body keypoints
- Cross-platform (mobile, web, edge)

**Cons:**
- Fewer keypoints than OpenPose (33 vs 135)
- Less accurate for multi-person scenarios

#### Ultralytics YOLO (YOLOv8/YOLO11 Pose)

```bash
pip install ultralytics
```

```python
from ultralytics import YOLO

# Load model
model = YOLO('yolov8n-pose.pt')  # or yolo11n-pose.pt

# Process video
results = model.predict(
    source='video.mp4',
    save=True,
    save_txt=True,  # Save keypoints to txt
    conf=0.5
)

# Access keypoints programmatically
for result in results:
    keypoints = result.keypoints.xy  # (num_people, 17, 2)
    confidences = result.keypoints.conf
```

**Pros:**
- State-of-the-art accuracy (2024)
- Simple installation
- Excellent multi-person detection
- Fast inference with GPU

**Cons:**
- 17 keypoints only (COCO format)
- No hand/face keypoints by default

---

## GPU Requirements

### Minimum Requirements (OpenPose)

- **GPU:** NVIDIA graphics card with at least 1.6 GB VRAM
- **RAM:** At least 2.5 GB free (BODY_25 model) or 2 GB (COCO)
- **CUDA:** Compatible NVIDIA drivers
- **cuDNN:** Highly recommended for performance

### GPU Configuration Options

```bash
# CMake GPU mode flags
GPU_MODE=CUDA      # Default for NVIDIA GPUs
GPU_MODE=CPU_ONLY  # For machines without GPU or <2GB VRAM
GPU_MODE=OPENCL    # For AMD/Intel GPUs
```

### Docker GPU Setup

```bash
# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
  sudo tee /etc/apt/sources.list.d/nvidia-docker.list

sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker

# Test GPU access
docker run --rm --gpus all nvidia/cuda:11.8.0-base-ubuntu22.04 nvidia-smi
```

### Multi-GPU Usage

```bash
# Use specific GPUs
./openpose.bin --video video.avi --num_gpu 2 --num_gpu_start 0

# Python API
params["num_gpu"] = 2
params["num_gpu_start"] = 1  # Start from GPU 1
```

---

## Video Annotation Workflow

### 1. Command-Line Approach (Quick Batch Processing)

```bash
# Basic video annotation
./build/examples/openpose/openpose.bin \
  --video examples/media/video.avi \
  --write_json output_json/ \
  --write_video output_video.avi

# Full body + face + hands with JSON output
./openpose.bin \
  --video input.mp4 \
  --face \
  --hand \
  --write_json keypoints_output/ \
  --write_video annotated_output.avi \
  --display 0
```

### 2. Python/Jupyter Notebook Approach

```python
import pyopenpose as op
import cv2
import json
import os
from pathlib import Path

class OpenPoseVideoAnnotator:
    def __init__(self, model_folder, output_dir):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)

        # Configure OpenPose
        self.params = {
            "model_folder": model_folder,
            "face": True,
            "hand": True,
            "number_people_max": -1,  # No limit
            "render_pose": 1,
            "display": 0
        }

        self.wrapper = op.WrapperPython()
        self.wrapper.configure(self.params)
        self.wrapper.start()

    def annotate_video(self, video_path, save_json=True, save_video=True):
        """Annotate video with pose detection"""
        cap = cv2.VideoCapture(video_path)

        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        # Setup video writer
        if save_video:
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            out_video = cv2.VideoWriter(
                str(self.output_dir / 'annotated.mp4'),
                fourcc, fps, (width, height)
            )

        # Process frames
        all_keypoints = []
        frame_idx = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Process with OpenPose
            datum = op.Datum()
            datum.cvInputData = frame
            self.wrapper.emplaceAndPop(op.VectorDatum([datum]))

            # Extract data
            frame_data = {
                "frame": frame_idx,
                "timestamp": frame_idx / fps,
                "people": []
            }

            if datum.poseKeypoints is not None:
                for person_idx in range(datum.poseKeypoints.shape[0]):
                    person_data = {
                        "person_id": person_idx,
                        "pose_keypoints_2d": datum.poseKeypoints[person_idx].flatten().tolist()
                    }

                    if datum.faceKeypoints is not None:
                        person_data["face_keypoints_2d"] = \
                            datum.faceKeypoints[person_idx].flatten().tolist()

                    if datum.handKeypoints is not None:
                        person_data["hand_left_keypoints_2d"] = \
                            datum.handKeypoints[0][person_idx].flatten().tolist()
                        person_data["hand_right_keypoints_2d"] = \
                            datum.handKeypoints[1][person_idx].flatten().tolist()

                    frame_data["people"].append(person_data)

            all_keypoints.append(frame_data)

            # Save annotated frame
            if save_video and datum.cvOutputData is not None:
                out_video.write(datum.cvOutputData)

            frame_idx += 1
            if frame_idx % 30 == 0:  # Progress update
                print(f"Processed {frame_idx}/{total_frames} frames")

        # Save JSON
        if save_json:
            with open(self.output_dir / 'keypoints.json', 'w') as f:
                json.dump(all_keypoints, f, indent=2)

        # Cleanup
        cap.release()
        if save_video:
            out_video.release()

        return all_keypoints

    def stop(self):
        self.wrapper.stop()

# Usage in Jupyter
annotator = OpenPoseVideoAnnotator(
    model_folder="/path/to/openpose/models",
    output_dir="./output"
)

keypoints = annotator.annotate_video("input_video.mp4")
annotator.stop()

print(f"Processed {len(keypoints)} frames")
print(f"First frame data: {keypoints[0]}")
```

### 3. JSON Output Format

Each frame produces JSON in this structure:

```json
{
  "version": 1.3,
  "people": [
    {
      "person_id": [0],
      "pose_keypoints_2d": [x0, y0, c0, x1, y1, c1, ..., x24, y24, c24],
      "face_keypoints_2d": [x0, y0, c0, ..., x69, y69, c69],
      "hand_left_keypoints_2d": [x0, y0, c0, ..., x20, y20, c20],
      "hand_right_keypoints_2d": [x0, y0, c0, ..., x20, y20, c20],
      "pose_keypoints_3d": [],
      "face_keypoints_3d": [],
      "hand_left_keypoints_3d": [],
      "hand_right_keypoints_3d": []
    }
  ]
}
```

**Keypoint Format:**
- Each keypoint: `[x, y, confidence]`
- Coordinates: pixel positions in image
- Confidence: 0.0 to 1.0

**BODY_25 Model Keypoint Ordering:**
```
0: Nose, 1: Neck, 2: RShoulder, 3: RElbow, 4: RWrist,
5: LShoulder, 6: LElbow, 7: LWrist, 8: MidHip, 9: RHip,
10: RKnee, 11: RAnkle, 12: LHip, 13: LKnee, 14: LAnkle,
15: REye, 16: LEye, 17: REar, 18: LEar, 19: LBigToe,
20: LSmallToe, 21: LHeel, 22: RBigToe, 23: RSmallToe, 24: RHeel
```

---

## Video Search Using Pose Similarity

### Concept

Once videos are annotated with keypoints, you can search/match videos based on pose similarity using:

1. **Pose similarity metrics** (cosine similarity, L2 distance)
2. **Dynamic Time Warping (DTW)** for temporal alignment
3. **Action recognition** using nearest-neighbor search

### Implementation Approach

```python
import numpy as np
from scipy.spatial.distance import cosine
from dtaidistance import dtw
import json

class PoseSearchEngine:
    def __init__(self):
        self.video_database = {}

    def load_video_keypoints(self, video_id, keypoints_json_path):
        """Load keypoints for a video"""
        with open(keypoints_json_path, 'r') as f:
            data = json.load(f)

        # Extract pose sequences
        pose_sequence = []
        for frame in data:
            if frame['people']:
                # Use first person's pose
                pose = np.array(frame['people'][0]['pose_keypoints_2d'])
                pose = pose.reshape(-1, 3)  # (25, 3) for BODY_25
                pose_sequence.append(pose[:, :2])  # Only x, y coordinates

        self.video_database[video_id] = np.array(pose_sequence)

    def normalize_pose(self, pose):
        """Normalize pose to be scale and translation invariant"""
        # Center at origin (use hip center as reference)
        hip_center = pose[8]  # MidHip in BODY_25
        centered = pose - hip_center

        # Scale normalization (L2 norm)
        norm = np.linalg.norm(centered)
        if norm > 0:
            normalized = centered / norm
        else:
            normalized = centered

        return normalized

    def compute_frame_similarity(self, pose1, pose2):
        """Compute similarity between two poses"""
        # Normalize poses
        norm_pose1 = self.normalize_pose(pose1)
        norm_pose2 = self.normalize_pose(pose2)

        # Flatten and compute cosine similarity
        flat1 = norm_pose1.flatten()
        flat2 = norm_pose2.flatten()

        similarity = 1 - cosine(flat1, flat2)
        return similarity

    def compute_video_similarity_dtw(self, video_id1, video_id2):
        """Compute similarity between two videos using DTW"""
        seq1 = self.video_database[video_id1]
        seq2 = self.video_database[video_id2]

        # Normalize sequences
        norm_seq1 = np.array([self.normalize_pose(p).flatten() for p in seq1])
        norm_seq2 = np.array([self.normalize_pose(p).flatten() for p in seq2])

        # Compute DTW distance
        distance = dtw.distance(norm_seq1, norm_seq2)

        # Convert to similarity score (0-1 range)
        similarity = 1 / (1 + distance)

        return similarity, distance

    def search_similar_videos(self, query_video_id, top_k=5):
        """Find most similar videos to query"""
        results = []

        for video_id in self.video_database:
            if video_id == query_video_id:
                continue

            similarity, distance = self.compute_video_similarity_dtw(
                query_video_id, video_id
            )

            results.append({
                'video_id': video_id,
                'similarity': similarity,
                'dtw_distance': distance
            })

        # Sort by similarity
        results.sort(key=lambda x: x['similarity'], reverse=True)

        return results[:top_k]

    def search_by_action(self, query_keypoints_path, top_k=5):
        """Search for similar actions in database"""
        # Load query
        with open(query_keypoints_path, 'r') as f:
            query_data = json.load(f)

        query_sequence = []
        for frame in query_data:
            if frame['people']:
                pose = np.array(frame['people'][0]['pose_keypoints_2d'])
                pose = pose.reshape(-1, 3)
                query_sequence.append(pose[:, :2])

        query_sequence = np.array(query_sequence)

        # Compare with all videos
        results = []
        for video_id, video_seq in self.video_database.items():
            # Normalize
            norm_query = np.array([self.normalize_pose(p).flatten()
                                   for p in query_sequence])
            norm_video = np.array([self.normalize_pose(p).flatten()
                                   for p in video_seq])

            distance = dtw.distance(norm_query, norm_video)
            similarity = 1 / (1 + distance)

            results.append({
                'video_id': video_id,
                'similarity': similarity,
                'dtw_distance': distance
            })

        results.sort(key=lambda x: x['similarity'], reverse=True)
        return results[:top_k]

# Usage Example
search_engine = PoseSearchEngine()

# Index videos
search_engine.load_video_keypoints('video1', 'output/video1_keypoints.json')
search_engine.load_video_keypoints('video2', 'output/video2_keypoints.json')
search_engine.load_video_keypoints('video3', 'output/video3_keypoints.json')

# Search for similar videos
results = search_engine.search_similar_videos('video1', top_k=3)
print("Most similar videos to video1:")
for r in results:
    print(f"  {r['video_id']}: similarity={r['similarity']:.3f}")

# Search by specific action
action_results = search_engine.search_by_action('query_action.json', top_k=3)
print("\nVideos with similar actions:")
for r in action_results:
    print(f"  {r['video_id']}: similarity={r['similarity']:.3f}")
```

### Advanced Search Features

#### 1. Temporal Segmentation

```python
def segment_by_action(self, keypoints_sequence, window_size=30):
    """Segment video into action clips"""
    segments = []

    for i in range(0, len(keypoints_sequence) - window_size, window_size // 2):
        segment = keypoints_sequence[i:i+window_size]
        segments.append({
            'start_frame': i,
            'end_frame': i + window_size,
            'keypoints': segment
        })

    return segments
```

#### 2. Specific Pose Query

```python
def search_by_pose(self, target_pose, threshold=0.8):
    """Find frames matching a specific pose"""
    matches = []

    for video_id, sequence in self.video_database.items():
        for frame_idx, pose in enumerate(sequence):
            similarity = self.compute_frame_similarity(target_pose, pose)

            if similarity >= threshold:
                matches.append({
                    'video_id': video_id,
                    'frame': frame_idx,
                    'similarity': similarity
                })

    matches.sort(key=lambda x: x['similarity'], reverse=True)
    return matches
```

---

## Alternative Modern Solutions

### Comparison Table

| Feature | OpenPose | MediaPipe | YOLO Pose | YOLO-NAS Pose |
|---------|----------|-----------|-----------|---------------|
| **Installation** | Complex (build) | `pip install` | `pip install` | `pip install` |
| **Keypoints** | 135 (body+face+hands) | 33 (pose only) | 17 (COCO) | 17 (COCO) |
| **Multi-person** | Excellent | Good | Excellent | Excellent |
| **Speed (GPU)** | Fast | Very Fast | Very Fast | Very Fast |
| **Speed (CPU)** | Slow | Fast | Medium | Medium |
| **Accuracy** | High | Medium-High | High | Very High |
| **Mobile Support** | No | Yes | Limited | Limited |
| **Maintained** | Yes (2024) | Yes | Yes | Yes |

### When to Use Each

**Use OpenPose when:**
- Need detailed hand and face keypoints
- Maximum accuracy is required
- Multi-person precision is critical
- Have access to powerful GPU

**Use MediaPipe when:**
- Need quick deployment
- Working on mobile/edge devices
- CPU-only environment
- Real-time performance on low-power hardware

**Use YOLO Pose when:**
- Need state-of-the-art accuracy (2024/2025)
- Simple pip installation required
- Working with standard body poses
- Want best balance of speed and accuracy

---

## Recommended Implementation Approach

### For GPU Renting Servers (e.g., Vast.ai, RunPod, Lambda Labs)

#### Option A: Docker + OpenPose (Most Complete)

```dockerfile
# Dockerfile
FROM nvidia/cuda:11.8.0-cudnn8-devel-ubuntu22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    python3-pip \
    git \
    cmake \
    wget \
    libopencv-dev \
    jupyter-notebook

# Clone and build OpenPose
WORKDIR /opt
RUN git clone https://github.com/CMU-Perceptual-Computing-Lab/openpose
WORKDIR /opt/openpose
RUN mkdir build && cd build && \
    cmake -DBUILD_PYTHON=ON .. && \
    make -j$(nproc)

# Setup Python path
ENV PYTHONPATH="/opt/openpose/build/python:${PYTHONPATH}"

# Install additional Python packages
RUN pip3 install numpy opencv-python dtaidistance scipy matplotlib

WORKDIR /workspace
CMD ["jupyter", "notebook", "--ip=0.0.0.0", "--allow-root", "--no-browser"]
```

```bash
# Build and run
docker build -t openpose-jupyter .
docker run --gpus all -p 8888:8888 -v $(pwd):/workspace openpose-jupyter
```

#### Option B: YOLO Pose (Easiest, Modern)

```python
# requirements.txt
ultralytics
opencv-python
dtaidistance
numpy
scipy
matplotlib
jupyter

# Install
pip install -r requirements.txt

# notebook_setup.py
from ultralytics import YOLO
import cv2

# Download model (runs once)
model = YOLO('yolov8x-pose.pt')  # or yolo11x-pose.pt for latest

# Process video
results = model.predict(
    source='video.mp4',
    save=True,
    save_txt=True,
    project='output',
    name='run1'
)
```

### Complete Workflow Example

```python
# complete_workflow.ipynb

# 1. Setup
from ultralytics import YOLO
import json
import numpy as np
from pathlib import Path

# 2. Annotate videos
model = YOLO('yolov8x-pose.pt')

videos = ['video1.mp4', 'video2.mp4', 'video3.mp4']
output_dir = Path('annotations')
output_dir.mkdir(exist_ok=True)

for video_path in videos:
    results = model.predict(
        source=video_path,
        save=True,
        save_txt=True,
        project=str(output_dir),
        name=Path(video_path).stem
    )

# 3. Build search index
from pose_search import PoseSearchEngine

search_engine = PoseSearchEngine()

for video_path in videos:
    video_name = Path(video_path).stem
    keypoints_path = output_dir / video_name / 'keypoints.json'
    search_engine.load_video_keypoints(video_name, keypoints_path)

# 4. Search
similar = search_engine.search_similar_videos('video1', top_k=5)

# 5. Visualize results
import matplotlib.pyplot as plt

for result in similar:
    print(f"{result['video_id']}: {result['similarity']:.3f}")
```

---

## Conclusion

### Best Approach for Your Use Case

**For Video Annotation + Search on GPU Server:**

1. **Quick Start (Recommended):** Use **Ultralytics YOLO Pose**
   - Install: `pip install ultralytics`
   - Works immediately in Jupyter
   - Excellent accuracy and speed
   - Easy video batch processing

2. **Maximum Detail:** Use **Official OpenPose** via Docker
   - 135 keypoints (hands + face)
   - More complex setup
   - Best for research/precision work

3. **Lightweight Alternative:** Use **MediaPipe**
   - Fastest CPU performance
   - 33 keypoints
   - Best for mobile/edge deployment

### Next Steps

1. Choose your approach based on requirements
2. Set up Docker container on GPU server (if using OpenPose)
3. Process sample videos to generate keypoint annotations
4. Implement search functionality using DTW and pose similarity
5. Build index of your video dataset
6. Create search interface in Jupyter notebook

**Key Dependencies:**
```bash
pip install ultralytics opencv-python dtaidistance numpy scipy matplotlib jupyter
```

**Resources:**
- OpenPose: https://github.com/CMU-Perceptual-Computing-Lab/openpose
- Ultralytics YOLO: https://docs.ultralytics.com/
- MediaPipe: https://google.github.io/mediapipe/
- DTW: https://dtaidistance.readthedocs.io/
