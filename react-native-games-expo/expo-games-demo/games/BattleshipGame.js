import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const GRID_SIZE = 8;

export default function BattleshipGame() {
  const [playerGrid, setPlayerGrid] = useState([]);
  const [cpuGrid, setCpuGrid] = useState([]);
  const [cpuShips, setCpuShips] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [hits, setHits] = useState({ player: 0, cpu: 0 });

  const createGrid = () => {
    return Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({ hit: false, ship: false }))
    );
  };

  const placeShips = (grid) => {
    const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
    const shipPositions = [];
    const shipSizes = [3, 2, 2];

    shipSizes.forEach(size => {
      let placed = false;
      while (!placed) {
        const isHorizontal = Math.random() < 0.5;
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);

        if (canPlaceShip(newGrid, row, col, size, isHorizontal)) {
          for (let i = 0; i < size; i++) {
            const r = isHorizontal ? row : row + i;
            const c = isHorizontal ? col + i : col;
            newGrid[r][c].ship = true;
            shipPositions.push({ row: r, col: c });
          }
          placed = true;
        }
      }
    });

    return { grid: newGrid, ships: shipPositions };
  };

  const canPlaceShip = (grid, row, col, size, isHorizontal) => {
    for (let i = 0; i < size; i++) {
      const r = isHorizontal ? row : row + i;
      const c = isHorizontal ? col + i : col;
      if (r >= GRID_SIZE || c >= GRID_SIZE || grid[r][c].ship) {
        return false;
      }
    }
    return true;
  };

  const startGame = () => {
    const playerSetup = placeShips(createGrid());
    const cpuSetup = placeShips(createGrid());

    setPlayerGrid(playerSetup.grid);
    setCpuGrid(cpuSetup.grid);
    setCpuShips(cpuSetup.ships);
    setHits({ player: 0, cpu: 0 });
    setGameStarted(true);
    setGameOver(false);
    setWinner(null);
  };

  const handleCellPress = (row, col) => {
    if (cpuGrid[row][col].hit) return;

    const newCpuGrid = cpuGrid.map(r => r.map(c => ({ ...c })));
    newCpuGrid[row][col].hit = true;
    setCpuGrid(newCpuGrid);

    let newHits = { ...hits };
    if (newCpuGrid[row][col].ship) {
      newHits.player++;
      setHits(newHits);

      if (newHits.player >= 7) {
        setWinner('Player');
        setGameOver(true);
        return;
      }
    }

    // CPU turn
    setTimeout(() => cpuTurn(newHits), 500);
  };

  const cpuTurn = (currentHits) => {
    let row, col;
    do {
      row = Math.floor(Math.random() * GRID_SIZE);
      col = Math.floor(Math.random() * GRID_SIZE);
    } while (playerGrid[row][col].hit);

    const newPlayerGrid = playerGrid.map(r => r.map(c => ({ ...c })));
    newPlayerGrid[row][col].hit = true;
    setPlayerGrid(newPlayerGrid);

    if (newPlayerGrid[row][col].ship) {
      currentHits.cpu++;
      setHits(currentHits);

      if (currentHits.cpu >= 7) {
        setWinner('CPU');
        setGameOver(true);
      }
    }
  };

  const renderGrid = (grid, isPlayerGrid) => {
    return grid.map((row, r) => (
      <View key={r} style={styles.row}>
        {row.map((cell, c) => (
          <TouchableOpacity
            key={c}
            style={[
              styles.cell,
              cell.hit && !cell.ship && styles.missCell,
              cell.hit && cell.ship && styles.hitCell,
              isPlayerGrid && cell.ship && !cell.hit && styles.shipCell,
            ]}
            onPress={() => !isPlayerGrid && !gameOver && handleCellPress(r, c)}
            disabled={isPlayerGrid || gameOver}
          >
            <Text style={styles.cellText}>
              {cell.hit ? (cell.ship ? '💥' : '💨') : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Battleship</Text>
        <View style={styles.score}>
          <Text style={styles.scoreText}>Player: {hits.player}/7</Text>
          <Text style={styles.scoreText}>CPU: {hits.cpu}/7</Text>
        </View>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              {winner === 'Player' ? '🎉 You Win!' : '💀 CPU Wins!'}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Battle'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Sink all enemy ships to win!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.gridContainer}>
            <Text style={styles.gridTitle}>Enemy Waters</Text>
            {renderGrid(cpuGrid, false)}
          </View>

          <View style={styles.gridContainer}>
            <Text style={styles.gridTitle}>Your Fleet</Text>
            {renderGrid(playerGrid, true)}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a5490',
  },
  header: {
    padding: 20,
    backgroundColor: '#0d3a66',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  score: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  scoreText: {
    fontSize: 16,
    color: '#fff',
  },
  gameArea: {
    padding: 10,
  },
  gridContainer: {
    marginVertical: 15,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 40,
    height: 40,
    backgroundColor: '#4a90e2',
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d5a8c',
  },
  shipCell: {
    backgroundColor: '#666',
  },
  hitCell: {
    backgroundColor: '#e74c3c',
  },
  missCell: {
    backgroundColor: '#bdc3c7',
  },
  cellText: {
    fontSize: 20,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F1C40F',
    marginBottom: 30,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#e74c3c',
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
