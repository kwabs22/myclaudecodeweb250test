import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const PLANTS = [
  { id: 1, emoji: '🌱', name: 'Seed', level: 1 },
  { id: 2, emoji: '🌿', name: 'Sprout', level: 2 },
  { id: 3, emoji: '🪴', name: 'Plant', level: 3 },
  { id: 4, emoji: '🌸', name: 'Flower', level: 4 },
  { id: 5, emoji: '🌺', name: 'Bloom', level: 5 },
  { id: 6, emoji: '🌻', name: 'Sunflower', level: 6 },
  { id: 7, emoji: '🌹', name: 'Rose', level: 7 },
  { id: 8, emoji: '🌷', name: 'Tulip', level: 8 },
];

export default function GardenMergeGame() {
  const [garden, setGarden] = useState([]);
  const [coins, setCoins] = useState(50);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [autoGrow, setAutoGrow] = useState(0);

  useEffect(() => {
    if (gameStarted && autoGrow > 0) {
      const interval = setInterval(() => {
        setCoins(c => c + autoGrow);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, autoGrow]);

  const startGame = () => {
    setGarden([
      { id: Date.now(), plantId: 1, slot: 0 },
    ]);
    setCoins(50);
    setSelectedPlant(null);
    setAutoGrow(0);
    setGameStarted(true);
  };

  const buyPlant = () => {
    if (coins >= 10 && garden.length < 12) {
      setGarden([...garden, {
        id: Date.now(),
        plantId: 1,
        slot: garden.length,
      }]);
      setCoins(coins - 10);
    }
  };

  const mergePlants = (plant1, plant2) => {
    if (plant1.plantId === plant2.plantId && plant1.plantId < PLANTS.length) {
      const newGarden = garden.filter(p => p.id !== plant1.id && p.id !== plant2.id);
      newGarden.push({
        id: Date.now(),
        plantId: plant1.plantId + 1,
        slot: plant1.slot,
      });
      setGarden(newGarden);
      setCoins(coins + plant1.plantId * 5);
      setSelectedPlant(null);

      if (plant1.plantId + 1 >= 5) {
        setAutoGrow(prev => prev + 1);
      }
    }
  };

  const handlePlantPress = (plant) => {
    if (!selectedPlant) {
      setSelectedPlant(plant);
    } else if (selectedPlant.id === plant.id) {
      setSelectedPlant(null);
    } else {
      mergePlants(selectedPlant, plant);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Garden Merge</Text>
        <View style={styles.stats}>
          <Text style={styles.coinText}>🪙 {coins}</Text>
          <Text style={styles.autoText}>+{autoGrow}/s</Text>
        </View>
      </View>

      {!gameStarted ? (
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Garden</Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Merge plants to grow your garden!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.garden}>
            {Array(12).fill(null).map((_, index) => {
              const plant = garden.find(p => p.slot === index);
              const isSelected = selectedPlant && plant && selectedPlant.id === plant.id;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.gardenSlot,
                    isSelected && styles.selectedSlot,
                  ]}
                  onPress={() => plant && handlePlantPress(plant)}
                >
                  {plant && (
                    <View style={styles.plantContainer}>
                      <Text style={styles.plantEmoji}>
                        {PLANTS[plant.plantId - 1].emoji}
                      </Text>
                      <Text style={styles.plantLevel}>
                        Lv.{plant.plantId}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.buyButton, coins < 10 && styles.disabledButton]}
              onPress={buyPlant}
              disabled={coins < 10 || garden.length >= 12}
            >
              <Text style={styles.buyButtonText}>
                Buy Seed (10🪙)
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.guide}>
            <Text style={styles.guideTitle}>Plant Guide:</Text>
            <View style={styles.plantList}>
              {PLANTS.map(plant => (
                <View key={plant.id} style={styles.plantGuide}>
                  <Text style={styles.guideEmoji}>{plant.emoji}</Text>
                  <Text style={styles.guideName}>{plant.name}</Text>
                </View>
              ))}
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
    backgroundColor: '#8FBC8F',
  },
  header: {
    padding: 20,
    backgroundColor: '#228B22',
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  coinText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  autoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#90EE90',
  },
  garden: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'center',
  },
  gardenSlot: {
    width: 90,
    height: 90,
    backgroundColor: '#8B4513',
    margin: 5,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#654321',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSlot: {
    borderColor: '#FFD700',
    borderWidth: 4,
  },
  plantContainer: {
    alignItems: 'center',
  },
  plantEmoji: {
    fontSize: 40,
  },
  plantLevel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
  },
  controls: {
    padding: 20,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  guide: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  plantList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  plantGuide: {
    alignItems: 'center',
    margin: 5,
  },
  guideEmoji: {
    fontSize: 30,
  },
  guideName: {
    fontSize: 10,
  },
  gameArea: {
    paddingBottom: 20,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 400,
  },
  startButton: {
    backgroundColor: '#228B22',
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
