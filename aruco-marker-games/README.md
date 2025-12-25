# ArUco Marker Games - PlayCanvas Implementations

This folder contains complete PlayCanvas script implementations for 50 unique ArUco marker-based games.

## Folder Structure

- **ar-entertainment/** - AR games for fun and engagement (15 implementations)
- **educational/** - Learning experiences with markers (10 implementations)
- **competitive-multiplayer/** - Competitive and multiplayer games (8 implementations)
- **creative-artistic/** - Creative and artistic applications (7 implementations)
- **practical-applications/** - Practical use cases (10 implementations)

## Setup Requirements

### Hardware
- Webcam or device camera
- Printed ArUco markers (included in `/markers` folder)
- Adequate lighting for marker detection

### Software Dependencies
- PlayCanvas Engine
- AR.js or OpenCV.js for marker detection
- WebRTC for camera access

## Quick Start

1. **Print Markers**: Print the ArUco markers from the `/markers` folder
2. **Import Script**: Add the desired script to your PlayCanvas project
3. **Configure Camera**: Attach camera entity with marker detection enabled
4. **Set Attributes**: Configure marker IDs and game parameters
5. **Run**: Launch and point camera at markers

## Basic Integration

```javascript
// Example: Basic marker detection setup
var ArucoGame = pc.createScript('arucoGame');

ArucoGame.prototype.initialize = function() {
    // Initialize camera feed
    this.setupCamera();

    // Initialize marker detector
    this.detector = new AR.Detector();

    // Track active markers
    this.activeMarkers = {};
};

ArucoGame.prototype.update = function(dt) {
    // Detect markers in camera frame
    const markers = this.detector.detect(this.videoFrame);

    // Process each detected marker
    markers.forEach(marker => {
        this.handleMarker(marker);
    });
};
```

## Common Features

Each implementation includes:
- ✅ Marker detection and tracking
- ✅ Pose estimation (position + rotation)
- ✅ Object spawning and management
- ✅ Visual feedback
- ✅ Score/progress tracking
- ✅ Multi-marker support
- ✅ Error handling and fallbacks

## Marker Management

### Default Marker IDs
- **0-9**: General purpose markers
- **10-19**: Player/character markers
- **20-29**: Item/collectible markers
- **30-39**: Action/trigger markers
- **40-49**: Environment/decoration markers

### Custom Markers
Each script can be configured to use custom marker ID ranges via attributes.

## Performance Tips

1. **Limit Detection Range**: Only detect markers you need
2. **Reduce Resolution**: Lower camera resolution for better performance
3. **Throttle Detection**: Run detection at 30 FPS instead of 60 FPS
4. **Marker Pooling**: Reuse marker objects instead of creating new ones
5. **Distance Culling**: Ignore markers too far from camera

## Troubleshooting

**Markers Not Detecting:**
- Ensure adequate lighting
- Check marker print quality (high contrast)
- Verify marker size (minimum 2x2 inches recommended)
- Check camera permissions

**Poor Tracking:**
- Reduce ambient lighting reflections
- Keep markers flat and stable
- Clean camera lens
- Use matte finish on markers (not glossy)

**Performance Issues:**
- Lower camera resolution
- Reduce number of simultaneous markers
- Disable unused features
- Optimize 3D models

## Additional Resources

- [AR.js Documentation](https://ar-js-org.github.io/AR.js-Docs/)
- [OpenCV.js Tutorials](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html)
- [PlayCanvas API Reference](https://developer.playcanvas.com/en/api/)
- [ArUco Marker Generator](http://chev.me/arucogen/)

## Contributing

Feel free to:
- Add new marker-based game mechanics
- Improve detection accuracy
- Optimize performance
- Create hybrid games combining multiple scripts

## License

Educational use - Adapt and modify for your projects!
