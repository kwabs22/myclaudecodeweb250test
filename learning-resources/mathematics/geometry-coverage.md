# Geometry in this repository

An audit of where geometry appears in the repository. Most of it is applied and scattered through the game and 3D documents. The [Geometry you can drag](geometry/index.html) page now teaches a core of it directly.

## What is covered

| Area | Where | What is there |
|---|---|---|
| Mesh geometry | [`game-development/blender/mesh-analysis-and-geometric-features.md`](../../game-development/blender/mesh-analysis-and-geometric-features.md) | Vertex and mean curvature, surface normals and angles, sharp-edge and corner detection, undercuts, extracting dimensions, geodesic (along-the-surface) distance |
| Shape approximation | [`game-development/blender/voxelization-and-shape-approximation.md`](../../game-development/blender/voxelization-and-shape-approximation.md) | Voxelization, half-cube and tetrahedral decomposition, octrees, greedy meshing, marching cubes (mentioned) |
| Collision geometry | [`game-development/game-design/game-loop-ui-collision-character-integration.md`](../../game-development/game-design/game-loop-ui-collision-character-integration.md) | Circle against circle, box against box (AABB), circle against box, impulse-based resolution; raycasts for ground detection appear in [`engine-support-for-game-verbs.md`](../../game-development/game-design/engine-support-for-game-verbs.md) |
| Position and rotation | [ArUco simulator](../../game-development/algorithms/aruco-marker-games/simulator/index.html), PlayCanvas notes | Marker poses as a position plus a turn, quaternions in the engine notes |
| Geometry questions | Phase 1 question bank, topic Geometry ([quiz](../../ai-ml/careers/ai-engineer-roadmap/quiz-app.html)) | 169 computed questions: distance, angles, triangle and polygon area, orientation, segment crossing, point in polygon, convex hull, rotation, determinants, homographies and the pinhole camera |
| Vectors as numbers | Phase 1 question bank ([quiz](../../ai-ml/careers/ai-engineer-roadmap/quiz-app.html)) | Vector norm (23 questions), dot product (22), orthogonality (8), cosine similarity (5), determinant (30), eigenvalues (22) |
| Image geometry | [Edge detection](../../ai-ml/computer-vision/edge-detection/index.html) | Gradient strength and direction, direction perpendicular to an edge |
| Plane and space geometry | [Geometry you can drag](geometry/index.html) | Triangle area and angles, segment intersection, point in polygon (ray casting and winding number), convex hull, 2D transformation matrices and determinants, 3D rotations (Euler, axis-angle, quaternion), the pinhole camera, and the homography of a flat marker with the camera pose recovered from it; checked by [`geometry/check.js`](geometry/check.js) |
| 3D drawing | [Alpha channel](../../ai-ml/computer-vision/alpha-channel/index.html), [real-world map](real-world/index.html), [complexity explorer](../../game-development/complexity-explorer/index.html) | Use three.js scenes, but teach other things |

## What is not covered

- Plane geometry beyond the page's six sections: circles and tangents, similar triangles, trigonometric identities, coordinate proofs.
- More polygon algorithms: triangulation, polygon clipping, closest pair of points.
- Voronoi diagrams and Delaunay triangulation (Delaunay appears only as a library name and in a code comment).
- Homogeneous coordinates for 2D transformations (translation as a matrix), and 3D scale and shear.
- Camera geometry beyond the ideal pinhole: lens distortion, calibration (the page assumes a known focal length), and refining a pose by minimising pixel error rather than the closed-form estimate.
- Curves and surfaces (Bézier, splines) and signed distance fields.

## Natural next steps

Circles and tangents, triangulation and polygon clipping, homogeneous coordinates for translation, and camera calibration (lens distortion and the focal length that the marker page assumes).
