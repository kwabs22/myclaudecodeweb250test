# Quick Start Guide - Anatomy Visualization with AR

## Setup in Termux

```bash
# Pull latest changes
cd ~/myclaudecodeweb250test
git pull origin claude/research-openpose-01TZGJc18LJGLJuVLopb3QU5

# Start server
cd anatomy-viz-web
python3 -m http.server 8000
```

Then open in browser: `http://localhost:8000`

## First Time Setup

### Step 1: Camera Permission
- Browser will ask for camera access
- Click **Allow**
- You should see yourself in the video feed

### Step 2: Test Mirror Mode
- By default, camera is mirrored (like looking in a mirror)
- Click `🔄 Mirror` to toggle flip on/off
- Choose what feels natural to you

### Step 3: Enable AR Placement
- Click `📍 AR Place` button
- **iOS users**: You'll see a motion permission popup - click **Allow**
- **Android users**: Permission granted automatically
- Debug panel should show: `✓ Motion: Tracking`

## Testing AR with Motion Tracking

### Test 1: Basic Placement
1. With AR Place enabled, select an emoji (e.g., 🎯)
2. Click/tap center of screen to place it
3. **Don't move phone yet** - just confirm item appears

### Test 2: Motion Tracking
1. Place 2-3 items at different screen positions
2. **Slowly** tilt phone left → right
3. **Expected**: Items should move opposite direction (staying in world space)
4. **Slowly** tilt phone up → down
5. **Expected**: Items should compensate for tilt

### Test 3: Recalibration
1. Move phone to a weird angle
2. Items will be off-screen or misplaced
3. Click `🎯 Recalibrate` button
4. **Expected**: Items snap to current positions, tracking resets

### Test 4: Clear and Retry
1. Click `🗑️ Clear All`
2. All items disappear
3. Try placing new items

## Testing Pose Detection

### Enable Skeleton
1. Click `🦴 Skeleton` button
2. Stand in frame
3. **Expected**: White bones appear connecting your joints
4. Move your arms/legs - skeleton follows

### Enable Keypoints
1. Click `🎯 Keypoints` button
2. **Expected**: 33 colored dots appear on your body
   - **Green** = High confidence (>0.5)
   - **Yellow** = Medium confidence (>0.2)
   - **Red** = Low confidence (<0.2)
3. Each dot shows: `[index]:[confidence score]`

### Enable Muscles
1. Click `💪 Muscles` button
2. Move your arms (bicep curls)
3. **Expected**: Colored overlays on arms/legs
   - Brighter when muscles active (flexed)
   - Dimmer when relaxed

## Debug Panel Information

The debug panel shows real-time stats:

```
[Time] Recent log messages...
━━━━━━━━━━━━━━━━
✓ Camera: Active          ← Camera working
✓ Motion: Tracking        ← Gyroscope working
✓ Pose: Detected          ← AI sees you
Detections: 142           ← Total pose detections
FPS: 15                   ← Frames per second
AR Items: 3               ← Number of placed items
Keypoints (high): 18/33   ← High confidence points
Keypoints (med): 28/33    ← Medium+ confidence
Avg confidence: 0.412     ← Average detection quality
Max confidence: 0.891     ← Best detection point
```

## What to Look For

### ✅ Good Signs
- FPS: 10-30 (acceptable range)
- Keypoints (high): >10
- Avg confidence: >0.3
- Motion: Tracking (if AR enabled)
- Skeleton/muscles visible when standing in frame

### ⚠️ Issues to Report

**Low/No Detection:**
- Keypoints (high): <5
- Avg confidence: <0.2
- Try: Better lighting, move back from camera

**Motion Not Working:**
- Motion: Inactive
- AR items stuck to screen
- Check: Permission granted? iOS settings?

**Low FPS:**
- FPS: <5
- Phone may be overheating or low battery
- Try: Close other apps, charge phone

## Combining Features

### Example: AR + Skeleton
1. Enable `📍 AR Place`
2. Enable `🦴 Skeleton`
3. Place markers (🔴) on your shoulders
4. Move around - see if markers align with skeleton
5. Great for debugging coordinate system!

### Example: All Layers
1. Enable all: Skeleton + Muscles + Keypoints
2. Do a bicep curl
3. Watch:
   - Keypoints move
   - Skeleton follows
   - Muscles light up when flexed

## Common Issues

### "Camera worked but no AR visible"
- Solution: Turn on Debug panel, check keypoint counts
- If 0 keypoints: Adjust lighting, distance, or click `🎯 Keypoints` to verify

### "AR items fly off screen"
- Solution: Click `🎯 Recalibrate` button
- This is normal gyroscope drift, recalibrate as needed

### "Mirror mode confusing"
- Solution: Click `🔄 Mirror` to toggle
- Try both modes, use what feels natural

### "Permission denied" on iOS
- Solution: Settings > Safari > Motion & Orientation Access
- Enable for localhost/your site
- Reload page

## Files Created

All documentation is in `anatomy-viz-web/`:
- `index.html` - Main app
- `NEW-FEATURES.md` - Mirror toggle & AR placement guide
- `AR-MOTION-TRACKING.md` - Technical details on motion tracking
- `QUICK-START.md` - This file

## Next Steps After Testing

Once working well, we can evolve from MVP:
- Add more anatomical layers (organs, nervous system)
- Improve muscle activation detection
- Add educational overlays/labels
- Save/load AR scenes
- Export pose data for analysis

Test thoroughly and report what works/doesn't work!
