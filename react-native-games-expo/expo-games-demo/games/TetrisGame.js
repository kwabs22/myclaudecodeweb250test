import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = (width - 40) / COLS;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
];

const COLORS = ['#00F0F0', '#F0F000', '#A000F0', '#00F000', '#F00000', '#F0A000', '#0000F0'];

export default function TetrisGame() {
  const [board, setBoard] = useState(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);

  const createNewPiece = () => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[shapeIndex],
      color: shapeIndex + 1,
    };
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        moveDown();
      }, 500);

      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameOver, currentPiece, position, board]);

  const moveDown = () => {
    if (!currentPiece) {
      const newPiece = createNewPiece();
      const startX = Math.floor(COLS / 2) - Math.floor(newPiece.shape[0].length / 2);
      if (checkCollision(newPiece.shape, { x: startX, y: 0 })) {
        setGameOver(true);
      } else {
        setCurrentPiece(newPiece);
        setPosition({ x: startX, y: 0 });
      }
      return;
    }

    if (!checkCollision(currentPiece.shape, { x: position.x, y: position.y + 1 })) {
      setPosition({ ...position, y: position.y + 1 });
    } else {
      mergePiece();
    }
  };

  const checkCollision = (shape, pos) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const mergePiece = () => {
    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = currentPiece.color;
          }
        }
      });
    });

    // Clear complete lines
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++;
      }
    }

    setScore(score + linesCleared * 100);
    setBoard(newBoard);
    setCurrentPiece(null);
  };

  const moveLeft = () => {
    if (currentPiece && !checkCollision(currentPiece.shape, { x: position.x - 1, y: position.y })) {
      setPosition({ ...position, x: position.x - 1 });
    }
  };

  const moveRight = () => {
    if (currentPiece && !checkCollision(currentPiece.shape, { x: position.x + 1, y: position.y })) {
      setPosition({ ...position, x: position.x + 1 });
    }
  };

  const rotate = () => {
    if (!currentPiece) return;
    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );
    if (!checkCollision(rotated, position)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
    }
  };

  const startGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(0)));
    setCurrentPiece(null);
    setPosition({ x: 0, y: 0 });
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value && position.y + y >= 0) {
            displayBoard[position.y + y][position.x + x] = currentPiece.color;
          }
        });
      });
    }
    return displayBoard;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>Game Over! Score: {score}</Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Clear lines to score points!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.boardContainer}>
            {renderBoard().map((row, y) => (
              <View key={y} style={styles.row}>
                {row.map((cell, x) => (
                  <View
                    key={x}
                    style={[
                      styles.cell,
                      cell && { backgroundColor: COLORS[cell - 1] },
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={moveLeft}>
              <Text style={styles.controlText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={rotate}>
              <Text style={styles.controlText}>↻</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={moveDown}>
              <Text style={styles.controlText}>↓</Text>
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
    backgroundColor: '#000',
  },
  header: {
    padding: 15,
    backgroundColor: '#222',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  boardContainer: {
    alignSelf: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#444',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
    borderWidth: 0.5,
    borderColor: '#222',
    backgroundColor: '#111',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 20,
  },
  controlButton: {
    backgroundColor: '#444',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
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
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#00F0F0',
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
    color: '#999',
    textAlign: 'center',
  },
});
