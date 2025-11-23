# VST & Sound Design: A Code Abstractions Guide

Complete guide to understanding VSTs and sound design from a programmer's perspective.

---

## Table of Contents

1. [VST Architecture](#vst-architecture)
2. [Core DSP Abstractions](#core-dsp-abstractions)
3. [Sound Design Building Blocks](#sound-design-building-blocks)
4. [Example Code](#example-code)
5. [Music Theory Implementations](#music-theory-implementations)

---

## VST Architecture

### The Two-Component Pattern

VST3 uses **separation of concerns** - the processor and controller run independently:

```
┌─────────────────────────────────────────────┐
│                   DAW HOST                  │
└─────────────────┬───────────────┬───────────┘
                  │               │
        ┌─────────▼─────┐  ┌──────▼──────────┐
        │   PROCESSOR   │  │   CONTROLLER    │
        │  (DSP Thread) │  │   (UI Thread)   │
        │               │  │                 │
        │  • Audio      │  │  • Parameters   │
        │  • Real-time  │  │  • UI Updates   │
        │  • No alloc   │  │  • No RT rules  │
        └───────────────┘  └─────────────────┘
```

**Why separate?**
- Processor can run on different CPU/machine
- UI updates don't block audio
- Similar to: **MVC pattern**, **Game Engine** (logic vs rendering)

### Communication Pattern

```cpp
// UI Thread (Controller)
parameter.setValue(0.5);
  ↓
[Lock-free queue]
  ↓
// Audio Thread (Processor)
float value = parameter.getValue();
processAudio(value);
```

**Key principle**: Lock-free atomics, no mutexes in audio callback

---

## Core DSP Abstractions

### 1. Audio Buffer - The Data Stream

```cpp
// Conceptual model
float** buffer;  // 2D array: [channel][sample]

// Processing pattern (like game loop)
for (sample in buffer) {
    output[sample] = transform(input[sample]);
}
```

**Analogies**:
- Video frame buffer (graphics)
- Array chunking (SIMD)
- Stream processing (data pipelines)

### 2. Sample Rate - Discretized Time

```cpp
const float SAMPLE_RATE = 44100.0f;  // samples per second

// Time → Samples
float seconds = 1.0f;
int samples = seconds * SAMPLE_RATE;  // 44100 samples

// Frequency → Phase Increment
float frequency = 440.0f;  // Hz
float phaseInc = frequency / SAMPLE_RATE;  // per sample
```

**Concept**: Time is quantized. Frequency becomes "speed of rotation."

### 3. Parameters - Normalized State

```cpp
// All parameters normalized to 0.0 - 1.0
float normalizedValue;  // DAW automation standard

// Map to actual range
float actual = min + normalized * (max - min);
```

**Pattern**: Observer/Observable (like React state, RxJS)

---

## Sound Design Building Blocks

### Oscillator - Signal Generator (Iterator Pattern)

```cpp
class Oscillator {
    float phase = 0.0;  // State: position in cycle

    float tick() {
        float output = sin(phase * 2π);  // Pure function
        phase += frequency / sampleRate;  // Update state
        return output;
    }
};
```

**Abstraction**: Stateful iterator generating periodic signals

**Analogy**:
- JavaScript generator function
- Python iterator with `__next__`
- Game object that updates per frame

### Filter - Signal Transformer (State Machine)

```cpp
class LowPassFilter {
    float memory = 0.0;  // Internal state

    float process(float input) {
        // Weighted average with history
        output = input * alpha + memory * (1 - alpha);
        memory = output;  // Store for next sample
        return output;
    }
};
```

**Abstraction**: Recursive function with memory

**Analogy**:
- Moving average (statistics)
- Image blur (convolution kernel)
- IIR filter (signal processing)

### Envelope - Temporal State Machine

```cpp
enum State { ATTACK, DECAY, SUSTAIN, RELEASE, IDLE };

class ADSR {
    State state = IDLE;
    float level = 0.0;

    float tick() {
        switch(state) {
            case ATTACK:  level += attackRate;  break;
            case DECAY:   level -= decayRate;   break;
            case SUSTAIN: /* hold */            break;
            case RELEASE: level -= releaseRate; break;
        }
        return level;
    }
};
```

**Abstraction**: Finite state machine (FSM)

**Analogy**:
- Animation state (Idle → Walk → Run)
- TCP connection states
- Game AI state machine

---

## Synthesis Models (Composition Patterns)

### 1. Additive Synthesis (Summation)

```cpp
output = oscillator1.tick()
       + oscillator2.tick()
       + oscillator3.tick();
```

**Pattern**: Reduce/fold operation

**Analogy**: Layering images in Photoshop

### 2. Subtractive Synthesis (Filtering)

```cpp
output = filter(richSignal);
// Start with harmonically rich sound, remove frequencies
```

**Pattern**: Pipeline transformation

**Analogy**: Sculpting (remove material)

### 3. FM Synthesis (Modulation)

```cpp
carrier.frequency = baseFreq + modulator.tick() * depth;
output = carrier.tick();
```

**Pattern**: Nested function composition

**Analogy**: `f(g(x))` in math, nested callbacks

### 4. Wavetable Synthesis (Lookup Table)

```cpp
float wavetable[2048];  // Pre-computed waveform
output = wavetable[int(phase * 2048)];
```

**Pattern**: Memoization

**Analogy**:
- Texture mapping (graphics)
- Hash table lookup
- Cache

---

## Effects as Transformations

### Delay - Circular Buffer

```cpp
class Delay {
    float buffer[44100];  // Ring buffer
    int writePos = 0;

    float process(float input) {
        int readPos = (writePos - delayTime) % 44100;
        float delayed = buffer[readPos];

        buffer[writePos] = input + (delayed * feedback);
        writePos = (writePos + 1) % 44100;

        return delayed;
    }
};
```

**Data structure**: Ring buffer / Circular queue

**Analogy**: Video frame buffer, network packet buffer

### Reverb - Convolution

```cpp
// Conceptually
output = convolve(input, impulseResponse);
```

**Algorithm**: Convolution (same as image processing)

**Analogy**:
- Applying a kernel in computer vision
- Gaussian blur in graphics

---

## Real-Time Programming Constraints

### ✅ Allowed in Audio Callback

```cpp
// Stack allocation
float buffer[1024];

// Lock-free atomics
std::atomic<float> param;

// Pre-allocated containers
std::array<Voice, 8> voices;

// Simple math
float result = sin(x) + cos(y);
```

### ❌ Forbidden in Audio Callback

```cpp
// Heap allocation (non-deterministic)
float* buffer = new float[1024];  // ❌

// File I/O
file.read();  // ❌

// Mutexes (blocking)
std::lock_guard<std::mutex> lock(mtx);  // ❌

// System calls
printf("debug");  // ❌
```

**Why?** Audio callback must complete in < 1ms (typical buffer size)

**Analogy**: Game render loop must complete in 16.67ms (60 FPS)

---

## Voice Architecture (Object Pooling)

```cpp
class Synth {
    Voice voices[8];  // Pre-allocated pool

    void noteOn(int note) {
        Voice* free = findFreeVoice();  // O(n) search
        if (free) {
            free->start(note);
        } else {
            // Voice stealing: take oldest
        }
    }
};
```

**Pattern**: Object pool

**Analogy**:
- Thread pool
- Connection pool
- Game entity pool (bullets, particles)

---

## Signal Flow Graphs

### Linear Chain

```
Oscillator → Filter → Envelope → Output
```

### Parallel Mix

```
Osc1 ─┐
Osc2 ─┼→ Mixer → Filter → Output
Osc3 ─┘
```

### Modulation

```
LFO ──→ (modulates frequency)
        ↓
    Oscillator → Output
```

### Feedback

```
Input → Delay → Output
         ↑      │
         └──────┘ (feedback)
```

**Representation**: Directed graph (DAG for most, cyclic for feedback)

---

## Example Code Walkthrough

### See Included Files:

1. **`SimpleVSTProcessor.cpp`**
   - Complete VST3 processor
   - 8-voice polyphonic synth
   - Oscillator → Filter → Envelope chain
   - MIDI event handling
   - Parameter processing

2. **`SimpleVSTController.cpp`**
   - UI/parameter controller
   - Parameter normalization
   - Display value formatting

3. **`MusicTheoryLib.h`**
   - Complete music theory implementation
   - MIDI ↔ Frequency conversion
   - Notes, intervals, scales, chords
   - Chord progressions
   - Rhythm calculations

---

## Music Theory Abstractions

### Fundamental Formula

```cpp
// MIDI note to frequency
float midiToFreq(int note) {
    return 440.0f * pow(2.0f, (note - 69) / 12.0f);
}
// Note: 69 = A4 (440 Hz)
```

**Concept**: Equal temperament tuning (12-TET)

### Scale as Pattern

```cpp
// Scale = interval pattern
const int MAJOR[] = {0, 2, 4, 5, 7, 9, 11};  // Semitones

// Apply to root note
Note root = C4;
for (int interval : MAJOR) {
    notes.push_back(root + interval);
}
```

**Pattern**: Template method, strategy pattern

### Chord as Intervals

```cpp
// Chord = simultaneous notes
const int MAJOR_TRIAD[] = {0, 4, 7};  // Root, M3, P5

Note root = C4;
Chord chord = {root, root + 4, root + 7};
```

**Abstraction**: Composite pattern (chord contains notes)

---

## Mapping to Other Programming Domains

| Audio DSP | Programming Equivalent |
|-----------|------------------------|
| Sample | Video frame, game tick |
| Buffer | Array chunk, SIMD vector |
| Sample rate | Frame rate, tick rate |
| Oscillator | Iterator, generator |
| Filter | Map/reduce, transformer |
| Envelope | Finite state machine |
| ADSR | Animation curve |
| Voice | Pooled object |
| Mix | Alpha blending |
| Delay | Ring buffer |
| Reverb | Convolution |
| Parameter | Observable/reactive state |
| MIDI event | Message passing |
| Signal chain | Function composition, pipe |
| Modulation | Dependency injection |

---

## Recommended Learning Path

### 1. **Foundations** (Week 1-2)
- Learn basic DSP concepts (sampling, aliasing, Nyquist)
- Understand sine waves, harmonics, frequency
- Book: "Think DSP" by Allen Downey (beginner-friendly)

### 2. **Implement Core Building Blocks** (Week 3-4)
- Write oscillator (sine, saw, square, triangle)
- Write simple filter (one-pole low-pass)
- Write ADSR envelope
- Test with plotting/audio output

### 3. **Build Simple Synth** (Week 5-6)
- Combine oscillator + filter + envelope
- Add polyphony (voice management)
- Add MIDI input
- Framework: JUCE (C++), Web Audio API (JS)

### 4. **Study Effects** (Week 7-8)
- Implement delay
- Implement chorus/flanger
- Study convolution reverb
- Explore distortion/saturation

### 5. **Create VST Plugin** (Week 9-10)
- Use VST3 SDK or JUCE
- Implement processor/controller separation
- Add UI (knobs, sliders)
- Test in a DAW

### 6. **Advanced Topics** (Ongoing)
- Granular synthesis
- Physical modeling
- Spectral processing
- Machine learning (neural synthesis)

---

## Tools & Frameworks

### **JUCE** (C++) - ⭐ Most Popular
- Cross-platform audio framework
- VST/AU/AAX plugin support
- Visual components
- Audio utilities
- [JUCE Website](https://juce.com/)

### **Web Audio API** (JavaScript)
- Browser-based audio
- Real-time synthesis
- Good for prototyping
- [MDN Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

### **Pure Data / Max/MSP**
- Visual programming
- Rapid prototyping
- Educational

### **Faust**
- Functional DSP language
- Compiles to C++, Rust, WASM
- Mathematical approach

---

## Testing Your DSP Code

```cpp
// Unit test example
void testOscillator() {
    Oscillator osc;
    osc.setFrequency(1.0);  // 1 Hz
    osc.setSampleRate(100); // 100 samples/sec

    // After 100 samples (1 second), phase should wrap
    for (int i = 0; i < 100; i++) {
        osc.tick();
    }

    // Should be back at start of cycle
    assert(abs(osc.tick() - 0.0) < 0.01);
}
```

**Tools**:
- Plot output to visualize waveforms
- FFT analysis to check frequency content
- Audio comparison tests (golden files)

---

## Common Pitfalls

### 1. **Denormals**
```cpp
// Denormal numbers cause CPU slowdown
// Fix: Flush to zero
if (abs(value) < 1e-10) value = 0.0f;
```

### 2. **DC Offset**
```cpp
// Unintentional DC bias
// Fix: High-pass filter at very low freq
```

### 3. **Aliasing**
```cpp
// High frequencies fold back (artifacts)
// Fix: Oversample or use band-limited synthesis
```

### 4. **Clicks/Pops**
```cpp
// Discontinuities in waveform
// Fix: Smooth parameter changes, crossfade
```

### 5. **Thread Safety**
```cpp
// Data races between UI and audio thread
// Fix: Lock-free atomics, message passing
```

---

## Resources

### Books
- **"Designing Audio Effect Plugins in C++"** by Will Pirkle
- **"The Audio Programming Book"** (MIT Press)
- **"Think DSP"** by Allen Downey (free, beginner-friendly)

### Online
- [JUCE Tutorials](https://juce.com/learn/tutorials)
- [The Audio Programmer YouTube](https://www.youtube.com/c/TheAudioProgrammer)
- [Katja's DSP Resources](http://www.katjaas.nl/home/home.html)
- [musicdsp.org](https://www.musicdsp.org/) (algorithms archive)

### Communities
- [JUCE Forum](https://forum.juce.com/)
- [/r/audioengineering](https://reddit.com/r/audioengineering)
- [KVR Audio Developer Forum](https://www.kvraudio.com/forum/viewforum.php?f=33)

---

## Next Steps

1. **Run the example code**: Compile `SimpleVSTProcessor.cpp` with VST3 SDK
2. **Explore music theory**: Use `MusicTheoryLib.h` for your own projects
3. **Check existing libraries**: See `MUSIC_THEORY_LIBRARIES.md`
4. **Build something**: Start with a simple oscillator, iterate from there

**Remember**:
- Audio programming is **real-time systems programming**
- Sound design is **signal processing + creativity**
- Start simple, measure everything, optimize carefully

---

Happy coding! 🎵🎹🎸

**Sources**:
- [VST3 SDK Documentation](https://steinbergmedia.github.io/vst3_doc/vstsdk/index.html)
- [JUCE Framework](https://juce.com/)
- [Faust Programming Language](https://faust.grame.fr/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Think DSP Book](https://greenteapress.com/wp/think-dsp/)
- [Audio Programming Resources](https://audiodev.blog/newbie-resources/)
