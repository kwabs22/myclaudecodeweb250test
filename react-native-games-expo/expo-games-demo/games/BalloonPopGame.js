import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function BalloonPopGame() {
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);
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

      gameLoopRef.current = setInterval(() => {
        setBalloons(prev => {
          let newBalloons = prev.map(b => ({ ...b, y: b.y - 2 }));
          newBalloons = newBalloons.filter(b => b.y > -100);

          if (Math.random() < 0.05) {
            newBalloons.push({
              id: Date.now(),
              x: Math.random() * (width - 60) + 10,
              y: height,
              color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            });
          }

          return newBalloons;
        });
      }, 16);

      return () => {
        clearInterval(timerRef.current);
        clearInterval(gameLoopRef.current);
      };
    }
  }, [gameStarted, gameOver]);

  const popBalloon = (balloonId) => {
    setBalloons(prev => prev.filter(b => b.id !== balloonId));
    setScore(score + 1);
  };

  const startGame = () => {
    setBalloons([]);
    setScore(0);
    setTimeLeft(30);
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
            Pop balloons before they float away!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          {balloons.map(balloon => (
            <TouchableOpacity
              key={balloon.id}
              style={[
                styles.balloon,
                {
                  left: balloon.x,
                  bottom: height - balloon.y,
                  backgroundColor: balloon.color,
                },
              ]}
              onPress={() => popBalloon(balloon.id)}
            >
              <Text style={styles.balloonText}>🎈</Text>
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
    backgroundColor: '#87CEEB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#4A90A4',
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
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  balloon: {
    position: 'absolute',
    width: 60,
    height: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balloonText: {
    fontSize: 50,
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
    backgroundColor: '#FF6B6B',
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
