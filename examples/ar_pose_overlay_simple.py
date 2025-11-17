"""
Simple AR Pose Overlay - Attach 3D cubes to hands using MediaPipe + OpenCV
No OpenGL required - uses simple 2D projection

Requirements:
    pip install opencv-python mediapipe numpy

Usage:
    python ar_pose_overlay_simple.py
"""

import cv2
import mediapipe as mp
import numpy as np


class SimpleAROverlay:
    """Simple AR overlay using 2D projection"""

    def __init__(self, camera_id=0):
        # Initialize MediaPipe Pose
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles

        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

        # Camera
        self.cap = cv2.VideoCapture(camera_id)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    def draw_3d_cube_2d(self, image, center, size=50, color=(0, 255, 0), depth_offset=0):
        """
        Draw a pseudo-3D cube using 2D projection

        Args:
            image: Frame to draw on
            center: (x, y) center position
            size: Cube size in pixels
            color: BGR color
            depth_offset: Depth value for perspective (0-1)
        """
        x, y = center
        s = size

        # Adjust size based on depth (larger when closer)
        scale = 1.0 - depth_offset * 0.5
        s = int(s * scale)

        # Define cube vertices (isometric projection)
        vertices = np.array([
            # Front face
            [x - s, y - s],  # Top left
            [x + s, y - s],  # Top right
            [x + s, y + s],  # Bottom right
            [x - s, y + s],  # Bottom left
            # Back face (with depth offset)
            [x - s - s//2, y - s - s//2],  # Top left back
            [x + s - s//2, y - s - s//2],  # Top right back
            [x + s - s//2, y + s - s//2],  # Bottom right back
            [x - s - s//2, y + s - s//2],  # Bottom left back
        ], dtype=np.int32)

        # Draw cube faces
        # Front face (brighter)
        front_color = color
        cv2.polylines(image, [vertices[0:4]], True, front_color, 2)
        cv2.fillPoly(image, [vertices[0:4]], (*front_color, 128), lineType=cv2.LINE_AA)

        # Back face (darker)
        back_color = tuple(int(c * 0.6) for c in color)
        cv2.polylines(image, [vertices[4:8]], True, back_color, 2)

        # Connect front to back
        for i in range(4):
            cv2.line(image, tuple(vertices[i]), tuple(vertices[i + 4]), color, 2)

        return image

    def draw_3d_sphere(self, image, center, radius=30, color=(255, 0, 0), depth_offset=0):
        """Draw a pseudo-3D sphere with shading"""
        x, y = center

        # Adjust radius based on depth
        scale = 1.0 - depth_offset * 0.5
        r = int(radius * scale)

        # Draw outer circle
        cv2.circle(image, (x, y), r, color, -1)

        # Add highlight for 3D effect
        highlight_offset = r // 3
        highlight_pos = (x - highlight_offset, y - highlight_offset)
        highlight_radius = r // 2
        highlight_color = tuple(min(255, int(c * 1.5)) for c in color)
        cv2.circle(image, highlight_pos, highlight_radius, highlight_color, -1)

        # Add darker edge
        edge_color = tuple(int(c * 0.6) for c in color)
        cv2.circle(image, (x, y), r, edge_color, 2)

        return image

    def draw_skeleton_enhanced(self, image, landmarks):
        """Draw enhanced skeleton with glowing effect"""
        h, w = image.shape[:2]

        # Define connections
        connections = [
            (11, 12),  # Shoulders
            (11, 13), (13, 15),  # Left arm
            (12, 14), (14, 16),  # Right arm
            (11, 23), (12, 24),  # Torso
            (23, 24),  # Hips
            (23, 25), (25, 27),  # Left leg
            (24, 26), (26, 28),  # Right leg
        ]

        # Draw connections with glow
        for start_idx, end_idx in connections:
            if start_idx < len(landmarks) and end_idx < len(landmarks):
                start = landmarks[start_idx]
                end = landmarks[end_idx]

                if start.visibility > 0.5 and end.visibility > 0.5:
                    start_point = (int(start.x * w), int(start.y * h))
                    end_point = (int(end.x * w), int(end.y * h))

                    # Draw glow effect (multiple lines with decreasing intensity)
                    for thickness in range(10, 2, -2):
                        alpha = thickness / 10
                        color = (int(0 * alpha), int(255 * alpha), int(255 * alpha))
                        cv2.line(image, start_point, end_point, color, thickness)

                    # Draw main line
                    cv2.line(image, start_point, end_point, (0, 255, 255), 2)

        # Draw joints
        for idx, landmark in enumerate(landmarks):
            if landmark.visibility > 0.5:
                x = int(landmark.x * w)
                y = int(landmark.y * h)

                # Glow effect
                for radius in range(15, 5, -2):
                    alpha = radius / 15
                    color = (int(255 * alpha), int(255 * alpha), int(0))
                    cv2.circle(image, (x, y), radius, color, -1)

                # Main circle
                cv2.circle(image, (x, y), 5, (255, 255, 0), -1)

        return image

    def add_particle_effect(self, image, center, num_particles=10, color=(255, 255, 0)):
        """Add particle effect around a point"""
        import random

        x, y = center

        for _ in range(num_particles):
            offset_x = random.randint(-30, 30)
            offset_y = random.randint(-30, 30)
            particle_size = random.randint(2, 6)

            particle_pos = (x + offset_x, y + offset_y)
            particle_color = tuple(random.randint(max(0, c - 50), min(255, c + 50)) for c in color)

            cv2.circle(image, particle_pos, particle_size, particle_color, -1)

        return image

    def run(self):
        """Main AR loop"""
        print("AR Pose Overlay Running...")
        print("Controls:")
        print("  ESC or Q - Quit")
        print("  S - Toggle skeleton")
        print("  C - Toggle cubes")
        print("  P - Toggle particles")

        show_skeleton = True
        show_cubes = True
        show_particles = False

        while self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                break

            # Flip for mirror effect
            frame = cv2.flip(frame, 1)

            # Convert to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(rgb_frame)

            # Create overlay layer
            overlay = frame.copy()

            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                h, w = frame.shape[:2]

                # Draw enhanced skeleton
                if show_skeleton:
                    overlay = self.draw_skeleton_enhanced(overlay, landmarks)

                # Get key points
                right_wrist = landmarks[16]
                left_wrist = landmarks[15]
                nose = landmarks[0]

                # Draw cubes on hands
                if show_cubes:
                    if right_wrist.visibility > 0.5:
                        right_pos = (int(right_wrist.x * w), int(right_wrist.y * h))
                        overlay = self.draw_3d_cube_2d(
                            overlay, right_pos, size=40,
                            color=(0, 0, 255), depth_offset=right_wrist.z
                        )

                    if left_wrist.visibility > 0.5:
                        left_pos = (int(left_wrist.x * w), int(left_wrist.y * h))
                        overlay = self.draw_3d_cube_2d(
                            overlay, left_pos, size=40,
                            color=(255, 0, 0), depth_offset=left_wrist.z
                        )

                # Draw sphere on head
                if nose.visibility > 0.5:
                    nose_pos = (int(nose.x * w), int(nose.y * h))
                    overlay = self.draw_3d_sphere(
                        overlay, nose_pos, radius=25,
                        color=(255, 255, 0), depth_offset=nose.z
                    )

                # Add particles
                if show_particles:
                    if right_wrist.visibility > 0.5:
                        right_pos = (int(right_wrist.x * w), int(right_wrist.y * h))
                        overlay = self.add_particle_effect(overlay, right_pos, num_particles=15)

                    if left_wrist.visibility > 0.5:
                        left_pos = (int(left_wrist.x * w), int(left_wrist.y * h))
                        overlay = self.add_particle_effect(overlay, left_pos, num_particles=15)

            # Blend overlay with original frame
            alpha = 0.7
            frame = cv2.addWeighted(frame, 1 - alpha, overlay, alpha, 0)

            # Add instructions
            cv2.putText(frame, "AR Pose Overlay", (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            cv2.putText(frame, f"Skeleton: {'ON' if show_skeleton else 'OFF'} (S)", (10, 60),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
            cv2.putText(frame, f"Cubes: {'ON' if show_cubes else 'OFF'} (C)", (10, 85),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
            cv2.putText(frame, f"Particles: {'ON' if show_particles else 'OFF'} (P)", (10, 110),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

            # Display
            cv2.imshow('AR Pose Overlay', frame)

            # Handle keys
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q') or key == 27:  # Q or ESC
                break
            elif key == ord('s'):
                show_skeleton = not show_skeleton
            elif key == ord('c'):
                show_cubes = not show_cubes
            elif key == ord('p'):
                show_particles = not show_particles

        self.cleanup()

    def cleanup(self):
        """Release resources"""
        self.cap.release()
        cv2.destroyAllWindows()
        self.pose.close()


if __name__ == "__main__":
    print("Starting Simple AR Pose Overlay...")
    print("This demo attaches 3D objects to your body using pose estimation")
    print()

    ar_app = SimpleAROverlay(camera_id=0)
    ar_app.run()
