import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 80) / 3;

export default function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6], // Diagonals
    ];

    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        setWinningLine([a, b, c]);
        return squares[a];
      }
    }

    return null;
  };

  const handlePress = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  };

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setGameStarted(true);
  };

  const isDraw = !winner && board.every(cell => cell !== null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Tic Tac Toe</Text>
        {gameStarted && !winner && !isDraw && (
          <Text style={styles.turnText}>
            {isXNext ? "X's Turn" : "O's Turn"}
          </Text>
        )}
      </View>

      {!gameStarted || winner || isDraw ? (
        <View style={styles.menuContainer}>
          {winner && (
            <Text style={styles.winText}>🎉 {winner} Wins! 🎉</Text>
          )}
          {isDraw && (
            <Text style={styles.winText}>It's a Draw!</Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameStarted ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Get three in a row to win!
          </Text>
        </View>
      ) : (
        <View style={styles.boardContainer}>
          <View style={styles.board}>
            {board.map((cell, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.cell,
                  winningLine.includes(index) && styles.winningCell,
                ]}
                onPress={() => handlePress(index)}
              >
                <Text style={[
                  styles.cellText,
                  cell === 'X' ? styles.xText : styles.oText,
                ]}>
                  {cell}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  turnText: {
    fontSize: 20,
    color: '#4ECDC4',
    marginTop: 10,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: CELL_SIZE * 3 + 20,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#16213e',
    margin: 2.5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winningCell: {
    backgroundColor: '#27AE60',
  },
  cellText: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  xText: {
    color: '#4ECDC4',
  },
  oText: {
    color: '#FF6B6B',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  winText: {
    fontSize: 28,
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
  },
});
