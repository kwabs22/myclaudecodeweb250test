import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MemoryTrainingGame() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(0);
  const [activeNumber, setActiveNumber] = useState(null);

  const playSequence = async (seq) => {
    setIsPlaying(true);
    for (let num of seq) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveNumber(num);
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveNumber(null);
    }
    setIsPlaying(false);
  };

  const addToSequence = () => {
    const newNum = Math.floor(Math.random() * 9) + 1;
    const newSequence = [...sequence, newNum];
    setSequence(newSequence);
    setRound(round + 1);
    playSequence(newSequence);
  };

  const handleNumberPress = (num) => {
    if (isPlaying) return;

    const newPlayerSequence = [...playerSequence, num];
    setPlayerSequence(newPlayerSequence);

    if (num !== sequence[newPlayerSequence.length - 1]) {
      setGameOver(true);
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setPlayerSequence([]);
      setTimeout(() => addToSequence(), 1000);
    }
  };

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setRound(0);
    setGameStarted(true);
    setGameOver(false);
    setTimeout(() => addToSequence(), 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Memory Training</Text>
        <Text style={styles.roundText}>Round: {round}</Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <Text style={styles.gameOverText}>
              Final Round: {round}!
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Try Again' : 'Start Training'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Remember the sequence and repeat it!
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statusContainer}>
            {isPlaying ? (
              <Text style={styles.statusText}>Watch carefully...</Text>
            ) : (
              <Text style={styles.statusText}>Your turn! ({playerSequence.length}/{sequence.length})</Text>
            )}
          </View>

          <View style={styles.numberGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.numberButton,
                  activeNumber === num && styles.activeButton,
                ]}
                onPress={() => handleNumberPress(num)}
                disabled={isPlaying}
              >
                <Text style={styles.numberText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
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
    padding: 20,
    backgroundColor: '#16213e',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  roundText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  statusContainer: {
    padding: 30,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
  },
  numberButton: {
    width: 100,
    height: 100,
    backgroundColor: '#0f3460',
    margin: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4ECDC4',
  },
  activeButton: {
    backgroundColor: '#4ECDC4',
    transform: [{ scale: 1.1 }],
  },
  numberText: {
    fontSize: 40,
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
    color: '#999',
    textAlign: 'center',
  },
});
