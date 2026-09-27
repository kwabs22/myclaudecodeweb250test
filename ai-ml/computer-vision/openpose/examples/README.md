# AR and Pose Estimation Examples

This directory contains practical examples for AR overlays and 3D model attachment using pose estimation.

## Quick Start

### Install Dependencies

```bash
pip install -r requirements_ar.txt
```

### Run Examples

```bash
# Simple AR overlay with cubes on hands
python ar_pose_overlay_simple.py

# Virtual try-on demo
python ar_virtual_tryon.py
```

---

## Examples Overview

### 1. ar_pose_overlay_simple.py

**Simple AR Overlay Demo**

Attaches 3D objects (cubes and spheres) to your body using pose estimation. No OpenGL required!

**Features:**
- ✅ Real-time pose detection
- ✅ 3D cubes attached to hands
- ✅ 3D sphere on head
- ✅ Enhanced skeleton visualization
- ✅ Particle effects
- ✅ Toggle features on/off

**Controls:**
- `S` - Toggle skeleton
- `C` - Toggle cubes
- `P` - Toggle particles
- `Q` or `ESC` - Quit

**Screenshot Preview:**
```
+-----------------------------------+
|  AR Pose Overlay                  |
|  Skeleton: ON (S)                 |
|  Cubes: ON (C)                    |
|  Particles: OFF (P)               |
|                                   |
|     [You with 3D cubes on hands   |
|      and glowing skeleton]        |
|                                   |
+-----------------------------------+
```

---

### 2. ar_virtual_tryon.py

**Virtual Try-On Demo**

Try on virtual clothing and accessories in real-time!

**Features:**
- ✅ Hat overlay on head
- ✅ Glasses overlay on face
- ✅ Shirt overlay on torso
- ✅ Automatic rotation and scaling
- ✅ Tracks head movement

**Controls:**
- `1` - Hat
- `2` - Glasses
- `3` - Shirt
- `0` - None
- `Q` or `ESC` - Quit

**What Each Item Does:**
- **Hat:** Follows head position and rotation
- **Glasses:** Aligns with eyes, rotates with head
- **Shirt:** Fits to torso, scales with body size

---

## Technical Details

### How It Works

#### Pose Detection
```python
# MediaPipe detects 33 body keypoints
results = pose.process(frame)
landmarks = results.pose_landmarks.landmark

# Key landmarks used:
# 0: Nose
# 15: Left wrist
# 16: Right wrist
# 11, 12: Shoulders
# 23, 24: Hips
```

#### 3D Object Placement
```python
# Get keypoint position
right_wrist = landmarks[16]
x = int(right_wrist.x * width)
y = int(right_wrist.y * height)
z = right_wrist.z  # Depth

# Attach 3D object
draw_3d_cube(image, (x, y), depth=z)
```

#### Overlay Blending
```python
# Alpha blending for transparency
alpha = 0.7
result = cv2.addWeighted(frame, 1-alpha, overlay, alpha, 0)
```

---

## Customization Guide

### Adding Your Own 3D Models

#### Method 1: Simple 2D Projection (Current)

```python
def draw_your_object(image, position, size=50):
    """Draw custom 3D-looking object"""
    x, y = position

    # Draw your object using OpenCV
    cv2.circle(image, (x, y), size, (255, 0, 0), -1)
    # ... more drawing code

    return image
```

#### Method 2: Load Image Overlay

```python
# Load PNG with transparency
overlay_img = cv2.imread('your_object.png', cv2.IMREAD_UNCHANGED)

# Resize and position
overlay_resized = cv2.resize(overlay_img, (width, height))

# Blend with alpha channel
# (See ar_virtual_tryon.py overlay_image() function)
```

#### Method 3: Use 3D Models (Advanced)

For actual 3D models (OBJ, GLTF), use PyOpenGL (see AR-3D-MODEL-ATTACHMENT.md).

---

## Performance Tips

### 1. Optimize Resolution

```python
# Process at lower resolution
frame_small = cv2.resize(frame, (640, 480))
results = pose.process(frame_small)

# Scale keypoints back
keypoint.x *= (original_width / 640)
keypoint.y *= (original_height / 480)
```

### 2. Skip Frames

```python
frame_count = 0
last_result = None

if frame_count % 2 == 0:
    last_result = pose.process(frame)

frame_count += 1
```

### 3. Use Lite Model

```python
pose = mp.solutions.pose.Pose(
    model_complexity=0  # 0=lite, 1=full, 2=heavy
)
```

---

## Troubleshooting

### Camera Not Found

```python
# Try different camera IDs
ar_app = SimpleAROverlay(camera_id=1)  # or 2, 3, etc.

# List available cameras
import cv2
for i in range(5):
    cap = cv2.VideoCapture(i)
    if cap.isOpened():
        print(f"Camera {i} available")
        cap.release()
```

### Low FPS

**Solutions:**
1. Lower camera resolution
2. Use `model_complexity=0`
3. Process every 2nd or 3rd frame
4. Close other applications

### Objects Not Aligned

**Check:**
1. Keypoint visibility threshold (`landmark.visibility > 0.5`)
2. Z-depth scaling
3. Mirror flip (`cv2.flip()`)

### Import Errors

```bash
# Reinstall dependencies
pip uninstall opencv-python mediapipe
pip install opencv-python mediapipe
```

---

## Next Steps

### Easy Improvements

1. **Add More Objects**
   ```python
   # Add crown, cape, wings, etc.
   crown = create_crown(width, height)
   overlay_image(frame, crown, head_position)
   ```

2. **Load Custom Images**
   ```python
   hat_img = cv2.imread('custom_hat.png', cv2.IMREAD_UNCHANGED)
   # Use in overlay_image()
   ```

3. **Add Animations**
   ```python
   # Rotate object over time
   angle = (frame_count * 2) % 360
   overlay_image(frame, object, position, angle=angle)
   ```

### Advanced Projects

1. **Full-Body Avatar** - Map all keypoints to rigged 3D character
2. **Motion Capture** - Record pose data to BVH format
3. **AR Game** - Use pose as game controller
4. **Fitness Trainer** - Compare pose to reference pose
5. **Dance App** - Track dance moves

See **AR-3D-MODEL-ATTACHMENT.md** for advanced techniques!

---

## Integration with Main Project

These examples integrate with the main OpenPose research:

```python
# Use with pose_search.py
from pose_search import PoseSearchEngine

# Record AR session keypoints
search_engine = PoseSearchEngine()
search_engine.load_video_keypoints('ar_session', 'keypoints.json')

# Search for similar poses
results = search_engine.search_similar_videos('ar_session', top_k=5)
```

---

## Resources

- **Main Documentation:** `../AR-3D-MODEL-ATTACHMENT.md`
- **OpenPose Research:** `../openpose-research.md`
- **Quick Start:** `../QUICKSTART.md`

---

## FAQ

**Q: Can I use YOLO Pose instead of MediaPipe?**
A: Yes! Replace MediaPipe with YOLO:
```python
from ultralytics import YOLO
model = YOLO('yolov8n-pose.pt')
results = model(frame)
```

**Q: How do I save the AR video?**
A: Add video writer:
```python
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter('output.mp4', fourcc, 30.0, (width, height))

# In loop
out.write(frame)

# After loop
out.release()
```

**Q: Can this work on mobile?**
A: For mobile, use:
- MediaPipe Android/iOS SDK
- Web version (Three.js + TensorFlow.js)
- React Native with MediaPipe

**Q: How to add hand tracking?**
A: Enable hands in MediaPipe:
```python
hands = mp.solutions.hands.Hands()
hand_results = hands.process(frame)
```

---

## Contributing

Feel free to:
- Add more AR effects
- Create new examples
- Optimize performance
- Share your creations!

---

**Happy AR Development!** 🎭✨🎨
