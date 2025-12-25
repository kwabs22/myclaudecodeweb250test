import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PanResponder, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width - 40;

const WORDS = [
  'Cat', 'Dog', 'House', 'Tree', 'Car', 'Sun', 'Moon', 'Star', 'Fish', 'Bird',
  'Flower', 'Cloud', 'Heart', 'Pizza', 'Book', 'Phone', 'Chair', 'Apple', 'Banana', 'Smile',
];

export default function DrawingGuessGame() {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [word, setWord] = useState('');
  const [guess, setGuess] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const timerRef = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(`M${locationX},${locationY}`);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prev => `${prev} L${locationX},${locationY}`);
      },
      onPanResponderRelease: () => {
        if (currentPath) {
          setPaths([...paths, currentPath]);
          setCurrentPath('');
        }
      },
    })
  ).current;

  const startGame = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(newWord);
    setPaths([]);
    setCurrentPath('');
    setGuess('');
    setScore(0);
    setTimeLeft(60);
    setGameStarted(true);
    setGameOver(false);
    setShowAnswer(false);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath('');
  };

  const skipWord = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(newWord);
    setPaths([]);
    setCurrentPath('');
    setShowAnswer(false);
  };

  const makeGuess = (guessWord) => {
    if (guessWord.toLowerCase() === word.toLowerCase()) {
      setScore(score + 10);
      setShowAnswer(true);
      setTimeout(() => {
        skipWord();
      }, 1500);
    }
  };

  const guessOptions = () => {
    const options = [word];
    while (options.length < 4) {
      const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
      if (!options.includes(randomWord)) {
        options.push(randomWord);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>🎨 Draw & Guess</Text>
        {gameStarted && !gameOver && (
          <View style={styles.stats}>
            <Text style={styles.statText}>⏱️ {timeLeft}s</Text>
            <Text style={styles.statText}>⭐ {score}</Text>
          </View>
        )}
      </View>

      {!gameStarted || gameOver ? (
        <View style={styles.menuContainer}>
          {gameOver && (
            <>
              <Text style={styles.gameOverText}>Time's Up!</Text>
              <Text style={styles.finalScore}>Final Score: {score}</Text>
            </>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameOver ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Draw the word and guess others!{'\n'}
            Score points for correct guesses!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.wordDisplay}>
            <Text style={styles.wordLabel}>Draw this:</Text>
            <Text style={styles.wordText}>{word}</Text>
          </View>

          <View style={styles.canvasContainer}>
            <View
              {...panResponder.panHandlers}
              style={styles.canvas}
            >
              <Svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
                {paths.map((path, index) => (
                  <Path
                    key={index}
                    d={path}
                    stroke="#000"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
                {currentPath && (
                  <Path
                    d={currentPath}
                    stroke="#000"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </Svg>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={skipWord}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {showAnswer && (
            <View style={styles.correctBanner}>
              <Text style={styles.correctText}>✓ Correct! +10</Text>
            </View>
          )}

          <View style={styles.guessArea}>
            <Text style={styles.guessLabel}>Practice Guessing:</Text>
            <View style={styles.guessOptions}>
              {guessOptions().map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.guessButton,
                    showAnswer && option === word && styles.correctGuess,
                  ]}
                  onPress={() => !showAnswer && makeGuess(option)}
                  disabled={showAnswer}
                >
                  <Text style={styles.guessButtonText}>{option}</Text>
                </TouchableOpacity>
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
    backgroundColor: '#F5F5DC',
  },
  header: {
    padding: 20,
    backgroundColor: '#8B4789',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  statText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  gameArea: {
    flex: 1,
    padding: 20,
  },
  wordDisplay: {
    backgroundColor: '#8B4789',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  wordLabel: {
    fontSize: 16,
    color: '#fff',
  },
  wordText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 5,
  },
  canvasContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  canvas: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#8B4789',
    borderRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  clearButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 15,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  skipButton: {
    backgroundColor: '#95A5A6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 15,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  correctBanner: {
    backgroundColor: '#27AE60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  correctText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  guessArea: {
    backgroundColor: '#DEB887',
    padding: 15,
    borderRadius: 10,
  },
  guessLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  guessOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  guessButton: {
    backgroundColor: '#8B4789',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    margin: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  correctGuess: {
    backgroundColor: '#27AE60',
  },
  guessButtonText: {
    fontSize: 14,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B4789',
    marginBottom: 10,
  },
  finalScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#8B4789',
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
    color: '#666',
    textAlign: 'center',
  },
});
