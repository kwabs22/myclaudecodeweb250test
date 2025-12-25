/** Astronomy Viewer - AR solar system and constellation explorer */
var AstronomyViewer = pc.createScript('astronomyViewer');

AstronomyViewer.attributes.add('planetMarkerIDs', {
    type: 'number',
    array: true,
    default: [280, 281, 282, 283, 284, 285, 286, 287, 288],
    description: 'Marker IDs for planets and sun'
});

AstronomyViewer.attributes.add('constellationMarkerIDs', {
    type: 'number',
    array: true,
    default: [289, 290, 291],
    description: 'Marker IDs for constellations'
});

AstronomyViewer.prototype.initialize = function() {
    this.planets = {};
    this.constellations = {};
    this.solarSystem = null;
    this.orbitSpeed = 1.0;
    this.timeElapsed = 0;

    this.celestialBodies = {
        280: { name: 'Sun', radius: 0.08, color: new pc.Color(1, 0.9, 0.2), distance: 0, period: 0 },
        281: { name: 'Mercury', radius: 0.015, color: new pc.Color(0.7, 0.7, 0.7), distance: 0.12, period: 0.24 },
        282: { name: 'Venus', radius: 0.025, color: new pc.Color(0.9, 0.7, 0.4), distance: 0.16, period: 0.62 },
        283: { name: 'Earth', radius: 0.025, color: new pc.Color(0.2, 0.5, 1), distance: 0.20, period: 1.0 },
        284: { name: 'Mars', radius: 0.02, color: new pc.Color(0.9, 0.3, 0.2), distance: 0.25, period: 1.88 },
        285: { name: 'Jupiter', radius: 0.06, color: new pc.Color(0.8, 0.7, 0.5), distance: 0.35, period: 11.86 },
        286: { name: 'Saturn', radius: 0.05, color: new pc.Color(0.9, 0.8, 0.6), distance: 0.45, period: 29.46 },
        287: { name: 'Uranus', radius: 0.04, color: new pc.Color(0.5, 0.8, 0.9), distance: 0.55, period: 84.01 },
        288: { name: 'Neptune', radius: 0.04, color: new pc.Color(0.3, 0.4, 1), distance: 0.65, period: 164.8 }
    };

    this.constellationData = {
        289: { name: 'Orion', stars: 7, description: 'The Hunter - visible in winter' },
        290: { name: 'Ursa Major', stars: 7, description: 'The Great Bear - contains Big Dipper' },
        291: { name: 'Cassiopeia', stars: 5, description: 'The Queen - W-shaped constellation' }
    };

    this.facts = {
        'Sun': 'The Sun is 109 times wider than Earth',
        'Earth': 'The only planet known to harbor life',
        'Jupiter': 'Largest planet, has 79 known moons',
        'Saturn': 'Famous for its spectacular ring system',
        'Mars': 'Known as the Red Planet'
    };
};

HistoryTimeline.prototype.update = function(dt) {
    this.timeElapsed += dt * this.orbitSpeed;

    // Update planetary positions
    Object.values(this.planets).forEach(planet => {
        if (planet.data.period > 0) {
            this.updateOrbit(planet, this.timeElapsed);
        }
    });
};

AstronomyViewer.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.planetMarkerIDs.includes(markerId)) {
        this.showPlanet(markerId, pose);
    } else if (this.constellationMarkerIDs.includes(markerId)) {
        this.showConstellation(markerId, pose);
    }
};

AstronomyViewer.prototype.showPlanet = function(markerId, pose) {
    const bodyData = this.celestialBodies[markerId];
    if (!bodyData) return;

    if (!this.planets[markerId]) {
        this.createCelestialBody(markerId, bodyData);
    }

    // Position at marker or in orbit
    if (bodyData.name === 'Sun') {
        this.planets[markerId].entity.setPosition(pose.position);
        this.solarSystem = this.planets[markerId].entity;
    } else {
        if (!this.solarSystem) {
            this.planets[markerId].entity.setPosition(pose.position);
        }
    }

    this.displayBodyInfo(bodyData);
};

AstronomyViewer.prototype.createCelestialBody = function(markerId, data) {
    const body = new pc.Entity('CelestialBody_' + data.name);

    if (data.name === 'Sun' || !this.solarSystem) {
        this.entity.addChild(body);
    } else {
        this.solarSystem.addChild(body);
    }

    body.addComponent('model', { type: 'sphere' });
    body.setLocalScale(data.radius, data.radius, data.radius);

    if (body.model && body.model.meshInstances[0]) {
        body.model.meshInstances[0].material.diffuse = data.color;

        // Make sun glow
        if (data.name === 'Sun') {
            body.model.meshInstances[0].material.emissive = new pc.Color(1, 0.8, 0);
        }

        body.model.meshInstances[0].material.update();
    }

    // Add orbit path visualization
    if (data.distance > 0) {
        this.createOrbitPath(body.parent, data.distance);
    }

    // Add rings for Saturn
    if (data.name === 'Saturn') {
        this.createRings(body);
    }

    this.planets[markerId] = {
        entity: body,
        data: data,
        angle: Math.random() * Math.PI * 2 // Random starting position
    };

    console.log('Celestial Body:', data.name);
};

AstronomyViewer.prototype.createOrbitPath = function(parent, radius) {
    const orbitPath = new pc.Entity('OrbitPath');
    parent.addChild(orbitPath);

    orbitPath.addComponent('model', { type: 'torus' });
    orbitPath.setLocalScale(radius, radius * 0.01, radius);
    orbitPath.setLocalEulerAngles(90, 0, 0);

    if (orbitPath.model && orbitPath.model.meshInstances[0]) {
        orbitPath.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 0.3, 0.3);
        orbitPath.model.meshInstances[0].material.opacity = 0.3;
        orbitPath.model.meshInstances[0].material.blendType = pc.BLEND_NORMAL;
        orbitPath.model.meshInstances[0].material.update();
    }
};

AstronomyViewer.prototype.createRings = function(parent) {
    const rings = new pc.Entity('Rings');
    parent.addChild(rings);

    rings.addComponent('model', { type: 'torus' });
    rings.setLocalScale(1.5, 0.1, 1.5);
    rings.setLocalEulerAngles(75, 0, 0);

    if (rings.model && rings.model.meshInstances[0]) {
        rings.model.meshInstances[0].material.diffuse = new pc.Color(0.8, 0.7, 0.5);
        rings.model.meshInstances[0].material.opacity = 0.6;
        rings.model.meshInstances[0].material.blendType = pc.BLEND_NORMAL;
        rings.model.meshInstances[0].material.update();
    }
};

AstronomyViewer.prototype.updateOrbit = function(planet, time) {
    const data = planet.data;

    // Calculate orbital position
    const angularSpeed = (2 * Math.PI) / (data.period * 10); // Scale time
    planet.angle = time * angularSpeed;

    const x = Math.cos(planet.angle) * data.distance;
    const z = Math.sin(planet.angle) * data.distance;

    planet.entity.setLocalPosition(x, 0, z);

    // Rotate planet on its axis
    const currentRot = planet.entity.getLocalEulerAngles();
    planet.entity.setLocalEulerAngles(0, currentRot.y + 50 * time, 0);
};

AstronomyViewer.prototype.displayBodyInfo = function(data) {
    console.log('═══════════════════════════════════');
    console.log('Planet:', data.name);
    console.log('Radius:', (data.radius * 100).toFixed(1), 'units');

    if (data.distance > 0) {
        console.log('Distance from Sun:', (data.distance * 100).toFixed(1), 'units');
        console.log('Orbital Period:', data.period, 'Earth years');
    }

    const fact = this.facts[data.name];
    if (fact) {
        console.log('Fact:', fact);
    }

    console.log('═══════════════════════════════════');
};

AstronomyViewer.prototype.showConstellation = function(markerId, pose) {
    const constData = this.constellationData[markerId];
    if (!constData) return;

    if (!this.constellations[markerId]) {
        this.createConstellation(markerId, constData);
    }

    this.constellations[markerId].setPosition(pose.position);
    this.displayConstellationInfo(constData);
};

AstronomyViewer.prototype.createConstellation = function(markerId, data) {
    const constellation = new pc.Entity('Constellation_' + data.name);
    this.entity.addChild(constellation);

    // Create stars
    for (let i = 0; i < data.stars; i++) {
        const star = new pc.Entity('Star_' + i);
        constellation.addChild(star);

        star.addComponent('model', { type: 'sphere' });
        star.setLocalScale(0.01, 0.01, 0.01);

        // Random positions to form constellation pattern
        const angle = (i / data.stars) * Math.PI * 2;
        const radius = 0.05 + Math.random() * 0.03;
        const x = Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * 0.04;
        const z = Math.sin(angle) * radius;

        star.setLocalPosition(x, y, z);

        if (star.model && star.model.meshInstances[0]) {
            star.model.meshInstances[0].material.diffuse = new pc.Color(1, 1, 1);
            star.model.meshInstances[0].material.emissive = new pc.Color(0.9, 0.9, 1);
            star.model.meshInstances[0].material.update();
        }
    }

    this.constellations[markerId] = constellation;
};

AstronomyViewer.prototype.displayConstellationInfo = function(data) {
    console.log('✨ Constellation:', data.name);
    console.log('Stars:', data.stars);
    console.log('Description:', data.description);
};

AstronomyViewer.prototype.setOrbitSpeed = function(speed) {
    this.orbitSpeed = speed;
    console.log('Orbit speed set to', speed + 'x');
};

AstronomyViewer.prototype.showAllPlanets = function() {
    console.log('Solar System Overview:');
    console.log('════════════════════════════════════════');

    Object.values(this.celestialBodies).forEach(body => {
        const sizeStr = (body.radius * 100).toFixed(1);
        const distStr = body.distance > 0 ? (body.distance * 100).toFixed(1) + ' AU' : 'Center';
        console.log(body.name.padEnd(10) + ' - Size: ' + sizeStr + ' - Distance: ' + distStr);
    });
};
