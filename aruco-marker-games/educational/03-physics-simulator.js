/** Physics Simulator - AR physics experiments and simulations */
var PhysicsSimulator = pc.createScript('physicsSimulator');

PhysicsSimulator.attributes.add('objectMarkerIDs', {
    type: 'number',
    array: true,
    default: [230, 231, 232, 233, 234],
    description: 'Marker IDs for physical objects'
});

PhysicsSimulator.attributes.add('forceMarkerIDs', {
    type: 'number',
    array: true,
    default: [235, 236, 237],
    description: 'Marker IDs for forces (gravity, push, magnetism)'
});

PhysicsSimulator.prototype.initialize = function() {
    this.objects = {};
    this.forces = {};
    this.gravity = new pc.Vec3(0, -9.81, 0);
    this.simulationActive = true;
    this.timeScale = 1.0;

    this.objectTypes = {
        230: { name: 'Ball', mass: 1, friction: 0.3, bounce: 0.7, shape: 'sphere' },
        231: { name: 'Box', mass: 2, friction: 0.5, bounce: 0.2, shape: 'box' },
        232: { name: 'Cylinder', mass: 1.5, friction: 0.4, bounce: 0.4, shape: 'cylinder' },
        233: { name: 'Feather', mass: 0.1, friction: 0.1, bounce: 0.1, shape: 'cone' },
        234: { name: 'Boulder', mass: 10, friction: 0.8, bounce: 0.1, shape: 'sphere' }
    };

    this.forceTypes = {
        235: 'gravity',
        236: 'push',
        237: 'magnetism'
    };
};

PhysicsSimulator.prototype.update = function(dt) {
    if (!this.simulationActive) return;

    const scaledDt = dt * this.timeScale;

    // Update physics for all objects
    Object.values(this.objects).forEach(obj => {
        this.updateObjectPhysics(obj, scaledDt);
    });

    // Apply active forces
    this.applyForces(scaledDt);

    // Check collisions
    this.checkCollisions();
};

PhysicsSimulator.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.objectMarkerIDs.includes(markerId)) {
        this.updateObject(markerId, pose);
    } else if (this.forceMarkerIDs.includes(markerId)) {
        this.updateForce(markerId, pose);
    }
};

PhysicsSimulator.prototype.updateObject = function(markerId, pose) {
    if (!this.objects[markerId]) {
        this.createPhysicsObject(markerId, pose);
    } else {
        // Update position from marker (user is moving it)
        const obj = this.objects[markerId];
        const newPos = pose.position;

        // Calculate velocity from position change
        const oldPos = obj.entity.getPosition();
        obj.velocity = newPos.clone().sub(oldPos).mulScalar(60); // Assuming 60 fps

        obj.entity.setPosition(newPos);
        obj.userControlled = true;
    }
};

PhysicsSimulator.prototype.createPhysicsObject = function(markerId, pose) {
    const objType = this.objectTypes[markerId];
    if (!objType) return;

    const entity = new pc.Entity(objType.name);
    this.entity.addChild(entity);
    entity.setPosition(pose.position);

    entity.addComponent('model', { type: objType.shape });
    entity.setLocalScale(0.05, 0.05, 0.05);

    // Color based on mass (heavier = darker)
    const colorValue = 1 - (objType.mass / 12);
    const color = new pc.Color(colorValue, colorValue, colorValue);

    if (entity.model && entity.model.meshInstances[0]) {
        entity.model.meshInstances[0].material.diffuse = color;
        entity.model.meshInstances[0].material.update();
    }

    this.objects[markerId] = {
        entity: entity,
        type: objType,
        velocity: new pc.Vec3(0, 0, 0),
        acceleration: new pc.Vec3(0, 0, 0),
        angularVelocity: new pc.Vec3(0, 0, 0),
        mass: objType.mass,
        onGround: false,
        userControlled: false
    };

    console.log('Created', objType.name, '- Mass:', objType.mass + 'kg');
};

PhysicsSimulator.prototype.updateObjectPhysics = function(obj, dt) {
    if (obj.userControlled) {
        obj.userControlled = false;
        return;
    }

    // Apply gravity
    const gravityForce = this.gravity.clone().mulScalar(obj.mass);
    obj.acceleration = gravityForce.clone().mulScalar(1 / obj.mass);

    // Update velocity
    obj.velocity.add(obj.acceleration.clone().mulScalar(dt));

    // Apply air resistance
    const airResistance = 0.02;
    obj.velocity.mulScalar(1 - airResistance);

    // Update position
    const newPos = obj.entity.getPosition().clone().add(obj.velocity.clone().mulScalar(dt));
    obj.entity.setPosition(newPos);

    // Ground collision
    if (newPos.y < 0) {
        newPos.y = 0;
        obj.entity.setPosition(newPos);

        // Bounce
        obj.velocity.y = -obj.velocity.y * obj.type.bounce;

        // Apply friction
        obj.velocity.x *= (1 - obj.type.friction * dt);
        obj.velocity.z *= (1 - obj.type.friction * dt);

        obj.onGround = true;

        // Stop if moving very slowly
        if (Math.abs(obj.velocity.y) < 0.01) {
            obj.velocity.y = 0;
        }
    } else {
        obj.onGround = false;
    }

    // Update rotation based on angular velocity
    obj.angularVelocity.x = -obj.velocity.z * 10;
    obj.angularVelocity.z = obj.velocity.x * 10;

    const currentRot = obj.entity.getLocalEulerAngles();
    obj.entity.setLocalEulerAngles(
        currentRot.x + obj.angularVelocity.x * dt,
        currentRot.y + obj.angularVelocity.y * dt,
        currentRot.z + obj.angularVelocity.z * dt
    );
};

PhysicsSimulator.prototype.updateForce = function(markerId, pose) {
    const forceType = this.forceTypes[markerId];
    if (!forceType) return;

    if (!this.forces[markerId]) {
        this.createForceVisual(markerId, forceType);
    }

    this.forces[markerId].position = pose.position;
    this.forces[markerId].entity.setPosition(pose.position);
};

PhysicsSimulator.prototype.createForceVisual = function(markerId, forceType) {
    const entity = new pc.Entity('Force_' + forceType);
    this.entity.addChild(entity);

    entity.addComponent('model', { type: 'sphere' });
    entity.setLocalScale(0.03, 0.03, 0.03);

    const colors = {
        'gravity': new pc.Color(0.5, 0, 0.8),
        'push': new pc.Color(1, 0.5, 0),
        'magnetism': new pc.Color(0.2, 0.5, 1)
    };

    if (entity.model && entity.model.meshInstances[0]) {
        entity.model.meshInstances[0].material.diffuse = colors[forceType];
        entity.model.meshInstances[0].material.update();
    }

    this.forces[markerId] = {
        entity: entity,
        type: forceType,
        position: new pc.Vec3(),
        strength: 5.0
    };
};

PhysicsSimulator.prototype.applyForces = function(dt) {
    Object.values(this.forces).forEach(force => {
        Object.values(this.objects).forEach(obj => {
            const distance = obj.entity.getPosition().distance(force.position);

            if (distance < 0.5) { // Force radius
                switch(force.type) {
                    case 'gravity':
                        this.applyGravityForce(obj, force, distance, dt);
                        break;
                    case 'push':
                        this.applyPushForce(obj, force, distance, dt);
                        break;
                    case 'magnetism':
                        this.applyMagnetismForce(obj, force, distance, dt);
                        break;
                }
            }
        });
    });
};

PhysicsSimulator.prototype.applyGravityForce = function(obj, force, distance, dt) {
    // Inverse square law
    const strength = force.strength / (distance * distance + 0.01);
    const direction = force.position.clone().sub(obj.entity.getPosition()).normalize();
    obj.velocity.add(direction.mulScalar(strength * dt));
};

PhysicsSimulator.prototype.applyPushForce = function(obj, force, distance, dt) {
    // Push away from force
    const strength = force.strength / (distance + 0.01);
    const direction = obj.entity.getPosition().clone().sub(force.position).normalize();
    obj.velocity.add(direction.mulScalar(strength * dt));
};

PhysicsSimulator.prototype.applyMagnetismForce = function(obj, force, distance, dt) {
    // Attract or repel based on object properties
    const strength = force.strength / (distance * distance + 0.01);
    const direction = force.position.clone().sub(obj.entity.getPosition()).normalize();

    // Lighter objects are more affected
    const magneticResponse = 1 / obj.mass;
    obj.velocity.add(direction.mulScalar(strength * magneticResponse * dt));
};

PhysicsSimulator.prototype.checkCollisions = function() {
    const objects = Object.values(this.objects);

    for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
            const obj1 = objects[i];
            const obj2 = objects[j];

            const distance = obj1.entity.getPosition().distance(obj2.entity.getPosition());
            const collisionDist = 0.05; // Based on object scale

            if (distance < collisionDist) {
                this.resolveCollision(obj1, obj2);
            }
        }
    }
};

PhysicsSimulator.prototype.resolveCollision = function(obj1, obj2) {
    // Elastic collision formula
    const normal = obj2.entity.getPosition().clone().sub(obj1.entity.getPosition()).normalize();

    const relativeVelocity = obj1.velocity.clone().sub(obj2.velocity);
    const velocityAlongNormal = relativeVelocity.dot(normal);

    // Objects moving apart, ignore
    if (velocityAlongNormal > 0) return;

    // Calculate impulse
    const restitution = (obj1.type.bounce + obj2.type.bounce) / 2;
    const impulse = -(1 + restitution) * velocityAlongNormal;
    const impulseScalar = impulse / (1/obj1.mass + 1/obj2.mass);

    // Apply impulse
    const impulseVec = normal.clone().mulScalar(impulseScalar);
    obj1.velocity.add(impulseVec.clone().mulScalar(1/obj1.mass));
    obj2.velocity.sub(impulseVec.clone().mulScalar(1/obj2.mass));

    // Separate objects
    const separation = normal.clone().mulScalar(0.051 - obj1.entity.getPosition().distance(obj2.entity.getPosition()));
    obj1.entity.setPosition(obj1.entity.getPosition().clone().sub(separation.clone().mulScalar(0.5)));
    obj2.entity.setPosition(obj2.entity.getPosition().clone().add(separation.clone().mulScalar(0.5)));
};

PhysicsSimulator.prototype.toggleSimulation = function() {
    this.simulationActive = !this.simulationActive;
    console.log('Simulation', this.simulationActive ? 'resumed' : 'paused');
};

PhysicsSimulator.prototype.setTimeScale = function(scale) {
    this.timeScale = Math.max(0.1, Math.min(5.0, scale));
    console.log('Time scale set to', this.timeScale + 'x');
};

PhysicsSimulator.prototype.resetObjects = function() {
    Object.values(this.objects).forEach(obj => {
        obj.velocity = new pc.Vec3(0, 0, 0);
        obj.acceleration = new pc.Vec3(0, 0, 0);
        obj.angularVelocity = new pc.Vec3(0, 0, 0);
    });
    console.log('Objects reset');
};
