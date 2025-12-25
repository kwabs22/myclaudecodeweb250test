import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SIZE = 4;
const TILE_SIZE = (width - 60) / GRID_SIZE;

export default function NumberSliderGame() {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    let numbers = Array.from({ length: GRID_SIZE * GRID_SIZE - 1 }, (_, i) => i + 1);
    numbers.push(null); // Empty space

    // Shuffle ensuring solvable puzzle
    for (let i = 0; i < 100; i++) {
      const emptyIndex = numbers.indexOf(null);
      const possibleMoves = getPossibleMoves(emptyIndex);
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [numbers[emptyIndex], numbers[randomMove]] = [numbers[randomMove], numbers[emptyIndex]];
    }

    setTiles(numbers);
    setMoves(0);
    setGameStarted(true);
    setGameWon(false);
  };

  const getPossibleMoves = (emptyIndex) => {
    const moves = [];
    const row = Math.floor(emptyIndex / GRID_SIZE);
    const col = emptyIndex % GRID_SIZE;

    if (row > 0) moves.push(emptyIndex - GRID_SIZE); // Up
    if (row < GRID_SIZE - 1) moves.push(emptyIndex + GRID_SIZE); // Down
    if (col > 0) moves.push(emptyIndex - 1); // Left
    if (col < GRID_SIZE - 1) moves.push(emptyIndex + 1); // Right

    return moves;
  };

  const handleTilePress = (index) => {
    const emptyIndex = tiles.indexOf(null);
    const possibleMoves = getPossibleMoves(emptyIndex);

    if (possibleMoves.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(moves + 1);

      // Check win condition
      const isWon = newTiles.every((tile, i) =>
        i === GRID_SIZE * GRID_SIZE - 1 ? tile === null : tile === i + 1
      );
      if (isWon) setGameWon(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.movesText}>Moves: {moves}</Text>
      </View>

      {!gameStarted || gameWon ? (
        <View style={styles.menuContainer}>
          {gameWon && (
            <Text style={styles.winText}>🎉 Solved in {moves} moves! 🎉</Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={initializeGame}>
            <Text style={styles.startButtonText}>
              {gameWon ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Slide tiles to arrange them in order from 1-15!
          </Text>
        </View>
      ) : (
        <View style={styles.gameBoard}>
          {tiles.map((tile, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.tile,
                tile === null && styles.emptyTile,
              ]}
              onPress={() => handleTilePress(index)}
            >
              {tile !== null && <Text style={styles.tileText}>{tile}</Text>}
            </TouchableOpacity>
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
  movesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ECF0F1',
  },
  gameBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    marginTop: 20,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: '#3498DB',
    margin: 2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2980B9',
  },
  emptyTile: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  tileText: {
    fontSize: 32,
    fontWeight: 'bold',
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
