import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';

// Puzzle Games
import ColorMatchGame from './games/ColorMatchGame';
import NumberSliderGame from './games/NumberSliderGame';
import MemoryCardGame from './games/MemoryCardGame';
import ConnectDotsGame from './games/ConnectDotsGame';
import TetrisGame from './games/TetrisGame';
import Game2048 from './games/Game2048';
import BubblePopGame from './games/BubblePopGame';
import MazeRunnerGame from './games/MazeRunnerGame';
import JigsawPuzzleGame from './games/JigsawPuzzleGame';
import WordSearchGame from './games/WordSearchGame';
import SlidingPuzzleGame from './games/SlidingPuzzleGame';

// Arcade Games
import FlappyCloneGame from './games/FlappyCloneGame';
import SnakeGame from './games/SnakeGame';
import PongGame from './games/PongGame';
import StackBlocksGame from './games/StackBlocksGame';
import TapTheCircleGame from './games/TapTheCircleGame';
import EndlessRunnerGame from './games/EndlessRunnerGame';
import SpaceShooterGame from './games/SpaceShooterGame';
import BrickBreakerGame from './games/BrickBreakerGame';
import FruitNinjaGame from './games/FruitNinjaGame';
import ColorSwitchGame from './games/ColorSwitchGame';
import BallBounceGame from './games/BallBounceGame';
import CoinCollectorGame from './games/CoinCollectorGame';

// Strategy Games
import TicTacToeGame from './games/TicTacToeGame';
import UltimateTicTacToeGame from './games/UltimateTicTacToeGame';
import CheckersGame from './games/CheckersGame';
import ChessGame from './games/ChessGame';
import BattleshipGame from './games/BattleshipGame';
import DotsAndBoxesGame from './games/DotsAndBoxesGame';
import TowerDefenseGame from './games/TowerDefenseGame';

// Casual Games
import WhackAMoleGame from './games/WhackAMoleGame';
import ClickerGame from './games/ClickerGame';
import BalloonPopGame from './games/BalloonPopGame';
import EmojiMatchGame from './games/EmojiMatchGame';
import DiceRollerGame from './games/DiceRollerGame';
import RockPaperScissorsGame from './games/RockPaperScissorsGame';
import CoffeeShopIdleGame from './games/CoffeeShopIdleGame';
import GardenMergeGame from './games/GardenMergeGame';
import SolitaireGame from './games/SolitaireGame';

// Multiplayer & Social
import QuizBattleGame from './games/QuizBattleGame';
import SimonSaysGame from './games/SimonSaysGame';
import ReactionTimeGame from './games/ReactionTimeGame';
import TruthOrDareGame from './games/TruthOrDareGame';
import DrawingGuessGame from './games/DrawingGuessGame';

// Educational
import MathSpeedGame from './games/MathSpeedGame';
import TypeRacerGame from './games/TypeRacerGame';
import GeographyQuizGame from './games/GeographyQuizGame';
import WordChainGame from './games/WordChainGame';
import MemoryTrainingGame from './games/MemoryTrainingGame';
import LanguageFlashcardsGame from './games/LanguageFlashcardsGame';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Expo Games Collection' }}
        />

        {/* Puzzle Games */}
        <Stack.Screen name="ColorMatch" component={ColorMatchGame} options={{ title: 'Color Match' }} />
        <Stack.Screen name="NumberSlider" component={NumberSliderGame} options={{ title: 'Number Slider' }} />
        <Stack.Screen name="MemoryCard" component={MemoryCardGame} options={{ title: 'Memory Cards' }} />
        <Stack.Screen name="ConnectDots" component={ConnectDotsGame} options={{ title: 'Connect Dots' }} />
        <Stack.Screen name="Tetris" component={TetrisGame} options={{ title: 'Tetris' }} />
        <Stack.Screen name="Game2048" component={Game2048} options={{ title: '2048' }} />
        <Stack.Screen name="BubblePop" component={BubblePopGame} options={{ title: 'Bubble Pop' }} />
        <Stack.Screen name="MazeRunner" component={MazeRunnerGame} options={{ title: 'Maze Runner' }} />
        <Stack.Screen name="JigsawPuzzle" component={JigsawPuzzleGame} options={{ title: 'Jigsaw Puzzle' }} />
        <Stack.Screen name="WordSearch" component={WordSearchGame} options={{ title: 'Word Search' }} />
        <Stack.Screen name="SlidingPuzzle" component={SlidingPuzzleGame} options={{ title: 'Sliding Puzzle' }} />

        {/* Arcade Games */}
        <Stack.Screen name="FlappyClone" component={FlappyCloneGame} options={{ title: 'Flappy Clone' }} />
        <Stack.Screen name="Snake" component={SnakeGame} options={{ title: 'Snake' }} />
        <Stack.Screen name="Pong" component={PongGame} options={{ title: 'Pong' }} />
        <Stack.Screen name="StackBlocks" component={StackBlocksGame} options={{ title: 'Stack Blocks' }} />
        <Stack.Screen name="TapTheCircle" component={TapTheCircleGame} options={{ title: 'Circle Tap' }} />
        <Stack.Screen name="EndlessRunner" component={EndlessRunnerGame} options={{ title: 'Endless Runner' }} />
        <Stack.Screen name="SpaceShooter" component={SpaceShooterGame} options={{ title: 'Space Shooter' }} />
        <Stack.Screen name="BrickBreaker" component={BrickBreakerGame} options={{ title: 'Brick Breaker' }} />
        <Stack.Screen name="FruitNinja" component={FruitNinjaGame} options={{ title: 'Fruit Ninja' }} />
        <Stack.Screen name="ColorSwitch" component={ColorSwitchGame} options={{ title: 'Color Switch' }} />
        <Stack.Screen name="BallBounce" component={BallBounceGame} options={{ title: 'Ball Bounce' }} />
        <Stack.Screen name="CoinCollector" component={CoinCollectorGame} options={{ title: 'Coin Collector' }} />

        {/* Strategy Games */}
        <Stack.Screen name="TicTacToe" component={TicTacToeGame} options={{ title: 'Tic Tac Toe' }} />
        <Stack.Screen name="UltimateTicTacToe" component={UltimateTicTacToeGame} options={{ title: 'Ultimate Tic Tac Toe' }} />
        <Stack.Screen name="Checkers" component={CheckersGame} options={{ title: 'Checkers' }} />
        <Stack.Screen name="Chess" component={ChessGame} options={{ title: 'Chess' }} />
        <Stack.Screen name="Battleship" component={BattleshipGame} options={{ title: 'Battleship' }} />
        <Stack.Screen name="DotsAndBoxes" component={DotsAndBoxesGame} options={{ title: 'Dots and Boxes' }} />
        <Stack.Screen name="TowerDefense" component={TowerDefenseGame} options={{ title: 'Tower Defense' }} />

        {/* Casual Games */}
        <Stack.Screen name="WhackAMole" component={WhackAMoleGame} options={{ title: 'Whack A Mole' }} />
        <Stack.Screen name="Clicker" component={ClickerGame} options={{ title: 'Coin Clicker' }} />
        <Stack.Screen name="BalloonPop" component={BalloonPopGame} options={{ title: 'Balloon Pop' }} />
        <Stack.Screen name="EmojiMatch" component={EmojiMatchGame} options={{ title: 'Emoji Match' }} />
        <Stack.Screen name="DiceRoller" component={DiceRollerGame} options={{ title: 'Dice Roller' }} />
        <Stack.Screen name="RockPaperScissors" component={RockPaperScissorsGame} options={{ title: 'Rock Paper Scissors' }} />
        <Stack.Screen name="CoffeeShopIdle" component={CoffeeShopIdleGame} options={{ title: 'Coffee Shop' }} />
        <Stack.Screen name="GardenMerge" component={GardenMergeGame} options={{ title: 'Garden Merge' }} />
        <Stack.Screen name="Solitaire" component={SolitaireGame} options={{ title: 'Solitaire' }} />

        {/* Multiplayer & Social */}
        <Stack.Screen name="QuizBattle" component={QuizBattleGame} options={{ title: 'Quiz Battle' }} />
        <Stack.Screen name="SimonSays" component={SimonSaysGame} options={{ title: 'Simon Says' }} />
        <Stack.Screen name="ReactionTime" component={ReactionTimeGame} options={{ title: 'Reaction Time' }} />
        <Stack.Screen name="TruthOrDare" component={TruthOrDareGame} options={{ title: 'Truth or Dare' }} />
        <Stack.Screen name="DrawingGuess" component={DrawingGuessGame} options={{ title: 'Draw & Guess' }} />

        {/* Educational */}
        <Stack.Screen name="MathSpeed" component={MathSpeedGame} options={{ title: 'Math Speed' }} />
        <Stack.Screen name="TypeRacer" component={TypeRacerGame} options={{ title: 'Type Racer' }} />
        <Stack.Screen name="GeographyQuiz" component={GeographyQuizGame} options={{ title: 'Geography Quiz' }} />
        <Stack.Screen name="WordChain" component={WordChainGame} options={{ title: 'Word Chain' }} />
        <Stack.Screen name="MemoryTraining" component={MemoryTrainingGame} options={{ title: 'Memory Training' }} />
        <Stack.Screen name="LanguageFlashcards" component={LanguageFlashcardsGame} options={{ title: 'Language Flashcards' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
