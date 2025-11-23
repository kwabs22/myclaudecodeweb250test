/*
 * Simple VST3 Synthesizer - Controller Component
 * Handles UI and parameter management (UI thread, separate from audio)
 */

#include "public.sdk/source/vst/vsteditcontroller.h"

using namespace Steinberg;
using namespace Steinberg::Vst;

// ============================================================================
// CONTROLLER (UI thread - separate from DSP)
// ============================================================================
class SimpleSynthController : public EditController {
public:
    // Initialize parameters
    tresult PLUGIN_API initialize(FUnknown* context) override {
        tresult result = EditController::initialize(context);
        if (result != kResultOk) return result;

        // Define parameters (the "contract" with processor)
        // These appear in the DAW's automation system

        // Filter Cutoff: 0-1 (normalized)
        parameters.addParameter(
            STR16("Cutoff"),           // Display name
            STR16("Hz"),               // Units
            0,                         // Step count (0 = continuous)
            0.8,                       // Default value
            ParameterInfo::kCanAutomate,
            kParamFilterCutoff         // ID
        );

        // Resonance: 0-1
        parameters.addParameter(
            STR16("Resonance"),
            STR16("%"),
            0,
            0.0,
            ParameterInfo::kCanAutomate,
            kParamResonance
        );

        // Attack: 0-1 (mapped to 0.001-2.0 seconds in processor)
        parameters.addParameter(
            STR16("Attack"),
            STR16("s"),
            0,
            0.1,                       // Default = 0.1 (mapped to ~0.2s)
            ParameterInfo::kCanAutomate,
            kParamAttack
        );

        // Release: 0-1 (mapped to 0.01-5.0 seconds in processor)
        parameters.addParameter(
            STR16("Release"),
            STR16("s"),
            0,
            0.2,                       // Default = 0.2 (mapped to ~1s)
            ParameterInfo::kCanAutomate,
            kParamRelease
        );

        return kResultOk;
    }

    // Convert normalized value (0-1) to display string
    tresult PLUGIN_API getParamStringByValue(
        ParamID id,
        ParamValue normalized,
        String128 string
    ) override {
        switch (id) {
            case kParamFilterCutoff: {
                // Display as frequency approximation
                float freq = 20.0f + normalized * 20000.0f;
                char text[32];
                sprintf(text, "%.0f Hz", freq);
                Steinberg::UString(string, 128).fromAscii(text);
                return kResultOk;
            }

            case kParamResonance: {
                char text[32];
                sprintf(text, "%.0f%%", normalized * 100.0f);
                Steinberg::UString(string, 128).fromAscii(text);
                return kResultOk;
            }

            case kParamAttack: {
                float seconds = 0.001f + normalized * 1.999f;
                char text[32];
                sprintf(text, "%.3f s", seconds);
                Steinberg::UString(string, 128).fromAscii(text);
                return kResultOk;
            }

            case kParamRelease: {
                float seconds = 0.01f + normalized * 4.99f;
                char text[32];
                sprintf(text, "%.2f s", seconds);
                Steinberg::UString(string, 128).fromAscii(text);
                return kResultOk;
            }
        }

        return EditController::getParamStringByValue(id, normalized, string);
    }

    // Convert display string to normalized value (0-1)
    tresult PLUGIN_API getParamValueByString(
        ParamID id,
        TChar* string,
        ParamValue& normalized
    ) override {
        // Parse user input (if custom UI allows text entry)
        // For simplicity, delegate to default implementation
        return EditController::getParamValueByString(id, string, normalized);
    }

    // Create custom UI view (optional)
    // IPlugView* PLUGIN_API createView(FIDString name) override {
    //     if (strcmp(name, ViewType::kEditor) == 0) {
    //         return new MySynthView(this);
    //     }
    //     return nullptr;
    // }
};

// ============================================================================
// KEY ARCHITECTURAL CONCEPTS DEMONSTRATED
// ============================================================================
/*
 * 1. SEPARATION OF CONCERNS:
 *    - Processor (audio thread): Time-critical DSP
 *    - Controller (UI thread): User interaction, no real-time constraints
 *    - Communication via parameter changes (lock-free queues)
 *
 * 2. PARAMETER NORMALIZATION:
 *    - All parameters stored as 0.0-1.0 (DAW standard)
 *    - Denormalized to actual ranges in processor
 *    - Enables automation, presets, MIDI learn
 *
 * 3. REAL-TIME SAFETY:
 *    - No memory allocation in process()
 *    - No file I/O in process()
 *    - Lock-free parameter updates
 *
 * 4. VOICE ARCHITECTURE:
 *    - Each voice is independent (polyphony)
 *    - Voice stealing when out of voices
 *    - Per-voice state machines (envelope)
 *
 * 5. SIGNAL FLOW:
 *    MIDI Event -> Voice Allocator
 *                  -> Oscillator (generate)
 *                  -> Filter (shape)
 *                  -> Envelope (amplitude)
 *                  -> Mixer (sum voices)
 *                  -> Output
 *
 * ANALOGY TO OTHER DOMAINS:
 * - Processor = Game Engine (real-time loop)
 * - Controller = UI Layer (event-driven)
 * - Voice = Game Entity (pooled, lifecycle managed)
 * - Parameters = Observable State (reactive)
 * - Buffer = Frame Buffer (processed per tick)
 */
