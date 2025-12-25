import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default function DiceRollerGame() {
  const [dice, setDice] = useState([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setDice([1, 1]);
    setHistory([]);
    setGameStarted(true);
  };

  const rollDice = () => {
    setRolling(true);
    let rolls = 0;
    const interval = setInterval(() => {
      setDice([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
      rolls++;
      if (rolls >= 10) {
        clearInterval(interval);
        const final = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ];
        setDice(final);
        setHistory([{ dice: final, sum: final[0] + final[1] }, ...history.slice(0, 9)]);
        setRolling(false);
      }
    }, 100);
  };

  const getTotal = () => dice[0] + dice[1];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>🎲 Dice Roller</Text>
      </View>

      {!gameStarted ? (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Rolling</Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Roll the dice and track your luck!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.diceContainer}>
            <View style={styles.die}>
              <Text style={styles.dieText}>{DICE_FACES[dice[0] - 1]}</Text>
            </View>
            <View style={styles.die}>
              <Text style={styles.dieText}>{DICE_FACES[dice[1] - 1]}</Text>
            </View>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{getTotal()}</Text>
          </View>

          <TouchableOpacity
            style={[styles.rollButton, rolling && styles.rollingButton]}
            onPress={rollDice}
            disabled={rolling}
          >
            <Text style={styles.rollButtonText}>
              {rolling ? 'Rolling...' : 'Roll Dice'}
            </Text>
          </TouchableOpacity>

          {history.length > 0 && (
            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Recent Rolls:</Text>
              {history.map((roll, index) => (
                <View key={index} style={styles.historyItem}>
                  <Text style={styles.historyDice}>
                    {DICE_FACES[roll.dice[0] - 1]} {DICE_FACES[roll.dice[1] - 1]}
                  </Text>
                  <Text style={styles.historySum}>= {roll.sum}</Text>
                </View>
              ))}
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
    backgroundColor: '#27ae60',
  },
  header: {
    padding: 20,
    backgroundColor: '#229954',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  diceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  die: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  dieText: {
    fontSize: 80,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  totalLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  totalValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#F1C40F',
  },
  rollButton: {
    backgroundColor: '#e74c3c',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  rollingButton: {
    opacity: 0.6,
  },
  rollButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyContainer: {
    backgroundColor: '#229954',
    padding: 15,
    borderRadius: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#27ae60',
  },
  historyDice: {
    fontSize: 24,
  },
  historySum: {
    fontSize: 18,
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
    backgroundColor: '#fff',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  instructions: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});
