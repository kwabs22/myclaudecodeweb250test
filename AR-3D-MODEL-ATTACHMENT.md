# AR and 3D Model Attachment Using Pose Estimation

**Research Date:** 2025-11-17

## Overview

Yes! Pose estimation (OpenPose, YOLO Pose, MediaPipe) enables you to attach AR elements and 3D models (including rigged/animated characters) to people in camera view in real-time. This document covers the complete workflow, tools, and implementations.

---

## Table of Contents

1. [What's Possible](#whats-possible)
2. [Technical Approaches](#technical-approaches)
3. [Tools and Frameworks](#tools-and-frameworks)
4. [Implementation Methods](#implementation-methods)
5. [Real-Time AR Overlay (Python + OpenCV)](#real-time-ar-overlay-python--opencv)
6. [3D Character Animation (Unity/Unreal)](#3d-character-animation-unityunreal)
7. [Web-Based AR (Three.js)](#web-based-ar-threejs)
8. [Motion Capture and Retargeting](#motion-capture-and-retargeting)
9. [Blender Integration](#blender-integration)
10. [Complete Examples](#complete-examples)

---

## What's Possible

### Real-Time AR Applications

Using pose estimation keypoints, you can:

1. **Virtual Try-On**
   - Overlay clothing on detected body
   - Adjust garments to body pose
   - Real-time fitting visualization

2. **AR Filters & Effects**
   - Attach 3D objects to body parts
   - Particle effects following skeleton
   - Interactive elements responding to movement

3. **Character Animation**
   - Animate 3D characters matching user pose
   - Real-time motion capture
   - Puppeteering rigged models

4. **Sports Analysis**
   - Overlay form guides
   - Show ideal vs actual pose
   - Movement correction visualization

5. **Gaming & Entertainment**
   - Full-body game controls
   - Avatar mirroring
   - Interactive performances

6. **Training & Education**
   - Yoga/fitness pose correction
   - Dance instruction overlays
   - Medical training visualization

---

## Technical Approaches

### Approach 1: 2D Overlay (Fastest)

**Process:**
1. Detect pose keypoints (2D coordinates)
2. Draw 2D graphics at keypoint positions
3. Apply transformations based on skeleton angles

**Use Cases:**
- Simple AR filters
- 2D character overlays
- Basic visualization

**Performance:** 30-60 FPS on GPU

### Approach 2: 2D-to-3D Projection

**Process:**
1. Detect 2D pose keypoints
2. Estimate depth using additional models
3. Project 3D models onto 2D keypoint positions
4. Render with perspective matching

**Use Cases:**
- 3D object attachment
- Depth-aware overlays
- Simple 3D effects

**Performance:** 20-40 FPS on GPU

### Approach 3: Full 3D Reconstruction

**Process:**
1. Multi-camera setup or depth camera
2. Reconstruct full 3D skeleton
3. Map to rigged 3D character
4. Render animated character

**Use Cases:**
- High-quality motion capture
- Professional animation
- Research applications

**Performance:** 15-30 FPS (depending on complexity)

### Approach 4: Skeletal Retargeting

**Process:**
1. Detect pose keypoints
2. Map to skeleton rig (BVH/FBX)
3. Retarget to character skeleton
4. Render animated character

**Use Cases:**
- Character animation
- Game development
- VFX production

**Performance:** 20-30 FPS on GPU

---

## Tools and Frameworks

### Pose Estimation Libraries

| Library | Keypoints | Best For | Platform |
|---------|-----------|----------|----------|
| **OpenPose** | 135 (body+hands+face) | Max detail | Desktop |
| **MediaPipe** | 33 (pose) + 21 (hands) + 468 (face) | Real-time, mobile | All |
| **YOLO Pose** | 17 (body) | Speed + accuracy | Desktop, edge |
| **AlphaPose** | 17-26 | Multi-person | Desktop |

### 3D Rendering Frameworks

#### Desktop Applications

**PyOpenGL + OpenCV** (Python)
- ✅ Direct hardware acceleration
- ✅ Full OpenGL control
- ✅ Good for prototyping
- ❌ More complex setup

**Pygame + OpenGL** (Python)
- ✅ Game engine features
- ✅ Easy window management
- ✅ Community support
- ❌ Moderate performance

**VPython** (Python)
- ✅ Very simple 3D graphics
- ✅ Educational friendly
- ✅ Quick prototyping
- ❌ Limited features

#### Game Engines

**Unity** (C#)
- ✅ Full game engine
- ✅ AR Foundation support
- ✅ Asset store
- ✅ Cross-platform
- ❌ Learning curve

**Unreal Engine** (C++/Blueprints)
- ✅ AAA quality
- ✅ Real-time rendering
- ✅ Animation tools
- ❌ Heavy resource usage

#### Web-Based

**Three.js** (JavaScript)
- ✅ Browser-based
- ✅ WebGL powered
- ✅ Easy deployment
- ✅ Large community
- ❌ Performance limits

**Babylon.js** (JavaScript)
- ✅ Web-first design
- ✅ VR/AR support
- ✅ Physics engine
- ❌ Smaller ecosystem

**A-Frame** (HTML/JavaScript)
- ✅ Declarative syntax
- ✅ VR/AR focused
- ✅ Easy to learn
- ❌ Less control

### 3D Model Formats

| Format | Use Case | Support |
|--------|----------|---------|
| **FBX** | Animation, rigging | Unity, Unreal, Blender |
| **GLTF/GLB** | Web 3D, AR | Three.js, Babylon.js |
| **BVH** | Motion capture | Blender, MotionBuilder |
| **OBJ** | Static models | All platforms |
| **Collada (DAE)** | Cross-platform | Most engines |

---

## Implementation Methods

### Method 1: Real-Time Overlay with OpenCV + PyOpenGL

This is the most direct approach for desktop applications.

**Architecture:**
```
Camera → Pose Detection → Keypoint Processing → 3D Rendering → Display
   ↓           ↓                  ↓                   ↓            ↓
OpenCV   MediaPipe/YOLO    Coordinate Mapping    PyOpenGL    OpenCV/Display
```

**Pros:**
- Full control
- Low latency
- Python-based
- Good performance

**Cons:**
- Manual 3D programming
- Complex camera matrix setup
- Limited to desktop

### Method 2: Game Engine Integration (Unity/Unreal)

Use game engines for professional-quality AR.

**Architecture:**
```
Camera → Plugin → Pose Data → Game Engine → Render
   ↓        ↓          ↓            ↓          ↓
WebCam  Barracuda  JSON/Stream   Animation   Display
```

**Pros:**
- Professional tools
- Built-in animation
- Asset pipelines
- Cross-platform

**Cons:**
- Steeper learning curve
- Larger project size
- Build times

### Method 3: Web-Based AR (Three.js + TensorFlow.js)

Browser-based AR for easy distribution.

**Architecture:**
```
Webcam → TF.js Pose → Three.js Scene → WebGL Render
   ↓         ↓              ↓              ↓
getUserMedia PoseNet  3D Models       Browser
```

**Pros:**
- No installation
- Cross-platform
- Easy sharing
- Rapid development

**Cons:**
- Performance limitations
- Browser security restrictions
- Limited to web standards

---

## Real-Time AR Overlay (Python + OpenCV)

### Complete Implementation

```python
import cv2
import mediapipe as mp
import numpy as np
from OpenGL.GL import *
from OpenGL.GLU import *
import pygame
from pygame.locals import *

class ARPoseOverlay:
    """Real-time AR overlay system using pose estimation"""

    def __init__(self, camera_id=0, width=1280, height=720):
        # Initialize MediaPipe Pose
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
            model_complexity=1
        )

        # Camera setup
        self.cap = cv2.VideoCapture(camera_id)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

        self.width = width
        self.height = height

        # Pygame/OpenGL setup
        pygame.init()
        self.screen = pygame.display.set_mode((width, height), DOUBLEBUF | OPENGL)
        pygame.display.set_caption("AR Pose Overlay")

        # OpenGL camera setup
        self.setup_opengl()

    def setup_opengl(self):
        """Configure OpenGL for AR rendering"""
        glViewport(0, 0, self.width, self.height)
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        gluPerspective(45, (self.width / self.height), 0.1, 50.0)
        glMatrixMode(GL_MODELVIEW)

        # Enable depth testing and blending
        glEnable(GL_DEPTH_TEST)
        glEnable(GL_BLEND)
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)

    def world_to_screen(self, landmark):
        """Convert MediaPipe 3D landmark to screen coordinates"""
        x = landmark.x * self.width
        y = landmark.y * self.height
        z = landmark.z  # Depth (relative)

        return x, y, z

    def draw_3d_cube(self, position, size=0.2, color=(1, 0, 0, 0.7)):
        """Draw a 3D cube at specified position"""
        x, y, z = position

        # Convert to OpenGL coordinate system
        gl_x = (x / self.width) * 2 - 1
        gl_y = 1 - (y / self.height) * 2
        gl_z = -3 + z * 2  # Adjust depth

        glPushMatrix()
        glTranslatef(gl_x, gl_y, gl_z)
        glRotatef(pygame.time.get_ticks() * 0.1, 1, 1, 0)  # Rotate

        glBegin(GL_QUADS)
        glColor4f(*color)

        # Draw cube faces
        vertices = [
            [size, size, -size], [-size, size, -size], [-size, size, size], [size, size, size],  # Top
            [size, -size, size], [-size, -size, size], [-size, -size, -size], [size, -size, -size],  # Bottom
            [size, size, size], [-size, size, size], [-size, -size, size], [size, -size, size],  # Front
            [size, -size, -size], [-size, -size, -size], [-size, size, -size], [size, size, -size],  # Back
            [-size, size, size], [-size, size, -size], [-size, -size, -size], [-size, -size, size],  # Left
            [size, size, -size], [size, size, size], [size, -size, size], [size, -size, -size]  # Right
        ]

        for vertex in vertices:
            glVertex3fv(vertex)

        glEnd()
        glPopMatrix()

    def draw_3d_sphere(self, position, radius=0.1, color=(0, 1, 0, 0.8)):
        """Draw a 3D sphere at keypoint"""
        x, y, z = position
        gl_x = (x / self.width) * 2 - 1
        gl_y = 1 - (y / self.height) * 2
        gl_z = -3 + z * 2

        glPushMatrix()
        glTranslatef(gl_x, gl_y, gl_z)
        glColor4f(*color)

        # Draw sphere using GLU
        quadric = gluNewQuadric()
        gluSphere(quadric, radius, 20, 20)

        glPopMatrix()

    def draw_skeleton_3d(self, landmarks):
        """Draw 3D skeleton with cylinders connecting joints"""
        # MediaPipe Pose connections
        connections = [
            (11, 12),  # Shoulders
            (11, 13), (13, 15),  # Left arm
            (12, 14), (14, 16),  # Right arm
            (11, 23), (12, 24),  # Torso
            (23, 24),  # Hips
            (23, 25), (25, 27),  # Left leg
            (24, 26), (26, 28),  # Right leg
        ]

        glLineWidth(5.0)
        glBegin(GL_LINES)
        glColor4f(0, 1, 1, 0.8)

        for start_idx, end_idx in connections:
            if start_idx < len(landmarks) and end_idx < len(landmarks):
                start = self.world_to_screen(landmarks[start_idx])
                end = self.world_to_screen(landmarks[end_idx])

                # Convert to OpenGL coords
                start_gl = [(start[0] / self.width) * 2 - 1,
                           1 - (start[1] / self.height) * 2,
                           -3 + start[2] * 2]
                end_gl = [(end[0] / self.width) * 2 - 1,
                         1 - (end[1] / self.height) * 2,
                         -3 + end[2] * 2]

                glVertex3fv(start_gl)
                glVertex3fv(end_gl)

        glEnd()

    def render_video_background(self, frame):
        """Render video frame as background texture"""
        # Convert to RGB
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_rgb = cv2.flip(frame_rgb, 0)  # Flip for OpenGL

        # Create texture
        glEnable(GL_TEXTURE_2D)
        texture = glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D, texture)
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, self.width, self.height,
                     0, GL_RGB, GL_UNSIGNED_BYTE, frame_rgb)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR)

        # Draw background quad
        glMatrixMode(GL_PROJECTION)
        glPushMatrix()
        glLoadIdentity()
        glOrtho(0, 1, 0, 1, -1, 1)
        glMatrixMode(GL_MODELVIEW)
        glPushMatrix()
        glLoadIdentity()

        glBegin(GL_QUADS)
        glTexCoord2f(0, 0); glVertex2f(0, 0)
        glTexCoord2f(1, 0); glVertex2f(1, 0)
        glTexCoord2f(1, 1); glVertex2f(1, 1)
        glTexCoord2f(0, 1); glVertex2f(0, 1)
        glEnd()

        glMatrixMode(GL_PROJECTION)
        glPopMatrix()
        glMatrixMode(GL_MODELVIEW)
        glPopMatrix()

        glDisable(GL_TEXTURE_2D)
        glDeleteTextures([texture])

    def run(self):
        """Main AR loop"""
        clock = pygame.time.Clock()
        running = True

        while running:
            # Handle events
            for event in pygame.event.get():
                if event.type == QUIT or (event.type == KEYDOWN and event.key == K_ESCAPE):
                    running = False

            # Capture frame
            ret, frame = self.cap.read()
            if not ret:
                break

            # Process pose
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(frame_rgb)

            # Clear buffers
            glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)

            # Render video background
            self.render_video_background(frame)

            # Draw 3D AR content if pose detected
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark

                # Draw 3D skeleton
                self.draw_skeleton_3d(landmarks)

                # Draw 3D objects at keypoints
                # Example: Cube on right hand
                right_hand = self.world_to_screen(landmarks[16])
                self.draw_3d_cube(right_hand, size=0.15, color=(1, 0, 0, 0.7))

                # Example: Cube on left hand
                left_hand = self.world_to_screen(landmarks[15])
                self.draw_3d_cube(left_hand, size=0.15, color=(0, 0, 1, 0.7))

                # Example: Sphere on nose
                nose = self.world_to_screen(landmarks[0])
                self.draw_3d_sphere(nose, radius=0.1, color=(1, 1, 0, 0.8))

                # Draw spheres on all joints
                for idx in [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]:
                    pos = self.world_to_screen(landmarks[idx])
                    self.draw_3d_sphere(pos, radius=0.05, color=(0, 1, 0, 0.8))

            # Update display
            pygame.display.flip()
            clock.tick(60)

        self.cleanup()

    def cleanup(self):
        """Clean up resources"""
        self.cap.release()
        self.pose.close()
        pygame.quit()

# Usage
if __name__ == "__main__":
    ar_app = ARPoseOverlay(camera_id=0, width=1280, height=720)
    ar_app.run()
```

### Usage

```bash
# Install dependencies
pip install opencv-python mediapipe pygame PyOpenGL PyOpenGL_accelerate

# Run
python ar_pose_overlay.py
```

**Features:**
- ✅ Real-time video background
- ✅ 3D objects attached to keypoints
- ✅ 3D skeleton visualization
- ✅ Multiple object types (cubes, spheres)
- ✅ Transparency support
- ✅ 60 FPS on GPU

---

## 3D Character Animation (Unity/Unreal)

### Unity Implementation

#### 1. Setup Unity Project

```csharp
// PoseReceiver.cs - Receives pose data from Python
using UnityEngine;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

public class PoseReceiver : MonoBehaviour
{
    public Animator characterAnimator;
    public Transform[] bones;  // Map to pose keypoints

    private UdpClient udpClient;
    private Thread receiveThread;
    private string receivedData;

    void Start()
    {
        udpClient = new UdpClient(5000);
        receiveThread = new Thread(new ThreadStart(ReceiveData));
        receiveThread.IsBackground = true;
        receiveThread.Start();
    }

    void ReceiveData()
    {
        while (true)
        {
            try
            {
                IPEndPoint remoteEP = new IPEndPoint(IPAddress.Any, 5000);
                byte[] data = udpClient.Receive(ref remoteEP);
                receivedData = Encoding.UTF8.GetString(data);
            }
            catch (System.Exception e)
            {
                Debug.Log(e.ToString());
            }
        }
    }

    void Update()
    {
        if (!string.IsNullOrEmpty(receivedData))
        {
            ApplyPoseToCharacter(receivedData);
        }
    }

    void ApplyPoseToCharacter(string poseJson)
    {
        // Parse JSON and map to character skeleton
        PoseData pose = JsonUtility.FromJson<PoseData>(poseJson);

        // Map keypoints to character bones
        // Example: Right shoulder
        if (bones.Length > 12)
        {
            bones[12].position = new Vector3(
                pose.keypoints[12].x,
                pose.keypoints[12].y,
                pose.keypoints[12].z
            );
        }

        // Apply inverse kinematics for natural movement
        // Use Unity's Animation Rigging package
    }

    void OnApplicationQuit()
    {
        receiveThread.Abort();
        udpClient.Close();
    }
}

[System.Serializable]
public class PoseData
{
    public Keypoint[] keypoints;
}

[System.Serializable]
public class Keypoint
{
    public float x, y, z;
}
```

#### 2. Python Pose Sender

```python
import socket
import json
import cv2
import mediapipe as mp

class PoseSender:
    def __init__(self, unity_ip="127.0.0.1", unity_port=5000):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.unity_address = (unity_ip, unity_port)

        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose()

    def send_pose(self, landmarks):
        """Send pose data to Unity"""
        keypoints = []
        for landmark in landmarks:
            keypoints.append({
                'x': landmark.x,
                'y': landmark.y,
                'z': landmark.z
            })

        data = json.dumps({'keypoints': keypoints})
        self.sock.sendto(data.encode(), self.unity_address)

    def run(self):
        cap = cv2.VideoCapture(0)

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            results = self.pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            if results.pose_landmarks:
                self.send_pose(results.pose_landmarks.landmark)

            cv2.imshow('Pose Detection', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    sender = PoseSender()
    sender.run()
```

### Unreal Engine Implementation

Use the **Unreal Engine Live Link** plugin:

1. Install Live Link plugin
2. Create Live Link source for pose data
3. Map to character blueprint
4. Apply to rigged character

---

## Web-Based AR (Three.js)

### Complete Web AR Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AR Pose Overlay - Three.js</title>
    <style>
        body { margin: 0; overflow: hidden; }
        #video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        #canvas { position: absolute; top: 0; left: 0; }
    </style>
</head>
<body>
    <video id="video" autoplay playsinline></video>
    <canvas id="canvas"></canvas>

    <script src="https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection"></script>
    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose"></script>

    <script>
        let video, canvas, ctx;
        let scene, camera, renderer;
        let detector;
        let cubes = [];

        async function setupCamera() {
            video = document.getElementById('video');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 }
            });
            video.srcObject = stream;
            await video.play();
        }

        async function setupPoseDetection() {
            const model = poseDetection.SupportedModels.MediaPipePose;
            detector = await poseDetection.createDetector(model, {
                runtime: 'tfjs',
                modelType: 'full'
            });
        }

        function setupThreeJS() {
            canvas = document.getElementById('canvas');
            canvas.width = 1280;
            canvas.height = 720;

            // Scene
            scene = new THREE.Scene();

            // Camera
            camera = new THREE.PerspectiveCamera(
                75,
                canvas.width / canvas.height,
                0.1,
                1000
            );
            camera.position.z = 5;

            // Renderer
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true
            });
            renderer.setSize(canvas.width, canvas.height);

            // Lighting
            const light = new THREE.PointLight(0xffffff, 1, 100);
            light.position.set(0, 0, 10);
            scene.add(light);

            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);
        }

        function createCube(position, color) {
            const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.8
            });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(position.x, position.y, position.z);
            scene.add(cube);
            return cube;
        }

        function worldToScreen(keypoint, videoWidth, videoHeight) {
            // Convert keypoint to Three.js coordinates
            const x = (keypoint.x / videoWidth) * 10 - 5;
            const y = -(keypoint.y / videoHeight) * 10 + 5;
            const z = keypoint.z ? keypoint.z * 5 : 0;
            return { x, y, z };
        }

        async function detectPose() {
            const poses = await detector.estimatePoses(video);

            // Clear previous cubes
            cubes.forEach(cube => scene.remove(cube));
            cubes = [];

            if (poses.length > 0) {
                const pose = poses[0];
                const keypoints = pose.keypoints;

                // Draw cubes on specific keypoints
                // Right wrist (index 16)
                if (keypoints[16].score > 0.3) {
                    const pos = worldToScreen(keypoints[16], video.videoWidth, video.videoHeight);
                    const cube = createCube(pos, 0xff0000);
                    cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01;
                    cubes.push(cube);
                }

                // Left wrist (index 15)
                if (keypoints[15].score > 0.3) {
                    const pos = worldToScreen(keypoints[15], video.videoWidth, video.videoHeight);
                    const cube = createCube(pos, 0x0000ff);
                    cube.rotation.x += 0.01;
                    cube.rotation.y += 0.01;
                    cubes.push(cube);
                }

                // Draw skeleton
                drawSkeleton(keypoints);
            }
        }

        function drawSkeleton(keypoints) {
            const connections = [
                [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
                [11, 23], [12, 24], [23, 24],
                [23, 25], [25, 27], [24, 26], [26, 28]
            ];

            connections.forEach(([start, end]) => {
                if (keypoints[start].score > 0.3 && keypoints[end].score > 0.3) {
                    const startPos = worldToScreen(keypoints[start], video.videoWidth, video.videoHeight);
                    const endPos = worldToScreen(keypoints[end], video.videoWidth, video.videoHeight);

                    // Create line
                    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
                    const points = [
                        new THREE.Vector3(startPos.x, startPos.y, startPos.z),
                        new THREE.Vector3(endPos.x, endPos.y, endPos.z)
                    ];
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, material);
                    scene.add(line);
                    cubes.push(line);  // For cleanup
                }
            });
        }

        function animate() {
            requestAnimationFrame(animate);

            // Detect pose
            detectPose();

            // Animate cubes
            cubes.forEach(cube => {
                if (cube.rotation) {
                    cube.rotation.x += 0.02;
                    cube.rotation.y += 0.02;
                }
            });

            // Render
            renderer.render(scene, camera);
        }

        async function init() {
            await setupCamera();
            await setupPoseDetection();
            setupThreeJS();
            animate();
        }

        init();
    </script>
</body>
</html>
```

### Features
- ✅ Browser-based, no installation
- ✅ Real-time 3D overlays
- ✅ MediaPipe pose detection
- ✅ Three.js 3D rendering
- ✅ Works on mobile

---

## Motion Capture and Retargeting

### BVH File Format

BVH (Biovision Hierarchy) is the standard format for motion capture data.

**Structure:**
```
HIERARCHY
ROOT Hips
{
  OFFSET 0.00 0.00 0.00
  CHANNELS 6 Xposition Yposition Zposition Zrotation Xrotation Yrotation
  JOINT Chest
  {
    OFFSET 0.00 5.21 0.00
    CHANNELS 3 Zrotation Xrotation Yrotation
    ...
  }
}
MOTION
Frames: 100
Frame Time: 0.033333
<motion data>
```

### Converting Pose to BVH

```python
import numpy as np

class PoseToBVH:
    """Convert pose estimation keypoints to BVH format"""

    def __init__(self):
        self.frames = []
        self.fps = 30

    def add_frame(self, keypoints):
        """Add a frame of keypoints"""
        # Convert to BVH joint angles
        joint_angles = self.calculate_joint_angles(keypoints)
        self.frames.append(joint_angles)

    def calculate_joint_angles(self, keypoints):
        """Calculate joint angles from keypoints"""
        angles = {}

        # Example: Calculate shoulder angle
        shoulder_left = keypoints[11]
        elbow_left = keypoints[13]
        wrist_left = keypoints[15]

        # Vector from shoulder to elbow
        v1 = np.array([elbow_left.x - shoulder_left.x,
                      elbow_left.y - shoulder_left.y,
                      elbow_left.z - shoulder_left.z])

        # Vector from elbow to wrist
        v2 = np.array([wrist_left.x - elbow_left.x,
                      wrist_left.y - elbow_left.y,
                      wrist_left.z - elbow_left.z])

        # Calculate angle
        angle = np.arccos(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))
        angles['left_elbow'] = np.degrees(angle)

        # ... calculate all other joints

        return angles

    def export_bvh(self, filename):
        """Export to BVH file"""
        with open(filename, 'w') as f:
            # Write header
            f.write(self.get_bvh_header())

            # Write motion data
            f.write(f"MOTION\n")
            f.write(f"Frames: {len(self.frames)}\n")
            f.write(f"Frame Time: {1.0/self.fps}\n")

            for frame in self.frames:
                # Write frame data
                frame_data = ' '.join([str(v) for v in frame.values()])
                f.write(f"{frame_data}\n")

    def get_bvh_header(self):
        """Generate BVH hierarchy header"""
        header = """HIERARCHY
ROOT Hips
{
    OFFSET 0.00 0.00 0.00
    CHANNELS 6 Xposition Yposition Zposition Zrotation Xrotation Yrotation
    JOINT Chest
    {
        OFFSET 0.00 5.21 0.00
        CHANNELS 3 Zrotation Xrotation Yrotation
        JOINT Neck
        {
            OFFSET 0.00 6.63 0.00
            CHANNELS 3 Zrotation Xrotation Yrotation
            JOINT Head
            {
                OFFSET 0.00 2.78 0.00
                CHANNELS 3 Zrotation Xrotation Yrotation
                End Site
                {
                    OFFSET 0.00 2.78 0.00
                }
            }
        }
        JOINT LeftShoulder
        {
            OFFSET 2.00 6.00 0.00
            CHANNELS 3 Zrotation Xrotation Yrotation
            JOINT LeftElbow
            {
                OFFSET 4.00 0.00 0.00
                CHANNELS 3 Zrotation Xrotation Yrotation
                JOINT LeftWrist
                {
                    OFFSET 3.50 0.00 0.00
                    CHANNELS 3 Zrotation Xrotation Yrotation
                    End Site
                    {
                        OFFSET 1.00 0.00 0.00
                    }
                }
            }
        }
    }
}
"""
        return header
```

### Usage

```python
# Capture pose and export to BVH
import cv2
import mediapipe as mp

pose_to_bvh = PoseToBVH()
mp_pose = mp.solutions.pose.Pose()

cap = cv2.VideoCapture('video.mp4')

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    results = mp_pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    if results.pose_landmarks:
        pose_to_bvh.add_frame(results.pose_landmarks.landmark)

cap.release()

# Export BVH file
pose_to_bvh.export_bvh('motion_capture.bvh')
print("BVH file created!")

# Now import this BVH into Blender, Maya, or other 3D software
```

---

## Blender Integration

### Automatic Pose Import

```python
# blender_pose_import.py
# Run inside Blender's Python console or as script

import bpy
import json

def import_pose_sequence(json_path, armature_name='Armature'):
    """Import pose sequence from JSON and apply to armature"""

    # Load pose data
    with open(json_path, 'r') as f:
        pose_data = json.load(f)

    # Get armature
    armature = bpy.data.objects[armature_name]

    # Enter pose mode
    bpy.context.view_layer.objects.active = armature
    bpy.ops.object.mode_set(mode='POSE')

    # Map keypoints to bones
    bone_mapping = {
        'shoulder.L': 11,  # Left shoulder keypoint
        'upper_arm.L': 11,
        'forearm.L': 13,
        'hand.L': 15,
        'shoulder.R': 12,  # Right shoulder keypoint
        'upper_arm.R': 12,
        'forearm.R': 14,
        'hand.R': 16,
        # ... add more mappings
    }

    # Apply poses frame by frame
    for frame_idx, frame_data in enumerate(pose_data):
        bpy.context.scene.frame_set(frame_idx)

        if 'people' in frame_data and frame_data['people']:
            keypoints = frame_data['people'][0]['pose_keypoints_2d']

            # Reshape keypoints
            kp_array = [keypoints[i:i+3] for i in range(0, len(keypoints), 3)]

            # Apply to bones
            for bone_name, kp_idx in bone_mapping.items():
                if bone_name in armature.pose.bones:
                    bone = armature.pose.bones[bone_name]

                    # Calculate bone rotation from keypoint positions
                    # This is simplified - real implementation needs proper IK
                    x, y, conf = kp_array[kp_idx]

                    # Set bone location/rotation
                    bone.location = (x/100, y/100, 0)
                    bone.keyframe_insert(data_path="location", frame=frame_idx)

    # Return to object mode
    bpy.ops.object.mode_set(mode='OBJECT')
    print(f"Imported {len(pose_data)} frames")

# Usage in Blender
import_pose_sequence('/path/to/keypoints.json', 'Armature')
```

### OpenPose Rig for Blender

You can use pre-made OpenPose rigs:
- GitHub: `io7m/com.io7m.visual.openpose_rig`
- GitHub: `n1ckfg/OpenPoseRig`

These provide ready-to-use armatures matched to OpenPose keypoints.

---

## Complete Examples

### Example 1: Virtual Fitting Room

```python
"""
Virtual Fitting Room - Try on 3D clothing
"""

import cv2
import mediapipe as mp
import numpy as np

class VirtualFittingRoom:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose()
        self.mp_drawing = mp.solutions.drawing_utils

        # Load clothing texture
        self.shirt_texture = cv2.imread('shirt_template.png', cv2.IMREAD_UNCHANGED)

    def warp_clothing(self, image, keypoints):
        """Warp clothing to fit detected body"""
        # Get torso keypoints
        left_shoulder = keypoints[11]
        right_shoulder = keypoints[12]
        left_hip = keypoints[23]
        right_hip = keypoints[24]

        # Convert to pixel coordinates
        h, w = image.shape[:2]
        src_points = np.float32([
            [left_shoulder.x * w, left_shoulder.y * h],
            [right_shoulder.x * w, right_shoulder.y * h],
            [left_hip.x * w, left_hip.y * h],
            [right_hip.x * w, right_hip.y * h]
        ])

        # Define destination points on clothing template
        dst_points = np.float32([
            [0, 0],
            [self.shirt_texture.shape[1], 0],
            [0, self.shirt_texture.shape[0]],
            [self.shirt_texture.shape[1], self.shirt_texture.shape[0]]
        ])

        # Calculate perspective transform
        matrix = cv2.getPerspectiveTransform(dst_points, src_points)

        # Warp clothing
        warped = cv2.warpPerspective(
            self.shirt_texture,
            matrix,
            (w, h),
            flags=cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_TRANSPARENT
        )

        # Blend with original image
        if warped.shape[2] == 4:  # Has alpha channel
            alpha = warped[:, :, 3] / 255.0
            alpha = np.stack([alpha] * 3, axis=2)

            foreground = warped[:, :, :3]
            background = image

            blended = (foreground * alpha + background * (1 - alpha)).astype(np.uint8)
            return blended

        return image

    def run(self):
        cap = cv2.VideoCapture(0)

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Detect pose
            results = self.pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            if results.pose_landmarks:
                # Warp clothing to body
                frame = self.warp_clothing(frame, results.pose_landmarks.landmark)

                # Draw skeleton for reference
                self.mp_drawing.draw_landmarks(
                    frame,
                    results.pose_landmarks,
                    self.mp_pose.POSE_CONNECTIONS
                )

            cv2.imshow('Virtual Fitting Room', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

# Run
fitting_room = VirtualFittingRoom()
fitting_room.run()
```

### Example 2: Pose-Based Game Controller

```python
"""
Pose-Based Game - Control character with body movements
"""

import cv2
import mediapipe as mp
import pygame
import math

class PoseGameController:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose()

        # Pygame setup
        pygame.init()
        self.screen = pygame.display.set_mode((800, 600))
        self.clock = pygame.time.Clock()

        # Game state
        self.player_pos = [400, 300]
        self.player_size = 50

    def get_arm_angle(self, landmarks, side='right'):
        """Calculate arm angle for jump detection"""
        if side == 'right':
            shoulder = landmarks[12]
            elbow = landmarks[14]
            wrist = landmarks[16]
        else:
            shoulder = landmarks[11]
            elbow = landmarks[13]
            wrist = landmarks[15]

        # Calculate angle
        v1 = [elbow.x - shoulder.x, elbow.y - shoulder.y]
        v2 = [wrist.x - elbow.x, wrist.y - elbow.y]

        dot = v1[0]*v2[0] + v1[1]*v2[1]
        mag1 = math.sqrt(v1[0]**2 + v1[1]**2)
        mag2 = math.sqrt(v2[0]**2 + v2[1]**2)

        if mag1 * mag2 == 0:
            return 0

        angle = math.acos(dot / (mag1 * mag2))
        return math.degrees(angle)

    def get_body_lean(self, landmarks):
        """Detect left/right lean for movement"""
        left_shoulder = landmarks[11]
        right_shoulder = landmarks[12]
        left_hip = landmarks[23]
        right_hip = landmarks[24]

        # Calculate torso center
        torso_x = (left_shoulder.x + right_shoulder.x + left_hip.x + right_hip.x) / 4

        # Lean direction (-1 to 1)
        lean = (torso_x - 0.5) * 2
        return lean

    def run(self):
        cap = cv2.VideoCapture(0)
        running = True

        while running:
            # Handle Pygame events
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False

            # Capture and process pose
            ret, frame = cap.read()
            if not ret:
                continue

            results = self.pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark

                # Control character with pose
                # Left/right movement
                lean = self.get_body_lean(landmarks)
                self.player_pos[0] += lean * 10

                # Jump detection (arms raised)
                right_arm_angle = self.get_arm_angle(landmarks, 'right')
                left_arm_angle = self.get_arm_angle(landmarks, 'left')

                if right_arm_angle < 90 and left_arm_angle < 90:
                    # Both arms raised - jump!
                    self.player_pos[1] -= 20

                # Gravity
                if self.player_pos[1] < 500:
                    self.player_pos[1] += 5

            # Clamp position
            self.player_pos[0] = max(0, min(800, self.player_pos[0]))
            self.player_pos[1] = max(0, min(550, self.player_pos[1]))

            # Draw game
            self.screen.fill((50, 50, 50))
            pygame.draw.circle(
                self.screen,
                (255, 100, 100),
                (int(self.player_pos[0]), int(self.player_pos[1])),
                self.player_size
            )

            pygame.display.flip()
            self.clock.tick(60)

            # Show camera feed
            cv2.imshow('Camera', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
        pygame.quit()

# Run game
game = PoseGameController()
game.run()
```

---

## Performance Tips

### 1. Model Selection

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| MediaPipe Lite | Very Fast | Good | Mobile, real-time |
| MediaPipe Full | Fast | Excellent | Desktop AR |
| YOLOv8n Pose | Very Fast | Good | Multi-person |
| YOLOv8x Pose | Medium | Excellent | High quality |
| OpenPose | Medium | Excellent | Research |

### 2. Resolution Optimization

```python
# Process at lower resolution for speed
frame_small = cv2.resize(frame, (640, 480))
results = model.process(frame_small)

# Scale keypoints back to original resolution
scale_x = frame.shape[1] / 640
scale_y = frame.shape[0] / 480
```

### 3. Frame Skipping

```python
# Process every N frames
frame_count = 0
last_pose = None

while True:
    frame_count += 1

    if frame_count % 2 == 0:  # Process every 2nd frame
        results = detector.process(frame)
        last_pose = results
    else:
        results = last_pose  # Use cached pose
```

### 4. GPU Acceleration

```python
# TensorFlow GPU
import tensorflow as tf
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    tf.config.experimental.set_memory_growth(gpus[0], True)

# PyTorch GPU
import torch
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)
```

---

## Summary

### Yes, You Can!

✅ **Attach 3D models to people in camera view**
✅ **Animate rigged characters with pose data**
✅ **Create real-time AR overlays**
✅ **Build motion capture systems**
✅ **Make AR filters and effects**

### Choose Your Approach

**Quick Prototyping:** Python + OpenCV + MediaPipe + PyOpenGL
**Professional Quality:** Unity or Unreal Engine
**Web Distribution:** Three.js + TensorFlow.js
**Animation Production:** Blender + BVH export

### Next Steps

1. **Try the Python examples** in this document
2. **Experiment with different 3D models**
3. **Learn skeletal animation** basics
4. **Build your AR application**
5. **Optimize for real-time performance**

---

## Resources

- **MediaPipe Pose:** https://google.github.io/mediapipe/solutions/pose
- **Three.js:** https://threejs.org/
- **Unity AR Foundation:** https://unity.com/unity/features/arfoundation
- **Blender Python API:** https://docs.blender.org/api/current/
- **PyOpenGL:** http://pyopengl.sourceforge.net/

The possibilities are endless! 🚀🎮🎨
