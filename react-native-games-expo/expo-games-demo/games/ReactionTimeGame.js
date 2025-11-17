import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ReactionTimeGame() {
  const [gameState, setGameState] = useState('ready'); // ready, waiting, click, result
  const [bestTime, setBestTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);

  const startGame = () => {
    setGameState('waiting');
    setCurrentTime(null);

    const delay = Math.random() * 3000 + 1000;
    timeoutRef.current = setTimeout(() => {
      setGameState('click');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handlePress = () => {
    if (gameState === 'waiting') {
      clearTimeout(timeoutRef.current);
      setGameState('result');
      setCurrentTime('Too early!');
    } else if (gameState === 'click') {
      const reactionTime = Date.now() - startTimeRef.current;
      setCurrentTime(reactionTime);
      const newAttempts = [...attempts, reactionTime];
      setAttempts(newAttempts);

      if (!bestTime || reactionTime < bestTime) {
        setBestTime(reactionTime);
      }

      setGameState('result');
    }
  };

  const reset = () => {
    setGameState('ready');
    setCurrentTime(null);
  };

  const getAverageTime = () => {
    if (attempts.length === 0) return null;
    const sum = attempts.reduce((a, b) => a + b, 0);
    return Math.round(sum / attempts.length);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Reaction Time</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Best</Text>
          <Text style={styles.statValue}>
            {bestTime ? `${bestTime}ms` : '-'}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>
            {getAverageTime() ? `${getAverageTime()}ms` : '-'}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Attempts</Text>
          <Text style={styles.statValue}>{attempts.length}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.gameArea,
          gameState === 'waiting' && styles.waitingArea,
          gameState === 'click' && styles.clickArea,
        ]}
        onPress={gameState === 'ready' ? startGame : handlePress}
        activeOpacity={1}
      >
        {gameState === 'ready' && (
          <Text style={styles.instructionText}>
            Tap to start{'\n\n'}
            When the screen turns GREEN,{'\n'}tap as fast as you can!
          </Text>
        )}

        {gameState === 'waiting' && (
          <Text style={styles.waitText}>Wait for green...</Text>
        )}

        {gameState === 'click' && (
          <Text style={styles.clickText}>TAP NOW!</Text>
        )}

        {gameState === 'result' && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {typeof currentTime === 'number'
                ? `${currentTime}ms`
                : currentTime}
            </Text>
            {typeof currentTime === 'number' && (
              <Text style={styles.resultSubtext}>
                {currentTime < 200 ? '⚡ Lightning fast!' :
                 currentTime < 300 ? '🔥 Great!' :
                 currentTime < 400 ? '👍 Good' :
                 '🐌 Keep practicing!'}
              </Text>
            )}
            <TouchableOpacity style={styles.retryButton} onPress={reset}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
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
  statsContainer: {
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
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 20,
    backgroundColor: '#0f3460',
  },
  waitingArea: {
    backgroundColor: '#E74C3C',
  },
  clickArea: {
    backgroundColor: '#27AE60',
  },
  instructionText: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 34,
    padding: 20,
  },
  waitText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  clickText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultContainer: {
    alignItems: 'center',
  },
  resultText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#F1C40F',
  },
  resultSubtext: {
    fontSize: 24,
    color: '#fff',
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 40,
  },
  retryButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
