# Chess Calculation Tree

A web-based chess application that allows you to explore move possibilities up to **12 steps (moves) ahead** from any position. Perfect for chess training, tactical analysis, and studying complex variations.

## Features

- **Interactive Chess Board**: Drag and drop pieces to set up or play through positions
- **Move Tree Generation**: Automatically generates all possible move variations up to 12 moves deep
- **Visual Tree Display**: Browse through variations in a hierarchical tree structure
- **Position Management**:
  - Start from standard chess position
  - Load any position via FEN notation
  - Clear board to set up custom positions
- **Tree Navigation**:
  - Click any move in the tree to see the resulting position on the board
  - Expand/collapse individual variations
  - Collapse or expand all variations at once
- **Real-time Stats**: See the total number of positions explored and the depth of analysis

## How to Use

### Opening the App

Simply open `index.html` in a modern web browser. No installation or server required!

```bash
# Open in your default browser
open index.html

# Or with a specific browser
google-chrome index.html
firefox index.html
```

### Setting Up a Position

1. **Standard Starting Position**: Click "Start Position"
2. **Custom Position**:
   - Drag pieces on the board
   - Or paste a FEN string and click "Load"
3. **Clear Board**: Click "Clear Board" to remove all pieces

### Generating the Move Tree

1. Set up your desired position
2. Click "Generate Tree" button
3. Wait for the calculation to complete (may take a few seconds for complex positions)
4. Explore the tree by clicking on moves

### Navigating the Tree

- **Click a move** to see the resulting position on the board
- **Click the +/− toggle** next to a move to expand/collapse its variations
- **Collapse All**: Minimize all variations
- **Expand All**: Show all variations at once

### Understanding the Tree Display

Each move in the tree shows:
- **Move notation** (e.g., "1. e4", "1... e5")
- **Depth level** in the tree
- **Number of replies** available from that position

The tree is color-coded and indented to show the relationship between moves.

## Technical Details

### Libraries Used

- **chess.js**: Move generation, validation, and game logic
- **chessboard.js**: Interactive chess board UI
- **jQuery**: DOM manipulation and event handling

### Performance Notes

Generating a 12-move-deep tree can create **thousands or millions** of nodes depending on the position:

- **Early game positions** (many pieces): ~100,000+ positions
- **Endgame positions** (few pieces): ~1,000-10,000 positions
- **Complex middle game**: May take several seconds to calculate

The app uses recursive tree building with depth-first traversal.

### Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Use Cases

- **Tactical Training**: Explore forcing sequences and tactics
- **Opening Study**: See all possible variations from an opening position
- **Endgame Analysis**: Calculate all possible continuations in endgames
- **Chess Teaching**: Demonstrate the branching nature of chess decisions
- **Move Counting**: Understand the complexity of different positions

## Limitations

- Tree generation is done in the browser (single-threaded)
- Very complex positions may take time to calculate
- No engine evaluation (pure move tree, no position assessment)
- No game database or opening book integration

## Future Enhancements

Possible improvements:
- Configurable depth (currently fixed at 12)
- Engine evaluation integration
- Position search/filter
- Save/load trees
- Export to PGN format
- Performance optimizations for faster generation

## Tips

1. **Start with endgame positions** to see the full 12-move tree quickly
2. **Use FEN notation** to quickly load specific positions
3. **Flip the board** to see from either player's perspective
4. **Collapse unnecessary variations** to focus on specific lines

## License

This is a free, open-source chess training tool. Feel free to modify and share!

---

**Enjoy exploring the infinite complexity of chess!**
