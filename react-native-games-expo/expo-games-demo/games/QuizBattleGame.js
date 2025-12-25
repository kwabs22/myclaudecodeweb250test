import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const QUESTIONS = [
  { q: 'What is the capital of France?', answers: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2 },
  { q: 'Which planet is closest to the Sun?', answers: ['Venus', 'Mercury', 'Mars', 'Earth'], correct: 1 },
  { q: 'What is 7 × 8?', answers: ['54', '56', '58', '60'], correct: 1 },
  { q: 'Who painted the Mona Lisa?', answers: ['Van Gogh', 'Picasso', 'Da Vinci', 'Monet'], correct: 2 },
  { q: 'What is the largest ocean?', answers: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3 },
  { q: 'How many continents are there?', answers: ['5', '6', '7', '8'], correct: 2 },
  { q: 'What is the speed of light?', answers: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'], correct: 0 },
  { q: 'Which is the smallest prime number?', answers: ['0', '1', '2', '3'], correct: 2 },
  { q: 'What year did WWII end?', answers: ['1943', '1944', '1945', '1946'], correct: 2 },
  { q: 'What is the chemical symbol for gold?', answers: ['Go', 'Gd', 'Au', 'Ag'], correct: 2 },
];

export default function QuizBattleGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const startGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    if (answerIndex === QUESTIONS[currentQuestion].correct) {
      setScore(score + 10);
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setGameOver(true);
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.questionNumber}>
          {currentQuestion + 1}/{QUESTIONS.length}
        </Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              Final Score: {score}/{QUESTIONS.length * 10}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Quiz'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Answer trivia questions to score points!
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.gameArea}>
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>
              {QUESTIONS[currentQuestion].q}
            </Text>
          </View>

          <View style={styles.answersContainer}>
            {QUESTIONS[currentQuestion].answers.map((answer, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.answerButton,
                  selectedAnswer === index && (
                    index === QUESTIONS[currentQuestion].correct
                      ? styles.correctAnswer
                      : styles.wrongAnswer
                  ),
                ]}
                onPress={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <Text style={styles.answerText}>{answer}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#16213e',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  questionNumber: {
    fontSize: 20,
    color: '#fff',
  },
  gameArea: {
    flex: 1,
    padding: 20,
  },
  questionBox: {
    backgroundColor: '#16213e',
    padding: 30,
    borderRadius: 15,
    marginBottom: 30,
  },
  questionText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
  },
  answersContainer: {
    gap: 15,
  },
  answerButton: {
    backgroundColor: '#0f3460',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  answerText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  correctAnswer: {
    backgroundColor: '#27AE60',
  },
  wrongAnswer: {
    backgroundColor: '#E74C3C',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F1C40F',
    marginBottom: 30,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructions: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
