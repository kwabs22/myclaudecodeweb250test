/*
 * Simple VST3 Synthesizer - Processor Component
 * Demonstrates core DSP concepts with a basic subtractive synthesizer
 */

#include "public.sdk/source/vst/vstaudioeffect.h"
#include <cmath>

using namespace Steinberg;
using namespace Steinberg::Vst;

// ============================================================================
// MUSIC THEORY UTILITIES (inline for demonstration)
// ============================================================================
namespace MusicTheory {
    // Convert MIDI note number to frequency in Hz
    inline float midiToFrequency(int midiNote) {
        // Formula: f = 440 * 2^((n - 69) / 12)
        // Where 69 is A4 (440 Hz)
        return 440.0f * std::pow(2.0f, (midiNote - 69) / 12.0f);
    }

    // Convert frequency to MIDI note (for pitch detection)
    inline int frequencyToMidi(float frequency) {
        return static_cast<int>(69 + 12 * std::log2(frequency / 440.0f));
    }

    // Normalize parameter (0-1) to a range
    inline float denormalize(float normalized, float min, float max) {
        return min + normalized * (max - min);
    }
}

// ============================================================================
// PARAMETER IDS (The "contract" between UI and DSP)
// ============================================================================
enum Parameters {
    kParamFilterCutoff = 0,  // Normalized 0-1
    kParamResonance = 1,
    kParamAttack = 2,
    kParamRelease = 3,
    kNumParams
};

// ============================================================================
// DSP BUILDING BLOCKS
// ============================================================================

// Oscillator: Generates periodic waveforms
class Oscillator {
public:
    void setSampleRate(float sr) { sampleRate = sr; }

    void setFrequency(float freq) {
        phaseIncrement = freq / sampleRate;
    }

    // Process one sample - returns sine wave output
    float tick() {
        float output = std::sin(phase * 2.0f * M_PI);
        phase += phaseIncrement;
        if (phase >= 1.0f) phase -= 1.0f;  // Wrap phase
        return output;
    }

    void reset() { phase = 0.0f; }

private:
    float phase = 0.0f;
    float phaseIncrement = 0.0f;
    float sampleRate = 44100.0f;
};

// Simple one-pole low-pass filter
class Filter {
public:
    void setCutoff(float cutoff) {
        // Simple smoothing coefficient (0-1)
        // Higher = brighter, lower = darker
        coefficient = std::clamp(cutoff, 0.0f, 1.0f);
    }

    float process(float input) {
        // Exponential moving average
        output = input * coefficient + output * (1.0f - coefficient);
        return output;
    }

    void reset() { output = 0.0f; }

private:
    float coefficient = 1.0f;
    float output = 0.0f;
};

// ADSR Envelope: Controls amplitude over time
class Envelope {
public:
    enum State { IDLE, ATTACK, DECAY, SUSTAIN, RELEASE };

    void setSampleRate(float sr) { sampleRate = sr; }

    void setAttack(float seconds) {
        attackRate = 1.0f / (seconds * sampleRate);
    }

    void setRelease(float seconds) {
        releaseRate = 1.0f / (seconds * sampleRate);
    }

    void noteOn() {
        state = ATTACK;
        level = 0.0f;
    }

    void noteOff() {
        state = RELEASE;
    }

    float tick() {
        switch (state) {
            case ATTACK:
                level += attackRate;
                if (level >= 1.0f) {
                    level = 1.0f;
                    state = SUSTAIN;
                }
                break;

            case SUSTAIN:
                // Hold at maximum level
                break;

            case RELEASE:
                level -= releaseRate;
                if (level <= 0.0f) {
                    level = 0.0f;
                    state = IDLE;
                }
                break;

            case IDLE:
            case DECAY:
                break;
        }
        return level;
    }

    bool isActive() const { return state != IDLE; }

private:
    State state = IDLE;
    float level = 0.0f;
    float attackRate = 0.001f;
    float releaseRate = 0.001f;
    float sampleRate = 44100.0f;
};

// ============================================================================
// VOICE (One instance per note)
// ============================================================================
class Voice {
public:
    void setSampleRate(float sr) {
        oscillator.setSampleRate(sr);
        envelope.setSampleRate(sr);
    }

    void noteOn(int midiNote, float velocity) {
        this->midiNote = midiNote;
        this->velocity = velocity;

        float frequency = MusicTheory::midiToFrequency(midiNote);
        oscillator.setFrequency(frequency);
        oscillator.reset();

        envelope.noteOn();
    }

    void noteOff() {
        envelope.noteOff();
    }

    void setFilterCutoff(float cutoff) {
        filter.setCutoff(cutoff);
    }

    void setEnvelopeParams(float attack, float release) {
        envelope.setAttack(attack);
        envelope.setRelease(release);
    }

    // Process one sample
    float tick() {
        if (!envelope.isActive()) return 0.0f;

        // Signal chain: Oscillator -> Filter -> Envelope
        float sample = oscillator.tick();     // Generate waveform
        sample = filter.process(sample);       // Shape timbre
        sample *= envelope.tick();             // Shape amplitude
        sample *= velocity;                    // Apply note velocity

        return sample;
    }

    bool isActive() const { return envelope.isActive(); }
    int getMidiNote() const { return midiNote; }

private:
    Oscillator oscillator;
    Filter filter;
    Envelope envelope;
    int midiNote = -1;
    float velocity = 1.0f;
};

// ============================================================================
// PROCESSOR (The actual VST plugin - DSP thread)
// ============================================================================
class SimpleSynthProcessor : public AudioEffect {
public:
    SimpleSynthProcessor() {
        setControllerClass(SimpleSynthControllerUID);
    }

    // Initialize processing
    tresult PLUGIN_API initialize(FUnknown* context) override {
        tresult result = AudioEffect::initialize(context);
        if (result != kResultOk) return result;

        // Setup audio buses
        addAudioOutput(STR16("Stereo Out"), SpeakerArr::kStereo);
        addEventInput(STR16("MIDI In"), 1);

        return kResultOk;
    }

    // Setup processing
    tresult PLUGIN_API setupProcessing(ProcessSetup& setup) override {
        float sampleRate = static_cast<float>(setup.sampleRate);

        for (auto& voice : voices) {
            voice.setSampleRate(sampleRate);
        }

        return AudioEffect::setupProcessing(setup);
    }

    // THE CORE AUDIO CALLBACK (called every buffer)
    tresult PLUGIN_API process(ProcessData& data) override {
        // Process parameter changes from UI
        if (data.inputParameterChanges) {
            processParameterChanges(data.inputParameterChanges);
        }

        // Process MIDI events (note on/off)
        if (data.inputEvents) {
            processMidiEvents(data.inputEvents);
        }

        // Process audio (generate samples)
        if (data.numOutputs > 0) {
            processAudio(data);
        }

        return kResultOk;
    }

private:
    static constexpr int MAX_VOICES = 8;  // Polyphony
    Voice voices[MAX_VOICES];

    // Current parameter values (updated from UI)
    float filterCutoff = 1.0f;
    float resonance = 0.0f;
    float attack = 0.01f;
    float release = 0.1f;

    void processParameterChanges(IParameterChanges* changes) {
        int32 numChanges = changes->getParameterCount();

        for (int32 i = 0; i < numChanges; i++) {
            IParamValueQueue* queue = changes->getParameterData(i);
            if (!queue) continue;

            int32 numPoints = queue->getPointCount();
            if (numPoints == 0) continue;

            ParamValue value;
            int32 sampleOffset;

            // Get the last value in the queue
            if (queue->getPoint(numPoints - 1, sampleOffset, value) == kResultOk) {
                int32 paramId = queue->getParameterId();

                switch (paramId) {
                    case kParamFilterCutoff:
                        filterCutoff = static_cast<float>(value);
                        break;

                    case kParamResonance:
                        resonance = static_cast<float>(value);
                        break;

                    case kParamAttack:
                        // Map 0-1 to 0.001-2.0 seconds
                        attack = MusicTheory::denormalize(value, 0.001f, 2.0f);
                        break;

                    case kParamRelease:
                        // Map 0-1 to 0.01-5.0 seconds
                        release = MusicTheory::denormalize(value, 0.01f, 5.0f);
                        break;
                }
            }
        }
    }

    void processMidiEvents(IEventList* events) {
        int32 numEvents = events->getEventCount();

        for (int32 i = 0; i < numEvents; i++) {
            Event event;
            if (events->getEvent(i, event) != kResultOk) continue;

            switch (event.type) {
                case Event::kNoteOnEvent: {
                    int midiNote = event.noteOn.pitch;
                    float velocity = event.noteOn.velocity;

                    // Find free voice
                    Voice* freeVoice = nullptr;
                    for (auto& voice : voices) {
                        if (!voice.isActive()) {
                            freeVoice = &voice;
                            break;
                        }
                    }

                    if (freeVoice) {
                        freeVoice->setEnvelopeParams(attack, release);
                        freeVoice->setFilterCutoff(filterCutoff);
                        freeVoice->noteOn(midiNote, velocity);
                    }
                    break;
                }

                case Event::kNoteOffEvent: {
                    int midiNote = event.noteOff.pitch;

                    // Find voice playing this note
                    for (auto& voice : voices) {
                        if (voice.isActive() && voice.getMidiNote() == midiNote) {
                            voice.noteOff();
                        }
                    }
                    break;
                }
            }
        }
    }

    void processAudio(ProcessData& data) {
        // Get output buffers (stereo)
        float* outputL = data.outputs[0].channelBuffers32[0];
        float* outputR = data.outputs[0].channelBuffers32[1];
        int32 numSamples = data.numSamples;

        // Clear output buffer
        memset(outputL, 0, numSamples * sizeof(float));
        memset(outputR, 0, numSamples * sizeof(float));

        // Mix all voices
        for (int32 sample = 0; sample < numSamples; sample++) {
            float mixedSample = 0.0f;

            // Sum all active voices
            for (auto& voice : voices) {
                if (voice.isActive()) {
                    mixedSample += voice.tick();
                }
            }

            // Output to both channels (mono to stereo)
            // Scale down to prevent clipping
            outputL[sample] = mixedSample * 0.3f;
            outputR[sample] = mixedSample * 0.3f;
        }
    }
};

// ============================================================================
// FACTORY (VST3 boilerplate)
// ============================================================================
// Note: In real VST3, you need proper GUIDs and factory setup
// This is simplified for demonstration
