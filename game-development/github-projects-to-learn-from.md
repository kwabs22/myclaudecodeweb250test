# GitHub Projects to Deconstruct and Learn From

A curated list of 10 Unreal Engine and 10 PlayCanvas open-source projects perfect for learning game development through code analysis and deconstruction.

---

## Unreal Engine Projects

### 1. **Lyra Starter Game**
**Repository**: Available through Epic Games Launcher / GitHub (Epic Account Required)
**Engine Version**: Unreal Engine 5.0+
**Language**: C++ & Blueprints

**What You'll Learn**:
- Modern UE5 best practices and project structure
- Enhanced Input System implementation
- Modular gameplay features architecture
- Gameplay Ability System (GAS) advanced usage
- Experience definition system for game modes
- Network replication patterns
- Production-quality code organization

**Key Features**:
- Complete sample shooter game
- Modular gameplay framework
- UI framework with CommonUI
- Inventory and equipment systems
- Team-based gameplay mechanics

**Why Deconstruct This**:
Epic's official learning project showcasing their recommended approach to building games in UE5. Essential for understanding modern UE5 architecture.

---

### 2. **Action Roguelike (Tom Looman)**
**Repository**: https://github.com/tomlooman/ActionRoguelike
**Engine Version**: Unreal Engine 5.3+
**Language**: C++

**What You'll Learn**:
- Complete game loop implementation
- AI behavior with Behavior Trees
- Multiplayer networking fundamentals
- Projectile systems
- Character abilities and power-ups
- Save/load system implementation
- Action game combat mechanics

**Key Features**:
- Third-person action gameplay
- Magic projectiles and abilities
- AI enemies with patrol and attack behaviors
- Multiplayer support
- Persistence system

**Why Deconstruct This**:
Part of Tom Looman's excellent C++ course. Clean, well-documented code perfect for learning networking and gameplay systems from scratch.

---

### 3. **Epic Survival Game (Tom Looman)**
**Repository**: https://github.com/tomlooman/EpicSurvivalGame
**Engine Version**: Unreal Engine 5.2
**Language**: C++

**What You'll Learn**:
- Survival game mechanics (hunger, health, stamina)
- Inventory and item systems
- Crafting system implementation
- Day/night cycle
- AI zombie enemies
- Weapon systems (melee and ranged)
- Third-person character controller
- Multiplayer cooperative gameplay

**Key Features**:
- Complete survival game template
- Resource gathering
- Base building mechanics
- Weapon crafting
- Co-op multiplayer

**Why Deconstruct This**:
Originally created as Epic Games tutorial series. Demonstrates how to build complex interconnected systems (inventory, crafting, survival stats) in C++.

---

### 4. **GASDocumentation Sample Project**
**Repository**: https://github.com/tranek/GASDocumentation
**Engine Version**: Unreal Engine 4.26+ / UE5
**Language**: C++

**What You'll Learn**:
- Gameplay Ability System (GAS) fundamentals
- Gameplay Attributes and Attribute Sets
- Gameplay Effects (buffs, debuffs, damage)
- Gameplay Cues (visual/audio feedback)
- Ability activation and targeting
- Multiplayer ability replication
- GAS integration with UI

**Key Features**:
- Simple multiplayer shooter sample
- Hero classes with different abilities
- Complete GAS implementation examples
- Extensive documentation in README

**Why Deconstruct This**:
The definitive community resource for learning GAS. Fills gaps in official documentation with practical examples and clear explanations.

---

### 5. **GASShooter**
**Repository**: https://github.com/tranek/GASShooter
**Engine Version**: Unreal Engine 4.26+
**Language**: C++

**What You'll Learn**:
- Advanced GAS patterns for shooters
- FPS and TPS character controllers with GAS
- Weapon system with GAS abilities
- Ammo system using attributes
- Headshot detection and damage calculations
- Sprint, aim down sights using abilities
- Advanced multiplayer replication

**Key Features**:
- Fully functional multiplayer shooter
- Multiple weapons with different mechanics
- Character classes
- Respawn system
- Advanced ability combos

**Why Deconstruct This**:
Takes GAS to the next level with production-ready shooter mechanics. Shows how to build complex weapon systems using the ability framework.

---

### 6. **Advanced Locomotion System (ALS) Refactored**
**Repository**: https://github.com/Sixze/ALS-Refactored
**Engine Version**: Unreal Engine 5.3+
**Language**: C++

**What You'll Learn**:
- Advanced character movement states
- Animation blending and layering
- Procedural animation (foot IK, aim offsets)
- Camera systems (1st person, 3rd person, shoulder swap)
- Mantling and vaulting mechanics
- Rolling and ragdoll systems
- State machine architecture
- Performance optimization techniques

**Key Features**:
- AAA-quality character movement
- Multiple locomotion modes (walking, running, crouching, sprinting)
- Smooth transitions between all states
- Highly responsive controls

**Why Deconstruct This**:
Industry-standard character controller used in many commercial games. Perfect for learning professional-grade animation programming.

---

### 7. **Bomber (Multiplayer Bomberman)**
**Repository**: https://github.com/marcinbiegun/Bomber
**Engine Version**: Unreal Engine 5
**Language**: C++

**What You'll Learn**:
- Grid-based game logic
- Multiplayer synchronization
- Destructible environment systems
- Power-up implementation
- Game state management
- Clean C++ architecture patterns
- UE5 best practices from Lyra

**Key Features**:
- Classic Bomberman gameplay
- Online multiplayer
- Procedural level generation
- Multiple power-up types
- Clean, modern codebase

**Why Deconstruct This**:
Excellent example of clean code practices and how to implement classic game mechanics in UE5. Small enough to understand fully.

---

### 8. **Aura (GAS RPG)**
**Repository**: https://github.com/DruidMech/GameplayAbilitySystem_Aura
**Engine Version**: Unreal Engine 5.1+
**Language**: C++

**What You'll Learn**:
- RPG systems built with GAS
- Character stats and leveling
- Spell casting system
- Enemy AI with abilities
- Damage calculation formulas
- Experience and progression systems
- UI integration with GAS
- Target selection mechanics

**Key Features**:
- Top-down RPG gameplay
- Magic spell system
- Character progression
- Enemy encounters
- Attribute-based combat

**Why Deconstruct This**:
Shows how to build RPG-specific systems using GAS. Great for understanding how to adapt GAS beyond shooters to other genres.

---

### 9. **Eternal Crusade: Resurrection**
**Repository**: https://github.com/Soverance/EternalCrusadeResurrection
**Engine Version**: Unreal Engine 5
**Language**: C++

**What You'll Learn**:
- Large-scale multiplayer shooter architecture
- Team-based gameplay systems
- Spawn system implementation
- Class-based character system
- Objective-based game modes
- Warhammer 40K aesthetics and mechanics
- Complex weapon systems

**Key Features**:
- Multiplayer third-person shooter
- Multiple character classes
- Team combat
- Inspired by Warhammer 40K

**Why Deconstruct This**:
Community resurrection of a commercial game. Shows how to structure large multiplayer projects with multiple systems.

---

### 10. **SUQS (Steve's Unreal Quest System)**
**Repository**: https://github.com/sinbad/SUQS
**Engine Version**: Unreal Engine 4.27+ / UE5
**Language**: C++

**What You'll Learn**:
- Data-driven quest system design
- Quest objectives and tracking
- Branching quest narratives
- Task completion detection
- Quest UI integration
- Save/load for quest states
- Event-driven architecture

**Key Features**:
- Flexible quest definition system
- Nested objectives
- Quest prerequisites and chains
- Journal/log system
- Blueprint and C++ friendly API

**Why Deconstruct This**:
Production-ready plugin showing how to build data-driven narrative systems. Essential for any game needing quests or objectives.

---

## PlayCanvas Projects

### 1. **PlayCanvas Engine**
**Repository**: https://github.com/playcanvas/engine
**Language**: JavaScript/TypeScript
**Stars**: 9,000+

**What You'll Learn**:
- Game engine architecture
- WebGL rendering pipeline
- Entity-Component-System (ECS) design
- WebGPU implementation
- Graphics optimization for web
- Physics integration
- Asset loading and management
- Audio system design

**Key Features**:
- Full 3D game engine
- WebGL/WebGPU renderer
- glTF support
- XR (VR/AR) capabilities
- Physics engine integration
- Spatial audio

**Why Deconstruct This**:
The core engine itself. Perfect for understanding how modern web game engines work under the hood. Extremely well-architected codebase.

---

### 2. **PlayCanvas Examples Repository**
**Repository**: https://github.com/playcanvas/playcanvas.github.io
**Language**: JavaScript
**Live Demo**: https://playcanvas.github.io/

**What You'll Learn**:
- 200+ working examples of engine features
- Graphics techniques (PBR, shadows, post-effects)
- Animation systems
- Physics simulations
- Input handling
- Camera controls
- Procedural generation
- Shader programming

**Key Features**:
- Comprehensive example collection
- Live interactive demos
- Source code for every example
- Covers all major engine features

**Why Deconstruct This**:
The official examples repository. Each example is small, focused, and demonstrates one specific feature. Perfect for learning by doing.

---

### 3. **PCUI (PlayCanvas UI Framework)**
**Repository**: https://github.com/playcanvas/pcui
**Language**: JavaScript/TypeScript
**Live Demo**: https://playcanvas.github.io/pcui/

**What You'll Learn**:
- Modern UI framework architecture
- Component-based UI design
- Binding system implementation
- Observer pattern for data reactivity
- Accessible UI components
- Theming system
- Form validation
- Tree views and complex widgets

**Key Features**:
- Production UI framework (used in PlayCanvas Editor)
- 40+ UI components
- Data binding
- Keyboard navigation
- Touch support
- CSS theming

**Why Deconstruct This**:
Powers the PlayCanvas Editor UI. Shows how to build professional-grade UI frameworks. Great for understanding reactive patterns.

---

### 4. **SuperSplat**
**Repository**: https://github.com/playcanvas/super-splat
**Language**: JavaScript/TypeScript
**Live Demo**: https://playcanvas.com/supersplat

**What You'll Learn**:
- 3D Gaussian Splatting implementation
- Advanced WebGL techniques
- Large dataset handling in browser
- Camera controls for 3D editors
- File import/export systems
- Undo/redo implementation
- Performance optimization for millions of points

**Key Features**:
- 3D Gaussian Splat editor
- Real-time rendering
- Point cloud manipulation
- Export to various formats
- Professional editor interface

**Why Deconstruct This**:
Cutting-edge 3D technology (Gaussian Splatting) implemented for the web. Shows how to build performant 3D tools in the browser.

---

### 5. **Kinematic Character Controller**
**Repository**: https://github.com/tatelax/playcanvas-kinematic-character-controller
**Language**: JavaScript

**What You'll Learn**:
- Kinematic character movement
- Collision detection and response
- Ground detection
- Slope handling
- Step climbing
- Jump mechanics
- Camera following
- Input buffering

**Key Features**:
- Third-person character controller
- Physics-based movement
- Smooth camera follow
- Configurable parameters

**Why Deconstruct This**:
Essential system for any 3D game. Clean implementation of character movement fundamentals without over-complication.

---

### 6. **PlayCanvas AR (ARToolkit Integration)**
**Repository**: https://github.com/playcanvas/playcanvas-ar
**Language**: JavaScript
**Live Demo**: https://playcanvas.com/ar

**What You'll Learn**:
- Augmented Reality implementation for web
- Marker tracking
- Camera feed integration
- 3D overlay rendering
- Mobile AR optimizations
- External library integration

**Key Features**:
- Marker-based AR
- Real-time tracking
- 3D object placement
- Mobile browser support

**Why Deconstruct This**:
WebAR implementation showing how to integrate computer vision libraries with game engines. Great for understanding AR concepts.

---

### 7. **PlayCanvas Spine Plugin**
**Repository**: https://github.com/playcanvas/playcanvas-spine
**Language**: JavaScript

**What You'll Learn**:
- 2D skeletal animation integration
- Spine runtime implementation
- Texture atlas handling
- Animation blending in 2D
- Mix 2D and 3D rendering
- Custom shader for 2D sprites
- Plugin architecture patterns

**Key Features**:
- Full Spine animation support
- IK and mesh deformation
- Animation mixing
- Attachment swapping

**Why Deconstruct This**:
Shows how to integrate external animation systems. Useful for understanding 2D animation in 3D engines and plugin architecture.

---

### 8. **PlayCanvas Tween Library**
**Repository**: https://github.com/playcanvas/playcanvas-tween
**Language**: JavaScript

**What You'll Learn**:
- Easing functions implementation
- Animation interpolation
- Tween system architecture
- Chain and sequence animations
- Callback systems
- Time-based updates
- Minimal library design

**Key Features**:
- Comprehensive easing functions
- Chaining support
- Repeating/yoyo animations
- Pause/resume functionality
- Lightweight implementation

**Why Deconstruct This**:
Simple but essential animation system. Perfect for learning how interpolation and easing work. Small codebase, easy to fully understand.

---

### 9. **PlayCanvas P2.js Physics Integration**
**Repository**: https://github.com/playcanvas/playcanvas-p2.js
**Language**: JavaScript

**What You'll Learn**:
- 2D physics engine integration
- Rigid body dynamics
- Collision detection (2D)
- Constraint systems
- Physics material properties
- Integration loop timing
- Bridging physics and graphics

**Key Features**:
- Full p2.js physics integration
- 2D rigid bodies
- Multiple collision shapes
- Joints and constraints

**Why Deconstruct This**:
Shows how to integrate third-party physics engines. Great for 2D games or UI physics. Demonstrates the separation between simulation and rendering.

---

### 10. **Recast Navigation for PlayCanvas**
**Repository**: https://github.com/kpalexander/playcanvas-recast-navigation
**Language**: JavaScript/TypeScript
**NPM**: @recast-navigation/playcanvas

**What You'll Learn**:
- NavMesh generation
- Pathfinding algorithms (A*)
- AI navigation systems
- Crowd simulation
- Dynamic obstacle avoidance
- Query systems for navigation
- WebAssembly integration

**Key Features**:
- Automatic NavMesh generation
- Path finding
- Crowd management
- Off-mesh connections
- Debug visualization

**Why Deconstruct This**:
Essential for any game with AI navigation. Shows how to use Recast/Detour (industry-standard navigation) in web games via WebAssembly.

---

## How to Deconstruct These Projects

### Step 1: Clone and Run
```bash
# For Unreal Engine projects
git clone [repository-url]
# Open .uproject file in Unreal Engine

# For PlayCanvas projects
git clone [repository-url]
cd [project-directory]
npm install
npm run start
```

### Step 2: Study the Architecture
- **Unreal Engine**: Start with the game mode, then player controller, then character
- **PlayCanvas**: Start with the main application script, then entity hierarchy

### Step 3: Identify Key Systems
- Map out dependencies between classes/modules
- Understand data flow
- Note design patterns used

### Step 4: Modify and Experiment
- Change parameters and observe results
- Add debug logging
- Implement small features
- Break things intentionally to understand dependencies

### Step 5: Extract and Apply
- Isolate systems you want to learn
- Recreate them in your own project
- Adapt patterns to your needs

---

## Learning Paths

### For Complete Beginners

**Unreal Engine**:
1. Start with **Action Roguelike** (clear structure, well-commented)
2. Move to **Epic Survival Game** (more complex systems)
3. Study **Lyra** (industry best practices)

**PlayCanvas**:
1. Start with **PlayCanvas Examples** (bite-sized demos)
2. Move to **Tween Library** (simple, complete system)
3. Study **Kinematic Character Controller** (essential gameplay)

### For Intermediate Developers

**Unreal Engine**:
1. Study **GASDocumentation** (critical multiplayer system)
2. Deconstruct **ALS-Refactored** (advanced animation)
3. Build with **SUQS** (data-driven design)

**PlayCanvas**:
1. Study **PCUI** (modern UI patterns)
2. Deconstruct **Spine Plugin** (integration techniques)
3. Implement **Recast Navigation** (AI fundamentals)

### For Advanced Developers

**Unreal Engine**:
1. Contribute to **GASShooter** (complex multiplayer)
2. Optimize **Eternal Crusade** (large-scale architecture)
3. Extend **Bomber** (clean code practices)

**PlayCanvas**:
1. Study **Engine Source** (architecture deep-dive)
2. Contribute to **SuperSplat** (cutting-edge graphics)
3. Build with **P2.js Integration** (physics systems)

---

## Additional Resources

### Unreal Engine
- **Unreal Engine Documentation**: https://docs.unrealengine.com/
- **Tom Looman's Courses**: https://courses.tomlooman.com/
- **Awesome Unreal**: https://github.com/insthync/awesome-unreal

### PlayCanvas
- **PlayCanvas Developer Site**: https://developer.playcanvas.com/
- **PlayCanvas API Reference**: https://api.playcanvas.com/
- **Awesome PlayCanvas**: https://github.com/playcanvas/awesome-playcanvas

---

## Contributing to These Projects

Many of these projects welcome contributions:

1. **Fix bugs** - Start with "good first issue" labels
2. **Improve documentation** - Add comments, update READMEs
3. **Add examples** - Demonstrate new use cases
4. **Optimize** - Profile and improve performance
5. **Extend features** - Add new capabilities

Contributing is one of the best ways to deeply learn a codebase.

---

## Tips for Maximum Learning

### 1. Read the Code Daily
Spend 30 minutes every day reading code, even without a specific goal. Pattern recognition develops over time.

### 2. Recreate Small Features
Don't just read - rebuild key features from scratch to internalize the patterns.

### 3. Compare Approaches
Look at how different projects solve similar problems (e.g., character movement in Action Roguelike vs. ALS).

### 4. Debug Everything
Use debuggers and logging extensively. Understanding runtime behavior is crucial.

### 5. Document Your Learning
Write notes, create diagrams, explain to others. Teaching solidifies understanding.

### 6. Join Communities
- Unreal Slackers Discord
- PlayCanvas Forums
- GitHub Discussions on these repos

### 7. Build Your Own
The ultimate test: can you build your own game using these patterns?

---

## Project Comparison Matrix

| Feature | Unreal Engine Projects | PlayCanvas Projects |
|---------|----------------------|-------------------|
| **Language** | Primarily C++ | JavaScript/TypeScript |
| **Learning Curve** | Steep | Moderate |
| **Code Complexity** | High (AAA-scale) | Moderate (web-scale) |
| **Documentation** | Variable | Generally good |
| **Active Maintenance** | Varies widely | Often well-maintained |
| **Community Size** | Large | Growing |
| **Production Ready** | Many are | Most are |
| **Best For** | Desktop/console games | Web/mobile games |

---

## Conclusion

These 20 projects represent hundreds of thousands of hours of development work, freely available for learning. Each project teaches different aspects of game development:

**Unreal Engine projects** teach:
- AAA-quality systems and architecture
- Advanced C++ game programming
- Multiplayer networking at scale
- Complex gameplay systems (GAS, quests, AI)

**PlayCanvas projects** teach:
- Web-first game development
- JavaScript/TypeScript best practices
- Lightweight, performant code
- Modern web APIs integration

The best approach is to:
1. Pick projects matching your skill level
2. Start small - understand one system fully before moving on
3. Code along - don't just read, implement
4. Contribute back - improve these projects for others

Happy learning!

---

**Document Version**: 1.0
**Last Updated**: 2025-11-16
**Total Projects**: 20 (10 Unreal Engine + 10 PlayCanvas)
