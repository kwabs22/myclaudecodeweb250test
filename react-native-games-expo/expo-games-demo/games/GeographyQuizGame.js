import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const QUESTIONS = [
  { q: 'Capital of France?', answers: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2, flag: '🇫🇷' },
  { q: 'Capital of Japan?', answers: ['Seoul', 'Tokyo', 'Beijing', 'Bangkok'], correct: 1, flag: '🇯🇵' },
  { q: 'Capital of Brazil?', answers: ['Rio', 'São Paulo', 'Brasília', 'Salvador'], correct: 2, flag: '🇧🇷' },
  { q: 'Capital of Egypt?', answers: ['Cairo', 'Alexandria', 'Giza', 'Luxor'], correct: 0, flag: '🇪🇬' },
  { q: 'Capital of Australia?', answers: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correct: 2, flag: '🇦🇺' },
  { q: 'Capital of Canada?', answers: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'], correct: 3, flag: '🇨🇦' },
  { q: 'Capital of India?', answers: ['Mumbai', 'New Delhi', 'Bangalore', 'Kolkata'], correct: 1, flag: '🇮🇳' },
  { q: 'Capital of Germany?', answers: ['Munich', 'Hamburg', 'Berlin', 'Frankfurt'], correct: 2, flag: '🇩🇪' },
  { q: 'Capital of Italy?', answers: ['Venice', 'Milan', 'Rome', 'Florence'], correct: 2, flag: '🇮🇹' },
  { q: 'Capital of Spain?', answers: ['Barcelona', 'Madrid', 'Seville', 'Valencia'], correct: 1, flag: '🇪🇸' },
];

export default function GeographyQuizGame() {
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
    <ScrollView style={styles.container}>
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
              Quiz Complete!{'\n'}
              Score: {score}/{QUESTIONS.length * 10}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Quiz'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Test your geography knowledge!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.questionBox}>
            <Text style={styles.flag}>
              {QUESTIONS[currentQuestion].flag}
            </Text>
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
        </View>
      )}
    </ScrollView>
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
    alignItems: 'center',
  },
  flag: {
    fontSize: 80,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
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
    minHeight: 400,
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
