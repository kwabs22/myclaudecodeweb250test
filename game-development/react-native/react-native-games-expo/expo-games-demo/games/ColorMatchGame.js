import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

export default function ColorMatchGame() {
  const [score, setScore] = useState(0);
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [fallingBlocks, setFallingBlocks] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        setFallingBlocks(prev => {
          const newBlocks = prev.map(block => ({
            ...block,
            y: block.y + 3,
          }));

          // Remove blocks that went off screen
          const filtered = newBlocks.filter(block => block.y < 600);

          // Check if any blocks reached the bottom without being matched
          if (newBlocks.some(block => block.y >= 580)) {
            setGameOver(true);
          }

          // Add new block randomly
          if (Math.random() < 0.02) {
            filtered.push({
              id: Date.now(),
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
              x: Math.random() * (width - 60),
              y: -50,
            });
          }

          return filtered;
        });
      }, 16);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setFallingBlocks([]);
    setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  const handleBlockPress = (block) => {
    if (block.color === targetColor) {
      setScore(score + 10);
      setFallingBlocks(prev => prev.filter(b => b.id !== block.id));
      setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    } else {
      setGameOver(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <View style={styles.targetContainer}>
          <Text style={styles.targetText}>Match:</Text>
          <View style={[styles.targetColor, { backgroundColor: targetColor }]} />
        </View>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              Game Over! Final Score: {score}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Tap blocks matching the target color!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          {fallingBlocks.map(block => (
            <TouchableOpacity
              key={block.id}
              style={[
                styles.block,
                {
                  backgroundColor: block.color,
                  left: block.x,
                  top: block.y,
                },
              ]}
              onPress={() => handleBlockPress(block)}
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
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2a2a2a',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetText: {
    fontSize: 18,
    color: '#fff',
    marginRight: 10,
  },
  targetColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  block: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
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
  },
});
