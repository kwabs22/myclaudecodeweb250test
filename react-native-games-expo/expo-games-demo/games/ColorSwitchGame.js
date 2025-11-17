import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const BALL_SIZE = 20;
const COLORS = ['#FF6B6B', '#4ECDC4', '#F1C40F', '#9B59B6'];

export default function ColorSwitchGame() {
  const [ballY, setBallY] = useState(height - 200);
  const [ballVelocity, setBallVelocity] = useState(0);
  const [ballColor, setBallColor] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        setBallVelocity(prev => prev + 0.6);
        setBallY(prev => {
          const newY = prev + ballVelocity;
          if (newY > height - 100) return height - 200;
          return newY;
        });

        setObstacles(prev => {
          let newObstacles = prev.map(obs => ({ ...obs, y: obs.y + 2 }));
          newObstacles = newObstacles.filter(obs => obs.y < height + 100);

          if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].y > 300) {
            const type = Math.random() < 0.5 ? 'circle' : 'line';
            newObstacles.push({
              id: Date.now(),
              y: -200,
              type,
              rotation: 0,
            });
          }

          const ballX = width / 2;
          newObstacles.forEach(obs => {
            if (Math.abs(obs.y - ballY) < 30 && obs.type === 'line') {
              const lineColors = [0, 1, 2, 3];
              const ballAngle = Math.atan2(ballY - obs.y, ballX - width / 2);
              const segmentIndex = Math.floor(((ballAngle + Math.PI) / (Math.PI * 2)) * 4);
              if (lineColors[segmentIndex] !== ballColor) {
                setGameOver(true);
              }
            }
          });

          return newObstacles;
        });
      }, 16);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameOver, ballVelocity, ballY, ballColor]);

  const jump = () => {
    setBallVelocity(-12);
  };

  const startGame = () => {
    setBallY(height - 200);
    setBallVelocity(0);
    setBallColor(0);
    setObstacles([]);
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              Game Over! Score: {score}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Tap to jump! Match colors to pass!
          </Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.gameArea} onPress={jump} activeOpacity={1}>
          <View
            style={[
              styles.ball,
              {
                left: width / 2 - BALL_SIZE / 2,
                top: ballY,
                backgroundColor: COLORS[ballColor],
              },
            ]}
          />

          {obstacles.map(obs => (
            <View key={obs.id} style={{ position: 'absolute', top: obs.y }}>
              {obs.type === 'circle' ? (
                <View style={styles.circleObstacle}>
                  {[0, 1, 2, 3].map(i => (
                    <View
                      key={i}
                      style={[
                        styles.circleSegment,
                        {
                          backgroundColor: COLORS[i],
                          transform: [{ rotate: `${i * 90}deg` }],
                        },
                      ]}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.lineObstacle}>
                  {[0, 1, 2, 3].map(i => (
                    <View
                      key={i}
                      style={[
                        styles.lineSegment,
                        { backgroundColor: COLORS[i] },
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
        </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#16213e',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
  },
  circleObstacle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  circleSegment: {
    position: 'absolute',
    width: 150,
    height: 75,
  },
  lineObstacle: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  lineSegment: {
    width: width / 4,
    height: 20,
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
  },
});
