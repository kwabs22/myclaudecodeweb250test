/** Music Composer - Create music by arranging markers */
var MusicComposer = pc.createScript('musicComposer');

MusicComposer.attributes.add('instrumentMarkerIDs', {
    type: 'number',
    array: true,
    default: [515, 516, 517, 518],
    description: 'Instrument markers (piano, drums, bass, synth)'
});

MusicComposer.attributes.add('sequencerMarkerID', {
    type: 'number',
    default: 519,
    description: 'Sequencer timeline marker'
});

MusicComposer.prototype.initialize = function() {
    this.instruments = {};
    this.sequencer = null;
    this.sequence = [];
    this.isPlaying = false;
    this.currentBeat = 0;
    this.bpm = 120;
    this.beatTimer = 0;

    this.instrumentTypes = {
        515: { name: 'Piano', sound: 'piano', color: new pc.Color(1, 1, 1) },
        516: { name: 'Drums', sound: 'drums', color: new pc.Color(0.6, 0.3, 0.2) },
        517: { name: 'Bass', sound: 'bass', color: new pc.Color(0.3, 0.5, 0.8) },
        518: { name: 'Synth', sound: 'synth', color: new pc.Color(0.8, 0.3, 0.8) }
    };

    this.setupAudio();
};

MusicComposer.prototype.setupAudio = function() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
};

MusicComposer.prototype.update = function(dt) {
    if (this.isPlaying) {
        this.beatTimer += dt;
        const beatInterval = 60 / this.bpm;

        if (this.beatTimer >= beatInterval) {
            this.beatTimer = 0;
            this.playBeat();
            this.currentBeat = (this.currentBeat + 1) % 16;
        }
    }
};

MusicComposer.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.instrumentMarkerIDs.includes(markerId)) {
        this.updateInstrument(markerId, pose);
    } else if (markerId === this.sequencerMarkerID) {
        this.updateSequencer(pose);
    }
};

MusicComposer.prototype.updateInstrument = function(markerId, pose) {
    if (!this.instruments[markerId]) {
        this.createInstrument(markerId);
    }

    this.instruments[markerId].entity.setPosition(pose.position);
    this.recordNote(markerId, pose.position);
};

MusicComposer.prototype.createInstrument = function(markerId) {
    const instrumentData = this.instrumentTypes[markerId];

    const instrument = new pc.Entity('Instrument_' + instrumentData.name);
    this.entity.addChild(instrument);

    instrument.addComponent('model', { type: 'box' });
    instrument.setLocalScale(0.06, 0.06, 0.06);

    if (instrument.model && instrument.model.meshInstances[0]) {
        instrument.model.meshInstances[0].material.diffuse = instrumentData.color;
        instrument.model.meshInstances[0].material.update();
    }

    this.instruments[markerId] = {
        entity: instrument,
        type: instrumentData
    };

    console.log('Instrument:', instrumentData.name);
};

MusicComposer.prototype.recordNote = function(instrumentId, position) {
    const beat = Math.floor((position.x + 0.5) / 0.1) % 16;

    this.sequence[beat] = this.sequence[beat] || [];

    if (!this.sequence[beat].includes(instrumentId)) {
        this.sequence[beat].push(instrumentId);
        console.log('Recorded', this.instrumentTypes[instrumentId].name, 'at beat', beat);
    }
};

MusicComposer.prototype.playBeat = function() {
    const notes = this.sequence[this.currentBeat];

    if (notes) {
        notes.forEach(instrumentId => {
            this.playInstrument(instrumentId);
        });
    }
};

MusicComposer.prototype.playInstrument = function(instrumentId) {
    if (!this.audioContext) return;

    const instrument = this.instrumentTypes[instrumentId];
    console.log('Playing:', instrument.name);

    // Simple tone generation
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    const frequencies = {
        'piano': 440,
        'drums': 100,
        'bass': 110,
        'synth': 880
    };

    oscillator.frequency.value = frequencies[instrument.sound] || 440;
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
};

MusicComposer.prototype.togglePlayback = function() {
    this.isPlaying = !this.isPlaying;
    console.log('Playback', this.isPlaying ? 'started' : 'stopped');
};

MusicComposer.prototype.clearSequence = function() {
    this.sequence = [];
    this.currentBeat = 0;
    console.log('Sequence cleared');
};
