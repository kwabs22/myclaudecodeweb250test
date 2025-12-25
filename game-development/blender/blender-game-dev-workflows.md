# Blender Game Development Workflows

## Table of Contents
1. [Overview](#overview)
2. [Workflows INTO Blender](#workflows-into-blender)
3. [Workflows OUT OF Blender](#workflows-out-of-blender)
4. [Common Pipelines by Engine](#common-pipelines-by-engine)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

## Overview

Blender serves as a central hub in game development pipelines, capable of importing from numerous sources and exporting to virtually any game engine. Understanding these workflows is crucial for efficient asset creation and iteration.

### Why Blender for Game Development?
- **Free and open source** - No licensing costs
- **Universal format support** - Import/export dozens of formats
- **Python scripting** - Automate workflows with `bpy`
- **Non-destructive modifiers** - Maintain editability
- **PBR material workflow** - Modern rendering standards
- **Active community** - Extensive tutorials and addons

---

## Workflows INTO Blender

### 1. CAD and Engineering Software

#### From SolidWorks, AutoCAD, Fusion 360
**Recommended Path: STEP → Blender**

```python
# Import STEP files using CAD Sketcher addon
import bpy
from cad_sketcher import import_step

bpy.ops.cad_sketcher.import_step(filepath="/path/to/model.step")
```

**Workflow:**
1. Export from CAD software as `.step`, `.iges`, or `.stl`
2. Install CAD Sketcher addon or use built-in STL import
3. Import into Blender
4. Clean up mesh (often very high poly)
5. Retopologize for game use

**Common Issues:**
- STL files have no scale reference - verify units
- Very high polygon counts - use decimation modifier
- No material/texture data - must recreate

#### From Rhino
**Format: `.3dm` or `.fbx`**
- Export as FBX from Rhino
- Import FBX into Blender
- Preserve NURBS data by converting to mesh before export

### 2. Photogrammetry and 3D Scanning

#### From RealityCapture, Metashape, Meshroom
**Format: `.obj` with textures**

```python
# Import OBJ with textures
import bpy

bpy.ops.import_scene.obj(
    filepath="/path/to/scan.obj",
    use_image_search=True  # Auto-find textures
)
```

**Workflow:**
1. Photogrammetry software exports high-poly mesh + texture maps
2. Import OBJ into Blender
3. Decimate geometry (often 1M+ polygons → 10K for games)
4. Bake textures to optimized UV layout
5. Export game-ready asset

**Typical Reduction Pipeline:**
```
Original: 2,000,000 polygons
↓ Decimate Modifier (0.05 ratio)
100,000 polygons
↓ Retopology (manual or quadriflow)
5,000-20,000 polygons (game-ready)
```

### 3. Sculpting Applications

#### From ZBrush
**Recommended: GoZ bridge or `.fbx`**

**High-to-Low Poly Workflow:**
1. Export subdivisions from ZBrush as FBX
2. Import high-poly into Blender
3. Create low-poly version (retopology)
4. Bake normal maps from high to low

```python
# Example bake setup
high_poly = bpy.data.objects["Character_HighPoly"]
low_poly = bpy.data.objects["Character_LowPoly"]

# Set up bake
bpy.context.scene.render.bake.use_selected_to_active = True
bpy.context.scene.render.bake.cage_extrusion = 0.05
```

#### From Nomad Sculpt (iPad)
**Format: `.obj` or `.gltf`**
- Export from Nomad as OBJ
- Import into Blender
- Same workflow as ZBrush

### 4. Parametric and Procedural Tools

#### From Houdini
**Format: `.fbx`, `.abc` (Alembic), `.vdb`**

```python
# Import Alembic animation
bpy.ops.wm.alembic_import(filepath="/path/to/sim.abc")
```

**Common Uses:**
- Destruction simulations → Alembic
- Procedural geometry → FBX
- Volume effects → VDB

#### From Substance Designer
**Materials: `.sbsar` or texture maps**
- Export texture maps (Base Color, Normal, Roughness, etc.)
- Import into Blender's Shader Editor
- Set up PBR material node tree

### 5. Image and Texture Sources

#### From Photoshop/Krita/GIMP
**Formats: `.psd`, `.png`, `.tga`, `.exr`**

```python
# Load texture into material
import bpy

mat = bpy.data.materials.new(name="GameMaterial")
mat.use_nodes = True
nodes = mat.node_tree.nodes

# Add image texture
tex_node = nodes.new('ShaderNodeTexImage')
tex_node.image = bpy.data.images.load("/path/to/texture.png")
```

#### From Substance Painter
**Export presets for game engines:**
1. Use "Unreal Engine 4" or "Unity" export template
2. Exports organized PBR maps
3. Import into Blender maintaining naming convention

### 6. Motion Capture and Animation

#### From Rokoko, Vicon, OptiTrack
**Format: `.bvh`, `.fbx`**

```python
# Import BVH motion capture
bpy.ops.import_anim.bvh(
    filepath="/path/to/walk_cycle.bvh",
    target='ARMATURE'
)
```

**Workflow:**
1. Import BVH to Blender armature
2. Retarget to custom character rig
3. Clean up and refine animation
4. Export to game engine

### 7. Existing Game Assets

#### From Unity
**Extract using AssetStudio or Unity Asset Bundle Extractor**
- Extract FBX/meshes from Unity packages
- Import into Blender for modification
- Re-export for use

#### From Unreal Engine
**Use FBX export from Unreal**
- Right-click asset → Export
- Import FBX into Blender
- Preserve materials using naming conventions

---

## Workflows OUT OF Blender

### 1. Game Engines

#### To Unity
**Format: `.fbx` (recommended)**

```python
# Export FBX for Unity
import bpy

bpy.ops.export_scene.fbx(
    filepath="/path/to/export.fbx",
    use_selection=False,
    global_scale=1.0,
    apply_unit_scale=True,
    apply_scale_options='FBX_SCALE_ALL',
    bake_space_transform=False,
    object_types={'MESH', 'ARMATURE', 'EMPTY'},
    mesh_smooth_type='FACE',
    use_mesh_modifiers=True,
    use_armature_deform_only=True,
    add_leaf_bones=False  # Important for Unity!
)
```

**Unity-Specific Settings:**
- ✅ Apply Unit Scale
- ✅ Use Mesh Modifiers
- ❌ Add Leaf Bones (causes issues)
- Scale: 1.0 (Unity and Blender both use meters)

**Material Export:**
- Unity doesn't import Blender materials well
- Export textures separately
- Set up materials in Unity

#### To Unreal Engine
**Format: `.fbx`**

```python
# Export FBX for Unreal
bpy.ops.export_scene.fbx(
    filepath="/path/to/export.fbx",
    use_selection=False,
    global_scale=1.0,
    apply_scale_options='FBX_SCALE_NONE',  # Different from Unity!
    bake_space_transform=False,
    mesh_smooth_type='FACE',
    use_mesh_modifiers=True,
    use_armature_deform_only=True,
    primary_bone_axis='Y',
    secondary_bone_axis='X'
)
```

**Unreal-Specific Settings:**
- ✅ Primary Bone Axis: Y
- ✅ Secondary Bone Axis: X
- Use FBX 2020 format
- Preserve bone hierarchy

**Collision Meshes:**
- Name format: `UCX_[MeshName]_##`
- Export with main mesh
- Example: `UCX_Rock_01`

#### To Godot
**Format: `.gltf` (recommended) or `.dae`**

```python
# Export GLTF for Godot
bpy.ops.export_scene.gltf(
    filepath="/path/to/export.gltf",
    export_format='GLTF_SEPARATE',  # .gltf + .bin + textures
    export_materials='EXPORT',
    export_apply=True,
    export_yup=True
)
```

**Godot Best Practices:**
- GLTF preserves materials better than FBX
- Use `.gltf` (not `.glb`) for easier debugging
- Godot imports Blender materials reasonably well

#### To PlayCanvas
**Format: `.gltf` or `.fbx`**

```python
# Export GLTF for PlayCanvas
bpy.ops.export_scene.gltf(
    filepath="/path/to/export.glb",
    export_format='GLB',  # Single file
    export_materials='EXPORT',
    export_apply=True
)
```

**PlayCanvas Workflow:**
1. Export as GLB (single file)
2. Upload to PlayCanvas Editor
3. Materials may need adjustment
4. Set up collision shapes in Editor

#### To Three.js / Web
**Format: `.gltf` or `.glb`**

```python
# Export optimized GLB for web
bpy.ops.export_scene.gltf(
    filepath="/path/to/export.glb",
    export_format='GLB',
    export_draco_mesh_compression_enable=True,  # Compress!
    export_draco_mesh_compression_level=6,
    export_texture_dir='',
    export_image_format='JPEG',  # Smaller than PNG
    export_yup=True
)
```

**Web Optimization:**
- Use Draco compression (30-50% size reduction)
- JPEG textures for non-transparent materials
- Limit texture resolution (1K or 2K max)
- Bake lighting when possible

### 2. 3D Printing

#### To STL (Resin/FDM Printers)
```python
# Export STL
bpy.ops.export_mesh.stl(
    filepath="/path/to/print.stl",
    use_selection=False,
    global_scale=1.0,
    ascii=False  # Binary is smaller
)
```

**Pre-Export Checklist:**
- ✅ Manifold geometry (no holes)
- ✅ Correct scale (mm for most slicers)
- ✅ Wall thickness ≥ 2mm for strength
- ✅ Apply all modifiers

### 3. CAD Software

#### To SolidWorks, Fusion 360
**Format: `.step` (requires addon)**

Install: BlenderBIM addon or CAD Sketcher
- Converts mesh to NURBS when possible
- Limited compared to native CAD

**Alternative: `.stl` or `.obj`**
- Most CAD software can import
- Mesh, not parametric
- Use for reference or direct machining

### 4. Other DCC Applications

#### To Maya
**Format: `.fbx` or `.ma`**
- FBX is universal interchange format
- Install "Better FBX" addon for improved exports

#### To 3ds Max
**Format: `.fbx`**
- Very compatible with Blender
- Animation and rigging transfer well

#### To Cinema 4D
**Format: `.fbx` or `.obj`**
- Materials won't transfer
- Geometry and animation work well

### 5. Video Editing and VFX

#### To After Effects
**Format: `.obj` sequence or `.abc`**

```python
# Export OBJ sequence for AE
for frame in range(1, 101):
    bpy.context.scene.frame_set(frame)
    filepath = f"/path/to/sequence/frame_{frame:04d}.obj"
    bpy.ops.export_scene.obj(filepath=filepath, use_selection=True)
```

#### To Davinci Resolve / Premiere
**Render Image Sequence:**
- Render as `.png` or `.exr` sequence
- Import to video editor timeline

### 6. Rendering Engines

#### To Unreal Engine (Datasmith)
**Format: `.udatasmith`**
- Install Datasmith plugin for Blender
- Preserves materials, lights, cameras
- Best for archviz workflows

#### To Houdini
**Format: `.fbx` or `.abc`**
- Alembic for animated geometry/particles
- FBX for static meshes and rigs

---

## Common Pipelines by Engine

### Unity Pipeline

```
Concept Art
    ↓
Blender (Modeling)
    ↓ FBX export (no leaf bones)
Unity Import
    ↓
Setup Materials (Unity Shader Graph)
    ↓
Prefab Creation
    ↓
Scene Integration
```

**Key Settings:**
- FBX format
- Apply unit scale
- No leaf bones
- Export textures separately
- Set up materials in Unity

### Unreal Engine Pipeline

```
Concept/Blockout
    ↓
Blender (Modeling + UV)
    ↓
Substance Painter (Texturing)
    ↓
Blender (Final Assembly)
    ↓ FBX export
Unreal Import
    ↓
Material Setup (Unreal Materials)
    ↓
Level Design
```

**Key Settings:**
- FBX 2020
- Bone axis: Y, X
- Export collision meshes (UCX_)
- Nanite-ready geometry (high poly OK)

### Web-Based (PlayCanvas, Three.js) Pipeline

```
Blender (Modeling + Materials)
    ↓ GLB export with Draco
Optimize for Web
    ↓
Upload to Platform
    ↓
Real-time Testing
    ↓
Iterate
```

**Optimization Focus:**
- Low poly counts (< 50K tris/model)
- Compressed textures (JPEG, WebP)
- Draco mesh compression
- Baked lighting
- LOD (Level of Detail) models

### Mobile Game Pipeline

```
Blender (Low-poly modeling)
    ↓
Bake High-to-Low details
    ↓
Texture Atlas Creation
    ↓ FBX/GLTF export
Game Engine (Unity/Unreal)
    ↓
Mobile-Optimized Materials
    ↓
Platform Testing
```

**Mobile Constraints:**
- Very low poly (< 10K tris)
- Small textures (512-1024px)
- Baked lighting preferred
- Minimal real-time effects

---

## Best Practices

### General Workflow Rules

1. **Non-Destructive Modeling**
   - Use modifiers instead of applying operations
   - Keep original high-poly versions
   - Version control with Blend file versioning

2. **Naming Conventions**
   ```
   Props/Environment:
   - SM_ChairWooden_01 (Static Mesh)
   - SK_Character_Hero (Skeletal Mesh)

   Textures:
   - T_ChairWooden_BC (Base Color)
   - T_ChairWooden_N (Normal)
   - T_ChairWooden_ORM (Occlusion/Rough/Metal)

   Materials:
   - M_ChairWooden_01
   ```

3. **Scale and Units**
   - Set Blender units to Metric
   - 1 Blender unit = 1 meter (matches Unity/Unreal)
   - Character height: ~1.8 units (standard human)

4. **UV Mapping**
   - Always unwrap before export
   - Use texture density guidelines (pixels per unit)
   - Leave padding between UV islands (4-8 pixels)

5. **Optimization Hierarchy**
   ```
   1. Polygon count (biggest impact on performance)
   2. Draw calls (material count)
   3. Texture resolution
   4. Shader complexity
   ```

### Export Checklist

Before exporting any asset:

- [ ] Apply all modifiers (or export with "Apply Modifiers")
- [ ] Check object scale (Ctrl+A → Apply Scale)
- [ ] UV unwrapping complete
- [ ] Materials assigned
- [ ] Textures packed or external
- [ ] Correct orientation (forward = -Y for most engines)
- [ ] Remove unnecessary objects (cameras, lights, empties)
- [ ] Polygon count within target
- [ ] File naming follows convention

### Format Selection Guide

| Target | Format | Notes |
|--------|--------|-------|
| Unity | FBX | Industry standard |
| Unreal | FBX | Best compatibility |
| Godot | GLTF | Better material preservation |
| Web | GLB | Single file, compressed |
| Three.js | GLTF/GLB | Draco compression |
| PlayCanvas | GLB | Drag-and-drop upload |
| 3D Print | STL | Manifold geometry required |
| CAD | STEP | Requires addon |
| VFX | Alembic | Animation/simulation |
| Archive | Blend + FBX | Maximum compatibility |

---

## Troubleshooting

### Common Import Issues

#### "Model imports at wrong scale"
**Solution:**
```python
# Set scene scale before export
bpy.context.scene.unit_settings.scale_length = 1.0
bpy.context.scene.unit_settings.length_unit = 'METERS'
```

#### "Textures missing after import"
**Solution:**
- Embed textures in FBX export settings
- Or: Pack textures in Blender (File → External Data → Pack Resources)
- Or: Keep textures in same folder as model

#### "Normals look wrong in game engine"
**Solution:**
```python
# Before export, recalculate normals
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode='OBJECT')
```

### Common Export Issues

#### "Animation doesn't export"
**Check:**
- Armature is selected
- "Export Animations" enabled
- Action is assigned to object
- Bake animations if using constraints

#### "Materials are black in engine"
**Solution:**
- Export textures separately
- Rebuild materials in target engine
- For GLTF: ensure PBR shader setup

#### "Model has holes/missing faces"
**Solution:**
```python
# Check for non-manifold geometry
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')
bpy.ops.mesh.select_non_manifold()
# Fix selected geometry
```

#### "Too many polygons for game"
**Solution:**
```python
# Add decimate modifier
obj = bpy.context.active_object
mod = obj.modifiers.new(name="Decimate", type='DECIMATE')
mod.ratio = 0.5  # 50% reduction
mod.use_collapse_triangulate = True
```

### Performance Optimization

#### "Model causes FPS drops"
**Diagnosis:**
1. Check polygon count (< 20K for props, < 100K for characters)
2. Check material count (combine when possible)
3. Check texture size (2K max for most assets)

**Solutions:**
- Reduce polygons with decimation
- Combine materials and use texture atlases
- Create LOD (Level of Detail) versions

```python
# Generate LOD levels automatically
import bpy

obj = bpy.context.active_object

for lod_level in [0.75, 0.5, 0.25]:
    # Duplicate object
    lod_obj = obj.copy()
    lod_obj.data = obj.data.copy()
    bpy.context.collection.objects.link(lod_obj)
    lod_obj.name = f"{obj.name}_LOD{int((1-lod_level)*4)}"

    # Add decimate modifier
    mod = lod_obj.modifiers.new(name="Decimate", type='DECIMATE')
    mod.ratio = lod_level
```

---

## Automation Scripts

### Batch Export Multiple Objects

```python
import bpy
import os

output_dir = "/path/to/export/"
export_format = "fbx"  # or "gltf"

for obj in bpy.context.selected_objects:
    # Deselect all
    bpy.ops.object.select_all(action='DESELECT')

    # Select single object
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    # Export
    filepath = os.path.join(output_dir, f"{obj.name}.{export_format}")

    if export_format == "fbx":
        bpy.ops.export_scene.fbx(
            filepath=filepath,
            use_selection=True,
            global_scale=1.0
        )
    elif export_format == "gltf":
        bpy.ops.export_scene.gltf(
            filepath=filepath,
            use_selection=True,
            export_format='GLB'
        )
```

### Auto-Setup PBR Materials from Textures

```python
import bpy
import os

def setup_pbr_material(obj, texture_folder):
    """
    Assumes naming:
    - modelname_BaseColor.png
    - modelname_Normal.png
    - modelname_Roughness.png
    - modelname_Metallic.png
    """
    mat = bpy.data.materials.new(name=f"M_{obj.name}")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Clear default nodes
    nodes.clear()

    # Add nodes
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')

    # Find textures
    for file in os.listdir(texture_folder):
        if obj.name not in file:
            continue

        tex_node = nodes.new('ShaderNodeTexImage')
        tex_node.image = bpy.data.images.load(os.path.join(texture_folder, file))

        if "BaseColor" in file or "Albedo" in file:
            links.new(tex_node.outputs[0], bsdf.inputs['Base Color'])
        elif "Normal" in file:
            normal_map = nodes.new('ShaderNodeNormalMap')
            links.new(tex_node.outputs[0], normal_map.inputs['Color'])
            links.new(normal_map.outputs[0], bsdf.inputs['Normal'])
        elif "Roughness" in file:
            links.new(tex_node.outputs[0], bsdf.inputs['Roughness'])
        elif "Metallic" in file:
            links.new(tex_node.outputs[0], bsdf.inputs['Metallic'])

    links.new(bsdf.outputs[0], output.inputs[0])

    # Assign material
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)

# Use
for obj in bpy.context.selected_objects:
    setup_pbr_material(obj, "/path/to/textures/")
```

---

## Resources and Addons

### Essential Addons for Game Development

1. **GLTF/GLB Export** (built-in)
   - Industry standard for web and modern engines

2. **FBX Export** (built-in)
   - Essential for Unity/Unreal

3. **Auto-Rig Pro** (paid)
   - Quick character rigging
   - Compatible with game engines

4. **Texel Density Checker**
   - Ensure consistent texture quality
   - Free addon

5. **UVPackmaster** (paid)
   - Advanced UV packing
   - Better texture atlas utilization

6. **Substance 3D Plugin**
   - Import SBSAR materials
   - Parametric texturing

### Learning Resources

- **Blender Manual**: https://docs.blender.org/manual/en/latest/
- **Game Asset Creation**: BlenderGuru, Grant Abbitt (YouTube)
- **Technical Art**: Simon Fuchs, Royal Skies LLC
- **Pipeline Setup**: CGDive, Blender Bros

### Community and Support

- **Blender Artists Forum**: https://blenderartists.org/
- **r/blender**: Reddit community
- **Blender Discord**: Real-time help
- **Stack Exchange**: Technical Q&A

---

## Conclusion

Blender's versatility makes it an excellent choice for game development workflows. Whether importing scanned data, creating original assets, or exporting to specific engines, understanding these pipelines will streamline your development process.

Key takeaways:
- Use the right format for your target platform
- Optimize early and often
- Maintain non-destructive workflows
- Automate repetitive tasks with Python
- Test exports frequently in target engine

The workflows described here represent industry-standard approaches, but always adapt to your specific project needs and constraints.
