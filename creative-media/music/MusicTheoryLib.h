/*
 * Music Theory Library - Comprehensive C++ Implementation
 * Demonstrates common music theory computations
 */

#pragma once
#include <cmath>
#include <string>
#include <vector>
#include <array>
#include <map>

namespace MusicTheory {

// ============================================================================
// FUNDAMENTAL CONVERSIONS
// ============================================================================

class Pitch {
public:
    // MIDI note to frequency (Hz)
    static float midiToFrequency(int midiNote) {
        // f = 440 * 2^((n - 69) / 12)
        // A4 (440 Hz) is MIDI note 69
        return 440.0f * std::pow(2.0f, (midiNote - 69) / 12.0f);
    }

    // Frequency to MIDI note (for pitch detection)
    static int frequencyToMidi(float frequency) {
        // n = 69 + 12 * log2(f / 440)
        return static_cast<int>(std::round(69 + 12 * std::log2(frequency / 440.0f)));
    }

    // MIDI note to cents (from A4)
    static float midiToCents(int midiNote) {
        return (midiNote - 69) * 100.0f;
    }

    // Cents to frequency ratio
    static float centsToRatio(float cents) {
        return std::pow(2.0f, cents / 1200.0f);
    }
};

// ============================================================================
// NOTE REPRESENTATION
// ============================================================================

enum class NoteName {
    C = 0, Cs, D, Ds, E, F, Fs, G, Gs, A, As, B
};

enum class Accidental {
    DoubleFlat = -2, Flat = -1, Natural = 0, Sharp = 1, DoubleSharp = 2
};

class Note {
public:
    Note(NoteName name, int octave, Accidental accidental = Accidental::Natural)
        : name(name), octave(octave), accidental(accidental) {}

    // Convert to MIDI note number
    int toMidi() const {
        int pitchClass = static_cast<int>(name);
        int offset = static_cast<int>(accidental);
        // C4 (middle C) = MIDI 60
        return (octave + 1) * 12 + pitchClass + offset;
    }

    // Create from MIDI number
    static Note fromMidi(int midiNote, bool preferSharps = true) {
        int octave = (midiNote / 12) - 1;
        int pitchClass = midiNote % 12;

        NoteName name = static_cast<NoteName>(pitchClass);
        return Note(name, octave);
    }

    // Get frequency
    float frequency() const {
        return Pitch::midiToFrequency(toMidi());
    }

    // Get note name as string
    std::string toString() const {
        const char* names[] = {"C", "C#", "D", "D#", "E", "F",
                                "F#", "G", "G#", "A", "A#", "B"};
        return std::string(names[static_cast<int>(name)]) +
               std::to_string(octave);
    }

private:
    NoteName name;
    int octave;
    Accidental accidental;
};

// ============================================================================
// INTERVALS
// ============================================================================

enum class IntervalQuality {
    Diminished, Minor, Perfect, Major, Augmented
};

class Interval {
public:
    // Interval in semitones
    static constexpr int UNISON = 0;
    static constexpr int MINOR_SECOND = 1;
    static constexpr int MAJOR_SECOND = 2;
    static constexpr int MINOR_THIRD = 3;
    static constexpr int MAJOR_THIRD = 4;
    static constexpr int PERFECT_FOURTH = 5;
    static constexpr int TRITONE = 6;
    static constexpr int PERFECT_FIFTH = 7;
    static constexpr int MINOR_SIXTH = 8;
    static constexpr int MAJOR_SIXTH = 9;
    static constexpr int MINOR_SEVENTH = 10;
    static constexpr int MAJOR_SEVENTH = 11;
    static constexpr int OCTAVE = 12;

    // Apply interval to a note
    static Note transpose(const Note& note, int semitones) {
        return Note::fromMidi(note.toMidi() + semitones);
    }

    // Get interval between two notes
    static int semitonesBetween(const Note& from, const Note& to) {
        return to.toMidi() - from.toMidi();
    }

    // Get interval name
    static std::string getName(int semitones) {
        const std::array<std::string, 12> names = {
            "Unison", "Minor 2nd", "Major 2nd", "Minor 3rd",
            "Major 3rd", "Perfect 4th", "Tritone", "Perfect 5th",
            "Minor 6th", "Major 6th", "Minor 7th", "Major 7th"
        };

        int normalized = ((semitones % 12) + 12) % 12;
        return names[normalized];
    }

    // Frequency ratio for interval
    static float ratio(int semitones) {
        return std::pow(2.0f, semitones / 12.0f);
    }
};

// ============================================================================
// SCALES
// ============================================================================

class Scale {
public:
    // Scale as interval pattern (semitones from root)
    using Pattern = std::vector<int>;

    // Common scale patterns
    static const Pattern MAJOR;
    static const Pattern MINOR;
    static const Pattern HARMONIC_MINOR;
    static const Pattern MELODIC_MINOR;
    static const Pattern PENTATONIC_MAJOR;
    static const Pattern PENTATONIC_MINOR;
    static const Pattern BLUES;
    static const Pattern DORIAN;
    static const Pattern PHRYGIAN;
    static const Pattern LYDIAN;
    static const Pattern MIXOLYDIAN;
    static const Pattern LOCRIAN;

    Scale(const Note& root, const Pattern& pattern)
        : root(root), pattern(pattern) {}

    // Get all notes in scale
    std::vector<Note> getNotes() const {
        std::vector<Note> notes;
        for (int interval : pattern) {
            notes.push_back(Interval::transpose(root, interval));
        }
        return notes;
    }

    // Get note at scale degree (1-indexed)
    Note getDegree(int degree) const {
        int index = (degree - 1) % pattern.size();
        int octaveOffset = (degree - 1) / pattern.size();
        int semitones = pattern[index] + (octaveOffset * 12);
        return Interval::transpose(root, semitones);
    }

    // Check if note is in scale
    bool contains(const Note& note) const {
        int semitones = (note.toMidi() - root.toMidi()) % 12;
        if (semitones < 0) semitones += 12;

        for (int interval : pattern) {
            if (interval % 12 == semitones) return true;
        }
        return false;
    }

private:
    Note root;
    Pattern pattern;
};

// Define scale patterns
const Scale::Pattern Scale::MAJOR = {0, 2, 4, 5, 7, 9, 11};
const Scale::Pattern Scale::MINOR = {0, 2, 3, 5, 7, 8, 10};
const Scale::Pattern Scale::HARMONIC_MINOR = {0, 2, 3, 5, 7, 8, 11};
const Scale::Pattern Scale::MELODIC_MINOR = {0, 2, 3, 5, 7, 9, 11};
const Scale::Pattern Scale::PENTATONIC_MAJOR = {0, 2, 4, 7, 9};
const Scale::Pattern Scale::PENTATONIC_MINOR = {0, 3, 5, 7, 10};
const Scale::Pattern Scale::BLUES = {0, 3, 5, 6, 7, 10};
const Scale::Pattern Scale::DORIAN = {0, 2, 3, 5, 7, 9, 10};
const Scale::Pattern Scale::PHRYGIAN = {0, 1, 3, 5, 7, 8, 10};
const Scale::Pattern Scale::LYDIAN = {0, 2, 4, 6, 7, 9, 11};
const Scale::Pattern Scale::MIXOLYDIAN = {0, 2, 4, 5, 7, 9, 10};
const Scale::Pattern Scale::LOCRIAN = {0, 1, 3, 5, 6, 8, 10};

// ============================================================================
// CHORDS
// ============================================================================

class Chord {
public:
    // Chord as interval pattern
    using Pattern = std::vector<int>;

    // Common chord patterns (semitones from root)
    static const Pattern MAJOR_TRIAD;
    static const Pattern MINOR_TRIAD;
    static const Pattern DIMINISHED_TRIAD;
    static const Pattern AUGMENTED_TRIAD;
    static const Pattern MAJOR_SEVENTH;
    static const Pattern MINOR_SEVENTH;
    static const Pattern DOMINANT_SEVENTH;
    static const Pattern DIMINISHED_SEVENTH;
    static const Pattern HALF_DIMINISHED;

    Chord(const Note& root, const Pattern& pattern)
        : root(root), pattern(pattern) {}

    // Get all notes in chord
    std::vector<Note> getNotes() const {
        std::vector<Note> notes;
        for (int interval : pattern) {
            notes.push_back(Interval::transpose(root, interval));
        }
        return notes;
    }

    // Get inversion (0 = root position)
    Chord getInversion(int inversion) const {
        Pattern invertedPattern = pattern;

        for (int i = 0; i < inversion; i++) {
            int lowestNote = invertedPattern[0];
            invertedPattern.erase(invertedPattern.begin());
            invertedPattern.push_back(lowestNote + 12);
        }

        return Chord(root, invertedPattern);
    }

    // Get chord name
    std::string getName() const {
        // Simplified - would need more complex logic for full naming
        if (pattern == MAJOR_TRIAD) return root.toString() + " Major";
        if (pattern == MINOR_TRIAD) return root.toString() + " Minor";
        if (pattern == DOMINANT_SEVENTH) return root.toString() + "7";
        return root.toString() + " Chord";
    }

private:
    Note root;
    Pattern pattern;
};

// Define chord patterns
const Chord::Pattern Chord::MAJOR_TRIAD = {0, 4, 7};
const Chord::Pattern Chord::MINOR_TRIAD = {0, 3, 7};
const Chord::Pattern Chord::DIMINISHED_TRIAD = {0, 3, 6};
const Chord::Pattern Chord::AUGMENTED_TRIAD = {0, 4, 8};
const Chord::Pattern Chord::MAJOR_SEVENTH = {0, 4, 7, 11};
const Chord::Pattern Chord::MINOR_SEVENTH = {0, 3, 7, 10};
const Chord::Pattern Chord::DOMINANT_SEVENTH = {0, 4, 7, 10};
const Chord::Pattern Chord::DIMINISHED_SEVENTH = {0, 3, 6, 9};
const Chord::Pattern Chord::HALF_DIMINISHED = {0, 3, 6, 10};

// ============================================================================
// PROGRESSIONS
// ============================================================================

class Progression {
public:
    // Roman numeral chord progression (scale degrees)
    static std::vector<Chord> generateFromDegrees(
        const Scale& scale,
        const std::vector<int>& degrees,
        bool sevenths = false
    ) {
        std::vector<Chord> chords;

        for (int degree : degrees) {
            Note root = scale.getDegree(degree);

            // Determine chord quality based on scale degree
            Chord::Pattern pattern;
            if (degree == 1 || degree == 4 || degree == 5) {
                pattern = sevenths ? Chord::DOMINANT_SEVENTH : Chord::MAJOR_TRIAD;
            } else if (degree == 2 || degree == 3 || degree == 6) {
                pattern = sevenths ? Chord::MINOR_SEVENTH : Chord::MINOR_TRIAD;
            } else if (degree == 7) {
                pattern = Chord::DIMINISHED_TRIAD;
            }

            chords.push_back(Chord(root, pattern));
        }

        return chords;
    }

    // Common progressions
    static std::vector<int> I_IV_V() { return {1, 4, 5}; }
    static std::vector<int> I_V_vi_IV() { return {1, 5, 6, 4}; }  // Pop progression
    static std::vector<int> ii_V_I() { return {2, 5, 1}; }        // Jazz turnaround
    static std::vector<int> I_vi_IV_V() { return {1, 6, 4, 5}; }  // 50s progression
};

// ============================================================================
// RHYTHM & TIME
// ============================================================================

class Rhythm {
public:
    // Convert BPM to milliseconds per beat
    static float bpmToMs(float bpm) {
        return 60000.0f / bpm;
    }

    // Convert BPM to seconds per beat
    static float bpmToSeconds(float bpm) {
        return 60.0f / bpm;
    }

    // Convert note duration to samples
    static int durationToSamples(float bpm, float noteValue, float sampleRate) {
        // noteValue: 1.0 = quarter, 0.5 = eighth, 2.0 = half, etc.
        float secondsPerBeat = bpmToSeconds(bpm);
        float seconds = secondsPerBeat * noteValue;
        return static_cast<int>(seconds * sampleRate);
    }

    // Swing ratio (typically 1.5-2.0 for triplet feel)
    static float swingRatio(float swing) {
        return 1.0f + swing;
    }
};

// ============================================================================
// EXAMPLE USAGE
// ============================================================================
/*
int main() {
    // Create a note
    Note middleC(NoteName::C, 4);
    std::cout << "Middle C frequency: " << middleC.frequency() << " Hz\n";

    // Create a scale
    Scale cMajor(middleC, Scale::MAJOR);
    std::cout << "C Major scale notes:\n";
    for (const auto& note : cMajor.getNotes()) {
        std::cout << "  " << note.toString() << "\n";
    }

    // Create a chord
    Chord cMajorChord(middleC, Chord::MAJOR_TRIAD);
    std::cout << "\nC Major chord notes:\n";
    for (const auto& note : cMajorChord.getNotes()) {
        std::cout << "  " << note.toString() << " - " << note.frequency() << " Hz\n";
    }

    // Generate progression (I-V-vi-IV in C)
    auto progression = Progression::generateFromDegrees(
        cMajor,
        Progression::I_V_vi_IV()
    );

    std::cout << "\nI-V-vi-IV progression in C:\n";
    for (const auto& chord : progression) {
        std::cout << "  " << chord.getName() << "\n";
    }

    return 0;
}
*/

} // namespace MusicTheory
