import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export default function SolitaireGame() {
  const [deck, setDeck] = useState([]);
  const [waste, setWaste] = useState([]);
  const [foundations, setFoundations] = useState([[], [], [], []]);
  const [tableau, setTableau] = useState([[], [], [], [], [], [], []]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const createDeck = () => {
    const newDeck = [];
    SUITS.forEach(suit => {
      VALUES.forEach((value, index) => {
        newDeck.push({
          suit,
          value,
          numValue: index + 1,
          color: (suit === '♥' || suit === '♦') ? 'red' : 'black',
          faceUp: false,
        });
      });
    });
    return shuffleArray(newDeck);
  };

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const startGame = () => {
    const newDeck = createDeck();
    const newTableau = [[], [], [], [], [], [], []];

    // Deal cards to tableau
    let deckIndex = 0;
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = { ...newDeck[deckIndex] };
        card.faceUp = row === col;
        newTableau[col].push(card);
        deckIndex++;
      }
    }

    setTableau(newTableau);
    setDeck(newDeck.slice(deckIndex).map(c => ({ ...c, faceUp: false })));
    setWaste([]);
    setFoundations([[], [], [], []]);
    setSelectedCard(null);
    setGameStarted(true);
    setGameWon(false);
  };

  const drawCard = () => {
    if (deck.length > 0) {
      const card = { ...deck[0], faceUp: true };
      setDeck(deck.slice(1));
      setWaste([card, ...waste]);
    } else if (waste.length > 0) {
      setDeck(waste.map(c => ({ ...c, faceUp: false })));
      setWaste([]);
    }
  };

  const canPlaceOnFoundation = (card, foundationIndex) => {
    const foundation = foundations[foundationIndex];
    if (foundation.length === 0) {
      return card.value === 'A';
    }
    const topCard = foundation[foundation.length - 1];
    return card.suit === topCard.suit && card.numValue === topCard.numValue + 1;
  };

  const canPlaceOnTableau = (card, tableauCol) => {
    const column = tableau[tableauCol];
    if (column.length === 0) {
      return card.value === 'K';
    }
    const topCard = column[column.length - 1];
    return card.color !== topCard.color && card.numValue === topCard.numValue - 1;
  };

  const moveToFoundation = (foundationIndex) => {
    if (!selectedCard) return;

    if (canPlaceOnFoundation(selectedCard.card, foundationIndex)) {
      const newFoundations = [...foundations];
      newFoundations[foundationIndex] = [...newFoundations[foundationIndex], selectedCard.card];

      if (selectedCard.from === 'waste') {
        setWaste(waste.slice(1));
      } else if (selectedCard.from === 'tableau') {
        const newTableau = [...tableau];
        newTableau[selectedCard.colIndex].pop();
        if (newTableau[selectedCard.colIndex].length > 0) {
          newTableau[selectedCard.colIndex][newTableau[selectedCard.colIndex].length - 1].faceUp = true;
        }
        setTableau(newTableau);
      }

      setFoundations(newFoundations);
      setSelectedCard(null);

      // Check win
      if (newFoundations.every(f => f.length === 13)) {
        setGameWon(true);
      }
    }
  };

  const moveToTableau = (colIndex) => {
    if (!selectedCard) return;

    if (canPlaceOnTableau(selectedCard.card, colIndex)) {
      const newTableau = [...tableau];
      newTableau[colIndex] = [...newTableau[colIndex], selectedCard.card];

      if (selectedCard.from === 'waste') {
        setWaste(waste.slice(1));
      } else if (selectedCard.from === 'tableau' && selectedCard.colIndex !== colIndex) {
        newTableau[selectedCard.colIndex].pop();
        if (newTableau[selectedCard.colIndex].length > 0) {
          newTableau[selectedCard.colIndex][newTableau[selectedCard.colIndex].length - 1].faceUp = true;
        }
      }

      setTableau(newTableau);
      setSelectedCard(null);
    }
  };

  const selectCard = (card, from, colIndex = null) => {
    if (!card.faceUp) return;
    setSelectedCard({ card, from, colIndex });
  };

  const renderCard = (card, small = false) => {
    if (!card) return null;
    return (
      <View style={[styles.card, !card.faceUp && styles.cardBack, small && styles.smallCard]}>
        {card.faceUp ? (
          <Text style={[styles.cardText, card.color === 'red' && styles.redCard, small && styles.smallCardText]}>
            {card.value}{card.suit}
          </Text>
        ) : (
          <Text style={styles.cardBack}>🂠</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>♠ Solitaire ♥</Text>
      </View>

      {!gameStarted || gameWon ? (
        <View style={styles.menuContainer}>
          {gameWon && (
            <Text style={styles.gameWonText}>🎉 You Won! 🎉</Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameWon ? 'Play Again' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Build all suits from A to K!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          {/* Top Area */}
          <View style={styles.topArea}>
            <TouchableOpacity style={styles.deckArea} onPress={drawCard}>
              <Text style={styles.deckText}>{deck.length > 0 ? '🂠' : '↻'}</Text>
              <Text style={styles.deckCount}>{deck.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.wasteArea}
              onPress={() => waste.length > 0 && selectCard(waste[0], 'waste')}
            >
              {waste.length > 0 && renderCard(waste[0], true)}
            </TouchableOpacity>

            <View style={styles.foundations}>
              {foundations.map((foundation, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.foundationPile}
                  onPress={() => moveToFoundation(index)}
                >
                  {foundation.length > 0 ? (
                    renderCard(foundation[foundation.length - 1], true)
                  ) : (
                    <Text style={styles.emptyPile}>♠♥♦♣'[index]}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tableau */}
          <View style={styles.tableau}>
            {tableau.map((column, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={styles.tableauColumn}
                onPress={() => moveToTableau(colIndex)}
              >
                {column.length === 0 ? (
                  <View style={styles.emptyColumn} />
                ) : (
                  column.map((card, cardIndex) => (
                    <TouchableOpacity
                      key={cardIndex}
                      style={[styles.tableauCard, { marginTop: cardIndex * 20 }]}
                      onPress={() => cardIndex === column.length - 1 && selectCard(card, 'tableau', colIndex)}
                    >
                      {renderCard(card, true)}
                    </TouchableOpacity>
                  ))
                )}
              </TouchableOpacity>
            ))}
          </View>

          {selectedCard && (
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedText}>
                Selected: {selectedCard.card.value}{selectedCard.card.suit}
              </Text>
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
    backgroundColor: '#0B6623',
  },
  header: {
    padding: 20,
    backgroundColor: '#054A29',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameArea: {
    padding: 10,
  },
  topArea: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  deckArea: {
    width: 50,
    height: 70,
    backgroundColor: '#054A29',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  deckText: {
    fontSize: 24,
  },
  deckCount: {
    fontSize: 12,
    color: '#fff',
  },
  wasteArea: {
    width: 50,
    height: 70,
    backgroundColor: '#054A29',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  foundations: {
    flexDirection: 'row',
    gap: 5,
  },
  foundationPile: {
    width: 50,
    height: 70,
    backgroundColor: '#054A29',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  emptyPile: {
    fontSize: 20,
    color: '#666',
  },
  tableau: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableauColumn: {
    width: 50,
    minHeight: 100,
  },
  emptyColumn: {
    width: 50,
    height: 70,
    backgroundColor: '#054A29',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#666',
  },
  tableauCard: {
    position: 'absolute',
  },
  card: {
    width: 50,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  smallCard: {
    width: 50,
    height: 70,
  },
  cardBack: {
    backgroundColor: '#1E3A8A',
  },
  cardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  smallCardText: {
    fontSize: 12,
  },
  redCard: {
    color: '#E74C3C',
  },
  selectedInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#054A29',
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
  },
  gameWonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#054A29',
  },
  instructions: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});
