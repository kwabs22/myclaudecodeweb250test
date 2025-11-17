/** Team Sports - AR soccer/basketball with physical markers */
var TeamSports = pc.createScript('teamSports');

TeamSports.attributes.add('teamAMarkerIDs', {
    type: 'number',
    array: true,
    default: [470, 471],
    description: 'Team A player markers'
});

TeamSports.attributes.add('teamBMarkerIDs', {
    type: 'number',
    array: true,
    default: [472, 473],
    description: 'Team B player markers'
});

TeamSports.attributes.add('ballMarkerID', {
    type: 'number',
    default: 474,
    description: 'Ball marker'
});

TeamSports.attributes.add('goalMarkerIDs', {
    type: 'number',
    array: true,
    default: [475, 476],
    description: 'Goal markers (Team A, Team B)'
});

TeamSports.prototype.initialize = function() {
    this.players = {};
    this.ball = null;
    this.goals = {};
    this.scores = { teamA: 0, teamB: 0 };
    this.gameTime = 0;
    this.matchDuration = 180; // 3 minutes
    this.gameActive = false;
    this.ballPossession = null;
    this.possessionRadius = 0.12;
};

TeamSports.prototype.update = function(dt) {
    if (!this.gameActive) return;

    this.gameTime += dt;

    // Check ball possession
    this.updateBallPossession();

    // Check for goals
    this.checkGoals();

    // Check match end
    if (this.gameTime >= this.matchDuration) {
        this.endMatch();
    }
};

TeamSports.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.teamAMarkerIDs.includes(markerId) || this.teamBMarkerIDs.includes(markerId)) {
        this.updatePlayer(markerId, pose);
    } else if (markerId === this.ballMarkerID) {
        this.updateBall(pose);
    } else if (this.goalMarkerIDs.includes(markerId)) {
        this.updateGoal(markerId, pose);
    }
};

TeamSports.prototype.updatePlayer = function(markerId, pose) {
    if (!this.players[markerId]) {
        this.createPlayer(markerId);
    }

    this.players[markerId].entity.setPosition(pose.position);
    this.players[markerId].position = pose.position.clone();
};

TeamSports.prototype.createPlayer = function(markerId) {
    const isTeamA = this.teamAMarkerIDs.includes(markerId);
    const team = isTeamA ? 'teamA' : 'teamB';

    const player = new pc.Entity('Player_' + markerId);
    this.entity.addChild(player);

    // Player body
    player.addComponent('model', { type: 'capsule' });
    player.setLocalScale(0.05, 0.08, 0.05);

    // Jersey number
    const number = new pc.Entity('Number');
    player.addChild(number);
    number.addComponent('model', { type: 'sphere' });
    number.setLocalScale(0.25, 0.25, 0.25);
    number.setLocalPosition(0, 0.7, 0);

    const color = isTeamA ? new pc.Color(1, 0.3, 0.3) : new pc.Color(0.3, 0.3, 1);

    if (player.model && player.model.meshInstances[0]) {
        player.model.meshInstances[0].material.diffuse = color;
        player.model.meshInstances[0].material.update();
    }

    if (number.model && number.model.meshInstances[0]) {
        number.model.meshInstances[0].material.diffuse = new pc.Color(1, 1, 1);
        number.model.meshInstances[0].material.update();
    }

    const playerIndex = isTeamA ? this.teamAMarkerIDs.indexOf(markerId) : this.teamBMarkerIDs.indexOf(markerId);

    this.players[markerId] = {
        entity: player,
        position: new pc.Vec3(),
        team: team,
        number: playerIndex + 1,
        hasBall: false
    };
};

TeamSports.prototype.updateBall = function(pose) {
    if (!this.ball) {
        this.createBall();
    }

    // If someone has possession, ball follows that player
    if (this.ballPossession) {
        const player = this.players[this.ballPossession];
        if (player) {
            const ballPos = player.position.clone().add(new pc.Vec3(0, 0.1, 0));
            this.ball.entity.setPosition(ballPos);
            this.ball.position = ballPos;
        }
    } else {
        this.ball.entity.setPosition(pose.position);
        this.ball.position = pose.position.clone();
    }
};

TeamSports.prototype.createBall = function() {
    const ballEntity = new pc.Entity('Ball');
    this.entity.addChild(ballEntity);

    ballEntity.addComponent('model', { type: 'sphere' });
    ballEntity.setLocalScale(0.04, 0.04, 0.04);

    if (ballEntity.model && ballEntity.model.meshInstances[0]) {
        ballEntity.model.meshInstances[0].material.diffuse = new pc.Color(1, 1, 1);
        ballEntity.model.meshInstances[0].material.emissive = new pc.Color(0.2, 0.2, 0.2);
        ballEntity.model.meshInstances[0].material.update();
    }

    this.ball = {
        entity: ballEntity,
        position: new pc.Vec3()
    };
};

TeamSports.prototype.updateGoal = function(markerId, pose) {
    if (!this.goals[markerId]) {
        this.createGoal(markerId);
    }

    this.goals[markerId].entity.setPosition(pose.position);
    this.goals[markerId].position = pose.position.clone();
};

TeamSports.prototype.createGoal = function(markerId) {
    const team = markerId === this.goalMarkerIDs[0] ? 'teamA' : 'teamB';

    const goal = new pc.Entity('Goal_' + team);
    this.entity.addChild(goal);

    // Goal posts
    const leftPost = new pc.Entity('LeftPost');
    goal.addChild(leftPost);
    leftPost.addComponent('model', { type: 'cylinder' });
    leftPost.setLocalScale(0.015, 0.1, 0.015);
    leftPost.setLocalPosition(-0.1, 0.05, 0);

    const rightPost = new pc.Entity('RightPost');
    goal.addChild(rightPost);
    rightPost.addComponent('model', { type: 'cylinder' });
    rightPost.setLocalScale(0.015, 0.1, 0.015);
    rightPost.setLocalPosition(0.1, 0.05, 0);

    // Crossbar
    const crossbar = new pc.Entity('Crossbar');
    goal.addChild(crossbar);
    crossbar.addComponent('model', { type: 'cylinder' });
    crossbar.setLocalScale(0.015, 0.1, 0.015);
    crossbar.setLocalPosition(0, 0.1, 0);
    crossbar.setLocalEulerAngles(0, 0, 90);

    // Net
    const net = new pc.Entity('Net');
    goal.addChild(net);
    net.addComponent('model', { type: 'box' });
    net.setLocalScale(0.2, 0.1, 0.05);
    net.setLocalPosition(0, 0.05, -0.025);

    const color = team === 'teamA' ? new pc.Color(1, 0.5, 0.5) : new pc.Color(0.5, 0.5, 1);

    [leftPost, rightPost, crossbar].forEach(post => {
        if (post.model && post.model.meshInstances[0]) {
            post.model.meshInstances[0].material.diffuse = new pc.Color(1, 1, 1);
            post.model.meshInstances[0].material.update();
        }
    });

    if (net.model && net.model.meshInstances[0]) {
        net.model.meshInstances[0].material.diffuse = color;
        net.model.meshInstances[0].material.opacity = 0.3;
        net.model.meshInstances[0].material.blendType = pc.BLEND_NORMAL;
        net.model.meshInstances[0].material.update();
    }

    this.goals[markerId] = {
        entity: goal,
        position: new pc.Vec3(),
        team: team,
        width: 0.2,
        height: 0.1
    };
};

TeamSports.prototype.updateBallPossession = function() {
    if (!this.ball) return;

    let closestPlayer = null;
    let closestDistance = this.possessionRadius;

    Object.entries(this.players).forEach(([playerId, player]) => {
        const distance = player.position.distance(this.ball.position);

        if (distance < closestDistance) {
            closestPlayer = playerId;
            closestDistance = distance;
        }
    });

    if (closestPlayer !== this.ballPossession) {
        // Possession changed
        if (this.ballPossession) {
            this.players[this.ballPossession].hasBall = false;
        }

        this.ballPossession = closestPlayer;

        if (closestPlayer) {
            this.players[closestPlayer].hasBall = true;
            const player = this.players[closestPlayer];
            console.log('Player', closestPlayer, '(' + player.team + ') has possession');
        }
    }
};

TeamSports.prototype.checkGoals = function() {
    if (!this.ball) return;

    Object.entries(this.goals).forEach(([goalId, goal]) => {
        const distance = this.ball.position.distance(goal.position);

        // Check if ball is in goal
        if (distance < 0.15 && Math.abs(this.ball.position.y - goal.position.y) < 0.1) {
            // Determine scoring team (opposite of goal team)
            const scoringTeam = goal.team === 'teamA' ? 'teamB' : 'teamA';
            this.scoreGoal(scoringTeam, this.ballPossession);
        }
    });
};

TeamSports.prototype.scoreGoal = function(team, scorerId) {
    this.scores[team]++;

    console.log('═══════════════════════════════════');
    console.log('⚽ GOAL! ' + team.toUpperCase() + ' SCORES!');

    if (scorerId) {
        const scorer = this.players[scorerId];
        console.log('Scored by Player', scorerId, '#' + scorer.number);
    }

    console.log('Score - Team A:', this.scores.teamA, 'Team B:', this.scores.teamB);
    console.log('═══════════════════════════════════');

    // Reset ball possession
    this.ballPossession = null;
    if (scorerId) {
        this.players[scorerId].hasBall = false;
    }
};

TeamSports.prototype.startMatch = function() {
    this.gameActive = true;
    this.gameTime = 0;
    this.scores = { teamA: 0, teamB: 0 };
    this.ballPossession = null;

    console.log('⚽ Match Started! Duration:', this.matchDuration, 'seconds');
};

TeamSports.prototype.endMatch = function() {
    this.gameActive = false;

    console.log('═══════════════════════════════════');
    console.log('🏁 MATCH ENDED!');
    console.log('Final Score:');
    console.log('Team A:', this.scores.teamA);
    console.log('Team B:', this.scores.teamB);

    if (this.scores.teamA > this.scores.teamB) {
        console.log('🏆 TEAM A WINS!');
    } else if (this.scores.teamB > this.scores.teamA) {
        console.log('🏆 TEAM B WINS!');
    } else {
        console.log('🤝 TIE GAME!');
    }

    console.log('═══════════════════════════════════');
};

TeamSports.prototype.getMatchStatus = function() {
    const timeRemaining = Math.max(0, this.matchDuration - this.gameTime);
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = Math.floor(timeRemaining % 60);

    console.log('Match Status:');
    console.log('Time Remaining:', minutes + ':' + seconds.toString().padStart(2, '0'));
    console.log('Score - Team A:', this.scores.teamA, 'Team B:', this.scores.teamB);

    if (this.ballPossession) {
        const player = this.players[this.ballPossession];
        console.log('Possession: Player', this.ballPossession, '(' + player.team + ')');
    } else {
        console.log('Possession: None');
    }
};
