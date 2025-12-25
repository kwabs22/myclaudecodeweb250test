/** Educational Quiz - AR trivia game with marker-based answers */
var EducationalQuiz = pc.createScript('educationalQuiz');

EducationalQuiz.attributes.add('answerMarkerIDs', {
    type: 'number',
    array: true,
    default: [40, 41, 42, 43],
    description: 'Marker IDs for answer choices (A, B, C, D)'
});

EducationalQuiz.attributes.add('questionCount', {
    type: 'number',
    default: 10,
    description: 'Total number of questions'
});

EducationalQuiz.prototype.initialize = function() {
    this.questions = [];
    this.currentQuestion = 0;
    this.score = 0;
    this.answeredQuestions = new Set();
    this.answerMarkers = {};

    this.initializeQuestions();
    this.displayQuestion();
};

EducationalQuiz.prototype.initializeQuestions = function() {
    // Sample questions - can be loaded from external data
    this.questions = [
        {
            question: "What is 2 + 2?",
            answers: ["3", "4", "5", "6"],
            correct: 1
        },
        {
            question: "Which planet is closest to the Sun?",
            answers: ["Venus", "Mercury", "Earth", "Mars"],
            correct: 1
        },
        {
            question: "What is the capital of France?",
            answers: ["London", "Berlin", "Paris", "Rome"],
            correct: 2
        },
        {
            question: "How many continents are there?",
            answers: ["5", "6", "7", "8"],
            correct: 2
        },
        {
            question: "What color do you get mixing blue and yellow?",
            answers: ["Purple", "Green", "Orange", "Red"],
            correct: 1
        }
    ];
};

EducationalQuiz.prototype.displayQuestion = function() {
    if (this.currentQuestion < this.questions.length) {
        const q = this.questions[this.currentQuestion];
        console.log('Question', this.currentQuestion + 1, ':', q.question);
        q.answers.forEach((ans, idx) => {
            console.log(String.fromCharCode(65 + idx) + ':', ans);
        });
    } else {
        this.endQuiz();
    }
};

EducationalQuiz.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.answerMarkerIDs.includes(markerId)) {
        this.spawnAnswerVisual(markerId, pose);
    }
};

EducationalQuiz.prototype.spawnAnswerVisual = function(markerId, pose) {
    const answerIndex = this.answerMarkerIDs.indexOf(markerId);

    if (!this.answerMarkers[markerId]) {
        const marker = new pc.Entity('Answer_' + String.fromCharCode(65 + answerIndex));
        this.entity.addChild(marker);
        marker.addComponent('model', { type: 'box' });
        marker.setLocalScale(0.1, 0.1, 0.02);
        this.answerMarkers[markerId] = marker;
    }

    this.answerMarkers[markerId].setPosition(pose.position);
    this.answerMarkers[markerId].setRotation(pose.rotation);
};

EducationalQuiz.prototype.onMarkerSelected = function(markerId) {
    if (this.answerMarkerIDs.includes(markerId)) {
        const answerIndex = this.answerMarkerIDs.indexOf(markerId);
        this.checkAnswer(answerIndex);
    }
};

EducationalQuiz.prototype.checkAnswer = function(answerIndex) {
    if (this.answeredQuestions.has(this.currentQuestion)) return;

    const question = this.questions[this.currentQuestion];
    const isCorrect = answerIndex === question.correct;

    if (isCorrect) {
        this.score += 10;
        console.log('Correct! Score:', this.score);
        this.showFeedback(true);
    } else {
        console.log('Incorrect. The correct answer was', String.fromCharCode(65 + question.correct));
        this.showFeedback(false);
    }

    this.answeredQuestions.add(this.currentQuestion);
    setTimeout(() => this.nextQuestion(), 2000);
};

EducationalQuiz.prototype.showFeedback = function(isCorrect) {
    // Visual feedback - particles, color change, etc.
    const color = isCorrect ? new pc.Color(0, 1, 0) : new pc.Color(1, 0, 0);
    // Apply feedback visual
};

EducationalQuiz.prototype.nextQuestion = function() {
    this.currentQuestion++;
    this.clearAnswerMarkers();
    this.displayQuestion();
};

EducationalQuiz.prototype.clearAnswerMarkers = function() {
    Object.values(this.answerMarkers).forEach(marker => marker.destroy());
    this.answerMarkers = {};
};

EducationalQuiz.prototype.endQuiz = function() {
    const percentage = (this.score / (this.questions.length * 10)) * 100;
    console.log('Quiz Complete! Final Score:', this.score, '/', this.questions.length * 10);
    console.log('Percentage:', percentage.toFixed(1) + '%');
};

EducationalQuiz.prototype.reset = function() {
    this.currentQuestion = 0;
    this.score = 0;
    this.answeredQuestions.clear();
    this.clearAnswerMarkers();
    this.displayQuestion();
};
