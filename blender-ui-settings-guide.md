# Complete Guide to Blender UI Settings

A comprehensive reference for all UI settings and preferences in Blender 3.x and 4.x.

**Last Updated**: 2025-11-23
**Blender Versions**: 3.0+ and 4.0+
**Reading Time**: 45 minutes

---

## Table of Contents

1. [Accessing Preferences](#accessing-preferences)
2. [Interface Settings](#interface-settings)
3. [Themes](#themes)
4. [Viewport Display](#viewport-display)
5. [Editing Settings](#editing-settings)
6. [Animation Settings](#animation-settings)
7. [Add-ons](#add-ons)
8. [Input Settings](#input-settings)
9. [Navigation](#navigation)
10. [Keymap](#keymap)
11. [System Settings](#system-settings)
12. [Save & Load](#save--load)
13. [File Paths](#file-paths)
14. [Experimental Features](#experimental-features)

---

## Accessing Preferences

### Opening Preferences Window

**Method 1**: Menu Navigation
- `Edit` → `Preferences` (Windows/Linux)
- `Blender` → `Preferences` (macOS)

**Method 2**: Keyboard Shortcut
- Press `F4` then `P` (Quick access)
- Or use search: `F3` → Type "Preferences"

**Method 3**: Quick Access
- Click the hamburger menu (≡) in any editor
- Select `Preferences`

---

## Interface Settings

**Location**: `Edit` → `Preferences` → `Interface`

### Resolution Scale

**Path**: `Interface` → `Display` → `Resolution Scale`

Controls the size of UI elements globally:
- **Default**: 1.0
- **Range**: 0.5 to 2.0
- **Use Case**:
  - Increase for high-DPI displays
  - Decrease to fit more content on small screens
  - 1.25-1.5 recommended for 4K displays

### Line Width

**Path**: `Interface` → `Display` → `Line Width`

Sets the thickness of UI lines and outlines:
- **Default**: Thin
- **Options**: Auto, Thin, Thick
- **Impact**: Affects graph editors, node editors, outliner tree lines

### Display

**Path**: `Interface` → `Display`

#### Render Region
- Shows a red border around rendered areas
- Useful for preview renders
- **Toggle**: Checkbox

#### Text Rendering
- **Subpixel Anti-Aliasing**: Smoother text on LCD screens
- **Interface Font**: Change the UI font globally
- **Options**: Default, Custom font file

#### Tooltips

**Path**: `Interface` → `Display` → `Tooltips`

- **Enable**: Show/hide all tooltips
- **Python Tooltips**: Display Python API in tooltips (for developers)
- **Delay**: Time before tooltip appears (0.0 - 2.0 seconds)

### Editors

**Path**: `Interface` → `Editors`

#### Corner Splitting
- **Enable**: Split editors by dragging corners
- **Default**: Enabled
- **Use**: Faster workspace customization

#### Region Overlap
- **Enable**: Overlays tools/properties on viewport
- **Default**: Disabled
- **Benefit**: More viewport space
- **Trade-off**: Can obscure content

#### Navigation Controls
- **Show**: Display navigation gizmo in 3D viewport
- **Options**: Always, On Hover, Never

### Translation

**Path**: `Interface` → `Translation`

- **Language**: Set UI language (50+ languages)
- **Translate**:
  - Tooltips
  - Interface
  - New Data (object names, etc.)

### Text Rendering

**Path**: `Interface` → `Text Rendering`

- **Hinting**: Font hinting method
  - Auto, None, Slight, Full
- **Anti-Aliasing**: Text smoothing method
  - None, Grayscale, LCD, Subpixel

---

## Themes

**Location**: `Edit` → `Preferences` → `Themes`

### Built-in Themes

1. **Blender Dark** (Default)
   - Professional dark interface
   - Easy on the eyes for long sessions

2. **Blender Light**
   - Light background
   - Better for bright environments

3. **Print**
   - High contrast for screenshots/tutorials

4. **White**
   - Maximum brightness

### Theme Customization

Each theme has ~200+ customizable color settings organized by:

#### User Interface
- **Regular**: Standard UI elements
- **Special**: Dropdowns, buttons
- **Text**: UI text colors
- **Highlight**: Selected items

#### 3D Viewport
- **Background**: Viewport background gradient
  - **Gradient High/Low**: Top and bottom colors
  - **Angle**: Gradient direction
- **Text**: Text overlay colors
- **Wire**: Wireframe colors
- **Object**: Selected, active, transform colors

#### Graph Editor
- **Background**: Editor background
- **Grid**: Grid line colors
- **Frame**: Current frame indicator
- **Curves**: Channel colors

#### Properties Editor
- **Header**: Panel headers
- **Navigation Bar**: Side navigation

#### Timeline
- **Frame**: Current/keyframe colors

### Custom Theme Installation

1. Download `.xml` theme file
2. `Preferences` → `Themes` → `Install`
3. Browse to theme file
4. Select and click `Install Theme`

**Popular Theme Sources**:
- Blender Market
- GitHub repositories
- BlenderArtists forums

---

## Viewport Display

**Location**: `Edit` → `Preferences` → `Viewport`

### Display

#### Object Info
- **Default**: Show object name in viewport
- **Options**:
  - Object Info: Name and type
  - Object Coordinates: Position data

#### Subdivision Surface
- **Viewport**: Subdivision level for viewport
- **Render**: Subdivision for final render
- **Default**: 2 for both

#### 3D Viewport Axis
- **Size**: Axis gizmo size (10-200)
- **Brightness**: Axis colors intensity

### Quality

**Path**: `Viewport` → `Quality`

#### Anti-Aliasing
- **Off**: Fastest, jagged edges
- **FXAA**: Fast, basic smoothing
- **5, 8, 11, 16, 32 Samples**: Higher = smoother but slower
- **Default**: 8 Samples

#### Smooth Wires
- Makes edge display smoother
- **Impact**: Slight performance cost

### Textures

**Path**: `Viewport` → `Textures`

- **Limit Size**: GL Texture maximum size
  - Default: 8192px
  - Lower for performance on weak GPUs
- **Anisotropic Filtering**: Texture quality at angles
  - Off, 2, 4, 8, 16
  - Higher = sharper but slower

### Selection

**Path**: `Viewport` → `Selection`

- **Open Shading**: Select back-facing faces
- **Selection Threshold**: Click accuracy (pixels)
  - Default: 75
  - Lower = more precise required

---

## Editing Settings

**Location**: `Edit` → `Preferences` → `Editing`

### Objects

#### New Objects
- **Align**: World or View aligned
- **Enter Edit Mode**: Auto-enter edit mode on creation
- **Rotation**: Euler or Quaternion (default)

#### Undo
- **Steps**: Number of undo levels (32-256)
  - Default: 32
  - Higher uses more memory
- **Memory Limit**: MB for undo (0 = unlimited)
  - Default: 0

### Duplicate Data

When duplicating objects, also duplicate:
- **Mesh**: Mesh datablock
- **Curve**: Curve data
- **Surface**: Surface data
- **Metaball**: Metaball data
- **Text**: Text data
- **Armature**: Armature data
- **Lattice**: Lattice data
- **Light**: Light data
- **Camera**: Camera data

**Use Case**:
- Enabled: True copies (recommended)
- Disabled: Linked duplicates

### Grease Pencil

- **Default Color**: New stroke color
- **Eraser Radius**: Default eraser size (1-500)
- **Euclidean Distance**: Stroke distance calculation
- **Manhattan Distance**: Alternative distance method

### Miscellaneous

- **Sculpt Overlay Color**: Sculpt mode mask colors
- **Weight Color Range**: Weight paint color gradient
- **Vertex Group Weight**: New vertex group weight (0-1)

---

## Animation Settings

**Location**: `Edit` → `Preferences` → `Animation`

### Timeline

- **Allow Negative Frames**: Enable negative timeline
  - Use: Pre-animation setup
- **Show Time in Seconds**: Display time instead of frames
- **Minimum Grid Spacing**: Timeline density (35-200)

### Keyframes

#### Visual Keying
- Uses visual transforms instead of actual values
- Useful for constrained objects

#### Only Insert Needed
- Only keyframes properties that changed
- Reduces keyframe count

#### Auto Keyframe
- **Enable**: Auto-insert keyframes when moving
- **Only Insert Available**: Only keyframe existing channels
- **Enable Layered Recording**: For NLA

### F-Curves

- **Minimum Curve Display Size**: Pixels (100-1000)
- **Unselected F-Curve Visibility**: How dim unselected curves are
- **Default Interpolation**: New keyframe type
  - Constant, Linear, Bezier (default)
- **Default Handles**: Bezier handle type
  - Free, Aligned, Vector, Auto, Auto Clamped

### Graph Editor

- **Only Show Selected Curve Keyframes**: Hide other keyframes
- **Only Show Selected Keyframes Handles**: Declutter view
- **Use Auto Snap by Default**: Auto-snap new keyframes

---

## Add-ons

**Location**: `Edit` → `Preferences` → `Add-ons`

### Finding Add-ons

**Search Bar**: Filter by:
- Name
- Category
- Description
- Author

**Categories**:
- 3D View
- Add Curve
- Add Mesh
- Animation
- Camera
- Development
- Game Engine
- Import-Export
- Lighting
- Material
- Mesh
- Node
- Object
- Paint
- Pipeline
- Render
- Rigging
- Sculpt
- Sequencer
- System
- Text Editor
- UI
- UV

### Essential Built-in Add-ons

#### Import-Export
- **Import Images as Planes**: Import images as textured planes
- **FBX Format**: Import/export FBX
- **glTF 2.0**: Import/export glTF/GLB
- **Wavefront OBJ**: OBJ import/export
- **Alembic**: Cache file format
- **USD**: Universal Scene Description

#### Mesh
- **3D-Print Toolbox**: Prepare models for 3D printing
- **Bool Tool**: Quick boolean operations
- **LoopTools**: Advanced mesh modeling tools
- **F2**: Fast face creation

#### Rigging
- **Rigify**: Auto-rigging system
- **Auto-Rig Pro**: Advanced rigging (third-party)

#### UV
- **Magic UV**: Advanced UV tools
- **UV Layout**: Export UV for texturing

#### Development
- **Developer Extras**: Expose developer options
- **Python Console**: Interactive Python

### Installing Third-Party Add-ons

**Method 1: Install from File**
1. Download `.py` or `.zip` file
2. `Preferences` → `Add-ons` → `Install`
3. Navigate to file
4. Click `Install Add-on`
5. Enable checkbox next to add-on

**Method 2: Manual Installation**
1. Locate Blender addons folder:
   - **Windows**: `C:\Users\[User]\AppData\Roaming\Blender Foundation\Blender\[version]\scripts\addons\`
   - **macOS**: `/Users/[User]/Library/Application Support/Blender/[version]/scripts/addons/`
   - **Linux**: `~/.config/blender/[version]/scripts/addons/`
2. Copy `.py` file or unzip to folder
3. Restart Blender
4. Enable in preferences

### Add-on Settings

Click arrow next to enabled add-on to show:
- **Description**: What it does
- **Location**: Where to find it in UI
- **File**: File path
- **Version**: Add-on version
- **Author**: Creator name
- **Preferences**: Add-on specific settings

---

## Input Settings

**Location**: `Edit` → `Preferences` → `Input`

### Keyboard

- **Emulate Numpad**: Use number row as numpad
  - For laptops without numpad
- **Emulate 3 Button Mouse**: Alt+LMB = MMB
  - For trackpads/2-button mice

### Mouse

- **Drag Threshold**: Pixels before drag detected (3-40)
  - Default: 10
  - Lower = more sensitive
- **Drag Threshold Tablet**: For pen tablets
- **Motion Threshold**: Distance to detect motion (0-20)

#### Mouse Cursor

- **Double Click Speed**: ms between clicks (150-1000)
  - Default: 350
- **Region Cross Size**: Region split indicator size
- **Tablet API**: Windows Ink or Wintab (Windows only)

### Tablet

- **Pressure Threshold**: Min pressure to register (0.0-1.0)
  - Default: 0.0
- **Pressure Softness**: Curve adjustment
  - Default: 0.0
- **API**: Tablet driver selection
  - Automatic, Wintab, Windows Ink, Windows Pointer

### NDOF (3D Mouse)

For SpaceNavigator and similar 3D mice:

#### Navigation
- **Pan Sensitivity**: Pan speed (0.1-10.0)
- **Orbit Sensitivity**: Orbit speed
- **Deadzone**: Center null zone (0.0-1.0)

#### Fly/Walk Mode
- **Speed**: Movement speed
- **Rotate**: Rotation sensitivity

---

## Navigation

**Location**: `Edit` → `Preferences` → `Navigation`

### Orbit & Pan

#### Orbit Method
- **Turntable**: Horizontal/vertical orbiting (traditional)
- **Trackball**: Free rotation (3D software standard)
  - Recommended for 3D modeling
  - Can cause gimbal lock

#### Orbit Sensitivity
- **Mouse**: How fast orbit responds (0.5-2.0)
- **NDOF**: For 3D mice

#### Smooth View
- **Time**: Animation time for view changes (0-1000ms)
  - 0 = instant
  - 200 = smooth default
- **Camera Parent Lock**: Camera follows parent

### Zoom

#### Zoom Method
- **Scale**: Zoom as FOV change (more natural)
- **Continue**: Momentum-based zoom
- **Dolly**: Move camera closer (traditional)

#### Zoom Axis
- **Vertical**: Up/down to zoom
- **Horizontal**: Left/right to zoom

#### Invert Zoom Direction
- Reverse zoom direction
- For trackpad users

### Fly & Walk

#### Walk Mode
- **View Height**: Camera height (0.1-10.0)
- **Jump Height**: Jump distance
- **Speed**: Movement speed (0.01-100)
- **Teleport Duration**: Instant or smooth (0-500ms)

#### Fly Mode
- **Speed**: Flight speed
- **Acceleration**: Ramp-up time

### Camera

- **Auto Depth**: Auto-focus on geometry
- **Zoom to Mouse Position**: Zoom toward cursor
- **Rotate Around Selection**: Orbit selected object

---

## Keymap

**Location**: `Edit` → `Preferences` → `Keymap`

### Preset Keymaps

Blender includes several built-in keymaps:

#### Blender (Default)
- Standard Blender shortcuts
- Industry-standard for Blender

#### Blender 2.7x
- Legacy keybindings
- For users upgrading from 2.7x

#### Industry Compatible
- Maya/3ds Max-like shortcuts
- `Alt` for selection
- Different navigation

### Keymap Preferences

#### Spacebar Action
- **Play**: Start/stop animation
- **Tools**: Tool menu
- **Search**: Command search (default in 2.8+)

#### Select With
- **Left**: Left-click to select (default 2.8+)
- **Right**: Right-click to select (legacy)

#### Select All Toggles
- Enable/disable "Select All" toggle behavior
- Affects `A` key

#### Pie Menus on Drag
- Show pie menus when dragging hotkey
- Faster workflow

### Customizing Shortcuts

**To Add Shortcut**:
1. Expand category (e.g., "3D View")
2. Expand subcategory (e.g., "3D View Global")
3. Click `Add New` at bottom
4. Set:
   - **Identifier**: Operator (e.g., `mesh.primitive_cube_add`)
   - **Shortcut**: Key combination
   - **Modifiers**: Ctrl, Shift, Alt, Oskey

**To Modify Existing**:
1. Find shortcut in list
2. Click to edit
3. Change key, add/remove modifiers

**To Remove**:
1. Find shortcut
2. Click `X` button

**Search Shortcuts**:
- Use search bar at top
- Type operator name or key

### Importing/Exporting Keymaps

**Export**:
1. Customize keymap
2. Click `Export` button
3. Save `.py` file

**Import**:
1. Click `Import` button
2. Select keymap `.py` file
3. Keymap appears in presets

---

## System Settings

**Location**: `Edit` → `Preferences` → `System`

### Cycles Render Devices

**CPU**:
- Always available
- Good for complex scenes

**CUDA (NVIDIA)**:
- GPU rendering for NVIDIA cards
- Fastest for NVIDIA users

**OptiX (NVIDIA RTX)**:
- RTX-accelerated rendering
- Requires RTX 20xx/30xx/40xx series

**HIP (AMD)**:
- GPU rendering for AMD cards
- Available on supported AMD GPUs

**Metal (macOS M1/M2)**:
- Apple Silicon GPU acceleration

**Multiple Devices**:
- Check multiple boxes to use CPU + GPU
- Can render on all devices simultaneously

### Memory & Limits

#### Compute Device
- Select GPU for viewport/rendering

#### Sequencer/Clip Editor
- **Memory Cache Limit**: MB for preview (0-32768)
  - 0 = unlimited
  - Default: 1024

#### Texture
- **Time Out**: Texture load timeout (0-3600s)
- **Collection Rate**: Garbage collection interval
- **Limit Size**: Max texture size
  - Off, 128, 256, 512, 1024, 2048, 4096, 8192

### Sound

- **Audio Device**: Select audio output
- **Channels**: Mono, Stereo, 4, 5.1, 7.1
- **Mixing Buffer**: Audio buffer size (128-8192 samples)
  - Lower = less latency
  - Higher = more stability
- **Sample Rate**: 44.1kHz, 48kHz, 96kHz, 192kHz
- **Sample Format**: U8, S16, S24, S32, F32, F64

---

## Save & Load

**Location**: `Edit` → `Preferences` → `Save & Load`

### Blend Files

#### Save
- **Compress File**: Reduce file size
  - Slower to save/load
  - 20-50% size reduction
- **Remap Relative**: Make paths relative on save
- **Save Preview Images**: Thumbnail for file browser
- **Default To**: Relative or absolute paths

#### Auto Save
- **Enable**: Automatic backup saves
- **Timer**: Minutes between saves (1-60)
  - Default: 2 minutes
- **Recent Files**: Number in `File` → `Open Recent` (0-30)
  - Default: 10

#### Paths
- **Auto Run Python Scripts**: Security setting
  - Disable for untrusted files
  - Enable for trusted workflows

### File Browser

- **Filter File Extensions**: Only show relevant files
- **Hide Dot Files**: Hide hidden files (Unix)
- **Show Recent Locations**: Quick access to recent folders
- **Show System Locations**: Desktop, Documents, etc.

### Text Editor

- **Tabs as Spaces**: Use spaces instead of tab character
- **Trim Text Blocks**: Remove trailing whitespace

### Save Versions

- **Number of Versions**: `.blend1`, `.blend2`, etc. (1-32)
  - Default: 2
  - Backup versions of file

---

## File Paths

**Location**: `Edit` → `Preferences` → `File Paths`

### Data

- **Fonts**: Custom font folder
- **Textures**: Default texture search path
- **Scripts**: Custom Python scripts
- **Sounds**: Default sound folder

### Applications

- **Image Editor**: External editor (Photoshop, GIMP)
  - Default: System default
  - Use: `Edit Externally` in UV/Image Editor
- **Animation Player**: External animation viewer
- **Terminal**: Command line application

### Development

- **Text Editor**: External text editor
  - For editing Python scripts
  - VSCode, Sublime Text, etc.

### Auto Execution

- **Auto Run Python Scripts**: Run scripts on file open
  - **Security Risk**: Only enable for trusted files
  - Required for some add-ons

### Asset Libraries

**Path**: `Preferences` → `File Paths` → `Asset Libraries`

- Add custom asset library locations
- Browse in Asset Browser
- **Default**: User library

**To Add**:
1. Click `+` button
2. Name library
3. Set folder path
4. Access in Asset Browser (`Shift+F11`)

---

## Experimental Features

**Location**: `Edit` → `Preferences` → `Experimental`

### Current Experimental Features (Blender 4.0+)

**Warning**: These features are incomplete and may:
- Crash Blender
- Produce incorrect results
- Change or be removed in future versions

#### Geometry Nodes
- **Attribute Search**: Search node attributes
- **Better Sampling**: Improved texture sampling

#### Grease Pencil
- **Next Generation**: Rewritten Grease Pencil system
- **Better Performance**: Faster drawing

#### Modeling
- **New Hair System**: Curve-based hair
- **Extended Asset Browser**: Additional asset features

#### Rendering
- **Cycles Debug**: Developer rendering options
- **Eevee Next**: Next-gen realtime renderer
  - Complete rewrite of EEVEE
  - Better quality and performance

#### Animation
- **Layered Animation**: Non-destructive animation layers
- **Pose Library**: Improved pose system

**Enabling Experimental Features**:
1. `Preferences` → `Experimental`
2. Check desired features
3. Restart Blender if prompted

**When to Use**:
- Testing new features
- Contributing to development
- Non-production work

**When NOT to Use**:
- Production projects
- Client work
- Learning Blender

---

## Quick Reference Tables

### Essential Shortcuts by Category

| Category | Default | Alternative |
|----------|---------|-------------|
| **Preferences** | - | `Edit` → `Preferences` |
| **Search Menu** | `F3` | - |
| **Quick Favorites** | `Q` | - |
| **Save Preferences** | Click `Save Preferences` | Auto-save enabled |

### Display Settings Quick Reference

| Setting | Location | Default | Recommendation |
|---------|----------|---------|----------------|
| **Resolution Scale** | Interface → Display | 1.0 | 1.25-1.5 for 4K |
| **Line Width** | Interface → Display | Thin | Thick for teaching |
| **Tooltips** | Interface → Display | Enabled | Keep enabled |
| **Anti-Aliasing** | Viewport → Quality | 8 | 16 for quality |
| **Undo Steps** | Editing → Objects | 32 | 64+ for complex work |

### Performance Settings Quick Reference

| Goal | Settings to Adjust |
|------|-------------------|
| **Better Performance** | - Lower AA samples<br>- Reduce texture limit<br>- Disable smooth wires<br>- Lower undo steps |
| **Better Quality** | - Higher AA samples<br>- Larger textures<br>- Enable smooth wires<br>- Compress saves OFF |
| **Laptop Friendly** | - Emulate numpad ON<br>- Emulate 3-button mouse ON<br>- Lower resolution scale |
| **4K Display** | - Resolution scale 1.25-1.5<br>- Thick line width<br>- Larger UI font |

---

## Common Customization Scenarios

### For New Users

```
Interface:
  - Resolution Scale: Default (1.0)
  - Tooltips: Enabled with Python tooltips
  - Region Overlap: Disabled

Input:
  - Emulate 3 Button Mouse: Enabled (if trackpad)
  - Emulate Numpad: Enabled (if no numpad)
  - Select With: Left

Keymap:
  - Preset: Industry Compatible (if from Maya/Max)
  - Spacebar: Search

Viewport:
  - Anti-Aliasing: 8 samples
  - Orbit Method: Turntable
```

### For Production Work

```
Editing:
  - Undo Steps: 64-128
  - Auto Save: 2-5 minutes
  - Save Versions: 3-5

System:
  - GPU: All available devices
  - Memory Cache: 4096+ MB

Save & Load:
  - Compress File: Disabled (faster saves)
  - Preview Images: Enabled
  - Auto Run Python: Disabled (security)
```

### For Teaching/Tutorials

```
Interface:
  - Resolution Scale: 1.25-1.5
  - Line Width: Thick
  - Text: Larger or custom font

Viewport:
  - Anti-Aliasing: 16 samples
  - Tooltips: Always show

Themes:
  - High contrast theme
  - Or custom with clear colors
```

### For Laptop Users

```
Input:
  - Emulate Numpad: Enabled
  - Emulate 3 Button Mouse: Enabled
  - Invert Zoom: Potentially

Viewport:
  - Anti-Aliasing: 5 or FXAA
  - Texture Limit: 4096 or lower
  - Subdivision: Lower levels

System:
  - GPU: Disabled if causing issues
  - Memory Cache: 512-1024 MB
```

---

## Best Practices

### Backup Your Preferences

1. After customizing preferences
2. `File` → `Defaults` → `Save Startup File`
3. Or manually backup:
   - **Windows**: `%APPDATA%\Blender Foundation\Blender\[version]\config\`
   - **macOS**: `~/Library/Application Support/Blender/[version]/config/`
   - **Linux**: `~/.config/blender/[version]/config/`
4. Copy `userpref.blend` to safe location

### Version Compatibility

- Preferences mostly compatible between minor versions (4.0 → 4.1)
- Major version upgrades may require reconfiguration
- Test preferences in new version before deleting old

### Performance vs. Quality

**Prioritize Performance When**:
- Working on complex scenes
- Using older hardware
- Modeling (don't need high quality)

**Prioritize Quality When**:
- Final viewport previews
- Recording tutorials
- Client presentations

### Organization

- Use presets for different workflows
- Document custom settings
- Share team settings via config files

---

## Troubleshooting

### Common Issues

#### UI Too Small/Large
- **Solution**: Adjust `Interface` → `Resolution Scale`

#### Tooltips Not Showing
- **Check**: `Interface` → `Display` → `Tooltips` enabled
- **Check**: Mouse hovering long enough (delay setting)

#### Can't Select Objects
- **Check**: `Input` → `Select With` setting
- **Check**: Object not hidden/disabled

#### Slow Viewport
- **Fix**: Lower `Viewport` → `Anti-Aliasing`
- **Fix**: Reduce `System` → `Texture Limit`
- **Fix**: Disable `Viewport` → `Smooth Wires`

#### Auto Save Not Working
- **Check**: `Save & Load` → `Auto Save` enabled
- **Check**: Timer interval set
- **Check**: Disk space available

#### Add-on Won't Enable
- **Check**: Compatible with Blender version
- **Check**: Dependencies installed
- **Try**: Refresh add-ons list
- **Try**: Restart Blender

---

## Resources

### Official Documentation
- [Blender Manual - Preferences](https://docs.blender.org/manual/en/latest/editors/preferences/)
- [Blender Manual - Keymap](https://docs.blender.org/manual/en/latest/editors/preferences/keymap.html)

### Community Resources
- [Blender Artists Forums](https://blenderartists.org/)
- [Blender Stack Exchange](https://blender.stackexchange.com/)
- [r/blender Subreddit](https://www.reddit.com/r/blender/)

### Popular Custom Themes
- [Blender Market Themes](https://blendermarket.com/categories/scripts-and-addons/themes)
- [GitHub Blender Themes](https://github.com/topics/blender-theme)

### Essential Add-ons
- [Blender Add-on Catalog](https://extensions.blender.org/)
- [Awesome Blender Add-ons](https://github.com/agmmnn/awesome-blender)

---

## Glossary

| Term | Definition |
|------|------------|
| **NDOF** | N Degrees of Freedom - 3D mouse input device |
| **DPI** | Dots Per Inch - Display resolution |
| **Gimbal Lock** | Rotation limitation in Euler rotation |
| **Viewport** | 3D view window in Blender |
| **Keymap** | Keyboard shortcut configuration |
| **Region Overlap** | UI panels overlaying viewport |
| **Anti-Aliasing** | Smoothing jagged edges |
| **Anisotropic Filtering** | Texture clarity at angles |

---

**Document Version**: 1.0
**Last Updated**: 2025-11-23
**Compatible Blender Versions**: 3.0+, 4.0+
**Author**: Comprehensive AI Analysis

**Related Documents**:
- [EasyBPY Concepts for PlayCanvas](./easybpy-concepts-for-playcanvas.md)
- [AI Tools Impacting 3D Gaming](./ai-tools-3d-gaming-impact.md)
