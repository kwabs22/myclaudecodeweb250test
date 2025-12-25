import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function ClickerGame() {
  const [coins, setCoins] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted && autoClickers > 0) {
      const interval = setInterval(() => {
        setCoins(prev => prev + autoClickers);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameStarted, autoClickers]);

  const handleClick = () => {
    setCoins(coins + clickPower);
  };

  const buyClickPower = () => {
    const cost = clickPower * 10;
    if (coins >= cost) {
      setCoins(coins - cost);
      setClickPower(clickPower + 1);
    }
  };

  const buyAutoClicker = () => {
    const cost = 50 + (autoClickers * 25);
    if (coins >= cost) {
      setCoins(coins - cost);
      setAutoClickers(autoClickers + 1);
    }
  };

  const startGame = () => {
    setCoins(0);
    setClickPower(1);
    setAutoClickers(0);
    setGameStarted(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.coinsText}>🪙 {coins.toLocaleString()}</Text>
        <Text style={styles.perSecText}>+{autoClickers}/s</Text>
      </View>

      {!gameStarted ? (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Clicking!</Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Click to earn coins and buy upgrades!
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.gameArea}>
          <TouchableOpacity
            style={styles.clickButton}
            onPress={handleClick}
            activeOpacity={0.7}
          >
            <Text style={styles.clickEmoji}>💰</Text>
            <Text style={styles.clickText}>+{clickPower}</Text>
          </TouchableOpacity>

          <View style={styles.upgradesContainer}>
            <Text style={styles.upgradesTitle}>Upgrades</Text>

            <TouchableOpacity
              style={[
                styles.upgradeButton,
                coins < clickPower * 10 && styles.upgradeButtonDisabled,
              ]}
              onPress={buyClickPower}
              disabled={coins < clickPower * 10}
            >
              <View>
                <Text style={styles.upgradeTitle}>Click Power</Text>
                <Text style={styles.upgradeDesc}>
                  +1 per click (Current: {clickPower})
                </Text>
              </View>
              <Text style={styles.upgradeCost}>
                🪙 {(clickPower * 10).toLocaleString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.upgradeButton,
                coins < (50 + autoClickers * 25) && styles.upgradeButtonDisabled,
              ]}
              onPress={buyAutoClicker}
              disabled={coins < (50 + autoClickers * 25)}
            >
              <View>
                <Text style={styles.upgradeTitle}>Auto Clicker</Text>
                <Text style={styles.upgradeDesc}>
                  +1 per second (Owned: {autoClickers})
                </Text>
              </View>
              <Text style={styles.upgradeCost}>
                🪙 {(50 + autoClickers * 25).toLocaleString()}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    padding: 20,
    backgroundColor: '#34495E',
    alignItems: 'center',
  },
  coinsText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F1C40F',
  },
  perSecText: {
    fontSize: 18,
    color: '#4ECDC4',
    marginTop: 5,
  },
  gameArea: {
    flex: 1,
    padding: 20,
  },
  clickButton: {
    backgroundColor: '#27AE60',
    padding: 40,
    borderRadius: 100,
    alignSelf: 'center',
    marginVertical: 30,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  clickEmoji: {
    fontSize: 80,
  },
  clickText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  upgradesContainer: {
    marginTop: 20,
  },
  upgradesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  upgradeButton: {
    backgroundColor: '#34495E',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upgradeButtonDisabled: {
    opacity: 0.5,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  upgradeDesc: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 5,
  },
  upgradeCost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1C40F',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startButton: {
    backgroundColor: '#27AE60',
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
