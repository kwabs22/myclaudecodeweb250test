import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CoinCollectorGame() {
  const [playerX, setPlayerX] = useState(width / 2 - 25);
  const [coins, setCoins] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        setCoins(prev => {
          let newCoins = prev.map(c => ({ ...c, y: c.y + 3 }));
          newCoins = newCoins.filter(c => {
            if (c.y > height) return false;

            // Check collision with player
            if (
              c.y > height - 200 &&
              c.y < height - 150 &&
              c.x > playerX &&
              c.x < playerX + 50
            ) {
              setScore(s => s + 1);
              return false;
            }
            return true;
          });

          if (Math.random() < 0.03) {
            newCoins.push({
              id: Date.now(),
              x: Math.random() * (width - 30) + 15,
              y: 0,
            });
          }

          return newCoins;
        });

        setObstacles(prev => {
          let newObstacles = prev.map(o => ({ ...o, y: o.y + 4 }));
          newObstacles = newObstacles.filter(o => {
            if (o.y > height) return false;

            // Check collision with player
            if (
              o.y > height - 200 &&
              o.y < height - 150 &&
              o.x > playerX &&
              o.x < playerX + 50
            ) {
              setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) setGameOver(true);
                return newLives;
              });
              return false;
            }
            return true;
          });

          if (Math.random() < 0.015) {
            newObstacles.push({
              id: Date.now(),
              x: Math.random() * (width - 30) + 15,
              y: 0,
            });
          }

          return newObstacles;
        });
      }, 16);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameOver, playerX]);

  const moveLeft = () => {
    setPlayerX(prev => Math.max(0, prev - 30));
  };

  const moveRight = () => {
    setPlayerX(prev => Math.min(width - 50, prev + 30));
  };

  const startGame = () => {
    setPlayerX(width / 2 - 25);
    setCoins([]);
    setObstacles([]);
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
            Collect coins, avoid obstacles!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.gameArea}>
            {coins.map(coin => (
              <View
                key={coin.id}
                style={[styles.coin, { left: coin.x, top: coin.y }]}
              >
                <Text style={styles.coinText}>🪙</Text>
              </View>
            ))}

            {obstacles.map(obs => (
              <View
                key={obs.id}
                style={[styles.obstacle, { left: obs.x, top: obs.y }]}
              >
                <Text style={styles.obstacleText}>💀</Text>
              </View>
            ))}

            <View style={[styles.player, { left: playerX, bottom: 150 }]}>
              <Text style={styles.playerText}>🏃</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={moveLeft}>
              <Text style={styles.controlText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={moveRight}>
              <Text style={styles.controlText}>→</Text>
            </TouchableOpacity>
          </View>
        </>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#4A90A4',
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
  coin: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  coinText: {
    fontSize: 30,
  },
  obstacle: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  obstacleText: {
    fontSize: 30,
  },
  player: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  playerText: {
    fontSize: 50,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#4A90A4',
  },
  controlButton: {
    backgroundColor: '#333',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 40,
    color: '#fff',
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
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  instructions: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});
