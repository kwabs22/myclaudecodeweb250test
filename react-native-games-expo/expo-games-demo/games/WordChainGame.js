import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function WordChainGame() {
  const [words, setWords] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [error, setError] = useState('');

  const startGame = () => {
    const startWord = ['CAT', 'DOG', 'SUN', 'MOON', 'STAR'][Math.floor(Math.random() * 5)];
    setWords([startWord]);
    setCurrentInput('');
    setScore(0);
    setGameStarted(true);
    setError('');
  };

  const submitWord = () => {
    const word = currentInput.toUpperCase().trim();

    if (!word) {
      setError('Enter a word!');
      return;
    }

    if (word.length < 2) {
      setError('Word too short!');
      return;
    }

    const lastWord = words[words.length - 1];
    const lastLetter = lastWord[lastWord.length - 1];

    if (word[0] !== lastLetter) {
      setError(`Must start with '${lastLetter}'!`);
      return;
    }

    if (words.includes(word)) {
      setError('Already used!');
      return;
    }

    setWords([...words, word]);
    setScore(score + word.length);
    setCurrentInput('');
    setError('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Word Chain</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      {!gameStarted ? (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Chain</Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Each word must start with the last letter of the previous word!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.chainContainer}>
            {words.map((word, index) => (
              <View key={index} style={styles.wordBubble}>
                <Text style={styles.wordText}>{word}</Text>
                {index < words.length - 1 && (
                  <Text style={styles.arrow}>→</Text>
                )}
              </View>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.hintText}>
              Next word must start with: {words[words.length - 1][words[words.length - 1].length - 1]}
            </Text>
            <TextInput
              style={styles.input}
              value={currentInput}
              onChangeText={setCurrentInput}
              placeholder="Enter word..."
              placeholderTextColor="#999"
              autoCapitalize="characters"
              onSubmitEditing={submitWord}
            />
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
            <TouchableOpacity style={styles.submitButton} onPress={submitWord}>
              <Text style={styles.submitButtonText}>Add Word</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.newGameButton} onPress={startGame}>
            <Text style={styles.newGameText}>New Game</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
    backgroundColor: '#34495E',
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
  chainContainer: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  wordBubble: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordText: {
    backgroundColor: '#3498DB',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    margin: 5,
  },
  arrow: {
    fontSize: 20,
    color: '#fff',
    marginHorizontal: 5,
  },
  inputContainer: {
    padding: 20,
  },
  hintText: {
    fontSize: 16,
    color: '#4ECDC4',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#27AE60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  newGameButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    alignItems: 'center',
  },
  newGameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
