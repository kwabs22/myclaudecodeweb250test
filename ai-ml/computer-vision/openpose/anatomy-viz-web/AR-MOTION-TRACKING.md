# AR Motion Tracking Guide

## Overview

The AR placement system now uses **device motion sensors** to keep items anchored in world space. When you move your phone, AR items stay at their physical location instead of being stuck to the screen.

## How It Works

### 1. **Device Orientation Tracking**
- Uses gyroscope and accelerometer data
- Tracks phone rotation in 3 axes:
  - **Alpha (α)**: Compass direction (Z-axis rotation)
  - **Beta (β)**: Front-to-back tilt (X-axis rotation)
  - **Gamma (γ)**: Left-to-right tilt (Y-axis rotation)

### 2. **Initial Calibration**
- When you enable AR Placement for the first time, the app requests motion sensor permission
- On iOS 13+: You'll see a permission popup
- On Android: Automatically granted
- The current phone orientation becomes the "zero point"

### 3. **Position Updates**
- As you move your phone, AR items adjust their position
- Items appear to stay in the same physical location
- Sensitivity: 3x multiplier for natural movement feel

## Usage Instructions

### **Enable AR with Motion Tracking:**

1. Click `📍 AR Place` button
2. Grant motion sensor permission when prompted (iOS only)
3. Debug panel shows: `✓ Motion: Tracking`

### **Place AR Items:**

1. Select an emoji from the panel
2. Click/tap on screen to place it
3. Move your phone around - item stays in place!

### **Recalibrate:**

If items drift or you want a fresh start:
1. Hold phone in desired position
2. Click `🎯 Recalibrate` button
3. Current position becomes new zero point
4. All existing items lock to current screen positions

### **Clear Items:**

Click `🗑️ Clear All` to remove all placed AR items

## Debug Information

The debug panel shows:
- **✓ Motion: Tracking** - Sensors are active and tracking
- **⚠ Motion: Inactive** - Sensors not available or permission denied
- **AR Items: N** - Number of items currently placed

## Troubleshooting

### Items Don't Move
- Check debug panel for "Motion: Tracking" status
- On iOS: Ensure you granted motion permission
- Try clicking `🎯 Recalibrate`

### Items Drift Over Time
- This is normal with gyroscope data
- Click `🎯 Recalibrate` to reset
- Consider this a "soft AR" experience

### Permission Denied
- iOS: Go to Settings > Safari > Motion & Orientation Access
- Allow for your site/localhost
- Reload the page

### Motion Not Supported
- Some browsers don't support DeviceOrientation API
- Desktop browsers typically don't have motion sensors
- AR items will be screen-locked (still usable, just not world-locked)

## Technical Details

### Sensitivity Tuning

Current settings (in code):
```javascript
const sensitivityX = 3;  // Left-right movement
const sensitivityY = 3;  // Up-down movement
```

Higher values = items move more with phone movement
Lower values = items stay closer to screen position

### Position Calculation

```
offsetX = (currentGamma - initialGamma) * sensitivityX
offsetY = (currentBeta - initialBeta) * sensitivityY

newPosition = originalPosition + offset
```

### Limitations

1. **No Position Tracking**: Only rotation, not physical movement
2. **Drift**: Gyroscope drift accumulates over time
3. **No Depth**: Items don't scale with distance
4. **Browser-Dependent**: Requires DeviceOrientation API support

## Future Enhancements

Possible improvements:
- [ ] WebXR integration for true AR with depth
- [ ] ARCore/ARKit bridges for native AR
- [ ] Keypoint-attached AR (items follow body parts)
- [ ] Depth estimation using pose detection
- [ ] Improved drift correction algorithms

## Compatibility

- ✅ iOS Safari 13+ (with permission)
- ✅ Android Chrome/Firefox
- ✅ Mobile browsers with gyroscope
- ❌ Desktop browsers (no motion sensors)
- ❌ Older iOS versions (no API support)
