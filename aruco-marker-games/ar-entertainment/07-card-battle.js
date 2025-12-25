/** Card Battle Game - Trading cards with AR monsters */
var CardBattle = pc.createScript('cardBattle');
CardBattle.attributes.add('cardMarkerIDs', { type: 'number', array: true, default: [30, 31, 32, 33, 34] });
CardBattle.prototype.initialize = function() {
    this.cards = {};
    this.monsters = {};
    this.battleActive = false;
    this.initializeCards();
};
CardBattle.prototype.initializeCards = function() {
    this.cardMarkerIDs.forEach((id, index) => {
        this.cards[id] = {
            name: 'Monster_' + index,
            health: 100,
            attack: Math.floor(Math.random() * 20) + 10,
            defense: Math.floor(Math.random() * 15) + 5
        };
    });
};
CardBattle.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.cardMarkerIDs.includes(markerId)) {
        this.spawnMonster(markerId, pose);
        this.checkForBattle();
    }
};
CardBattle.prototype.spawnMonster = function(markerId, pose) {
    if (!this.monsters[markerId]) {
        const monster = new pc.Entity('Monster_' + markerId);
        this.entity.addChild(monster);
        monster.addComponent('model', { type: 'capsule' });
        this.monsters[markerId] = monster;
    }
    this.monsters[markerId].setPosition(pose.position);
};
CardBattle.prototype.checkForBattle = function() {
    const activeMonsters = Object.keys(this.monsters);
    if (activeMonsters.length >= 2 && !this.battleActive) {
        this.startBattle(activeMonsters[0], activeMonsters[1]);
    }
};
CardBattle.prototype.startBattle = function(monsterId1, monsterId2) {
    this.battleActive = true;
    console.log('Battle started between', monsterId1, 'and', monsterId2);
    setTimeout(() => this.resolveBattle(monsterId1, monsterId2), 3000);
};
CardBattle.prototype.resolveBattle = function(id1, id2) {
    const card1 = this.cards[id1];
    const card2 = this.cards[id2];
    const damage1 = Math.max(0, card1.attack - card2.defense);
    const damage2 = Math.max(0, card2.attack - card1.defense);
    console.log('Battle result -', card1.name, 'deals', damage1, card2.name, 'deals', damage2);
    this.battleActive = false;
};
