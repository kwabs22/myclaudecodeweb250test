import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 15;
const BALL_SIZE = 15;

export default function PongGame() {
  const [ballPos, setBallPos] = useState({ x: width / 2, y: 300 });
  const [ballVel, setBallVel] = useState({ x: 4, y: 4 });
  const [playerY, setPlayerY] = useState(250);
  const [aiY, setAiY] = useState(250);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    if (gameStarted) {
      gameLoopRef.current = setInterval(() => {
        updateGame();
      }, 16);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, ballPos, ballVel, aiY]);

  const updateGame = () => {
    setBallPos(prev => {
      let newX = prev.x + ballVel.x;
      let newY = prev.y + ballVel.y;
      let newVelX = ballVel.x;
      let newVelY = ballVel.y;

      // Top and bottom walls
      if (newY <= 100 || newY >= height - 100 - BALL_SIZE) {
        newVelY = -newVelY;
      }

      // Player paddle
      if (newX <= 30 + PADDLE_WIDTH &&
          newY >= playerY && newY <= playerY + PADDLE_HEIGHT) {
        newVelX = Math.abs(newVelX);
        newVelY += (Math.random() - 0.5) * 2;
      }

      // AI paddle
      if (newX >= width - 30 - PADDLE_WIDTH - BALL_SIZE &&
          newY >= aiY && newY <= aiY + PADDLE_HEIGHT) {
        newVelX = -Math.abs(newVelX);
        newVelY += (Math.random() - 0.5) * 2;
      }

      // Scoring
      if (newX < 0) {
        setAiScore(s => s + 1);
        newX = width / 2;
        newY = 300;
        newVelX = 4;
        newVelY = 4;
      }

      if (newX > width) {
        setPlayerScore(s => s + 1);
        newX = width / 2;
        newY = 300;
        newVelX = -4;
        newVelY = 4;
      }

      setBallVel({ x: newVelX, y: newVelY });
      return { x: newX, y: newY };
    });

    // AI movement
    setAiY(prev => {
      const target = ballPos.y - PADDLE_HEIGHT / 2;
      if (prev < target - 2) return prev + 3;
      if (prev > target + 2) return prev - 3;
      return prev;
    });
  };

  const startGame = () => {
    setBallPos({ x: width / 2, y: 300 });
    setBallVel({ x: 4, y: 4 });
    setPlayerY(250);
    setAiY(250);
    setPlayerScore(0);
    setAiScore(0);
    setGameStarted(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>{playerScore}</Text>
        <Text style={styles.vsText}>VS</Text>
        <Text style={styles.scoreText}>{aiScore}</Text>
      </View>

      {!gameStarted ? (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Drag your paddle to hit the ball!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          {/* Player paddle */}
          <View
            style={[
              styles.paddle,
              { left: 20, top: playerY },
            ]}
            onTouchMove={(e) => {
              const y = e.nativeEvent.pageY - 100;
              setPlayerY(Math.max(100, Math.min(height - 100 - PADDLE_HEIGHT, y)));
            }}
          />

          {/* AI paddle */}
          <View
            style={[
              styles.paddle,
              { right: 20, top: aiY },
            ]}
          />

          {/* Ball */}
          <View
            style={[
              styles.ball,
              { left: ballPos.x, top: ballPos.y },
            ]}
          />

          {/* Center line */}
          <View style={styles.centerLine} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#111',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  vsText: {
    fontSize: 24,
    color: '#666',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  paddle: {
    position: 'absolute',
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    backgroundColor: '#fff',
    borderRadius: BALL_SIZE / 2,
  },
  centerLine: {
    position: 'absolute',
    left: width / 2 - 1,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#333',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
