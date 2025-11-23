# Voxelization and Shape Approximation with Primitive Shapes

## Table of Contents
1. [Overview](#overview)
2. [Voxelization (Cubes)](#voxelization-cubes)
3. [Triangular Decomposition](#triangular-decomposition)
4. [Octree Subdivision](#octree-subdivision)
5. [Tetrahedral Meshing](#tetrahedral-meshing)
6. [Game Development Applications](#game-development-applications)
7. [Performance Optimization](#performance-optimization)

---

## Overview

The process of approximating any arbitrary shape using simple primitives (cubes, triangles, tetrahedra) is fundamental to:
- **Voxel-based games** (Minecraft, voxel engines)
- **Physics simulations** (simplified collision)
- **Procedural generation**
- **Destructible environments**
- **Space partitioning** (octrees for optimization)
- **3D printing support structures**

### Key Concepts

1. **Voxelization**: Converting a mesh into a 3D grid of cubes (voxels)
2. **Marching Cubes**: Extracting smooth surfaces from voxel data
3. **Octree**: Adaptive subdivision using cubes of varying sizes
4. **Tetrahedral Meshing**: Filling volumes with tetrahedra (triangular pyramids)
5. **BSP Trees**: Splitting space with planes

---

## Voxelization (Cubes)

### Method 1: Basic Uniform Voxelization

This converts any mesh into a grid of cubes at a fixed resolution.

```python
import bpy
import bmesh
from mathutils import Vector
import math

def voxelize_mesh(obj, voxel_size=0.1):
    """
    Convert a mesh object into voxel cubes

    Args:
        obj: Blender mesh object
        voxel_size: Size of each voxel cube (smaller = more detail)

    Returns:
        List of voxel positions
    """
    # Get mesh data
    mesh = obj.data

    # Calculate bounding box
    bbox_corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    min_corner = Vector((
        min(v.x for v in bbox_corners),
        min(v.y for v in bbox_corners),
        min(v.z for v in bbox_corners)
    ))
    max_corner = Vector((
        max(v.x for v in bbox_corners),
        max(v.y for v in bbox_corners),
        max(v.z for v in bbox_corners)
    ))

    # Calculate grid dimensions
    grid_dims = [
        int(math.ceil((max_corner.x - min_corner.x) / voxel_size)),
        int(math.ceil((max_corner.y - min_corner.y) / voxel_size)),
        int(math.ceil((max_corner.z - min_corner.z) / voxel_size))
    ]

    print(f"Grid dimensions: {grid_dims} = {grid_dims[0] * grid_dims[1] * grid_dims[2]} voxels")

    # Create 3D grid
    voxel_positions = []

    # For each potential voxel position
    for x in range(grid_dims[0]):
        for y in range(grid_dims[1]):
            for z in range(grid_dims[2]):
                # Calculate voxel center
                voxel_center = Vector((
                    min_corner.x + (x + 0.5) * voxel_size,
                    min_corner.y + (y + 0.5) * voxel_size,
                    min_corner.z + (z + 0.5) * voxel_size
                ))

                # Check if voxel center is inside mesh
                # Convert to object local space
                local_point = obj.matrix_world.inverted() @ voxel_center

                # Ray casting method to check if point is inside
                if is_point_inside_mesh(obj, local_point):
                    voxel_positions.append(voxel_center)

    return voxel_positions


def is_point_inside_mesh(obj, point):
    """
    Check if a point is inside a mesh using ray casting
    Returns True if inside, False if outside
    """
    # Cast ray in +X direction
    direction = Vector((1.0, 0.0, 0.0))

    # Use Blender's ray_cast
    result, location, normal, index = obj.ray_cast(point, direction)

    if not result:
        # No hit in +X, try -X
        direction = Vector((-1.0, 0.0, 0.0))
        result, location, normal, index = obj.ray_cast(point, direction)
        if not result:
            return False

    # If we hit something, check if the normal points away from the ray
    # This indicates we're inside the mesh
    return direction.dot(normal) > 0


def create_voxel_cubes(voxel_positions, voxel_size=0.1, collection_name="Voxels"):
    """
    Create actual cube objects from voxel positions
    """
    # Create new collection for voxels
    voxel_collection = bpy.data.collections.new(collection_name)
    bpy.context.scene.collection.children.link(voxel_collection)

    # Create single cube mesh to instance
    bpy.ops.mesh.primitive_cube_add(size=voxel_size)
    cube_template = bpy.context.active_object
    cube_template.name = "VoxelTemplate"

    # For performance, use instancing
    for i, pos in enumerate(voxel_positions):
        # Create instance
        cube = cube_template.copy()
        cube.location = pos
        cube.name = f"Voxel_{i}"
        voxel_collection.objects.link(cube)

    # Remove template from main scene
    bpy.data.objects.remove(cube_template, do_unlink=True)

    return voxel_collection


# Usage Example
def voxelize_selected_object():
    """
    Voxelize the currently selected object
    """
    obj = bpy.context.active_object

    if not obj or obj.type != 'MESH':
        print("Please select a mesh object")
        return

    print(f"Voxelizing {obj.name}...")

    voxel_size = 0.2  # Adjust for detail level
    voxel_positions = voxelize_mesh(obj, voxel_size)

    print(f"Generated {len(voxel_positions)} voxels")

    create_voxel_cubes(voxel_positions, voxel_size)

    print("Voxelization complete!")

# Run it:
# voxelize_selected_object()
```

### Method 2: Optimized Voxelization with NumPy

For large meshes, using NumPy is much faster:

```python
import bpy
import numpy as np
from mathutils import Vector

def fast_voxelize(obj, voxel_size=0.1):
    """
    Fast voxelization using NumPy and scanline algorithm
    """
    mesh = obj.data

    # Get all vertices in world space
    verts = np.array([obj.matrix_world @ v.co for v in mesh.vertices])

    # Calculate bounds
    min_bound = verts.min(axis=0)
    max_bound = verts.max(axis=0)

    # Create grid
    grid_size = ((max_bound - min_bound) / voxel_size).astype(int) + 1

    print(f"Grid size: {grid_size}, Total potential voxels: {np.prod(grid_size)}")

    # Initialize voxel grid
    voxel_grid = np.zeros(grid_size, dtype=bool)

    # Rasterize triangles into voxel grid
    for poly in mesh.polygons:
        # Get triangle vertices
        tri_verts = verts[poly.vertices]

        # Calculate which voxels this triangle spans
        tri_min = ((tri_verts.min(axis=0) - min_bound) / voxel_size).astype(int)
        tri_max = ((tri_verts.max(axis=0) - min_bound) / voxel_size).astype(int)

        # Clamp to grid bounds
        tri_min = np.clip(tri_min, 0, grid_size - 1)
        tri_max = np.clip(tri_max, 0, grid_size - 1)

        # Mark all voxels in bounding box (conservative rasterization)
        voxel_grid[
            tri_min[0]:tri_max[0]+1,
            tri_min[1]:tri_max[1]+1,
            tri_min[2]:tri_max[2]+1
        ] = True

    # Convert grid to world positions
    voxel_indices = np.argwhere(voxel_grid)
    voxel_positions = min_bound + (voxel_indices + 0.5) * voxel_size

    return voxel_positions

# Usage
def fast_voxelize_selected():
    obj = bpy.context.active_object
    voxel_size = 0.2

    positions = fast_voxelize(obj, voxel_size)
    print(f"Generated {len(positions)} voxels")

    # Create cubes (same as before)
    create_voxel_cubes([Vector(p) for p in positions], voxel_size)
```

---

## Triangular Decomposition

### Method 1: Half-Cube Triangulation

Split each voxel cube into 5 tetrahedra or create triangular prisms:

```python
import bpy
import bmesh
from mathutils import Vector

def create_half_cube(location, size=1.0, orientation='diagonal'):
    """
    Create a triangular prism (half cube)

    orientation options:
    - 'diagonal': Cut diagonally
    - 'vertical': Cut vertically
    - 'horizontal': Cut horizontally
    """
    mesh = bpy.data.meshes.new("HalfCube")
    obj = bpy.data.objects.new("HalfCube", mesh)

    bm = bmesh.new()

    # Create vertices for a half cube (triangular prism)
    s = size / 2

    if orientation == 'diagonal':
        # Triangular prism cut diagonally
        verts = [
            bm.verts.new(Vector((0, -s, -s))),    # 0
            bm.verts.new(Vector((0, s, -s))),     # 1
            bm.verts.new(Vector((0, -s, s))),     # 2
            bm.verts.new(Vector((s, -s, -s))),    # 3
            bm.verts.new(Vector((s, s, -s))),     # 4
            bm.verts.new(Vector((s, -s, s))),     # 5
        ]

        # Create faces
        faces = [
            [verts[0], verts[1], verts[2]],  # Triangle face 1
            [verts[3], verts[5], verts[4]],  # Triangle face 2
            [verts[0], verts[2], verts[5], verts[3]],  # Rectangle
            [verts[1], verts[4], verts[5], verts[2]],  # Rectangle
            [verts[0], verts[3], verts[4], verts[1]],  # Rectangle
        ]

    for face_verts in faces:
        bm.faces.new(face_verts)

    bm.to_mesh(mesh)
    bm.free()

    obj.location = location
    bpy.context.collection.objects.link(obj)

    return obj


def voxelize_with_triangular_prisms(obj, voxel_size=0.2):
    """
    Fill a shape with triangular prisms (half cubes)
    """
    # First get voxel positions
    voxel_positions = voxelize_mesh(obj, voxel_size)

    # Create half cubes
    half_cubes = []
    for pos in voxel_positions:
        # Randomly orient or use a pattern
        half_cube = create_half_cube(pos, voxel_size, 'diagonal')
        half_cubes.append(half_cube)

    return half_cubes
```

### Method 2: Tetrahedral Decomposition

Each cube can be decomposed into 5 or 6 tetrahedra:

```python
def create_tetrahedron(v0, v1, v2, v3, name="Tetrahedron"):
    """
    Create a tetrahedron from 4 vertices
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)

    bm = bmesh.new()

    # Create vertices
    verts = [bm.verts.new(v) for v in [v0, v1, v2, v3]]

    # Create faces (4 triangular faces)
    bm.faces.new([verts[0], verts[1], verts[2]])
    bm.faces.new([verts[0], verts[3], verts[1]])
    bm.faces.new([verts[1], verts[3], verts[2]])
    bm.faces.new([verts[2], verts[3], verts[0]])

    bm.to_mesh(mesh)
    bm.free()

    bpy.context.collection.objects.link(obj)
    return obj


def decompose_cube_to_tetrahedra(center, size=1.0):
    """
    Decompose a cube into 5 tetrahedra
    This is the optimal decomposition that preserves symmetry
    """
    s = size / 2
    c = center

    # Cube vertices
    v = [
        Vector((c.x - s, c.y - s, c.z - s)),  # 0
        Vector((c.x + s, c.y - s, c.z - s)),  # 1
        Vector((c.x + s, c.y + s, c.z - s)),  # 2
        Vector((c.x - s, c.y + s, c.z - s)),  # 3
        Vector((c.x - s, c.y - s, c.z + s)),  # 4
        Vector((c.x + s, c.y - s, c.z + s)),  # 5
        Vector((c.x + s, c.y + s, c.z + s)),  # 6
        Vector((c.x - s, c.y + s, c.z + s)),  # 7
    ]

    # 5 tetrahedra that tile the cube
    tetrahedra = [
        [v[0], v[1], v[2], v[5]],
        [v[0], v[2], v[7], v[5]],
        [v[0], v[2], v[3], v[7]],
        [v[2], v[5], v[6], v[7]],
        [v[0], v[5], v[4], v[7]],
    ]

    tet_objects = []
    for i, tet_verts in enumerate(tetrahedra):
        tet = create_tetrahedron(*tet_verts, f"Tet_{i}")
        tet_objects.append(tet)

    return tet_objects


def voxelize_with_tetrahedra(obj, voxel_size=0.2):
    """
    Fill shape with tetrahedra
    """
    voxel_positions = voxelize_mesh(obj, voxel_size)

    all_tetrahedra = []
    for pos in voxel_positions:
        tets = decompose_cube_to_tetrahedra(pos, voxel_size)
        all_tetrahedra.extend(tets)

    print(f"Created {len(all_tetrahedra)} tetrahedra")
    return all_tetrahedra
```

---

## Octree Subdivision

Adaptive subdivision uses larger cubes in empty space, smaller cubes near details:

```python
import bpy
from mathutils import Vector

class OctreeNode:
    """
    Octree node for adaptive space subdivision
    """
    def __init__(self, center, size, depth=0, max_depth=5):
        self.center = center
        self.size = size
        self.depth = depth
        self.max_depth = max_depth
        self.children = None
        self.is_filled = False
        self.is_partial = False

    def subdivide(self):
        """Split this node into 8 children"""
        if self.children is not None:
            return  # Already subdivided

        if self.depth >= self.max_depth:
            return  # Max depth reached

        self.children = []
        child_size = self.size / 2
        child_depth = self.depth + 1

        # Create 8 child nodes
        for dx in [-1, 1]:
            for dy in [-1, 1]:
                for dz in [-1, 1]:
                    offset = Vector((dx, dy, dz)) * (child_size / 2)
                    child_center = self.center + offset
                    child = OctreeNode(child_center, child_size, child_depth, self.max_depth)
                    self.children.append(child)

    def is_leaf(self):
        return self.children is None


def build_octree_for_mesh(obj, max_depth=6, min_size=0.1):
    """
    Build an octree that adapts to mesh density
    """
    # Calculate root bounding box
    bbox_corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    min_corner = Vector((
        min(v.x for v in bbox_corners),
        min(v.y for v in bbox_corners),
        min(v.z for v in bbox_corners)
    ))
    max_corner = Vector((
        max(v.x for v in bbox_corners),
        max(v.y for v in bbox_corners),
        max(v.z for v in bbox_corners)
    ))

    # Calculate root size (use largest dimension)
    size = max(max_corner - min_corner)
    center = (min_corner + max_corner) / 2

    # Create root node
    root = OctreeNode(center, size, 0, max_depth)

    # Recursively subdivide
    subdivide_node_for_mesh(root, obj, min_size)

    return root


def subdivide_node_for_mesh(node, obj, min_size):
    """
    Recursively subdivide octree nodes based on mesh intersection
    """
    # Check if node intersects mesh
    intersection_type = check_node_mesh_intersection(node, obj)

    if intersection_type == 'empty':
        node.is_filled = False
        return
    elif intersection_type == 'full':
        node.is_filled = True
        node.is_partial = False
        return
    else:  # partial
        node.is_partial = True

        # Subdivide if not at max depth and above min size
        if node.depth < node.max_depth and node.size > min_size:
            node.subdivide()
            for child in node.children:
                subdivide_node_for_mesh(child, obj, min_size)
        else:
            # Leaf node that's partially filled - mark as filled
            node.is_filled = True


def check_node_mesh_intersection(node, obj):
    """
    Check if an octree node intersects the mesh
    Returns: 'empty', 'full', or 'partial'
    """
    # Sample points at node corners and center
    s = node.size / 2
    c = node.center

    test_points = [
        c,  # center
        c + Vector((-s, -s, -s)),
        c + Vector((s, -s, -s)),
        c + Vector((s, s, -s)),
        c + Vector((-s, s, -s)),
        c + Vector((-s, -s, s)),
        c + Vector((s, -s, s)),
        c + Vector((s, s, s)),
        c + Vector((-s, s, s)),
    ]

    inside_count = 0
    for point in test_points:
        local_point = obj.matrix_world.inverted() @ point
        if is_point_inside_mesh(obj, local_point):
            inside_count += 1

    if inside_count == 0:
        return 'empty'
    elif inside_count == len(test_points):
        return 'full'
    else:
        return 'partial'


def create_cubes_from_octree(root):
    """
    Create cube objects from octree leaf nodes
    """
    cubes = []

    def traverse(node):
        if node.is_leaf():
            if node.is_filled:
                # Create cube for this node
                bpy.ops.mesh.primitive_cube_add(size=node.size, location=node.center)
                cube = bpy.context.active_object
                cube.name = f"OctreeCube_D{node.depth}"
                cubes.append(cube)
        else:
            # Traverse children
            for child in node.children:
                traverse(child)

    traverse(root)
    return cubes


# Usage
def octree_voxelize_selected():
    """
    Create adaptive octree voxelization of selected object
    """
    obj = bpy.context.active_object

    print("Building octree...")
    root = build_octree_for_mesh(obj, max_depth=6, min_size=0.1)

    print("Creating cubes...")
    cubes = create_cubes_from_octree(root)

    print(f"Created {len(cubes)} octree cubes")

# octree_voxelize_selected()
```

---

## Game Development Applications

### 1. Voxel-Based Destruction

```python
def create_destructible_object(obj, voxel_size=0.2):
    """
    Convert object to voxels for destruction simulation
    Each voxel becomes a rigid body
    """
    voxel_positions = voxelize_mesh(obj, voxel_size)

    # Create collection for debris
    debris_collection = bpy.data.collections.new("Destructible_Debris")
    bpy.context.scene.collection.children.link(debris_collection)

    # Create cube template
    bpy.ops.mesh.primitive_cube_add(size=voxel_size)
    cube_template = bpy.context.active_object

    # Add rigid body physics
    for i, pos in enumerate(voxel_positions):
        cube = cube_template.copy()
        cube.data = cube_template.data.copy()
        cube.location = pos

        # Add rigid body
        debris_collection.objects.link(cube)
        bpy.context.view_layer.objects.active = cube
        bpy.ops.rigidbody.object_add()
        cube.rigid_body.mass = 0.1
        cube.rigid_body.friction = 0.5

    # Remove template
    bpy.data.objects.remove(cube_template, do_unlink=True)

    # Hide original object
    obj.hide_viewport = True
    obj.hide_render = True

# Usage: create_destructible_object(bpy.context.active_object, 0.15)
```

### 2. Simplified Collision Meshes

```python
def create_collision_mesh_from_voxels(obj, voxel_size=0.5):
    """
    Create low-poly collision mesh using large voxels
    """
    # Use large voxels for collision
    voxel_positions = voxelize_mesh(obj, voxel_size)

    # Combine all voxels into single mesh
    bpy.ops.mesh.primitive_cube_add(size=voxel_size)
    first_cube = bpy.context.active_object

    for pos in voxel_positions[1:]:
        bpy.ops.mesh.primitive_cube_add(size=voxel_size, location=pos)
        cube = bpy.context.active_object

        # Join to first cube
        cube.select_set(True)
        first_cube.select_set(True)
        bpy.context.view_layer.objects.active = first_cube
        bpy.ops.object.join()

    # Name as collision mesh
    collision_mesh = bpy.context.active_object
    collision_mesh.name = f"UCX_{obj.name}_01"
    collision_mesh.display_type = 'WIRE'

    return collision_mesh
```

### 3. Minecraft-Style Voxel Chunks

```python
class VoxelChunk:
    """
    Chunk-based voxel storage for large worlds
    """
    def __init__(self, chunk_pos, chunk_size=16):
        self.chunk_pos = chunk_pos  # (x, y, z) in chunk coordinates
        self.chunk_size = chunk_size
        self.voxels = {}  # Sparse storage: {(x,y,z): voxel_type}

    def set_voxel(self, local_pos, voxel_type):
        """Set voxel at local position within chunk"""
        self.voxels[local_pos] = voxel_type

    def get_voxel(self, local_pos):
        """Get voxel at local position"""
        return self.voxels.get(local_pos, 0)  # 0 = air

    def generate_mesh(self, voxel_size=1.0):
        """
        Generate optimized mesh for this chunk
        Only creates faces that are visible (not adjacent to other voxels)
        """
        mesh = bpy.data.meshes.new(f"Chunk_{self.chunk_pos}")
        obj = bpy.data.objects.new(f"Chunk_{self.chunk_pos}", mesh)

        bm = bmesh.new()

        # For each voxel, add only visible faces
        for (x, y, z), voxel_type in self.voxels.items():
            if voxel_type == 0:  # Air
                continue

            # World position
            world_pos = Vector((
                self.chunk_pos[0] * self.chunk_size + x,
                self.chunk_pos[1] * self.chunk_size + y,
                self.chunk_pos[2] * self.chunk_size + z
            )) * voxel_size

            # Check each face
            faces_to_create = []

            # Check -X face
            if self.get_voxel((x-1, y, z)) == 0:
                faces_to_create.append('X_NEG')
            # Check +X face
            if self.get_voxel((x+1, y, z)) == 0:
                faces_to_create.append('X_POS')
            # Similar for Y and Z...

            # Create visible faces only
            self._add_cube_faces(bm, world_pos, voxel_size, faces_to_create)

        bm.to_mesh(mesh)
        bm.free()

        bpy.context.collection.objects.link(obj)
        return obj

    def _add_cube_faces(self, bm, center, size, faces):
        """Add specific faces of a cube"""
        s = size / 2
        # Implementation of face creation...
        pass
```

---

## Performance Optimization

### Memory-Efficient Voxel Storage

```python
import numpy as np

class SparseVoxelOctree:
    """
    Memory-efficient voxel storage using octree
    Stores only occupied voxels
    """
    def __init__(self, grid_size=256):
        self.grid_size = grid_size
        self.data = {}  # Sparse storage

    def set_voxel(self, x, y, z, value=1):
        """Set voxel value"""
        if value == 0:
            # Remove if setting to empty
            if (x, y, z) in self.data:
                del self.data[(x, y, z)]
        else:
            self.data[(x, y, z)] = value

    def get_voxel(self, x, y, z):
        """Get voxel value"""
        return self.data.get((x, y, z), 0)

    def count_voxels(self):
        """Count non-empty voxels"""
        return len(self.data)

    def export_to_mesh(self, voxel_size=1.0):
        """Convert to optimized mesh with greedy meshing"""
        # Greedy meshing algorithm: combines adjacent voxels
        # into larger quads to reduce triangle count
        pass
```

### Greedy Meshing Algorithm

```python
def greedy_mesh_voxels(voxel_grid, voxel_size=1.0):
    """
    Greedy meshing: combines adjacent voxels into larger quads
    Dramatically reduces polygon count

    Example: 10x10x10 cube = 1000 cubes * 12 tris = 12,000 tris
    With greedy meshing: 6 faces * 2 tris = 12 tris!
    """
    mesh = bpy.data.meshes.new("GreedyMesh")
    bm = bmesh.new()

    # Process each axis
    for axis in [0, 1, 2]:  # X, Y, Z
        # Slice grid perpendicular to axis
        # Find rectangular regions of voxels
        # Create single quad for each region
        pass

    bm.to_mesh(mesh)
    bm.free()

    obj = bpy.data.objects.new("VoxelMesh", mesh)
    bpy.context.collection.objects.link(obj)
    return obj
```

---

## Complete Example: Interactive Voxel Painter

```python
import bpy
import bmesh
from mathutils import Vector

class VoxelPainter:
    """
    Interactive voxel painting system
    """
    def __init__(self, voxel_size=0.5, grid_size=32):
        self.voxel_size = voxel_size
        self.grid_size = grid_size
        self.voxels = {}  # Sparse storage
        self.mesh_obj = None
        self._create_mesh_object()

    def _create_mesh_object(self):
        """Create the mesh object for voxels"""
        mesh = bpy.data.meshes.new("VoxelMesh")
        self.mesh_obj = bpy.data.objects.new("VoxelMesh", mesh)
        bpy.context.collection.objects.link(self.mesh_obj)

    def add_voxel(self, grid_x, grid_y, grid_z, voxel_type=1):
        """Add voxel at grid position"""
        self.voxels[(grid_x, grid_y, grid_z)] = voxel_type
        self._rebuild_mesh()

    def remove_voxel(self, grid_x, grid_y, grid_z):
        """Remove voxel at grid position"""
        if (grid_x, grid_y, grid_z) in self.voxels:
            del self.voxels[(grid_x, grid_y, grid_z)]
            self._rebuild_mesh()

    def _rebuild_mesh(self):
        """Rebuild mesh from voxel data"""
        bm = bmesh.new()

        # Create cube for each voxel
        for (gx, gy, gz), vtype in self.voxels.items():
            center = Vector((
                gx * self.voxel_size,
                gy * self.voxel_size,
                gz * self.voxel_size
            ))

            # Add cube
            bmesh.ops.create_cube(bm, size=self.voxel_size)
            # Translate to position
            bmesh.ops.translate(bm, vec=center, verts=bm.verts[-8:])

        # Update mesh
        bm.to_mesh(self.mesh_obj.data)
        bm.free()
        self.mesh_obj.data.update()

    def raycast_add_voxel(self, ray_origin, ray_direction):
        """
        Add voxel using raycast from camera/cursor
        Useful for interactive painting
        """
        # Cast ray through voxel grid
        # Find first empty voxel adjacent to filled voxel
        # Add voxel there
        pass

# Usage
painter = VoxelPainter(voxel_size=0.5)
painter.add_voxel(0, 0, 0)
painter.add_voxel(1, 0, 0)
painter.add_voxel(0, 1, 0)
# Creates a few voxels at origin
```

---

## Resources

### Python Libraries
- **numpy** - Fast array operations
- **scipy.spatial** - Spatial algorithms (Delaunay triangulation)
- **trimesh** - Mesh processing and voxelization
- **PyMesh** - Advanced mesh operations

### Blender Addons
- **3D Print Toolbox** - Mesh analysis for manifold checking
- **Bool Tool** - CSG operations
- **Tissue** - Tessellation and patterns

### Algorithms
- **Marching Cubes** - Surface extraction from voxels
- **Dual Contouring** - Better surface extraction (preserves sharp features)
- **Surface Nets** - Fast surface extraction
- **Greedy Meshing** - Polygon reduction for voxels

### Game Engines Support
- **Unity** - Voxel frameworks: Voxel Play, Uniblock
- **Unreal** - Voxel Plugin
- **Godot** - Voxel Tools module
- **Custom** - Most engines can import mesh data

---

## Conclusion

Voxelization and primitive shape approximation are powerful techniques for:
- **Game development** (voxel games, destruction, collision)
- **Procedural generation** (terrain, structures)
- **Optimization** (LOD systems, occlusion culling)
- **Physics** (simplified collision, simulation)

The choice between cubes, triangular prisms, or tetrahedra depends on your use case:
- **Cubes**: Easiest, best for Minecraft-style voxel games
- **Octrees**: Best for adaptive detail and optimization
- **Tetrahedra**: Best for physics simulation and finite element analysis
- **Triangular prisms**: Good middle ground for visual variety

All methods can be implemented in Blender with Python, giving you full control over your asset pipeline.
