import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "React Native is an amazing framework for mobile development.",
  "Expo makes it easy to build cross-platform applications.",
  "Practice makes perfect when learning to type faster.",
  "Game development requires creativity and technical skills.",
];

export default function TypeRacerGame() {
  const [targetText, setTargetText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    if (userInput.length > 0) {
      const correctChars = userInput.split('').filter((char, i) =>
        char === targetText[i]
      ).length;
      const acc = Math.round((correctChars / userInput.length) * 100);
      setAccuracy(acc);

      const timeElapsed = (Date.now() - startTimeRef.current) / 1000 / 60;
      const wordsTyped = userInput.length / 5;
      const calculatedWpm = Math.round(wordsTyped / timeElapsed);
      setWpm(calculatedWpm || 0);

      if (userInput === targetText) {
        setGameOver(true);
      }
    }
  }, [userInput, targetText]);

  const startGame = () => {
    const randomSentence = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
    setTargetText(randomSentence);
    setUserInput('');
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    setGameStarted(true);
    setGameOver(false);
    startTimeRef.current = Date.now();
  };

  const getColoredText = () => {
    return targetText.split('').map((char, i) => {
      let color = '#666';
      if (i < userInput.length) {
        color = userInput[i] === char ? '#27AE60' : '#E74C3C';
      }
      return (
        <Text key={i} style={{ color, fontSize: 20 }}>
          {char}
        </Text>
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Type Racer</Text>
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <View style={styles.results}>
              <Text style={styles.resultText}>
                {userInput === targetText ? '🎉 Complete! 🎉' : '⏰ Time Up!'}
              </Text>
              <Text style={styles.statText}>WPM: {wpm}</Text>
              <Text style={styles.statText}>Accuracy: {accuracy}%</Text>
            </View>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Race Again' : 'Start Race'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Type the text as fast and accurately as you can!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.stats}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>WPM</Text>
              <Text style={styles.statValue}>{wpm}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Time</Text>
              <Text style={styles.statValue}>{timeLeft}s</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Accuracy</Text>
              <Text style={styles.statValue}>{accuracy}%</Text>
            </View>
          </View>

          <View style={styles.textDisplay}>
            {getColoredText()}
          </View>

          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Start typing..."
            placeholderTextColor="#999"
            multiline
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    backgroundColor: '#16213e',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  textDisplay: {
    backgroundColor: '#0f3460',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 100,
  },
  input: {
    backgroundColor: '#16213e',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    color: '#fff',
    minHeight: 100,
  },
  gameArea: {
    paddingBottom: 20,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
  },
  results: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F1C40F',
    marginBottom: 20,
  },
  statText: {
    fontSize: 20,
    color: '#fff',
    marginVertical: 5,
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
