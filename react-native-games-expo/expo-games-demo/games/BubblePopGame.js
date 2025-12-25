import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SIZE = 10;
const BUBBLE_SIZE = (width - 40) / GRID_SIZE;
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

export default function BubblePopGame() {
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(20);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const initializeGame = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() =>
        Math.floor(Math.random() * COLORS.length)
      )
    );
    setGrid(newGrid);
    setScore(0);
    setMoves(20);
    setGameStarted(true);
    setGameOver(false);
  };

  const findConnected = (row, col, color, visited = new Set()) => {
    const key = `${row},${col}`;
    if (visited.has(key)) return [];
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) return [];
    if (grid[row][col] !== color) return [];

    visited.add(key);
    const connected = [{ row, col }];

    connected.push(...findConnected(row - 1, col, color, visited));
    connected.push(...findConnected(row + 1, col, color, visited));
    connected.push(...findConnected(row, col - 1, color, visited));
    connected.push(...findConnected(row, col + 1, color, visited));

    return connected;
  };

  const handleBubblePress = (row, col) => {
    const color = grid[row][col];
    const connected = findConnected(row, col, color);

    if (connected.length >= 3) {
      const newGrid = grid.map(r => [...r]);
      connected.forEach(({ row, col }) => {
        newGrid[row][col] = -1;
      });

      // Drop bubbles
      for (let c = 0; c < GRID_SIZE; c++) {
        const column = [];
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
          if (newGrid[r][c] !== -1) {
            column.push(newGrid[r][c]);
          }
        }
        for (let r = GRID_SIZE - 1; r >= 0; r--) {
          newGrid[r][c] = column[GRID_SIZE - 1 - r] ?? Math.floor(Math.random() * COLORS.length);
        }
      }

      setGrid(newGrid);
      setScore(score + connected.length * 10);
      setMoves(moves - 1);

      if (moves <= 1) {
        setGameOver(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.movesText}>Moves: {moves}</Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>Final Score: {score}</Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={initializeGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Pop 3+ connected bubbles of the same color!
          </Text>
        </View>
      ) : (
        <View style={styles.gameBoard}>
          {grid.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((color, j) => (
                <TouchableOpacity
                  key={j}
                  style={[
                    styles.bubble,
                    { backgroundColor: COLORS[color] },
                  ]}
                  onPress={() => handleBubblePress(i, j)}
                />
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#34495E',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  movesText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F1C40F',
  },
  gameBoard: {
    alignSelf: 'center',
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    margin: 2,
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
