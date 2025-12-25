import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 40) / 8;

const PIECES = {
  '♔': 'king', '♕': 'queen', '♖': 'rook', '♗': 'bishop', '♘': 'knight', '♙': 'pawn',
  '♚': 'king', '♛': 'queen', '♜': 'rook', '♝': 'bishop', '♞': 'knight', '♟': 'pawn',
};

export default function ChessGame() {
  const [board, setBoard] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const initializeBoard = () => {
    const newBoard = [
      ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
      ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
      ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
    ];
    return newBoard;
  };

  const startGame = () => {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setCurrentPlayer('white');
    setGameStarted(true);
    setGameOver(false);
    setWinner(null);
  };

  const isWhitePiece = (piece) => {
    return piece && '♔♕♖♗♘♙'.includes(piece);
  };

  const isBlackPiece = (piece) => {
    return piece && '♚♛♜♝♞♟'.includes(piece);
  };

  const isValidMove = (fromRow, fromCol, toRow, toCol) => {
    if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) return false;

    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];

    // Can't capture own piece
    if (currentPlayer === 'white' && isWhitePiece(targetPiece)) return false;
    if (currentPlayer === 'black' && isBlackPiece(targetPiece)) return false;

    const pieceType = PIECES[piece];
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Simplified movement rules
    switch (pieceType) {
      case 'pawn':
        if (currentPlayer === 'white') {
          if (colDiff === 0 && toRow === fromRow - 1 && !targetPiece) return true;
          if (colDiff === 0 && fromRow === 6 && toRow === 4 && !board[5][fromCol] && !targetPiece) return true;
          if (colDiff === 1 && toRow === fromRow - 1 && targetPiece) return true;
        } else {
          if (colDiff === 0 && toRow === fromRow + 1 && !targetPiece) return true;
          if (colDiff === 0 && fromRow === 1 && toRow === 3 && !board[2][fromCol] && !targetPiece) return true;
          if (colDiff === 1 && toRow === fromRow + 1 && targetPiece) return true;
        }
        return false;

      case 'knight':
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

      case 'bishop':
        return rowDiff === colDiff && rowDiff > 0;

      case 'rook':
        return (rowDiff > 0 && colDiff === 0) || (rowDiff === 0 && colDiff > 0);

      case 'queen':
        return (rowDiff === colDiff) || (rowDiff > 0 && colDiff === 0) || (rowDiff === 0 && colDiff > 0);

      case 'king':
        return rowDiff <= 1 && colDiff <= 1;

      default:
        return false;
    }
  };

  const handleCellPress = (row, col) => {
    if (!selectedPiece) {
      const piece = board[row][col];
      if (piece) {
        if ((currentPlayer === 'white' && isWhitePiece(piece)) ||
            (currentPlayer === 'black' && isBlackPiece(piece))) {
          setSelectedPiece({ row, col });
        }
      }
    } else {
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        return;
      }

      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        const newBoard = board.map(r => [...r]);
        const capturedPiece = newBoard[row][col];
        newBoard[row][col] = newBoard[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = null;

        setBoard(newBoard);
        setSelectedPiece(null);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');

        // Check for king capture
        if (capturedPiece === '♔') {
          setWinner('black');
          setGameOver(true);
        } else if (capturedPiece === '♚') {
          setWinner('white');
          setGameOver(true);
        }
      } else {
        setSelectedPiece(null);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>♔ Chess ♚</Text>
        <Text style={styles.playerText}>
          {gameStarted && !gameOver ? `${currentPlayer === 'white' ? 'White' : 'Black'}'s Turn` : ''}
        </Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              🎉 {winner === 'white' ? 'White' : 'Black'} Wins! 🎉
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Simplified chess rules{'\n'}
            Capture the king to win!
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
                      <Text style={styles.piece}>{cell}</Text>
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
    fontSize: 28,
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
    fontSize: 32,
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
