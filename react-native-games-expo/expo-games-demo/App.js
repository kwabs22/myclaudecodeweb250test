import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import ColorMatchGame from './games/ColorMatchGame';
import TapTheCircleGame from './games/TapTheCircleGame';
import MemoryCardGame from './games/MemoryCardGame';
import StackBlocksGame from './games/StackBlocksGame';
import FlappyCloneGame from './games/FlappyCloneGame';

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
          options={{ title: 'Expo Games Demo' }}
        />
        <Stack.Screen
          name="ColorMatch"
          component={ColorMatchGame}
          options={{ title: 'Color Match' }}
        />
        <Stack.Screen
          name="TapTheCircle"
          component={TapTheCircleGame}
          options={{ title: 'Circle Tap' }}
        />
        <Stack.Screen
          name="MemoryCard"
          component={MemoryCardGame}
          options={{ title: 'Memory Cards' }}
        />
        <Stack.Screen
          name="StackBlocks"
          component={StackBlocksGame}
          options={{ title: 'Stack Blocks' }}
        />
        <Stack.Screen
          name="FlappyClone"
          component={FlappyCloneGame}
          options={{ title: 'Flappy Clone' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
