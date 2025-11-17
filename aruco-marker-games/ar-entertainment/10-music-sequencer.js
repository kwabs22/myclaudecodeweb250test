/** Music Sequencer - Create music by arranging physical markers */
var MusicSequencer = pc.createScript('musicSequencer');

MusicSequencer.attributes.add('noteMarkerIDs', {
    type: 'number',
    array: true,
    default: [60, 61, 62, 63, 64, 65, 66, 67],
    description: 'Marker IDs for musical notes (C, D, E, F, G, A, B, C)'
});

MusicSequencer.attributes.add('bpm', {
    type: 'number',
    default: 120,
    description: 'Beats per minute'
});

MusicSequencer.attributes.add('sequenceLength', {
    type: 'number',
    default: 16,
    description: 'Number of beats in sequence'
});

MusicSequencer.prototype.initialize = function() {
    this.notes = {};
    this.sequence = [];
    this.currentBeat = 0;
    this.isPlaying = false;
    this.beatTimer = 0;
    this.beatInterval = 60 / this.bpm;

    this.noteFrequencies = {
        60: 261.63, // C
        61: 293.66, // D
        62: 329.63, // E
        63: 349.23, // F
        64: 392.00, // G
        65: 440.00, // A
        66: 493.88, // B
        67: 523.25  // C (high)
    };

    this.noteNames = {
        60: 'C', 61: 'D', 62: 'E', 63: 'F',
        64: 'G', 65: 'A', 66: 'B', 67: 'C2'
    };

    this.initializeSequence();
    this.setupAudio();
};

MusicSequencer.prototype.setupAudio = function() {
    // Initialize Web Audio API
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
};

MusicSequencer.prototype.initializeSequence = function() {
    for (let i = 0; i < this.sequenceLength; i++) {
        this.sequence[i] = {
            beat: i,
            notes: [],
            markers: []
        };
    }
};

MusicSequencer.prototype.update = function(dt) {
    if (this.isPlaying) {
        this.beatTimer += dt;

        if (this.beatTimer >= this.beatInterval) {
            this.beatTimer = 0;
            this.playBeat();
            this.currentBeat = (this.currentBeat + 1) % this.sequenceLength;
            this.highlightCurrentBeat();
        }
    }
};

MusicSequencer.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.noteMarkerIDs.includes(markerId)) {
        this.updateNoteMarker(markerId, pose);
    }
};

MusicSequencer.prototype.updateNoteMarker = function(markerId, pose) {
    if (!this.notes[markerId]) {
        this.createNoteVisual(markerId);
    }

    const note = this.notes[markerId];
    note.setPosition(pose.position);

    // Determine which beat this marker is in based on x-position
    const beatIndex = this.positionToBeat(pose.position.x);
    this.assignNoteToBeat(markerId, beatIndex);
};

MusicSequencer.prototype.createNoteVisual = function(markerId) {
    const note = new pc.Entity('Note_' + this.noteNames[markerId]);
    this.entity.addChild(note);
    note.addComponent('model', { type: 'cylinder' });
    note.setLocalScale(0.03, 0.05, 0.03);

    // Color based on note
    const hue = ((markerId - 60) / 8) * 360;
    const color = this.hslToRgb(hue, 1, 0.5);

    if (note.model && note.model.meshInstances[0]) {
        note.model.meshInstances[0].material.diffuse = color;
        note.model.meshInstances[0].material.update();
    }

    this.notes[markerId] = note;
};

MusicSequencer.prototype.positionToBeat = function(xPosition) {
    // Map world position to beat index
    const beatWidth = 0.1;
    const startX = -this.sequenceLength * beatWidth / 2;
    const relativeX = xPosition - startX;
    const beatIndex = Math.floor(relativeX / beatWidth);

    return Math.max(0, Math.min(this.sequenceLength - 1, beatIndex));
};

MusicSequencer.prototype.assignNoteToBeat = function(markerId, beatIndex) {
    // Clear this marker from all beats
    this.sequence.forEach(beat => {
        const idx = beat.markers.indexOf(markerId);
        if (idx !== -1) {
            beat.markers.splice(idx, 1);
            beat.notes.splice(idx, 1);
        }
    });

    // Assign to new beat
    if (!this.sequence[beatIndex].markers.includes(markerId)) {
        this.sequence[beatIndex].markers.push(markerId);
        this.sequence[beatIndex].notes.push(this.noteFrequencies[markerId]);
    }
};

MusicSequencer.prototype.playBeat = function() {
    const beat = this.sequence[this.currentBeat];

    beat.notes.forEach(frequency => {
        this.playNote(frequency, this.beatInterval);
    });

    if (beat.notes.length > 0) {
        console.log('Beat', this.currentBeat, ':', beat.markers.map(id => this.noteNames[id]).join(', '));
    }
};

MusicSequencer.prototype.playNote = function(frequency, duration) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
};

MusicSequencer.prototype.highlightCurrentBeat = function() {
    // Visual feedback for current beat
    console.log('Current beat:', this.currentBeat);
};

MusicSequencer.prototype.togglePlayback = function() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
        console.log('Playback started');
    } else {
        console.log('Playback stopped');
        this.currentBeat = 0;
    }
};

MusicSequencer.prototype.hslToRgb = function(h, s, l) {
    h /= 360;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = this.hueToRgb(p, q, h + 1/3);
    const g = this.hueToRgb(p, q, h);
    const b = this.hueToRgb(p, q, h - 1/3);
    return new pc.Color(r, g, b);
};

MusicSequencer.prototype.hueToRgb = function(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
};

MusicSequencer.prototype.clearSequence = function() {
    this.sequence.forEach(beat => {
        beat.markers = [];
        beat.notes = [];
    });
    console.log('Sequence cleared');
};
