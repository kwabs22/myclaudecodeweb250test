import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FLASHCARDS = [
  { spanish: 'Hola', english: 'Hello' },
  { spanish: 'Adiós', english: 'Goodbye' },
  { spanish: 'Gracias', english: 'Thank you' },
  { spanish: 'Por favor', english: 'Please' },
  { spanish: 'Sí', english: 'Yes' },
  { spanish: 'No', english: 'No' },
  { spanish: 'Agua', english: 'Water' },
  { spanish: 'Comida', english: 'Food' },
  { spanish: 'Casa', english: 'House' },
  { spanish: 'Amigo', english: 'Friend' },
];

export default function LanguageFlashcardsGame() {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setCurrentCard(0);
    setShowAnswer(false);
    setCorrectCount(0);
    setGameStarted(true);
  };

  const flipCard = () => {
    setShowAnswer(!showAnswer);
  };

  const markCorrect = () => {
    setCorrectCount(correctCount + 1);
    nextCard();
  };

  const nextCard = () => {
    setShowAnswer(false);
    if (currentCard < FLASHCARDS.length - 1) {
      setCurrentCard(currentCard + 1);
    } else {
      setGameStarted(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Spanish Flashcards</Text>
        <Text style={styles.progressText}>
          {currentCard + 1}/{FLASHCARDS.length}
        </Text>
      </View>

      {!gameStarted ? (
        <View style={styles.menuContainer}>
          {correctCount > 0 && (
            <Text style={styles.resultText}>
              You got {correctCount}/{FLASHCARDS.length} correct!
            </Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {correctCount > 0 ? 'Study Again' : 'Start Learning'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Learn Spanish vocabulary with flashcards!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <TouchableOpacity style={styles.card} onPress={flipCard}>
            <View style={styles.cardContent}>
              <Text style={styles.languageLabel}>
                {showAnswer ? 'English' : 'Spanish'}
              </Text>
              <Text style={styles.wordText}>
                {showAnswer
                  ? FLASHCARDS[currentCard].english
                  : FLASHCARDS[currentCard].spanish}
              </Text>
              <Text style={styles.tapHint}>
                {showAnswer ? 'Tap to flip back' : 'Tap to see English'}
              </Text>
            </View>
          </TouchableOpacity>

          {showAnswer && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.incorrectButton]}
                onPress={nextCard}
              >
                <Text style={styles.actionText}>❌ Need Practice</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.correctButton]}
                onPress={markCorrect}
              >
                <Text style={styles.actionText}>✅ Got It!</Text>
              </TouchableOpacity>
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
    backgroundColor: '#2C3E50',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#34495E',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    minHeight: 300,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  wordText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 30,
  },
  tapHint: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  actionButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 150,
  },
  correctButton: {
    backgroundColor: '#27AE60',
  },
  incorrectButton: {
    backgroundColor: '#E74C3C',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
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
