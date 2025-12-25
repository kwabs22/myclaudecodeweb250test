import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SIZE = 4;
const CELL_SIZE = (width - 60) / GRID_SIZE;
const EMOJIS = ['😀', '❤️', '🎉', '⭐', '🌈', '🎈', '🎮', '🎯'];

export default function EmojiMatchGame() {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const emojis = [...EMOJIS, ...EMOJIS];
    const shuffled = emojis.sort(() => Math.random() - 0.5);
    setGrid(shuffled);
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setGameStarted(true);
    setGameWon(false);
  };

  const handlePress = (index) => {
    if (selected.length === 2 || selected.includes(index) || matched.includes(index)) {
      return;
    }

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newSelected;

      if (grid[first] === grid[second]) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setSelected([]);

        if (newMatched.length === grid.length) {
          setGameWon(true);
        }
      } else {
        setTimeout(() => setSelected([]), 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Emoji Match</Text>
        <Text style={styles.movesText}>Moves: {moves}</Text>
      </View>

      {!gameStarted || gameWon ? (
        <View style={styles.menuContainer}>
          {gameWon && (
            <Text style={styles.winText}>
              🎉 Perfect! 🎉{'\n'}Completed in {moves} moves!
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={initializeGame}>
            <Text style={styles.startButtonText}>
              {gameWon ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Match all the emoji pairs!
          </Text>
        </View>
      ) : (
        <View style={styles.gameBoard}>
          {grid.map((emoji, index) => {
            const isSelected = selected.includes(index);
            const isMatched = matched.includes(index);
            const isVisible = isSelected || isMatched;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.cell,
                  isMatched && styles.matchedCell,
                ]}
                onPress={() => handlePress(index)}
              >
                <Text style={styles.emoji}>
                  {isVisible ? emoji : '❓'}
                </Text>
              </TouchableOpacity>
            );
          })}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  gameBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    marginTop: 20,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#3498DB',
    margin: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2980B9',
  },
  matchedCell: {
    backgroundColor: '#27AE60',
    borderColor: '#229954',
  },
  emoji: {
    fontSize: 40,
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
