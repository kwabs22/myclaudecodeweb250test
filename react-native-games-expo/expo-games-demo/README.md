# Expo Games Collection 🎮

A collection of 19 fully playable React Native games built with Expo. Perfect for learning game development and testing game concepts!

## 🎯 Included Games

### Puzzle Games (7 games)
1. **Color Match** - Match falling colored blocks with the target color
2. **Number Slider** - Classic 15-puzzle sliding game
3. **Memory Cards** - Find matching emoji pairs
4. **Connect Dots** - Connect numbered dots in sequential order
5. **Tetris** - Classic falling blocks puzzle game
6. **2048** - Merge tiles to reach the 2048 tile
7. **Bubble Pop** - Pop 3+ connected bubbles of the same color

### Arcade Games (5 games)
8. **Flappy Clone** - Tap to fly through pipes
9. **Snake** - Classic snake game - eat food and grow
10. **Pong** - Classic paddle game vs AI opponent
11. **Stack Blocks** - Stack blocks as high as you can with precision timing
12. **Circle Tap** - Tap circles before they disappear in a time challenge

### Strategy Games (1 game)
13. **Tic Tac Toe** - Classic X's and O's game

### Casual Games (2 games)
14. **Whack A Mole** - Tap moles as they pop up
15. **Coin Clicker** - Idle clicker game with upgrades

### Multiplayer & Social (3 games)
16. **Quiz Battle** - Answer trivia questions to test your knowledge
17. **Simon Says** - Remember and repeat the color sequence
18. **Reaction Time** - Test your reflexes and reaction speed

### Educational Games (1 game)
19. **Math Speed** - Solve math problems as quickly as possible

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
