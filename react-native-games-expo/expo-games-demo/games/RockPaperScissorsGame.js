import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CHOICES = [
  { name: 'Rock', emoji: '🪨', beats: 'Scissors' },
  { name: 'Paper', emoji: '📄', beats: 'Rock' },
  { name: 'Scissors', emoji: '✂️', beats: 'Paper' },
];

export default function RockPaperScissorsGame() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [cpuChoice, setCpuChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, cpu: 0, ties: 0 });
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setPlayerChoice(null);
    setCpuChoice(null);
    setResult(null);
    setScore({ player: 0, cpu: 0, ties: 0 });
    setGameStarted(true);
  };

  const play = (choice) => {
    const cpuSelection = CHOICES[Math.floor(Math.random() * 3)];
    setPlayerChoice(choice);
    setCpuChoice(cpuSelection);

    if (choice.name === cpuSelection.name) {
      setResult('Tie!');
      setScore(prev => ({ ...prev, ties: prev.ties + 1 }));
    } else if (choice.beats === cpuSelection.name) {
      setResult('You Win!');
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      setResult('CPU Wins!');
      setScore(prev => ({ ...prev, cpu: prev.cpu + 1 }));
    }
  };

  const resetRound = () => {
    setPlayerChoice(null);
    setCpuChoice(null);
    setResult(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Rock Paper Scissors</Text>
      </View>

      {!gameStarted ? (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Best of unlimited! Choose wisely!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.scoreBoard}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>You</Text>
              <Text style={styles.scoreValue}>{score.player}</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Ties</Text>
              <Text style={styles.scoreValue}>{score.ties}</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>CPU</Text>
              <Text style={styles.scoreValue}>{score.cpu}</Text>
            </View>
          </View>

          {result ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>{result}</Text>

              <View style={styles.choicesRow}>
                <View style={styles.choiceResult}>
                  <Text style={styles.choiceLabel}>You</Text>
                  <Text style={styles.choiceEmoji}>{playerChoice.emoji}</Text>
                  <Text style={styles.choiceName}>{playerChoice.name}</Text>
                </View>

                <Text style={styles.vs}>VS</Text>

                <View style={styles.choiceResult}>
                  <Text style={styles.choiceLabel}>CPU</Text>
                  <Text style={styles.choiceEmoji}>{cpuChoice.emoji}</Text>
                  <Text style={styles.choiceName}>{cpuChoice.name}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.playAgainButton} onPress={resetRound}>
                <Text style={styles.playAgainText}>Next Round</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.choicesContainer}>
              <Text style={styles.chooseText}>Choose your weapon:</Text>
              <View style={styles.choices}>
                {CHOICES.map(choice => (
                  <TouchableOpacity
                    key={choice.name}
                    style={styles.choiceButton}
                    onPress={() => play(choice)}
                  >
                    <Text style={styles.choiceButtonEmoji}>{choice.emoji}</Text>
                    <Text style={styles.choiceButtonText}>{choice.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
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
    padding: 20,
    backgroundColor: '#16213e',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameArea: {
    flex: 1,
    padding: 20,
  },
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0f3460',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#999',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  choicesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  chooseText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  choices: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  choiceButton: {
    backgroundColor: '#0f3460',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: 110,
  },
  choiceButtonEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  choiceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#F1C40F',
    marginBottom: 40,
  },
  choicesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  choiceResult: {
    alignItems: 'center',
  },
  choiceLabel: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
  },
  choiceEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  choiceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  vs: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
    marginHorizontal: 20,
  },
  playAgainButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  playAgainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
