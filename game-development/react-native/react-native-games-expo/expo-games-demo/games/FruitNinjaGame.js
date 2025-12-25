import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react';

const { width, height } = Dimensions.get('window');

export default function FruitNinjaGame() {
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);

  const FRUIT_EMOJIS = ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🥝'];
  const BOMB_EMOJI = '💣';

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        setFruits(prev => {
          let newFruits = prev.map(f => ({
            ...f,
            y: f.y - f.velocityY,
            velocityY: f.velocityY - 0.5,
          }));

          newFruits = newFruits.filter(f => {
            if (f.y > height && !f.isBomb) {
              setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) setGameOver(true);
                return newLives;
              });
              return false;
            }
            return f.y < height + 100;
          });

          if (Math.random() < 0.03) {
            const isBomb = Math.random() < 0.15;
            newFruits.push({
              id: Date.now(),
              x: Math.random() * (width - 60) + 30,
              y: height,
              velocityY: 12 + Math.random() * 5,
              emoji: isBomb ? BOMB_EMOJI : FRUIT_EMOJIS[Math.floor(Math.random() * FRUIT_EMOJIS.length)],
              isBomb,
              sliced: false,
            });
          }

          return newFruits;
        });
      }, 16);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameOver]);

  const sliceFruit = (fruitId, isBomb) => {
    if (isBomb) {
      setGameOver(true);
    } else {
      setScore(score + 1);
    }
    setFruits(prev => prev.filter(f => f.id !== fruitId));
  };

  const startGame = () => {
    setFruits([]);
    setScore(0);
    setLives(3);
    setGameStarted(true);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.livesText}>Lives: {'❤️'.repeat(lives)}</Text>
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
            Slice fruits, avoid bombs!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          {fruits.map(fruit => (
            <TouchableOpacity
              key={fruit.id}
              style={[
                styles.fruit,
                { left: fruit.x, bottom: fruit.y },
              ]}
              onPress={() => sliceFruit(fruit.id, fruit.isBomb)}
            >
              <Text style={styles.fruitText}>{fruit.emoji}</Text>
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
    backgroundColor: '#8B4513',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#654321',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  livesText: {
    fontSize: 24,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  fruit: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fruitText: {
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
