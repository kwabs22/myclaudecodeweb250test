/** Treasure Hunt - Physical scavenger hunt with AR rewards */
var TreasureHunt = pc.createScript('treasureHunt');
TreasureHunt.attributes.add('numTreasures', { type: 'number', default: 10 });
TreasureHunt.prototype.initialize = function() {
    this.treasures = {};
    this.foundTreasures = new Set();
    this.score = 0;
    this.clues = [];
    this.initializeTreasures();
};
TreasureHunt.prototype.initializeTreasures = function() {
    for (let i = 0; i < this.numTreasures; i++) {
        this.treasures[i] = {
            id: i,
            found: false,
            value: Math.floor(Math.random() * 100) + 10,
            clue: 'Find marker ' + i
        };
    }
};
TreasureHunt.prototype.onMarkerFound = function(markerId) {
    if (!this.foundTreasures.has(markerId) && this.treasures[markerId]) {
        this.foundTreasures.add(markerId);
        this.score += this.treasures[markerId].value;
        this.spawnTreasureEffect(markerId);
        this.revealNextClue();
        console.log('Treasure found! Score:', this.score);
    }
};
TreasureHunt.prototype.spawnTreasureEffect = function(markerId) {
    // Spawn particle effects, treasure chest, etc.
};
TreasureHunt.prototype.revealNextClue = function() {
    const nextTreasureId = this.foundTreasures.size;
    if (this.treasures[nextTreasureId]) {
        console.log('Next clue:', this.treasures[nextTreasureId].clue);
    }
};
