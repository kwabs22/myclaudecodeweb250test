import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

export default function MathSpeedGame() {
  const [question, setQuestion] = useState({ num1: 0, num2: 0, operator: '+' });
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [gameStarted, gameOver]);

  const generateQuestion = () => {
    const operators = ['+', '-', '×', '÷'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2;

    if (op === '÷') {
      num2 = Math.floor(Math.random() * 10) + 1;
      const result = Math.floor(Math.random() * 10) + 1;
      num1 = num2 * result;
    } else {
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
    }

    setQuestion({ num1, num2, operator: op });
    setAnswer('');
  };

  const checkAnswer = (userAnswer) => {
    let correct;
    const { num1, num2, operator } = question;

    switch (operator) {
      case '+': correct = num1 + num2; break;
      case '-': correct = num1 - num2; break;
      case '×': correct = num1 * num2; break;
      case '÷': correct = num1 / num2; break;
    }

    if (parseInt(userAnswer) === correct) {
      setScore(score + 1);
      generateQuestion();
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameStarted(true);
    setGameOver(false);
    generateQuestion();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.timerText}>Time: {timeLeft}s</Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              Final Score: {score} problems solved!
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Solve as many math problems as you can in 60 seconds!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>
              {question.num1} {question.operator} {question.num2} = ?
            </Text>
          </View>

          <TextInput
            style={styles.input}
            value={answer}
            onChangeText={(text) => {
              setAnswer(text);
              if (text.length > 0) {
                checkAnswer(text);
              }
            }}
            keyboardType="numeric"
            placeholder="Your answer"
            placeholderTextColor="#999"
            autoFocus
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#34495E',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  questionBox: {
    backgroundColor: '#34495E',
    padding: 40,
    borderRadius: 20,
    marginBottom: 40,
  },
  questionText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    width: 200,
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 24,
  },
});
