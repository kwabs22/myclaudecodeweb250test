# New Features Added

## 🔄 Camera Mirror Toggle

**Button:** `🔄 Mirror`

- **ON** (default): Video shows mirrored like looking in a mirror (natural for front camera)
- **OFF**: Video shows unflipped (true orientation)
- Click the button to toggle between modes
- Both video and AR overlays flip together

## 📍 AR Placement Mode

**Button:** `📍 AR Place`

### How to Use:

1. **Enable AR Placement:**
   - Click the `📍 AR Place` button
   - A panel appears on the right side with emoji options

2. **Select an Item:**
   - Choose from 9 different emojis/shapes:
     - 🎯 (Target)
     - ⭐ (Star)
     - ❤️ (Heart)
     - 🔴 (Red circle)
     - 🟢 (Green circle)
     - 🔵 (Blue circle)
     - 💎 (Diamond)
     - 🎨 (Palette)
     - 🎪 (Tent)

3. **Place Items:**
   - Click/tap anywhere on the screen
   - The selected emoji appears at that exact position
   - Items stay in place (independent of skeleton tracking)

4. **Remove Items:**
   - **Double-click** any placed item to remove it individually
   - Click `🗑️ Clear All` button to remove everything

5. **Disable Placement:**
   - Click `📍 AR Place` button again to exit placement mode

### Use Cases:

- **Debug coordinate system**: Place markers at key locations
- **Test AR overlays**: Verify items stay in correct positions
- **Mark reference points**: Highlight specific body parts
- **Create custom annotations**: Add visual markers for teaching

## Tips:

- Items are placed at **screen coordinates**, not tied to body tracking
- Items persist until manually removed
- Works independently of skeleton/muscles/keypoints layers
- Hover over items to see them scale up (desktop)
- Mirror mode affects both camera and placed items together

## Example Workflow:

1. Turn off Mirror mode if you want true orientation
2. Enable skeleton layer to see body tracking
3. Enable AR Placement mode
4. Select a marker (e.g., 🔴)
5. Click on shoulder, elbow, wrist to mark joints
6. See how your markers align with detected keypoints
7. Clear and try again with different poses!
