# Computer vision

| Folder | What is in it |
|---|---|
| [`openpose/`](./openpose/README-OPENPOSE.md) | Pose estimation: OpenPose and YOLO setup, pose search, AR overlays, anatomy visualisation |
| [`edge-detection/`](./edge-detection/README.md) | How edges are found (Sobel, Prewitt, Scharr, Roberts, Laplacian, Canny), with a [browser page](./edge-detection/index.html) and checked code |
| [`alpha-channel/`](./alpha-channel/README.md) | What the alpha channel does on a 3D model, with a [3D page](./alpha-channel/index.html) |

Edge detection is the classical step underneath much of the rest: pose estimators and marker detectors both start from image gradients, and a convolutional network's first layer learns filters much like Sobel kernels.

See also: [Edges, depth and segmentation](./edges-depth-and-segmentation.md), which compares edge detection with Depth Anything and SAM 3 and says which can run in a web page.

Geometry behind marker detection (the pinhole camera, the homography of a flat marker and the pose recovered from it) is on the [Geometry you can drag](../../learning-resources/mathematics/geometry/index.html) page.
