import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

const START_LIVES = 3;
const BLOCK_SIZE = 60;
const DEFAULT_AREA_HEIGHT = 560;

export default function ColorMatchGame() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [fallingBlocks, setFallingBlocks] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef(null);
  // The loop runs in an interval, so it reads the live game state from refs
  const blocksRef = useRef([]);
  const targetRef = useRef(COLORS[0]);
  const scoreRef = useRef(0);
  const livesRef = useRef(START_LIVES);
  const nextId = useRef(1);
  const areaHeight = useRef(DEFAULT_AREA_HEIGHT);

  const loseLife = () => {
    livesRef.current -= 1;
    setLives(livesRef.current);
    if (livesRef.current <= 0) setGameOver(true);
  };

  const pickTarget = () => {
    targetRef.current = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(targetRef.current);
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        // Blocks start slow and speed up as the score grows
        const speed = Math.min(1.5 + scoreRef.current / 150, 4);
        const moved = blocksRef.current.map(b => ({ ...b, y: b.y + speed }));

        // A block that reaches the bottom only costs a life if it was the colour to match
        const bottom = areaHeight.current - BLOCK_SIZE;
        let missed = 0;
        const stillFalling = [];
        moved.forEach(b => {
          if (b.y >= bottom) {
            if (b.color === targetRef.current) missed += 1;
          } else {
            stillFalling.push(b);
          }
        });

        // New blocks: about 4 in 10 are the colour to match, so there is always something to tap
        if (Math.random() < 0.025) {
          stillFalling.push({
            id: nextId.current++,
            color: Math.random() < 0.4 ? targetRef.current : COLORS[Math.floor(Math.random() * COLORS.length)],
            x: Math.random() * (width - BLOCK_SIZE - 10) + 5,
            y: -BLOCK_SIZE,
          });
        }

        blocksRef.current = stillFalling;
        setFallingBlocks(stillFalling);
        for (let k = 0; k < missed; k++) loseLife();
      }, 16);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameOver]);

  const startGame = () => {
    scoreRef.current = 0;
    livesRef.current = START_LIVES;
    blocksRef.current = [];
    setScore(0);
    setLives(START_LIVES);
    setGameOver(false);
    setGameStarted(true);
    setFallingBlocks([]);
    pickTarget();
  };

  const handleBlockPress = (block) => {
    if (gameOver) return;
    blocksRef.current = blocksRef.current.filter(b => b.id !== block.id);
    setFallingBlocks(blocksRef.current);
    if (block.color === targetRef.current) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      pickTarget();
    } else {
      loseLife();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.livesText}>{'❤️'.repeat(Math.max(lives, 0))}</Text>
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
            Tap the blocks that match the colour. You have 3 lives: tapping the wrong colour, or letting a matching block fall, costs one.
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea} onLayout={e => { areaHeight.current = e.nativeEvent.layout.height; }}>
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
  livesText: {
    fontSize: 18,
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
