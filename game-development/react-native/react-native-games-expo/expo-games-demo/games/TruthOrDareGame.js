import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const TRUTHS = [
  "What's your biggest fear?",
  "What's the most embarrassing thing you've done?",
  "Who was your first crush?",
  "What's a secret you've never told anyone?",
  "What's your biggest regret?",
  "If you could change one thing about yourself, what would it be?",
  "What's the worst gift you've ever received?",
  "Have you ever lied to your best friend?",
  "What's your most unusual talent?",
  "What's something you're glad your parents don't know about you?",
];

const DARES = [
  "Do 20 pushups",
  "Sing a song loudly",
  "Dance for 1 minute",
  "Call a random contact and say hello",
  "Do your best celebrity impression",
  "Speak in an accent for the next 3 rounds",
  "Let someone else post on your social media",
  "Eat a spoonful of a condiment",
  "Do a handstand for 10 seconds",
  "Tell a joke and make everyone laugh",
];

export default function TruthOrDareGame() {
  const [currentCard, setCurrentCard] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [usedCards, setUsedCards] = useState({ truths: [], dares: [] });

  const startGame = () => {
    setGameStarted(true);
    setCurrentCard(null);
    setCardType(null);
    setUsedCards({ truths: [], dares: [] });
  };

  const drawCard = (type) => {
    const pool = type === 'truth' ? TRUTHS : DARES;
    const used = type === 'truth' ? usedCards.truths : usedCards.dares;
    const available = pool.filter((_, i) => !used.includes(i));

    if (available.length === 0) {
      // Reset if all cards used
      setUsedCards(prev => ({
        ...prev,
        [type === 'truth' ? 'truths' : 'dares']: [],
      }));
      return drawCard(type);
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    setCurrentCard(pool[randomIndex]);
    setCardType(type);

    setUsedCards(prev => ({
      ...prev,
      [type === 'truth' ? 'truths' : 'dares']: [...(type === 'truth' ? prev.truths : prev.dares), randomIndex],
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Truth or Dare</Text>
      </View>

      {!gameStarted ? (
        <View style={styles.menuContainer}>
          <Text style={styles.welcomeText}>🎭</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Party Game</Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            The classic party game!{'\n'}
            Choose Truth or Dare and have fun!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          {currentCard ? (
            <View style={styles.cardContainer}>
              <View style={[
                styles.card,
                cardType === 'truth' ? styles.truthCard : styles.dareCard,
              ]}>
                <Text style={styles.cardType}>
                  {cardType === 'truth' ? '🤔 TRUTH' : '💪 DARE'}
                </Text>
                <Text style={styles.cardText}>{currentCard}</Text>
              </View>

              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => setCurrentCard(null)}
              >
                <Text style={styles.nextButtonText}>Next Player</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.choiceContainer}>
              <Text style={styles.choiceTitle}>Choose wisely...</Text>

              <TouchableOpacity
                style={[styles.choiceButton, styles.truthButton]}
                onPress={() => drawCard('truth')}
              >
                <Text style={styles.choiceEmoji}>🤔</Text>
                <Text style={styles.choiceText}>TRUTH</Text>
                <Text style={styles.choiceDesc}>Answer honestly</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.choiceButton, styles.dareButton]}
                onPress={() => drawCard('dare')}
              >
                <Text style={styles.choiceEmoji}>💪</Text>
                <Text style={styles.choiceText}>DARE</Text>
                <Text style={styles.choiceDesc}>Take the challenge</Text>
              </TouchableOpacity>
            </View>
          )}
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
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
  },
  welcomeText: {
    fontSize: 100,
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#E74C3C',
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
    lineHeight: 24,
  },
  gameArea: {
    flex: 1,
    padding: 20,
    minHeight: 400,
  },
  choiceContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  choiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
  },
  choiceButton: {
    padding: 40,
    borderRadius: 20,
    marginVertical: 15,
    alignItems: 'center',
  },
  truthButton: {
    backgroundColor: '#3498DB',
  },
  dareButton: {
    backgroundColor: '#E74C3C',
  },
  choiceEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  choiceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  choiceDesc: {
    fontSize: 16,
    color: '#ECF0F1',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    padding: 40,
    borderRadius: 20,
    marginBottom: 30,
    minHeight: 300,
    justifyContent: 'center',
  },
  truthCard: {
    backgroundColor: '#3498DB',
  },
  dareCard: {
    backgroundColor: '#E74C3C',
  },
  cardType: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  cardText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 36,
  },
  nextButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    alignSelf: 'center',
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
