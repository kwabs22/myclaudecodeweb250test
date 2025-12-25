import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SIZE = 3;
const PIECE_SIZE = (width - 80) / GRID_SIZE;

const COLORS = [
  ['#FF6B6B', '#4ECDC4', '#45B7D1'],
  ['#F7DC6F', '#BB8FCE', '#85C1E2'],
  ['#F8B739', '#52B788', '#E63946'],
];

export default function JigsawPuzzleGame() {
  const [pieces, setPieces] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const initializeGame = () => {
    const puzzlePieces = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        puzzlePieces.push({
          id: y * GRID_SIZE + x,
          correctPos: { x, y },
          currentPos: { x, y },
          color: COLORS[y][x],
        });
      }
    }

    // Shuffle pieces
    for (let i = puzzlePieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = puzzlePieces[i].currentPos;
      puzzlePieces[i].currentPos = puzzlePieces[j].currentPos;
      puzzlePieces[j].currentPos = temp;
    }

    setPieces(puzzlePieces);
    setGameStarted(true);
    setGameWon(false);
    setMoves(0);
    setSelectedPiece(null);
  };

  const handlePiecePress = (piece) => {
    if (selectedPiece === null) {
      setSelectedPiece(piece);
    } else {
      // Swap pieces
      const newPieces = pieces.map(p => {
        if (p.id === selectedPiece.id) {
          return { ...p, currentPos: piece.currentPos };
        } else if (p.id === piece.id) {
          return { ...p, currentPos: selectedPiece.currentPos };
        }
        return p;
      });

      setPieces(newPieces);
      setSelectedPiece(null);
      setMoves(moves + 1);

      // Check win condition
      const isWon = newPieces.every(p =>
        p.currentPos.x === p.correctPos.x && p.currentPos.y === p.correctPos.y
      );
      if (isWon) {
        setGameWon(true);
      }
    }
  };

  const getPieceAtPosition = (x, y) => {
    return pieces.find(p => p.currentPos.x === x && p.currentPos.y === y);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Jigsaw Puzzle</Text>
        <Text style={styles.movesText}>Moves: {moves}</Text>
      </View>

      {!gameStarted || gameWon ? (
        <View style={styles.menuContainer}>
          {gameWon && (
            <Text style={styles.winText}>
              🎉 Puzzle Complete! 🎉{'\n'}
              Solved in {moves} moves!
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={initializeGame}>
            <Text style={styles.startButtonText}>
              {gameWon ? 'New Puzzle' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Tap two pieces to swap them!{'\n'}
            Arrange them to match the pattern.
          </Text>
        </View>
      ) : (
        <View style={styles.puzzleContainer}>
          <View style={styles.board}>
            {Array(GRID_SIZE).fill(null).map((_, y) => (
              <View key={y} style={styles.row}>
                {Array(GRID_SIZE).fill(null).map((_, x) => {
                  const piece = getPieceAtPosition(x, y);
                  const isSelected = selectedPiece && selectedPiece.id === piece.id;

                  return (
                    <TouchableOpacity
                      key={x}
                      style={[
                        styles.piece,
                        { backgroundColor: piece.color },
                        isSelected && styles.selectedPiece,
                      ]}
                      onPress={() => handlePiecePress(piece)}
                    >
                      <Text style={styles.pieceNumber}>
                        {piece.id + 1}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.hintContainer}>
            <Text style={styles.hintTitle}>Solution Preview:</Text>
            <View style={styles.hintBoard}>
              {COLORS.map((row, y) => (
                <View key={y} style={styles.hintRow}>
                  {row.map((color, x) => (
                    <View
                      key={x}
                      style={[
                        styles.hintPiece,
                        { backgroundColor: color },
                      ]}
                    >
                      <Text style={styles.hintNumber}>
                        {y * GRID_SIZE + x + 1}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
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
  puzzleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  board: {
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
  },
  piece: {
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPiece: {
    borderColor: '#F1C40F',
    borderWidth: 4,
  },
  pieceNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hintContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  hintTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ECF0F1',
    marginBottom: 10,
  },
  hintBoard: {
    transform: [{ scale: 0.5 }],
  },
  hintRow: {
    flexDirection: 'row',
  },
  hintPiece: {
    width: PIECE_SIZE,
    height: PIECE_SIZE,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0.7,
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
    color: '#95A5A6',
    textAlign: 'center',
    lineHeight: 24,
  },
});
