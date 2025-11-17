import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const games = [
  // Puzzle Games (11 games)
  {
    category: 'Puzzle Games',
    games: [
      { name: 'Color Match', description: 'Match falling colored blocks', route: 'ColorMatch', color: '#FF6B6B' },
      { name: 'Number Slider', description: 'Classic 15-puzzle sliding game', route: 'NumberSlider', color: '#4ECDC4' },
      { name: 'Memory Cards', description: 'Find matching emoji pairs', route: 'MemoryCard', color: '#45B7D1' },
      { name: 'Connect Dots', description: 'Connect numbered dots in order', route: 'ConnectDots', color: '#96CEB4' },
      { name: 'Tetris', description: 'Classic falling blocks puzzle', route: 'Tetris', color: '#00F0F0' },
      { name: '2048', description: 'Merge tiles to reach 2048', route: 'Game2048', color: '#EDC22E' },
      { name: 'Bubble Pop', description: 'Pop connected bubbles', route: 'BubblePop', color: '#FF69B4' },
      { name: 'Maze Runner', description: 'Navigate through generated mazes', route: 'MazeRunner', color: '#8E44AD' },
      { name: 'Jigsaw Puzzle', description: 'Solve the jigsaw puzzle', route: 'JigsawPuzzle', color: '#3498DB' },
      { name: 'Word Search', description: 'Find hidden words in the grid', route: 'WordSearch', color: '#2ECC71' },
      { name: 'Sliding Puzzle', description: 'Slide tiles to complete the image', route: 'SlidingPuzzle', color: '#E67E22' },
    ],
  },
  // Arcade Games (12 games)
  {
    category: 'Arcade Games',
    games: [
      { name: 'Flappy Clone', description: 'Tap to fly through pipes', route: 'FlappyClone', color: '#FFEAA7' },
      { name: 'Snake', description: 'Classic snake game', route: 'Snake', color: '#00FF00' },
      { name: 'Pong', description: 'Classic paddle game vs AI', route: 'Pong', color: '#FFFFFF' },
      { name: 'Stack Blocks', description: 'Stack blocks as high as you can', route: 'StackBlocks', color: '#E94560' },
      { name: 'Circle Tap', description: 'Tap circles before they disappear', route: 'TapTheCircle', color: '#4ECDC4' },
      { name: 'Endless Runner', description: 'Jump over obstacles endlessly', route: 'EndlessRunner', color: '#F39C12' },
      { name: 'Space Shooter', description: 'Shoot asteroids in space', route: 'SpaceShooter', color: '#1E3A8A' },
      { name: 'Brick Breaker', description: 'Classic breakout game', route: 'BrickBreaker', color: '#E74C3C' },
      { name: 'Fruit Ninja', description: 'Slice falling fruits', route: 'FruitNinja', color: '#FF6347' },
      { name: 'Color Switch', description: 'Match colors to pass obstacles', route: 'ColorSwitch', color: '#9B59B6' },
      { name: 'Ball Bounce', description: 'Keep the ball bouncing', route: 'BallBounce', color: '#3498DB' },
      { name: 'Coin Collector', description: 'Collect coins and avoid obstacles', route: 'CoinCollector', color: '#F1C40F' },
    ],
  },
  // Strategy Games (7 games)
  {
    category: 'Strategy Games',
    games: [
      { name: 'Tic Tac Toe', description: 'Classic X\'s and O\'s', route: 'TicTacToe', color: '#3498DB' },
      { name: 'Ultimate Tic Tac Toe', description: 'Meta tic-tac-toe with 9 boards', route: 'UltimateTicTacToe', color: '#2980B9' },
      { name: 'Checkers', description: 'Classic checkers game', route: 'Checkers', color: '#C0392B' },
      { name: 'Chess', description: 'Simplified chess game', route: 'Chess', color: '#34495E' },
      { name: 'Battleship', description: 'Sink the enemy fleet', route: 'Battleship', color: '#16A085' },
      { name: 'Dots and Boxes', description: '2-player grid game', route: 'DotsAndBoxes', color: '#8E44AD' },
      { name: 'Tower Defense', description: 'Defend against enemy waves', route: 'TowerDefense', color: '#27AE60' },
    ],
  },
  // Casual Games (9 games)
  {
    category: 'Casual Games',
    games: [
      { name: 'Whack A Mole', description: 'Tap moles as they pop up', route: 'WhackAMole', color: '#654321' },
      { name: 'Coin Clicker', description: 'Idle clicker with upgrades', route: 'Clicker', color: '#F1C40F' },
      { name: 'Balloon Pop', description: 'Pop rising balloons', route: 'BalloonPop', color: '#FF1493' },
      { name: 'Emoji Match', description: 'Match emoji pairs in grid', route: 'EmojiMatch', color: '#FFD700' },
      { name: 'Dice Roller', description: 'Roll dice and track history', route: 'DiceRoller', color: '#27AE60' },
      { name: 'Rock Paper Scissors', description: 'Classic RPS vs CPU', route: 'RockPaperScissors', color: '#4ECDC4' },
      { name: 'Coffee Shop', description: 'Build your coffee empire', route: 'CoffeeShopIdle', color: '#8B4513' },
      { name: 'Garden Merge', description: 'Merge plants to grow garden', route: 'GardenMerge', color: '#2ECC71' },
      { name: 'Solitaire', description: 'Classic card solitaire', route: 'Solitaire', color: '#0B6623' },
    ],
  },
  // Multiplayer & Social (5 games)
  {
    category: 'Multiplayer & Social',
    games: [
      { name: 'Quiz Battle', description: 'Answer trivia questions', route: 'QuizBattle', color: '#9B59B6' },
      { name: 'Simon Says', description: 'Remember the color sequence', route: 'SimonSays', color: '#E74C3C' },
      { name: 'Reaction Time', description: 'Test your reflexes', route: 'ReactionTime', color: '#27AE60' },
      { name: 'Truth or Dare', description: 'Party game with challenges', route: 'TruthOrDare', color: '#E91E63' },
      { name: 'Draw & Guess', description: 'Draw and guess words', route: 'DrawingGuess', color: '#8B4789' },
    ],
  },
  // Educational (6 games)
  {
    category: 'Educational Games',
    games: [
      { name: 'Math Speed', description: 'Solve math problems quickly', route: 'MathSpeed', color: '#16A085' },
      { name: 'Type Racer', description: 'Test your typing speed', route: 'TypeRacer', color: '#2C3E50' },
      { name: 'Geography Quiz', description: 'Test your geography knowledge', route: 'GeographyQuiz', color: '#3498DB' },
      { name: 'Word Chain', description: 'Build word chains by last letter', route: 'WordChain', color: '#34495E' },
      { name: 'Memory Training', description: 'Train your memory skills', route: 'MemoryTraining', color: '#9B59B6' },
      { name: 'Language Flashcards', description: 'Learn Spanish vocabulary', route: 'LanguageFlashcards', color: '#E67E22' },
    ],
  },
];

export default function HomeScreen({ navigation }) {
  const totalGames = games.reduce((sum, category) => sum + category.games.length, 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎮 Games Collection</Text>
        <Text style={styles.subtitle}>{totalGames} playable games across {games.length} categories</Text>
        <Text style={styles.info}>Built with React Native & Expo</Text>
      </View>

      {games.map((category, catIndex) => (
        <View key={catIndex} style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{category.games.length}</Text>
            </View>
          </View>

          {category.games.map((game, gameIndex) => (
            <TouchableOpacity
              key={gameIndex}
              style={[styles.gameCard, { borderLeftColor: game.color }]}
              onPress={() => navigation.navigate(game.route)}
              activeOpacity={0.7}
            >
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>
              </View>
              <View style={styles.playButton}>
                <Text style={styles.playButtonText}>▶</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>About This Collection</Text>
        <Text style={styles.footerText}>
          This is a collection of {totalGames} games demonstrating various game mechanics and concepts for React Native development.
        </Text>
        <Text style={styles.footerText}>
          Each game showcases different techniques: game loops, collision detection, state management, animations, and touch controls.
        </Text>
        <Text style={styles.footerCopyright}>
          Created with Expo {new Date().getFullYear()}
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
    padding: 25,
    backgroundColor: '#6200ee',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  categoryContainer: {
    marginBottom: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryBadge: {
    backgroundColor: '#6200ee',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gameCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 18,
    borderRadius: 10,
    borderLeftWidth: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 14,
    color: '#666',
  },
  playButton: {
    backgroundColor: '#6200ee',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 2,
  },
  footer: {
    padding: 25,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 20,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 10,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#999',
    marginTop: 15,
    textAlign: 'center',
  },
});
