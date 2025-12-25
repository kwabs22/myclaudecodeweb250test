import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function CoffeeShopIdleGame() {
  const [money, setMoney] = useState(0);
  const [baristas, setBaristas] = useState(0);
  const [machines, setMachines] = useState(0);
  const [shops, setShops] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        const income = (baristas * 1) + (machines * 5) + (shops * 20);
        setMoney(m => m + income);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, baristas, machines, shops]);

  const startGame = () => {
    setMoney(0);
    setBaristas(0);
    setMachines(0);
    setShops(1);
    setGameStarted(true);
  };

  const makeCoffee = () => {
    setMoney(money + 1);
  };

  const buyBarista = () => {
    const cost = 10 + (baristas * 5);
    if (money >= cost) {
      setMoney(money - cost);
      setBaristas(baristas + 1);
    }
  };

  const buyMachine = () => {
    const cost = 50 + (machines * 25);
    if (money >= cost) {
      setMoney(money - cost);
      setMachines(machines + 1);
    }
  };

  const buyShop = () => {
    const cost = 200 + (shops * 100);
    if (money >= cost) {
      setMoney(money - cost);
      setShops(shops + 1);
    }
  };

  const income = (baristas * 1) + (machines * 5) + (shops * 20);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>☕ Coffee Shop</Text>
        <Text style={styles.moneyText}>💰 ${money.toFixed(0)}</Text>
        <Text style={styles.incomeText}>+${income}/s</Text>
      </View>

      {!gameStarted ? (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Open Shop</Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Build your coffee empire!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <TouchableOpacity style={styles.makeCoffeeButton} onPress={makeCoffee}>
            <Text style={styles.coffeeEmoji}>☕</Text>
            <Text style={styles.makeCoffeeText}>Make Coffee (+$1)</Text>
          </TouchableOpacity>

          <View style={styles.upgrades}>
            <Text style={styles.upgradesTitle}>Upgrades</Text>

            <View style={styles.upgradeCard}>
              <View style={styles.upgradeInfo}>
                <Text style={styles.upgradeName}>👨‍🍳 Barista</Text>
                <Text style={styles.upgradeDesc}>+$1/s (Owned: {baristas})</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.buyButton,
                  money < (10 + baristas * 5) && styles.disabledButton,
                ]}
                onPress={buyBarista}
                disabled={money < (10 + baristas * 5)}
              >
                <Text style={styles.buyText}>${10 + baristas * 5}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.upgradeCard}>
              <View style={styles.upgradeInfo}>
                <Text style={styles.upgradeName}>🤖 Machine</Text>
                <Text style={styles.upgradeDesc}>+$5/s (Owned: {machines})</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.buyButton,
                  money < (50 + machines * 25) && styles.disabledButton,
                ]}
                onPress={buyMachine}
                disabled={money < (50 + machines * 25)}
              >
                <Text style={styles.buyText}>${50 + machines * 25}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.upgradeCard}>
              <View style={styles.upgradeInfo}>
                <Text style={styles.upgradeName}>🏪 New Shop</Text>
                <Text style={styles.upgradeDesc}>+$20/s (Owned: {shops})</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.buyButton,
                  money < (200 + shops * 100) && styles.disabledButton,
                ]}
                onPress={buyShop}
                disabled={money < (200 + shops * 100)}
              >
                <Text style={styles.buyText}>${200 + shops * 100}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6F4E37',
  },
  header: {
    padding: 20,
    backgroundColor: '#4E3629',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  moneyText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
  },
  incomeText: {
    fontSize: 18,
    color: '#90EE90',
    marginTop: 5,
  },
  gameArea: {
    padding: 20,
  },
  makeCoffeeButton: {
    backgroundColor: '#8B4513',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  coffeeEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  makeCoffeeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  upgrades: {
    backgroundColor: '#4E3629',
    padding: 15,
    borderRadius: 10,
  },
  upgradesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  upgradeCard: {
    backgroundColor: '#6F4E37',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upgradeInfo: {
    flex: 1,
  },
  upgradeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  upgradeDesc: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  buyButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buyText: {
    fontSize: 16,
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
  startButton: {
    backgroundColor: '#8B4513',
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
    color: '#fff',
    textAlign: 'center',
  },
});
