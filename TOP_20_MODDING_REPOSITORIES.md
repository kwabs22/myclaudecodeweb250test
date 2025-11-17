# Top 20 Game Modding Repositories

A curated list of the most relevant and essential GitHub repositories for game modding, covering frameworks, tools, and example projects.

**Last Updated**: 2025-11-17
**Total Repositories**: 20
**Categories**: Frameworks (8) | Tools (7) | Example Projects (5)

---

## Table of Contents

1. [Universal Frameworks](#universal-frameworks)
2. [Unity Modding](#unity-modding)
3. [Unreal Engine Modding](#unreal-engine-modding)
4. [Bethesda Game Modding](#bethesda-game-modding)
5. [Minecraft Modding](#minecraft-modding)
6. [Universal Tools](#universal-tools)
7. [Quick Reference Matrix](#quick-reference-matrix)

---

## Universal Frameworks

### 1. **Harmony**
**Repository**: https://github.com/pardeike/Harmony
**Stars**: ~5,300+
**Language**: C#
**License**: MIT

**Description**:
Harmony is a library for patching, replacing and decorating .NET and Mono methods during runtime. It's the foundation for most modern game modding in C#-based games.

**Why Essential**:
- Industry standard for .NET game modding
- Non-destructive patching (doesn't modify original files)
- Multiple mods can patch the same method
- Supports Prefix, Postfix, Transpiler, and Finalizer patches
- Used by RimWorld, Cities: Skylines, and hundreds of other games

**What You'll Learn**:
- Runtime method patching
- IL code manipulation
- Reflection and advanced C#
- Non-invasive code modification

**Key Features**:
```csharp
[HarmonyPatch(typeof(ClassName), "MethodName")]
class Patch
{
    static bool Prefix() { /* runs before */ }
    static void Postfix() { /* runs after */ }
    static IEnumerable<CodeInstruction> Transpiler() { /* modifies IL */ }
}
```

**Use Cases**:
- Modifying game behavior without source access
- Bug fixing
- Adding new features
- Balancing adjustments

**Getting Started**:
1. Install via NuGet: `Install-Package Lib.Harmony`
2. Read documentation at https://harmony.pardeike.net/
3. Study example patches in wiki
4. Start with simple Prefix/Postfix patches

---

### 2. **HarmonyX**
**Repository**: https://github.com/BepInEx/HarmonyX
**Stars**: ~500+
**Language**: C#
**License**: MIT

**Description**:
HarmonyX is a fork of Harmony 2.x that specializes in support for games and game modding frameworks, built on MonoMod.RuntimeDetours.

**Why Essential**:
- Better performance for game modding
- Enhanced IL2CPP support
- Integration with BepInEx
- Additional features for complex scenarios

**Key Differences from Harmony**:
- Built on MonoMod for better compatibility
- Optimized for Unity IL2CPP games
- Additional debugging tools
- Game framework focused

**When to Use**:
- Working with BepInEx
- Modding IL2CPP Unity games
- Need advanced debugging features
- Performance is critical

---

## Unity Modding

### 3. **BepInEx**
**Repository**: https://github.com/BepInEx/BepInEx
**Stars**: ~6,900+
**Language**: C#
**License**: LGPL-2.1

**Description**:
BepInEx is a general purpose framework for Unity modding. It's a plugin/modding framework for Unity Mono, IL2CPP and .NET framework games.

**Why Essential**:
- Most popular Unity modding framework
- Supports Mono and IL2CPP
- Cross-platform (Windows, Linux, macOS)
- Extensive plugin ecosystem
- Excellent documentation

**What You'll Learn**:
- Unity game structure
- Plugin architecture
- Configuration systems
- Logging and debugging
- IL2CPP internals

**Supported Games** (Examples):
- Valheim
- Lethal Company
- Among Us
- Risk of Rain 2
- Subnautica
- Cities: Skylines
- Dyson Sphere Program

**Plugin Template**:
```csharp
[BepInPlugin("com.author.modname", "Mod Name", "1.0.0")]
public class MyMod : BaseUnityPlugin
{
    void Awake()
    {
        Logger.LogInfo("Loading mod...");
        Harmony.CreateAndPatchAll(typeof(Patches));
    }
}
```

**Ecosystem**:
- BepInEx.ConfigurationManager - In-game config UI
- BepInEx.MonoMod.HookGenPatcher - Easier hooking
- UnityExplorer - Runtime Unity inspector

**Getting Started**:
1. Download from https://github.com/BepInEx/BepInEx/releases
2. Extract to game root folder
3. Run game once to generate config
4. Create plugin DLL in BepInEx/plugins/
5. Read docs at https://docs.bepinex.dev/

---

### 4. **MelonLoader**
**Repository**: https://github.com/LavaGang/MelonLoader
**Stars**: ~1,500+
**Language**: C#
**License**: Apache-2.0

**Description**:
Universal mod loader for games built in Unity, supporting both Mono and IL2CPP backends.

**Why Essential**:
- First to support new Unity versions often
- Strong IL2CPP support
- Alternative to BepInEx
- Active development

**Key Features**:
- Automatic dependency resolution
- Mod preference system
- Console with mod management
- Support for Unity 2017-2023+

**When to Use Over BepInEx**:
- Game not compatible with BepInEx
- Existing mod ecosystem uses MelonLoader
- Bleeding-edge Unity version
- Preference for MelonLoader's architecture

**Example Games**:
- VRChat
- Boneworks
- BONELAB
- Blade & Sorcery

**MelonMod Template**:
```csharp
public class MyMod : MelonMod
{
    public override void OnApplicationStart()
    {
        LoggerInstance.Msg("Mod loaded!");
    }
}
```

---

### 5. **AssetStudio**
**Repository**: https://github.com/Perfare/AssetStudio
**Stars**: ~13,000+
**Language**: C#
**License**: MIT

**Description**:
AssetStudio is a tool for exploring, extracting and exporting assets and assetbundles from Unity games.

**Why Essential**:
- Extract textures, models, audio from Unity games
- View and export asset bundles
- Essential for asset replacement mods
- Supports wide range of Unity versions

**What You'll Learn**:
- Unity asset structure
- Asset bundle format
- Texture formats
- Model formats (FBX export)

**Supported Asset Types**:
- Textures (PNG, TGA)
- Models (FBX)
- Audio (WAV, MP3)
- Shaders
- Animations
- Fonts
- Text assets

**Use Cases**:
- Extracting game textures for modding
- Viewing game models
- Analyzing asset structure
- Creating HD texture packs

**Alternative**: UABE (Unity Assets Bundle Extractor)

---

### 6. **UnityExplorer**
**Repository**: https://github.com/sinai-dev/UnityExplorer
**Stars**: ~1,700+
**Language**: C#
**License**: GPL-3.0

**Description**:
In-game UI for exploring, debugging and modifying Unity games at runtime.

**Why Essential**:
- Inspect GameObjects in real-time
- Modify values during gameplay
- Test mod ideas instantly
- Debug without restarting

**Key Features**:
- Object explorer (scene hierarchy)
- Inspector for components
- C# REPL console
- Search functionality
- Mouse inspector (click to select)
- Texture viewer

**Integration**:
- BepInEx plugin
- MelonLoader mod
- Standalone

**Use Cases**:
- Finding object names/paths for mods
- Testing value changes
- Debugging mod interactions
- Learning game structure

**Developer Experience**:
```csharp
// Use C# console to test code live:
GameObject.Find("Player").GetComponent<Health>().currentHP = 999;
```

---

## Unreal Engine Modding

### 7. **UE4SS (Unreal Engine 4/5 Scripting System)**
**Repository**: https://github.com/UE4SS-RE/RE-UE4SS
**Stars**: ~1,200+
**Language**: C++
**License**: GPL-3.0

**Description**:
Scripting system, mod loader, debugging tool and SDK for UE4/UE5 games.

**Why Essential**:
- Official UE modding tools are game-specific
- Enables Lua scripting in UE games
- Blueprint mod loader
- Works with many UE4/UE5 games out of the box

**What You'll Learn**:
- Unreal Engine internals
- UObject system
- Blueprint structure
- Lua scripting
- UE game modding

**Key Features**:
- Lua scripting API
- Blueprint mod loading
- Live debugging
- UHT dumper (generates SDK)
- Console enabler
- Hot reload

**Supported Games** (Examples):
- Palworld
- Satisfactory
- Deep Rock Galactic
- Hogwarts Legacy
- Remnant 2

**Lua Example**:
```lua
RegisterHook("/Script/Engine.PlayerController:ClientRestart", function()
    print("Player respawned!")
end)
```

**Getting Started**:
1. Download from releases
2. Extract to game's Win64 folder
3. Edit Mods/mods.txt to enable mods
4. Write Lua scripts in Mods/ folder

---

### 8. **FModel**
**Repository**: https://github.com/4sval/FModel
**Stars**: ~1,200+
**Language**: C#
**License**: GPL-3.0

**Description**:
FModel is a generic .PAK file explorer/viewer for Unreal Engine games, with support for thousands of games.

**Why Essential**:
- Extract assets from UE games
- View textures, models, sounds
- Analyze game data
- Create asset replacement mods

**What You'll Learn**:
- Unreal Engine .pak structure
- Asset cooking pipeline
- Texture formats
- Game file organization

**Supported Formats**:
- .pak (Unreal packages)
- .utoc/.ucas (UE5 I/O Store)
- Textures → PNG export
- Models → PSK/glTF export
- Audio → OGG/WAV export

**Use Cases**:
- HD texture mods
- Character model swaps
- Audio replacements
- Data mining

**Advanced Features**:
- AES key management
- Bulk export
- Audio player
- 3D model viewer
- Hex viewer

---

## Bethesda Game Modding

### 9. **xEdit (TES5Edit/SSEEdit/FO4Edit)**
**Repository**: https://github.com/TES5Edit/TES5Edit
**Stars**: ~800+
**Language**: Delphi (Pascal)
**License**: MPL-1.1

**Description**:
Advanced graphical module editor and conflict detector for Bethesda games (Skyrim, Fallout, Oblivion, Starfield).

**Why Essential**:
- Industry standard for Bethesda modding
- Edit .esp/.esm plugins
- Detect mod conflicts
- Clean dirty edits
- Batch processing with scripts

**What You'll Learn**:
- Bethesda plugin structure
- Record types and forms
- Load order management
- Conflict resolution
- FormID systems

**Supported Games**:
- Morrowind (TESEdit)
- Oblivion (TES4Edit)
- Skyrim (TES5Edit)
- Skyrim SE (SSEEdit)
- Fallout 3 (FO3Edit)
- Fallout NV (FNVEdit)
- Fallout 4 (FO4Edit)
- Starfield (SF1Edit)

**Key Features**:
- View all records in plugins
- Edit any value
- Conflict detection (red/yellow highlighting)
- Reference tracking
- Script-based automation (Pascal scripts)

**Use Cases**:
- Creating compatibility patches
- Balancing weapons/armor
- Modifying NPC stats
- Cleaning master files
- Analyzing mod conflicts

**xEdit Scripts**:
```pascal
unit UserScript;

function Process(e: IInterface): integer;
begin
  // Modify all weapons
  if Signature(e) = 'WEAP' then
  begin
    SetElementEditValues(e, 'DATA\Damage', '100');
  end;
end;
```

---

### 10. **Mod Organizer 2**
**Repository**: https://github.com/ModOrganizer2/modorganizer
**Stars**: ~2,100+
**Language**: C++
**License**: GPL-3.0

**Description**:
Advanced mod manager with virtual file system for Bethesda games and others.

**Why Essential**:
- No file conflicts (virtual file system)
- Profile system (different mod setups)
- Superior to Vortex for power users
- Plugin load order management

**What You'll Learn**:
- Virtual file systems
- Mod load order mechanics
- BSA/BA2 archive handling
- Plugin management

**Supported Games**:
- All Bethesda games (Skyrim, Fallout, Starfield)
- The Witcher series
- Dark Souls series
- Many others via plugins

**Key Features**:
- Virtual file system (no actual file writes)
- Profile management
- LOOT integration (auto-sort plugins)
- Integrated FOMOD installer
- BSA/BA2 extraction
- Savegame management
- Executable management

**Why MO2 > Vortex**:
- More control
- Easier conflict resolution
- Profile system more robust
- Faster for power users

**Workflow**:
1. Install MO2
2. Configure for your game
3. Download mods
4. Install via MO2
5. Resolve conflicts
6. Arrange load order
7. Launch game through MO2

---

## Minecraft Modding

### 11. **Fabric**
**Repository**: https://github.com/FabricMC/fabric
**Stars**: ~1,900+ (across repositories)
**Language**: Java
**License**: Apache-2.0

**Description**:
Fabric is a lightweight, experimental modding toolchain for Minecraft.

**Why Essential**:
- Faster updates than Forge
- Modern API design
- Lightweight and modular
- Performance focused
- Growing ecosystem

**What You'll Learn**:
- Minecraft internals
- Java modding
- Mixins (runtime patching)
- Gradle build systems

**Key Components**:
- **Fabric Loader**: Mod loader
- **Fabric API**: Essential hooks and APIs
- **Fabric Loom**: Gradle plugin for development

**Advantages Over Forge**:
- Updates faster for new MC versions
- More lightweight
- Better performance
- Cleaner API
- Modern development practices

**Example Mod**:
```java
public class MyMod implements ModInitializer {
    @Override
    public void onInitialize() {
        Registry.register(Registry.ITEM,
            new Identifier("mymod", "custom_item"),
            new Item(new Item.Settings()));
    }
}
```

**Fabric vs Forge**:
| Feature | Fabric | Forge |
|---------|--------|-------|
| Update Speed | Fast | Slower |
| Performance | Better | Good |
| Mod Count | Growing | Largest |
| Learning Curve | Moderate | Steeper |

---

### 12. **MinecraftForge**
**Website**: https://github.com/MinecraftForge/MinecraftForge
**Stars**: ~6,800+
**Language**: Java
**License**: LGPL-2.1

**Description**:
Minecraft Forge is a free, open-source modding API and mod loader for Minecraft Java Edition.

**Why Essential**:
- Largest mod ecosystem
- Battle-tested stability
- Comprehensive API
- Industry standard since 2012

**What You'll Learn**:
- Complete Minecraft modding
- Event-driven programming
- Registry systems
- Mod distribution

**Key Features**:
- Event bus system
- Registry system
- Configuration API
- Networking
- Capability system

**Major Mods Using Forge**:
- Thermal Expansion
- Applied Energistics 2
- Tinkers' Construct
- Botania
- Mekanism

**Forge Event Example**:
```java
@SubscribeEvent
public void onPlayerTick(TickEvent.PlayerTickEvent event) {
    // Runs every tick for every player
}
```

**Getting Started**:
1. Download Forge MDK
2. Run `gradlew setupDecompWorkspace`
3. Import to IntelliJ/Eclipse
4. Create mod in src/main/java
5. Build with `gradlew build`

---

## Universal Tools

### 13. **dnSpyEx**
**Repository**: https://github.com/dnSpyEx/dnSpy
**Stars**: ~5,500+
**Language**: C#
**License**: GPL-3.0

**Description**:
.NET debugger and assembly editor. Continuation of the original dnSpy project.

**Why Essential**:
- Decompile .NET games to readable C#
- Debug in real-time
- Edit and recompile assemblies
- Essential for reverse engineering

**What You'll Learn**:
- .NET internals
- IL (Intermediate Language)
- Reverse engineering
- Assembly structure

**Key Features**:
- Decompile to C#
- Set breakpoints on decompiled code
- Attach to running process
- Edit methods
- Save modified assemblies
- Plugin support

**Use Cases**:
- Understanding game code
- Finding method signatures for Harmony
- Debugging mod interactions
- Creating patches
- Learning from other games

**Workflow**:
1. Open Assembly-CSharp.dll in dnSpy
2. Decompile to C#
3. Find class/method you want to mod
4. Copy method signature for Harmony patch
5. Optionally: debug with breakpoints

**Tips**:
- Use search (Ctrl+Shift+K) to find methods
- Set breakpoints on decompiled code
- Use "Analyze" to find references
- Export to project for easier browsing

---

### 14. **ILSpy**
**Repository**: https://github.com/icsharpcode/ILSpy
**Stars**: ~21,000+
**Language**: C#
**License**: MIT

**Description**:
.NET assembly browser and decompiler. More focused on decompilation than debugging.

**Why Essential**:
- Lighter than dnSpy
- Better for quick browsing
- Excellent decompilation quality
- Cross-platform

**Advantages Over dnSpy**:
- Faster startup
- Better C# output quality
- Command-line interface
- VS Code extension

**When to Use**:
- Just need to read code (not debug)
- Want lightweight tool
- Need command-line decompilation
- Prefer open-source active project

---

### 15. **Ghidra**
**Repository**: https://github.com/NationalSecurityAgency/ghidra
**Stars**: ~50,000+
**Language**: Java
**License**: Apache-2.0

**Description**:
Software reverse engineering framework developed by NSA, free and open source.

**Why Essential**:
- Reverse engineer native (C/C++) games
- Decompile to pseudo-C
- Advanced analysis
- Free (vs. IDA Pro which costs $$$)

**What You'll Learn**:
- Assembly language
- Reverse engineering
- Binary analysis
- Game engine internals

**Key Features**:
- Disassembler for multiple architectures
- Decompiler to C
- Scripting (Python, Java)
- Collaborative features
- Plugin ecosystem

**Use Cases**:
- Modding C++ games without source
- Finding anti-cheat mechanisms
- Understanding proprietary engines
- Advanced game hacking

**Learning Curve**: Steep (requires understanding of assembly)

**Alternatives**:
- **IDA Pro**: Commercial, better but expensive
- **Binary Ninja**: Commercial, modern UI
- **Radare2**: Open-source, command-line

---

### 16. **Cheat Engine**
**Website**: https://github.com/cheat-engine/cheat-engine
**Stars**: ~3,000+
**Language**: Pascal, C
**License**: Custom (free)

**Description**:
Memory scanner and debugger for finding and modifying game values.

**Why Essential**:
- Find memory addresses
- Understand game state
- Create trainers
- Research for mod development

**What You'll Learn**:
- Memory editing
- Pointer chains
- Assembly injection
- Game state analysis

**Use Cases**:
- Finding hidden values for mods
- Understanding data structures
- Creating cheat tables
- Reverse engineering game state

**Ethical Use**:
- ✅ Singleplayer experimentation
- ✅ Understanding game mechanics for mods
- ❌ Multiplayer cheating

**Features**:
- Memory scanner
- Pointer scanner
- Auto assembler
- Lua scripting
- Trainer maker
- Speedhack

---

### 17. **Vortex**
**Repository**: https://github.com/Nexus-Mods/Vortex
**Stars**: ~1,400+
**Language**: TypeScript
**License**: GPL-3.0

**Description**:
Official mod manager from Nexus Mods, supporting multiple games.

**Why Essential**:
- Official Nexus Mods integration
- One-click mod installation
- Beginner friendly
- Wide game support

**What You'll Learn**:
- Mod management
- Load order
- Conflict resolution
- Plugin architecture

**Supported Games** (100+):
- Skyrim/Fallout series
- The Witcher 3
- Cyberpunk 2077
- Stardew Valley
- Baldur's Gate 3
- Many more

**Key Features**:
- One-click Nexus installation
- Automatic conflict resolution
- Load order sorting (LOOT)
- Profile system
- Plugin management

**Vortex vs Mod Organizer 2**:
| Feature | Vortex | MO2 |
|---------|--------|-----|
| Ease of Use | Easier | Steeper |
| Control | Less | More |
| File System | Hardlinks | Virtual |
| Games | More | Bethesda+ |
| Best For | Beginners | Power Users |

---

## Example Projects & Learning Resources

### 18. **RimWorld Mods (Community)**
**Example**: https://github.com/AndroidQuazar/VanillaExpandedFramework
**Language**: C#, XML
**License**: Varies

**Description**:
RimWorld has one of the most active modding communities with excellent open-source examples.

**Why Study These**:
- Well-documented code
- Harmony patching examples
- XML data-driven design
- Active community

**What You'll Learn**:
- Harmony best practices
- Game balance modding
- Data-driven design
- Mod compatibility

**Notable RimWorld Modding Repos**:
- Vanilla Expanded Framework
- Hospitality
- Dubs Bad Hygiene
- Combat Extended

**RimWorld Modding Resources**:
- Official Wiki: https://rimworldwiki.com/wiki/Modding
- r/RimWorldMods
- RimWorld Discord modding channels

---

### 19. **BepInEx Plugin Template**
**Repository**: https://github.com/BepInEx/BepInEx.Templates
**Stars**: ~100+
**Language**: C#
**License**: LGPL-2.1

**Description**:
Official templates for creating BepInEx plugins quickly.

**Why Essential**:
- Fast project setup
- Best practices baked in
- Multiple templates
- dotnet integration

**What You'll Learn**:
- Project structure
- Dependency management
- Build configuration
- Distribution setup

**Templates Included**:
- BepInEx 5 Plugin
- BepInEx 6 Plugin
- Patcher Plugin

**Usage**:
```bash
dotnet new -i BepInEx.Templates
dotnet new bepinex5plugin -n MyPlugin
```

---

### 20. **Thunderstore (Mod Repository Platform)**
**Repository**: https://github.com/thunderstore-io
**Language**: Python, TypeScript
**License**: MIT

**Description**:
Open-source mod repository platform used by many games (Valheim, Lethal Company, etc.).

**Why Essential**:
- Modern mod distribution
- API for mod managers
- Package management
- Community building

**What You'll Learn**:
- Mod distribution
- Package management
- Web APIs
- Community platforms

**Features**:
- Package manager (like npm for mods)
- Dependency resolution
- Versioning
- Mod manager integration
- Community features

**Games Using Thunderstore**:
- Risk of Rain 2
- Valheim
- Lethal Company
- Content Warning
- GTFO

**Publishing to Thunderstore**:
1. Create manifest.json
2. Package mod as .zip
3. Upload via web interface
4. Users install via mod manager

**manifest.json Example**:
```json
{
  "name": "MyMod",
  "version_number": "1.0.0",
  "website_url": "https://github.com/...",
  "description": "My awesome mod",
  "dependencies": [
    "BepInEx-BepInExPack-5.4.2100"
  ]
}
```

---

## Quick Reference Matrix

### By Game Engine

| Engine | Framework | Tools | Example Games |
|--------|-----------|-------|---------------|
| **Unity** | BepInEx, MelonLoader | AssetStudio, dnSpy, UnityExplorer | Valheim, Cities: Skylines, Subnautica |
| **Unreal** | UE4SS | FModel, UE4SS, Ghidra | Palworld, Satisfactory, Deep Rock Galactic |
| **Creation** | SKSE/F4SE | xEdit, Creation Kit, MO2 | Skyrim, Fallout 4, Starfield |
| **Java (MC)** | Fabric, Forge | IntelliJ, MCreator | Minecraft |
| **Native** | Custom | Ghidra, Cheat Engine, IDA | Varies |

---

### By Skill Level

**Beginner (Start Here)**:
1. AssetStudio (asset extraction)
2. Vortex (mod management)
3. MCreator (Minecraft, no-code)
4. BepInEx (with tutorials)
5. Fabric (Minecraft, simpler than Forge)

**Intermediate**:
1. BepInEx + Harmony
2. dnSpy (decompilation)
3. xEdit (Bethesda modding)
4. Minecraft Forge
5. UnityExplorer

**Advanced**:
1. HarmonyX + IL manipulation
2. UE4SS
3. Ghidra
4. Custom mod loaders
5. Engine-specific deep modding

---

### By Use Case

**I want to...**

**Replace textures/models**:
→ AssetStudio, FModel, Vortex

**Modify gameplay code**:
→ dnSpy, Harmony, BepInEx

**Create Minecraft mods**:
→ Fabric or Forge

**Mod Skyrim/Fallout**:
→ Creation Kit, xEdit, SKSE, MO2

**Mod Unity games**:
→ BepInEx, dnSpy, Harmony, AssetStudio

**Mod Unreal games**:
→ UE4SS, FModel

**Understand game internals**:
→ dnSpy, Ghidra, Cheat Engine

**Manage mods**:
→ Mod Organizer 2, Vortex

---

## Learning Path

### Month 1: Foundations
- ✅ Install and use mods (Vortex/MO2)
- ✅ Extract assets (AssetStudio)
- ✅ Browse game code (dnSpy/ILSpy)
- ✅ Study modding documentation

### Month 2: First Mods
- ✅ Create texture replacement mod
- ✅ Install BepInEx
- ✅ Create simple config-based mod
- ✅ Join modding community

### Month 3: Code Modding
- ✅ Learn Harmony basics
- ✅ Create Prefix/Postfix patches
- ✅ Publish first code mod
- ✅ Study open-source mods

### Month 4-6: Advanced
- ✅ Learn Transpilers (IL editing)
- ✅ Create complex mod
- ✅ Contribute to open-source mods
- ✅ Build modding tools

---

## Contribution Guidelines

### How to Contribute to These Projects

**Most projects welcome:**
- Bug reports
- Documentation improvements
- Code contributions
- Translations
- Example mods

**General Contribution Steps:**
1. Fork repository
2. Create feature branch
3. Make changes
4. Write tests (if applicable)
5. Submit pull request
6. Respond to feedback

**Where to Start:**
- Look for "good first issue" labels
- Fix documentation errors
- Add examples
- Improve error messages

---

## Additional Resources

### Communities
- **r/modding** - General modding
- **BepInEx Discord** - Unity modding
- **Nexus Mods Forums** - Game-specific
- **RimWorld Discord** - Great modding community
- **Minecraft Forge Forums**

### Documentation
- **Harmony Docs**: https://harmony.pardeike.net/
- **BepInEx Docs**: https://docs.bepinex.dev/
- **Fabric Wiki**: https://fabricmc.net/wiki/
- **Creation Kit Wiki**: https://www.creationkit.com/

### YouTube Channels
- **Sinai Dev** - Unity modding (UnityExplorer creator)
- **Darkfox127** - Skyrim modding
- **TurtyWurty** - Minecraft Forge modding
- **GDC** - Game development insights

---

## Conclusion

These 20 repositories represent the essential tools and frameworks for modern game modding. Whether you're modding Unity games, Unreal Engine titles, Bethesda RPGs, or Minecraft, these tools provide the foundation for creating amazing mods.

**Key Takeaways**:

1. **Start with the right tools**: Match the framework to your game's engine
2. **Learn from examples**: Study open-source mods
3. **Join communities**: Active communities accelerate learning
4. **Contribute back**: Improve the tools you use
5. **Build portfolio**: Mods are excellent portfolio pieces

**Next Steps**:
1. Choose a game you love
2. Pick the appropriate framework from this list
3. Clone an example mod
4. Modify it to learn
5. Create your own mod
6. Share with the community

Happy modding! 🎮

---

**Maintained By**: Community Contributors
**Last Updated**: 2025-11-17
**Version**: 1.0

**Found a great modding repository that should be included? Open an issue or submit a pull request!**

---

## License & Legal

**Important**: Always respect:
- Game's EULA and Terms of Service
- Copyright and intellectual property
- Open-source licenses
- Community guidelines

**This document is for educational purposes. Mod responsibly and ethically.**
