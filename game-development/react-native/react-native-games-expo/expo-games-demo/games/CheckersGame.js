import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 40) / 8;

// Rule helpers live outside the component so they can be tested without React.
// A piece is { player: 1 | 2, king: boolean }; player 1 starts at the top and moves down.

// Returns the square jumped over when moving from (fromRow, fromCol) to (toRow, toCol) is a legal capture
// for this piece (two squares diagonally, over an opponent, onto an empty square), otherwise null.
export function jumpedSquare(board, fromRow, fromCol, toRow, toCol, piece) {
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  if (Math.abs(rowDiff) !== 2 || Math.abs(colDiff) !== 2) return null;
  if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return null;
  if (board[toRow][toCol] !== null) return null;
  if (!piece.king && rowDiff !== (piece.player === 1 ? 2 : -2)) return null;
  const midRow = fromRow + rowDiff / 2;
  const midCol = fromCol + colDiff / 2;
  const mid = board[midRow][midCol];
  return mid && mid.player !== piece.player ? { row: midRow, col: midCol } : null;
}

export function hasJump(board, row, col, piece) {
  return [-2, 2].some(dr => [-2, 2].some(dc => jumpedSquare(board, row, col, row + dr, col + dc, piece) !== null));
}

// A plain one-square diagonal move onto an empty square
export function canStep(board, fromRow, fromCol, toRow, toCol, piece) {
  if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;
  if (board[toRow][toCol] !== null) return false;
  const rowDiff = toRow - fromRow;
  if (Math.abs(toCol - fromCol) !== 1) return false;
  return piece.king ? Math.abs(rowDiff) === 1 : rowDiff === (piece.player === 1 ? 1 : -1);
}

export function hasAnyMove(board, player) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.player !== player) continue;
      if (hasJump(board, r, c, piece)) return true;
      if ([-1, 1].some(dr => [-1, 1].some(dc => canStep(board, r, c, r + dr, c + dc, piece)))) return true;
    }
  }
  return false;
}

export default function CheckersGame() {
  const [board, setBoard] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const initializeBoard = () => {
    const newBoard = Array(8).fill(null).map(() => Array(8).fill(null));

    // Place player 1 pieces (top)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = { player: 1, king: false };
        }
      }
    }

    // Place player 2 pieces (bottom)
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = { player: 2, king: false };
        }
      }
    }

    return newBoard;
  };

  const startGame = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setCurrentPlayer(1);
    setGameStarted(true);
    setGameOver(false);
    setWinner(null);
  };

  const handleCellPress = (row, col) => {
    if (!selectedPiece) {
      const piece = board[row][col];
      if (piece && piece.player === currentPlayer) {
        setSelectedPiece({ row, col });
      }
      return;
    }

    const piece = board[selectedPiece.row][selectedPiece.col];
    const captured = jumpedSquare(board, selectedPiece.row, selectedPiece.col, row, col, piece);

    if (captured || canStep(board, selectedPiece.row, selectedPiece.col, row, col, piece)) {
      const newBoard = board.map(r => r.map(c => (c ? { ...c } : null)));
      newBoard[row][col] = { ...piece };
      newBoard[selectedPiece.row][selectedPiece.col] = null;
      if (captured) newBoard[captured.row][captured.col] = null;

      // Make king
      const crowned = !piece.king && ((piece.player === 1 && row === 7) || (piece.player === 2 && row === 0));
      if (crowned) newBoard[row][col].king = true;

      setBoard(newBoard);

      // After a capture the same piece keeps going while it can jump again
      if (captured && !crowned && hasJump(newBoard, row, col, newBoard[row][col])) {
        setSelectedPiece({ row, col });
        return;
      }

      setSelectedPiece(null);
      const next = currentPlayer === 1 ? 2 : 1;
      setCurrentPlayer(next);
      checkWin(newBoard, next);
    } else if (board[row][col] && board[row][col].player === currentPlayer) {
      setSelectedPiece({ row, col });
    } else {
      setSelectedPiece(null);
    }
  };

  // The game ends when a player has no pieces left or no move to make
  const checkWin = (currentBoard, nextPlayer) => {
    const player1Pieces = currentBoard.flat().filter(p => p && p.player === 1);
    const player2Pieces = currentBoard.flat().filter(p => p && p.player === 2);

    if (player1Pieces.length === 0 || (nextPlayer === 1 && !hasAnyMove(currentBoard, 1))) {
      setWinner(2);
      setGameOver(true);
    } else if (player2Pieces.length === 0 || (nextPlayer === 2 && !hasAnyMove(currentBoard, 2))) {
      setWinner(1);
      setGameOver(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Checkers</Text>
        <Text style={styles.playerText}>
          {gameStarted && !gameOver ? `Player ${currentPlayer}'s Turn` : ''}
        </Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              🎉 Player {winner} Wins! 🎉
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Jump over a piece to capture it. Capture them all, or leave your opponent with no move, to win!
          </Text>
        </View>
      ) : (
        <View style={styles.board}>
          {board.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((cell, c) => {
                const isDark = (r + c) % 2 === 1;
                const isSelected = selectedPiece && selectedPiece.row === r && selectedPiece.col === c;

                return (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.cell,
                      isDark && styles.darkCell,
                      isSelected && styles.selectedCell,
                    ]}
                    onPress={() => handleCellPress(r, c)}
                  >
                    {cell && (
                      <View style={[
                        styles.piece,
                        cell.player === 1 ? styles.player1Piece : styles.player2Piece,
                      ]}>
                        {cell.king && (
                          <Text style={styles.kingText}>👑</Text>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
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
    padding: 20,
    backgroundColor: '#34495E',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerText: {
    fontSize: 18,
    color: '#4ECDC4',
    marginTop: 10,
  },
  board: {
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#8B4513',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#F0D9B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkCell: {
    backgroundColor: '#B58863',
  },
  selectedCell: {
    backgroundColor: '#F1C40F',
  },
  piece: {
    width: CELL_SIZE - 10,
    height: CELL_SIZE - 10,
    borderRadius: (CELL_SIZE - 10) / 2,
    borderWidth: 3,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  player1Piece: {
    backgroundColor: '#E74C3C',
  },
  player2Piece: {
    backgroundColor: '#2C3E50',
  },
  kingText: {
    fontSize: 20,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F1C40F',
    marginBottom: 30,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#3498DB',
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
