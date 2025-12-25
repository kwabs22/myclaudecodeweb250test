import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const PADDLE_HEIGHT = 15;
const BALL_SIZE = 15;

export default function BallBounceGame() {
  const [paddleX, setPaddleX] = useState(width / 2 - 50);
  const [ballPos, setBallPos] = useState({ x: width / 2, y: height / 2 });
  const [ballVel, setBallVel] = useState({ x: 4, y: 4 });
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        setBallPos(prev => {
          let newX = prev.x + ballVel.x;
          let newY = prev.y + ballVel.y;
          let newVelX = ballVel.x;
          let newVelY = ballVel.y;

          if (newX <= 0 || newX >= width - BALL_SIZE) newVelX = -newVelX;
          if (newY <= 80) newVelY = -newVelY;

          if (
            newY + BALL_SIZE >= height - 150 &&
            newY <= height - 150 + PADDLE_HEIGHT &&
            newX >= paddleX &&
            newX <= paddleX + 100
          ) {
            newVelY = -Math.abs(newVelY);
            setScore(s => s + 1);
          }

          if (newY >= height - 100) {
            setGameOver(true);
          }

          setBallVel({ x: newVelX, y: newVelY });
          return { x: newX, y: newY };
        });
      }, 16);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameOver, ballVel, paddleX]);

  const startGame = () => {
    setPaddleX(width / 2 - 50);
    setBallPos({ x: width / 2, y: height / 2 });
    setBallVel({ x: 4, y: 4 });
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Bounces: {score}</Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              Game Over! Bounces: {score}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Keep the ball bouncing!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={[styles.ball, { left: ballPos.x, top: ballPos.y }]} />
          <View
            style={[styles.paddle, { left: paddleX, bottom: 150 }]}
            onTouchMove={(e) => {
              const touchX = e.nativeEvent.pageX;
              setPaddleX(Math.max(0, Math.min(width - 100, touchX - 50)));
            }}
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
    padding: 20,
    backgroundColor: '#34495E',
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
    backgroundColor: '#F39C12',
    borderRadius: BALL_SIZE / 2,
  },
  paddle: {
    position: 'absolute',
    width: 100,
    height: PADDLE_HEIGHT,
    backgroundColor: '#3498DB',
    borderRadius: 7,
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
    backgroundColor: '#3498DB',
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
  },
});
