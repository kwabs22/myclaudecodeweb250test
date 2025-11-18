import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Filter, BarChart } from 'lucide-react';

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [showStats, setShowStats] = useState(false);

  // Load questions from JSON
  useEffect(() => {
    fetch('phase1-question-bank-full.json')
      .then(res => res.json())
      .then(data => {
        setMetadata(data.metadata);
        setQuestions(data.questions);
      })
      .catch(err => console.error('Error loading questions:', err));
  }, []);

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const topicMatch = filterTopic === 'all' || q.topic === filterTopic;
    const difficultyMatch = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    return topicMatch && difficultyMatch;
  });

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        selected: answerIndex,
        correct: answerIndex === currentQuestion.correct_answer,
        question: currentQuestion
      }
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const calculateStats = () => {
    const answeredQuestions = Object.values(userAnswers);
    const correct = answeredQuestions.filter(a => a.correct).length;
    const total = answeredQuestions.length;
    const percentage = total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

    const byTopic = {};
    answeredQuestions.forEach(answer => {
      const topic = answer.question.topic;
      if (!byTopic[topic]) {
        byTopic[topic] = { correct: 0, total: 0 };
      }
      byTopic[topic].total++;
      if (answer.correct) byTopic[topic].correct++;
    });

    return { correct, total, percentage, byTopic };
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI Engineer Phase 1 Quiz
          </h1>
          <p className="text-gray-600">
            {metadata?.title || 'Loading...'}
          </p>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Question {currentQuestionIndex + 1} of {filteredQuestions.length}</span>
              <span>{stats.correct}/{stats.total} Correct ({stats.percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6 flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filterTopic}
            onChange={(e) => {
              setFilterTopic(e.target.value);
              setCurrentQuestionIndex(0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Topics</option>
            <option value="linear_algebra">Linear Algebra</option>
            <option value="calculus">Calculus</option>
            <option value="probability_statistics">Probability & Statistics</option>
            <option value="python">Python</option>
            <option value="sql">SQL</option>
            <option value="data_structures_algorithms">Data Structures & Algorithms</option>
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => {
              setFilterDifficulty(e.target.value);
              setCurrentQuestionIndex(0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <button
            onClick={() => setShowStats(!showStats)}
            className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <BarChart className="w-5 h-5" />
            Statistics
          </button>
        </div>

        {/* Statistics Panel */}
        {showStats && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Statistics</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.correct}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600">{stats.total - stats.correct}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">{stats.percentage}%</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-3">Performance by Topic</h3>
            <div className="space-y-2">
              {Object.entries(stats.byTopic).map(([topic, data]) => {
                const topicPercentage = ((data.correct / data.total) * 100).toFixed(1);
                return (
                  <div key={topic} className="flex items-center gap-3">
                    <div className="w-40 text-sm text-gray-600 capitalize">
                      {topic.replace(/_/g, ' ')}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${topicPercentage}%` }}
                      ></div>
                    </div>
                    <div className="w-24 text-sm text-gray-700">
                      {data.correct}/{data.total} ({topicPercentage}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Question Header */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentQuestion.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
              currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentQuestion.difficulty}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
              {currentQuestion.topic.replace(/_/g, ' ')}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {currentQuestion.subtopic.replace(/_/g, ' ')}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options && currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correct_answer;
              const showCorrect = showExplanation && isCorrect;
              const showIncorrect = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    showCorrect ? 'border-green-500 bg-green-50' :
                    showIncorrect ? 'border-red-500 bg-red-50' :
                    isSelected ? 'border-blue-500 bg-blue-50' :
                    'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showCorrect && <Check className="w-5 h-5 text-green-600" />}
                    {showIncorrect && <X className="w-5 h-5 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-4 rounded-lg ${
              selectedAnswer === currentQuestion.correct_answer
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <h3 className="font-semibold text-gray-800 mb-2">
                {selectedAnswer === currentQuestion.correct_answer ? '✅ Correct!' : '❌ Incorrect'}
              </h3>
              <p className="text-gray-700">{currentQuestion.explanation}</p>
              {currentQuestion.hints && currentQuestion.hints.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Hint:</span> {currentQuestion.hints[0]}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="text-gray-600">
            {currentQuestionIndex + 1} / {filteredQuestions.length}
          </div>

          <button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === filteredQuestions.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;
