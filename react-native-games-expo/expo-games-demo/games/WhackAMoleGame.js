import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WhackAMoleGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);
  const moleRef = useRef(null);

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

      moleRef.current = setInterval(() => {
        showRandomMole();
      }, 800);

      return () => {
        clearInterval(timerRef.current);
        clearInterval(moleRef.current);
      };
    }
  }, [gameStarted, gameOver]);

  const showRandomMole = () => {
    const newMoles = Array(9).fill(false);
    const randomIndex = Math.floor(Math.random() * 9);
    newMoles[randomIndex] = true;
    setMoles(newMoles);

    setTimeout(() => {
      setMoles(Array(9).fill(false));
    }, 600);
  };

  const whackMole = (index) => {
    if (moles[index]) {
      setScore(score + 1);
      const newMoles = [...moles];
      newMoles[index] = false;
      setMoles(newMoles);
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setMoles(Array(9).fill(false));
    setGameStarted(true);
    setGameOver(false);
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
              Time's Up! Final Score: {score}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Tap the moles as they pop up!
          </Text>
        </View>
      ) : (
        <View style={styles.gameBoard}>
          {moles.map((isActive, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.hole,
                isActive && styles.activeHole,
              ]}
              onPress={() => whackMole(index)}
            >
              {isActive && <Text style={styles.moleText}>🦫</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C8C3E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#228B3E',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  gameBoard: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  hole: {
    width: 100,
    height: 100,
    margin: 10,
    backgroundColor: '#654321',
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#4A3010',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeHole: {
    backgroundColor: '#7A5221',
  },
  moleText: {
    fontSize: 60,
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
    backgroundColor: '#654321',
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
    color: '#fff',
    textAlign: 'center',
  },
});
