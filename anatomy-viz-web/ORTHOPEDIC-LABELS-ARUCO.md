# Orthopedic Labels & ArUco Marker Detection

## Overview

The anatomy visualization app now includes:
1. **Orthopedic anatomical labels** - Medical terminology for bones and joints
2. **ArUco marker detection** - Stable visual anchors for AR placement

---

## 📝 Orthopedic Labels Feature

### What Are They?

Anatomical labels overlaid on detected body parts showing proper medical/orthopedic terminology. Perfect for educational use, medical training, or studying human anatomy.

### Label Types

**Joints (Red borders):**
- L./R. Glenohumeral (Shoulder Joint)
- L./R. Elbow (Humeroulnar Joint)
- L./R. Wrist (Radiocarpal Joint)
- L./R. Hip (Acetabulofemoral)
- L./R. Knee (Tibiofemoral Joint)
- L./R. Ankle (Talocrural Joint)

**Bones (Beige borders):**
- L./R. Humerus (Upper Arm Bone)
- L./R. Radius/Ulna (Forearm Bones)
- L./R. Femur (Thigh Bone)
- L./R. Tibia/Fibula (Lower Leg Bones)
- Pelvis (Hip Girdle)
- Clavicles (Collar Bones)

### How to Use

1. **Enable Skeleton Layer:** Click `🦴 Skeleton` button
2. **Enable Labels:** Click `📝 Labels` button
3. **Stand in Frame:** Labels appear automatically on detected joints/bones
4. **Move Around:** Labels follow your movement in real-time

### Label Colors

- **Red** = Joints (articulation points)
- **Beige** = Bones (skeletal segments)
- **Cyan** = Other anatomical features

### Educational Uses

- **Medical Students:** Learn proper anatomical terminology
- **Physical Therapy:** Identify specific joints for exercises
- **Fitness Training:** Understand muscle-skeletal connections
- **Patient Education:** Explain injuries/conditions with visual aids

---

## 🎲 ArUco Marker Detection

### What Is ArUco?

ArUco markers are square fiducial markers (like QR codes) used in computer vision for:
- Stable AR anchoring (markers don't move like body parts)
- Pose estimation (camera position relative to marker)
- Coordinate system definition
- Multi-camera calibration

### Why Use ArUco with Pose Detection?

**Pose Detection (Body Tracking):**
- ✅ Tracks moving subjects
- ❌ Unstable when person moves out of frame
- ❌ No absolute position reference

**ArUco Markers:**
- ✅ Stable reference points in physical space
- ✅ Persist even when not visible (can use last known position)
- ✅ Define coordinate system for world-space AR
- ❌ Don't track people

**Combined System:**
- Body tracking for anatomy visualization
- Markers for stable AR object placement
- Best of both worlds!

### How to Use

#### Step 1: Generate ArUco Markers

**Online Generator:**
- Visit: https://chev.me/arucogen/
- Dictionary: `4x4 (50 markers)`
- IDs: 0-49
- Marker size: 200mm (or desired size)
- Download and print markers

**Using OpenCV (Python):**
```python
import cv2
import numpy as np

# Generate marker ID 0
aruco_dict = cv2.aruco.Dictionary_get(cv2.aruco.DICT_4X4_50)
marker = cv2.aruco.drawMarker(aruco_dict, 0, 200)  # 200x200 pixels
cv2.imwrite('aruco_marker_0.png', marker)
```

#### Step 2: Print & Mount Markers

1. Print markers on white paper
2. Mount on rigid surface (cardboard, foam board)
3. Place in environment:
   - On walls at different heights
   - On floor for ground reference
   - On tables/furniture
4. Ensure good lighting (no shadows on markers)

#### Step 3: Enable Detection in App

1. **Open App:** Navigate to `http://localhost:8000`
2. **Enable ArUco:** Click `🎲 ArUco` button
3. **Point Camera:** Aim at printed markers
4. **Detection:** Green outline appears around markers with ID label

### Supported Markers

- **Dictionary:** DICT_4X4_50
- **IDs:** 0-49 (50 unique markers)
- **Size:** Any (recommend 100mm-300mm for phone cameras)

### Detection Performance

- **FPS Impact:** Runs every 3 frames to maintain performance
- **Range:** 0.5m to 5m depending on marker size
- **Accuracy:** Sub-pixel corner detection
- **Lighting:** Requires good contrast (avoid shadows)

---

## 🎯 Combining Features for Advanced AR

### Use Case 1: Anchored Anatomy Education

**Setup:**
1. Place ArUco marker on wall at chest height
2. Stand in front of marker
3. Enable: Skeleton + Labels + ArUco

**Result:**
- Skeleton tracks your body
- Labels show anatomical terms
- Marker provides stable reference
- AR objects can be anchored to marker (future feature)

### Use Case 2: Motion Analysis with Fixed Reference

**Setup:**
1. Place markers at known distances (e.g., 1m apart)
2. Perform movement (squat, lunge, etc.)
3. Enable: Skeleton + Keypoints + ArUco

**Result:**
- Track joint angles relative to fixed markers
- Measure movement distance using marker positions
- Analyze posture relative to vertical/horizontal references

### Use Case 3: Multi-Person Training

**Setup:**
1. Each person wears/holds different ArUco markers
2. Multiple people in frame
3. Enable: All layers

**Result:**
- Markers identify different people
- Skeleton tracking for each person
- AR objects can be assigned per person (future)

---

## Technical Details

### ArUco Detection Algorithm

```javascript
// Simplified detection flow
1. Convert video frame to grayscale
2. Detect square contours
3. Decode marker ID from binary pattern
4. Extract 4 corner coordinates
5. Draw overlay on canvas
```

### Label Positioning Logic

**Joints:**
- Single keypoint labels (e.g., elbow = keypoint 13)
- Label placed directly at keypoint location

**Bones:**
- Two keypoint labels (e.g., humerus = keypoints 11→13)
- Label placed at midpoint between keypoints

### Confidence Thresholds

- Labels only show for keypoints with confidence > 0.2
- Ensures labels don't appear on false detections
- Adjust in code: `if (kp.score > 0.2)`

---

## Debugging

### Labels Not Appearing

**Check:**
- ✅ Skeleton layer enabled?
- ✅ Labels layer enabled?
- ✅ Person in frame with good lighting?
- ✅ Debug panel shows "Pose: Detected"?
- ✅ Keypoint confidence > 0.2?

**Fix:**
- Improve lighting
- Move back from camera
- Check debug panel for confidence scores

### ArUco Not Detecting

**Check:**
- ✅ OpenCV loaded? (Debug panel: "OpenCV: Ready")
- ✅ ArUco layer enabled?
- ✅ Marker is DICT_4X4_50?
- ✅ Marker clearly visible (no glare/shadows)?
- ✅ Marker size appropriate for distance?

**Fix:**
- Wait for OpenCV to load (takes 3-5 seconds)
- Use larger markers for farther distances
- Ensure marker is flat and well-lit
- Try different marker IDs (0-49)

### Performance Issues

**Symptoms:**
- FPS drops below 10
- Laggy video feed
- Delayed responses

**Solutions:**
- Disable ArUco layer when not needed
- Reduce video resolution (edit code: 640x480 → 320x240)
- Close other browser tabs
- Use desktop instead of mobile

---

## Future Enhancements

**Planned Features:**
- [ ] AR objects anchored to specific markers
- [ ] Marker-based coordinate system for measurements
- [ ] Distance/angle calculations using markers + keypoints
- [ ] Save marker configurations for environments
- [ ] Multi-marker bundle support
- [ ] Marker pose estimation (3D orientation)
- [ ] Integration with depth sensors

**Advanced AR:**
- [ ] Place 3D models on markers
- [ ] Marker-to-keypoint relationships (e.g., "shoulder 30cm from marker 0")
- [ ] Persistent AR scenes (markers remember placed objects)
- [ ] Export marker+pose data for external analysis

---

## Educational Resources

### Learn More About Anatomy

- **Joints:** https://www.kenhub.com/en/library/anatomy/joints
- **Bones:** https://www.kenhub.com/en/library/anatomy/bones
- **Orthopedic Terminology:** https://orthoinfo.aaos.org/

### Learn More About ArUco

- **OpenCV ArUco Tutorial:** https://docs.opencv.org/4.x/d5/dae/tutorial_aruco_detection.html
- **ArUco Applications:** https://www.uco.es/investiga/grupos/ava/node/26
- **Marker Generation:** https://chev.me/arucogen/

---

## Example Workflows

### Workflow 1: Teaching Basic Anatomy

```
1. Print 2-3 ArUco markers (IDs 0, 1, 2)
2. Place on wall behind subject
3. Enable: Skeleton + Labels
4. Point to joints while labels show medical names
5. Student learns: "Elbow = Humeroulnar Joint"
```

### Workflow 2: Analyzing Joint Angles

```
1. Place markers at known positions
2. Enable: Skeleton + Keypoints + ArUco
3. Perform movement (e.g., squat)
4. Observe joint angles in real-time
5. Use markers as reference for alignment
```

### Workflow 3: Creating AR Learning Scenes

```
1. Set up markers in classroom
2. Enable: All layers
3. Place AR annotations near specific markers
4. Students can explore anatomy in 3D space
5. Markers keep annotations stable even when moving
```

---

## Keyboard Shortcuts

- `L` - Toggle Labels
- `A` - Toggle ArUco
- `S` - Toggle Skeleton
- `D` - Toggle Debug Panel

*(Note: Keyboard shortcuts not yet implemented - future feature)*

---

## Credits

- **Pose Detection:** TensorFlow.js BlazePose model
- **ArUco Detection:** OpenCV.js
- **Anatomical Data:** Medical terminology standards
- **UI Framework:** Vanilla JavaScript + Canvas API

---

## License

Educational use only. ArUco is part of OpenCV (BSD license). Anatomical terminology is public domain.
