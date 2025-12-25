/** Geography Quiz - Interactive AR world geography learning */
var GeographyQuiz = pc.createScript('geographyQuiz');

GeographyQuiz.attributes.add('continentMarkerIDs', {
    type: 'number',
    array: true,
    default: [250, 251, 252, 253, 254, 255, 256],
    description: 'Marker IDs for continents'
});

GeographyQuiz.prototype.initialize = function() {
    this.continents = {};
    this.countries = {};
    this.currentQuiz = null;
    this.score = 0;
    this.questionsAnswered = 0;

    this.geographyData = {
        250: {
            name: 'Africa',
            countries: ['Egypt', 'Kenya', 'Nigeria', 'South Africa'],
            capitals: { 'Egypt': 'Cairo', 'Kenya': 'Nairobi' },
            facts: 'Second largest continent, 54 countries',
            color: new pc.Color(0.9, 0.7, 0.3)
        },
        251: {
            name: 'Asia',
            countries: ['China', 'India', 'Japan', 'Thailand'],
            capitals: { 'China': 'Beijing', 'India': 'New Delhi', 'Japan': 'Tokyo' },
            facts: 'Largest continent, 60% of world population',
            color: new pc.Color(1, 0.6, 0.6)
        },
        252: {
            name: 'Europe',
            countries: ['France', 'Germany', 'Italy', 'Spain', 'UK'],
            capitals: { 'France': 'Paris', 'Germany': 'Berlin', 'Italy': 'Rome' },
            facts: 'Contains 44 countries, rich history',
            color: new pc.Color(0.5, 0.7, 1)
        },
        253: {
            name: 'North America',
            countries: ['USA', 'Canada', 'Mexico'],
            capitals: { 'USA': 'Washington DC', 'Canada': 'Ottawa', 'Mexico': 'Mexico City' },
            facts: '23 countries, includes Caribbean',
            color: new pc.Color(0.6, 1, 0.6)
        },
        254: {
            name: 'South America',
            countries: ['Brazil', 'Argentina', 'Peru', 'Chile'],
            capitals: { 'Brazil': 'Brasília', 'Argentina': 'Buenos Aires' },
            facts: 'Amazon rainforest, 12 countries',
            color: new pc.Color(0.8, 1, 0.4)
        },
        255: {
            name: 'Australia/Oceania',
            countries: ['Australia', 'New Zealand', 'Fiji'],
            capitals: { 'Australia': 'Canberra', 'New Zealand': 'Wellington' },
            facts: 'Smallest continent, 14 countries',
            color: new pc.Color(1, 0.8, 0.6)
        },
        256: {
            name: 'Antarctica',
            countries: [],
            capitals: {},
            facts: 'No permanent residents, research stations only',
            color: new pc.Color(0.9, 0.95, 1)
        }
    };
};

GeographyQuiz.prototype.onMarkerDetected = function(markerId, pose) {
    if (this.continentMarkerIDs.includes(markerId)) {
        this.showContinent(markerId, pose);
    }
};

GeographyQuiz.prototype.showContinent = function(markerId, pose) {
    const data = this.geographyData[markerId];
    if (!data) return;

    if (!this.continents[markerId]) {
        this.createContinentModel(markerId, data);
    }

    this.continents[markerId].setPosition(pose.position);
    this.displayContinentInfo(data);
};

GeographyQuiz.prototype.createContinentModel = function(markerId, data) {
    const continent = new pc.Entity('Continent_' + data.name);
    this.entity.addChild(continent);

    // Create 3D map representation
    continent.addComponent('model', { type: 'box' });
    continent.setLocalScale(0.15, 0.02, 0.1);

    if (continent.model && continent.model.meshInstances[0]) {
        continent.model.meshInstances[0].material.diffuse = data.color;
        continent.model.meshInstances[0].material.update();
    }

    // Add country markers
    data.countries.forEach((country, index) => {
        this.createCountryMarker(continent, country, index, data.countries.length);
    });

    this.continents[markerId] = continent;
};

GeographyQuiz.prototype.createCountryMarker = function(parent, countryName, index, total) {
    const marker = new pc.Entity('Country_' + countryName);
    parent.addChild(marker);

    marker.addComponent('model', { type: 'sphere' });
    marker.setLocalScale(0.05, 0.05, 0.05);

    // Position around the continent
    const angle = (index / total) * Math.PI * 2;
    const radius = 0.08;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    marker.setLocalPosition(x, 0.03, z);

    if (marker.model && marker.model.meshInstances[0]) {
        marker.model.meshInstances[0].material.diffuse = new pc.Color(1, 0.3, 0.3);
        marker.model.meshInstances[0].material.update();
    }

    this.countries[countryName] = marker;
};

GeographyQuiz.prototype.displayContinentInfo = function(data) {
    console.log('═══════════════════════════');
    console.log('Continent:', data.name);
    console.log('Countries:', data.countries.join(', '));
    console.log('Fact:', data.facts);
    console.log('═══════════════════════════');
};

GeographyQuiz.prototype.startCapitalQuiz = function() {
    // Pick random continent with capitals
    const continentIds = this.continentMarkerIDs.filter(id => {
        const data = this.geographyData[id];
        return Object.keys(data.capitals).length > 0;
    });

    const randomId = continentIds[Math.floor(Math.random() * continentIds.length)];
    const continent = this.geographyData[randomId];

    // Pick random country from continent
    const countries = Object.keys(continent.capitals);
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const capital = continent.capitals[randomCountry];

    this.currentQuiz = {
        type: 'capital',
        question: 'What is the capital of ' + randomCountry + '?',
        answer: capital,
        country: randomCountry
    };

    console.log('Quiz:', this.currentQuiz.question);
    return this.currentQuiz;
};

GeographyQuiz.prototype.startCountryQuiz = function() {
    const continentIds = this.continentMarkerIDs.filter(id => {
        return this.geographyData[id].countries.length > 0;
    });

    const randomId = continentIds[Math.floor(Math.random() * continentIds.length)];
    const continent = this.geographyData[randomId];

    const randomCountry = continent.countries[Math.floor(Math.random() * continent.countries.length)];

    this.currentQuiz = {
        type: 'continent',
        question: 'Which continent is ' + randomCountry + ' in?',
        answer: continent.name,
        country: randomCountry
    };

    console.log('Quiz:', this.currentQuiz.question);
    return this.currentQuiz;
};

GeographyQuiz.prototype.checkAnswer = function(answer) {
    if (!this.currentQuiz) return false;

    const correct = answer.toLowerCase() === this.currentQuiz.answer.toLowerCase();

    if (correct) {
        this.score += 10;
        this.questionsAnswered++;
        console.log('✓ Correct! The answer is', this.currentQuiz.answer);
    } else {
        this.questionsAnswered++;
        console.log('✗ Incorrect. The correct answer is', this.currentQuiz.answer);
    }

    this.currentQuiz = null;
    return correct;
};

GeographyQuiz.prototype.getStats = function() {
    const accuracy = this.questionsAnswered > 0 ? ((this.score / (this.questionsAnswered * 10)) * 100).toFixed(0) : 0;

    return {
        score: this.score,
        questionsAnswered: this.questionsAnswered,
        accuracy: accuracy + '%'
    };
};
