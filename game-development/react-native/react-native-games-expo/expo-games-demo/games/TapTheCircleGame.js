import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function TapTheCircleGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [circles, setCircles] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);
  const spawnRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Timer countdown
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Spawn circles
      spawnRef.current = setInterval(() => {
        spawnCircle();
      }, 800);

      return () => {
        clearInterval(timerRef.current);
        clearInterval(spawnRef.current);
      };
    }
  }, [gameStarted, gameOver]);

  const spawnCircle = () => {
    const newCircle = {
      id: Date.now(),
      x: Math.random() * (width - 80) + 10,
      y: Math.random() * (height - 300) + 100,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      lifetime: 0,
    };

    setCircles(prev => [...prev, newCircle]);

    // Remove circle after 2 seconds if not tapped
    setTimeout(() => {
      setCircles(prev => prev.filter(c => c.id !== newCircle.id));
    }, 2000);
  };

  const handleCircleTap = (circleId) => {
    setCircles(prev => prev.filter(c => c.id !== circleId));
    setScore(score + 1);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setCircles([]);
    setGameOver(false);
    setGameStarted(true);
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
            Tap all circles before they disappear!{'\n'}
            You have 30 seconds!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          {circles.map(circle => (
            <TouchableOpacity
              key={circle.id}
              style={[
                styles.circle,
                {
                  backgroundColor: circle.color,
                  left: circle.x,
                  top: circle.y,
                },
              ]}
              onPress={() => handleCircleTap(circle.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a3e',
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
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#fff',
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
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});
