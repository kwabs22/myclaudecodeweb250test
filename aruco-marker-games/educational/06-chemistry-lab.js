/** Chemistry Lab - AR chemistry experiments and molecular visualization */
var ChemistryLab = pc.createScript('chemistryLab');

ChemistryLab.attributes.add('elementMarkerIDs', {
    type: 'number',
    array: true,
    default: [260, 261, 262, 263, 264, 265, 266, 267],
    description: 'Marker IDs for chemical elements'
});

ChemistryLab.attributes.add('equipmentMarkerIDs', {
    type: 'number',
    array: true,
    default: [268, 269],
    description: 'Marker IDs for lab equipment (beaker, burner)'
});

ChemistryLab.prototype.initialize = function() {
    this.elements = {};
    this.molecules = [];
    this.equipment = {};
    this.reactions = [];
    this.experimentsCompleted = 0;

    this.periodicTable = {
        260: { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, color: new pc.Color(0.9, 0.9, 0.9) },
        261: { symbol: 'O', name: 'Oxygen', atomicNumber: 8, color: new pc.Color(1, 0.3, 0.3) },
        262: { symbol: 'C', name: 'Carbon', atomicNumber: 6, color: new pc.Color(0.3, 0.3, 0.3) },
        263: { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, color: new pc.Color(0.3, 0.3, 1) },
        264: { symbol: 'Na', name: 'Sodium', atomicNumber: 11, color: new pc.Color(0.7, 0.5, 1) },
        265: { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, color: new pc.Color(0.3, 1, 0.3) },
        266: { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, color: new pc.Color(0.5, 1, 0.5) },
        267: { symbol: 'Fe', name: 'Iron', atomicNumber: 26, color: new pc.Color(0.6, 0.4, 0.2) }
    };

    this.reactionRules = [
        { reactants: ['H', 'H', 'O'], product: 'H2O', name: 'Water' },
        { reactants: ['Na', 'Cl'], product: 'NaCl', name: 'Table Salt' },
        { reactants: ['C', 'O', 'O'], product: 'CO2', name: 'Carbon Dioxide' },
        { reactants: ['Ca', 'C', 'O', 'O', 'O'], product: 'CaCO3', name: 'Calcium Carbonate' }
    ];
};

ChemistryLab.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.elementMarkerIDs.includes(markerId)) {
        this.showElement(markerId, pose);
    } else if (this.equipmentMarkerIDs.includes(markerId)) {
        this.showEquipment(markerId, pose);
    }
};

ChemistryLab.prototype.showElement = function(markerId, pose) {
    const elementData = this.periodicTable[markerId];
    if (!elementData) return;

    if (!this.elements[markerId]) {
        this.createElement(markerId, elementData);
    }

    this.elements[markerId].entity.setPosition(pose.position);
    this.checkForReaction();
};

ChemistryLab.prototype.createElement = function(markerId, data) {
    const atom = new pc.Entity('Atom_' + data.symbol);
    this.entity.addChild(atom);

    // Create nucleus
    atom.addComponent('model', { type: 'sphere' });
    const size = 0.02 + (data.atomicNumber * 0.001);
    atom.setLocalScale(size, size, size);

    if (atom.model && atom.model.meshInstances[0]) {
        atom.model.meshInstances[0].material.diffuse = data.color;
        atom.model.meshInstances[0].material.update();
    }

    // Create electron shells (simplified)
    this.createElectronShells(atom, data.atomicNumber);

    this.elements[markerId] = {
        entity: atom,
        data: data,
        markerId: markerId
    };

    console.log('Element:', data.name, '(' + data.symbol + ') - Atomic #' + data.atomicNumber);
};

ChemistryLab.prototype.createElectronShells = function(parent, atomicNumber) {
    const electronCounts = this.getElectronConfiguration(atomicNumber);

    electronCounts.forEach((count, shellIndex) => {
        const radius = 0.04 + (shellIndex * 0.02);

        for (let i = 0; i < count; i++) {
            const electron = new pc.Entity('Electron_' + shellIndex + '_' + i);
            parent.addChild(electron);

            electron.addComponent('model', { type: 'sphere' });
            electron.setLocalScale(0.005, 0.005, 0.005);

            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            electron.setLocalPosition(x, 0, z);

            if (electron.model && electron.model.meshInstances[0]) {
                electron.model.meshInstances[0].material.diffuse = new pc.Color(0.3, 0.8, 1);
                electron.model.meshInstances[0].material.update();
            }

            // Store for animation
            electron.userData = { angle: angle, radius: radius, speed: 1 + shellIndex * 0.5 };
        }
    });
};

ChemistryLab.prototype.getElectronConfiguration = function(atomicNumber) {
    // Simplified electron shell filling (2, 8, 8, 18, ...)
    const shells = [];
    let remaining = atomicNumber;

    const shellCapacities = [2, 8, 8, 18, 18];

    for (const capacity of shellCapacities) {
        if (remaining <= 0) break;
        const electronsInShell = Math.min(remaining, capacity);
        shells.push(electronsInShell);
        remaining -= electronsInShell;
    }

    return shells;
};

ChemistryLab.prototype.update = function(dt) {
    // Animate electrons orbiting
    Object.values(this.elements).forEach(element => {
        element.entity.children.forEach(child => {
            if (child.name.startsWith('Electron') && child.userData) {
                const data = child.userData;
                data.angle += data.speed * dt;

                const x = Math.cos(data.angle) * data.radius;
                const z = Math.sin(data.angle) * data.radius;
                child.setLocalPosition(x, 0, z);
            }
        });
    });
};

ChemistryLab.prototype.checkForReaction = function() {
    const activeElements = Object.values(this.elements);

    if (activeElements.length < 2) return;

    // Get symbols of all active elements
    const symbols = activeElements.map(el => el.data.symbol).sort();

    // Check against reaction rules
    for (const rule of this.reactionRules) {
        const ruleSymbols = rule.reactants.sort();

        if (this.arraysEqual(symbols, ruleSymbols)) {
            this.performReaction(rule);
            return;
        }
    }
};

ChemistryLab.prototype.arraysEqual = function(a, b) {
    if (a.length !== b.length) return false;
    const sortedA = a.slice().sort();
    const sortedB = b.slice().sort();
    return sortedA.every((val, index) => val === sortedB[index]);
};

ChemistryLab.prototype.performReaction = function(rule) {
    console.log('═══════════════════════════');
    console.log('Chemical Reaction Detected!');
    console.log('Reactants:', rule.reactants.join(' + '));
    console.log('Product:', rule.product, '(' + rule.name + ')');
    console.log('═══════════════════════════');

    this.createMolecule(rule.product, rule.name);
    this.experimentsCompleted++;

    // Clear reactant elements
    Object.values(this.elements).forEach(el => el.entity.destroy());
    this.elements = {};
};

ChemistryLab.prototype.createMolecule = function(formula, name) {
    const molecule = new pc.Entity('Molecule_' + formula);
    this.entity.addChild(molecule);

    molecule.addComponent('model', { type: 'box' });
    molecule.setLocalScale(0.08, 0.08, 0.08);

    if (molecule.model && molecule.model.meshInstances[0]) {
        molecule.model.meshInstances[0].material.diffuse = new pc.Color(0.5, 0.8, 0.3);
        molecule.model.meshInstances[0].material.update();
    }

    molecule.setPosition(0, 0.1, 0);

    this.molecules.push({ entity: molecule, formula: formula, name: name });

    // Fade out after 5 seconds
    setTimeout(() => {
        molecule.destroy();
        const index = this.molecules.findIndex(m => m.formula === formula);
        if (index !== -1) this.molecules.splice(index, 1);
    }, 5000);
};

ChemistryLab.prototype.showEquipment = function(markerId, pose) {
    const equipmentType = markerId === 268 ? 'beaker' : 'burner';

    if (!this.equipment[markerId]) {
        this.createEquipment(markerId, equipmentType);
    }

    this.equipment[markerId].setPosition(pose.position);
};

ChemistryLab.prototype.createEquipment = function(markerId, type) {
    const equipment = new pc.Entity('Equipment_' + type);
    this.entity.addChild(equipment);

    equipment.addComponent('model', { type: type === 'beaker' ? 'cylinder' : 'box' });
    equipment.setLocalScale(0.05, 0.08, 0.05);

    const color = type === 'beaker' ? new pc.Color(0.7, 0.9, 1) : new pc.Color(0.3, 0.3, 0.3);

    if (equipment.model && equipment.model.meshInstances[0]) {
        equipment.model.meshInstances[0].material.diffuse = color;
        if (type === 'beaker') {
            equipment.model.meshInstances[0].material.opacity = 0.5;
            equipment.model.meshInstances[0].material.blendType = pc.BLEND_NORMAL;
        }
        equipment.model.meshInstances[0].material.update();
    }

    this.equipment[markerId] = equipment;
};

ChemistryLab.prototype.getLabStats = function() {
    return {
        elementsActive: Object.keys(this.elements).length,
        moleculesCreated: this.molecules.length,
        experimentsCompleted: this.experimentsCompleted
    };
};
