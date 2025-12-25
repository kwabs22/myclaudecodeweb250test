import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 40) / 8;

export default function TowerDefenseGame() {
  const [money, setMoney] = useState(100);
  const [lives, setLives] = useState(10);
  const [wave, setWave] = useState(1);
  const [towers, setTowers] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const path = [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
    { row: 3, col: 2 },
    { row: 4, col: 2 },
    { row: 4, col: 3 },
    { row: 4, col: 4 },
    { row: 5, col: 4 },
    { row: 6, col: 4 },
    { row: 7, col: 4 },
  ];

  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver) {
      const gameLoop = setInterval(() => {
        // Move enemies
        setEnemies(prev => {
          const newEnemies = prev.map(enemy => {
            if (enemy.pathIndex >= path.length - 1) {
              setLives(l => l - 1);
              return null;
            }
            return { ...enemy, pathIndex: enemy.pathIndex + 1 };
          }).filter(e => e !== null);

          return newEnemies;
        });

        // Tower attacks
        setEnemies(prev => {
          let updated = [...prev];
          towers.forEach(tower => {
            const inRange = updated.find(enemy => {
              const enemyPos = path[enemy.pathIndex];
              const distance = Math.abs(tower.row - enemyPos.row) + Math.abs(tower.col - enemyPos.col);
              return distance <= 2 && enemy.health > 0;
            });

            if (inRange) {
              const index = updated.indexOf(inRange);
              updated[index] = { ...inRange, health: inRange.health - 10 };
              if (updated[index].health <= 0) {
                setMoney(m => m + 15);
                updated.splice(index, 1);
              }
            }
          });
          return updated;
        });
      }, 500);

      return () => clearInterval(gameLoop);
    }
  }, [gameStarted, isPaused, gameOver, towers, path]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
    }
  }, [lives]);

  const startGame = () => {
    setMoney(100);
    setLives(10);
    setWave(1);
    setTowers([]);
    setEnemies([]);
    setSelectedCell(null);
    setGameStarted(true);
    setGameOver(false);
    setIsPaused(false);
  };

  const spawnWave = () => {
    const newEnemies = Array(wave * 3).fill(null).map((_, i) => ({
      id: Date.now() + i,
      pathIndex: -i * 2,
      health: wave * 30,
      maxHealth: wave * 30,
    }));
    setEnemies(prev => [...prev, ...newEnemies]);
    setWave(w => w + 1);
  };

  const placeTower = (row, col) => {
    if (money >= 50 && !isPathCell(row, col) && !towers.find(t => t.row === row && t.col === col)) {
      setTowers([...towers, { row, col }]);
      setMoney(money - 50);
      setSelectedCell(null);
    }
  };

  const isPathCell = (row, col) => {
    return path.some(p => p.row === row && p.col === col);
  };

  const renderGrid = () => {
    const grid = [];
    for (let r = 0; r < 8; r++) {
      const row = [];
      for (let c = 0; c < 8; c++) {
        const isPath = isPathCell(r, c);
        const hasTower = towers.find(t => t.row === r && t.col === c);
        const enemy = enemies.find(e => e.pathIndex >= 0 && path[e.pathIndex]?.row === r && path[e.pathIndex]?.col === c);

        row.push(
          <TouchableOpacity
            key={`${r}-${c}`}
            style={[
              styles.cell,
              isPath && styles.pathCell,
            ]}
            onPress={() => !isPath && placeTower(r, c)}
          >
            {hasTower && <Text style={styles.tower}>🗼</Text>}
            {enemy && (
              <View style={styles.enemy}>
                <Text style={styles.enemyText}>👾</Text>
                <View style={styles.healthBar}>
                  <View style={[styles.health, { width: `${(enemy.health / enemy.maxHealth) * 100}%` }]} />
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      }
      grid.push(<View key={r} style={styles.row}>{row}</View>);
    }
    return grid;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>🗼 Tower Defense</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>💰 ${money}</Text>
          <Text style={styles.statText}>❤️ {lives}</Text>
          <Text style={styles.statText}>🌊 {wave}</Text>
        </View>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              Game Over! Wave {wave - 1} reached
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Place towers ($50) to defend!{'\n'}
            Stop enemies from reaching the end!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.grid}>
            {renderGrid()}
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.waveButton} onPress={spawnWave}>
              <Text style={styles.waveButtonText}>Next Wave</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pauseButton} onPress={() => setIsPaused(!isPaused)}>
              <Text style={styles.pauseButtonText}>{isPaused ? '▶️' : '⏸️'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.hint}>Tower Cost: $50 | Range: 2 cells</Text>
        </View>
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
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  grid: {
    borderWidth: 2,
    borderColor: '#0f3460',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#2d4535',
    borderWidth: 1,
    borderColor: '#1a2920',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pathCell: {
    backgroundColor: '#8B7355',
  },
  tower: {
    fontSize: 24,
  },
  enemy: {
    alignItems: 'center',
  },
  enemyText: {
    fontSize: 20,
  },
  healthBar: {
    width: CELL_SIZE - 10,
    height: 4,
    backgroundColor: '#555',
    marginTop: 2,
  },
  health: {
    height: 4,
    backgroundColor: '#E74C3C',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  waveButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 15,
  },
  waveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  pauseButton: {
    backgroundColor: '#F39C12',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
  },
  pauseButtonText: {
    fontSize: 16,
  },
  hint: {
    marginTop: 15,
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
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
    color: '#95A5A6',
    textAlign: 'center',
  },
});
