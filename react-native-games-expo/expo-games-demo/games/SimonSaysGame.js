import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const COLORS = [
  { id: 0, color: '#FF6B6B', name: 'Red' },
  { id: 1, color: '#4ECDC4', name: 'Blue' },
  { id: 2, color: '#F1C40F', name: 'Yellow' },
  { id: 3, color: '#27AE60', name: 'Green' },
];

export default function SimonSaysGame() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [score, setScore] = useState(0);

  const playSequence = async (seq) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveButton(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveButton(null);
    }
    setIsPlaying(false);
  };

  const addToSequence = () => {
    const newColor = Math.floor(Math.random() * 4);
    const newSequence = [...sequence, newColor];
    setSequence(newSequence);
    playSequence(newSequence);
  };

  const handleButtonPress = (colorId) => {
    if (isPlaying) return;

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    // Check if correct
    if (colorId !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      return;
    }

    // Check if sequence complete
    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      setPlayerSequence([]);
      setTimeout(() => addToSequence(), 1000);
    }
  };

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    setTimeout(() => addToSequence(), 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Simon Says</Text>
        <Text style={styles.scoreText}>Round: {score}</Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              Game Over! You reached round {score}!
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Watch the sequence and repeat it!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.gameBoard}>
            <View style={styles.row}>
              {[0, 1].map(colorId => (
                <TouchableOpacity
                  key={colorId}
                  style={[
                    styles.colorButton,
                    {
                      backgroundColor: COLORS[colorId].color,
                      opacity: activeButton === colorId ? 1 : 0.5,
                    },
                  ]}
                  onPress={() => handleButtonPress(colorId)}
                  disabled={isPlaying}
                />
              ))}
            </View>
            <View style={styles.row}>
              {[2, 3].map(colorId => (
                <TouchableOpacity
                  key={colorId}
                  style={[
                    styles.colorButton,
                    {
                      backgroundColor: COLORS[colorId].color,
                      opacity: activeButton === colorId ? 1 : 0.5,
                    },
                  ]}
                  onPress={() => handleButtonPress(colorId)}
                  disabled={isPlaying}
                />
              ))}
            </View>
          </View>

          {isPlaying && (
            <Text style={styles.watchText}>Watch carefully...</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    backgroundColor: '#2a2a2a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  gameBoard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  colorButton: {
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  watchText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
