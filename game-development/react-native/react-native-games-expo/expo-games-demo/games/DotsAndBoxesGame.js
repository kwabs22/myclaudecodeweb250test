import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SIZE = 4;
const DOT_SPACING = (width - 80) / GRID_SIZE;

export default function DotsAndBoxesGame() {
  const [horizontalLines, setHorizontalLines] = useState(
    Array(GRID_SIZE + 1).fill(null).map(() => Array(GRID_SIZE).fill(false))
  );
  const [verticalLines, setVerticalLines] = useState(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE + 1).fill(false))
  );
  const [boxes, setBoxes] = useState(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setHorizontalLines(Array(GRID_SIZE + 1).fill(null).map(() => Array(GRID_SIZE).fill(false)));
    setVerticalLines(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE + 1).fill(false)));
    setBoxes(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
    setGameStarted(true);
    setGameOver(false);
  };

  const drawHorizontalLine = (row, col) => {
    if (horizontalLines[row][col]) return;

    const newHLines = horizontalLines.map(r => [...r]);
    newHLines[row][col] = true;
    setHorizontalLines(newHLines);

    checkBoxCompletion(newHLines, verticalLines);
  };

  const drawVerticalLine = (row, col) => {
    if (verticalLines[row][col]) return;

    const newVLines = verticalLines.map(r => [...r]);
    newVLines[row][col] = true;
    setVerticalLines(newVLines);

    checkBoxCompletion(horizontalLines, newVLines);
  };

  const checkBoxCompletion = (hLines, vLines) => {
    const newBoxes = boxes.map(r => [...r]);
    let boxCompleted = false;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!boxes[row][col]) {
          if (
            hLines[row][col] &&
            hLines[row + 1][col] &&
            vLines[row][col] &&
            vLines[row][col + 1]
          ) {
            newBoxes[row][col] = currentPlayer;
            boxCompleted = true;

            setScores(prev => ({
              ...prev,
              [`player${currentPlayer}`]: prev[`player${currentPlayer}`] + 1,
            }));
          }
        }
      }
    }

    setBoxes(newBoxes);

    if (!boxCompleted) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }

    const totalBoxes = GRID_SIZE * GRID_SIZE;
    const filledBoxes = newBoxes.flat().filter(b => b !== null).length;
    if (filledBoxes === totalBoxes) {
      setGameOver(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.playerScore}>
          <Text style={[styles.playerText, currentPlayer === 1 && styles.activePlayer]}>
            P1: {scores.player1}
          </Text>
        </View>
        <Text style={styles.titleText}>Dots & Boxes</Text>
        <View style={styles.playerScore}>
          <Text style={[styles.playerText, currentPlayer === 2 && styles.activePlayer]}>
            P2: {scores.player2}
          </Text>
        </View>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              {scores.player1 > scores.player2
                ? '🎉 Player 1 Wins!'
                : scores.player2 > scores.player1
                ? '🎉 Player 2 Wins!'
                : "It's a Tie!"}
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Complete boxes to score points!
          </Text>
        </View>
      ) : (
        <View style={styles.gameBoard}>
          {/* Dots */}
          {Array(GRID_SIZE + 1).fill(null).map((_, row) =>
            Array(GRID_SIZE + 1).fill(null).map((_, col) => (
              <View
                key={`dot-${row}-${col}`}
                style={[
                  styles.dot,
                  {
                    left: 40 + col * DOT_SPACING,
                    top: 150 + row * DOT_SPACING,
                  },
                ]}
              />
            ))
          )}

          {/* Horizontal Lines */}
          {horizontalLines.map((row, r) =>
            row.map((line, c) => (
              <TouchableOpacity
                key={`h-${r}-${c}`}
                style={[
                  styles.horizontalLine,
                  {
                    left: 40 + c * DOT_SPACING + 5,
                    top: 150 + r * DOT_SPACING - 2,
                    backgroundColor: line ? '#4ECDC4' : '#666',
                  },
                ]}
                onPress={() => drawHorizontalLine(r, c)}
              />
            ))
          )}

          {/* Vertical Lines */}
          {verticalLines.map((row, r) =>
            row.map((line, c) => (
              <TouchableOpacity
                key={`v-${r}-${c}`}
                style={[
                  styles.verticalLine,
                  {
                    left: 40 + c * DOT_SPACING - 2,
                    top: 150 + r * DOT_SPACING + 5,
                    backgroundColor: line ? '#4ECDC4' : '#666',
                  },
                ]}
                onPress={() => drawVerticalLine(r, c)}
              />
            ))
          )}

          {/* Boxes */}
          {boxes.map((row, r) =>
            row.map((box, c) => (
              box && (
                <View
                  key={`box-${r}-${c}`}
                  style={[
                    styles.box,
                    {
                      left: 40 + c * DOT_SPACING + 5,
                      top: 150 + r * DOT_SPACING + 5,
                      backgroundColor: box === 1 ? '#FF6B6B' : '#9B59B6',
                    },
                  ]}
                >
                  <Text style={styles.boxText}>P{box}</Text>
                </View>
              )
            ))
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#16213e',
  },
  playerScore: {
    minWidth: 60,
  },
  playerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
  },
  activePlayer: {
    color: '#4ECDC4',
    fontSize: 22,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameBoard: {
    flex: 1,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  horizontalLine: {
    position: 'absolute',
    width: DOT_SPACING - 10,
    height: 4,
  },
  verticalLine: {
    position: 'absolute',
    width: 4,
    height: DOT_SPACING - 10,
  },
  box: {
    position: 'absolute',
    width: DOT_SPACING - 10,
    height: DOT_SPACING - 10,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  boxText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
