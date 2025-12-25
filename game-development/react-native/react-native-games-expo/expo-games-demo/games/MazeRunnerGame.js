import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SIZE = 15;
const CELL_SIZE = (width - 40) / GRID_SIZE;

export default function MazeRunnerGame() {
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [goalPos, setGoalPos] = useState({ x: GRID_SIZE - 2, y: GRID_SIZE - 2 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const generateMaze = () => {
    // Create a simple maze using randomized depth-first search
    const newMaze = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(1));

    const carve = (x, y) => {
      newMaze[y][x] = 0;

      const directions = [
        [0, -2], [2, 0], [0, 2], [-2, 0]
      ].sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx > 0 && nx < GRID_SIZE - 1 && ny > 0 && ny < GRID_SIZE - 1 && newMaze[ny][nx] === 1) {
          newMaze[y + dy / 2][x + dx / 2] = 0;
          carve(nx, ny);
        }
      }
    };

    carve(1, 1);
    newMaze[1][1] = 0;
    newMaze[GRID_SIZE - 2][GRID_SIZE - 2] = 0;

    return newMaze;
  };

  const startGame = () => {
    const newMaze = generateMaze();
    setMaze(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setGoalPos({ x: GRID_SIZE - 2, y: GRID_SIZE - 2 });
    setMoves(0);
    setGameStarted(true);
    setGameWon(false);
  };

  const movePlayer = (dx, dy) => {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE && maze[newY][newX] === 0) {
      setPlayerPos({ x: newX, y: newY });
      setMoves(moves + 1);

      if (newX === goalPos.x && newY === goalPos.y) {
        setGameWon(true);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Maze Runner</Text>
        <Text style={styles.movesText}>Moves: {moves}</Text>
      </View>

      {!gameStarted || gameWon ? (
        <View style={styles.menuContainer}>
          {gameWon && (
            <Text style={styles.winText}>
              🎉 Maze Complete! 🎉{'\n'}
              Solved in {moves} moves!
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameWon ? 'New Maze' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Navigate to the green goal!{'\n'}
            Use arrow buttons to move.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.mazeContainer}>
            {maze.map((row, y) => (
              <View key={y} style={styles.row}>
                {row.map((cell, x) => {
                  const isPlayer = playerPos.x === x && playerPos.y === y;
                  const isGoal = goalPos.x === x && goalPos.y === y;

                  return (
                    <View
                      key={x}
                      style={[
                        styles.cell,
                        cell === 1 && styles.wall,
                        isPlayer && styles.player,
                        isGoal && styles.goal,
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.controls}>
            <View style={styles.controlRow}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => movePlayer(0, -1)}
              >
                <Text style={styles.controlText}>↑</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.controlRow}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => movePlayer(-1, 0)}
              >
                <Text style={styles.controlText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => movePlayer(0, 1)}
              >
                <Text style={styles.controlText}>↓</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => movePlayer(1, 0)}
              >
                <Text style={styles.controlText}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#16213e',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  movesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  mazeContainer: {
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#ECF0F1',
  },
  wall: {
    backgroundColor: '#2C3E50',
  },
  player: {
    backgroundColor: '#3498DB',
  },
  goal: {
    backgroundColor: '#27AE60',
  },
  controls: {
    marginTop: 30,
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  controlButton: {
    backgroundColor: '#0f3460',
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  controlText: {
    fontSize: 30,
    color: '#fff',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  winText: {
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
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});
