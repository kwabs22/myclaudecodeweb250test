import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 80) / 9;

export default function UltimateTicTacToeGame() {
  const [boards, setBoards] = useState(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [boardWinners, setBoardWinners] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [activeBoard, setActiveBoard] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handlePress = (boardIndex, cellIndex) => {
    if (winner || boardWinners[boardIndex] || boards[boardIndex][cellIndex]) return;
    if (activeBoard !== null && activeBoard !== boardIndex) return;

    const newBoards = boards.map(b => [...b]);
    newBoards[boardIndex][cellIndex] = isXNext ? 'X' : 'O';
    setBoards(newBoards);

    const boardWinner = checkWinner(newBoards[boardIndex]);
    if (boardWinner) {
      const newBoardWinners = [...boardWinners];
      newBoardWinners[boardIndex] = boardWinner;
      setBoardWinners(newBoardWinners);

      const gameWinner = checkWinner(newBoardWinners);
      if (gameWinner) {
        setWinner(gameWinner);
      }
    }

    setActiveBoard(boardWinners[cellIndex] ? null : cellIndex);
    setIsXNext(!isXNext);
  };

  const startGame = () => {
    setBoards(Array(9).fill(null).map(() => Array(9).fill(null)));
    setBoardWinners(Array(9).fill(null));
    setIsXNext(true);
    setActiveBoard(null);
    setWinner(null);
    setGameStarted(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Ultimate Tic Tac Toe</Text>
        {gameStarted && !winner && (
          <Text style={styles.turnText}>
            {isXNext ? "X's Turn" : "O's Turn"}
          </Text>
        )}
      </View>

      {!gameStarted || winner ? (
        <View style={styles.menuContainer}>
          {winner && (
            <Text style={styles.winText}>🎉 {winner} Wins! 🎉</Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameStarted ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Win 3 small boards in a row to win!
          </Text>
        </View>
      ) : (
        <View style={styles.gameContainer}>
          {[0, 1, 2].map(boardRow => (
            <View key={boardRow} style={styles.boardRow}>
              {[0, 1, 2].map(boardCol => {
                const boardIndex = boardRow * 3 + boardCol;
                const isActive = activeBoard === null || activeBoard === boardIndex;
                const boardWinner = boardWinners[boardIndex];

                return (
                  <View
                    key={boardCol}
                    style={[
                      styles.smallBoard,
                      !isActive && styles.inactiveBoard,
                      boardWinner && styles.wonBoard,
                    ]}
                  >
                    {boardWinner ? (
                      <Text style={styles.boardWinnerText}>{boardWinner}</Text>
                    ) : (
                      [0, 1, 2].map(cellRow => (
                        <View key={cellRow} style={styles.cellRow}>
                          {[0, 1, 2].map(cellCol => {
                            const cellIndex = cellRow * 3 + cellCol;
                            const cell = boards[boardIndex][cellIndex];

                            return (
                              <TouchableOpacity
                                key={cellCol}
                                style={styles.cell}
                                onPress={() => handlePress(boardIndex, cellIndex)}
                              >
                                <Text style={[
                                  styles.cellText,
                                  cell === 'X' ? styles.xText : styles.oText,
                                ]}>
                                  {cell}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      ))
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  turnText: {
    fontSize: 18,
    color: '#4ECDC4',
    marginTop: 10,
  },
  gameContainer: {
    alignSelf: 'center',
    marginTop: 20,
  },
  boardRow: {
    flexDirection: 'row',
  },
  smallBoard: {
    width: CELL_SIZE * 3 + 10,
    height: CELL_SIZE * 3 + 10,
    backgroundColor: '#0f3460',
    margin: 5,
    padding: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveBoard: {
    opacity: 0.4,
  },
  wonBoard: {
    backgroundColor: '#27AE60',
  },
  boardWinnerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#fff',
  },
  cellRow: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#16213e',
    margin: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 16,
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
    minHeight: 400,
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
