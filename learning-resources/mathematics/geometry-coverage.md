# Geometry in this repository

An audit of where geometry appears in the repository. There is geometry here, but it is applied and scattered: no document, quiz or page teaches it directly.

## What is covered

| Area | Where | What is there |
|---|---|---|
| Mesh geometry | [`game-development/blender/mesh-analysis-and-geometric-features.md`](../../game-development/blender/mesh-analysis-and-geometric-features.md) | Vertex and mean curvature, surface normals and angles, sharp-edge and corner detection, undercuts, extracting dimensions, geodesic (along-the-surface) distance |
| Shape approximation | [`game-development/blender/voxelization-and-shape-approximation.md`](../../game-development/blender/voxelization-and-shape-approximation.md) | Voxelization, half-cube and tetrahedral decomposition, octrees, greedy meshing, marching cubes (mentioned) |
| Collision geometry | [`game-development/game-design/game-loop-ui-collision-character-integration.md`](../../game-development/game-design/game-loop-ui-collision-character-integration.md) | Circle against circle, box against box (AABB), circle against box, impulse-based resolution; raycasts for ground detection appear in [`engine-support-for-game-verbs.md`](../../game-development/game-design/engine-support-for-game-verbs.md) |
| Position and rotation | [ArUco simulator](../../game-development/algorithms/aruco-marker-games/simulator/index.html), PlayCanvas notes | Marker poses as a position plus a turn, quaternions in the engine notes |
| Vectors as numbers | Phase 1 question bank ([quiz](../../ai-ml/careers/ai-engineer-roadmap/quiz-app.html)) | Vector norm (23 questions), dot product (22), orthogonality (8), cosine similarity (5), determinant (30), eigenvalues (22) |
| Image geometry | [Edge detection](../../ai-ml/computer-vision/edge-detection/index.html) | Gradient strength and direction, direction perpendicular to an edge |
| 3D drawing | [Alpha channel](../../ai-ml/computer-vision/alpha-channel/index.html), [real-world map](real-world/index.html), [complexity explorer](../../game-development/complexity-explorer/index.html) | Use three.js scenes, but teach other things |

## What is not covered

- Plane and coordinate geometry as a subject: distance between points, angles, Pythagoras, triangle and polygon area.
- Polygon algorithms: point in polygon, convex hull, segment intersection.
- Voronoi diagrams and Delaunay triangulation (Delaunay appears only as a library name and in a code comment).
- Transformations as matrices: rotation, scale, shear and homogeneous coordinates, and how to combine them.
- Camera geometry: the pinhole model, intrinsics and homography, even though marker detection and AR are repository topics.
- Curves and surfaces (Bézier, splines) and signed distance fields.
- A geometry question bank or an interactive geometry page. The mathematics quiz covers combinatorics only.

## A natural next step

A page with draggable points would cover the gaps in one place: convex hull, point in polygon, segment intersection and triangle area, each checked against a brute-force version the way the combinatorics tasks are, with a 3D view for rotations and the pinhole camera.
