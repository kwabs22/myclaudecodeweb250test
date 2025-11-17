import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_SIZE = 15;
const BRICK_ROWS = 5;
const BRICK_COLS = 7;
const BRICK_WIDTH = (width - 40) / BRICK_COLS;
const BRICK_HEIGHT = 25;

export default function BrickBreakerGame() {
  const [paddleX, setPaddleX] = useState(width / 2 - PADDLE_WIDTH / 2);
  const [ballPos, setBallPos] = useState({ x: width / 2, y: height - 250 });
  const [ballVel, setBallVel] = useState({ x: 4, y: -4 });
  const [bricks, setBricks] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const gameLoopRef = useRef(null);

  const initializeBricks = () => {
    const newBricks = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F', '#BB8FCE'];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          id: row * BRICK_COLS + col,
          x: col * BRICK_WIDTH + 20,
          y: row * BRICK_HEIGHT + 100,
          color: colors[row],
          alive: true,
        });
      }
    }
    return newBricks;
  };

  useEffect(() => {
    if (gameStarted && !gameOver && !gameWon) {
      gameLoopRef.current = setInterval(() => {
        setBallPos(prev => {
          let newX = prev.x + ballVel.x;
          let newY = prev.y + ballVel.y;
          let newVelX = ballVel.x;
          let newVelY = ballVel.y;

          // Wall collisions
          if (newX <= 0 || newX >= width - BALL_SIZE) {
            newVelX = -newVelX;
          }
          if (newY <= 80) {
            newVelY = -newVelY;
          }

          // Paddle collision
          if (
            newY + BALL_SIZE >= height - 200 &&
            newY <= height - 200 + PADDLE_HEIGHT &&
            newX >= paddleX &&
            newX <= paddleX + PADDLE_WIDTH
          ) {
            newVelY = -Math.abs(newVelY);
            const hitPos = (newX - paddleX) / PADDLE_WIDTH;
            newVelX = (hitPos - 0.5) * 8;
          }

          // Bottom collision (lose)
          if (newY >= height - 100) {
            setGameOver(true);
          }

          // Brick collisions
          setBricks(prevBricks => {
            const updatedBricks = prevBricks.map(brick => {
              if (!brick.alive) return brick;

              if (
                newX < brick.x + BRICK_WIDTH &&
                newX + BALL_SIZE > brick.x &&
                newY < brick.y + BRICK_HEIGHT &&
                newY + BALL_SIZE > brick.y
              ) {
                newVelY = -newVelY;
                setScore(s => s + 10);
                return { ...brick, alive: false };
              }
              return brick;
            });

            const aliveBricks = updatedBricks.filter(b => b.alive);
            if (aliveBricks.length === 0) {
              setGameWon(true);
            }

            return updatedBricks;
          });

          setBallVel({ x: newVelX, y: newVelY });
          return { x: newX, y: newY };
        });
      }, 16);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameOver, gameWon, ballVel, paddleX]);

  const startGame = () => {
    setPaddleX(width / 2 - PADDLE_WIDTH / 2);
    setBallPos({ x: width / 2, y: height - 250 });
    setBallVel({ x: 4, y: -4 });
    setBricks(initializeBricks());
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      {!gameStarted || gameOver || gameWon ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              Game Over! Score: {score}
            </Text>
          )}
          {gameWon && (
            <Text style={styles.winText}>
              🎉 You Won! 🎉{'\n'}Score: {score}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameStarted ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Break all the bricks!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.gameArea}>
            {/* Bricks */}
            {bricks.map(brick =>
              brick.alive ? (
                <View
                  key={brick.id}
                  style={[
                    styles.brick,
                    {
                      left: brick.x,
                      top: brick.y,
                      backgroundColor: brick.color,
                    },
                  ]}
                />
              ) : null
            )}

            {/* Ball */}
            <View
              style={[
                styles.ball,
                { left: ballPos.x, top: ballPos.y },
              ]}
            />

            {/* Paddle */}
            <View
              style={[
                styles.paddle,
                { left: paddleX, bottom: 200 },
              ]}
              onTouchMove={(e) => {
                const touchX = e.nativeEvent.pageX;
                setPaddleX(Math.max(0, Math.min(width - PADDLE_WIDTH, touchX - PADDLE_WIDTH / 2)));
              }}
            />
          </View>
        </>
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
  brick: {
    position: 'absolute',
    width: BRICK_WIDTH - 4,
    height: BRICK_HEIGHT - 4,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    backgroundColor: '#fff',
    borderRadius: BALL_SIZE / 2,
  },
  paddle: {
    position: 'absolute',
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    backgroundColor: '#4ECDC4',
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
    color: '#FF6B6B',
    marginBottom: 30,
    textAlign: 'center',
  },
  winText: {
    fontSize: 24,
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
