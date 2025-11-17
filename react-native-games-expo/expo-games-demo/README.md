# Expo Games Demo 🎮

A collection of 5 fully playable React Native games built with Expo. Perfect for learning game development and testing game concepts!

## 🎯 Included Games

1. **Color Match** - Match falling colored blocks with the target color
2. **Circle Tap** - Tap circles before they disappear in a time challenge
3. **Memory Cards** - Classic memory matching game with emojis
4. **Stack Blocks** - Stack blocks as high as you can with precision timing
5. **Flappy Clone** - Navigate through pipes by tapping to fly

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
