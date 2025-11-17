import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GRID_SIZE = 3;
const TILE_SIZE = (width - 80) / GRID_SIZE;

const IMAGES = [
  { emoji: '🌈', colors: ['#FF6B6B', '#F1C40F', '#3498DB'] },
  { emoji: '🌸', colors: ['#FF69B4', '#FFC0CB', '#FF1493'] },
  { emoji: '🎨', colors: ['#9B59B6', '#E74C3C', '#F39C12'] },
];

export default function SlidingPuzzleGame() {
  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const initializeGame = (imageIndex) => {
    const totalTiles = GRID_SIZE * GRID_SIZE;
    const puzzleTiles = Array.from({ length: totalTiles - 1 }, (_, i) => ({
      id: i,
      position: i,
      correctPosition: i,
    }));
    puzzleTiles.push({ id: totalTiles - 1, position: totalTiles - 1, empty: true });

    // Shuffle
    for (let i = 0; i < 100; i++) {
      const emptyTile = puzzleTiles.find(t => t.empty);
      const possibleMoves = getPossibleMoves(emptyTile.position);
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      const tileToMove = puzzleTiles.find(t => t.position === randomMove);

      const tempPos = emptyTile.position;
      emptyTile.position = tileToMove.position;
      tileToMove.position = tempPos;
    }

    setTiles(puzzleTiles);
    setMoves(0);
    setGameStarted(true);
    setGameWon(false);
    setSelectedImage(imageIndex);
  };

  const getPossibleMoves = (emptyPos) => {
    const moves = [];
    const row = Math.floor(emptyPos / GRID_SIZE);
    const col = emptyPos % GRID_SIZE;

    if (row > 0) moves.push(emptyPos - GRID_SIZE);
    if (row < GRID_SIZE - 1) moves.push(emptyPos + GRID_SIZE);
    if (col > 0) moves.push(emptyPos - 1);
    if (col < GRID_SIZE - 1) moves.push(emptyPos + 1);

    return moves;
  };

  const handleTilePress = (tile) => {
    if (tile.empty) return;

    const emptyTile = tiles.find(t => t.empty);
    const possibleMoves = getPossibleMoves(emptyTile.position);

    if (possibleMoves.includes(tile.position)) {
      const newTiles = tiles.map(t => {
        if (t.id === tile.id) {
          return { ...t, position: emptyTile.position };
        } else if (t.empty) {
          return { ...t, position: tile.position };
        }
        return t;
      });

      setTiles(newTiles);
      setMoves(moves + 1);

      // Check win
      const isWon = newTiles.every(t => t.empty || t.position === t.correctPosition);
      if (isWon) setGameWon(true);
    }
  };

  const getTileColor = (id) => {
    const row = Math.floor(id / GRID_SIZE);
    return IMAGES[selectedImage].colors[row % IMAGES[selectedImage].colors.length];
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Sliding Puzzle</Text>
        <Text style={styles.movesText}>Moves: {moves}</Text>
      </View>

      {!gameStarted || gameWon ? (
        <View style={styles.menuContainer}>
          {gameWon && (
            <Text style={styles.winText}>
              🎉 Solved in {moves} moves! 🎉
            </Text>
          )}
          <Text style={styles.selectText}>Select a puzzle:</Text>
          <View style={styles.imageSelector}>
            {IMAGES.map((img, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageOption}
                onPress={() => initializeGame(index)}
              >
                <Text style={styles.imageEmoji}>{img.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.instructions}>
            Slide tiles to recreate the pattern!
          </Text>
        </View>
      ) : (
        <View style={styles.gameBoard}>
          {Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, position) => {
            const tile = tiles.find(t => t.position === position);
            return (
              <TouchableOpacity
                key={position}
                style={[
                  styles.tile,
                  tile && !tile.empty && { backgroundColor: getTileColor(tile.id) },
                  tile && tile.empty && styles.emptyTile,
                ]}
                onPress={() => tile && handleTilePress(tile)}
              >
                {tile && !tile.empty && (
                  <Text style={styles.tileNumber}>{tile.id + 1}</Text>
                )}
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
    padding: 20,
    marginTop: 20,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 3,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  emptyTile: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  tileNumber: {
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
  selectText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  imageSelector: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  imageOption: {
    backgroundColor: '#3498DB',
    margin: 10,
    padding: 20,
    borderRadius: 15,
  },
  imageEmoji: {
    fontSize: 60,
  },
  instructions: {
    fontSize: 16,
    color: '#95A5A6',
    textAlign: 'center',
  },
});
