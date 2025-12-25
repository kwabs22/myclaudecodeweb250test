import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react';

const WORDS = ['REACT', 'NATIVE', 'EXPO', 'GAME', 'CODE', 'APP'];
const GRID_SIZE = 10;

export default function WordSearchGame() {
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const generateGrid = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill('').map(() =>
        String.fromCharCode(65 + Math.floor(Math.random() * 26))
      )
    );

    // Place words in grid
    WORDS.forEach(word => {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 50) {
        const direction = Math.floor(Math.random() * 4); // 0: horizontal, 1: vertical, 2: diagonal-right, 3: diagonal-left
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);

        if (canPlaceWord(newGrid, word, row, col, direction)) {
          placeWord(newGrid, word, row, col, direction);
          placed = true;
        }
        attempts++;
      }
    });

    return newGrid;
  };

  const canPlaceWord = (grid, word, row, col, direction) => {
    for (let i = 0; i < word.length; i++) {
      let r = row;
      let c = col;

      if (direction === 0) c += i; // horizontal
      else if (direction === 1) r += i; // vertical
      else if (direction === 2) { r += i; c += i; } // diagonal-right
      else { r += i; c -= i; } // diagonal-left

      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (grid, word, row, col, direction) => {
    for (let i = 0; i < word.length; i++) {
      let r = row;
      let c = col;

      if (direction === 0) c += i;
      else if (direction === 1) r += i;
      else if (direction === 2) { r += i; c += i; }
      else { r += i; c -= i; }

      grid[r][c] = word[i];
    }
  };

  const startGame = () => {
    const newGrid = generateGrid();
    setGrid(newGrid);
    setFoundWords([]);
    setSelectedCells([]);
    setGameStarted(true);
    setGameWon(false);
  };

  const handleCellPress = (row, col) => {
    const cellKey = `${row},${col}`;
    const newSelected = [...selectedCells];

    if (newSelected.includes(cellKey)) {
      // Deselect
      const index = newSelected.indexOf(cellKey);
      newSelected.splice(index, 1);
    } else {
      newSelected.push(cellKey);
    }

    setSelectedCells(newSelected);

    // Check if selection forms a word
    checkForWord(newSelected);
  };

  const checkForWord = (selected) => {
    if (selected.length < 3) return;

    const letters = selected.map(key => {
      const [r, c] = key.split(',').map(Number);
      return grid[r][c];
    }).join('');

    WORDS.forEach(word => {
      if (letters === word || letters === word.split('').reverse().join('')) {
        if (!foundWords.includes(word)) {
          const newFound = [...foundWords, word];
          setFoundWords(newFound);
          setSelectedCells([]);

          if (newFound.length === WORDS.length) {
            setGameWon(true);
          }
        }
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Word Search</Text>
        <Text style={styles.scoreText}>
          {foundWords.length}/{WORDS.length}
        </Text>
      </View>

      {!gameStarted || gameWon ? (
        <View style={styles.menuContainer}>
          {gameWon && (
            <Text style={styles.winText}>
              🎉 All Words Found! 🎉
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameWon ? 'New Puzzle' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Find all the hidden words in the grid!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.gridContainer}>
            {grid.map((row, r) => (
              <View key={r} style={styles.row}>
                {row.map((letter, c) => {
                  const cellKey = `${r},${c}`;
                  const isSelected = selectedCells.includes(cellKey);

                  return (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.cell,
                        isSelected && styles.selectedCell,
                      ]}
                      onPress={() => handleCellPress(r, c)}
                    >
                      <Text style={styles.letter}>{letter}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.wordsContainer}>
            <Text style={styles.wordsTitle}>Find These Words:</Text>
            <View style={styles.wordsList}>
              {WORDS.map((word, index) => (
                <View
                  key={index}
                  style={[
                    styles.wordItem,
                    foundWords.includes(word) && styles.foundWord,
                  ]}
                >
                  <Text
                    style={[
                      styles.wordText,
                      foundWords.includes(word) && styles.foundWordText,
                    ]}
                  >
                    {word}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </ScrollView>
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
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  gridContainer: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 35,
    height: 35,
    backgroundColor: '#34495E',
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  selectedCell: {
    backgroundColor: '#4ECDC4',
  },
  letter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  wordsContainer: {
    padding: 20,
    backgroundColor: '#34495E',
    margin: 10,
    borderRadius: 10,
  },
  wordsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  wordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wordItem: {
    backgroundColor: '#2C3E50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
    borderRadius: 20,
  },
  foundWord: {
    backgroundColor: '#27AE60',
  },
  wordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  foundWordText: {
    textDecorationLine: 'line-through',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
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
  },
});
