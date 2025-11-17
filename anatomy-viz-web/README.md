# 🦴 Anatomy Visualization Web App

**Live Educational AR Tool - See Your Anatomy in Real-Time**

A complete, working web application that uses AI pose detection to overlay anatomical structures (skeleton and muscles) on your body in real-time. Perfect for education, learning anatomy, and understanding body mechanics!

---

## ✨ Features

### Current MVP Features

✅ **Real-Time Pose Detection**
- Uses TensorFlow.js with BlazePose model
- Detects 33 body keypoints in real-time
- Works on any device with camera

✅ **Skeletal System (13 Major Bones)**
- Skull (cranium)
- Cervical & thoracic spine
- Clavicles (collarbones)
- Humerus (upper arm bones)
- Radius & ulna (forearm bones)
- Pelvis (hip bone)
- Femur (thigh bones)
- Tibia & fibula (lower leg bones)

✅ **Muscle Groups (6 Major Muscles)**
- Biceps brachii (both arms) - **activates when you bend elbows!**
- Deltoids (shoulders)
- Quadriceps (thighs) - **activates when you extend legs!**

✅ **Interactive Controls**
- Toggle skeleton on/off
- Toggle muscles on/off
- Toggle anatomical labels
- Educational info panel

✅ **Educational Content**
- Bone names and descriptions
- Muscle functions
- Anatomical facts
- Usage instructions

✅ **Mobile-Friendly**
- Responsive design
- Works on phones and tablets
- Touch-friendly controls
- Optimized for all screen sizes

---

## 🚀 How to Use

### Option 1: Direct File (Easiest)

1. **Open the file:**
   - Simply open `index.html` in any modern web browser
   - Chrome, Firefox, Safari, or Edge

2. **Allow camera access:**
   - Browser will ask for camera permission
   - Click "Allow"

3. **Stand in front of camera:**
   - Make sure your whole body is visible
   - Good lighting helps!

4. **Explore:**
   - Click buttons to toggle layers
   - Move around to see muscle activation!

### Option 2: Local Server (Better Performance)

```bash
# If you have Python
cd anatomy-viz-web
python -m http.server 8000

# Then open: http://localhost:8000
```

### Option 3: On Your Phone

**Method A: Direct File**
1. Transfer `index.html` to your phone
2. Open with Chrome or Firefox
3. Allow camera access

**Method B: Via Server**
1. Run local server on computer
2. Find your computer's IP (e.g., 192.168.1.100)
3. On phone, open: `http://192.168.1.100:8000`

---

## 🎮 Controls

### Buttons

**🦴 Skeleton**
- Toggle skeletal system overlay
- Shows all major bones
- Anatomically positioned

**💪 Muscles**
- Toggle muscle overlay
- Watch them activate as you move!
- Red = active/contracted
- Pink = relaxed

**🏷️ Labels**
- Show anatomical names
- Educational terminology
- Positioned on bones/muscles

**📚 Info**
- Open educational panel
- Learn about anatomy
- Usage instructions

### Keyboard Shortcuts (Desktop)

_Coming in next version!_

---

## 📚 Educational Use

### What Students Can Learn

**Anatomy Basics:**
- Location of major bones
- Bone names (common and Latin)
- Skeletal structure
- Joint locations

**Muscle Function:**
- Which muscles move which joints
- Muscle activation patterns
- Contraction vs. relaxation
- Movement mechanics

**Interactive Learning:**
- See muscles activate in real-time
- Understand body mechanics
- Visual learning tool
- Self-exploration

### Example Activities

1. **Bone Identification Quiz**
   - Turn on labels
   - Try to name bones before reading
   - Learn proper terminology

2. **Muscle Activation Study**
   - Turn on muscles
   - Perform different movements
   - Watch which muscles activate
   - Understand exercise mechanics

3. **Movement Analysis**
   - Do a bicep curl
   - Watch biceps light up
   - See how bones move
   - Understand body mechanics

4. **Compare with Friends**
   - Multiple people use the app
   - Compare anatomy
   - Learn variations
   - Group learning activity

---

## 🎯 How It Works

### Technology Stack

```
Camera Feed
    ↓
TensorFlow.js (BlazePose)
    ↓
33 Keypoints Detected
    ↓
Map to Anatomy Data
    ↓
Render Overlays (Canvas 2D)
    ↓
Display in Browser
```

### Pose Detection

**BlazePose Model:**
- Detects 33 keypoints on body
- Real-time processing (30+ FPS)
- Works in browser (no server needed)
- Privacy: all processing on-device

**Keypoints Used:**
```javascript
0: Nose
11, 12: Shoulders
13, 14: Elbows
15, 16: Wrists
23, 24: Hips
25, 26: Knees
27, 28: Ankles
// + more for accuracy
```

### Anatomy Mapping

**Bones:**
```javascript
{
    id: 'femur_right',
    name: 'Right Femur (Thigh Bone)',
    keypoints: [24, 26],  // Hip to knee
    color: '#F5F5DC',
    info: 'Longest and strongest bone...'
}
```

**Muscles with Activation:**
```javascript
{
    id: 'biceps_left',
    name: 'Left Biceps Brachii',
    keypoints: [11, 13, 15],  // Shoulder, elbow, wrist
    activationAngle: {
        joint: [11, 13, 15],
        threshold: 100  // Degrees
    },
    color: 'rgba(255,100,100,0.6)',     // Relaxed
    activeColor: 'rgba(255,50,50,0.9)'  // Contracted
}
```

### Muscle Activation Logic

```javascript
// Calculate elbow angle
angle = calculateAngle(shoulder, elbow, wrist);

// If angle < 100°, biceps is contracted
if (angle < 100) {
    // Show bright red (active)
    drawMuscle(activeColor);
} else {
    // Show light pink (relaxed)
    drawMuscle(normalColor);
}
```

---

## 🛠️ Customization

### Adding More Bones

Edit the `anatomyData.bones` array:

```javascript
{
    id: 'new_bone',
    name: 'Your Bone Name',
    keypoints: [start_index, end_index],
    type: 'bone',
    color: '#F5F5DC',
    info: 'Educational information...'
}
```

### Adding More Muscles

```javascript
{
    id: 'new_muscle',
    name: 'Your Muscle Name',
    keypoints: [attachment_points],
    activationAngle: {
        joint: [point1, point2, point3],
        threshold: 90,
        reverse: false  // true for extension instead of flexion
    },
    color: 'rgba(255,100,100,0.6)',
    activeColor: 'rgba(255,50,50,0.9)',
    info: 'Educational information...'
}
```

### Changing Colors

```javascript
// Bone color
color: '#F5F5DC'  // Cream/beige

// Muscle colors
color: 'rgba(255,100,100,0.6)'        // Light red (relaxed)
activeColor: 'rgba(255,50,50,0.9)'    // Bright red (active)
```

### Adding Educational Content

Update the `info` field in anatomy data:

```javascript
info: `
    <strong>Femur (Thigh Bone)</strong><br><br>
    • Longest bone in human body<br>
    • Can support 30x body weight<br>
    • Connects hip to knee<br>
    • Made of compact bone<br><br>
    <em>Fun Fact:</em> Takes about 20 years to fully develop!
`
```

---

## 📱 Browser Compatibility

### ✅ Fully Supported

- Chrome 90+ (Desktop & Mobile)
- Edge 90+
- Safari 14+ (iOS 14+)
- Firefox 88+

### ⚠️ Limited Support

- Older browsers may have issues
- Camera access required
- WebGL recommended

### Requirements

- Camera access
- JavaScript enabled
- Modern browser
- Decent internet (first load only)

---

## 🔧 Troubleshooting

### Camera Not Working

**Problem:** "Camera access denied"
**Solution:**
1. Check browser permissions
2. Click lock icon in address bar
3. Allow camera access
4. Refresh page

**Problem:** Camera shows but no pose detection
**Solution:**
1. Make sure whole body is visible
2. Improve lighting
3. Move closer/further from camera
4. Refresh page

### Performance Issues

**Problem:** Slow/laggy
**Solution:**
1. Close other browser tabs
2. Use Chrome (best performance)
3. Reduce screen size
4. Disable muscles (show skeleton only)

**Problem:** Not loading
**Solution:**
1. Check internet connection (first load)
2. Clear browser cache
3. Try different browser
4. Check JavaScript is enabled

### Display Issues

**Problem:** Overlay not aligned
**Solution:**
1. Stand directly facing camera
2. Make sure full body is visible
3. Improve lighting
4. Camera should be at chest height

**Problem:** Labels not showing
**Solution:**
1. Click "🏷️ Labels" button
2. Make sure skeleton or muscles are on
3. Check if labels are behind video

---

## 🎓 Educational Standards

This tool supports learning objectives in:

**Biology/Life Science:**
- Human anatomy and physiology
- Skeletal system structure
- Muscular system function
- Body mechanics

**Health/PE:**
- Exercise form and technique
- Muscle groups and function
- Movement patterns
- Body awareness

**Medical/Nursing:**
- Anatomical terminology
- Bone identification
- Muscle attachments
- Kinesthetic learning

---

## 📈 Future Enhancements (Roadmap)

### Phase 2 Features

- [ ] More bones (ribs, scapula, hands, feet)
- [ ] More muscles (all major surface muscles)
- [ ] Internal organs overlay
- [ ] Clickable anatomy (click bone for info)
- [ ] Quiz mode ("Name this bone")
- [ ] Keyboard shortcuts
- [ ] Save screenshots
- [ ] Record sessions

### Phase 3 Features

- [ ] Circulatory system
- [ ] Nervous system
- [ ] Digestive system
- [ ] X-ray mode (transparency)
- [ ] 3D model integration
- [ ] Voice narration
- [ ] Multiple languages
- [ ] Progress tracking

### Advanced Features

- [ ] Multi-person detection
- [ ] Exercise form analysis
- [ ] Movement tracking
- [ ] Range of motion measurement
- [ ] Injury prevention tips
- [ ] Workout suggestions
- [ ] Teacher dashboard
- [ ] Student accounts

---

## 💡 Tips for Best Experience

### Lighting
- Good, even lighting works best
- Avoid backlighting (window behind you)
- Face a light source
- Natural daylight is ideal

### Camera Position
- Mount camera at chest height
- 6-10 feet away from camera
- Entire body should be visible
- Neutral background helps

### Movement
- Start standing still
- Let system detect pose
- Then move slowly
- Watch muscles activate!

### Learning
- Start with skeleton only
- Add muscles once comfortable
- Use labels to learn names
- Read info panel for details

---

## 🔒 Privacy & Security

**All Processing is Local:**
- Camera feed never leaves your device
- No data sent to servers
- No recording or storage
- Complete privacy

**No Account Needed:**
- No login required
- No personal information
- No tracking
- No cookies

**Open Source:**
- View all code in this file
- Transparent operation
- No hidden features
- Modify as needed

---

## 📖 Anatomy Reference

### BlazePose Keypoints

```
0: nose
1: left_eye_inner
2: left_eye
3: left_eye_outer
4: right_eye_inner
5: right_eye
6: right_eye_outer
7: left_ear
8: right_ear
9: mouth_left
10: mouth_right
11: left_shoulder
12: right_shoulder
13: left_elbow
14: right_elbow
15: left_wrist
16: right_wrist
17: left_pinky
18: right_pinky
19: left_index
20: right_index
21: left_thumb
22: right_thumb
23: left_hip
24: right_hip
25: left_knee
26: right_knee
27: left_ankle
28: right_ankle
29: left_heel
30: right_heel
31: left_foot_index
32: right_foot_index
```

### Muscle Activation Thresholds

- **Biceps:** < 100° elbow flexion
- **Quadriceps:** > 160° knee extension
- **Deltoids:** Always visible (no activation threshold in MVP)

---

## 🤝 Contributing

Want to add features?

1. Copy `index.html`
2. Make your changes
3. Test thoroughly
4. Share your improvements!

Suggestions welcome for:
- More bones/muscles
- Better activation logic
- UI improvements
- Educational content
- Bug fixes

---

## 📝 License

Educational use encouraged! Feel free to:
- Use in classroom
- Share with students
- Modify for your needs
- Learn from the code

---

## 🎉 Quick Start Checklist

- [ ] Open `index.html` in browser
- [ ] Allow camera access
- [ ] Click "🦴 Skeleton" button
- [ ] See bones overlay on your body!
- [ ] Click "💪 Muscles" button
- [ ] Bend your arm - watch biceps activate!
- [ ] Click "🏷️ Labels" to learn names
- [ ] Click "📚 Info" for more information
- [ ] Explore and learn!

---

**Ready to explore your anatomy? Open `index.html` and start learning! 🦴💪🧠**

## Support

Questions? Issues? Suggestions?
- Check troubleshooting section above
- Review the code comments in `index.html`
- Modify the anatomy data to suit your needs!

**Happy Learning!** 🎓✨
