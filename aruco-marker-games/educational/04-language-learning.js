/** Language Learning - AR vocabulary and language practice */
var LanguageLearning = pc.createScript('languageLearning');

LanguageLearning.attributes.add('wordMarkerIDs', {
    type: 'number',
    array: true,
    default: [240, 241, 242, 243, 244, 245, 246, 247, 248, 249],
    description: 'Marker IDs for vocabulary words'
});

LanguageLearning.attributes.add('targetLanguage', {
    type: 'string',
    default: 'Spanish',
    description: 'Language to learn (Spanish, French, German, etc.)'
});

LanguageLearning.prototype.initialize = function() {
    this.wordModels = {};
    this.learnedWords = new Set();
    this.currentWord = null;
    this.score = 0;
    this.streak = 0;

    this.vocabularyDatabase = this.initializeVocabulary();
    this.pronunciationGuide = {};
};

LanguageLearning.prototype.initializeVocabulary = function() {
    return {
        Spanish: {
            240: { word: 'perro', english: 'dog', category: 'animal', pronunciation: 'PEH-rro' },
            241: { word: 'gato', english: 'cat', category: 'animal', pronunciation: 'GAH-toh' },
            242: { word: 'casa', english: 'house', category: 'place', pronunciation: 'KAH-sah' },
            243: { word: 'árbol', english: 'tree', category: 'nature', pronunciation: 'AHR-bol' },
            244: { word: 'libro', english: 'book', category: 'object', pronunciation: 'LEE-bro' },
            245: { word: 'agua', english: 'water', category: 'food', pronunciation: 'AH-gwah' },
            246: { word: 'sol', english: 'sun', category: 'nature', pronunciation: 'sohl' },
            247: { word: 'luna', english: 'moon', category: 'nature', pronunciation: 'LOO-nah' },
            248: { word: 'amigo', english: 'friend', category: 'people', pronunciation: 'ah-MEE-go' },
            249: { word: 'feliz', english: 'happy', category: 'emotion', pronunciation: 'feh-LEES' }
        },
        French: {
            240: { word: 'chien', english: 'dog', category: 'animal', pronunciation: 'shee-EN' },
            241: { word: 'chat', english: 'cat', category: 'animal', pronunciation: 'shah' },
            242: { word: 'maison', english: 'house', category: 'place', pronunciation: 'may-ZON' },
            243: { word: 'arbre', english: 'tree', category: 'nature', pronunciation: 'AR-bruh' },
            244: { word: 'livre', english: 'book', category: 'object', pronunciation: 'LEE-vruh' },
            245: { word: 'eau', english: 'water', category: 'food', pronunciation: 'oh' },
            246: { word: 'soleil', english: 'sun', category: 'nature', pronunciation: 'so-LAY' },
            247: { word: 'lune', english: 'moon', category: 'nature', pronunciation: 'loon' },
            248: { word: 'ami', english: 'friend', category: 'people', pronunciation: 'ah-MEE' },
            249: { word: 'heureux', english: 'happy', category: 'emotion', pronunciation: 'uh-RUH' }
        }
    };
};

LanguageLearning.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.wordMarkerIDs.includes(markerId)) {
        this.showWord(markerId, pose);
    }
};

LanguageLearning.prototype.showWord = function(markerId, pose) {
    const vocabulary = this.vocabularyDatabase[this.targetLanguage];
    if (!vocabulary || !vocabulary[markerId]) return;

    const wordData = vocabulary[markerId];

    if (this.currentWord !== markerId) {
        this.currentWord = markerId;
        this.displayWordInfo(wordData);
        this.pronounceWord(wordData.word);

        if (!this.learnedWords.has(markerId)) {
            this.learnedWords.add(markerId);
            this.score += 10;
            this.streak++;
            console.log('New word learned! Streak:', this.streak);
        }
    }

    this.updateWordVisual(markerId, wordData, pose);
};

LanguageLearning.prototype.displayWordInfo = function(wordData) {
    console.log('━━━━━━━━━━━━━━━━━━');
    console.log('Word:', wordData.word);
    console.log('English:', wordData.english);
    console.log('Category:', wordData.category);
    console.log('Pronunciation:', wordData.pronunciation);
    console.log('━━━━━━━━━━━━━━━━━━');
};

LanguageLearning.prototype.updateWordVisual = function(markerId, wordData, pose) {
    if (!this.wordModels[markerId]) {
        this.createWordModel(markerId, wordData);
    }

    this.wordModels[markerId].setPosition(pose.position);
    this.animateWord(this.wordModels[markerId]);
};

LanguageLearning.prototype.createWordModel = function(markerId, wordData) {
    const wordEntity = new pc.Entity('Word_' + wordData.word);
    this.entity.addChild(wordEntity);

    // Create visual representation based on category
    const modelType = this.getCategoryModel(wordData.category);
    wordEntity.addComponent('model', { type: modelType });
    wordEntity.setLocalScale(0.06, 0.06, 0.06);

    // Color based on category
    const color = this.getCategoryColor(wordData.category);
    if (wordEntity.model && wordEntity.model.meshInstances[0]) {
        wordEntity.model.meshInstances[0].material.diffuse = color;
        wordEntity.model.meshInstances[0].material.update();
    }

    this.wordModels[markerId] = wordEntity;
};

LanguageLearning.prototype.getCategoryModel = function(category) {
    const models = {
        'animal': 'sphere',
        'place': 'box',
        'nature': 'cone',
        'object': 'cylinder',
        'food': 'capsule',
        'people': 'capsule',
        'emotion': 'sphere'
    };
    return models[category] || 'box';
};

LanguageLearning.prototype.getCategoryColor = function(category) {
    const colors = {
        'animal': new pc.Color(0.8, 0.6, 0.3),
        'place': new pc.Color(0.5, 0.5, 0.7),
        'nature': new pc.Color(0.3, 0.8, 0.3),
        'object': new pc.Color(0.7, 0.7, 0.7),
        'food': new pc.Color(1, 0.7, 0.3),
        'people': new pc.Color(1, 0.6, 0.6),
        'emotion': new pc.Color(1, 1, 0.4)
    };
    return colors[category] || new pc.Color(0.5, 0.5, 0.5);
};

LanguageLearning.prototype.animateWord = function(entity) {
    // Gentle floating animation
    const time = Date.now() * 0.002;
    const offset = Math.sin(time) * 0.02;
    const currentPos = entity.getLocalPosition();
    entity.setLocalPosition(currentPos.x, offset, currentPos.z);

    // Gentle rotation
    const currentRot = entity.getLocalEulerAngles();
    entity.setLocalEulerAngles(0, currentRot.y + 0.5, 0);
};

LanguageLearning.prototype.pronounceWord = function(word) {
    console.log('🔊 Pronouncing:', word);

    // In real implementation, use Web Speech API
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = this.getLanguageCode(this.targetLanguage);
        utterance.rate = 0.8; // Slower for learning
        // window.speechSynthesis.speak(utterance);
    }
};

LanguageLearning.prototype.getLanguageCode = function(language) {
    const codes = {
        'Spanish': 'es-ES',
        'French': 'fr-FR',
        'German': 'de-DE',
        'Italian': 'it-IT',
        'Portuguese': 'pt-PT',
        'Japanese': 'ja-JP',
        'Chinese': 'zh-CN'
    };
    return codes[language] || 'en-US';
};

LanguageLearning.prototype.startQuiz = function() {
    console.log('Starting vocabulary quiz...');

    const vocabulary = this.vocabularyDatabase[this.targetLanguage];
    const wordIds = Object.keys(vocabulary);
    const randomId = wordIds[Math.floor(Math.random() * wordIds.length)];
    const correctWord = vocabulary[randomId];

    console.log('What is the', this.targetLanguage, 'word for "' + correctWord.english + '"?');

    return {
        english: correctWord.english,
        correctAnswer: correctWord.word,
        markerId: randomId
    };
};

LanguageLearning.prototype.checkAnswer = function(markerId, quizData) {
    if (markerId == quizData.markerId) {
        this.score += 15;
        this.streak++;
        console.log('✓ Correct!');
        return true;
    } else {
        this.streak = 0;
        console.log('✗ Incorrect. Try again!');
        return false;
    }
};

LanguageLearning.prototype.getProgress = function() {
    const vocabulary = this.vocabularyDatabase[this.targetLanguage];
    const totalWords = Object.keys(vocabulary).length;
    const learnedCount = this.learnedWords.size;

    return {
        learned: learnedCount,
        total: totalWords,
        percentage: ((learnedCount / totalWords) * 100).toFixed(0) + '%',
        score: this.score,
        streak: this.streak
    };
};

LanguageLearning.prototype.switchLanguage = function(newLanguage) {
    if (this.vocabularyDatabase[newLanguage]) {
        this.targetLanguage = newLanguage;
        this.learnedWords.clear();
        console.log('Switched to', newLanguage);

        // Clear existing word models
        Object.values(this.wordModels).forEach(model => model.destroy());
        this.wordModels = {};
    }
};
