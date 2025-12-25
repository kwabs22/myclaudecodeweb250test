/** AR Painting - Create 3D paintings in AR space */
var ARPainting = pc.createScript('arPainting');

ARPainting.attributes.add('brushMarkerID', {
    type: 'number',
    default: 500,
    description: 'Brush/pen marker'
});

ARPainting.attributes.add('colorMarkerIDs', {
    type: 'number',
    array: true,
    default: [501, 502, 503, 504, 505, 506],
    description: 'Color palette markers (red, blue, green, yellow, purple, orange)'
});

ARPainting.attributes.add('toolMarkerIDs', {
    type: 'number',
    array: true,
    default: [507, 508, 509],
    description: 'Tool markers (eraser, spray, stamp)'
});

ARPainting.prototype.initialize = function() {
    this.brush = null;
    this.currentColor = new pc.Color(0, 0, 0);
    this.currentBrushSize = 0.02;
    this.currentTool = 'pen';
    this.isDrawing = false;
    this.lastBrushPos = null;
    this.strokes = [];
    this.currentStroke = null;

    this.colorPalette = {
        501: new pc.Color(1, 0.2, 0.2),
        502: new pc.Color(0.2, 0.2, 1),
        503: new pc.Color(0.2, 1, 0.2),
        504: new pc.Color(1, 1, 0.2),
        505: new pc.Color(0.8, 0.2, 1),
        506: new pc.Color(1, 0.6, 0.2)
    };

    this.tools = {
        507: 'eraser',
        508: 'spray',
        509: 'stamp'
    };
};

ARPainting.prototype.update = function(dt) {
    if (this.isDrawing && this.brush && this.lastBrushPos) {
        this.drawStroke();
    }
};

ARPainting.prototype.onMarkerDetected = function(markerId, pose) {
    if (markerId === this.brushMarkerID) {
        this.updateBrush(pose);
    } else if (this.colorMarkerIDs.includes(markerId)) {
        this.selectColor(markerId);
    } else if (this.toolMarkerIDs.includes(markerId)) {
        this.selectTool(markerId);
    }
};

ARPainting.prototype.updateBrush = function(pose) {
    if (!this.brush) {
        this.createBrush();
    }

    const newPos = pose.position.clone();
    this.brush.setPosition(newPos);

    if (this.lastBrushPos) {
        const distance = this.lastBrushPos.distance(newPos);

        if (distance > 0.001) {
            this.isDrawing = true;
        } else {
            this.isDrawing = false;
        }
    }

    this.lastBrushPos = newPos.clone();
};

ARPainting.prototype.createBrush = function() {
    this.brush = new pc.Entity('Brush');
    this.entity.addChild(this.brush);

    this.brush.addComponent('model', { type: 'cone' });
    this.brush.setLocalScale(0.02, 0.03, 0.02);

    if (this.brush.model && this.brush.model.meshInstances[0]) {
        this.brush.model.meshInstances[0].material.diffuse = this.currentColor.clone();
        this.brush.model.meshInstances[0].material.update();
    }
};

ARPainting.prototype.drawStroke = function() {
    if (!this.currentStroke) {
        this.currentStroke = {
            points: [],
            color: this.currentColor.clone(),
            size: this.currentBrushSize,
            tool: this.currentTool
        };
        this.strokes.push(this.currentStroke);
    }

    const point = this.lastBrushPos.clone();
    this.currentStroke.points.push(point);

    // Create visual for stroke segment
    this.createStrokeSegment(point, this.currentColor, this.currentBrushSize);
};

ARPainting.prototype.createStrokeSegment = function(position, color, size) {
    const segment = new pc.Entity('StrokeSegment');
    this.entity.addChild(segment);

    segment.addComponent('model', { type: 'sphere' });
    segment.setPosition(position);
    segment.setLocalScale(size, size, size);

    if (segment.model && segment.model.meshInstances[0]) {
        segment.model.meshInstances[0].material.diffuse = color.clone();
        segment.model.meshInstances[0].material.emissive = color.clone().mulScalar(0.2);
        segment.model.meshInstances[0].material.update();
    }
};

ARPainting.prototype.selectColor = function(markerId) {
    const color = this.colorPalette[markerId];
    if (!color) return;

    this.currentColor = color.clone();
    console.log('Selected color:', this.getColorName(markerId));

    // Update brush color
    if (this.brush && this.brush.model && this.brush.model.meshInstances[0]) {
        this.brush.model.meshInstances[0].material.diffuse = this.currentColor.clone();
        this.brush.model.meshInstances[0].material.update();
    }

    // End current stroke
    this.currentStroke = null;
};

ARPainting.prototype.getColorName = function(markerId) {
    const names = {
        501: 'Red',
        502: 'Blue',
        503: 'Green',
        504: 'Yellow',
        505: 'Purple',
        506: 'Orange'
    };
    return names[markerId] || 'Unknown';
};

ARPainting.prototype.selectTool = function(markerId) {
    const tool = this.tools[markerId];
    if (!tool) return;

    this.currentTool = tool;
    console.log('Selected tool:', tool);

    switch(tool) {
        case 'eraser':
            this.currentBrushSize = 0.04;
            break;
        case 'spray':
            this.currentBrushSize = 0.01;
            break;
        case 'stamp':
            this.currentBrushSize = 0.05;
            break;
        default:
            this.currentBrushSize = 0.02;
    }

    this.currentStroke = null;
};

ARPainting.prototype.clearCanvas = function() {
    // Remove all stroke visuals
    this.entity.children.forEach(child => {
        if (child.name === 'StrokeSegment') {
            child.destroy();
        }
    });

    this.strokes = [];
    this.currentStroke = null;

    console.log('Canvas cleared');
};

ARPainting.prototype.undoStroke = function() {
    if (this.strokes.length === 0) return;

    const lastStroke = this.strokes.pop();

    // Remove visual segments for last stroke
    let removed = 0;
    this.entity.children.forEach(child => {
        if (child.name === 'StrokeSegment' && removed < lastStroke.points.length) {
            child.destroy();
            removed++;
        }
    });

    console.log('Undo - removed last stroke');
};

ARPainting.prototype.saveArtwork = function() {
    const artworkData = {
        strokes: this.strokes.map(stroke => ({
            points: stroke.points.map(p => [p.x, p.y, p.z]),
            color: [stroke.color.r, stroke.color.g, stroke.color.b],
            size: stroke.size,
            tool: stroke.tool
        })),
        timestamp: Date.now()
    };

    console.log('Artwork saved:', artworkData.strokes.length, 'strokes');
    return artworkData;
};

ARPainting.prototype.loadArtwork = function(artworkData) {
    this.clearCanvas();

    artworkData.strokes.forEach(strokeData => {
        strokeData.points.forEach(pointArray => {
            const point = new pc.Vec3(pointArray[0], pointArray[1], pointArray[2]);
            const color = new pc.Color(strokeData.color[0], strokeData.color[1], strokeData.color[2]);
            this.createStrokeSegment(point, color, strokeData.size);
        });

        this.strokes.push({
            points: strokeData.points.map(p => new pc.Vec3(p[0], p[1], p[2])),
            color: new pc.Color(strokeData.color[0], strokeData.color[1], strokeData.color[2]),
            size: strokeData.size,
            tool: strokeData.tool
        });
    });

    console.log('Artwork loaded:', this.strokes.length, 'strokes');
};

ARPainting.prototype.getStats = function() {
    const totalPoints = this.strokes.reduce((sum, stroke) => sum + stroke.points.length, 0);

    console.log('Artwork Stats:');
    console.log('Strokes:', this.strokes.length);
    console.log('Total Points:', totalPoints);
    console.log('Current Color:', this.currentColor);
    console.log('Current Tool:', this.currentTool);
};
