import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const GRID_SIZE = 4;
const TILE_SIZE = (width - 60) / GRID_SIZE;

const TILE_COLORS = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

export default function Game2048() {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const initializeGame = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    addNewTile(newGrid);
    addNewTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
  };

  const addNewTile = (currentGrid) => {
    const emptyCells = [];
    currentGrid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) emptyCells.push({ i, j });
      });
    });

    if (emptyCells.length > 0) {
      const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentGrid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = (direction) => {
    const newGrid = grid.map(row => [...row]);
    let moved = false;
    let newScore = score;

    const moveLeft = (row) => {
      const filtered = row.filter(cell => cell !== 0);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          newScore += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }
      while (filtered.length < GRID_SIZE) filtered.push(0);
      return filtered;
    };

    if (direction === 'left') {
      for (let i = 0; i < GRID_SIZE; i++) {
        const newRow = moveLeft(newGrid[i]);
        if (JSON.stringify(newRow) !== JSON.stringify(newGrid[i])) moved = true;
        newGrid[i] = newRow;
      }
    } else if (direction === 'right') {
      for (let i = 0; i < GRID_SIZE; i++) {
        const reversed = [...newGrid[i]].reverse();
        const newRow = moveLeft(reversed).reverse();
        if (JSON.stringify(newRow) !== JSON.stringify(newGrid[i])) moved = true;
        newGrid[i] = newRow;
      }
    } else if (direction === 'up') {
      for (let j = 0; j < GRID_SIZE; j++) {
        const column = newGrid.map(row => row[j]);
        const newColumn = moveLeft(column);
        if (JSON.stringify(newColumn) !== JSON.stringify(column)) moved = true;
        newColumn.forEach((val, i) => newGrid[i][j] = val);
      }
    } else if (direction === 'down') {
      for (let j = 0; j < GRID_SIZE; j++) {
        const column = newGrid.map(row => row[j]).reverse();
        const newColumn = moveLeft(column).reverse();
        const oldColumn = newGrid.map(row => row[j]);
        if (JSON.stringify(newColumn) !== JSON.stringify(oldColumn)) moved = true;
        newColumn.forEach((val, i) => newGrid[i][j] = val);
      }
    }

    if (moved) {
      addNewTile(newGrid);
      setGrid(newGrid);
      setScore(newScore);

      // Check game over
      if (!canMove(newGrid)) {
        setGameOver(true);
      }
    }
  };

  const canMove = (currentGrid) => {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (currentGrid[i][j] === 0) return true;
        if (j < GRID_SIZE - 1 && currentGrid[i][j] === currentGrid[i][j + 1]) return true;
        if (i < GRID_SIZE - 1 && currentGrid[i][j] === currentGrid[i + 1][j]) return true;
      }
    }
    return false;
  };

  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      const { translationX, translationY } = event;
      if (Math.abs(translationX) > Math.abs(translationY)) {
        move(translationX > 0 ? 'right' : 'left');
      } else {
        move(translationY > 0 ? 'down' : 'up');
      }
    });

  return (
    <GestureHandlerRootView style={styles.container}>
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
          <TouchableOpacity style={styles.startButton} onPress={initializeGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Swipe to move tiles. Merge to reach 2048!
          </Text>
        </View>
      ) : (
        <GestureDetector gesture={panGesture}>
          <View style={styles.gameBoard}>
            {grid.map((row, i) => (
              <View key={i} style={styles.row}>
                {row.map((cell, j) => (
                  <View
                    key={j}
                    style={[
                      styles.tile,
                      { backgroundColor: cell ? TILE_COLORS[cell] || '#3c3a32' : '#cdc1b4' },
                    ]}
                  >
                    {cell > 0 && (
                      <Text style={[styles.tileText, cell > 64 && styles.largeTileText]}>
                        {cell}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </GestureDetector>
      )}

      {gameStarted && !gameOver && (
        <View style={styles.controls}>
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.arrowButton} onPress={() => move('up')}>
              <Text style={styles.arrowText}>↑</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.arrowButton} onPress={() => move('left')}>
              <Text style={styles.arrowText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowButton} onPress={() => move('down')}>
              <Text style={styles.arrowText}>↓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowButton} onPress={() => move('right')}>
              <Text style={styles.arrowText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf8ef',
  },
  header: {
    padding: 20,
    backgroundColor: '#bbada0',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameBoard: {
    alignSelf: 'center',
    backgroundColor: '#bbada0',
    padding: 5,
    borderRadius: 10,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 3,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#776e65',
  },
  largeTileText: {
    color: '#f9f6f2',
  },
  controls: {
    marginTop: 20,
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  arrowButton: {
    backgroundColor: '#8f7a66',
    width: 60,
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  arrowText: {
    fontSize: 30,
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
    color: '#776e65',
    marginBottom: 30,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#8f7a66',
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
    color: '#776e65',
    textAlign: 'center',
  },
});
