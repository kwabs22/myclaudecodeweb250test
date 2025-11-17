# ArUco Markers - Quick Start Guide

## What You Need

1. ✅ Printer
2. ✅ White paper (A4 or Letter)
3. ✅ Scissors
4. ✅ Tape or glue
5. ✅ Rigid backing (cardboard, foam board)

---

## Step 1: Generate Markers (3 minutes)

### Option A: Online Generator (Easiest)

1. Go to: **https://chev.me/arucogen/**
2. Settings:
   - **Dictionary:** `4x4 (50 markers, 4×4 bits)`
   - **Marker ID:** Start with `0` (you can generate 0-49)
   - **Marker size:** `100 mm` (good for testing)
   - **Paper size:** `A4` or `Letter`
3. Click **Download**
4. Repeat for IDs 1, 2, 3 (at least 3 markers recommended)

### Option B: Python Script

```python
import cv2

# Generate 4 markers (IDs 0-3)
dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)

for marker_id in range(4):
    marker_img = cv2.aruco.generateImageMarker(dictionary, marker_id, 200)
    cv2.imwrite(f'marker_{marker_id}.png', marker_img)
    print(f'Generated marker_{marker_id}.png')
```

Run: `python generate_markers.py`

---

## Step 2: Print & Prepare (5 minutes)

1. **Print markers:**
   - Use **black & white** printer
   - **100% scale** (do not resize)
   - High quality/resolution setting

2. **Cut out markers:**
   - Cut along the white border
   - Keep some white space around black square (important!)

3. **Mount on backing:**
   - Glue or tape to cardboard
   - Keep marker **flat** (no wrinkles/bends)
   - White border must be visible

---

## Step 3: Place Markers (2 minutes)

### Good Placements:

✅ **On walls** at different heights
- Chest height (1.5m) for standing detection
- Waist height (1m) for sitting detection
- Floor level for ground reference

✅ **On furniture**
- Tables, desks (stable surfaces)
- Bookshelves (vertical reference)

✅ **Multiple markers** for better coverage
- 3-4 markers in room
- Spread out (not clustered)

### Avoid:

❌ Curved surfaces (markers must be flat)
❌ Shiny/glossy surfaces (causes glare)
❌ Moving objects (defeats purpose of stable anchors)
❌ Areas with shadows

---

## Step 4: Test Detection (1 minute)

1. Open app: `http://localhost:8000`
2. Click **🎲 ArUco** button
3. Point camera at marker
4. **Success!** Green outline appears with "ID: X" label

### Debug Panel Shows:

```
✓ OpenCV: Ready
🎲 ArUco Markers: 3
```

---

## Troubleshooting

### ❌ "OpenCV: Loading..."

**Wait 3-5 seconds** - OpenCV is a large library (8MB)
If still loading after 10 seconds, check internet connection

### ❌ Marker Not Detected

**Checklist:**
- [ ] Marker is printed at 100% scale (not resized)
- [ ] Marker has white border around it
- [ ] Marker is flat (not curved/bent)
- [ ] Good lighting (no shadows on marker)
- [ ] Camera can see entire marker (all 4 corners)
- [ ] ArUco layer is enabled (button active)

**Solutions:**
- Move closer/farther (try 1-2 meters distance)
- Improve lighting
- Ensure marker is clean (no smudges)
- Try different marker ID

### ❌ Detection Unstable (flickers)

**Causes:**
- Camera motion (hold phone steady)
- Poor lighting
- Marker too small for distance

**Solutions:**
- Use larger markers (150mm or 200mm)
- Better lighting
- Stabilize camera

---

## Marker Size Guide

| Distance | Recommended Marker Size |
|----------|-------------------------|
| 0.5m - 1m | 50mm - 100mm |
| 1m - 2m | 100mm - 150mm |
| 2m - 3m | 150mm - 200mm |
| 3m - 5m | 200mm - 300mm |

**Rule of Thumb:** Marker should fill ~10-20% of camera view for reliable detection

---

## Creating Marker Sets

### Home Gym Setup

```
Marker 0: Front wall (1.5m height)
Marker 1: Side wall (1.5m height)
Marker 2: Floor mat (center)
Marker 3: Equipment rack
```

**Use:** Track exercise form relative to fixed positions

### Classroom/Lab Setup

```
Marker 0-3: Four corners of room (wall-mounted)
Marker 4-7: Student workstations
Marker 8: Teacher's demo area
```

**Use:** Multi-student tracking, AR annotations per station

### Physical Therapy Setup

```
Marker 0: Patient's standing position (wall)
Marker 1: Treatment table (side)
Marker 2: Mirror position (for feedback)
```

**Use:** Track ROM (range of motion) relative to start position

---

## Advanced: Custom Marker Sizes

### Generate Large Marker (300mm)

```python
import cv2
import numpy as np

dictionary = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
marker = cv2.aruco.generateImageMarker(dictionary, 0, 600)  # 600 pixels

# Add white border (10% of size)
border = 60
marker_with_border = cv2.copyMakeBorder(
    marker, border, border, border, border,
    cv2.BORDER_CONSTANT, value=255
)

cv2.imwrite('marker_0_large.png', marker_with_border)
```

Print at **300mm width** for long-distance detection

---

## Pro Tips

### 🎯 Marker Placement Strategy

1. **Start with 3 markers** in triangle formation
2. Place at **eye level** for standing use
3. Space **2-3 meters apart** for good coverage
4. Use **different IDs** to identify locations

### 🔬 Testing Marker Quality

1. Place marker on flat surface
2. Enable ArUco layer
3. Move camera in circle around marker
4. **Good marker:** Detected from all angles
5. **Bad marker:** Only detected from front

### 📏 Measuring with Markers

1. Place two markers **exactly 1 meter apart**
2. Measure pixel distance in detection
3. Calculate pixels-per-meter scale
4. Use for distance estimation (future feature)

### 💡 Lighting Tips

- **Natural light:** Best consistency
- **LED lights:** Good (avoid fluorescent flicker)
- **Avoid:** Direct sunlight (causes glare)
- **Test:** Should see clear black/white contrast

---

## Printable Marker Sheet

Here's a template for 4 markers on one page:

```
┌─────────────────┬─────────────────┐
│                 │                 │
│   Marker ID: 0  │   Marker ID: 1  │
│   [QR-like]     │   [QR-like]     │
│                 │                 │
├─────────────────┼─────────────────┤
│                 │                 │
│   Marker ID: 2  │   Marker ID: 3  │
│   [QR-like]     │   [QR-like]     │
│                 │                 │
└─────────────────┴─────────────────┘
```

**Download:** Generate from https://chev.me/arucogen/
- Set to 4 markers per page
- IDs: 0, 1, 2, 3
- Size: 80mm each

---

## Next Steps

Once markers are working:

1. ✅ **Combine with skeleton** - Enable both ArUco + Skeleton layers
2. ✅ **Try AR placement** - Use markers as reference for placing items
3. ✅ **Experiment with positions** - Move markers around, find best setup
4. ✅ **Document your setup** - Note marker positions for repeatable experiments

---

## Resources

- **Online Generator:** https://chev.me/arucogen/
- **OpenCV ArUco Docs:** https://docs.opencv.org/4.x/d5/dae/tutorial_aruco_detection.html
- **Dictionary Reference:** DICT_4X4_50 = 50 unique 4x4 bit markers
- **Alternative Generators:**
  - https://fodi.github.io/arucogen/
  - https://sourceforge.net/projects/aruco/

---

## Quick Reference Card

**Print this section and keep near your setup:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         ARUCO QUICK REF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dictionary: DICT_4X4_50
IDs: 0-49
Recommended Size: 100-200mm

Marker Requirements:
• Flat surface
• White border around black square
• Good lighting (no shadows)
• Clean print (sharp edges)

Detection Range:
• Small (100mm): 0.5m - 2m
• Medium (150mm): 1m - 3m
• Large (200mm): 2m - 5m

Enable: Click 🎲 ArUco button

Debug Info:
OpenCV Ready? Check debug panel
Markers Found? Shows count

Troubleshoot:
1. Check lighting
2. Hold camera steady
3. Ensure marker is flat
4. Move to optimal distance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

Total time to get started: **~10 minutes**

Happy tracking! 🎲
