# Existing Music Theory Implementations

A comprehensive list of music theory libraries and frameworks across different programming languages.

---

## Python Libraries

### **music21** ⭐ Most Comprehensive
- **Repository**: [MIT/music21](http://web.mit.edu/music21/)
- **Description**: Toolkit for computational musicology, music theory, and generative composition
- **Features**:
  - MusicXML, MIDI, Humdrum/Kern, ABC format support
  - Chord analysis and detection
  - Scale analysis
  - Key signature detection
  - Pitch spelling algorithms
  - Voice leading analysis
  - Roman numeral analysis
  - Extensive corpus of musical works
- **Use Cases**: Academic research, music analysis, composition
- **Installation**: `pip install music21`

### **mingus**
- **Repository**: [bspaans/python-mingus](https://github.com/bspaans/python-mingus)
- **Description**: Advanced music theory and notation package
- **Features**:
  - Notes, scales, chords, intervals
  - Chord progressions
  - Rhythm patterns
  - MIDI playback
  - LilyPond integration (notation)
- **Installation**: `pip install mingus`

### **musicpy**
- **Repository**: [Rainbow-Dreamer/musicpy](https://github.com/Rainbow-Dreamer/musicpy)
- **Description**: Music programming language with algorithm support
- **Features**:
  - Music theory algorithms
  - Chord voicing
  - Generative composition
  - MIDI output
- **Installation**: `pip install musicpy`
- **Last Updated**: February 2025

### **mutils**
- **Repository**: [charlie-rbchd/mutils](https://github.com/charlie-rbchd/mutils)
- **Description**: MIDI and frequency representations of musical constructs
- **Features**:
  - Notes, chords, scales
  - MIDI <-> Frequency conversion
  - Clean API for music theory operations

### **Partitura**
- **Description**: Python package for working with symbolic musical information
- **Features**:
  - Pitch-spelling estimation
  - Meter detection
  - Key signature analysis
  - Voicing analysis
  - Tonal tension estimation
  - MusicXML and MIDI support
- **Use Cases**: Music information retrieval, computational musicology

### **mutwo**
- **Description**: Library for time-based composition
- **Features**:
  - Generalized time-based structure model
  - Notation output
  - MIDI output
  - Audio file generation
- **Use Cases**: Algorithmic composition

---

## JavaScript/TypeScript Libraries

### **Tonal.js** ⭐ Most Popular for JS
- **Repository**: [tonaljs/tonal](https://github.com/tonaljs/tonal)
- **Description**: Functional music theory library for JavaScript
- **Features**:
  - Notes, intervals, chords, scales
  - Key signatures
  - Chord progressions
  - Note ranges
  - Functional programming approach
  - No dependencies
  - Modular (use only what you need)
- **Installation**: `npm install tonal`
- **Example**:
```javascript
import { Note, Scale, Chord } from "tonal";

Note.transpose("C4", "5P"); // => "G4"
Scale.get("C major").notes; // => ["C", "D", "E", "F", "G", "A", "B"]
Chord.get("Cmaj7").notes;   // => ["C", "E", "G", "B"]
```

### **teoria**
- **Repository**: [saebekassebil/teoria](https://github.com/saebekassebil/teoria)
- **Description**: Music theory for JavaScript
- **Features**:
  - Notes, scales, chords
  - Interval calculations
  - Frequency conversions
- **Installation**: `npm install teoria`

### **scribbletune**
- **Repository**: [scribbletune/scribbletune](https://github.com/scribbletune/scribbletune)
- **Description**: Create music with JavaScript
- **Features**:
  - Chord progressions
  - MIDI generation
  - Pattern-based composition
  - Built on tonal.js

---

## C++ Libraries

### **MTS-ESP**
- **Description**: MIDI Tuning Standard implementation
- **Features**:
  - Microtuning support
  - Alternative tuning systems
  - VST/AU plugin integration

### **libMidi**
- **Repository**: [end2endzone/libMidi](https://github.com/end2endzone/libMidi)
- **Description**: Generate monolithic melodies in MIDI format
- **Features**:
  - MIDI file generation
  - Note sequencing

### **Custom Music Theory in VST SDKs**
Most C++ music theory code is custom-written within:
- **JUCE Framework** (provides basic MIDI utilities)
- **VST SDK** (raw MIDI processing)
- Individual plugin implementations

---

## Swift (Apple Platforms)

### **MusicTheory**
- **Repository**: [cemolcay/MusicTheory](https://github.com/cemolcay/MusicTheory)
- **Description**: Universal music theory library for Apple platforms
- **Features**:
  - Pitch, Key, Interval representations
  - Scales and Chords
  - MIDI <-> Frequency conversion
  - Chord inversions
- **Platforms**: iOS, iPadOS, macOS, tvOS, watchOS
- **Installation**: Swift Package Manager
- **Example**:
```swift
let cMajor = Scale(type: .major, key: Key(type: .c))
let chord = Chord(type: .maj7, key: Key(type: .c))
let frequency = Pitch.frequency(midiNote: 69) // A4 = 440 Hz
```

---

## C# / .NET

### **DryWetMIDI**
- **Repository**: [melanchall/drywetmidi](https://github.com/melanchall/drywetmidi)
- **Description**: Comprehensive MIDI library with music theory API
- **Features**:
  - Music theory objects (notes, chords, scales)
  - MIDI file manipulation
  - Real-time MIDI
  - Pattern-based composition
  - High-level and low-level APIs
- **Installation**: `Install-Package Melanchall.DryWetMidi`

---

## Clojure/ClojureScript

### **music-theory**
- **Repository**: [daveyarwood/music-theory](https://github.com/daveyarwood/music-theory)
- **Description**: Music theory library for Clojure
- **Features**:
  - MIDI <-> Hz conversions
  - Note -> MIDI functions
  - Functional approach
- **Example**:
```clojure
(midi->hz 69)     ; => 440.0 (A4)
(note->midi :A4)  ; => 69
```

---

## Rust

### **FunDSP**
- **Repository**: [SamiPerttu/fundsp](https://github.com/SamiPerttu/fundsp)
- **Description**: Audio DSP library with zero-cost abstractions
- **Features**:
  - Graph-based audio processing
  - Music theory primitives
  - Synthesis and effects
  - Type-safe signal routing
- **Example**:
```rust
let synth = sine_hz(440.0) >> lowpass_hz(1000.0, 1.0);
```

### **augmented**
- **Description**: Audio programming library
- **Features**:
  - Music theory utilities
  - DSP primitives

---

## Haskell

### **Euterpea**
- **Repository**: [Euterpea/Euterpea2](https://github.com/Euterpea/Euterpea2)
- **Description**: Domain-specific language for computer music
- **Features**:
  - Functional music representation
  - Music theory abstractions
  - MIDI generation
  - Strong type system for musical concepts

---

## Domain-Specific Languages

### **Faust** ⭐ Functional Audio Stream
- **Website**: [faust.grame.fr](https://faust.grame.fr/)
- **Description**: Functional programming language for audio DSP
- **Features**:
  - Compiles to C++, Rust, WebAssembly, etc.
  - Mathematical audio processing
  - Visual signal flow diagrams
  - Zero-cost abstractions
- **Example**:
```faust
import("stdfaust.lib");
process = os.osc(440) : fi.lowpass(3, 1000);
```

### **ChucK**
- **Website**: [chuck.cs.princeton.edu](https://chuck.cs.princeton.edu/)
- **Description**: Strongly-timed audio programming language
- **Features**:
  - Real-time synthesis
  - Concurrent programming
  - On-the-fly programming

### **SuperCollider**
- **Website**: [supercollider.github.io](https://supercollider.github.io/)
- **Description**: Platform for audio synthesis and algorithmic composition
- **Features**:
  - Server/client architecture
  - Powerful pattern system
  - Music theory through patterns

---

## Specialized Libraries

### **Chord Recognition & Detection**

#### **ReChord**
- **Repository**: [GitHub - Chord Recognition](https://github.com/topics/chord-recognition)
- **Description**: Chord transcription using CNN
- **Technology**: Fully Convolutional Neural Network
- **Input**: Audio spectrograms

#### **Chord-Recognition (HMM)**
- **Repository**: [orchidas/Chord-Recognition](https://github.com/orchidas/Chord-Recognition)
- **Description**: HMM-based chord recognition
- **Features**: Viterbi decoding, music theory-trained model

### **Chord Progression Tools**

#### **Chord-Progression-Generator-API**
- **Repository**: [gauthammk/Chord-Progression-Generator-API](https://github.com/gauthammk/Chord-Progression-Generator-API)
- **Description**: Generate progressions by mood
- **Technology**: Hooktheory API integration

#### **chord_progression_assistant**
- **Repository**: [jhamer90811/chord_progression_assistant](https://github.com/jhamer90811/chord_progression_assistant)
- **Description**: Analyze popular song progressions
- **APIs**: Hooktheory, Spotify

---

## Web APIs & Services

### **Hooktheory API**
- **Website**: [hooktheory.com/api](https://www.hooktheory.com/api)
- **Description**: Database of chord progressions from popular music
- **Features**:
  - Query chord progressions
  - Song analysis data
  - Trend analysis

### **Spotify API**
- **Features**:
  - Audio features (key, mode, tempo)
  - Limited music theory data

---

## Comparison by Use Case

### **Academic/Research**
- **Best**: music21 (Python), Euterpea (Haskell)
- **Features**: Deep analysis, corpus studies, notation export

### **Web Development**
- **Best**: Tonal.js (JavaScript)
- **Features**: Lightweight, modular, no dependencies

### **Real-Time Audio (VST/DAW)**
- **Best**: Custom C++ (JUCE), Faust
- **Features**: Low latency, sample-accurate timing

### **Mobile Apps**
- **Best**: MusicTheory (Swift)
- **Features**: Native performance, Apple ecosystem

### **Generative Composition**
- **Best**: musicpy (Python), SuperCollider, ChucK
- **Features**: Algorithmic patterns, MIDI export

### **Music Information Retrieval**
- **Best**: Partitura (Python), music21
- **Features**: Analysis algorithms, machine learning ready

---

## Key Concepts Implemented Across Libraries

### Core Data Structures
```
Note
├── Pitch class (C, D, E, etc.)
├── Octave
├── Accidental (♭, ♮, ♯)
└── Frequency (Hz)

Interval
├── Semitones
├── Quality (Perfect, Major, Minor, etc.)
└── Direction (ascending/descending)

Scale
├── Root note
├── Pattern (W-W-H-W-W-W-H for major)
└── Mode

Chord
├── Root note
├── Quality (Major, Minor, Diminished, etc.)
├── Extensions (7th, 9th, 11th, 13th)
└── Inversion
```

### Common Algorithms

1. **MIDI ↔ Frequency Conversion**
   ```
   f = 440 * 2^((n - 69) / 12)
   n = 69 + 12 * log2(f / 440)
   ```

2. **Interval Calculation**
   - Semitone distance between notes
   - Frequency ratios

3. **Scale Generation**
   - Apply interval patterns to root note
   - Mode rotations

4. **Chord Detection**
   - Pattern matching against known chord templates
   - Probabilistic models (HMM, CNN)

5. **Chord Progression Analysis**
   - Roman numeral analysis
   - Functional harmony detection
   - Common progression identification

6. **Key Detection**
   - Krumhansl-Schmuckler algorithm
   - Profile matching against major/minor templates

---

## Installation Quick Reference

```bash
# Python
pip install music21 mingus musicpy

# JavaScript
npm install tonal teoria scribbletune

# Swift (in Package.swift)
.package(url: "https://github.com/cemolcay/MusicTheory.git", from: "2.0.0")

# C#
Install-Package Melanchall.DryWetMidi

# Rust (in Cargo.toml)
fundsp = "0.18"
```

---

## Sources

- [Tonal.js - GitHub](https://github.com/tonaljs/tonal)
- [music21 - MIT](http://web.mit.edu/music21/)
- [Music Theory Libraries - GitHub Topics](https://github.com/topics/music-theory)
- [Awesome Music Projects](https://github.com/noteflakes/awesome-music)
- [Python in Music - Python Wiki](https://wiki.python.org/moin/PythonInMusic)
- [MusicTheory Swift Library](https://github.com/cemolcay/MusicTheory)
- [DryWetMIDI - GitHub](https://github.com/melanchall/drywetmidi)
- [Faust Programming Language](https://faust.grame.fr/)
- [FunDSP - Rust Audio](https://github.com/SamiPerttu/fundsp)
- [Chord Recognition - GitHub Topics](https://github.com/topics/chord-recognition)
- [Chord Progression Tools](https://github.com/topics/chord-progression)
- [mutils - Python Library](https://github.com/charlie-rbchd/mutils)

---

## Recommendations by Background

**If you're coming from:**
- **Web Development** → Start with Tonal.js
- **Data Science/Python** → Start with music21
- **Game Development** → Use custom C++ or JUCE
- **iOS Development** → Use MusicTheory (Swift)
- **Academic Research** → Use music21 or Euterpea
- **Electronic Music Production** → Use SuperCollider or Faust
- **Functional Programming** → Use Euterpea (Haskell) or Clojure libraries

**Universal recommendation**: Start with **Tonal.js** (JavaScript) or **music21** (Python) depending on your language preference. Both have excellent documentation and active communities.
