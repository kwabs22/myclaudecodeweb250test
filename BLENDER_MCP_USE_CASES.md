# Blender MCP Server - 20 Comprehensive Use Cases

## Overview

Blender MCP connects Blender to AI assistants through the Model Context Protocol, enabling natural language control of 3D modeling, animation, and scene creation. This integration allows for AI-assisted 3D content creation with two-way communication between Claude AI and Blender.

## Core Capabilities

- **Object Manipulation**: Create, modify, and delete 3D objects
- **Material Control**: Apply and modify materials and colors
- **Scene Inspection**: Detailed information about scenes and objects
- **Code Execution**: Run Python code within Blender
- **Viewport Capture**: Take screenshots for scene understanding
- **Asset Integration**: Sketchfab and Poly Haven integration
- **3D Model Generation**: Hyper3D Rodin integration

## System Requirements

- Blender 3.6 or newer
- Compatible with Claude, DeepSeek R1, Gemini 2.0, Qwen 32B, and other LLMs

---

## 20 Practical Use Cases

### 1. **Rapid Prototyping for Game Development**
**Scenario**: Create low-poly game assets quickly through natural language descriptions.

**Use Case**: A game developer describes: "Create a low-poly medieval castle with 4 towers, a main gate, and stone walls." The AI generates the basic structure, allowing the developer to iterate rapidly on game environments.

**Implementation Example**:
```
User: "Create a low-poly medieval castle with 4 corner towers,
      each 15 units tall, a main gate 5 units wide, and
      connecting walls 8 units high. Use a stone material."

AI Assistant executes:
1. Create main walls using cube primitives (subdivide and extrude)
2. Position 4 cylinder towers at corners (15 units height)
3. Add conical roofs to towers
4. Create gate archway with boolean modifier
5. Apply low-poly stone material with grey color
6. Position camera for overview shot
7. Take screenshot to show result

Python code executed in Blender:
import bpy

# Clear existing objects
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Create castle walls
bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 4))
wall = bpy.context.active_object
wall.scale = (10, 10, 4)
wall.name = "Castle_Wall"

# Create 4 towers
tower_positions = [(-10, -10, 7.5), (10, -10, 7.5),
                   (-10, 10, 7.5), (10, 10, 7.5)]
for i, pos in enumerate(tower_positions):
    bpy.ops.mesh.primitive_cylinder_add(radius=2, depth=15, location=pos)
    tower = bpy.context.active_object
    tower.name = f"Tower_{i+1}"
    # Add roof
    bpy.ops.mesh.primitive_cone_add(radius1=2.5, depth=3,
                                    location=(pos[0], pos[1], pos[2]+9))

# Create gate
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -10, 2.5))
gate = bpy.context.active_object
gate.scale = (2.5, 1, 5)
gate.name = "Gate"

# Apply material
mat = bpy.data.materials.new(name="Stone")
mat.diffuse_color = (0.5, 0.5, 0.5, 1.0)
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        obj.data.materials.append(mat)
```

**Benefits**:
- Accelerates asset creation pipeline
- Reduces time from concept to playable prototype
- Allows non-artists to create placeholder assets

---

### 2. **Architectural Visualization Pre-visualization**
**Scenario**: Generate architectural concepts from client descriptions.

**Use Case**: An architect inputs: "Create a modern two-story house with floor-to-ceiling windows, flat roof, and an open-plan ground floor." The AI generates the basic structure for client presentations.

**Implementation Example**:
```
User: "Create a modern two-story house, 12m wide by 10m deep.
      First floor 3m high, second floor 3m high. Add large
      floor-to-ceiling windows on the front facade. Flat roof."

AI Assistant executes:
1. Create ground floor box (12x10x3m)
2. Create second floor box (12x10x3m) positioned above
3. Add window cutouts using array and boolean modifiers
4. Create flat roof slab
5. Apply modern materials (concrete, glass)
6. Add basic lighting
7. Position camera for presentation view

Python code executed in Blender:
import bpy

# Create ground floor
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 1.5))
ground_floor = bpy.context.active_object
ground_floor.scale = (12, 10, 3)
ground_floor.name = "Ground_Floor"

# Create second floor
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 4.5))
second_floor = bpy.context.active_object
second_floor.scale = (12, 10, 3)
second_floor.name = "Second_Floor"

# Create window cutouts (simplified - would use boolean)
for floor_z in [1.5, 4.5]:
    for i in range(4):
        x_pos = -4 + i * 2.5
        bpy.ops.mesh.primitive_cube_add(
            size=1, location=(x_pos, -5.1, floor_z))
        window = bpy.context.active_object
        window.scale = (1, 0.2, 2.5)
        window.name = f"Window_Cutout_{i}"

# Create roof
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 6.2))
roof = bpy.context.active_object
roof.scale = (12.5, 10.5, 0.3)
roof.name = "Roof"

# Materials
concrete = bpy.data.materials.new(name="Concrete")
concrete.diffuse_color = (0.8, 0.8, 0.8, 1.0)

glass = bpy.data.materials.new(name="Glass")
glass.diffuse_color = (0.7, 0.9, 1.0, 0.3)

# Apply materials
for obj in [ground_floor, second_floor, roof]:
    obj.data.materials.append(concrete)

# Set camera
bpy.ops.object.camera_add(location=(20, -15, 8))
camera = bpy.context.active_object
camera.rotation_euler = (1.1, 0, 0.8)
bpy.context.scene.camera = camera
```

**Benefits**:
- Faster client concept visualization
- Easy iteration on design ideas
- Reduced initial modeling time

---

### 3. **Educational 3D Modeling Tutorial Assistant**
**Scenario**: Learning Blender through guided AI assistance.

**Use Case**: A student asks: "Show me how to create a realistic coffee mug with handle." The AI creates the object step-by-step while explaining the modeling techniques used.

**Implementation Example**:
```
User: "Show me how to create a coffee mug with handle step by step.
      Explain each technique as you go."

AI Assistant executes with explanations:
Step 1: "Creating the mug body using a cylinder primitive"
Step 2: "Scaling it to mug proportions (radius 1.5, height 3)"
Step 3: "Using Solidify modifier to give the mug thickness"
Step 4: "Creating the handle with a torus, scaling and positioning it"
Step 5: "Using Subdivision Surface for smooth appearance"
Step 6: "Applying a ceramic material with slight glossiness"

Python code executed in Blender:
import bpy

# Step 1-2: Create mug body
bpy.ops.mesh.primitive_cylinder_add(radius=1.5, depth=3, location=(0, 0, 1.5))
mug = bpy.context.active_object
mug.name = "Mug_Body"

# Step 3: Add thickness using Solidify modifier
solidify = mug.modifiers.new(name="Solidify", type='SOLIDIFY')
solidify.thickness = 0.1
solidify.offset = -1

# Step 4: Create handle
bpy.ops.mesh.primitive_torus_add(
    major_radius=0.8, minor_radius=0.15, location=(1.8, 0, 1.5))
handle = bpy.context.active_object
handle.name = "Mug_Handle"
handle.scale = (1, 0.5, 1.2)
handle.rotation_euler = (0, 1.57, 0)

# Step 5: Add Subdivision Surface for smoothness
for obj in [mug, handle]:
    subsurf = obj.modifiers.new(name="Subdivision", type='SUBSURF')
    subsurf.levels = 2
    obj.select_set(True)
bpy.ops.object.shade_smooth()

# Step 6: Create ceramic material
ceramic = bpy.data.materials.new(name="Ceramic")
ceramic.diffuse_color = (0.9, 0.85, 0.8, 1.0)
ceramic.specular_intensity = 0.3

for obj in [mug, handle]:
    obj.data.materials.append(ceramic)

# Take screenshot to show result
bpy.ops.render.render(write_still=True)
```

AI provides explanation:
"I've created a coffee mug using standard modeling techniques:
- Cylinder primitive for the basic mug shape
- Solidify modifier to create wall thickness (real objects aren't infinitely thin!)
- Torus primitive scaled and rotated for the handle
- Subdivision Surface to smooth the geometry
- Smooth shading for realistic appearance
- Ceramic material for the final look"

**Benefits**:
- Interactive learning experience
- Real-time feedback and guidance
- Learns by doing with AI mentor

---

### 4. **Product Design Iteration**
**Scenario**: Rapidly iterate on product designs for consumer goods.

**Use Case**: A designer describes: "Modify this bottle design to be 20% taller, add grip textures, and change material to frosted glass." The AI applies changes instantly.

**Implementation Example**:
```
User: "Select the bottle object, make it 20% taller,
      add grip texture bands around the middle,
      and change to frosted glass material."

AI Assistant executes:
1. Select object named "Bottle"
2. Scale Z-axis by 1.2 (20% taller)
3. Add displacement modifier with noise texture for grip
4. Create frosted glass material with transparency
5. Update render view

Python code executed in Blender:
import bpy

# Select the bottle
bottle = bpy.data.objects.get("Bottle")
if bottle:
    # Make 20% taller
    bottle.scale.z *= 1.2

    # Add grip texture using displacement
    # Create texture for grip
    grip_texture = bpy.data.textures.new("GripTexture", type='CLOUDS')
    grip_texture.noise_scale = 0.5

    # Add displacement modifier
    displace = bottle.modifiers.new(name="Grip", type='DISPLACE')
    displace.texture = grip_texture
    displace.strength = 0.05
    displace.mid_level = 0.5

    # Limit displacement to middle section
    vertex_group = bottle.vertex_groups.new(name="GripArea")
    # Would need to assign vertices in middle section

    # Create frosted glass material
    mat = bpy.data.materials.new(name="FrostedGlass")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()

    # Add shader nodes
    output = nodes.new(type='ShaderNodeOutputMaterial')
    glass_bsdf = nodes.new(type='ShaderNodeBsdfGlass')
    glass_bsdf.inputs['Roughness'].default_value = 0.3
    glass_bsdf.inputs['IOR'].default_value = 1.45

    # Link nodes
    mat.node_tree.links.new(
        glass_bsdf.outputs['BSDF'],
        output.inputs['Surface'])

    # Apply material
    if bottle.data.materials:
        bottle.data.materials[0] = mat
    else:
        bottle.data.materials.append(mat)

    print("Bottle modified: 20% taller, grip texture added, frosted glass applied")
```

**Benefits**:
- Quick design iterations
- Natural language design modifications
- Faster client approval cycles

---

### 5. **Animation Scene Setup**
**Scenario**: Automate complex scene setups for animation projects.

**Use Case**: An animator requests: "Create a classroom scene with 20 desks in rows, a teacher's desk, whiteboard on the wall, and proper lighting." The AI assembles the complete scene.

**Implementation Example**:
```
User: "Create a classroom: 20 student desks in 4 rows of 5,
      teacher's desk at front, whiteboard on wall,
      add ceiling lights for proper illumination."

AI Assistant executes:
1. Create floor and walls
2. Array 20 desk models in 4x5 grid
3. Position teacher's desk at front
4. Create whiteboard on front wall
5. Add 6 ceiling lights with proper settings
6. Set camera angle for scene view

Python code executed in Blender:
import bpy

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Create floor
bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, 0))
floor = bpy.context.active_object
floor.scale = (2, 1.5, 1)
floor.name = "Floor"

# Create walls
wall_data = [
    ("BackWall", (0, -15, 2.5), (20, 0.2, 5)),
    ("FrontWall", (0, 15, 2.5), (20, 0.2, 5)),
    ("LeftWall", (-20, 0, 2.5), (0.2, 15, 5)),
    ("RightWall", (20, 0, 2.5), (0.2, 15, 5))
]

for name, loc, scale in wall_data:
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    wall = bpy.context.active_object
    wall.scale = scale
    wall.name = name

# Create student desk function
def create_desk(location, name):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    desk = bpy.context.active_object
    desk.scale = (0.8, 0.6, 0.4)
    desk.name = name
    return desk

# Create 20 student desks in 4 rows of 5
desk_count = 0
for row in range(4):
    for col in range(5):
        x = -12 + col * 6
        y = -10 + row * 5
        z = 0.4
        create_desk((x, y, z), f"StudentDesk_{desk_count}")
        desk_count += 1

# Create teacher's desk
create_desk((0, 12, 0.5), "TeacherDesk")
bpy.context.active_object.scale = (2, 1, 0.5)

# Create whiteboard
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 14.8, 2.5))
whiteboard = bpy.context.active_object
whiteboard.scale = (4, 0.1, 2)
whiteboard.name = "Whiteboard"

# Create lights
for i in range(6):
    x = -15 + i * 6
    y = 0
    z = 4.5
    bpy.ops.object.light_add(type='AREA', location=(x, y, z))
    light = bpy.context.active_object
    light.data.energy = 100
    light.data.size = 3
    light.name = f"CeilingLight_{i}"

# Set camera
bpy.ops.object.camera_add(location=(-25, -20, 8))
camera = bpy.context.active_object
camera.rotation_euler = (1.2, 0, -0.6)
bpy.context.scene.camera = camera

print("Classroom scene created with 20 desks, teacher desk, whiteboard, and lighting")
```

**Benefits**:
- Eliminates tedious manual placement
- Consistent scene organization
- Focus on creative animation work

---

### 6. **3D Asset Library Management**
**Scenario**: Download and organize assets from online repositories.

**Use Case**: A creator says: "Search Sketchfab for a photorealistic tree, download the top-rated oak tree model, and place it in my scene." The AI handles search, download, and import.

**Implementation Example**:
```
User: "Search Sketchfab for 'oak tree photorealistic',
      download the top result, and place it at position (5, 5, 0)."

AI Assistant executes:
1. Call Sketchfab API to search for "oak tree photorealistic"
2. Get top-rated model from results
3. Download model file
4. Import into Blender scene
5. Position at specified coordinates
6. Scale appropriately

Python code executed in Blender:
import bpy
import requests
import os

# Sketchfab API search (simplified)
def search_sketchfab(query):
    # API endpoint
    url = "https://api.sketchfab.com/v3/search"
    params = {
        'q': query,
        'type': 'models',
        'sort_by': '-likeCount'
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        results = response.json()
        if results['results']:
            return results['results'][0]  # Top result
    return None

# Download and import model
def download_and_import_model(model_data, position):
    # This is simplified - actual implementation would:
    # 1. Authenticate with Sketchfab
    # 2. Download the model file
    # 3. Handle different file formats

    model_uid = model_data['uid']
    model_name = model_data['name']

    # Download model (would need authentication)
    # download_url = f"https://api.sketchfab.com/v3/models/{model_uid}/download"

    # For demo, assume model downloaded to temp folder
    model_path = f"/tmp/{model_uid}.gltf"

    # Import the model
    if os.path.exists(model_path):
        bpy.ops.import_scene.gltf(filepath=model_path)

        # Get imported object
        imported_obj = bpy.context.selected_objects[0]
        imported_obj.location = position
        imported_obj.name = f"Sketchfab_{model_name}"

        print(f"Imported '{model_name}' from Sketchfab at position {position}")
        return imported_obj

    return None

# Execute search and import
search_query = "oak tree photorealistic"
model = search_sketchfab(search_query)

if model:
    print(f"Found: {model['name']} by {model['user']['username']}")
    print(f"Likes: {model['likeCount']}")

    # Import at specified position
    tree = download_and_import_model(model, (5, 5, 0))

    if tree:
        # Scale to appropriate size
        tree.scale = (2, 2, 2)
        print("Oak tree imported and positioned successfully")
else:
    print("No models found matching search criteria")
```

**Benefits**:
- Seamless asset acquisition
- No manual downloading and importing
- Integrated workflow

---

### 7. **Material and Texture Experimentation**
**Scenario**: Quickly test different material combinations.

**Use Case**: A 3D artist requests: "Apply a brushed metal material to this robot, make it copper-colored, and add slight weathering." The AI applies and adjusts materials.

**Implementation Example**:
```
User: "Apply brushed copper metal material to the robot model.
      Add anisotropic reflection and slight surface weathering."

AI Assistant executes:
import bpy

# Get the robot object
robot = bpy.data.objects.get("Robot")
if robot:
    # Create copper metal material
    mat = bpy.data.materials.new(name="BrushedCopper")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    # Output node
    output = nodes.new(type='ShaderNodeOutputMaterial')
    output.location = (400, 0)

    # Principled BSDF for metal
    bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    bsdf.location = (0, 0)
    bsdf.inputs['Base Color'].default_value = (0.72, 0.45, 0.20, 1.0)  # Copper color
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = 0.3
    bsdf.inputs['Anisotropic'].default_value = 0.7  # Brushed effect

    # Noise texture for weathering
    noise = nodes.new(type='ShaderNodeTexNoise')
    noise.location = (-400, -200)
    noise.inputs['Scale'].default_value = 50.0

    # ColorRamp to control weathering
    ramp = nodes.new(type='ShaderNodeValToRGB')
    ramp.location = (-200, -200)
    ramp.color_ramp.elements[0].position = 0.45
    ramp.color_ramp.elements[1].position = 0.55

    # Mix for weathering effect
    mix = nodes.new(type='ShaderNodeMix')
    mix.location = (-200, 0)
    mix.data_type = 'RGBA'
    mix.inputs[6].default_value = (0.3, 0.2, 0.1, 1.0)  # Weathered color

    # Connect nodes
    links.new(noise.outputs['Fac'], ramp.inputs['Fac'])
    links.new(ramp.outputs['Color'], mix.inputs['Factor'])
    links.new(mix.outputs[2], bsdf.inputs['Base Color'])
    links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

    # Apply material
    if robot.data.materials:
        robot.data.materials[0] = mat
    else:
        robot.data.materials.append(mat)

    print("Brushed copper material with weathering applied to robot")
```

**Benefits**:
- Rapid material prototyping
- Natural language material descriptions
- Faster look development

---

### 8. **Batch Object Creation**
**Scenario**: Create multiple variations of objects efficiently.

**Use Case**: A designer needs: "Create 10 different chair designs, each with unique armrest styles but maintaining the same seat dimensions." The AI generates variations.

**Implementation Example**:
```
User: "Create 10 chair variations with the same seat (50x50x5cm)
      but different armrest designs. Arrange them in a row."

AI Assistant executes:
import bpy
import random

def create_chair_variant(index, x_position):
    """Create a chair with variant armrest design"""
    # Base seat (same for all)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x_position, 0, 0.25))
    seat = bpy.context.active_object
    seat.scale = (0.5, 0.5, 0.05)
    seat.name = f"Chair_{index}_Seat"

    # Backrest
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x_position, -0.2, 0.6))
    backrest = bpy.context.active_object
    backrest.scale = (0.4, 0.05, 0.4)
    backrest.name = f"Chair_{index}_Back"

    # Variant armrest designs
    armrest_types = [
        # Type 0: Simple cube armrests
        lambda: (0.05, 0.3, 0.05),
        # Type 1: Thin vertical armrests
        lambda: (0.03, 0.35, 0.03),
        # Type 2: Wide flat armrests
        lambda: (0.08, 0.25, 0.04),
        # Type 3: Tall armrests
        lambda: (0.04, 0.3, 0.08),
        # Type 4: Curved (approximated with rotation)
        lambda: (0.04, 0.3, 0.06),
    ]

    armrest_scale = armrest_types[index % len(armrest_types)]()

    # Left armrest
    bpy.ops.mesh.primitive_cube_add(
        size=1, location=(x_position - 0.25, 0, 0.4))
    left_arm = bpy.context.active_object
    left_arm.scale = armrest_scale
    left_arm.name = f"Chair_{index}_LeftArm"

    # Right armrest
    bpy.ops.mesh.primitive_cube_add(
        size=1, location=(x_position + 0.25, 0, 0.4))
    right_arm = bpy.context.active_object
    right_arm.scale = armrest_scale
    right_arm.name = f"Chair_{index}_RightArm"

    # Apply random color to differentiate
    mat = bpy.data.materials.new(name=f"ChairMat_{index}")
    mat.diffuse_color = (
        random.random() * 0.5 + 0.5,
        random.random() * 0.5 + 0.5,
        random.random() * 0.5 + 0.5,
        1.0
    )

    for obj in [seat, backrest, left_arm, right_arm]:
        obj.data.materials.append(mat)

# Create 10 chair variations in a row
for i in range(10):
    x_pos = i * 2 - 9  # Spread them out
    create_chair_variant(i, x_pos)

print("Created 10 chair variations with different armrest designs")
```

**Benefits**:
- Automated variation generation
- Consistent base parameters
- Exploration of design space

---

### 9. **Scene Analysis and Reporting**
**Scenario**: Get detailed information about complex scenes.

**Use Case**: An artist asks: "Tell me how many objects are in this scene, what materials are used, and which objects have the most polygons." The AI analyzes and reports.

**Implementation Example**:
```
User: "Analyze the current scene and report: total objects,
      material count, polygon counts, and identify the
      3 most complex objects."

AI Assistant executes:
import bpy

# Gather scene statistics
total_objects = len(bpy.data.objects)
mesh_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']
total_meshes = len(mesh_objects)

# Material analysis
materials = bpy.data.materials
material_names = [mat.name for mat in materials]
total_materials = len(materials)

# Polygon count analysis
object_poly_counts = []
for obj in mesh_objects:
    if obj.data:
        poly_count = len(obj.data.polygons)
        object_poly_counts.append((obj.name, poly_count))

# Sort by polygon count
object_poly_counts.sort(key=lambda x: x[1], reverse=True)
total_polygons = sum(count for _, count in object_poly_counts)

# Generate report
report = f"""
SCENE ANALYSIS REPORT
====================

Object Statistics:
- Total Objects: {total_objects}
- Mesh Objects: {total_meshes}
- Lights: {len([o for o in bpy.data.objects if o.type == 'LIGHT'])}
- Cameras: {len([o for o in bpy.data.objects if o.type == 'CAMERA'])}

Material Statistics:
- Total Materials: {total_materials}
- Material Names: {', '.join(material_names[:10])}
  {"..." if total_materials > 10 else ""}

Polygon Statistics:
- Total Polygons: {total_polygons:,}
- Average Polygons per Mesh: {total_polygons // max(total_meshes, 1):,}

Top 3 Most Complex Objects (by polygon count):
"""

for i, (name, count) in enumerate(object_poly_counts[:3], 1):
    report += f"  {i}. {name}: {count:,} polygons\n"

# Objects using same material
material_usage = {}
for obj in mesh_objects:
    for mat_slot in obj.material_slots:
        if mat_slot.material:
            mat_name = mat_slot.material.name
            if mat_name not in material_usage:
                material_usage[mat_name] = []
            material_usage[mat_name].append(obj.name)

report += "\nMaterial Usage:\n"
for mat_name, obj_names in list(material_usage.items())[:5]:
    report += f"  '{mat_name}' used by {len(obj_names)} objects\n"

print(report)

# Also save report to text file
text_block = bpy.data.texts.new("Scene_Analysis_Report")
text_block.write(report)
```

Output example:
```
SCENE ANALYSIS REPORT
====================
Object Statistics:
- Total Objects: 45
- Mesh Objects: 38
- Lights: 5
- Cameras: 2

Material Statistics:
- Total Materials: 12
- Material Names: Stone, Wood, Glass, Metal, Fabric...

Polygon Statistics:
- Total Polygons: 156,432
- Average Polygons per Mesh: 4,116

Top 3 Most Complex Objects (by polygon count):
  1. DetailedTree: 45,230 polygons
  2. Building_Main: 32,108 polygons
  3. CharacterModel: 18,956 polygons

Material Usage:
  'Stone' used by 15 objects
  'Wood' used by 8 objects
  'Glass' used by 6 objects
```

**Benefits**:
- Scene optimization insights
- Quick asset inventory
- Performance troubleshooting

---

### 10. **Procedural Environment Generation**
**Scenario**: Generate natural environments using code.

**Use Case**: A developer requests: "Write Python code to generate a forest with 100 randomly placed trees of varying heights and types." The AI creates and executes the code.

**Implementation Example**:
```
User: "Generate a procedural forest with 100 trees in a 50x50 area.
      Vary the tree heights, types (pine vs oak), and add randomization."

AI Assistant executes:
import bpy
import random
import math

def create_pine_tree(location, height):
    """Create a simple pine tree"""
    # Trunk
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.3, depth=height, location=location)
    trunk = bpy.context.active_object
    trunk.location.z += height / 2
    trunk.name = f"Pine_Trunk_{location}"

    # Conical foliage
    foliage_height = height * 0.7
    bpy.ops.mesh.primitive_cone_add(
        radius1=height * 0.4,
        depth=foliage_height,
        location=(location[0], location[1], height + foliage_height/2))
    foliage = bpy.context.active_object
    foliage.name = f"Pine_Foliage_{location}"

    return [trunk, foliage]

def create_oak_tree(location, height):
    """Create a simple oak tree"""
    # Trunk
    bpy.ops.mesh.primitive_cylinder_add(
        radius=0.5, depth=height * 0.6, location=location)
    trunk = bpy.context.active_object
    trunk.location.z += height * 0.3
    trunk.name = f"Oak_Trunk_{location}"

    # Round foliage (UV sphere)
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=height * 0.5,
        location=(location[0], location[1], height * 0.8))
    foliage = bpy.context.active_object
    foliage.name = f"Oak_Foliage_{location}"

    return [trunk, foliage]

# Materials
bark_mat = bpy.data.materials.new(name="Bark")
bark_mat.diffuse_color = (0.4, 0.25, 0.15, 1.0)

pine_foliage_mat = bpy.data.materials.new(name="PineFoliage")
pine_foliage_mat.diffuse_color = (0.1, 0.3, 0.1, 1.0)

oak_foliage_mat = bpy.data.materials.new(name="OakFoliage")
oak_foliage_mat.diffuse_color = (0.2, 0.5, 0.2, 1.0)

# Generate forest
forest_size = 50
tree_count = 100
min_distance = 3.0  # Minimum distance between trees

tree_positions = []

for i in range(tree_count):
    # Find valid position (not too close to other trees)
    max_attempts = 50
    for attempt in range(max_attempts):
        x = random.uniform(-forest_size/2, forest_size/2)
        y = random.uniform(-forest_size/2, forest_size/2)

        # Check distance to other trees
        valid = True
        for px, py in tree_positions:
            dist = math.sqrt((x - px)**2 + (y - py)**2)
            if dist < min_distance:
                valid = False
                break

        if valid:
            tree_positions.append((x, y))
            break

    if len(tree_positions) <= i:
        continue  # Couldn't find valid position

    x, y = tree_positions[-1]
    location = (x, y, 0)

    # Random height between 5 and 12 units
    height = random.uniform(5, 12)

    # Random tree type
    tree_type = random.choice(['pine', 'oak'])

    if tree_type == 'pine':
        parts = create_pine_tree(location, height)
        parts[0].data.materials.append(bark_mat)
        parts[1].data.materials.append(pine_foliage_mat)
    else:
        parts = create_oak_tree(location, height)
        parts[0].data.materials.append(bark_mat)
        parts[1].data.materials.append(oak_foliage_mat)

# Add ground plane
bpy.ops.mesh.primitive_plane_add(size=forest_size * 1.5, location=(0, 0, 0))
ground = bpy.context.active_object
ground.name = "Forest_Ground"
ground_mat = bpy.data.materials.new(name="Ground")
ground_mat.diffuse_color = (0.3, 0.4, 0.2, 1.0)
ground.data.materials.append(ground_mat)

print(f"Generated procedural forest with {len(tree_positions)} trees")
```

**Benefits**:
- Procedural content generation
- Customizable randomization
- Scalable environment creation

---

### 11. **Screenshot Documentation**
**Scenario**: Document modeling progress automatically.

**Use Case**: An artist says: "Take a screenshot of the current viewport from the front, side, and top views for my portfolio." The AI captures multiple angles.

**Implementation Example**:
```
User: "Capture screenshots from front, right side, and top orthographic views.
      Save them as 'model_front.png', 'model_side.png', 'model_top.png'."

AI Assistant executes:
import bpy
import os

# Set output directory
output_dir = "/tmp/blender_screenshots/"
os.makedirs(output_dir, exist_ok=True)

# Get the active object (or specific object)
active_obj = bpy.context.active_object

# Store original view settings
scene = bpy.context.scene
original_camera = scene.camera

# Function to setup orthographic view and render
def capture_view(view_name, rotation, output_path):
    # Create temporary camera
    bpy.ops.object.camera_add()
    cam = bpy.context.active_object
    cam.data.type = 'ORTHO'
    cam.data.ortho_scale = 10.0

    # Position camera based on view
    if view_name == 'front':
        cam.location = (0, -15, 0)
        cam.rotation_euler = (1.5708, 0, 0)  # 90° X-axis
    elif view_name == 'side':
        cam.location = (15, 0, 0)
        cam.rotation_euler = (1.5708, 0, 1.5708)  # 90° X, 90° Z
    elif view_name == 'top':
        cam.location = (0, 0, 15)
        cam.rotation_euler = (0, 0, 0)

    # Set as active camera
    scene.camera = cam

    # Configure render settings
    scene.render.image_settings.file_format = 'PNG'
    scene.render.filepath = output_path
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080

    # Render
    bpy.ops.render.render(write_still=True)

    # Delete temporary camera
    bpy.data.objects.remove(cam, do_unlink=True)

    print(f"Captured {view_name} view: {output_path}")

# Capture all three views
views = [
    ('front', None, output_dir + 'model_front.png'),
    ('side', None, output_dir + 'model_side.png'),
    ('top', None, output_dir + 'model_top.png')
]

for view_name, rotation, output_path in views:
    capture_view(view_name, rotation, output_path)

# Restore original camera
scene.camera = original_camera

print("All screenshots captured successfully!")
print(f"Location: {output_dir}")
```

**Benefits**:
- Automated documentation
- Consistent screenshot composition
- Portfolio preparation

---

### 12. **Physics Simulation Setup**
**Scenario**: Configure complex physics simulations through natural language.

**Use Case**: A VFX artist requests: "Set up a rigid body simulation where these 50 cubes fall onto this plane with realistic bouncing." The AI configures the simulation.

**Implementation Example**:
```
User: "Create 50 cubes suspended in air above a ground plane.
      Set up rigid body physics so they fall and bounce realistically."

AI Assistant executes:
import bpy
import random

# Create ground plane
bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, 0))
ground = bpy.context.active_object
ground.name = "Ground"

# Add rigid body - passive (doesn't move)
bpy.ops.rigidbody.object_add()
ground.rigid_body.type = 'PASSIVE'
ground.rigid_body.friction = 0.5
ground.rigid_body.restitution = 0.3  # Bounce factor

# Create 50 cubes
for i in range(50):
    # Random position above ground
    x = random.uniform(-8, 8)
    y = random.uniform(-8, 8)
    z = random.uniform(5, 15)

    # Create cube
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z))
    cube = bpy.context.active_object
    cube.name = f"Cube_{i}"

    # Random scale
    scale = random.uniform(0.5, 1.5)
    cube.scale = (scale, scale, scale)

    # Add rigid body - active (affected by physics)
    bpy.ops.rigidbody.object_add()
    cube.rigid_body.type = 'ACTIVE'
    cube.rigid_body.mass = scale ** 3  # Mass based on volume
    cube.rigid_body.friction = 0.5
    cube.rigid_body.restitution = 0.4  # Bounce
    cube.rigid_body.linear_damping = 0.04
    cube.rigid_body.angular_damping = 0.1

    # Random initial rotation
    cube.rotation_euler = (
        random.uniform(0, 3.14),
        random.uniform(0, 3.14),
        random.uniform(0, 3.14)
    )

# Set simulation frame range
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = 250
bpy.context.scene.rigidbody_world.point_cache.frame_end = 250

# Set gravity
bpy.context.scene.rigidbody_world.effector_weights.gravity = 1.0

print("Rigid body simulation setup complete!")
print("Press spacebar to play animation and see cubes fall")
```

**Benefits**:
- Simplified physics setup
- Reduced technical barrier
- Focus on creative results

---

### 13. **Asset Quality Control**
**Scenario**: Identify and fix common modeling issues.

**Use Case**: A modeler asks: "Check all objects in this scene for non-manifold geometry, overlapping faces, and report any issues." The AI inspects and reports problems.

**Implementation Example**:
```
User: "Run quality control check on all mesh objects.
      Report non-manifold geometry, loose vertices,
      and polygon count issues."

AI Assistant executes:
import bpy
import bmesh

def check_mesh_quality(obj):
    """Check mesh for common issues"""
    issues = []

    # Create BMesh from object
    bm = bmesh.new()
    bm.from_mesh(obj.data)

    # Check for non-manifold geometry
    non_manifold_verts = [v for v in bm.verts if not v.is_manifold]
    if non_manifold_verts:
        issues.append(f"Non-manifold vertices: {len(non_manifold_verts)}")

    # Check for loose vertices
    loose_verts = [v for v in bm.verts if not v.link_edges]
    if loose_verts:
        issues.append(f"Loose vertices: {len(loose_verts)}")

    # Check for loose edges
    loose_edges = [e for e in bm.edges if not e.link_faces]
    if loose_edges:
        issues.append(f"Loose edges: {len(loose_edges)}")

    # Check for zero-area faces
    zero_area_faces = [f for f in bm.faces if f.calc_area() < 0.0001]
    if zero_area_faces:
        issues.append(f"Zero-area faces: {len(zero_area_faces)}")

    # Check polygon count
    poly_count = len(bm.faces)
    if poly_count > 100000:
        issues.append(f"High polygon count: {poly_count:,} (consider optimization)")

    # Check for duplicate vertices
    bm.verts.ensure_lookup_table()
    # Note: Full duplicate check would be more complex

    bm.free()
    return issues, poly_count

# Run quality control on all mesh objects
mesh_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']

print("MESH QUALITY CONTROL REPORT")
print("=" * 60)
print(f"Checking {len(mesh_objects)} mesh objects...\n")

total_issues = 0
objects_with_issues = []

for obj in mesh_objects:
    issues, poly_count = check_mesh_quality(obj)

    if issues:
        total_issues += len(issues)
        objects_with_issues.append(obj.name)
        print(f"❌ {obj.name} (Polygons: {poly_count:,})")
        for issue in issues:
            print(f"   - {issue}")
        print()
    else:
        print(f"✓ {obj.name} (Polygons: {poly_count:,}) - OK")

print("=" * 60)
print(f"\nSummary:")
print(f"- Total objects checked: {len(mesh_objects)}")
print(f"- Objects with issues: {len(objects_with_issues)}")
print(f"- Total issues found: {total_issues}")

if objects_with_issues:
    print(f"\nObjects requiring attention:")
    for name in objects_with_issues:
        print(f"  - {name}")
else:
    print("\n✓ All objects passed quality control!")
```

**Benefits**:
- Automated quality assurance
- Prevents export problems
- Professional asset standards

---

### 14. **Lighting Setup Automation**
**Scenario**: Create professional lighting setups quickly.

**Use Case**: A product photographer requests: "Set up three-point lighting for this product render with warm key light and cool fill light." The AI positions and configures lights.

**Implementation Example**:
```
User: "Set up three-point lighting for the selected object.
      Key light: warm (3000K), Fill light: cool (6500K),
      Rim light: neutral. Position for product photography."

AI Assistant executes:
import bpy
import math

# Get the active/selected object
target_obj = bpy.context.active_object
if not target_obj:
    print("No object selected!")
else:
    target_loc = target_obj.location

    # Clear existing lights (optional)
    # for obj in bpy.data.objects:
    #     if obj.type == 'LIGHT':
    #         bpy.data.objects.remove(obj)

    # 1. KEY LIGHT (Main light, warm, 45° angle, higher intensity)
    bpy.ops.object.light_add(type='AREA', location=(5, -5, 6))
    key_light = bpy.context.active_object
    key_light.name = "Key_Light"
    key_light.data.energy = 500
    key_light.data.size = 3
    key_light.data.color = (1.0, 0.9, 0.7)  # Warm color temp (~3000K)

    # Point at target
    direction = target_loc - key_light.location
    rot_quat = direction.to_track_quat('-Z', 'Y')
    key_light.rotation_euler = rot_quat.to_euler()

    # 2. FILL LIGHT (Softer, cooler, opposite side, lower intensity)
    bpy.ops.object.light_add(type='AREA', location=(-4, -3, 4))
    fill_light = bpy.context.active_object
    fill_light.name = "Fill_Light"
    fill_light.data.energy = 200  # About 40% of key
    fill_light.data.size = 4  # Larger = softer
    fill_light.data.color = (0.7, 0.8, 1.0)  # Cool color temp (~6500K)

    # Point at target
    direction = target_loc - fill_light.location
    rot_quat = direction.to_track_quat('-Z', 'Y')
    fill_light.rotation_euler = rot_quat.to_euler()

    # 3. RIM/BACK LIGHT (Separation from background)
    bpy.ops.object.light_add(type='SPOT', location=(0, 5, 5))
    rim_light = bpy.context.active_object
    rim_light.name = "Rim_Light"
    rim_light.data.energy = 300
    rim_light.data.spot_size = math.radians(50)
    rim_light.data.spot_blend = 0.3
    rim_light.data.color = (1.0, 1.0, 1.0)  # Neutral

    # Point at target
    direction = target_loc - rim_light.location
    rot_quat = direction.to_track_quat('-Z', 'Y')
    rim_light.rotation_euler = rot_quat.to_euler()

    # Optional: Add ambient/environment light
    bpy.context.scene.world.use_nodes = True
    world_nodes = bpy.context.scene.world.node_tree.nodes
    bg_node = world_nodes.get('Background')
    if bg_node:
        bg_node.inputs['Strength'].default_value = 0.3

    print("Three-point lighting setup complete!")
    print(f"Lighting target: {target_obj.name}")
    print("- Key Light: Warm (3000K), 500W")
    print("- Fill Light: Cool (6500K), 200W")
    print("- Rim Light: Neutral, 300W")
```

**Benefits**:
- Professional lighting templates
- Consistent lighting setups
- Time-saving automation

---

### 15. **Character Modeling Assistance**
**Scenario**: Generate base character meshes for further refinement.

**Use Case**: A character artist says: "Create a humanoid base mesh with correct proportions, 8 heads tall, in T-pose." The AI generates the starting point.

**Implementation Example**:
```
User: "Create a humanoid base mesh with anatomically correct proportions.
      8 heads tall, T-pose, simple geometry for further sculpting."

AI Assistant executes:
import bpy

# Head height unit (used for proportions)
head_height = 1.0

# Total height = 8 heads
total_height = 8 * head_height

def create_body_part(name, location, scale):
    """Helper to create body parts"""
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    part = bpy.context.active_object
    part.scale = scale
    part.name = name
    # Add subdivision for smoothness
    subsurf = part.modifiers.new(name="Subsurf", type='SUBSURF')
    subsurf.levels = 1
    return part

# HEAD (1 head tall)
head = create_body_part("Head", (0, 0, 7 * head_height), (0.6, 0.6, 0.8))

# NECK (0.5 head)
neck = create_body_part("Neck", (0, 0, 6.5 * head_height), (0.3, 0.3, 0.5))

# TORSO - Upper (1.5 heads)
upper_torso = create_body_part("Upper_Torso",
    (0, 0, 5.25 * head_height), (1.2, 0.6, 1.5))

# TORSO - Lower (1 head)
lower_torso = create_body_part("Lower_Torso",
    (0, 0, 4 * head_height), (1.0, 0.5, 1.0))

# HIPS (0.5 head)
hips = create_body_part("Hips",
    (0, 0, 3.5 * head_height), (1.2, 0.6, 0.5))

# ARMS - Upper (1.5 heads each)
left_upper_arm = create_body_part("Left_Upper_Arm",
    (-1.5, 0, 5.5 * head_height), (0.25, 0.25, 1.5))
left_upper_arm.rotation_euler = (0, 0, 1.57)  # Rotate for T-pose

right_upper_arm = create_body_part("Right_Upper_Arm",
    (1.5, 0, 5.5 * head_height), (0.25, 0.25, 1.5))
right_upper_arm.rotation_euler = (0, 0, -1.57)

# ARMS - Lower/Forearms (1.25 heads each)
left_forearm = create_body_part("Left_Forearm",
    (-2.75, 0, 5.5 * head_height), (0.2, 0.2, 1.25))
left_forearm.rotation_euler = (0, 0, 1.57)

right_forearm = create_body_part("Right_Forearm",
    (2.75, 0, 5.5 * head_height), (0.2, 0.2, 1.25))
right_forearm.rotation_euler = (0, 0, -1.57)

# HANDS (0.75 head each)
left_hand = create_body_part("Left_Hand",
    (-3.75, 0, 5.5 * head_height), (0.15, 0.3, 0.75))
left_hand.rotation_euler = (0, 0, 1.57)

right_hand = create_body_part("Right_Hand",
    (3.75, 0, 5.5 * head_height), (0.15, 0.3, 0.75))
right_hand.rotation_euler = (0, 0, -1.57)

# LEGS - Upper/Thighs (2 heads each)
left_thigh = create_body_part("Left_Thigh",
    (-0.4, 0, 2.25 * head_height), (0.35, 0.35, 2.0))

right_thigh = create_body_part("Right_Thigh",
    (0.4, 0, 2.25 * head_height), (0.35, 0.35, 2.0))

# LEGS - Lower/Shins (2 heads each)
left_shin = create_body_part("Left_Shin",
    (-0.4, 0, 0.75 * head_height), (0.25, 0.25, 1.5))

right_shin = create_body_part("Right_Shin",
    (0.4, 0, 0.75 * head_height), (0.25, 0.25, 1.5))

# FEET (0.25 head each)
left_foot = create_body_part("Left_Foot",
    (-0.4, 0.3, 0.15 * head_height), (0.2, 0.5, 0.15))

right_foot = create_body_part("Right_Foot",
    (0.4, 0.3, 0.15 * head_height), (0.2, 0.5, 0.15))

# Apply smooth shading to all parts
for obj in bpy.context.scene.objects:
    if obj.type == 'MESH' and any(part in obj.name for part in
        ['Head', 'Neck', 'Torso', 'Hips', 'Arm', 'Hand', 'Thigh', 'Shin', 'Foot']):
        obj.select_set(True)

bpy.ops.object.shade_smooth()

# Add camera for viewing
bpy.ops.object.camera_add(location=(12, -12, 6))
camera = bpy.context.active_object
camera.rotation_euler = (1.3, 0, 0.785)
bpy.context.scene.camera = camera

print("Humanoid base mesh created!")
print(f"Total height: {total_height} units (8 heads)")
print("Pose: T-pose, ready for rigging and sculpting")
```

**Benefits**:
- Faster character creation pipeline
- Correct proportional foundations
- Focus on character details

---

### 16. **UV Mapping Preparation**
**Scenario**: Prepare models for texturing.

**Use Case**: An artist requests: "Unwrap UV coordinates for this model using smart UV project and arrange islands efficiently." The AI handles UV preparation.

**Implementation Example**:
```
User: "Unwrap UVs for the selected object using Smart UV Project.
      Pack the islands efficiently and check for overlaps."

AI Assistant executes:
import bpy
import bmesh

# Get selected object
obj = bpy.context.active_object

if obj and obj.type == 'MESH':
    # Enter edit mode
    bpy.ops.object.mode_set(mode='EDIT')

    # Select all geometry
    bpy.ops.mesh.select_all(action='SELECT')

    # Mark seams at sharp edges (optional, for better unwrapping)
    bpy.ops.mesh.mark_sharp(clear=False)

    # Smart UV Project with angle-based seams
    bpy.ops.uv.smart_project(
        angle_limit=66.0,      # Angle threshold for seams
        island_margin=0.02,    # Space between UV islands
        area_weight=0.0,       # Prioritize by area
        correct_aspect=True,   # Maintain aspect ratio
        scale_to_bounds=False
    )

    # Pack UV islands efficiently
    bpy.ops.uv.pack_islands(margin=0.01)

    # Return to object mode
    bpy.ops.object.mode_set(mode='OBJECT')

    # Analyze UV map
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    uv_layer = bm.loops.layers.uv.active

    if uv_layer:
        # Check for UVs outside 0-1 range
        outside_bounds = 0
        for face in bm.faces:
            for loop in face.loops:
                uv = loop[uv_layer].uv
                if uv.x < 0 or uv.x > 1 or uv.y < 0 or uv.y > 1:
                    outside_bounds += 1
                    break

        # Calculate UV density (simplified)
        total_uv_area = sum(face.calc_area() for face in bm.faces)

        print(f"UV Unwrapping complete for '{obj.name}'")
        print(f"- Total UV islands: {len([f for f in bm.faces])}")
        print(f"- UVs outside 0-1 range: {outside_bounds} faces")
        print(f"- UV coverage optimized with 1% margin")

        if outside_bounds == 0:
            print("✓ All UVs within valid texture space")
        else:
            print("⚠ Some UVs outside bounds - may need adjustment")

    bm.free()

    print(f"\nModel '{obj.name}' ready for texturing!")
else:
    print("Please select a mesh object")
```

**Benefits**:
- Automated UV unwrapping
- Optimized texture space
- Ready for texturing

---

### 17. **Scene Composition Testing**
**Scenario**: Try different compositional arrangements.

**Use Case**: A designer says: "Try 5 different arrangements of these furniture pieces in the room and screenshot each option." The AI generates and captures variations.

**Implementation Example**:
```
User: "Create 5 different furniture arrangements in this room.
      Move the sofa, chairs, and table to different positions
      and render each layout."

AI Assistant executes:
import bpy
import random

# Define furniture objects to arrange
furniture_objects = ["Sofa", "Chair_1", "Chair_2", "Table", "Lamp"]

# Store original positions
original_positions = {}
for name in furniture_objects:
    obj = bpy.data.objects.get(name)
    if obj:
        original_positions[name] = obj.location.copy()

# Define 5 different layout configurations
layouts = [
    {  # Layout 1: Conversational
        "Sofa": (0, 0, 0),
        "Chair_1": (-2, 2, 0),
        "Chair_2": (2, 2, 0),
        "Table": (0, 1.5, 0),
        "Lamp": (3, 0, 0)
    },
    {  # Layout 2: Theater style
        "Sofa": (0, -1, 0),
        "Chair_1": (-1.5, 0.5, 0),
        "Chair_2": (1.5, 0.5, 0),
        "Table": (0, 3, 0),
        "Lamp": (-3, 2, 0)
    },
    {  # Layout 3: L-shaped
        "Sofa": (0, 0, 0),
        "Chair_1": (3, 0, 0),
        "Chair_2": (3, -1.5, 0),
        "Table": (1.5, -1, 0),
        "Lamp": (0, -2, 0)
    },
    {  # Layout 4: Centered
        "Sofa": (0, -2, 0),
        "Chair_1": (-2, 0, 0),
        "Chair_2": (2, 0, 0),
        "Table": (0, 0, 0),
        "Lamp": (0, 2, 0)
    },
    {  # Layout 5: Asymmetric
        "Sofa": (-1, 0, 0),
        "Chair_1": (2, -1, 0),
        "Chair_2": (2, 1.5, 0),
        "Table": (-1, 2, 0),
        "Lamp": (3, 0, 0)
    }
]

# Render settings
scene = bpy.context.scene
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.image_settings.file_format = 'PNG'

# Setup camera (if not already positioned)
camera = bpy.data.objects.get("Camera")
if camera:
    camera.location = (8, -8, 6)
    camera.rotation_euler = (1.1, 0, 0.785)

# Generate and render each layout
for i, layout in enumerate(layouts, 1):
    print(f"Setting up Layout {i}...")

    # Apply layout positions
    for obj_name, position in layout.items():
        obj = bpy.data.objects.get(obj_name)
        if obj:
            obj.location = position

    # Render the scene
    output_path = f"/tmp/furniture_layout_{i}.png"
    scene.render.filepath = output_path
    bpy.ops.render.render(write_still=True)

    print(f"✓ Rendered Layout {i}: {output_path}")

# Restore original positions
print("\nRestoring original furniture positions...")
for name, position in original_positions.items():
    obj = bpy.data.objects.get(name)
    if obj:
        obj.location = position

print(f"\nGenerated 5 furniture layout variations!")
print("Images saved to /tmp/furniture_layout_*.png")
```

**Benefits**:
- Rapid composition exploration
- Visual comparison options
- Client presentation materials

---

### 18. **Poly Haven Material Integration**
**Scenario**: Access high-quality PBR materials easily.

**Use Case**: An artist requests: "Get a brick wall material from Poly Haven and apply it to this building facade." The AI fetches and applies the material.

**Implementation Example**:
```
User: "Search Poly Haven for 'brick wall' material,
      download it, and apply to the selected object."

AI Assistant executes:
import bpy
import requests
import os

def search_polyhaven(query, asset_type='textures'):
    """Search Poly Haven API"""
    # Poly Haven provides free API access
    url = f"https://api.polyhaven.com/assets?t={asset_type}"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            assets = response.json()
            # Filter by query
            matches = {k: v for k, v in assets.items()
                      if query.lower() in k.lower()}
            return matches
    except:
        print("Error accessing Poly Haven API")
    return {}

def download_polyhaven_texture(asset_id, resolution='2k'):
    """Download texture files from Poly Haven"""
    # Get asset info
    info_url = f"https://api.polyhaven.com/files/{asset_id}"
    response = requests.get(info_url)

    if response.status_code == 200:
        files = response.json()

        # Download folder
        download_dir = f"/tmp/polyhaven/{asset_id}/"
        os.makedirs(download_dir, exist_ok=True)

        # Download PBR maps (diffuse, normal, roughness, etc.)
        texture_paths = {}

        if 'Textures' in files:
            tex_data = files['Textures'][resolution]

            for map_type, file_info in tex_data.items():
                if 'url' in file_info:
                    url = file_info['url']['jpg'] if 'jpg' in file_info['url'] else \
                          file_info['url']['png'] if 'png' in file_info['url'] else None

                    if url:
                        filename = f"{asset_id}_{map_type}.jpg"
                        filepath = os.path.join(download_dir, filename)

                        # Download file
                        img_data = requests.get(url).content
                        with open(filepath, 'wb') as f:
                            f.write(img_data)

                        texture_paths[map_type] = filepath
                        print(f"Downloaded: {map_type}")

        return texture_paths
    return {}

# Search for brick wall material
search_results = search_polyhaven("brick")

if search_results:
    # Get first result
    asset_id = list(search_results.keys())[0]
    print(f"Found: {asset_id}")

    # Download textures
    textures = download_polyhaven_texture(asset_id, resolution='2k')

    if textures:
        # Create PBR material
        mat = bpy.data.materials.new(name=f"PolyHaven_{asset_id}")
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        links = mat.node_tree.links
        nodes.clear()

        # Create nodes
        output = nodes.new(type='ShaderNodeOutputMaterial')
        output.location = (400, 0)

        bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
        bsdf.location = (0, 0)

        # Add texture nodes based on downloaded maps
        y_offset = 0
        for map_type, filepath in textures.items():
            tex_node = nodes.new(type='ShaderNodeTexImage')
            tex_node.location = (-400, y_offset)
            tex_node.image = bpy.data.images.load(filepath)

            # Connect based on map type
            if 'diff' in map_type.lower() or 'col' in map_type.lower():
                links.new(tex_node.outputs['Color'],
                         bsdf.inputs['Base Color'])
            elif 'rough' in map_type.lower():
                links.new(tex_node.outputs['Color'],
                         bsdf.inputs['Roughness'])
                tex_node.image.colorspace_settings.name = 'Non-Color'
            elif 'normal' in map_type.lower():
                normal_map = nodes.new(type='ShaderNodeNormalMap')
                normal_map.location = (-200, y_offset)
                links.new(tex_node.outputs['Color'],
                         normal_map.inputs['Color'])
                links.new(normal_map.outputs['Normal'],
                         bsdf.inputs['Normal'])
                tex_node.image.colorspace_settings.name = 'Non-Color'

            y_offset -= 300

        # Connect BSDF to output
        links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

        # Apply to selected object
        obj = bpy.context.active_object
        if obj and obj.type == 'MESH':
            if obj.data.materials:
                obj.data.materials[0] = mat
            else:
                obj.data.materials.append(mat)

            print(f"✓ Applied Poly Haven material '{asset_id}' to {obj.name}")
        else:
            print("No mesh object selected")
    else:
        print("Failed to download textures")
else:
    print("No matching materials found on Poly Haven")
```

**Benefits**:
- Professional material library access
- Seamless material integration
- Photorealistic results

---

### 19. **3D Model Generation from AI**
**Scenario**: Generate 3D models using AI model generation.

**Use Case**: A creator describes: "Generate a 3D model of a fantasy sword with ornate handle using Hyper3D Rodin and import it into my scene." The AI generates and imports.

**Implementation Example**:
```
User: "Use Hyper3D Rodin to generate a 3D model of a fantasy sword
      with ornate handle and glowing runes. Import into current scene."

AI Assistant executes:
import bpy
import requests
import time
import os

def generate_3d_model_rodin(prompt, api_key):
    """
    Generate 3D model using Hyper3D Rodin API
    Note: Requires API key from Hyper3D service
    """
    api_url = "https://api.hyper3d.ai/v1/rodin/generate"

    # Submit generation request
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "prompt": prompt,
        "num_inference_steps": 50,
        "guidance_scale": 7.5,
        "output_format": "glb"  # GLB format for easy import
    }

    print(f"Generating 3D model: '{prompt}'...")
    response = requests.post(api_url, json=payload, headers=headers)

    if response.status_code == 200:
        result = response.json()
        task_id = result['task_id']

        # Poll for completion
        status_url = f"https://api.hyper3d.ai/v1/rodin/status/{task_id}"

        while True:
            status_response = requests.get(status_url, headers=headers)
            status_data = status_response.json()

            if status_data['status'] == 'completed':
                model_url = status_data['model_url']
                print("✓ Model generation complete!")
                return model_url
            elif status_data['status'] == 'failed':
                print("✗ Generation failed")
                return None

            print(f"Status: {status_data['status']}... waiting")
            time.sleep(5)

    return None

# Generation parameters
prompt = "fantasy sword with ornate golden handle decorated with glowing blue runes, highly detailed, game asset"
api_key = "YOUR_API_KEY_HERE"  # User would provide their key

# Generate model (simulated for example)
# model_url = generate_3d_model_rodin(prompt, api_key)

# For demo purposes, assume we have a model URL
model_url = "https://example.com/generated_sword.glb"

# Download the model
model_path = "/tmp/generated_fantasy_sword.glb"

# In real implementation:
# model_data = requests.get(model_url).content
# with open(model_path, 'wb') as f:
#     f.write(model_data)

# For demo, use a placeholder
print(f"Model would be downloaded from: {model_url}")

# Import GLB into Blender
if os.path.exists(model_path):
    # Import the GLB file
    bpy.ops.import_scene.gltf(filepath=model_path)

    # Get imported object (last selected)
    imported_obj = bpy.context.selected_objects[0] if bpy.context.selected_objects else None

    if imported_obj:
        # Position in scene
        imported_obj.location = (0, 0, 1)
        imported_obj.rotation_euler = (0, 0, 0)
        imported_obj.scale = (1, 1, 1)
        imported_obj.name = "AI_Generated_Sword"

        print(f"✓ Imported AI-generated sword: {imported_obj.name}")
        print(f"Location: {imported_obj.location}")
    else:
        print("Import succeeded but no object found")
else:
    print("Note: This is a demonstration. Actual implementation requires:")
    print("1. Hyper3D Rodin API key")
    print("2. Active API subscription")
    print("3. Model generation time (30-120 seconds)")
    print(f"Prompt used: '{prompt}'")
```

**Benefits**:
- AI-powered model creation
- Unique asset generation
- Concept to 3D in minutes

---

### 20. **Batch Scene Modifications**
**Scenario**: Apply changes to multiple objects simultaneously.

**Use Case**: A technical artist requests: "Select all objects with 'building' in their name and increase their scale by 1.5x, then apply smooth shading." The AI processes the batch operation.

**Implementation Example**:
```
User: "Select all objects with 'building' in the name,
      scale them by 1.5x, apply smooth shading,
      and add a solidify modifier with 0.1 thickness."

AI Assistant executes:
import bpy

# Define search criteria
search_term = "building"
scale_factor = 1.5
modifier_thickness = 0.1

# Find all matching objects
matching_objects = [obj for obj in bpy.data.objects
                   if search_term.lower() in obj.name.lower()
                   and obj.type == 'MESH']

print(f"Found {len(matching_objects)} objects matching '{search_term}':")
for obj in matching_objects:
    print(f"  - {obj.name}")

if matching_objects:
    # Deselect all first
    bpy.ops.object.select_all(action='DESELECT')

    # Process each object
    modified_count = 0
    for obj in matching_objects:
        # Select object
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj

        # Scale by factor
        original_scale = obj.scale.copy()
        obj.scale *= scale_factor
        print(f"Scaled '{obj.name}': {original_scale} → {obj.scale}")

        # Apply smooth shading
        bpy.ops.object.shade_smooth()

        # Add Solidify modifier if not present
        if "Solidify" not in [mod.name for mod in obj.modifiers]:
            solidify = obj.modifiers.new(name="Solidify", type='SOLIDIFY')
            solidify.thickness = modifier_thickness
            solidify.offset = 0
            print(f"Added Solidify modifier to '{obj.name}'")

        # Optional: Set auto-smooth angle
        obj.data.use_auto_smooth = True
        obj.data.auto_smooth_angle = 0.523599  # 30 degrees

        obj.select_set(False)
        modified_count += 1

    print(f"\nBatch operation complete!")
    print(f"Modified {modified_count} objects:")
    print(f"  - Scaled by {scale_factor}x")
    print(f"  - Applied smooth shading")
    print(f"  - Added Solidify modifier ({modifier_thickness} thickness)")

    # Optional: Select all modified objects for review
    for obj in matching_objects:
        obj.select_set(True)

else:
    print(f"No objects found matching '{search_term}'")

# Additional batch operations can be added:
# - Material assignment
# - Collection organization
# - Visibility toggling
# - Export preparation
```

**Benefits**:
- Efficient bulk operations
- Consistent modifications
- Scene-wide updates in seconds

---

## Integration Workflow

### Typical Workflow:
1. Describe desired 3D content in natural language
2. AI interprets and executes Blender operations
3. Review viewport screenshot for accuracy
4. Iterate with further instructions
5. Export or continue refining

### Best Practices:
- Be specific with dimensions and proportions
- Use reference images when possible
- Iterate incrementally for complex models
- Leverage Python code for procedural tasks
- Utilize asset libraries for photorealistic results

## Advanced Capabilities

### Python Code Execution
Run custom Python scripts to extend Blender functionality beyond built-in commands.

### Asset Library Integration
- **Sketchfab**: Search and download community models
- **Poly Haven**: Access high-quality PBR materials and HDRIs
- **Hyper3D Rodin**: AI-generated 3D models

### Multi-Model Support
Compatible with various LLMs including Claude, DeepSeek R1, Gemini 2.0 Flash Thinking, and Qwen 32B.

## Conclusion

Blender MCP transforms 3D content creation by making Blender accessible through natural language. Whether you're a game developer, architect, educator, or 3D artist, these use cases demonstrate the potential for AI-assisted 3D modeling to accelerate workflows and reduce the technical barrier to 3D creation.

---

*Repository: https://github.com/ahujasid/blender-mcp*
*Documentation: https://blender-mcp.com/*
