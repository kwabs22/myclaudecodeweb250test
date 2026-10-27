# Expo Games Collection 🎮

A collection of 50 playable React Native games built with Expo. Perfect for learning game development and testing game concepts!

## 🎯 Included Games

All 50 games are on the home screen, in these groups. The tests check the rule helpers for Checkers and Chess (`node tests/rules.test.js`); the other games have been opened and played with random taps and swipes without errors, but their rules have not been checked game by game.

### Puzzle Games (11 games)
1. **Color Match** - Match falling colored blocks
2. **Number Slider** - Classic 15-puzzle sliding game
3. **Memory Cards** - Find matching emoji pairs
4. **Connect Dots** - Connect numbered dots in order
5. **Tetris** - Classic falling blocks puzzle
6. **2048** - Merge tiles to reach 2048
7. **Bubble Pop** - Pop connected bubbles
8. **Maze Runner** - Navigate through generated mazes
9. **Jigsaw Puzzle** - Solve the jigsaw puzzle
10. **Word Search** - Find hidden words in the grid
11. **Sliding Puzzle** - Slide tiles to complete the image

### Arcade Games (12 games)
12. **Flappy Clone** - Tap to fly through pipes
13. **Snake** - Classic snake game
14. **Pong** - Classic paddle game vs AI
15. **Stack Blocks** - Stack blocks as high as you can
16. **Circle Tap** - Tap circles before they disappear
17. **Endless Runner** - Jump over obstacles endlessly
18. **Space Shooter** - Shoot asteroids in space
19. **Brick Breaker** - Classic breakout game
20. **Fruit Ninja** - Slice falling fruits
21. **Color Switch** - Match colors to pass obstacles
22. **Ball Bounce** - Keep the ball bouncing
23. **Coin Collector** - Collect coins and avoid obstacles

### Strategy Games (7 games)
24. **Tic Tac Toe** - Classic X's and O's
25. **Ultimate Tic Tac Toe** - Meta tic-tac-toe with 9 boards
26. **Checkers** - Classic checkers game
27. **Chess** - Simplified chess game
28. **Battleship** - Sink the enemy fleet
29. **Dots and Boxes** - 2-player grid game
30. **Tower Defense** - Defend against enemy waves

### Casual Games (9 games)
31. **Whack A Mole** - Tap moles as they pop up
32. **Coin Clicker** - Idle clicker with upgrades
33. **Balloon Pop** - Pop rising balloons
34. **Emoji Match** - Match emoji pairs in grid
35. **Dice Roller** - Roll dice and track history
36. **Rock Paper Scissors** - Classic RPS vs CPU
37. **Coffee Shop** - Build your coffee empire
38. **Garden Merge** - Merge plants to grow garden
39. **Solitaire** - Classic card solitaire

### Multiplayer & Social (5 games)
40. **Quiz Battle** - Answer trivia questions
41. **Simon Says** - Remember the color sequence
42. **Reaction Time** - Test your reflexes
43. **Truth or Dare** - Party game with challenges
44. **Draw & Guess** - Draw and guess words

### Educational Games (6 games)
45. **Math Speed** - Solve math problems quickly
46. **Type Racer** - Test your typing speed
47. **Geography Quiz** - Test your geography knowledge
48. **Word Chain** - Build word chains by last letter
49. **Memory Training** - Train your memory skills
50. **Language Flashcards** - Learn Spanish vocabulary

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (optional but recommended)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd expo-games-demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   or
   ```bash
   npx expo start
   ```

4. **Run on your device:**
   - Install the **Expo Go** app on your phone
   - Scan the QR code from the terminal
   - Or press `a` for Android emulator, `i` for iOS simulator, or `w` for web

## 📱 Testing Options

### Physical Device
- Install **Expo Go** from App Store (iOS) or Play Store (Android)
- Scan the QR code displayed in your terminal
- Games will run on your device

### Emulator/Simulator
- **Android**: Press `a` after starting the dev server
- **iOS**: Press `i` after starting the dev server (macOS only)
- **Web**: Press `w` to open in browser

### Web Browser
```bash
npm run web
```

## 🎮 How to Play

### Color Match
- Tap blocks that match the target color shown at the top
- Wrong tap = game over
- Missing a block = game over

### Circle Tap
- Tap all circles before they disappear
- 30 seconds to get the highest score
- Circles appear and disappear quickly!

### Memory Cards
- Tap cards to flip them
- Match pairs of identical emojis
- Complete all 8 pairs to win
- Try to do it in the fewest moves!

### Stack Blocks
- Tap to drop the moving block
- Align it with the block below
- Smaller overlap = smaller next block
- Stack as high as you can!

### Flappy Clone
- Tap anywhere to make the bird jump
- Navigate through the pipes
- Don't hit the pipes or ground
- Beat your high score!

## 📁 Project Structure

```
expo-games-demo/
├── App.js                    # Main app with navigation
├── app.json                  # Expo configuration
├── package.json              # Dependencies
├── components/
│   └── HomeScreen.js         # Game selection menu
├── games/
│   ├── ColorMatchGame.js     # Color matching game
│   ├── TapTheCircleGame.js   # Circle tapping game
│   ├── MemoryCardGame.js     # Memory card game
│   ├── StackBlocksGame.js    # Block stacking game
│   └── FlappyCloneGame.js    # Flappy bird clone
└── utils/                    # Utility functions (future)
```

## 🛠️ Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **React Navigation** - Navigation between screens
- **React Hooks** - State management
- **JavaScript** - Programming language

## 🎨 Customization

Each game is self-contained and easy to customize:

- **Colors**: Change the color schemes in each game's StyleSheet
- **Difficulty**: Adjust speeds, timers, and spawn rates
- **Game Rules**: Modify logic in each game component
- **Add Sounds**: Use `expo-av` for sound effects and music

## 📚 Learning Resources

### Adding More Games
1. Create a new file in `games/` directory
2. Import and add route in `App.js`
3. Add menu item in `components/HomeScreen.js`

### Game Loop Pattern
Most games use this pattern:
```javascript
useEffect(() => {
  if (gameStarted && !gameOver) {
    const interval = setInterval(() => {
      // Update game state
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }
}, [gameStarted, gameOver, dependencies]);
```

### Adding Leaderboards
- Use AsyncStorage for local high scores
- Integrate Firebase for online leaderboards

### Adding Sound Effects
```bash
npm install expo-av
```

Then in your game:
```javascript
import { Audio } from 'expo-av';

const playSound = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require('./assets/sounds/tap.mp3')
  );
  await sound.playAsync();
};
```

## 🐛 Troubleshooting

### Metro bundler issues
```bash
npm start -- --clear
```

### Dependency issues
```bash
rm -rf node_modules
npm install
```

### iOS simulator not opening
- Make sure Xcode is installed
- Run: `npx expo start --ios`

### Android emulator not opening
- Make sure Android Studio is installed
- Start an emulator before running: `npx expo start --android`

## 🚀 Next Steps

- Add sound effects and background music
- Implement persistent high scores
- Add difficulty levels
- Create more game variations
- Add multiplayer features
- Publish to App Store/Play Store

## 📖 Reference

Check out the parent `50-GAME-IDEAS.md` file for 50+ more game ideas to implement!

## 📄 License

MIT License - Feel free to use this code for learning and your own projects!

---

**Happy Gaming! 🎮**

## Run in the browser

The web packages Expo needs (`react-dom`, `react-native-web`, `@expo/metro-runtime`) are in `package.json`, so
`npm run web` works. `npx expo export --platform web` writes a static copy to `dist/`; the Session Atlas site publishes
one at `expo-games-demo/web/` (set `EXPO_BASE_URL` to the folder it is served from, as `app.config.js` expects).
