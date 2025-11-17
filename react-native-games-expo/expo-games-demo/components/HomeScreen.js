import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const games = [
  {
    id: 1,
    name: 'Color Match',
    description: 'Match the falling colored blocks',
    route: 'ColorMatch',
    difficulty: 'Easy',
    color: '#FF6B6B',
  },
  {
    id: 2,
    name: 'Circle Tap',
    description: 'Tap circles before time runs out',
    route: 'TapTheCircle',
    difficulty: 'Easy',
    color: '#4ECDC4',
  },
  {
    id: 3,
    name: 'Memory Cards',
    description: 'Find matching pairs',
    route: 'MemoryCard',
    difficulty: 'Medium',
    color: '#45B7D1',
  },
  {
    id: 4,
    name: 'Stack Blocks',
    description: 'Stack blocks as high as you can',
    route: 'StackBlocks',
    difficulty: 'Medium',
    color: '#96CEB4',
  },
  {
    id: 5,
    name: 'Flappy Clone',
    description: 'Tap to fly through obstacles',
    route: 'FlappyClone',
    difficulty: 'Hard',
    color: '#FFEAA7',
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎮 Choose a Game</Text>
        <Text style={styles.subtitle}>5 playable game demos</Text>
      </View>

      {games.map((game) => (
        <TouchableOpacity
          key={game.id}
          style={[styles.gameCard, { borderLeftColor: game.color }]}
          onPress={() => navigation.navigate(game.route)}
        >
          <View style={styles.gameInfo}>
            <Text style={styles.gameName}>{game.name}</Text>
            <Text style={styles.gameDescription}>{game.description}</Text>
          </View>
          <View style={[styles.difficultyBadge,
            { backgroundColor:
              game.difficulty === 'Easy' ? '#4CAF50' :
              game.difficulty === 'Medium' ? '#FF9800' : '#F44336'
            }
          ]}>
            <Text style={styles.difficultyText}>{game.difficulty}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          More games coming soon! 🚀
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  gameCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#999',
  },
});
