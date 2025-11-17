import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 60) / 4;

const EMOJIS = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎸'];

export default function MemoryCardGame() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameStarted(true);
    setGameWon(false);
  };

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      if (cards[first].emoji === cards[second].emoji) {
        setMatchedPairs([...matchedPairs, cards[first].emoji]);
        setTimeout(() => {
          setFlippedIndices([]);
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
      setMoves(moves + 1);
    }
  }, [flippedIndices]);

  useEffect(() => {
    if (matchedPairs.length === EMOJIS.length && gameStarted) {
      setGameWon(true);
    }
  }, [matchedPairs]);

  const handleCardPress = (index) => {
    if (
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      matchedPairs.includes(cards[index].emoji)
    ) {
      return;
    }
    setFlippedIndices([...flippedIndices, index]);
  };

  const isCardVisible = (index) => {
    return (
      flippedIndices.includes(index) ||
      matchedPairs.includes(cards[index].emoji)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.movesText}>Moves: {moves}</Text>
        <Text style={styles.pairsText}>
          Pairs: {matchedPairs.length}/{EMOJIS.length}
        </Text>
      </View>

      {!gameStarted || gameWon ? (
        <View style={styles.menuContainer}>
          {gameWon && (
            <View style={styles.winContainer}>
              <Text style={styles.winText}>🎉 You Won! 🎉</Text>
              <Text style={styles.winSubtext}>
                Completed in {moves} moves
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.startButton} onPress={initializeGame}>
            <Text style={styles.startButtonText}>
              {gameWon ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Find all matching pairs of emojis!
          </Text>
        </View>
      ) : (
        <View style={styles.gameBoard}>
          {cards.map((card, index) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                matchedPairs.includes(card.emoji) && styles.matchedCard,
              ]}
              onPress={() => handleCardPress(index)}
            >
              <Text style={styles.cardText}>
                {isCardVisible(index) ? card.emoji : '?'}
              </Text>
            </TouchableOpacity>
          ))}
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#34495E',
  },
  movesText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ECF0F1',
  },
  pairsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ECF0F1',
  },
  gameBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    marginTop: 20,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: '#3498DB',
    margin: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2980B9',
  },
  matchedCard: {
    backgroundColor: '#27AE60',
    borderColor: '#229954',
  },
  cardText: {
    fontSize: 40,
    color: '#fff',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  winContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  winText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F1C40F',
    marginBottom: 10,
  },
  winSubtext: {
    fontSize: 18,
    color: '#ECF0F1',
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
