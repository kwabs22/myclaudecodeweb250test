# Game Engine Support for 50 Game Verbs

Analysis of how PlayCanvas and Unreal Engine provide built-in solutions for common game mechanics, and how their modular systems combine to handle complex verbs.

---

## Engine Architecture Overview

### Unreal Engine 5 Core Systems
- **Character Movement Component**: Handles walking, jumping, swimming, flying, crouching
- **Physics System (Chaos)**: Rigidbodies, constraints, forces, collision
- **Animation Blueprint**: State machines, blend spaces, IK, montages
- **Blueprint Visual Scripting**: Node-based logic for gameplay
- **Enhanced Input System**: Action mappings, contextual input
- **Gameplay Ability System (GAS)**: Cooldowns, costs, effects, ability execution
- **AI Navigation**: Pathfinding, NavMesh, perception
- **Niagara Particles**: Advanced VFX system
- **Material System**: Shaders, dynamic parameters
- **Sequencer**: Cinematic animations, timeline control

### PlayCanvas Core Systems
- **Entity-Component System**: Modular architecture
- **Rigidbody Component**: Physics simulation
- **Script Component**: JavaScript-based behavior
- **Animation Component**: State graph, blending
- **Collision Component**: Trigger and rigid collision
- **Camera Component**: Viewpoint control
- **Sound Component**: 3D spatial audio
- **Particle System**: VFX
- **Asset Pipeline**: Model, texture, sound management
- **Ammo.js Physics**: Bullet physics port to JavaScript

---

## Coverage Matrix

### ✅ Directly Supported (Built-in Components)
### 🔧 Partial Support (Requires Configuration)
### 🛠️ Custom Implementation (Combine Multiple Systems)

---

## 1-10: Core Movement Verbs

### 1. JUMP ✅
**Unreal Engine:**
- **Character Movement Component** includes `JumpZVelocity`, `AirControl`, `JumpMaxCount` (double jump)
- Built-in `Jump()` and `StopJumping()` functions
- `bCanJump` flag with ground detection
- Animation Blueprints for jump states

**PlayCanvas:**
- 🔧 Rigidbody + Script Component
- Apply upward impulse: `entity.rigidbody.applyImpulse(0, jumpForce, 0)`
- Ground detection via raycasting or collision callbacks
- Requires custom scripting for coyote time, double jump

**Combination Recipe:** Physics impulse + ground detection + animation state machine + input handling

---

### 2. RUN ✅
**Unreal Engine:**
- Character Movement Component: `MaxWalkSpeed`, `MaxAcceleration`
- Blend spaces automatically match animation to velocity
- Footstep notify events in animation sequences
- Surface-specific friction via Physical Materials

**PlayCanvas:**
- ✅ Script Component for velocity control
- Animation blending based on speed parameter
- Custom footstep system via animation events

**Combination Recipe:** Movement input → velocity calculation → animation blending → footstep audio triggers

---

### 3. CLIMB 🛠️
**Unreal Engine:**
- 🔧 Character Movement Component has `MovementMode` enum (can add custom `MOVE_Climbing`)
- IK system via Animation Blueprints (Two-Bone IK, Full Body IK)
- Surface detection via line traces
- Community plugins available (e.g., ALS - Advanced Locomotion System)

**PlayCanvas:**
- 🛠️ Custom implementation
- Combine: raycast surface detection + manual position adjustment + IK via bone manipulation
- Script Component for climb state logic

**Combination Recipe:** Surface detection (raycast) + custom movement mode + IK solver + animation state machine + camera adjustment

---

### 4. SWIM ✅
**Unreal Engine:**
- ✅ Character Movement Component: `MovementMode::MOVE_Swimming`
- Built-in buoyancy, water volume detection
- `PhysicsVolume` class for water with customizable properties
- Automatic transition between swimming/walking modes

**PlayCanvas:**
- 🔧 Trigger volume detection + custom physics
- Reduce gravity in water volume
- Custom swimming animation state

**Combination Recipe:** Water volume (trigger) + gravity override + drag forces + animation state + oxygen timer (custom script)

---

### 5. DODGE 🔧
**Unreal Engine:**
- 🔧 Animation Montages for dodge animations
- Gameplay Ability System ideal for dodge (cooldown, i-frames built-in)
- `LaunchCharacter()` function for velocity impulse
- Blueprint for invincibility frames

**PlayCanvas:**
- 🛠️ Script Component for dodge logic
- Apply impulse + animation trigger + cooldown timer
- Custom invincibility flag

**Combination Recipe:** Input trigger + animation montage + velocity impulse + invincibility timer + cooldown system

---

### 6. CROUCH ✅
**Unreal Engine:**
- ✅ Character Movement Component: `Crouch()` and `UnCrouch()`
- Automatic capsule resizing (`CrouchedHalfHeight`)
- `bCanCrouch` flag, automatic obstruction checking
- Speed modifiers via `MaxWalkSpeedCrouched`

**PlayCanvas:**
- 🔧 Manual collider scaling + speed modifier
- Script Component for crouch state
- Camera position adjustment

**Combination Recipe:** Collider resize + overhead clearance check + speed modifier + camera lerp + animation state

---

### 7. DASH 🔧
**Unreal Engine:**
- 🔧 Similar to dodge, use Animation Montages
- Gameplay Ability System for charges and cooldowns
- Niagara for trail effects
- `LaunchCharacter()` for burst velocity

**PlayCanvas:**
- 🛠️ Custom Script Component
- Particle system for trails
- Velocity burst with decay curve

**Combination Recipe:** Input → velocity burst → particle trail → cooldown timer → charge counter

---

### 8. GRAB 🔧
**Unreal Engine:**
- 🔧 Physics Handles or Physics Constraints
- `UPhysicsHandleComponent` for picking up objects
- Line trace for object detection
- IK for hand placement
- Weight-based restrictions via physics mass checks

**PlayCanvas:**
- 🛠️ Physics constraints (`pc.Constraint`) or parenting
- Raycast for detection
- Attach object to hand bone

**Combination Recipe:** Raycast (detection) + physics constraint/parenting + IK + weight check + throw force calculation

---

### 9. THROW 🔧
**Unreal Engine:**
- 🔧 `AddImpulse()` on physics objects
- Spline component for trajectory visualization
- Blueprint for charge-up system
- Velocity inheritance from character

**PlayCanvas:**
- 🛠️ `applyImpulse()` on rigidbody
- Line renderer for trajectory arc
- Custom charge system

**Combination Recipe:** Charge timer → trajectory calculation (parabola) → line renderer → release input → apply force + torque

---

### 10. BLOCK 🔧
**Unreal Engine:**
- 🔧 Gameplay Ability System for block state
- Damage reduction via Gameplay Effects
- Directional damage using dot product of attack vector
- Animation montages for block pose
- Stamina drain via attribute system

**PlayCanvas:**
- 🛠️ Custom damage system with block flag
- Animation trigger + stamina management
- Angle calculation for directional blocking

**Combination Recipe:** Input hold → block state flag → damage event intercept → angle check → damage reduction → stamina drain → animation

---

## 11-20: Combat & Interaction Verbs

### 11. PARRY 🛠️
**Unreal Engine:**
- 🛠️ Gameplay Ability System with tight timing window
- Gameplay Tags for parry-able attacks
- Animation notify for parry window
- Blueprint for counter-attack trigger
- Time dilation for "bullet time" effect on success

**PlayCanvas:**
- 🛠️ Custom timer system
- Script Component for parry window detection
- Animation event callbacks

**Combination Recipe:** Input tap → timer (200ms window) → collision detection → success check → time dilation + VFX → counter window

---

### 12. SHOOT ✅
**Unreal Engine:**
- 🔧 Line trace (hitscan) built-in
- Projectile Movement Component for physical projectiles
- Particle systems for muzzle flash, tracers
- Sound cues for gunshots
- Recoil via camera shake and weapon socket offset
- Ammo tracking via variables or GAS attributes

**PlayCanvas:**
- 🔧 Raycast for hitscan
- Rigidbody + Script for projectiles
- Particle system + audio components
- Custom ammo counter

**Combination Recipe:** Input → raycast/spawn projectile → hit detection → damage application → recoil (camera shake + weapon offset) → particles + audio

---

### 13. SLIDE 🛠️
**Unreal Engine:**
- 🛠️ Custom movement mode or crouch variant
- Capsule collision swap
- Slope angle detection via hit normal
- Animation montage
- Dust particles from Niagara

**PlayCanvas:**
- 🛠️ Collision component swap
- Slope calculation from raycast
- Custom script for slide physics

**Combination Recipe:** Crouch system + momentum preservation + slope detection + collider swap + overhead check + particle trail

---

### 14. GRAPPLE 🛠️
**Unreal Engine:**
- 🛠️ Cable Component for rope rendering
- Line trace for grapple point detection
- Spring arm physics or custom force application
- Pendulum physics via force calculations
- Reel-in adjusts cable length parameter

**PlayCanvas:**
- 🛠️ Custom rope rendering (line segments)
- Physics forces for swing
- Raycast for anchor point

**Combination Recipe:** Raycast (anchor) → cable/rope rendering → spring physics (pull toward anchor) → reel control → momentum preservation

---

### 15. GLIDE ✅
**Unreal Engine:**
- 🔧 Character Movement Component: `MovementMode::MOVE_Flying`
- Custom gravity scale override
- Air drag via `BrakingDecelerationFlying`
- Physics volumes for updrafts (modify gravity in volume)

**PlayCanvas:**
- 🔧 Gravity override in script
- Apply drag force
- Trigger volumes for updrafts

**Combination Recipe:** Airborne check → gravity reduction → air drag → steering input → updraft volumes (force application) → animation

---

### 16. SPRINT ✅
**Unreal Engine:**
- ✅ Character Movement Component: `MaxWalkSpeed` modifier
- Stamina via GAS attributes or custom variable
- FOV change via Blueprint on camera
- Animation blend space speed parameter

**PlayCanvas:**
- 🔧 Speed multiplier in script
- FOV adjustment on camera component
- Stamina tracking

**Combination Recipe:** Input hold → speed multiplier → FOV lerp → stamina drain → animation speed scaling

---

### 17. AIM ✅
**Unreal Engine:**
- ✅ Spring Arm Component for camera offset
- Blend between camera positions
- Animation layers for aim pose
- Control Rig for procedural aiming
- Curve-based weapon sway
- Aim assist via auto-rotation toward targets

**PlayCanvas:**
- 🔧 Camera position lerping
- Animation blending for aim pose
- Custom sway using math functions

**Combination Recipe:** Input toggle → camera position blend → movement speed reduction → aim pose animation → weapon sway → reticle update

---

### 18. RELOAD 🔧
**Unreal Engine:**
- 🔧 Animation Montages with notify events
- Animation notifies for "magazine out" and "magazine in" timing
- GAS for reload ability with interrupt handling
- Ammo management via attributes or variables

**PlayCanvas:**
- 🛠️ Animation events
- Script Component for ammo management
- Timer for reload duration

**Combination Recipe:** Input → animation montage → animation events (key frames) → ammo transfer → interrupt handling → UI update

---

### 19. HACK 🛠️
**Unreal Engine:**
- 🛠️ UMG (UI) for minigame interface
- Widget Blueprint for puzzle mechanics
- Proximity check via overlap sphere
- Timer for hack duration
- Blueprint for alert system

**PlayCanvas:**
- 🛠️ HTML/CSS UI overlay
- Script Component for minigame logic
- Trigger volume for proximity

**Combination Recipe:** Proximity detection → UI overlay → minigame logic → progress timer → success/failure callback → alert system

---

### 20. STEALTH 🛠️
**Unreal Engine:**
- 🔧 AI Perception System (sight, hearing)
- Light sampling (can query light intensity at location)
- Physical materials for surface noise
- Gameplay Tags for stealth states
- Stimulus system for detection
- Detection meter via custom blueprint

**PlayCanvas:**
- 🛠️ Custom AI detection system
- Light probes or volume checks
- Distance calculations for visibility
- Custom detection meter

**Combination Recipe:** Light sampling + AI line-of-sight (raycast) + noise radius + crouch modifier + detection accumulation + UI indicator

---

## 21-30: Advanced Mechanics

### 21. SCAN 🛠️
**Unreal Engine:**
- 🛠️ Overlap sphere for detection
- Post-process materials for scan effect
- Outline rendering via custom depth stencil
- Niagara for scan pulse
- Widget components for world-space UI tags

**PlayCanvas:**
- 🛠️ Overlap sphere physics query
- Custom shader for pulse effect
- Outline via post-processing or shader
- UI elements for tags

**Combination Recipe:** Input → overlap sphere → object tagging → outline shader → UI markers → pulse VFX → cooldown

---

### 22. HEAL 🔧
**Unreal Engine:**
- 🔧 Gameplay Ability System perfect for this
- Gameplay Effects for heal-over-time
- Animation montages for healing action
- Niagara for healing particles
- Interruption via ability cancellation

**PlayCanvas:**
- 🛠️ Script Component for heal logic
- Timer for channeling
- Particle system for VFX

**Combination Recipe:** Input → ability activation → animation montage → health increase (per tick or instant) → particle VFX → interrupt detection

---

### 23. INTERACT ✅
**Unreal Engine:**
- 🔧 Interface system for interactable objects
- Line trace for detection
- Context-sensitive UI prompts (UMG)
- Hold-to-interact via timer
- Interaction component (custom or plugin)

**PlayCanvas:**
- 🔧 Raycast detection
- Interface pattern for interactables
- UI prompt system

**Combination Recipe:** Raycast → interface check → UI prompt → input detection → progress timer (hold) → trigger event

---

### 24. CRAFT 🛠️
**Unreal Engine:**
- 🛠️ Inventory system (custom or plugin)
- Data Tables for recipes
- UMG for crafting UI
- Timer for craft duration
- Item database via Data Assets

**PlayCanvas:**
- 🛠️ Custom inventory system
- JSON for recipe data
- HTML UI for crafting interface

**Combination Recipe:** UI system + recipe database + inventory query + timer + item creation + resource deduction

---

### 25. DRIVE ✅
**Unreal Engine:**
- ✅ **Chaos Vehicles Plugin** (full vehicle physics)
- Wheel suspension, friction, aerodynamics
- Engine torque curves
- Automatic gear shifting
- Surface-specific friction via Physical Materials
- Vehicle Movement Component

**PlayCanvas:**
- 🔧 Ammo.js vehicle physics (raycast vehicle)
- Custom suspension forces
- Wheel meshes with rotation

**Combination Recipe:** Vehicle physics component + wheel colliders + suspension springs + engine torque + steering input + gear system

---

### 26. FLY ✅
**Unreal Engine:**
- ✅ Character Movement Component: `MovementMode::MOVE_Flying`
- Full 6DOF control
- Custom physics for lift/drag
- G-force effects via post-process
- Flight instruments via UMG

**PlayCanvas:**
- 🔧 Custom flight physics
- Rigidbody with torque for rotation
- Force application for thrust

**Combination Recipe:** Flying movement mode + 6DOF input + lift/drag forces + stall detection + G-force VFX + UI instruments

---

### 27. TRANSFORM 🛠️
**Unreal Engine:**
- 🛠️ Skeletal Mesh swap or morph targets
- Gameplay Ability System for transform ability
- Stat changes via Gameplay Effects
- Animation Blueprint switching
- Niagara for transformation VFX

**PlayCanvas:**
- 🛠️ Model swap
- Script Component for stat changes
- Particle effect

**Combination Recipe:** Input → animation transition → model swap → stat modification → ability set swap → VFX

---

### 28. CHARGE ✅
**Unreal Engine:**
- 🔧 Gameplay Ability System with charge phases
- Timeline for charge buildup
- Niagara with scale parameter for growing effect
- Audio pitch modulation via sound cue
- Input hold detection

**PlayCanvas:**
- 🔧 Script Component with timer
- Particle system scale
- Audio pitch control

**Combination Recipe:** Input hold → timer/curve → particle scaling → audio pitch → overcharge detection → release trigger

---

### 29. TELEPORT 🛠️
**Unreal Engine:**
- 🛠️ `SetActorLocation()` for position change
- Navigation query for valid positions
- Niagara for teleport VFX
- Brief mesh visibility toggle
- Cooldown via GAS or timer

**PlayCanvas:**
- 🛠️ Raycast for destination
- Set entity position
- Particle effects

**Combination Recipe:** Destination raycast → validation check → disappear VFX → position change → appear VFX → cooldown timer

---

### 30. POSSESS 🛠️
**Unreal Engine:**
- 🔧 **Built-in Possess system!** `AController::Possess(APawn*)`
- Controller class automatically handles possession
- Camera transition via blend
- Input remapping via Enhanced Input

**PlayCanvas:**
- 🛠️ Custom controller switching
- Camera blend
- Input handler swap

**Combination Recipe:** Target selection → controller.Possess() → camera blend → input mapping swap → original body disable

---

## 31-40: Creation & Manipulation

### 31. CONSTRUCT ✅
**Unreal Engine:**
- 🔧 Spawn Actor from Class
- Decal projection for placement preview
- Collision queries for validation
- Grid snapping via rounding functions
- Construction timer via Blueprint

**PlayCanvas:**
- 🔧 Entity instantiation
- Raycast for placement
- Collision detection
- Template cloning

**Combination Recipe:** Build mode → raycast (placement) → ghost preview → collision check → grid snap → resource check → spawn actor → construction timer

---

### 32. DESTROY ✅
**Unreal Engine:**
- 🔧 Destructible meshes (Chaos Destruction)
- Fracture system for complex breaking
- `DestroyActor()` for removal
- Niagara debris particles
- Physics impulses on fragments
- Loot spawn via random tables

**PlayCanvas:**
- 🔧 Entity.destroy()
- Particle system for debris
- Physics fragments (custom)

**Combination Recipe:** Damage system → health depletion → destruction VFX → fragment spawning (with physics) → loot table roll → cleanup

---

### 33. COOK 🛠️
**Unreal Engine:**
- 🛠️ Material parameter interpolation for visual change
- Timer for cook duration
- Temperature variable
- Quality thresholds
- Dynamic Material Instances for color transition

**PlayCanvas:**
- 🛠️ Material property animation
- Timer system
- Custom cooking script

**Combination Recipe:** Timer + heat source detection → material lerp (raw→cooked→burnt) → quality calculation → result generation

---

### 34. MINE 🔧
**Unreal Engine:**
- 🔧 Animation Montages with notifies
- Hit detection via sphere trace at swing point
- Resource node with health
- Durability tracking on tool
- Niagara for hit sparks
- Random loot generation

**PlayCanvas:**
- 🛠️ Animation events
- Collision detection at tool
- Resource node script

**Combination Recipe:** Animation montage → notify event (hit frame) → trace/collision → node damage → durability reduction → particle VFX → loot spawn

---

### 35. FISH 🛠️
**Unreal Engine:**
- 🛠️ Trajectory arc for casting (spline)
- Bobber actor with floating physics
- Random timer for bite
- UMG minigame for reeling
- Tension calculation
- Random fish from data table

**PlayCanvas:**
- 🛠️ Custom trajectory system
- Bobber entity with physics
- Minigame UI

**Combination Recipe:** Charge cast → trajectory calculation → bobber spawn → RNG timer → minigame UI → tension tracking → catch/fail

---

### 36. PULL 🔧
**Unreal Engine:**
- 🔧 Physics Constraint Component (rope/spring)
- Cable Component for rope visual
- Apply force to rigidbody
- Surface friction via Physical Materials
- Character force feedback (slowed movement)

**PlayCanvas:**
- 🔧 Physics constraint
- Line renderer for rope
- Force application

**Combination Recipe:** Attachment (constraint) → rope rendering → force application → friction calculation → player movement penalty

---

### 37. PUSH 🔧
**Unreal Engine:**
- 🔧 `AddForce()` on physics component
- Edge detection via line trace
- Weight comparison against strength stat
- Animation montages for pushing
- Stamina drain

**PlayCanvas:**
- 🔧 Apply force to rigidbody
- Raycast for edge detection

**Combination Recipe:** Contact detection → force application → weight check → edge raycast → animation → stamina drain

---

### 38. LEVITATE 🛠️
**Unreal Engine:**
- 🛠️ Overlap sphere for object detection
- Set gravity enable/disable on components
- Apply upward force
- Outline material via custom depth
- Height control via additional force

**PlayCanvas:**
- 🛠️ Overlap sphere query
- Gravity override on rigidbodies
- Force application

**Combination Recipe:** Overlap detection → gravity disable → upward force → vertical input (height adjust) → outline shader → mana drain

---

### 39. FREEZE 🛠️
**Unreal Engine:**
- 🛠️ Rigidbody velocity store and zero
- Set `SimulatePhysics = false` temporarily
- Material swap to ice material
- Timer for duration
- Damage multiplier via Gameplay Tags

**PlayCanvas:**
- 🛠️ Store velocity, set to zero
- Rigidbody enable/disable
- Material swap

**Combination Recipe:** Target selection → velocity storage → physics disable → material swap → particle VFX → timer → shatter check

---

### 40. BURN 🛠️
**Unreal Engine:**
- 🛠️ Gameplay Effect for DOT (damage over time)
- Niagara fire particle attached to actor
- Point light component
- Spread via overlap sphere + timer
- Extinguish conditions check

**PlayCanvas:**
- 🛠️ Custom DOT system
- Particle system attachment
- Light component

**Combination Recipe:** Status effect (burning) → tick damage → particle attachment → light component → spread detection (overlap) → extinguish check

---

## 41-50: Special Abilities

### 41. SHRINK 🛠️
**Unreal Engine:**
- 🛠️ `SetActorScale3D()` with interpolation
- Capsule component scale
- Camera distance adjustment (spring arm length)
- FOV change for perspective
- Movement speed modifier

**PlayCanvas:**
- 🛠️ Entity scale lerp
- Collider scaling
- Camera distance

**Combination Recipe:** Scale lerp → collider scale → camera adjustment → FOV change → speed modifier

---

### 42. GROW 🛠️
**Unreal Engine:**
- 🛠️ Same as shrink but inverse
- Overlap check before growing (ensure space)
- Scale interpolation
- Strength stat modifier

**PlayCanvas:**
- 🛠️ Scale lerp with clearance check

**Combination Recipe:** Clearance check (overlap) → scale lerp → collider scale → camera pullback → stat modifiers → energy drain

---

### 43. REFLECT 🛠️
**Unreal Engine:**
- 🛠️ Collision detection with projectiles
- Reflect vector calculation (`FVector::MirrorByVector()`)
- Animation montage for reflect pose
- Gameplay Tags for reflect state
- Projectile owner swap

**PlayCanvas:**
- 🛠️ Collision callback
- Vector reflection math
- Animation trigger

**Combination Recipe:** Reflect state → collision detection → reflection vector calc → velocity reverse → owner swap → VFX → stamina cost

---

### 44. ABSORB 🛠️
**Unreal Engine:**
- 🛠️ Gameplay Ability System with damage absorption
- Gameplay Effect for damage negation
- Shield value pool
- Damage event intercept
- Conversion to health via Gameplay Effect

**PlayCanvas:**
- 🛠️ Custom damage interception
- Absorption pool variable
- Health conversion

**Combination Recipe:** Absorb state → damage event intercept → pool check → damage negation/conversion → shield visual update → cooldown

---

### 45. PHASE 🛠️
**Unreal Engine:**
- 🛠️ Collision channel ignore (set collision response)
- Translucent material swap
- Overlap check before exiting phase
- `FindNearestClearSpace()` if stuck
- Ghost material via Material Instance Dynamic

**PlayCanvas:**
- 🛠️ Collision layer masking
- Material opacity change

**Combination Recipe:** Collision layer change → material swap (transparency) → attack disable → overlap check (exit) → nearest clear position finder

---

### 46. SUMMON 🔧
**Unreal Engine:**
- 🔧 Spawn Actor from Class
- AI Controller for summon behavior
- Navigation for valid spawn point
- Follow behavior via AI (Behavior Trees)
- Lifetime timer
- Pool management for performance

**PlayCanvas:**
- 🔧 Entity instantiation
- Custom AI script
- Spawn point validation

**Combination Recipe:** Spawn point raycast → spawn actor → AI initialization → behavior assignment → lifetime timer → despawn with VFX

---

### 47. REVIVE 🛠️
**Unreal Engine:**
- 🛠️ Overlap detection for downed allies
- Channel timer (interruptible)
- Animation montage for revive action
- Health restoration
- Brief invincibility via Gameplay Effect
- Niagara revival VFX

**PlayCanvas:**
- 🛠️ Overlap detection
- Custom channeling system
- Health restoration

**Combination Recipe:** Proximity detection → channel timer → interrupt check → health restore → invincibility buff → VFX

---

### 48. TAUNT 🛠️
**Unreal Engine:**
- 🛠️ Overlap sphere for enemy detection
- AI Perception override (force aggro)
- Behavior Tree task to force target
- Animation montage for taunt gesture
- Taunt duration timer
- Threat level modification

**PlayCanvas:**
- 🛠️ Overlap sphere
- Custom AI aggro system

**Combination Recipe:** Overlap detection → AI target override → threat level increase → timer → animation + audio → cooldown

---

### 49. CAPTURE 🛠️
**Unreal Engine:**
- 🛠️ Health threshold check
- Projectile spawn (capture device)
- Struggle minigame (UMG)
- RNG success calculation
- Inventory addition
- Remove/hide target on success

**PlayCanvas:**
- 🛠️ Health check
- Projectile entity
- Custom minigame
- RNG system

**Combination Recipe:** Health check → projectile spawn → collision → minigame UI → RNG success → inventory add → target removal

---

### 50. MORPH 🛠️
**Unreal Engine:**
- 🛠️ Skeletal Mesh swap
- Ability set swap (Blueprint Interface)
- Stat copy (health, speed, etc.)
- Animation Blueprint swap
- Detection system (proximity checks)
- Energy drain timer

**PlayCanvas:**
- 🛠️ Model swap
- Ability script swap
- Stat copying

**Combination Recipe:** Target scan → model swap → ability set swap → stat copying → animation swap → detection risk system → energy drain

---

## Modular System Combinations

### Key Insight: Most verbs combine 3-7 core systems

**Common System Clusters:**

1. **Input + Animation + Physics** (Movement verbs)
   - Jump, Run, Crouch, Slide, Dodge

2. **Raycast + VFX + Audio + Cooldown** (Combat verbs)
   - Shoot, Scan, Teleport

3. **Physics Constraint + Line Rendering + Force Application** (Manipulation verbs)
   - Grapple, Pull, Grab

4. **Gameplay Ability System + Animation + VFX** (Special abilities in Unreal)
   - Block, Heal, Charge, Absorb

5. **AI System + Detection + Timer** (Stealth/Social verbs)
   - Stealth, Taunt, Possess

6. **Overlap Detection + Material Swap + Particle System** (Magic verbs)
   - Freeze, Burn, Levitate, Shrink, Grow

7. **UI System + Timer + Resource Management** (Minigame verbs)
   - Hack, Craft, Fish, Cook

---

## Coverage Summary

### Unreal Engine 5

| Coverage Level | Count | Verbs |
|---------------|-------|-------|
| ✅ Directly Built-In | 12 | Jump, Run, Swim, Crouch, Sprint, Glide, Drive, Fly, Aim, Interact, Possess, Construct |
| 🔧 Partial/Configurable | 20 | Shoot, Block, Dodge, Dash, Grab, Throw, Reload, Hack, Stealth, Heal, Charge, Summon, Pull, Push, Mine, Fish, Grapple, Reflect, Destroy, Craft |
| 🛠️ Custom Required | 18 | Climb, Slide, Parry, Scan, Cook, Transform, Teleport, Levitate, Freeze, Burn, Shrink, Grow, Absorb, Phase, Revive, Taunt, Capture, Morph |

**Key Advantage:** Gameplay Ability System (GAS) is a game-changer for abilities, cooldowns, costs, effects.

### PlayCanvas

| Coverage Level | Count | Verbs |
|---------------|-------|-------|
| ✅ Directly Built-In | 2 | Run, Sprint (simple implementation) |
| 🔧 Partial/Configurable | 15 | Jump, Swim, Crouch, Shoot, Aim, Glide, Drive, Interact, Construct, Destroy, Pull, Push, Grab, Summon, Charge |
| 🛠️ Custom Required | 33 | Most advanced mechanics require scripting |

**Key Advantage:** Lightweight, flexible JavaScript scripting. Great for web deployment.

---

## Plugin Ecosystems

### Unreal Marketplace (Extends Built-in Support)
- **Advanced Locomotion System (ALS)**: Climb, vault, mantle
- **Gameplay Ability System Companion**: Pre-built abilities
- **Destructible Mesh Tools**: Enhanced destruction
- **Inventory Systems**: Craft, use items
- **AI Perception+**: Enhanced stealth mechanics
- **Vehicle Variety Pack**: More vehicle types

### PlayCanvas Asset Store
- **Character Controller**: Enhanced movement
- **Inventory System**: Item management
- **AI Toolkit**: Pathfinding, behavior
- **Particle Effects Library**: Pre-made VFX
- **UI Components**: Crafting, inventory UIs

---

## Performance Considerations

### Unreal Engine
- **Built-in Profiling**: Stat commands, Unreal Insights
- **Object Pooling**: Supported natively
- **LOD System**: Automatic for meshes, particles
- **Network Replication**: Built-in for multiplayer
- **Threading**: Multi-threaded rendering, physics, AI

### PlayCanvas
- **Lightweight**: Better for web/mobile performance
- **Manual Pooling**: Requires custom implementation
- **Batching**: Automatic draw call batching
- **Asset Streaming**: Good for large projects
- **WebGL/WebGPU**: Browser-based rendering

---

## Conclusion

### Can These Engines Handle All 50 Verbs?

**Yes, through combinations:**

1. **Unreal Engine**:
   - ~24% directly built-in
   - ~40% with simple configuration
   - ~36% require custom blueprints/C++
   - **Gameplay Ability System covers ~80% of ability verbs with minimal code**

2. **PlayCanvas**:
   - ~4% directly built-in
   - ~30% with component combinations
   - ~66% require custom scripts
   - **JavaScript flexibility means everything is achievable, just requires more coding**

### The Modular Principle

**Every complex verb is a combination of 3-7 fundamental systems:**

- Input handling
- Physics/collision
- Animation
- Audio
- VFX
- UI
- Timers/cooldowns
- Resource management

Both engines provide these fundamentals. The difference is how much pre-built combination logic exists.

### Recommendation by Project Type

**Choose Unreal if:**
- Building high-fidelity 3D game
- Need advanced physics (vehicles, destruction)
- Want built-in multiplayer replication
- Have complex AI requirements
- Prefer visual scripting (Blueprints)

**Choose PlayCanvas if:**
- Building web-based game
- Need lightweight, fast loading
- Prefer JavaScript programming
- Targeting mobile/browser platforms
- Want easier deployment (just a URL)

**Both engines can implement all 50 verbs.** The question is how much comes "out of the box" vs how much you build yourself.
