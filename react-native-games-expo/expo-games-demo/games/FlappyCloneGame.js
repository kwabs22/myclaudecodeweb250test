import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const BIRD_SIZE = 30;
const GRAVITY = 0.6;
const JUMP_VELOCITY = -10;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;
const PIPE_SPEED = 3;

export default function FlappyCloneGame() {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [birdY, setBirdY] = useState(height / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        // Update bird position
        setBirdY(prevY => {
          const newY = prevY + birdVelocity;
          if (newY < 0 || newY > height - 100 - BIRD_SIZE) {
            setGameOver(true);
          }
          return newY;
        });

        setBirdVelocity(prevVelocity => prevVelocity + GRAVITY);

        // Update pipes
        setPipes(prevPipes => {
          let newPipes = prevPipes.map(pipe => ({
            ...pipe,
            x: pipe.x - PIPE_SPEED,
          }));

          // Remove off-screen pipes and add score
          newPipes = newPipes.filter(pipe => {
            if (pipe.x + PIPE_WIDTH < 0) {
              if (!pipe.scored) {
                setScore(s => s + 1);
              }
              return false;
            }
            return true;
          });

          // Mark pipes as scored when bird passes
          newPipes = newPipes.map(pipe => {
            if (!pipe.scored && pipe.x + PIPE_WIDTH < width / 2 - BIRD_SIZE / 2) {
              return { ...pipe, scored: true };
            }
            return pipe;
          });

          // Add new pipes
          if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < width - 300) {
            const pipeHeight = Math.random() * (height - PIPE_GAP - 200) + 100;
            newPipes.push({
              x: width,
              topHeight: pipeHeight,
              scored: false,
            });
          }

          // Check collisions
          newPipes.forEach(pipe => {
            const birdX = width / 2;
            const birdLeft = birdX - BIRD_SIZE / 2;
            const birdRight = birdX + BIRD_SIZE / 2;
            const birdTop = birdY;
            const birdBottom = birdY + BIRD_SIZE;

            if (
              birdRight > pipe.x &&
              birdLeft < pipe.x + PIPE_WIDTH
            ) {
              if (
                birdTop < pipe.topHeight ||
                birdBottom > pipe.topHeight + PIPE_GAP
              ) {
                setGameOver(true);
              }
            }
          });

          return newPipes;
        });
      }, 16);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameOver, birdVelocity, birdY]);

  const startGame = () => {
    setBirdY(height / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const jump = () => {
    if (!gameOver) {
      setBirdVelocity(JUMP_VELOCITY);
    }
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
            Tap anywhere to jump!{'\n'}
            Avoid the pipes!
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.gameArea}
          onPress={jump}
          activeOpacity={1}
        >
          {/* Bird */}
          <View
            style={[
              styles.bird,
              {
                top: birdY,
                left: width / 2 - BIRD_SIZE / 2,
              },
            ]}
          >
            <Text style={styles.birdText}>🐦</Text>
          </View>

          {/* Pipes */}
          {pipes.map((pipe, index) => (
            <View key={index}>
              {/* Top pipe */}
              <View
                style={[
                  styles.pipe,
                  {
                    left: pipe.x,
                    top: 0,
                    height: pipe.topHeight,
                  },
                ]}
              />
              {/* Bottom pipe */}
              <View
                style={[
                  styles.pipe,
                  {
                    left: pipe.x,
                    top: pipe.topHeight + PIPE_GAP,
                    height: height - pipe.topHeight - PIPE_GAP - 100,
                  },
                ]}
              />
            </View>
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
    backgroundColor: '#70C5CE',
  },
  header: {
    padding: 20,
    backgroundColor: '#4FA8B0',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  bird: {
    position: 'absolute',
    width: BIRD_SIZE,
    height: BIRD_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  birdText: {
    fontSize: 30,
  },
  pipe: {
    position: 'absolute',
    width: PIPE_WIDTH,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#388E3C',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    backgroundColor: '#8B4513',
    borderTopWidth: 5,
    borderTopColor: '#654321',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverText: {
    fontSize: 28,
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
    lineHeight: 24,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
