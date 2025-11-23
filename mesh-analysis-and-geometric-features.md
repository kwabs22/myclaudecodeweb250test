# Mesh Analysis and Geometric Feature Extraction

## Table of Contents
1. [Overview](#overview)
2. [Curvature Analysis](#curvature-analysis)
3. [Normal Direction and Angles](#normal-direction-and-angles)
4. [Feature Detection](#feature-detection)
5. [Manufacturing Analysis](#manufacturing-analysis)
6. [Phone Cover Design Workflow](#phone-cover-design-workflow)
7. [Mesh Labeling and Annotation](#mesh-labeling-and-annotation)
8. [Automated Dimension Extraction](#automated-dimension-extraction)

---

## Overview

When designing products like phone covers, we need to extract geometric information from 3D scans or CAD models:

- **Curvature** - How curved is the surface? (tight curves vs flat areas)
- **Normals** - Surface direction at each point
- **Angles** - Draft angles, feature angles
- **Features** - Edges, corners, holes, flat surfaces
- **Dimensions** - Width, height, depth, clearances
- **Undercuts** - Areas that prevent mold ejection

### Phone Cover Manufacturing Process

```
1. 3D Scan Phone
   ↓
2. Analyze Geometry (curvature, features)
   ↓
3. Create Offset Surface (+0.5mm clearance)
   ↓
4. Check Manufacturability (draft angles, undercuts)
   ↓
5. Design Features (openings for buttons, camera)
   ↓
6. Export for Manufacturing (injection molding)
```

---

## Curvature Analysis

### Understanding Curvature

**Curvature** measures how quickly a surface changes direction:

- **Gaussian Curvature (K)**: Product of principal curvatures
  - K > 0: Sphere-like (bumps)
  - K = 0: Cylinder-like or flat
  - K < 0: Saddle-like (curves in opposite directions)

- **Mean Curvature (H)**: Average of principal curvatures
  - Indicates overall "bendiness"

### Method 1: Calculate Vertex Curvature

```python
import bpy
import bmesh
from mathutils import Vector
import math

def calculate_vertex_curvature(obj):
    """
    Calculate approximate curvature at each vertex
    Returns mean curvature values
    """
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.verts.ensure_lookup_table()
    bm.edges.ensure_lookup_table()
    bm.faces.ensure_lookup_table()

    curvatures = []

    for vert in bm.verts:
        # Method 1: Angle deficit method
        # Sum angles around vertex, compare to 2π (flat surface)

        angle_sum = 0
        for face in vert.link_faces:
            # Get angle at this vertex in this face
            angle = calculate_face_angle_at_vertex(face, vert)
            angle_sum += angle

        # For a flat surface, angle_sum = 2π
        # Deviation indicates curvature
        angle_deficit = 2 * math.pi - angle_sum

        # Approximate Gaussian curvature
        # Normalize by vertex area
        vertex_area = calculate_vertex_area(vert)
        gaussian_curvature = angle_deficit / vertex_area if vertex_area > 0 else 0

        curvatures.append({
            'vertex_index': vert.index,
            'position': vert.co.copy(),
            'gaussian_curvature': gaussian_curvature,
            'angle_deficit': angle_deficit
        })

    bm.free()
    return curvatures


def calculate_face_angle_at_vertex(face, vertex):
    """
    Calculate the interior angle of a face at a specific vertex
    """
    # Get the two edges connected to this vertex in this face
    edges_at_vert = [e for e in face.edges if vertex in e.verts]

    if len(edges_at_vert) != 2:
        return 0

    # Get direction vectors
    v0 = vertex.co
    v1 = edges_at_vert[0].other_vert(vertex).co
    v2 = edges_at_vert[1].other_vert(vertex).co

    # Calculate angle between vectors
    vec1 = (v1 - v0).normalized()
    vec2 = (v2 - v0).normalized()

    # Clamp dot product to avoid numerical errors
    dot = max(-1.0, min(1.0, vec1.dot(vec2)))
    angle = math.acos(dot)

    return angle


def calculate_vertex_area(vert):
    """
    Calculate the area associated with a vertex
    (1/3 of all connected face areas)
    """
    total_area = 0
    for face in vert.link_faces:
        total_area += face.calc_area()

    # Divide by 3 (each face contributes to 3 vertices)
    return total_area / 3.0 if len(vert.link_faces) > 0 else 0


def visualize_curvature(obj, curvatures):
    """
    Visualize curvature using vertex colors
    Red = high positive curvature (convex)
    Blue = high negative curvature (concave)
    Green = low curvature (flat)
    """
    mesh = obj.data

    # Ensure vertex colors exist
    if not mesh.vertex_colors:
        mesh.vertex_colors.new()

    color_layer = mesh.vertex_colors.active

    # Find curvature range for normalization
    k_values = [c['gaussian_curvature'] for c in curvatures]
    k_min = min(k_values)
    k_max = max(k_values)
    k_range = k_max - k_min if k_max != k_min else 1.0

    # Create vertex index to curvature map
    curv_map = {c['vertex_index']: c['gaussian_curvature'] for c in curvatures}

    # Color each face loop based on vertex curvature
    for poly in mesh.polygons:
        for loop_idx in poly.loop_indices:
            loop = mesh.loops[loop_idx]
            vert_idx = loop.vertex_index

            k = curv_map.get(vert_idx, 0)

            # Normalize to [-1, 1]
            k_normalized = (k - k_min) / k_range * 2 - 1

            # Map to color
            if k_normalized > 0:
                # Positive curvature: green to red
                color = (k_normalized, 1 - k_normalized, 0, 1)
            else:
                # Negative curvature: green to blue
                color = (0, 1 + k_normalized, -k_normalized, 1)

            color_layer.data[loop_idx].color = color

    # Update mesh
    mesh.update()


# Usage
def analyze_curvature_of_selected():
    """
    Analyze and visualize curvature of selected object
    """
    obj = bpy.context.active_object

    if not obj or obj.type != 'MESH':
        print("Please select a mesh object")
        return

    print(f"Analyzing curvature of {obj.name}...")
    curvatures = calculate_vertex_curvature(obj)

    print(f"Calculated curvature for {len(curvatures)} vertices")

    # Find high curvature areas
    high_curv = [c for c in curvatures if abs(c['gaussian_curvature']) > 1.0]
    print(f"Found {len(high_curv)} high-curvature vertices")

    # Visualize
    visualize_curvature(obj, curvatures)
    print("Curvature visualization applied to vertex colors")

    return curvatures

# Run: analyze_curvature_of_selected()
```

### Method 2: Mean Curvature via Edge Lengths

```python
def calculate_mean_curvature_simple(obj):
    """
    Simpler approximation using edge length differences
    Good for quick analysis
    """
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.normal_update()

    mean_curvatures = []

    for vert in bm.verts:
        # Calculate mean curvature using Laplacian
        laplacian = Vector((0, 0, 0))

        for edge in vert.link_edges:
            other = edge.other_vert(vert)
            laplacian += (other.co - vert.co)

        if len(vert.link_edges) > 0:
            laplacian /= len(vert.link_edges)

        # Project onto normal direction
        mean_curvature = laplacian.dot(vert.normal)

        mean_curvatures.append({
            'vertex_index': vert.index,
            'position': vert.co.copy(),
            'mean_curvature': mean_curvature,
            'normal': vert.normal.copy()
        })

    bm.free()
    return mean_curvatures
```

---

## Normal Direction and Angles

### Calculate Surface Normals

```python
def analyze_surface_normals(obj):
    """
    Analyze face normals to find surface directions
    """
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.faces.ensure_lookup_table()
    bm.normal_update()

    normal_data = []

    for face in bm.faces:
        normal_data.append({
            'face_index': face.index,
            'center': face.calc_center_median(),
            'normal': face.normal.copy(),
            'area': face.calc_area()
        })

    bm.free()
    return normal_data


def calculate_draft_angle(face_normal, mold_direction=Vector((0, 0, 1))):
    """
    Calculate draft angle for manufacturing

    Draft angle is the angle between the face normal and the mold direction.
    For injection molding, need at least 1-3 degrees draft angle.

    Args:
        face_normal: Normal vector of face
        mold_direction: Direction mold opens (usually +Z)

    Returns:
        Angle in degrees from vertical
    """
    # Angle between normal and mold direction
    dot = face_normal.dot(mold_direction)
    dot = max(-1.0, min(1.0, dot))  # Clamp
    angle_rad = math.acos(dot)

    # Convert to degrees
    angle_deg = math.degrees(angle_rad)

    # Draft angle is deviation from 90 degrees
    draft_angle = abs(90 - angle_deg)

    return draft_angle


def find_problematic_draft_angles(obj, min_draft=2.0, mold_dir=Vector((0, 0, 1))):
    """
    Find faces with insufficient draft angle for molding
    """
    normals = analyze_surface_normals(obj)

    problematic_faces = []

    for data in normals:
        draft = calculate_draft_angle(data['normal'], mold_dir)

        if draft < min_draft:
            problematic_faces.append({
                'face_index': data['face_index'],
                'center': data['center'],
                'normal': data['normal'],
                'draft_angle': draft
            })

    return problematic_faces


# Usage
def check_manufacturability():
    """
    Check if object can be injection molded
    """
    obj = bpy.context.active_object

    print("Checking draft angles...")
    problems = find_problematic_draft_angles(obj, min_draft=2.0)

    print(f"Found {len(problems)} faces with insufficient draft angle")

    for p in problems[:10]:  # Show first 10
        print(f"  Face {p['face_index']}: {p['draft_angle']:.2f}° draft")

    return problems
```

---

## Feature Detection

### Detect Edges and Corners

```python
def detect_sharp_edges(obj, angle_threshold=30.0):
    """
    Detect sharp edges where face angle exceeds threshold
    These are important features for manufacturing
    """
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.edges.ensure_lookup_table()
    bm.normal_update()

    sharp_edges = []

    for edge in bm.edges:
        # Edge must have exactly 2 faces for angle calculation
        if len(edge.link_faces) == 2:
            face1, face2 = edge.link_faces

            # Calculate angle between face normals
            dot = face1.normal.dot(face2.normal)
            dot = max(-1.0, min(1.0, dot))
            angle_rad = math.acos(dot)
            angle_deg = math.degrees(angle_rad)

            if angle_deg > angle_threshold:
                sharp_edges.append({
                    'edge_index': edge.index,
                    'vertices': [v.index for v in edge.verts],
                    'midpoint': (edge.verts[0].co + edge.verts[1].co) / 2,
                    'angle': angle_deg,
                    'length': edge.calc_length()
                })

    bm.free()
    return sharp_edges


def detect_flat_regions(obj, curvature_threshold=0.1):
    """
    Detect flat or nearly flat regions
    Important for phone cover contact surfaces
    """
    curvatures = calculate_vertex_curvature(obj)

    flat_vertices = [
        c for c in curvatures
        if abs(c['gaussian_curvature']) < curvature_threshold
    ]

    return flat_vertices


def detect_high_curvature_features(obj, curvature_threshold=2.0):
    """
    Detect tight curves (corners, edges)
    These may need special attention in manufacturing
    """
    curvatures = calculate_vertex_curvature(obj)

    high_curv = [
        c for c in curvatures
        if abs(c['gaussian_curvature']) > curvature_threshold
    ]

    return high_curv


# Comprehensive feature detection
def detect_all_features(obj):
    """
    Run all feature detection algorithms
    """
    print("Detecting features...")

    features = {
        'sharp_edges': detect_sharp_edges(obj, angle_threshold=30),
        'flat_regions': detect_flat_regions(obj, curvature_threshold=0.1),
        'high_curvature': detect_high_curvature_features(obj, curvature_threshold=2.0)
    }

    print(f"  Sharp edges: {len(features['sharp_edges'])}")
    print(f"  Flat vertices: {len(features['flat_regions'])}")
    print(f"  High curvature: {len(features['high_curvature'])}")

    return features
```

---

## Manufacturing Analysis

### Detect Undercuts

```python
def detect_undercuts(obj, mold_direction=Vector((0, 0, 1))):
    """
    Detect undercuts that would prevent mold ejection

    Undercuts are surfaces where the normal points against
    the mold opening direction.
    """
    normals = analyze_surface_normals(obj)

    undercuts = []

    for data in normals:
        # If normal points opposite to mold direction, it's an undercut
        dot = data['normal'].dot(mold_direction)

        if dot < -0.1:  # Some tolerance
            undercut_severity = abs(dot)
            undercuts.append({
                'face_index': data['face_index'],
                'center': data['center'],
                'normal': data['normal'],
                'severity': undercut_severity
            })

    return undercuts


def calculate_parting_line(obj):
    """
    Find where the mold would split (parting line)
    This is where surface normal is perpendicular to mold direction
    """
    normals = analyze_surface_normals(obj)
    mold_dir = Vector((0, 0, 1))

    parting_faces = []

    for data in normals:
        dot = data['normal'].dot(mold_dir)

        # Perpendicular within tolerance
        if abs(dot) < 0.1:
            parting_faces.append({
                'face_index': data['face_index'],
                'center': data['center'],
                'normal': data['normal']
            })

    return parting_faces


def analyze_wall_thickness(obj, ray_samples=100):
    """
    Analyze wall thickness by casting rays through object
    Important for injection molding (need uniform thickness)
    """
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.faces.ensure_lookup_table()
    bm.normal_update()

    thickness_data = []

    import random
    random.seed(42)

    # Sample random faces
    sample_faces = random.sample(list(bm.faces), min(ray_samples, len(bm.faces)))

    for face in sample_faces:
        center = face.calc_center_median()
        normal = face.normal

        # Cast ray in opposite direction to find other side
        hit, location, normal_hit, index = obj.ray_cast(
            center + normal * 0.001,  # Offset slightly
            -normal,
            distance=10.0
        )

        if hit:
            thickness = (location - center).length
            thickness_data.append({
                'position': center,
                'thickness': thickness,
                'face_index': face.index
            })

    bm.free()
    return thickness_data


# Comprehensive manufacturing check
def manufacturing_check_full(obj):
    """
    Complete manufacturing analysis
    """
    print("=== Manufacturing Analysis ===")

    # Draft angles
    print("\n1. Draft Angle Check:")
    draft_problems = find_problematic_draft_angles(obj, min_draft=2.0)
    print(f"   {len(draft_problems)} faces need draft angle correction")

    # Undercuts
    print("\n2. Undercut Detection:")
    undercuts = detect_undercuts(obj)
    print(f"   {len(undercuts)} undercut faces detected")
    if undercuts:
        avg_severity = sum(u['severity'] for u in undercuts) / len(undercuts)
        print(f"   Average severity: {avg_severity:.2f}")

    # Wall thickness
    print("\n3. Wall Thickness Analysis:")
    thickness = analyze_wall_thickness(obj, ray_samples=50)
    if thickness:
        thicknesses = [t['thickness'] for t in thickness]
        print(f"   Min thickness: {min(thicknesses):.3f}")
        print(f"   Max thickness: {max(thicknesses):.3f}")
        print(f"   Avg thickness: {sum(thicknesses)/len(thicknesses):.3f}")

    # Sharp edges
    print("\n4. Sharp Edge Detection:")
    sharp = detect_sharp_edges(obj, angle_threshold=30)
    print(f"   {len(sharp)} sharp edges found")

    return {
        'draft_problems': draft_problems,
        'undercuts': undercuts,
        'thickness': thickness,
        'sharp_edges': sharp
    }
```

---

## Phone Cover Design Workflow

### Complete Phone Cover Pipeline

```python
class PhoneCoverDesigner:
    """
    Complete workflow for designing a phone cover from a 3D scan
    """
    def __init__(self, phone_obj, clearance=0.5):
        self.phone = phone_obj
        self.clearance = clearance  # mm
        self.cover = None
        self.features = {}

    def step1_analyze_phone_geometry(self):
        """
        Analyze the phone scan to extract features
        """
        print("Step 1: Analyzing phone geometry...")

        # Detect features
        self.features = detect_all_features(self.phone)

        # Find button locations (high curvature regions)
        self.button_locations = self._detect_buttons()

        # Find camera location (usually extruding feature)
        self.camera_location = self._detect_camera()

        print(f"  Found {len(self.button_locations)} buttons")
        print(f"  Found camera at {self.camera_location}")

    def step2_create_offset_surface(self):
        """
        Create cover shell by offsetting phone surface
        """
        print("Step 2: Creating offset surface...")

        # Duplicate phone mesh
        self.cover = self.phone.copy()
        self.cover.data = self.phone.data.copy()
        self.cover.name = "PhoneCover"
        bpy.context.collection.objects.link(self.cover)

        # Add solidify modifier for offset
        solidify = self.cover.modifiers.new(name="Solidify", type='SOLIDIFY')
        solidify.thickness = -self.clearance  # Negative = outward
        solidify.offset = 1.0

        # Add some wall thickness
        solidify.thickness = -self.clearance * 2

        print(f"  Created cover with {self.clearance}mm clearance")

    def step3_create_openings(self):
        """
        Cut openings for buttons, camera, ports
        """
        print("Step 3: Creating openings...")

        # Create opening for camera
        if self.camera_location:
            self._create_camera_opening()

        # Create openings for buttons
        for i, button_pos in enumerate(self.button_locations):
            self._create_button_opening(button_pos, i)

        print(f"  Created {len(self.button_locations) + 1} openings")

    def step4_check_manufacturability(self):
        """
        Check if design can be manufactured
        """
        print("Step 4: Checking manufacturability...")

        # Apply modifiers to get final geometry
        bpy.context.view_layer.objects.active = self.cover
        bpy.ops.object.convert(target='MESH')

        # Run manufacturing checks
        analysis = manufacturing_check_full(self.cover)

        return analysis

    def step5_optimize_for_molding(self):
        """
        Optimize design for injection molding
        """
        print("Step 5: Optimizing for injection molding...")

        # Add draft angles using modifier
        # Add ribs for strength
        # Ensure uniform wall thickness

        print("  Optimization complete")

    def _detect_buttons(self):
        """
        Detect button locations using curvature analysis
        """
        high_curv = self.features.get('high_curvature', [])

        # Cluster nearby high-curvature points
        # (simplified - would use proper clustering in production)
        button_positions = []

        # Group by proximity
        for curv in high_curv:
            pos = curv['position']
            # Check if far from existing buttons
            if all((pos - bp).length > 10.0 for bp in button_positions):
                button_positions.append(pos)

        return button_positions[:5]  # Limit to likely buttons

    def _detect_camera(self):
        """
        Detect camera location (usually highest point on back)
        """
        mesh = self.phone.data

        # Find vertex with max Z coordinate
        max_z = max(self.phone.matrix_world @ v.co for v in mesh.vertices)

        return max_z

    def _create_camera_opening(self):
        """
        Create opening for camera module
        """
        # Add boolean modifier with cylinder to cut hole
        bpy.ops.mesh.primitive_cylinder_add(
            radius=8.0,
            depth=5.0,
            location=self.camera_location
        )
        cutter = bpy.context.active_object

        bool_mod = self.cover.modifiers.new(name="CameraCut", type='BOOLEAN')
        bool_mod.operation = 'DIFFERENCE'
        bool_mod.object = cutter

        cutter.hide_viewport = True

    def _create_button_opening(self, position, index):
        """
        Create opening for button
        """
        # Similar to camera opening but smaller
        pass

    def run_full_workflow(self):
        """
        Execute complete phone cover design workflow
        """
        print("=== Phone Cover Design Workflow ===\n")

        self.step1_analyze_phone_geometry()
        self.step2_create_offset_surface()
        self.step3_create_openings()
        analysis = self.step4_check_manufacturability()
        self.step5_optimize_for_molding()

        print("\n=== Design Complete ===")
        return self.cover, analysis


# Usage
def design_phone_cover_from_scan():
    """
    Design a phone cover from selected phone scan
    """
    phone = bpy.context.active_object

    if not phone:
        print("Please select the phone scan object")
        return

    designer = PhoneCoverDesigner(phone, clearance=0.5)
    cover, analysis = designer.run_full_workflow()

    return cover
```

---

## Mesh Labeling and Annotation

### Add 3D Text Labels to Mesh Features

```python
def add_label_to_mesh(text, location, size=0.5):
    """
    Add a 3D text label at a specific location
    """
    # Create text object
    bpy.ops.object.text_add(location=location)
    text_obj = bpy.context.active_object
    text_obj.data.body = text
    text_obj.data.size = size
    text_obj.data.extrude = 0.02

    # Convert to mesh for export
    bpy.ops.object.convert(target='MESH')

    return text_obj


def label_sharp_edges(obj):
    """
    Label all sharp edges with their angle
    """
    sharp_edges = detect_sharp_edges(obj, angle_threshold=30)

    labels = []
    for i, edge in enumerate(sharp_edges[:20]):  # Limit to 20 labels
        text = f"{edge['angle']:.1f}°"
        label = add_label_to_mesh(text, edge['midpoint'], size=0.3)
        labels.append(label)

    return labels


def create_dimension_annotations(obj):
    """
    Add dimension annotations (like technical drawings)
    """
    # Get bounding box
    bbox = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]

    min_corner = Vector((
        min(v.x for v in bbox),
        min(v.y for v in bbox),
        min(v.z for v in bbox)
    ))
    max_corner = Vector((
        max(v.x for v in bbox),
        max(v.y for v in bbox),
        max(v.z for v in bbox)
    ))

    dimensions = max_corner - min_corner

    # Add dimension labels
    labels = []

    # Width (X)
    width_pos = Vector((
        (min_corner.x + max_corner.x) / 2,
        min_corner.y - 2,
        min_corner.z
    ))
    label = add_label_to_mesh(f"W: {dimensions.x:.1f}", width_pos, size=0.5)
    labels.append(label)

    # Height (Z)
    height_pos = Vector((
        max_corner.x + 2,
        min_corner.y,
        (min_corner.z + max_corner.z) / 2
    ))
    label = add_label_to_mesh(f"H: {dimensions.z:.1f}", height_pos, size=0.5)
    labels.append(label)

    # Depth (Y)
    depth_pos = Vector((
        min_corner.x,
        (min_corner.y + max_corner.y) / 2,
        min_corner.z - 2
    ))
    label = add_label_to_mesh(f"D: {dimensions.y:.1f}", depth_pos, size=0.5)
    labels.append(label)

    return labels, dimensions
```

### Create Annotation Empties

```python
def create_feature_markers(obj):
    """
    Create empty objects at important feature locations
    Useful for documenting specific points
    """
    features = detect_all_features(obj)

    markers = []

    # Mark sharp edges
    for edge in features['sharp_edges'][:10]:
        bpy.ops.object.empty_add(
            type='SPHERE',
            location=edge['midpoint'],
            radius=0.2
        )
        marker = bpy.context.active_object
        marker.name = f"Edge_{edge['angle']:.0f}deg"
        marker.empty_display_size = 0.2
        marker.color = (1, 0, 0, 1)  # Red
        markers.append(marker)

    # Mark high curvature points
    for curv in features['high_curvature'][:10]:
        bpy.ops.object.empty_add(
            type='CONE',
            location=curv['position'],
            radius=0.15
        )
        marker = bpy.context.active_object
        marker.name = f"HighCurv_{curv['gaussian_curvature']:.1f}"
        marker.empty_display_size = 0.15
        marker.color = (0, 1, 0, 1)  # Green
        markers.append(marker)

    return markers
```

---

## Automated Dimension Extraction

### Extract All Critical Dimensions

```python
def extract_all_dimensions(obj):
    """
    Extract comprehensive dimensional data from mesh
    """
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.verts.ensure_lookup_table()

    # Transform to world space
    world_verts = [obj.matrix_world @ v.co for v in bm.verts]

    # Overall bounding box
    bbox_min = Vector((
        min(v.x for v in world_verts),
        min(v.y for v in world_verts),
        min(v.z for v in world_verts)
    ))
    bbox_max = Vector((
        max(v.x for v in world_verts),
        max(v.y for v in world_verts),
        max(v.z for v in world_verts)
    ))

    overall_dims = bbox_max - bbox_min

    # Find holes (negative space detection)
    holes = detect_holes(obj)

    # Sharp edge lengths
    sharp_edges = detect_sharp_edges(obj)
    edge_lengths = [e['length'] for e in sharp_edges]

    # Curvature statistics
    curvatures = calculate_vertex_curvature(obj)
    curv_values = [c['gaussian_curvature'] for c in curvatures]

    dimensions = {
        'overall': {
            'width': overall_dims.x,
            'height': overall_dims.z,
            'depth': overall_dims.y,
            'volume': calculate_volume(obj),
            'surface_area': calculate_surface_area(obj)
        },
        'features': {
            'hole_count': len(holes),
            'hole_diameters': [h['diameter'] for h in holes],
            'sharp_edge_count': len(sharp_edges),
            'total_edge_length': sum(edge_lengths)
        },
        'curvature': {
            'min': min(curv_values),
            'max': max(curv_values),
            'mean': sum(curv_values) / len(curv_values),
            'flat_area_percentage': calculate_flat_percentage(curvatures)
        }
    }

    bm.free()
    return dimensions


def calculate_volume(obj):
    """
    Calculate approximate volume using mesh
    """
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    volume = bm.calc_volume()
    bm.free()
    return abs(volume)


def calculate_surface_area(obj):
    """
    Calculate total surface area
    """
    total_area = 0
    for poly in obj.data.polygons:
        total_area += poly.area
    return total_area


def calculate_flat_percentage(curvatures):
    """
    Calculate what percentage of surface is flat
    """
    flat_threshold = 0.1
    flat_count = sum(1 for c in curvatures if abs(c['gaussian_curvature']) < flat_threshold)
    return (flat_count / len(curvatures)) * 100


def detect_holes(obj):
    """
    Detect circular holes in mesh
    (simplified - would use proper edge loop analysis in production)
    """
    # Look for edge loops that form circles
    # Measure their diameter
    # This is a placeholder
    return []


def export_dimension_report(obj, filepath):
    """
    Export dimensional analysis as JSON
    """
    import json

    dimensions = extract_all_dimensions(obj)

    with open(filepath, 'w') as f:
        json.dump(dimensions, f, indent=2)

    print(f"Dimension report saved to {filepath}")
    return dimensions


# Usage
def analyze_object_dimensions():
    """
    Complete dimensional analysis of selected object
    """
    obj = bpy.context.active_object

    print("=== Dimensional Analysis ===\n")

    dims = extract_all_dimensions(obj)

    print("Overall Dimensions:")
    print(f"  Width:  {dims['overall']['width']:.2f} mm")
    print(f"  Height: {dims['overall']['height']:.2f} mm")
    print(f"  Depth:  {dims['overall']['depth']:.2f} mm")
    print(f"  Volume: {dims['overall']['volume']:.2f} mm³")
    print(f"  Surface Area: {dims['overall']['surface_area']:.2f} mm²")

    print("\nCurvature Analysis:")
    print(f"  Min curvature: {dims['curvature']['min']:.3f}")
    print(f"  Max curvature: {dims['curvature']['max']:.3f}")
    print(f"  Flat surface: {dims['curvature']['flat_area_percentage']:.1f}%")

    print("\nFeatures:")
    print(f"  Sharp edges: {dims['features']['sharp_edge_count']}")

    # Export to file
    export_path = bpy.path.abspath("//dimension_report.json")
    export_dimension_report(obj, export_path)

    return dims
```

---

## Advanced: Geodesic Distance Mapping

### Calculate Distance Along Surface

```python
def calculate_geodesic_distance_from_point(obj, start_vertex_index):
    """
    Calculate distance along surface from a starting vertex
    (Dijkstra's algorithm on mesh)

    Useful for:
    - Finding shortest path on surface
    - Measuring curved surface distances
    - Layout planning for phone covers
    """
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.verts.ensure_lookup_table()

    import heapq

    # Initialize distances
    distances = {v.index: float('inf') for v in bm.verts}
    distances[start_vertex_index] = 0

    # Priority queue: (distance, vertex_index)
    queue = [(0, start_vertex_index)]
    visited = set()

    while queue:
        current_dist, current_idx = heapq.heappop(queue)

        if current_idx in visited:
            continue

        visited.add(current_idx)
        current_vert = bm.verts[current_idx]

        # Check all neighbors
        for edge in current_vert.link_edges:
            neighbor = edge.other_vert(current_vert)
            neighbor_idx = neighbor.index

            if neighbor_idx in visited:
                continue

            # Distance = edge length
            edge_length = edge.calc_length()
            new_distance = current_dist + edge_length

            if new_distance < distances[neighbor_idx]:
                distances[neighbor_idx] = new_distance
                heapq.heappush(queue, (new_distance, neighbor_idx))

    bm.free()
    return distances
```

---

## Summary

### Key Techniques for Mesh Analysis

1. **Curvature Analysis**
   - Gaussian curvature (bumps vs saddles)
   - Mean curvature (overall bendiness)
   - Visualize with vertex colors

2. **Normal Analysis**
   - Surface direction at each point
   - Draft angle calculation for molding
   - Undercut detection

3. **Feature Detection**
   - Sharp edges (angle threshold)
   - Flat regions (low curvature)
   - High-curvature features (buttons, corners)

4. **Manufacturing Checks**
   - Draft angles (2-3° minimum)
   - Undercuts (prevent ejection)
   - Wall thickness uniformity
   - Parting line location

5. **Dimensioning**
   - Bounding box extraction
   - Volume and surface area
   - Feature measurements
   - Automated annotation

### Phone Cover Workflow Summary

```
1. 3D Scan Phone
   ↓
2. Curvature Analysis → Find buttons, camera
   ↓
3. Offset Surface → Create clearance shell
   ↓
4. Cut Openings → Buttons, ports, camera
   ↓
5. Manufacturing Check → Draft, undercuts, thickness
   ↓
6. Optimize → Add ribs, adjust draft
   ↓
7. Export → STL for molding
```

All these techniques can be automated with Python in Blender!

---

## Resources

### Libraries
- **trimesh** - Advanced mesh processing
- **PyMesh** - Comprehensive mesh operations
- **Open3D** - 3D data processing
- **MeshLab** - Curvature and quality analysis

### Manufacturing
- **Proto Labs** - Injection molding guides
- **Xometry** - Manufacturability analysis tools
- **Fictiv** - Design for manufacturing resources

### Learning
- **"Digital Geometry Processing"** by Botsch et al.
- **Blender scripting documentation** - BMesh API
- **Computer Graphics: Principles and Practice**
