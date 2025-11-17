import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const PLAYER_SIZE = 40;
const OBSTACLE_WIDTH = 30;

export default function EndlessRunnerGame() {
  const [playerY, setPlayerY] = useState(height - 200);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);
  const jumpVelocityRef = useRef(0);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        // Update player jump
        if (isJumping) {
          jumpVelocityRef.current += 0.8;
          setPlayerY(prev => {
            const newY = prev + jumpVelocityRef.current;
            if (newY >= height - 200) {
              setIsJumping(false);
              jumpVelocityRef.current = 0;
              return height - 200;
            }
            return newY;
          });
        }

        // Update obstacles
        setObstacles(prev => {
          let newObstacles = prev.map(obs => ({
            ...obs,
            x: obs.x - 5,
          }));

          // Remove off-screen obstacles
          newObstacles = newObstacles.filter(obs => obs.x > -OBSTACLE_WIDTH);

          // Add new obstacles
          if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < width - 300) {
            newObstacles.push({
              x: width,
              height: 40 + Math.random() * 30,
            });
          }

          // Check collisions
          const playerLeft = 50;
          const playerRight = 50 + PLAYER_SIZE;
          const playerTop = playerY;
          const playerBottom = playerY + PLAYER_SIZE;

          newObstacles.forEach(obs => {
            if (
              playerRight > obs.x &&
              playerLeft < obs.x + OBSTACLE_WIDTH &&
              playerBottom > height - 100 - obs.height
            ) {
              setGameOver(true);
            }
          });

          return newObstacles;
        });

        setScore(s => s + 1);
      }, 16);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameOver, isJumping, playerY]);

  const jump = () => {
    if (!isJumping && playerY >= height - 200) {
      setIsJumping(true);
      jumpVelocityRef.current = -15;
    }
  };

  const startGame = () => {
    setPlayerY(height - 200);
    setIsJumping(false);
    setObstacles([]);
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    jumpVelocityRef.current = 0;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {Math.floor(score / 10)}</Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              Game Over! Score: {Math.floor(score / 10)}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Tap to jump over obstacles!
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.gameArea}
          onPress={jump}
          activeOpacity={1}
        >
          {/* Player */}
          <View
            style={[
              styles.player,
              {
                left: 50,
                bottom: height - 100 - playerY - PLAYER_SIZE,
              },
            ]}
          >
            <Text style={styles.playerText}>🏃</Text>
          </View>

          {/* Obstacles */}
          {obstacles.map((obs, index) => (
            <View
              key={index}
              style={[
                styles.obstacle,
                {
                  left: obs.x,
                  bottom: 0,
                  height: obs.height,
                },
              ]}
            />
          ))}

          {/* Ground */}
          <View style={styles.ground} />
        </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#4A90A4',
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
  player: {
    position: 'absolute',
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerText: {
    fontSize: 40,
  },
  obstacle: {
    position: 'absolute',
    width: OBSTACLE_WIDTH,
    backgroundColor: '#8B4513',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    backgroundColor: '#90EE90',
    borderTopWidth: 5,
    borderTopColor: '#228B22',
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
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
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
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
