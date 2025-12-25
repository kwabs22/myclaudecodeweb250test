/** Particle Art - Create art with particle systems */
var ParticleArt = pc.createScript('particleArt');

ParticleArt.attributes.add('emitterMarkerIDs', {
    type: 'number',
    array: true,
    default: [524, 525, 526],
    description: 'Particle emitter markers'
});

ParticleArt.attributes.add('styleMarkerIDs', {
    type: 'number',
    array: true,
    default: [527, 528, 529],
    description: 'Style markers (fire, water, sparkle)'
});

ParticleArt.prototype.initialize = function() {
    this.emitters = {};
    this.particles = [];
    this.currentStyle = 'fire';

    this.styles = {
        527: { name: 'fire', color: new pc.Color(1, 0.5, 0), speed: 0.3, lifetime: 1.0 },
        528: { name: 'water', color: new pc.Color(0.3, 0.5, 1), speed: 0.1, lifetime: 2.0 },
        529: { name: 'sparkle', color: new pc.Color(1, 1, 0.3), speed: 0.2, lifetime: 0.5 }
    };
};

ParticleArt.prototype.update = function(dt) {
    // Update existing particles
    this.particles = this.particles.filter(particle => {
        particle.life -= dt;

        if (particle.life <= 0) {
            if (particle.entity) particle.entity.destroy();
            return false;
        }

        // Move particle
        particle.position.add(particle.velocity.clone().mulScalar(dt));
        particle.entity.setPosition(particle.position);

        // Fade out
        const alpha = particle.life / particle.maxLife;
        particle.entity.setLocalScale(alpha * 0.02, alpha * 0.02, alpha * 0.02);

        return true;
    });

    // Emit from active emitters
    Object.values(this.emitters).forEach(emitter => {
        if (emitter.active) {
            this.emitParticles(emitter, dt);
        }
    });
};

ParticleArt.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.emitterMarkerIDs.includes(markerId)) {
        this.updateEmitter(markerId, pose);
    } else if (this.styleMarkerIDs.includes(markerId)) {
        this.selectStyle(markerId);
    }
};

ParticleArt.prototype.updateEmitter = function(markerId, pose) {
    if (!this.emitters[markerId]) {
        this.createEmitter(markerId);
    }

    this.emitters[markerId].position = pose.position.clone();
    this.emitters[markerId].active = true;
};

ParticleArt.prototype.createEmitter = function(markerId) {
    this.emitters[markerId] = {
        position: new pc.Vec3(),
        style: this.currentStyle,
        active: false,
        emitTimer: 0
    };
};

ParticleArt.prototype.emitParticles = function(emitter, dt) {
    emitter.emitTimer += dt;

    if (emitter.emitTimer >= 0.05) { // Emit every 50ms
        emitter.emitTimer = 0;

        const style = this.styles[Object.keys(this.styles).find(key => this.styles[key].name === emitter.style)];
        if (!style) return;

        const particle = this.createParticle(emitter.position, style);
        this.particles.push(particle);
    }
};

ParticleArt.prototype.createParticle = function(position, style) {
    const entity = new pc.Entity('Particle');
    this.entity.addChild(entity);

    entity.addComponent('model', { type: 'sphere' });
    entity.setPosition(position.clone());
    entity.setLocalScale(0.02, 0.02, 0.02);

    if (entity.model && entity.model.meshInstances[0]) {
        entity.model.meshInstances[0].material.diffuse = style.color.clone();
        entity.model.meshInstances[0].material.emissive = style.color.clone().mulScalar(0.5);
        entity.model.meshInstances[0].material.update();
    }

    const randomDir = new pc.Vec3(
        (Math.random() - 0.5) * 2,
        Math.random(),
        (Math.random() - 0.5) * 2
    ).normalize();

    return {
        entity: entity,
        position: position.clone(),
        velocity: randomDir.mulScalar(style.speed),
        life: style.lifetime,
        maxLife: style.lifetime
    };
};

ParticleArt.prototype.selectStyle = function(markerId) {
    const style = this.styles[markerId];
    if (style) {
        this.currentStyle = style.name;
        console.log('Selected style:', style.name);
    }
};

ParticleArt.prototype.clearParticles = function() {
    this.particles.forEach(p => p.entity.destroy());
    this.particles = [];
    console.log('Particles cleared');
};
