import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BLOCK_HEIGHT = 30;
const INITIAL_BLOCK_WIDTH = 150;
const BASE_SPEED = 2;

export default function StackBlocksGame() {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [movingBlock, setMovingBlock] = useState(null);
  const [direction, setDirection] = useState(1);
  const animationRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameOver && movingBlock) {
      animationRef.current = setInterval(() => {
        setMovingBlock(prev => {
          const newX = prev.x + direction * (BASE_SPEED + score * 0.2);

          if (newX <= 0 || newX + prev.width >= width) {
            setDirection(d => -d);
          }

          return { ...prev, x: newX };
        });
      }, 16);

      return () => clearInterval(animationRef.current);
    }
  }, [gameStarted, gameOver, movingBlock, direction, score]);

  const startGame = () => {
    const baseBlock = {
      x: width / 2 - INITIAL_BLOCK_WIDTH / 2,
      width: INITIAL_BLOCK_WIDTH,
      y: 550,
      color: '#3498DB',
    };

    setBlocks([baseBlock]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setDirection(1);

    spawnNewBlock(baseBlock);
  };

  const spawnNewBlock = (lastBlock) => {
    const newBlock = {
      x: 0,
      width: lastBlock.width,
      y: lastBlock.y - BLOCK_HEIGHT,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };
    setMovingBlock(newBlock);
  };

  const dropBlock = () => {
    if (!movingBlock || blocks.length === 0) return;

    const lastBlock = blocks[blocks.length - 1];
    const overlapLeft = Math.max(movingBlock.x, lastBlock.x);
    const overlapRight = Math.min(
      movingBlock.x + movingBlock.width,
      lastBlock.x + lastBlock.width
    );
    const overlapWidth = overlapRight - overlapLeft;

    if (overlapWidth <= 0) {
      // No overlap - game over
      setGameOver(true);
      setMovingBlock(null);
      return;
    }

    // Create new block with overlap
    const newBlock = {
      x: overlapLeft,
      width: overlapWidth,
      y: movingBlock.y,
      color: movingBlock.color,
    };

    setBlocks([...blocks, newBlock]);
    setScore(score + 1);

    if (newBlock.width < 20) {
      // Block too small - game over
      setGameOver(true);
      setMovingBlock(null);
    } else {
      spawnNewBlock(newBlock);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Height: {score}</Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              Game Over! Height: {score}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Tap to drop the block!{'\n'}
            Stack them as high as you can!
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.gameArea}
          onPress={dropBlock}
          activeOpacity={1}
        >
          {blocks.map((block, index) => (
            <View
              key={index}
              style={[
                styles.block,
                {
                  left: block.x,
                  bottom: 600 - block.y - BLOCK_HEIGHT,
                  width: block.width,
                  backgroundColor: block.color,
                },
              ]}
            />
          ))}
          {movingBlock && (
            <View
              style={[
                styles.block,
                {
                  left: movingBlock.x,
                  bottom: 600 - movingBlock.y - BLOCK_HEIGHT,
                  width: movingBlock.width,
                  backgroundColor: movingBlock.color,
                },
              ]}
            />
          )}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  block: {
    position: 'absolute',
    height: BLOCK_HEIGHT,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 5,
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
    backgroundColor: '#e94560',
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
