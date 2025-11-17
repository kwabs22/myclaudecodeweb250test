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

// Arcade Games
import FlappyCloneGame from './games/FlappyCloneGame';
import SnakeGame from './games/SnakeGame';
import PongGame from './games/PongGame';
import StackBlocksGame from './games/StackBlocksGame';
import TapTheCircleGame from './games/TapTheCircleGame';

// Strategy Games
import TicTacToeGame from './games/TicTacToeGame';

// Casual Games
import WhackAMoleGame from './games/WhackAMoleGame';
import ClickerGame from './games/ClickerGame';

// Multiplayer & Social
import QuizBattleGame from './games/QuizBattleGame';
import SimonSaysGame from './games/SimonSaysGame';
import ReactionTimeGame from './games/ReactionTimeGame';

// Educational
import MathSpeedGame from './games/MathSpeedGame';

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

        {/* Arcade Games */}
        <Stack.Screen name="FlappyClone" component={FlappyCloneGame} options={{ title: 'Flappy Clone' }} />
        <Stack.Screen name="Snake" component={SnakeGame} options={{ title: 'Snake' }} />
        <Stack.Screen name="Pong" component={PongGame} options={{ title: 'Pong' }} />
        <Stack.Screen name="StackBlocks" component={StackBlocksGame} options={{ title: 'Stack Blocks' }} />
        <Stack.Screen name="TapTheCircle" component={TapTheCircleGame} options={{ title: 'Circle Tap' }} />

        {/* Strategy Games */}
        <Stack.Screen name="TicTacToe" component={TicTacToeGame} options={{ title: 'Tic Tac Toe' }} />

        {/* Casual Games */}
        <Stack.Screen name="WhackAMole" component={WhackAMoleGame} options={{ title: 'Whack A Mole' }} />
        <Stack.Screen name="Clicker" component={ClickerGame} options={{ title: 'Coin Clicker' }} />

        {/* Multiplayer & Social */}
        <Stack.Screen name="QuizBattle" component={QuizBattleGame} options={{ title: 'Quiz Battle' }} />
        <Stack.Screen name="SimonSays" component={SimonSaysGame} options={{ title: 'Simon Says' }} />
        <Stack.Screen name="ReactionTime" component={ReactionTimeGame} options={{ title: 'Reaction Time' }} />

        {/* Educational */}
        <Stack.Screen name="MathSpeed" component={MathSpeedGame} options={{ title: 'Math Speed' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
