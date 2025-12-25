/** Music Theory - AR music education with scales, chords, and notation */
var MusicTheory = pc.createScript('musicTheory');

MusicTheory.attributes.add('noteMarkerIDs', {
    type: 'number',
    array: true,
    default: [292, 293, 294, 295, 296, 297, 298, 299],
    description: 'Marker IDs for musical notes (C, D, E, F, G, A, B, C)'
});

MusicTheory.attributes.add('chordMarkerIDs', {
    type: 'number',
    array: true,
    default: [300, 301, 302],
    description: 'Marker IDs for chord types (Major, Minor, Diminished)'
});

MusicTheory.prototype.initialize = function() {
    this.notes = {};
    this.chords = {};
    this.scale = [];
    this.currentChord = null;
    this.audioContext = null;

    this.noteData = {
        292: { name: 'C', frequency: 261.63, degree: 1, color: new pc.Color(1, 0.3, 0.3) },
        293: { name: 'D', frequency: 293.66, degree: 2, color: new pc.Color(1, 0.6, 0.3) },
        294: { name: 'E', frequency: 329.63, degree: 3, color: new pc.Color(1, 1, 0.3) },
        295: { name: 'F', frequency: 349.23, degree: 4, color: new pc.Color(0.3, 1, 0.3) },
        296: { name: 'G', frequency: 392.00, degree: 5, color: new pc.Color(0.3, 1, 1) },
        297: { name: 'A', frequency: 440.00, degree: 6, color: new pc.Color(0.3, 0.3, 1) },
        298: { name: 'B', frequency: 493.88, degree: 7, color: new pc.Color(0.6, 0.3, 1) },
        299: { name: 'C2', frequency: 523.25, degree: 8, color: new pc.Color(1, 0.3, 0.3) }
    };

    this.chordTypes = {
        300: { name: 'Major', intervals: [0, 4, 7], description: 'Happy, bright sound' },
        301: { name: 'Minor', intervals: [0, 3, 7], description: 'Sad, dark sound' },
        302: { name: 'Diminished', intervals: [0, 3, 6], description: 'Tense, unstable sound' }
    };

    this.scaleFormulas = {
        'Major': [2, 2, 1, 2, 2, 2, 1],
        'Minor': [2, 1, 2, 2, 1, 2, 2],
        'Pentatonic': [2, 2, 3, 2, 3]
    };

    this.setupAudio();
};

MusicTheory.prototype.setupAudio = function() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
};

MusicTheory.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.noteMarkerIDs.includes(markerId)) {
        this.showNote(markerId, pose);
    } else if (this.chordMarkerIDs.includes(markerId)) {
        this.showChord(markerId, pose);
    }
};

MusicTheory.prototype.showNote = function(markerId, pose) {
    const noteInfo = this.noteData[markerId];
    if (!noteInfo) return;

    if (!this.notes[markerId]) {
        this.createNoteVisual(markerId, noteInfo);
    }

    this.notes[markerId].entity.setPosition(pose.position);
    this.playTone(noteInfo.frequency, 0.3);
    this.displayNoteInfo(noteInfo);

    // Check if forming a chord
    this.analyzeHarmony();
};

MusicTheory.prototype.createNoteVisual = function(markerId, noteInfo) {
    const note = new pc.Entity('Note_' + noteInfo.name);
    this.entity.addChild(note);

    // Create note head
    note.addComponent('model', { type: 'sphere' });
    note.setLocalScale(0.04, 0.04, 0.04);

    if (note.model && note.model.meshInstances[0]) {
        note.model.meshInstances[0].material.diffuse = noteInfo.color;
        note.model.meshInstances[0].material.update();
    }

    // Create staff line
    const staff = new pc.Entity('Staff');
    note.addChild(staff);
    staff.addComponent('model', { type: 'box' });
    staff.setLocalScale(0.15, 0.005, 0.005);
    staff.setLocalPosition(0, -0.02 * noteInfo.degree, 0);

    if (staff.model && staff.model.meshInstances[0]) {
        staff.model.meshInstances[0].material.diffuse = new pc.Color(0.2, 0.2, 0.2);
        staff.model.meshInstances[0].material.update();
    }

    this.notes[markerId] = {
        entity: note,
        data: noteInfo
    };
};

MusicTheory.prototype.displayNoteInfo = function(noteInfo) {
    console.log('♪ Note:', noteInfo.name);
    console.log('Frequency:', noteInfo.frequency.toFixed(2), 'Hz');
    console.log('Scale Degree:', noteInfo.degree);
};

MusicTheory.prototype.playTone = function(frequency, duration) {
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

MusicTheory.prototype.showChord = function(markerId, pose) {
    const chordType = this.chordTypes[markerId];
    if (!chordType) return;

    if (!this.chords[markerId]) {
        this.createChordVisual(markerId, chordType);
    }

    this.chords[markerId].setPosition(pose.position);
    this.playChord(chordType);
    this.displayChordInfo(chordType);
};

MusicTheory.prototype.createChordVisual = function(markerId, chordType) {
    const chord = new pc.Entity('Chord_' + chordType.name);
    this.entity.addChild(chord);

    // Create stacked notes
    chordType.intervals.forEach((interval, index) => {
        const noteEntity = new pc.Entity('ChordNote_' + index);
        chord.addChild(noteEntity);

        noteEntity.addComponent('model', { type: 'box' });
        noteEntity.setLocalScale(0.04, 0.01, 0.04);
        noteEntity.setLocalPosition(0, index * 0.02, 0);

        if (noteEntity.model && noteEntity.model.meshInstances[0]) {
            const hue = (interval / 12) * 360;
            const color = this.hueToColor(hue);
            noteEntity.model.meshInstances[0].material.diffuse = color;
            noteEntity.model.meshInstances[0].material.update();
        }
    });

    this.chords[markerId] = chord;
};

MusicTheory.prototype.playChord = function(chordType) {
    if (!this.audioContext) return;

    const rootFreq = 261.63; // C

    chordType.intervals.forEach((interval, index) => {
        const frequency = rootFreq * Math.pow(2, interval / 12);
        setTimeout(() => {
            this.playTone(frequency, 1.0);
        }, index * 50); // Slight arpeggio
    });
};

MusicTheory.prototype.displayChordInfo = function(chordType) {
    console.log('♫ Chord:', chordType.name);
    console.log('Intervals:', chordType.intervals.join(', '));
    console.log('Character:', chordType.description);
};

MusicTheory.prototype.analyzeHarmony = function() {
    const activeNotes = Object.values(this.notes).map(n => n.data.degree).sort();

    if (activeNotes.length >= 3) {
        // Check for common chords
        const intervals = this.calculateIntervals(activeNotes);

        if (this.matchesInterval(intervals, [4, 7])) {
            console.log('Detected: Major Chord');
        } else if (this.matchesInterval(intervals, [3, 7])) {
            console.log('Detected: Minor Chord');
        } else if (this.matchesInterval(intervals, [3, 6])) {
            console.log('Detected: Diminished Chord');
        }
    }
};

MusicTheory.prototype.calculateIntervals = function(degrees) {
    const root = degrees[0];
    return degrees.slice(1).map(deg => (deg - root) % 12);
};

MusicTheory.prototype.matchesInterval = function(intervals, pattern) {
    if (intervals.length < pattern.length) return false;

    for (let i = 0; i < pattern.length; i++) {
        if (intervals[i] !== pattern[i]) return false;
    }

    return true;
};

MusicTheory.prototype.buildScale = function(rootNote, scaleType) {
    const formula = this.scaleFormulas[scaleType];
    if (!formula) return;

    const scale = [rootNote];
    let currentNote = rootNote;

    formula.forEach(interval => {
        currentNote = (currentNote + interval) % 12;
        scale.push(currentNote);
    });

    this.scale = scale;

    console.log(scaleType, 'Scale starting from note', rootNote + ':');
    console.log(scale.join(' - '));

    return scale;
};

MusicTheory.prototype.teachInterval = function(interval) {
    const intervalNames = {
        0: 'Unison',
        1: 'Minor 2nd',
        2: 'Major 2nd',
        3: 'Minor 3rd',
        4: 'Major 3rd',
        5: 'Perfect 4th',
        6: 'Tritone',
        7: 'Perfect 5th',
        8: 'Minor 6th',
        9: 'Major 6th',
        10: 'Minor 7th',
        11: 'Major 7th',
        12: 'Octave'
    };

    const name = intervalNames[interval];

    console.log('Interval:', name);
    console.log('Semitones:', interval);

    // Play the interval
    const root = 261.63;
    const second = root * Math.pow(2, interval / 12);

    this.playTone(root, 0.5);
    setTimeout(() => this.playTone(second, 0.5), 600);
};

MusicTheory.prototype.hueToColor = function(hue) {
    const h = hue / 360;
    const s = 1;
    const l = 0.5;

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = this.hue2rgb(p, q, h + 1/3);
    const g = this.hue2rgb(p, q, h);
    const b = this.hue2rgb(p, q, h - 1/3);

    return new pc.Color(r, g, b);
};

MusicTheory.prototype.hue2rgb = function(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
};

MusicTheory.prototype.quizMode = function() {
    const intervals = [1, 2, 3, 4, 5, 7, 12];
    const randomInterval = intervals[Math.floor(Math.random() * intervals.length)];

    const root = 261.63;
    const second = root * Math.pow(2, randomInterval / 12);

    this.playTone(root, 0.5);
    setTimeout(() => this.playTone(second, 0.5), 600);

    console.log('Quiz: What interval is this?');

    return { correctInterval: randomInterval };
};
