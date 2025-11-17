import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Svg, Circle, Polyline } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const generateDotPattern = (numDots) => {
  const dots = [];
  const centerX = width / 2;
  const centerY = 300;
  const radius = 100;

  for (let i = 0; i < numDots; i++) {
    const angle = (i / numDots) * 2 * Math.PI;
    dots.push({
      id: i + 1,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  return dots;
};

export default function ConnectDotsGame() {
  const [dots, setDots] = useState(generateDotPattern(10));
  const [connectedDots, setConnectedDots] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const startGame = () => {
    const newDots = generateDotPattern(10);
    setDots(newDots);
    setConnectedDots([]);
    setGameStarted(true);
    setGameWon(false);
  };

  const handleDotPress = (dot) => {
    if (connectedDots.length === 0 || dot.id === connectedDots[connectedDots.length - 1].id + 1) {
      const newConnected = [...connectedDots, dot];
      setConnectedDots(newConnected);

      if (newConnected.length === dots.length) {
        setGameWon(true);
      }
    }
  };

  const getPolylinePoints = () => {
    return connectedDots.map(dot => `${dot.x},${dot.y}`).join(' ');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>Connect the Dots</Text>
        <Text style={styles.progressText}>
          {connectedDots.length}/{dots.length}
        </Text>
      </View>

      {!gameStarted || gameWon ? (
        <View style={styles.menuContainer}>
          {gameWon && (
            <Text style={styles.winText}>🎉 Pattern Revealed! 🎉</Text>
          )}
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>
              {gameWon ? 'New Pattern' : 'Start Game'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.instructions}>
            Connect the dots in numerical order!
          </Text>
        </View>
      ) : (
        <View style={styles.gameArea}>
          <Svg width={width} height={height - 100}>
            {connectedDots.length > 1 && (
              <Polyline
                points={getPolylinePoints()}
                fill="none"
                stroke="#4ECDC4"
                strokeWidth="3"
              />
            )}
            {dots.map(dot => (
              <Circle
                key={dot.id}
                cx={dot.x}
                cy={dot.y}
                r={connectedDots.includes(dot) ? 15 : 20}
                fill={connectedDots.includes(dot) ? '#27AE60' : '#3498DB'}
                onPress={() => handleDotPress(dot)}
              />
            ))}
          </Svg>
          {dots.map(dot => (
            <TouchableOpacity
              key={dot.id}
              style={[
                styles.dotLabel,
                {
                  left: dot.x - 15,
                  top: dot.y - 15,
                },
              ]}
              onPress={() => handleDotPress(dot)}
            >
              <Text style={styles.dotNumber}>{dot.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    backgroundColor: '#16213e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  dotLabel: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  winText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F1C40F',
    marginBottom: 30,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#4ECDC4',
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
    color: '#999',
    textAlign: 'center',
  },
});
