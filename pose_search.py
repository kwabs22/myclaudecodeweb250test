"""
Pose Search Engine for Video Analysis using OpenPose/YOLO Keypoints
Implements pose similarity, action matching, and video search capabilities
"""

import numpy as np
from scipy.spatial.distance import cosine, euclidean
import json
from pathlib import Path
from typing import List, Dict, Optional, Tuple
import cv2


class PoseSearchEngine:
    """
    Search engine for finding similar poses and actions in videos
    based on keypoint data from OpenPose or YOLO Pose
    """

    def __init__(self, normalize_poses: bool = True):
        """
        Initialize the search engine

        Args:
            normalize_poses: Whether to normalize poses for scale/translation invariance
        """
        self.video_database = {}
        self.normalize_poses = normalize_poses
        self.keypoint_format = None  # 'openpose' or 'yolo'

    def load_video_keypoints(self, video_id: str, keypoints_path: str, format: str = 'auto'):
        """
        Load keypoints for a video into the database

        Args:
            video_id: Unique identifier for the video
            keypoints_path: Path to JSON file containing keypoints
            format: 'openpose', 'yolo', or 'auto' to detect automatically
        """
        with open(keypoints_path, 'r') as f:
            data = json.load(f)

        # Detect format if auto
        if format == 'auto':
            if isinstance(data, list) and 'people' in data[0]:
                format = 'openpose'
            else:
                format = 'yolo'

        self.keypoint_format = format

        # Parse based on format
        if format == 'openpose':
            pose_sequence = self._parse_openpose_format(data)
        else:
            pose_sequence = self._parse_yolo_format(data)

        self.video_database[video_id] = {
            'keypoints': np.array(pose_sequence),
            'num_frames': len(pose_sequence),
            'source_path': keypoints_path
        }

        print(f"Loaded {video_id}: {len(pose_sequence)} frames")

    def _parse_openpose_format(self, data: List[Dict]) -> List[np.ndarray]:
        """Parse OpenPose JSON format"""
        pose_sequence = []

        for frame in data:
            if frame.get('people'):
                # Use first person's pose (can be extended for multi-person)
                pose_data = frame['people'][0].get('pose_keypoints_2d', [])
                if pose_data:
                    pose = np.array(pose_data).reshape(-1, 3)  # (num_keypoints, 3)
                    pose_sequence.append(pose[:, :2])  # Only x, y coordinates

        return pose_sequence

    def _parse_yolo_format(self, data: Dict) -> List[np.ndarray]:
        """Parse YOLO Pose format (custom - adapt to your format)"""
        pose_sequence = []

        # Adapt this based on your YOLO output format
        for frame_data in data.get('frames', []):
            keypoints = np.array(frame_data.get('keypoints', [])).reshape(-1, 2)
            if keypoints.size > 0:
                pose_sequence.append(keypoints)

        return pose_sequence

    def normalize_pose(self, pose: np.ndarray, reference_point: int = 0) -> np.ndarray:
        """
        Normalize pose to be scale and translation invariant

        Args:
            pose: Array of shape (num_keypoints, 2) with x, y coordinates
            reference_point: Index of keypoint to use as reference (default: 0 = nose/head)

        Returns:
            Normalized pose array
        """
        if pose.size == 0 or len(pose) == 0:
            return pose

        # Handle missing reference point
        if reference_point >= len(pose):
            reference_point = 0

        # Center at reference point
        reference = pose[reference_point]
        centered = pose - reference

        # Scale normalization using L2 norm
        norm = np.linalg.norm(centered)
        if norm > 1e-6:  # Avoid division by zero
            normalized = centered / norm
        else:
            normalized = centered

        return normalized

    def compute_frame_similarity(self, pose1: np.ndarray, pose2: np.ndarray,
                                 metric: str = 'cosine') -> float:
        """
        Compute similarity between two poses

        Args:
            pose1, pose2: Pose arrays of shape (num_keypoints, 2)
            metric: 'cosine', 'euclidean', or 'pck' (Percentage of Correct Keypoints)

        Returns:
            Similarity score (higher = more similar)
        """
        # Normalize if enabled
        if self.normalize_poses:
            pose1 = self.normalize_pose(pose1)
            pose2 = self.normalize_pose(pose2)

        # Flatten for comparison
        flat1 = pose1.flatten()
        flat2 = pose2.flatten()

        if metric == 'cosine':
            # Cosine similarity (0-1 range)
            similarity = 1 - cosine(flat1, flat2)
        elif metric == 'euclidean':
            # Convert Euclidean distance to similarity
            distance = euclidean(flat1, flat2)
            similarity = 1 / (1 + distance)
        elif metric == 'pck':
            # Percentage of Correct Keypoints
            threshold = 0.1  # 10% of normalized scale
            distances = np.linalg.norm(pose1 - pose2, axis=1)
            similarity = np.mean(distances < threshold)
        else:
            raise ValueError(f"Unknown metric: {metric}")

        return float(similarity)

    def compute_video_similarity_dtw(self, video_id1: str, video_id2: str) -> Tuple[float, float]:
        """
        Compute similarity between two videos using Dynamic Time Warping

        Args:
            video_id1, video_id2: Video identifiers in database

        Returns:
            Tuple of (similarity_score, dtw_distance)
        """
        try:
            from dtaidistance import dtw
        except ImportError:
            raise ImportError("Please install dtaidistance: pip install dtaidistance")

        seq1 = self.video_database[video_id1]['keypoints']
        seq2 = self.video_database[video_id2]['keypoints']

        # Normalize sequences
        if self.normalize_poses:
            norm_seq1 = np.array([self.normalize_pose(p).flatten() for p in seq1])
            norm_seq2 = np.array([self.normalize_pose(p).flatten() for p in seq2])
        else:
            norm_seq1 = np.array([p.flatten() for p in seq1])
            norm_seq2 = np.array([p.flatten() for p in seq2])

        # Compute DTW distance
        distance = dtw.distance(norm_seq1, norm_seq2)

        # Convert to similarity score (0-1 range)
        similarity = 1 / (1 + distance)

        return similarity, distance

    def search_similar_videos(self, query_video_id: str, top_k: int = 5,
                             use_dtw: bool = True) -> List[Dict]:
        """
        Find most similar videos to query

        Args:
            query_video_id: ID of query video
            top_k: Number of top results to return
            use_dtw: Use DTW (slower but better) or simple frame comparison

        Returns:
            List of dicts with video_id, similarity, and distance
        """
        if query_video_id not in self.video_database:
            raise ValueError(f"Video {query_video_id} not in database")

        results = []

        for video_id in self.video_database:
            if video_id == query_video_id:
                continue

            if use_dtw:
                similarity, distance = self.compute_video_similarity_dtw(
                    query_video_id, video_id
                )
            else:
                # Simple average frame similarity
                query_seq = self.video_database[query_video_id]['keypoints']
                target_seq = self.video_database[video_id]['keypoints']

                # Compare first N frames
                min_len = min(len(query_seq), len(target_seq))
                similarities = [
                    self.compute_frame_similarity(query_seq[i], target_seq[i])
                    for i in range(min_len)
                ]
                similarity = np.mean(similarities)
                distance = 1 - similarity

            results.append({
                'video_id': video_id,
                'similarity': float(similarity),
                'distance': float(distance),
                'num_frames': self.video_database[video_id]['num_frames']
            })

        # Sort by similarity (descending)
        results.sort(key=lambda x: x['similarity'], reverse=True)

        return results[:top_k]

    def search_by_action(self, query_keypoints_path: str, top_k: int = 5) -> List[Dict]:
        """
        Search for similar actions in database given a query action

        Args:
            query_keypoints_path: Path to keypoints JSON of query action
            top_k: Number of results to return

        Returns:
            List of similar videos
        """
        # Load query
        with open(query_keypoints_path, 'r') as f:
            query_data = json.load(f)

        # Parse query
        if self.keypoint_format == 'openpose':
            query_sequence = self._parse_openpose_format(query_data)
        else:
            query_sequence = self._parse_yolo_format(query_data)

        query_sequence = np.array(query_sequence)

        # Normalize query
        if self.normalize_poses:
            norm_query = np.array([self.normalize_pose(p).flatten()
                                  for p in query_sequence])
        else:
            norm_query = np.array([p.flatten() for p in query_sequence])

        # Compare with all videos
        try:
            from dtaidistance import dtw
            use_dtw = True
        except ImportError:
            print("Warning: dtaidistance not available, using simple comparison")
            use_dtw = False

        results = []
        for video_id, video_data in self.video_database.items():
            video_seq = video_data['keypoints']

            if self.normalize_poses:
                norm_video = np.array([self.normalize_pose(p).flatten()
                                      for p in video_seq])
            else:
                norm_video = np.array([p.flatten() for p in video_seq])

            if use_dtw:
                distance = dtw.distance(norm_query, norm_video)
            else:
                # Simple average distance
                min_len = min(len(norm_query), len(norm_video))
                distance = np.mean([
                    euclidean(norm_query[i], norm_video[i])
                    for i in range(min_len)
                ])

            similarity = 1 / (1 + distance)

            results.append({
                'video_id': video_id,
                'similarity': float(similarity),
                'distance': float(distance)
            })

        results.sort(key=lambda x: x['similarity'], reverse=True)
        return results[:top_k]

    def search_by_pose(self, target_pose: np.ndarray, threshold: float = 0.8) -> List[Dict]:
        """
        Find all frames matching a specific pose

        Args:
            target_pose: Target pose array of shape (num_keypoints, 2)
            threshold: Minimum similarity threshold

        Returns:
            List of matches with video_id, frame, and similarity
        """
        matches = []

        for video_id, video_data in self.video_database.items():
            sequence = video_data['keypoints']

            for frame_idx, pose in enumerate(sequence):
                similarity = self.compute_frame_similarity(target_pose, pose)

                if similarity >= threshold:
                    matches.append({
                        'video_id': video_id,
                        'frame': frame_idx,
                        'similarity': float(similarity),
                        'timestamp': frame_idx / 30.0  # Assuming 30 fps
                    })

        # Sort by similarity
        matches.sort(key=lambda x: x['similarity'], reverse=True)
        return matches

    def segment_by_action(self, video_id: str, window_size: int = 30,
                         stride: int = 15) -> List[Dict]:
        """
        Segment video into overlapping action clips

        Args:
            video_id: Video to segment
            window_size: Number of frames per segment
            stride: Step size between segments

        Returns:
            List of segment dictionaries
        """
        if video_id not in self.video_database:
            raise ValueError(f"Video {video_id} not in database")

        sequence = self.video_database[video_id]['keypoints']
        segments = []

        for i in range(0, len(sequence) - window_size + 1, stride):
            segment = sequence[i:i + window_size]
            segments.append({
                'video_id': video_id,
                'start_frame': i,
                'end_frame': i + window_size,
                'duration_frames': window_size,
                'keypoints': segment
            })

        return segments

    def export_database_index(self, output_path: str):
        """Export database index for quick loading"""
        index = {
            'videos': {
                vid: {
                    'num_frames': data['num_frames'],
                    'source_path': data['source_path']
                }
                for vid, data in self.video_database.items()
            },
            'format': self.keypoint_format
        }

        with open(output_path, 'w') as f:
            json.dump(index, f, indent=2)

    def get_statistics(self) -> Dict:
        """Get database statistics"""
        total_frames = sum(data['num_frames']
                          for data in self.video_database.values())

        return {
            'num_videos': len(self.video_database),
            'total_frames': total_frames,
            'avg_frames_per_video': total_frames / len(self.video_database)
                                   if self.video_database else 0,
            'video_ids': list(self.video_database.keys())
        }


# Example usage
if __name__ == '__main__':
    # Initialize search engine
    search_engine = PoseSearchEngine(normalize_poses=True)

    # Load some videos (example paths - adjust as needed)
    # search_engine.load_video_keypoints('video1', 'output/video1_keypoints.json')
    # search_engine.load_video_keypoints('video2', 'output/video2_keypoints.json')

    # Print statistics
    # stats = search_engine.get_statistics()
    # print(f"Database: {stats['num_videos']} videos, {stats['total_frames']} frames")

    # Search for similar videos
    # results = search_engine.search_similar_videos('video1', top_k=3)
    # for r in results:
    #     print(f"{r['video_id']}: similarity={r['similarity']:.3f}")

    print("PoseSearchEngine module loaded successfully")
    print("Import this module to use: from pose_search import PoseSearchEngine")
