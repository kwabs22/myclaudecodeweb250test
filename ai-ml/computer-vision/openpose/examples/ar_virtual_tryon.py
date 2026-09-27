"""
Virtual Try-On Demo - Overlay clothing/accessories on detected body

Requirements:
    pip install opencv-python mediapipe numpy

Usage:
    python ar_virtual_tryon.py
"""

import cv2
import mediapipe as mp
import numpy as np


class VirtualTryOn:
    """Virtual try-on system for clothing and accessories"""

    def __init__(self, camera_id=0):
        # Initialize MediaPipe
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
            model_complexity=1
        )

        # Camera
        self.cap = cv2.VideoCapture(camera_id)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

        # Accessories
        self.current_item = 'hat'  # hat, glasses, shirt, none

    def create_hat(self, width, height):
        """Create a hat overlay"""
        hat = np.zeros((height, width, 4), dtype=np.uint8)

        # Draw top hat
        # Brim
        cv2.ellipse(hat, (width // 2, height - 20), (width // 2, 20),
                   0, 0, 180, (50, 50, 50, 255), -1)

        # Top part
        cv2.rectangle(hat, (width // 4, 20), (3 * width // 4, height - 20),
                     (50, 50, 50, 255), -1)

        # Add red band
        cv2.rectangle(hat, (width // 4, height - 40), (3 * width // 4, height - 30),
                     (0, 0, 200, 255), -1)

        return hat

    def create_glasses(self, width, height):
        """Create glasses overlay"""
        glasses = np.zeros((height, width, 4), dtype=np.uint8)

        # Left lens
        cv2.circle(glasses, (width // 4, height // 2), width // 6,
                  (50, 50, 50, 200), 3)
        cv2.circle(glasses, (width // 4, height // 2), width // 6,
                  (100, 200, 255, 80), -1)

        # Right lens
        cv2.circle(glasses, (3 * width // 4, height // 2), width // 6,
                  (50, 50, 50, 200), 3)
        cv2.circle(glasses, (3 * width // 4, height // 2), width // 6,
                  (100, 200, 255, 80), -1)

        # Bridge
        cv2.line(glasses,
                (width // 4 + width // 6, height // 2),
                (3 * width // 4 - width // 6, height // 2),
                (50, 50, 50, 200), 3)

        # Temples
        cv2.line(glasses,
                (width // 4 - width // 6, height // 2),
                (0, height // 2 + 20),
                (50, 50, 50, 200), 3)
        cv2.line(glasses,
                (3 * width // 4 + width // 6, height // 2),
                (width, height // 2 + 20),
                (50, 50, 50, 200), 3)

        return glasses

    def create_shirt(self, width, height):
        """Create shirt overlay"""
        shirt = np.zeros((height, width, 4), dtype=np.uint8)

        # Main shirt body (simplified)
        points = np.array([
            [width // 4, 50],
            [3 * width // 4, 50],
            [3 * width // 4 + 50, height // 3],
            [3 * width // 4, height - 50],
            [width // 4, height - 50],
            [width // 4 - 50, height // 3],
        ], dtype=np.int32)

        # Fill shirt with color
        cv2.fillPoly(shirt, [points], (0, 100, 200, 180))

        # Add collar
        collar_points = np.array([
            [width // 2 - 30, 50],
            [width // 2 + 30, 50],
            [width // 2 + 50, 100],
            [width // 2 - 50, 100],
        ], dtype=np.int32)
        cv2.fillPoly(shirt, [collar_points], (255, 255, 255, 200))

        # Add buttons
        button_y = 100
        for i in range(4):
            cv2.circle(shirt, (width // 2, button_y + i * 60),
                      8, (255, 255, 255, 255), -1)

        return shirt

    def overlay_image(self, background, overlay, position, scale=1.0, angle=0):
        """
        Overlay an RGBA image on background at position with optional scaling and rotation

        Args:
            background: Background image (BGR)
            overlay: Overlay image (BGRA with alpha channel)
            position: (x, y) position for overlay
            scale: Scale factor
            angle: Rotation angle in degrees
        """
        if overlay.shape[2] != 4:
            return background

        # Scale overlay
        if scale != 1.0:
            new_width = int(overlay.shape[1] * scale)
            new_height = int(overlay.shape[0] * scale)
            overlay = cv2.resize(overlay, (new_width, new_height))

        # Rotate overlay
        if angle != 0:
            center = (overlay.shape[1] // 2, overlay.shape[0] // 2)
            matrix = cv2.getRotationMatrix2D(center, angle, 1.0)
            overlay = cv2.warpAffine(overlay, matrix,
                                    (overlay.shape[1], overlay.shape[0]),
                                    flags=cv2.INTER_LINEAR,
                                    borderMode=cv2.BORDER_CONSTANT,
                                    borderValue=(0, 0, 0, 0))

        h, w = overlay.shape[:2]
        x, y = position

        # Calculate region of interest
        x1 = max(0, x - w // 2)
        y1 = max(0, y - h // 2)
        x2 = min(background.shape[1], x + w // 2)
        y2 = min(background.shape[0], y + h // 2)

        # Adjust overlay to fit
        overlay_x1 = max(0, w // 2 - x)
        overlay_y1 = max(0, h // 2 - y)
        overlay_x2 = overlay_x1 + (x2 - x1)
        overlay_y2 = overlay_y1 + (y2 - y1)

        if overlay_x2 <= overlay_x1 or overlay_y2 <= overlay_y1:
            return background

        # Extract alpha channel
        overlay_crop = overlay[overlay_y1:overlay_y2, overlay_x1:overlay_x2]
        alpha = overlay_crop[:, :, 3:] / 255.0
        overlay_rgb = overlay_crop[:, :, :3]

        # Blend
        background_crop = background[y1:y2, x1:x2]
        blended = (overlay_rgb * alpha + background_crop * (1 - alpha)).astype(np.uint8)
        background[y1:y2, x1:x2] = blended

        return background

    def calculate_head_rotation(self, landmarks):
        """Calculate head rotation angle"""
        # Use eyes and ears to estimate rotation
        left_eye = landmarks[2]
        right_eye = landmarks[5]

        # Calculate angle between eyes
        dx = right_eye.x - left_eye.x
        dy = right_eye.y - left_eye.y

        angle = np.degrees(np.arctan2(dy, dx))
        return angle

    def run(self):
        """Main try-on loop"""
        print("Virtual Try-On Demo")
        print("Controls:")
        print("  1 - Hat")
        print("  2 - Glasses")
        print("  3 - Shirt")
        print("  0 - None")
        print("  Q/ESC - Quit")

        while self.cap.isOpened():
            ret, frame = self.cap.read()
            if not ret:
                break

            # Flip for mirror effect
            frame = cv2.flip(frame, 1)
            h, w = frame.shape[:2]

            # Process pose
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.pose.process(rgb_frame)

            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark

                # Get head position and rotation
                nose = landmarks[0]
                left_eye = landmarks[2]
                right_eye = landmarks[5]

                head_x = int((left_eye.x + right_eye.x) / 2 * w)
                head_y = int((left_eye.y + right_eye.y) / 2 * h)
                head_angle = self.calculate_head_rotation(landmarks)

                # Calculate head size
                eye_distance = np.sqrt(
                    (right_eye.x - left_eye.x) ** 2 +
                    (right_eye.y - left_eye.y) ** 2
                )
                head_scale = eye_distance * w / 100  # Normalize scale

                # Overlay selected item
                if self.current_item == 'hat':
                    hat = self.create_hat(200, 150)
                    hat_pos = (head_x, int(nose.y * h) - 100)
                    frame = self.overlay_image(frame, hat, hat_pos,
                                              scale=head_scale, angle=head_angle)

                elif self.current_item == 'glasses':
                    glasses = self.create_glasses(250, 100)
                    glasses_pos = (head_x, head_y)
                    frame = self.overlay_image(frame, glasses, glasses_pos,
                                              scale=head_scale, angle=head_angle)

                elif self.current_item == 'shirt':
                    # Get torso keypoints
                    left_shoulder = landmarks[11]
                    right_shoulder = landmarks[12]
                    left_hip = landmarks[23]

                    torso_x = int((left_shoulder.x + right_shoulder.x) / 2 * w)
                    torso_y = int((left_shoulder.y + left_hip.y) / 2 * h)

                    # Calculate torso size
                    shoulder_distance = np.sqrt(
                        (right_shoulder.x - left_shoulder.x) ** 2 +
                        (right_shoulder.y - left_shoulder.y) ** 2
                    )
                    torso_scale = shoulder_distance * w / 150

                    shirt = self.create_shirt(300, 400)
                    frame = self.overlay_image(frame, shirt, (torso_x, torso_y),
                                              scale=torso_scale, angle=0)

            # Display info
            cv2.putText(frame, "Virtual Try-On", (10, 30),
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            cv2.putText(frame, f"Current: {self.current_item.upper()}", (10, 70),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(frame, "1:Hat 2:Glasses 3:Shirt 0:None", (10, h - 20),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

            cv2.imshow('Virtual Try-On', frame)

            # Handle keys
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q') or key == 27:
                break
            elif key == ord('1'):
                self.current_item = 'hat'
            elif key == ord('2'):
                self.current_item = 'glasses'
            elif key == ord('3'):
                self.current_item = 'shirt'
            elif key == ord('0'):
                self.current_item = 'none'

        self.cleanup()

    def cleanup(self):
        """Release resources"""
        self.cap.release()
        cv2.destroyAllWindows()
        self.pose.close()


if __name__ == "__main__":
    try_on = VirtualTryOn(camera_id=0)
    try_on.run()
