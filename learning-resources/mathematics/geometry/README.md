# Geometry you can drag

**[Open the page](./index.html)**: six sections with draggable points. Code is in [`geometry.js`](./geometry.js) (plain functions, no libraries) and is checked by [`check.js`](./check.js): `node check.js` runs 10 checks.

| Section | The idea | How it is checked |
|---|---|---|
| Triangle | Area is half the 2D cross product of two sides; the sign of the cross product says anticlockwise or clockwise; the angles add up to 180° | Cross product, Heron's formula and the shoelace formula agree on 300 random triangles |
| Two segments | `orient(a, b, c)` is positive when `c` is left of the line `a→b`. Segments cross when each one's ends are on opposite sides of the other, with special cases for touching and in-a-line | 4,000 small integer segments (many touching or overlapping) against an exact parametric calculation |
| Point in polygon | Ray casting counts crossings of a rightward ray (odd = inside); the winding number counts turns round the point (non-zero = inside) | The two rules agree on 40 random star-shaped polygons, and the fraction of random points inside matches the shoelace area |
| Convex hull | Andrew's monotone chain: sort, then keep only left turns | Against a slow method (a point is a corner unless other points enclose it) on 600 small sets with duplicates and points in a line; hull is convex and holds every point; hull area and perimeter bounds |
| Transformations | Rotation, stretch and shear are 2×2 matrices; multiplying them composes the steps; the determinant is the area scale (negative = flipped) | Determinant equals the measured area ratio on 100 random matrices; rotations add; order matters except for an even stretch |
| 3D and the camera | A 3×3 rotation keeps lengths (determinant 1). A pinhole camera divides by depth: `u = f·X/d + cx`, `v = cy − f·Y/d` | The formula equals the matrix form `K[R|t]`; Rodrigues' formula equals the quaternion matrix; moving along a ray keeps the pixel; doubling `f` doubles the offset |

## Conventions

- In the flat sections, x goes right and y goes up (the page flips y when drawing).
- The 3D section uses the three.js and OpenGL convention: X right, Y up, Z towards you, and the camera looks down −Z. The cube is pushed `D` in front of the camera.
- Rotations in the 3D section are applied about Z (roll) first, then X (pitch), then Y (yaw).

## Things the page shows on purpose

- **Segments are not lines.** Two lines can cross where the segments have already stopped.
- **The two inside-rules can disagree** when the outline crosses itself: ray casting uses even–odd, the winding number uses non-zero. Both are valid rules; the page lets you see where they split.
- **Order of transformations matters:** rotate-then-stretch is not stretch-then-rotate unless the stretch is even. 3D rotations do not commute either.
- **Depth, not distance:** halving the depth doubles the apparent size; the focal length only scales the picture.

See [Geometry in this repository](../geometry-coverage.md) for what the rest of the repository covers.
