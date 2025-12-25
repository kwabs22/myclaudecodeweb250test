import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const SHIP_SIZE = 40;
const BULLET_SIZE = 10;
const ASTEROID_SIZE = 30;

export default function SpaceShooterGame() {
  const [shipX, setShipX] = useState(width / 2 - SHIP_SIZE / 2);
  const [bullets, setBullets] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        // Update bullets
        setBullets(prev => {
          const newBullets = prev.map(b => ({ ...b, y: b.y - 8 }));
          return newBullets.filter(b => b.y > 0);
        });

        // Update asteroids
        setAsteroids(prev => {
          let newAsteroids = prev.map(a => ({ ...a, y: a.y + 3 }));

          // Remove off-screen asteroids
          newAsteroids = newAsteroids.filter(a => a.y < height);

          // Add new asteroids
          if (Math.random() < 0.02) {
            newAsteroids.push({
              id: Date.now(),
              x: Math.random() * (width - ASTEROID_SIZE),
              y: -ASTEROID_SIZE,
            });
          }

          // Check bullet collisions
          setBullets(prevBullets => {
            let updatedBullets = [...prevBullets];
            newAsteroids = newAsteroids.filter(asteroid => {
              const hit = updatedBullets.some((bullet, bIndex) => {
                if (
                  bullet.x < asteroid.x + ASTEROID_SIZE &&
                  bullet.x + BULLET_SIZE > asteroid.x &&
                  bullet.y < asteroid.y + ASTEROID_SIZE &&
                  bullet.y + BULLET_SIZE > asteroid.y
                ) {
                  updatedBullets.splice(bIndex, 1);
                  setScore(s => s + 10);
                  return true;
                }
                return false;
              });
              return !hit;
            });
            return updatedBullets;
          });

          // Check ship collision
          const shipHit = newAsteroids.some(a =>
            a.x < shipX + SHIP_SIZE &&
            a.x + ASTEROID_SIZE > shipX &&
            a.y + ASTEROID_SIZE > height - 150 &&
            a.y < height - 150 + SHIP_SIZE
          );

          if (shipHit) {
            setGameOver(true);
          }

          return newAsteroids;
        });
      }, 16);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameOver, shipX]);

  const moveShip = (direction) => {
    setShipX(prev => {
      const newX = prev + direction * 20;
      return Math.max(0, Math.min(width - SHIP_SIZE, newX));
    });
  };

  const shoot = () => {
    setBullets(prev => [...prev, {
      id: Date.now(),
      x: shipX + SHIP_SIZE / 2 - BULLET_SIZE / 2,
      y: height - 150,
    }]);
  };

  const startGame = () => {
    setShipX(width / 2 - SHIP_SIZE / 2);
    setBullets([]);
    setAsteroids([]);
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
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
              Game Over! Final Score: {score}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Destroy asteroids and survive!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.gameArea}>
            {/* Ship */}
            <View style={[styles.ship, { left: shipX, bottom: 150 }]}>
              <Text style={styles.shipText}>🚀</Text>
            </View>

            {/* Bullets */}
            {bullets.map(bullet => (
              <View
                key={bullet.id}
                style={[
                  styles.bullet,
                  { left: bullet.x, bottom: height - bullet.y },
                ]}
              />
            ))}

            {/* Asteroids */}
            {asteroids.map(asteroid => (
              <View
                key={asteroid.id}
                style={[
                  styles.asteroid,
                  { left: asteroid.x, top: asteroid.y },
                ]}
              >
                <Text style={styles.asteroidText}>☄️</Text>
              </View>
            ))}
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => moveShip(-1)}
            >
              <Text style={styles.controlText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shootButton}
              onPress={shoot}
            >
              <Text style={styles.controlText}>🔥</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => moveShip(1)}
            >
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
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    backgroundColor: '#111',
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
  ship: {
    position: 'absolute',
    width: SHIP_SIZE,
    height: SHIP_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shipText: {
    fontSize: 40,
  },
  bullet: {
    position: 'absolute',
    width: BULLET_SIZE,
    height: BULLET_SIZE,
    backgroundColor: '#00FF00',
    borderRadius: BULLET_SIZE / 2,
  },
  asteroid: {
    position: 'absolute',
    width: ASTEROID_SIZE,
    height: ASTEROID_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  asteroidText: {
    fontSize: 30,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#111',
  },
  controlButton: {
    backgroundColor: '#333',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shootButton: {
    backgroundColor: '#FF0000',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 32,
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
    backgroundColor: '#FF0000',
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
