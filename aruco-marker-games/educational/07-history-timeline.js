/** History Timeline - Interactive AR historical events timeline */
var HistoryTimeline = pc.createScript('historyTimeline');

HistoryTimeline.attributes.add('eventMarkerIDs', {
    type: 'number',
    array: true,
    default: [270, 271, 272, 273, 274, 275, 276, 277, 278, 279],
    description: 'Marker IDs for historical events'
});

HistoryTimeline.prototype.initialize = function() {
    this.events = {};
    this.timeline = null;
    this.selectedEvent = null;

    this.historicalEvents = {
        270: { year: -3000, era: 'BCE', event: 'Egyptian Pyramids Built', description: 'Construction of the Great Pyramid of Giza' },
        271: { year: -776, era: 'BCE', event: 'First Olympic Games', description: 'Ancient Olympic Games begin in Greece' },
        272: { year: 0, era: 'CE', event: 'Beginning of Common Era', description: 'Traditional year of Jesus birth' },
        273: { year: 1066, era: 'CE', event: 'Norman Conquest', description: 'Battle of Hastings, William conquers England' },
        274: { year: 1492, era: 'CE', event: 'Columbus Reaches Americas', description: 'Christopher Columbus sails to the New World' },
        275: { year: 1776, era: 'CE', event: 'American Independence', description: 'Declaration of Independence signed' },
        276: { year: 1789, era: 'CE', event: 'French Revolution', description: 'Fall of the Bastille, revolution begins' },
        277: { year: 1969, era: 'CE', event: 'Moon Landing', description: 'Apollo 11 astronauts land on the Moon' },
        278: { year: 1989, era: 'CE', event: 'Fall of Berlin Wall', description: 'Symbol of Cold War comes down' },
        279: { year: 2000, era: 'CE', event: 'New Millennium', description: 'Start of the 21st century' }
    };

    this.createTimeline();
};

HistoryTimeline.prototype.createTimeline = function() {
    this.timeline = new pc.Entity('Timeline');
    this.entity.addChild(this.timeline);

    // Create timeline base
    const base = new pc.Entity('TimelineBase');
    this.timeline.addChild(base);
    base.addComponent('model', { type: 'box' });
    base.setLocalScale(0.5, 0.01, 0.02);

    if (base.model && base.model.meshInstances[0]) {
        base.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 0.3, 0.3);
        base.model.meshInstances[0].material.update();
    }
};

HistoryTimeline.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.eventMarkerIDs.includes(markerId)) {
        this.showEvent(markerId, pose);
    }
};

HistoryTimeline.prototype.showEvent = function(markerId, pose) {
    const eventData = this.historicalEvents[markerId];
    if (!eventData) return;

    if (!this.events[markerId]) {
        this.createEventMarker(markerId, eventData);
    }

    this.events[markerId].entity.setPosition(pose.position);
    this.displayEventInfo(eventData);
    this.updateTimelinePosition(eventData);
};

HistoryTimeline.prototype.createEventMarker = function(markerId, data) {
    const event = new pc.Entity('Event_' + data.event.replace(/\s+/g, '_'));
    this.entity.addChild(event);

    event.addComponent('model', { type: 'cylinder' });
    event.setLocalScale(0.04, 0.06, 0.04);

    // Color based on era
    const color = this.getEraColor(data.year);

    if (event.model && event.model.meshInstances[0]) {
        event.model.meshInstances[0].material.diffuse = color;
        event.model.meshInstances[0].material.update();
    }

    // Add year label (as a small sphere on top)
    const label = new pc.Entity('YearLabel');
    event.addChild(label);
    label.addComponent('model', { type: 'sphere' });
    label.setLocalScale(0.3, 0.3, 0.3);
    label.setLocalPosition(0, 1.2, 0);

    this.events[markerId] = {
        entity: event,
        data: data,
        markerId: markerId
    };
};

HistoryTimeline.prototype.getEraColor = function(year) {
    if (year < 0) {
        return new pc.Color(0.8, 0.6, 0.3); // Ancient - Bronze
    } else if (year < 500) {
        return new pc.Color(0.7, 0.3, 0.3); // Early CE - Red
    } else if (year < 1500) {
        return new pc.Color(0.3, 0.5, 0.7); // Medieval - Blue
    } else if (year < 1800) {
        return new pc.Color(0.5, 0.7, 0.3); // Early Modern - Green
    } else if (year < 1900) {
        return new pc.Color(0.7, 0.5, 0.7); // Industrial - Purple
    } else {
        return new pc.Color(0.9, 0.9, 0.3); // Modern - Yellow
    }
};

HistoryTimeline.prototype.displayEventInfo = function(data) {
    const yearDisplay = data.year < 0 ? Math.abs(data.year) + ' ' + data.era : data.year + ' ' + data.era;

    console.log('╔════════════════════════════════════╗');
    console.log('  Year: ' + yearDisplay);
    console.log('  Event: ' + data.event);
    console.log('  ' + data.description);
    console.log('╚════════════════════════════════════╝');
};

HistoryTimeline.prototype.updateTimelinePosition = function(eventData) {
    if (!this.timeline) return;

    // Position timeline based on current event
    const normalizedYear = this.normalizeYear(eventData.year);
    const xPos = (normalizedYear - 0.5) * 0.5;

    this.timeline.setLocalPosition(xPos, 0, 0.1);
};

HistoryTimeline.prototype.normalizeYear = function(year) {
    // Normalize year to 0-1 range
    const minYear = -3000;
    const maxYear = 2000;
    return (year - minYear) / (maxYear - minYear);
};

HistoryTimeline.prototype.sortEventsByDate = function() {
    const sorted = Object.values(this.historicalEvents).sort((a, b) => a.year - b.year);

    console.log('Historical Timeline:');
    console.log('══════════════════════════════════════');

    sorted.forEach(event => {
        const yearStr = event.year < 0 ? Math.abs(event.year) + ' BCE' : event.year + ' CE';
        console.log(yearStr.padEnd(12) + ' - ' + event.event);
    });

    return sorted;
};

HistoryTimeline.prototype.getEventsBetween = function(startYear, endYear) {
    return Object.values(this.historicalEvents).filter(event => {
        return event.year >= startYear && event.year <= endYear;
    });
};

HistoryTimeline.prototype.getEventsByEra = function(era) {
    return Object.values(this.historicalEvents).filter(event => {
        return event.era === era;
    });
};

HistoryTimeline.prototype.quizMode = function() {
    const events = Object.values(this.historicalEvents);
    const randomEvent = events[Math.floor(Math.random() * events.length)];

    console.log('Quiz: What year did this happen?');
    console.log('Event:', randomEvent.event);

    return {
        event: randomEvent.event,
        correctYear: randomEvent.year,
        era: randomEvent.era
    };
};

HistoryTimeline.prototype.checkQuizAnswer = function(userYear, quiz) {
    const correct = Math.abs(userYear - quiz.correctYear) <= 5; // Allow 5 year margin

    if (correct) {
        console.log('✓ Correct! The event occurred in', quiz.correctYear, quiz.era);
    } else {
        console.log('✗ Not quite. The event occurred in', quiz.correctYear, quiz.era);
        console.log('Your answer:', userYear);
    }

    return correct;
};
