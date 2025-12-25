# 50 Verbs as Game Mechanics: Per-Frame Loop Analysis

A comprehensive analysis of common game verbs, their implementation complexities, and impact on the game loop.

---

## 1. JUMP

### Complexities
- **State Management**: Ground detection, double-jump counting, coyote time (grace period after leaving platform)
- **Physics**: Vertical velocity application, gravity accumulation, variable jump height based on button hold duration
- **Animation**: Transition blending between idle/run → jump → fall → land states
- **Input Buffering**: Queue jump input if pressed slightly before landing

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check ground contact (raycast/collision check)
- If jump pressed && (grounded || coyoteTimeRemaining > 0 || hasDoubleJump):
  - Apply upward velocity impulse
  - Set jump state
  - Trigger jump animation
  - Play jump sound
- Apply gravity to vertical velocity
- Update coyoteTime counter if airborne
- Check for landing collision
- Blend between jump/fall animations based on vertical velocity sign
```

**Performance**: 1-2 raycasts per frame, state checks, animation blending

---

## 2. RUN

### Complexities
- **Acceleration Curves**: Gradual speed buildup vs instant max speed
- **Terrain Adaptation**: Speed modifiers for slopes, surfaces (ice, mud)
- **Animation Blending**: Idle → walk → run transitions, speed-matched animation playback
- **Footstep System**: Terrain-dependent sound timing synced to animation
- **Stamina Management**: Optional exhaustion mechanics

### Per-Frame Loop Impact
```javascript
// Every frame:
- Read horizontal input axis
- Calculate target velocity based on input direction
- Lerp current velocity toward target (acceleration/deceleration)
- Apply surface friction modifier
- Update animation blend parameter (0=idle, 0.5=walk, 1=run)
- Check animation foot events for footstep sounds
- Deplete stamina if sprinting
- Apply movement to physics body or transform
```

**Performance**: Input polling, lerp calculations, animation parameter updates

---

## 3. SHOOT

### Complexities
- **Projectile Pooling**: Object reuse to avoid garbage collection
- **Trajectory Calculation**: Raycasting vs physical projectiles
- **Recoil/Kickback**: Camera shake, weapon position offset
- **Ammo Management**: Clip size, reload states, infinite ammo checks
- **Hit Detection**: Hitscan vs projectile collision
- **Rate Limiting**: Cooldown timers, full-auto vs semi-auto

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check fire input && cooldownTimer <= 0 && ammo > 0
- If shooting:
  - Raycast from weapon muzzle (hitscan) OR
  - Spawn projectile from pool with initial velocity
  - Apply recoil to camera/weapon transform
  - Decrement ammo
  - Reset cooldown timer
  - Trigger muzzle flash particle effect
  - Play gunshot audio
- Decrease cooldown timer by deltaTime
- Check for reload input
- Update weapon position with recoil recovery lerp
```

**Performance**: Raycasts (potentially multiple for spread), particle spawning, audio triggers

---

## 4. CLIMB

### Complexities
- **Surface Detection**: Identifying climbable surfaces via tags/layers
- **IK (Inverse Kinematics)**: Hand/foot placement on irregular surfaces
- **Transition States**: Mounting (ground→climb), dismounting (climb→top)
- **Stamina Drain**: Grip strength meter
- **Camera Adjustment**: Different camera behavior while climbing

### Per-Frame Loop Impact
```javascript
// Every frame:
- If near climbable surface && climb input:
  - Enter climb state
  - Disable normal movement controller
  - Align character to surface normal
- While climbing:
  - Read vertical/horizontal input
  - Move along surface tangent vectors
  - Perform IK calculations for limb placement
  - Decrease stamina
  - Check for ledge top (raycast upward)
  - Update climbing animation based on movement direction
- Check for dismount input or stamina depletion
```

**Performance**: Multiple raycasts for surface detection, IK solver overhead, normal/tangent calculations

---

## 5. SWIM

### Complexities
- **Fluid Dynamics**: Buoyancy forces, drag/resistance
- **Oxygen Management**: Underwater breath timer, surface air restoration
- **Wave Interaction**: Surface bobbing, visual water displacement
- **Movement Modes**: Surface swimming vs diving
- **Animation Layers**: Full-body swimming vs treading water

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check if in water volume (trigger collision)
- If swimming:
  - Apply upward buoyancy force
  - Apply drag to velocity (water resistance)
  - Modify gravity (reduced or inverted)
  - Read swim input (directional movement + dive/surface)
  - If underwater: decrease oxygen timer
  - If at surface: restore oxygen
  - Update swimming animation based on speed and depth
  - Apply wave height to vertical position
  - Trigger bubble particles if underwater
```

**Performance**: Trigger volume checks, force calculations, oxygen UI updates, particle systems

---

## 6. DODGE

### Complexities
- **Invincibility Frames**: Temporary damage immunity window
- **Direction Control**: Input-based dodge direction or forward-only
- **Momentum Override**: Cancel current velocity and apply dodge vector
- **Animation Locking**: Cannot interrupt dodge until complete
- **Cooldown Management**: Prevent spam

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check dodge input && cooldownTimer <= 0 && not dodging
- If dodge initiated:
  - Store input direction
  - Set invincibility flag
  - Lock controls
  - Play dodge animation
  - Apply velocity impulse in dodge direction
- While dodging:
  - Maintain dodge velocity (ignore input)
  - Check animation completion
  - Manage invincibility frame counter
- On dodge complete:
  - Restore control
  - Remove invincibility
  - Start cooldown
- Decrease cooldown by deltaTime
```

**Performance**: State checks, animation queries, cooldown tracking

---

## 7. CROUCH

### Complexities
- **Collider Resizing**: Shrink character collision capsule
- **Stand-Up Obstruction**: Check if space available before uncrouch
- **Movement Speed Modifier**: Slower movement while crouched
- **Camera Height Adjustment**: Smooth interpolation to lower viewpoint
- **Stealth Integration**: Reduced detection radius/noise

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check crouch input toggle
- If crouching:
  - Raycast upward to check clearance
  - If clear && uncrouch input: stand up
  - Scale collider height
  - Lerp camera height to crouch position
  - Apply movement speed multiplier
  - Update animation to crouch blend tree
- If standing up:
  - Restore collider height
  - Lerp camera to stand height
```

**Performance**: Overhead raycast, collider modifications, camera interpolation

---

## 8. DASH

### Complexities
- **Velocity Burst**: Instant speed boost with decay
- **Trail Effects**: Motion blur, afterimage particles
- **Collision Handling**: Phase through enemies vs bounce off walls
- **Directional Control**: Lock direction vs allow steering
- **Cooldown Visualization**: UI indicators, character glow

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check dash input && charges > 0
- If dash initiated:
  - Store dash direction from input
  - Apply velocity burst
  - Enable trail particle system
  - Decrement charges
  - Start cooldown
  - Lock rotation (optional)
- While dashing:
  - Decrease velocity magnitude over time (decay curve)
  - Check collision (phase or bounce logic)
  - Update trail effect position
- Regenerate charges based on cooldown
- Update UI charge indicators
```

**Performance**: Particle system updates, velocity decay calculations, collision overrides

---

## 9. GRAB

### Complexities
- **Target Acquisition**: Raycast or overlap sphere to find grabbable objects
- **Physics Constraints**: Joint creation between character and object
- **Weight Limits**: Strength-based pickup restrictions
- **Two-Hand Coordination**: Dual-hand IK for large objects
- **Throwing Mechanics**: Charge-up power, aim trajectory preview

### Per-Frame Loop Impact
```javascript
// Every frame:
- If not holding:
  - Raycast forward for grabbable objects
  - Highlight target (outline shader)
  - If grab input: attach object
- If holding:
  - Constrain object to hand position via joint or transform parenting
  - Apply IK to arm bones
  - Read throw input (charge power meter)
  - If release: apply velocity to object based on charge
  - Update carrying animation
- Check weight limits and stamina drain
```

**Performance**: Raycasts, physics joint updates, IK calculations, outline rendering

---

## 10. THROW

### Complexities
- **Trajectory Prediction**: Arc visualization for player feedback
- **Power Charge**: Hold-to-charge throwing strength
- **Spin/Curve**: Apply torque for object rotation in flight
- **Release Timing**: Accurate angle calculation at button release
- **Momentum Transfer**: Add character velocity to throw velocity

### Per-Frame Loop Impact
```javascript
// Every frame:
- If charging throw:
  - Increase power meter (clamped)
  - Calculate trajectory arc based on current power
  - Render arc line using line renderer or particles
  - Update aim reticle position at landing point
- On release:
  - Calculate throw vector from aim direction + power
  - Add character movement velocity
  - Apply force/velocity to object
  - Apply angular velocity (spin)
  - Release physics constraint
  - Hide trajectory arc
```

**Performance**: Trajectory arc calculations (parabola sampling), line rendering, physics force application

---

## 11. BLOCK

### Complexities
- **Damage Reduction**: Percentage-based or flat reduction
- **Directional Blocking**: Only block attacks from front arc
- **Stamina Depletion**: Blocking drains stamina, especially on impact
- **Perfect Block Window**: Timed blocks for full negation/counterattack
- **Block-Break Mechanics**: Heavy attacks bypass or stagger
- **Animation Blending**: Shield raised position, block impact flinch

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check block input (hold or toggle)
- If blocking:
  - Set blocking state flag
  - Drain stamina passively
  - Update animation (raise shield/guard stance)
  - Reduce movement speed
  - Calculate block angle arc (front 120 degrees)
- When hit event occurs:
  - Check if attack within block arc
  - Apply damage reduction
  - Drain stamina on impact
  - Trigger block impact animation/effect
  - Check for perfect block timing window
  - If stamina depleted: break guard, stagger
```

**Performance**: State checks, angle calculations, stamina tracking, animation events

---

## 12. PARRY

### Complexities
- **Tight Timing Window**: 100-300ms success window
- **Attack Detection**: Predict incoming attack timing
- **Counterattack Opportunity**: Slow-motion window or guaranteed riposte
- **Risk/Reward**: Failed parry = vulnerability window
- **Audio/Visual Feedback**: Distinctive clang sound, spark effect

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check parry input (tap, not hold)
- If parry initiated:
  - Start parry window timer (e.g., 200ms)
  - Play parry animation
  - Set vulnerability flag
- While parry active:
  - Decrease timer
  - Check for incoming attack collision
  - If attack during window:
    - Negate damage
    - Trigger parry success effect (sparks, slow-mo)
    - Stagger attacker
    - Open counterattack window
  - If timer expires: vulnerability state
- Manage cooldown before next parry
```

**Performance**: Precise timer tracking, collision event monitoring, VFX triggering

---

## 13. SLIDE

### Complexities
- **Momentum Conservation**: Maintain speed while sliding
- **Slope Interaction**: Speed boost downhill, slowdown uphill
- **Collider Shape Change**: Switch to prone capsule
- **Transition Restrictions**: Can't stand if overhead obstruction
- **Attack Integration**: Slide attacks, slide-jump combos

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check slide input && moving && grounded
- If sliding:
  - Switch to prone collider shape
  - Apply slide velocity (boost from run speed)
  - Calculate slope angle
  - Modify velocity based on slope (faster downhill)
  - Raycast upward for clearance
  - Decrease slide duration timer
  - Play slide animation
  - Generate dust particles
  - Check for slide attack input
- If timer expires or stopped:
  - Check overhead clearance
  - If clear: restore standing collider
  - If blocked: remain prone until clear
```

**Performance**: Collider swaps, slope calculations, clearance raycasts, particle systems

---

## 14. GRAPPLE

### Complexities
- **Hook Physics**: Raycast or projectile for grapple point
- **Rope Simulation**: Spring physics or verlet integration
- **Swing Mechanics**: Pendulum physics, momentum conservation
- **Reel-In Control**: Shorten rope for upward pull
- **Detachment Logic**: Auto-release vs manual release

### Per-Frame Loop Impact
```javascript
// Every frame:
- If grapple input:
  - Raycast for grapple point (within range, tagged surface)
  - If valid: attach rope
- While grappling:
  - Calculate rope vector (player to anchor)
  - If rope length > maxLength:
    - Apply constraint force toward anchor (spring)
  - Allow pendulum swing (preserve momentum)
  - If reel input: decrease rope length
  - Simulate rope rendering (line renderer with segments)
  - Check for detach input or anchor reached
- On detach:
  - Remove rope constraint
  - Maintain momentum from swing
```

**Performance**: Raycasts, spring physics calculations, rope segment rendering

---

## 15. GLIDE

### Complexities
- **Gravity Reduction**: Slow fall rate
- **Forward Momentum**: Horizontal velocity decay rate
- **Turn Control**: Air steering with momentum shift
- **Stamina/Fuel**: Limited glide duration
- **Wind Currents**: Updrafts for height gain

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check glide input && airborne && hasGlider
- If gliding:
  - Reduce gravity to glide value (e.g., 20% normal)
  - Apply air drag to horizontal velocity
  - Read steering input
  - Apply gentle turning force
  - Deplete stamina/fuel
  - Check for updraft volumes (add lift)
  - Update gliding animation (wings spread)
  - Tilt character model based on velocity direction
- If stamina depleted or input released:
  - Restore normal gravity
  - Play glider collapse animation
```

**Performance**: Gravity overrides, drag calculations, trigger volume checks for updrafts

---

## 16. SPRINT

### Complexities
- **Speed Multiplier**: 1.5-2.5x base movement speed
- **Stamina Drain**: Continuous depletion while active
- **FOV Changes**: Increase field of view for speed sensation
- **Animation Speed Scaling**: Match run cycle to actual speed
- **Turn Restriction**: Reduced turn radius at high speed

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check sprint input && stamina > 0 && moving
- If sprinting:
  - Apply speed multiplier to movement velocity
  - Drain stamina based on deltaTime
  - Lerp FOV to sprint value (e.g., 75 → 85)
  - Scale animation playback speed
  - Reduce turn rate
  - Generate sprint breathing audio
  - Update sprint VFX (speed lines)
- If stamina depleted or input released:
  - Lerp back to normal speed/FOV
  - Start stamina regeneration (after delay)
```

**Performance**: FOV adjustments, stamina tracking, animation speed scaling

---

## 17. AIM

### Complexities
- **Camera Zoom**: Over-the-shoulder or scope view
- **Reticle System**: Dynamic crosshair, spread visualization
- **Movement Penalty**: Slower movement while aiming
- **Sway Simulation**: Weapon drift, breath holding to stabilize
- **Target Assistance**: Auto-aim magnetism, aim smoothing

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check aim input (hold or toggle)
- If aiming:
  - Lerp camera to aim position (over shoulder or scope)
  - Reduce movement speed
  - Apply weapon sway (sine wave or Perlin noise)
  - If hold breath input: reduce sway, drain stamina
  - Calculate reticle spread based on movement/sway
  - Check for targets in aim cone (auto-aim)
  - Apply subtle camera pull toward nearby targets
  - Update aim reticle UI
- On release:
  - Lerp camera back to normal position
  - Restore movement speed
```

**Performance**: Camera interpolation, sway calculations, target detection raycasts

---

## 18. RELOAD

### Complexities
- **Animation Timing**: Synced to reload animation duration
- **Interruption Handling**: Can cancel reload early, lose partial progress
- **Partial Reloads**: Chamber round still counts if interrupted late
- **Ammo Pool Management**: Reserve ammo vs current clip
- **Tactical Reload**: Keep chambered round if reload before empty

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check reload input && ammo < maxClip && reserveAmmo > 0
- If reloading:
  - Lock weapon firing
  - Play reload animation
  - Update reload timer
  - Check for animation events (magazine out, magazine in)
  - If interrupted: check progress percentage for partial reload
  - Update reload progress UI bar
- On completion:
  - Transfer ammo from reserve to clip
  - Unlock weapon
  - Reset state
```

**Performance**: Animation event monitoring, timer tracking, UI updates

---

## 19. HACK

### Complexities
- **Minigame Integration**: Puzzle mechanics (lockpicking, circuit matching)
- **Proximity Requirement**: Must be within range of target
- **Detection Risk**: Longer hacks = higher alert level
- **Skill Checks**: Player stats affect difficulty/speed
- **Interruption Consequences**: Fail state if attacked during hack

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check hack input && near hackable object
- If hacking:
  - Freeze player movement
  - Open hack UI overlay
  - Update minigame state (input handling)
  - Increase hack progress based on minigame success
  - Update alert level timer
  - Check for interruption (damage, enemy proximity)
  - Update progress bar UI
- On success:
  - Trigger hack completion effect (door opens, data acquired)
  - Close UI
  - Restore control
- On failure:
  - Trigger alarm
  - Lock terminal temporarily
```

**Performance**: UI rendering, minigame logic updates, proximity checks

---

## 20. STEALTH

### Complexities
- **Visibility System**: Light level checks, line-of-sight raycasts
- **Noise Generation**: Footstep volume based on movement speed
- **Cover Mechanics**: Crouch behind objects, peek around corners
- **Detection Meter**: Gradual awareness increase vs instant alert
- **Shadow Blending**: Darkness provides concealment bonus

### Per-Frame Loop Impact
```javascript
// Every frame:
- Sample light level at player position (texture lookup or volume)
- Calculate movement noise (speed * surface modifier)
- For each nearby AI:
  - Raycast line of sight to player
  - If visible:
    - Calculate visibility score (light level + distance + stance)
    - Increase detection meter
  - Check noise distance (compare to hearing radius)
  - If heard: increase alert level
- Update stealth UI indicator (visibility gem)
- Apply crouch/shadow modifiers
- Update stealth music/audio mix
```

**Performance**: Multiple raycasts per AI, light sampling, distance calculations

---

## 21. SCAN

### Complexities
- **Cone Visualization**: Shader-based scan pulse effect
- **Tag Detection**: Identify interactive/enemy objects
- **Range Limitation**: Effective radius with falloff
- **Cooldown/Charge**: Limited uses or recharge time
- **Information Overlay**: Display enemy health, object names

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check scan input && cooldown <= 0
- If scan activated:
  - Spawn scan pulse effect (expanding sphere)
  - Detect all tagged objects in radius (overlap sphere)
  - Mark detected objects for highlighting
  - Store object data (health, type, distance)
  - Play scan sound
  - Start cooldown
- While objects marked:
  - Render outline/highlight shader
  - Display UI tags (world-space canvas)
  - Decrease mark duration timer
- Update cooldown timer
```

**Performance**: Overlap sphere physics query, shader rendering, UI canvas updates

---

## 22. HEAL

### Complexities
- **Heal Over Time vs Instant**: Gradual restoration or immediate
- **Interruptible Channeling**: Damage cancels healing
- **Resource Cost**: Consume medkit/mana/energy
- **Overheal Mechanics**: Temporary health above max
- **Animation Lock**: Cannot move or attack while healing

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check heal input && hasHealItem && health < maxHealth
- If healing:
  - Lock movement/actions
  - Play healing animation
  - Update heal timer
  - Increase health by (healRate * deltaTime)
  - Generate healing particles
  - Check for damage interrupt
  - Update health bar UI
- On completion:
  - Consume heal item
  - Restore control
  - Apply overheal if applicable (start decay timer)
- If overheal active:
  - Decrease overheal amount over time
```

**Performance**: Timer tracking, particle systems, UI updates

---

## 23. INTERACT

### Complexities
- **Context Sensitivity**: Dynamic action based on target (open, pickup, talk)
- **Prompt System**: Display correct interaction text
- **Hold vs Tap**: Timed interactions for important actions
- **Interrupt Handling**: Can cancel during progress
- **Multi-Stage Interactions**: Sequences like lockpicking phases

### Per-Frame Loop Impact
```javascript
// Every frame:
- Raycast or overlap sphere for interactables
- If valid target in range:
  - Display interaction prompt (context-specific)
  - Check input (tap or hold)
  - If holding:
    - Update interaction timer/progress bar
    - Check for release (cancel)
  - On completion:
    - Trigger interaction event
    - Execute context action (pickup item, open door, etc.)
- Update UI prompt position (world-to-screen)
```

**Performance**: Raycasts/overlap checks, UI updates, progress tracking

---

## 24. CRAFT

### Complexities
- **Recipe Validation**: Check ingredient availability
- **Crafting Time**: Progress bar for creation duration
- **Failure Chance**: Skill-based success rates
- **Batch Crafting**: Queue multiple items
- **Workstation Requirements**: Must be at specific location

### Per-Frame Loop Impact
```javascript
// Every frame:
- If in crafting UI:
  - Check selected recipe requirements
  - Validate inventory for ingredients
  - Enable/disable craft button
- If crafting active:
  - Update craft timer
  - Update progress bar UI
  - Check for cancellation input
  - On completion:
    - Roll for success (if applicable)
    - Consume ingredients from inventory
    - Add crafted item to inventory
    - Trigger success/failure feedback
    - If queue not empty: start next item
```

**Performance**: UI updates, inventory queries, RNG calculations

---

## 25. DRIVE

### Complexities
- **Vehicle Physics**: Suspension, wheel friction, aerodynamics
- **Input Smoothing**: Steering interpolation to prevent jerky movement
- **Gear System**: Automatic or manual transmission
- **Damage Model**: Deformation, component damage affecting performance
- **Camera Modes**: Third-person, first-person, chase cam

### Per-Frame Loop Impact
```javascript
// Every frame:
- Read vehicle inputs (throttle, brake, steering)
- Apply wheel forces based on throttle/brake
- Calculate wheel friction (surface-dependent)
- Update suspension spring forces per wheel
- Apply aerodynamic drag
- Calculate engine RPM and gear ratios
- Apply steering torque (interpolated for smoothness)
- Update wheel visual rotation
- Check for collision damage
- Update speedometer UI
- Adjust camera position based on mode and speed
```

**Performance**: Complex physics calculations per wheel, suspension solver, collision detection

---

## 26. FLY

### Complexities
- **6-Degree Freedom**: Pitch, yaw, roll control
- **Altitude Management**: Stall mechanics at low speed
- **Momentum Persistence**: Newtonian physics or arcade mode
- **Wing Stall**: Loss of lift below speed threshold
- **G-Force Effects**: Screen effects from high-speed maneuvers

### Per-Frame Loop Impact
```javascript
// Every frame:
- Read flight inputs (pitch, yaw, roll, throttle)
- Apply rotational torque for each axis
- Calculate forward thrust from throttle
- Calculate lift force based on speed and pitch
- Apply drag/air resistance
- Check for stall condition (speed too low)
- If stalling: reduce lift, play warning audio
- Apply G-force effects to camera (blur, vignette)
- Update flight instrument UI (altimeter, speed, heading)
- Adjust camera shake based on speed/turbulence
```

**Performance**: Complex force calculations, rotation math, UI updates

---

## 27. TRANSFORM

### Complexities
- **Morph Animation**: Smooth transition between forms
- **Stat Changes**: Different health, speed, abilities per form
- **Cooldown/Resource**: Energy or time-limited transformations
- **Ability Restrictions**: Some actions only available in specific forms
- **Visual Effects**: Particle burst, model swap timing

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check transform input && energy >= cost && cooldown <= 0
- If transforming:
  - Play transition animation
  - Lerp between model scales/shapes
  - Update transform timer
  - On completion:
    - Swap character model/abilities
    - Modify stats (health, speed multipliers)
    - Enable/disable form-specific actions
    - Start energy drain timer (if temporary)
- If in transformed state:
  - Drain energy over time
  - Check for revert condition (energy depleted, input)
- Update transform UI (energy bar, duration timer)
```

**Performance**: Model swapping, animation blending, stat recalculation

---

## 28. CHARGE

### Complexities
- **Attack Power Scaling**: Damage increases with charge time
- **Movement Restriction**: Reduced or locked movement while charging
- **Visual/Audio Feedback**: Growing particle effect, pitch-shifting sound
- **Overcharge Risk**: Hold too long = failure/explosion
- **Release Timing**: Perfect charge window for bonus damage

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check charge input (hold button)
- While charging:
  - Increase charge power (clamped 0-1)
  - Update charge timer
  - Scale particle effect size
  - Pitch up charging audio
  - Lock or slow movement
  - Check for overcharge threshold
  - If overcharge: trigger failure state
  - Update charge meter UI
- On release:
  - Calculate attack damage from charge level
  - Check for perfect timing bonus
  - Execute charged action
  - Reset charge state
```

**Performance**: Timer tracking, particle scaling, audio pitch modulation

---

## 29. TELEPORT

### Complexities
- **Destination Validation**: Check landing zone is clear/valid
- **Cooldown Management**: Prevent teleport spam
- **Visual Effects**: Disappear/reappear particle effects
- **Disorientation**: Brief control lock after teleport
- **Range Limitation**: Maximum distance or line-of-sight requirement

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check teleport input && cooldown <= 0
- If teleport mode active:
  - Raycast to determine teleport destination
  - Check destination validity (ground check, clearance)
  - Display teleport marker at valid position
  - Update marker color (valid=green, invalid=red)
- On confirm:
  - Store current position (for VFX)
  - Spawn disappear effect
  - Disable character rendering briefly
  - Move character to destination
  - Spawn appear effect
  - Lock controls for disorientation duration
  - Start cooldown
- Update cooldown UI
```

**Performance**: Raycasts for destination, particle spawns, position validation

---

## 30. POSSESS

### Complexities
- **Target Acquisition**: Line-of-sight to possessable entity
- **Camera Transition**: Smooth transfer to new viewpoint
- **Control Mapping**: Different controls for different entity types
- **Original Body**: Store/disable player character
- **Dispossession**: Return to original body

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check possess input && valid target in view
- If possessing:
  - Store player character reference
  - Disable player controller
  - Enable target entity controller
  - Lerp camera to target viewpoint
  - Load entity-specific control scheme
  - Transfer input handling
- While possessed:
  - Control target entity
  - Update possession UI (indicator, timer if limited)
  - Check for dispossess input
- On dispossess:
  - Lerp camera back to player
  - Re-enable player controller
  - Disable target controller
```

**Performance**: Camera transitions, controller swapping, state management

---

## 31. CONSTRUCT

### Complexities
- **Placement Preview**: Ghost model showing valid/invalid placement
- **Resource Checking**: Validate material costs
- **Snap-to-Grid**: Align structures to grid or freeform
- **Collision Detection**: Check if placement overlaps existing objects
- **Build Time**: Progress bar for construction completion

### Per-Frame Loop Impact
```javascript
// Every frame:
- If in build mode:
  - Raycast to ground for placement position
  - Position ghost preview at raycast hit
  - Snap to grid if enabled
  - Check for collisions (overlap box)
  - Update preview color (valid=green, invalid=red)
  - Check rotation input
  - If place input && valid && hasResources:
    - Spawn construction scaffold
    - Start build timer
    - Deduct resources
- While constructing:
  - Update build progress
  - Lerp from scaffold to final model
  - Update progress bar UI
- On completion:
  - Replace with final structure
```

**Performance**: Raycasts, collision checks, preview rendering, lerp calculations

---

## 32. DESTROY

### Complexities
- **Destruction Method**: Instant removal vs gradual damage
- **Particle Debris**: Spawn fragments with physics
- **Sound Variation**: Different break sounds for materials
- **Loot Drops**: Chance to spawn resources
- **Structural Integrity**: Chain reactions for connected structures

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check destroy input on target
- If destroying:
  - Apply damage to target
  - Update health/durability
  - Play damage animation/shader effect
  - If health <= 0:
    - Trigger destruction sequence
    - Spawn debris particles (pooled)
    - Apply random forces to fragments
    - Play destruction sound
    - Check for loot drop (RNG)
    - Remove original object
    - Check connected structures for stability
```

**Performance**: Particle spawning, physics forces, chain reaction checks

---

## 33. COOK

### Complexities
- **Heat Management**: Temperature affects cooking quality
- **Timing Windows**: Undercook vs overcook vs perfect
- **Ingredient Combinations**: Recipe validation
- **Visual Changes**: Material/texture transitions during cooking
- **Burning Mechanics**: Too long = ruined food

### Per-Frame Loop Impact
```javascript
// Every frame:
- If cooking active:
  - Update cook timer
  - Sample heat source intensity
  - Calculate cook progress based on heat
  - Update food material/texture (color transition)
  - Check for optimal time window
  - If exceeded: start burning phase
  - Update cooking UI (timer, temperature, quality meter)
  - Play cooking sound (sizzle intensity based on heat)
- Check for remove input
- On removal:
  - Determine quality based on cook time
  - Apply stat bonuses accordingly
  - Add to inventory
```

**Performance**: Timer tracking, material transitions, UI updates

---

## 34. MINE

### Complexities
- **Tool Durability**: Degrade pickaxe/tool with each swing
- **Material Hardness**: Different resources require different tools/time
- **Fatigue System**: Stamina drain per swing
- **Resource Yield**: RNG for quantity and quality
- **Animation Syncing**: Hit timing matches animation impact frame

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check mine input && has tool && stamina > 0
- If mining:
  - Play mining animation
  - Check for animation hit event
  - On hit event:
    - Apply damage to resource node
    - Drain stamina
    - Reduce tool durability
    - Spawn hit particle effect
    - Play impact sound (material-specific)
  - Update node health
  - If node destroyed:
    - Roll for resource drop
    - Spawn resource items
    - Remove node
- Update tool durability UI
- Regenerate stamina when not mining
```

**Performance**: Animation event monitoring, RNG rolls, particle spawning

---

## 35. FISH

### Complexities
- **Casting Mechanics**: Power and direction for line placement
- **Bite Detection**: RNG-based timing for fish interest
- **Struggle Minigame**: Tension management, reel timing
- **Line Break**: Excessive tension causes failure
- **Fish Variety**: Different behaviors and difficulty per species

### Per-Frame Loop Impact
```javascript
// Every frame:
- If casting:
  - Charge cast power
  - Display trajectory arc
  - On release: spawn bobber at target location
- While bobber deployed:
  - Update bobber animation (idle float)
  - RNG check for fish bite
  - If bite: trigger minigame
- During minigame:
  - Read reel input
  - Update tension meter based on fish struggle
  - Apply random fish direction changes
  - If tension > maxTension: line breaks
  - If progress = 100%: catch success
  - Update minigame UI (tension, progress)
- On catch:
  - Determine fish species and size (RNG)
  - Add to inventory
```

**Performance**: RNG checks, trajectory calculations, minigame UI updates

---

## 36. PULL

### Complexities
- **Weight System**: Heavy objects slow pulling speed
- **Physics Forces**: Apply force to physics body vs kinematic movement
- **Rope/Chain Rendering**: Dynamic line between player and object
- **Terrain Friction**: Surface affects pull difficulty
- **Cooperative Pulling**: Multiple players reduce weight

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check pull input && attached to pullable object
- If pulling:
  - Calculate pull direction (player backward vector)
  - Apply force to object based on weight and strength
  - Calculate friction resistance from surface
  - Apply counter-force to player (slow movement)
  - Update rope/chain rendering (line renderer)
  - Play pulling animation
  - Drain stamina
  - Check for obstacle collision (stuck object)
- Update rope tension visual (sag vs taut)
```

**Performance**: Physics force calculations, line rendering, collision checks

---

## 37. PUSH

### Complexities
- **Directional Input**: Push direction based on player facing
- **Weight Threshold**: Can't push objects above strength limit
- **Momentum Buildup**: Gradual acceleration of heavy objects
- **Edge Detection**: Stop at ledges/gaps
- **Puzzle Integration**: Pressure plates, block placement

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check push input && in contact with pushable object
- If pushing:
  - Calculate push direction from player forward
  - Apply force to object (gradual acceleration)
  - Check object weight vs player strength
  - Play push animation
  - Reduce player movement speed
  - Raycast ahead of object for edges/gaps
  - If edge detected: stop push
  - Drain stamina
- Update object velocity (decay when not pushing)
```

**Performance**: Force application, edge detection raycasts, stamina tracking

---

## 38. LEVITATE

### Complexities
- **Anti-Gravity Zone**: Disable gravity for objects in radius
- **Height Control**: Up/down input for altitude adjustment
- **Multiple Objects**: Track all levitating items
- **Energy Drain**: Mana/power consumption over time
- **Weight Limit**: Max total mass that can be levitated

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check levitate input && mana > 0
- If levitating:
  - Detect objects in radius (overlap sphere)
  - For each object:
    - Disable gravity
    - Apply gentle upward force (hover)
    - Read vertical input for height adjustment
    - Highlight object (outline shader)
  - Calculate total mass of levitated objects
  - Drain mana based on total mass
  - Update levitation particle effects
- On deactivation:
  - Re-enable gravity for all objects
  - Objects drop naturally
- Update mana UI
```

**Performance**: Overlap sphere checks, per-object force application, shader updates

---

## 39. FREEZE

### Complexities
- **Time Dilation**: Slow or stop target movement
- **Physics State**: Freeze rigidbody velocities
- **Duration vs Permanent**: Timed freeze or until broken
- **Shatter Mechanics**: Frozen objects take more damage
- **Visual Effects**: Ice shader, frost particles

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check freeze input && target in range
- If freeze cast:
  - Raycast to target
  - Apply frozen status
  - Store original velocities
  - Set rigidbody velocity to zero
  - Disable rigidbody or set kinematic
  - Apply ice material shader
  - Spawn freeze particles
  - Start freeze duration timer
- While frozen:
  - Decrease timer
  - Check for damage (apply shatter multiplier)
  - If health <= 0: trigger shatter effect
- On timer expire:
  - Restore rigidbody state
  - Remove ice shader
  - Restore velocities
```

**Performance**: Rigidbody state management, shader swaps, timer tracking

---

## 40. BURN

### Complexities
- **Damage Over Time**: Tick-based damage application
- **Spread Mechanics**: Fire propagates to nearby flammables
- **Extinguish Conditions**: Water, time, rolling
- **Visual Intensity**: Flame particle size based on remaining duration
- **Light Emission**: Dynamic point light for burning objects

### Per-Frame Loop Impact
```javascript
// Every frame:
- For each burning object:
  - Update burn timer
  - Apply damage tick (every X seconds)
  - Check for extinguish conditions (in water, etc.)
  - Update flame particle intensity
  - Adjust point light brightness
  - Check nearby objects for spread (overlap sphere)
  - If spreadable && RNG success:
    - Ignite nearby object
  - Update burn effect audio (crackle intensity)
- If extinguished:
  - Spawn smoke particles
  - Remove flame effect
  - Disable point light
```

**Performance**: Multiple burning objects tracked, particle systems, lighting updates, spread checks

---

## 41. SHRINK

### Complexities
- **Scale Transition**: Smooth interpolation to small size
- **Collider Scaling**: Maintain collision detection at small scale
- **World Interaction**: Small objects appear large (perspective shift)
- **Speed Adjustment**: Slower movement at small size
- **Camera Distance**: Zoom in to maintain visibility

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check shrink input && not at min scale
- If shrinking:
  - Lerp scale toward target (e.g., 0.1x)
  - Scale collider proportionally
  - Adjust camera distance (zoom in)
  - Modify movement speed (reduce)
  - Update FOV for "giant world" effect
  - Spawn shrink particles
- While shrunk:
  - Maintain scaled state
  - Check for restore input
- If restoring:
  - Lerp back to normal scale
  - Restore collider size
  - Restore camera distance
```

**Performance**: Lerp calculations, collider updates, camera adjustments

---

## 42. GROW

### Complexities
- **Scale Limits**: Max size before hitting physical limits
- **Collision Handling**: Check if space available before growing
- **Strength Scaling**: Increased size = increased damage/carrying capacity
- **Energy Cost**: Larger size drains more resources
- **Camera Pull-Back**: Zoom out to keep character in view

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check grow input && energy > 0
- If growing:
  - Check surrounding space (overlap sphere at target size)
  - If clear:
    - Lerp scale toward target (e.g., 3x)
    - Scale collider proportionally
    - Adjust camera distance (zoom out)
    - Drain energy continuously
    - Update strength multiplier
    - Spawn grow particles
  - If obstructed:
    - Play blocked feedback
- While grown:
  - Continuous energy drain
  - If energy depleted: auto-shrink
- Update size UI indicator
```

**Performance**: Clearance checks, scale lerping, camera distance calculation

---

## 43. REFLECT

### Complexities
- **Projectile Detection**: Detect incoming projectiles in range/arc
- **Angle Calculation**: Determine reflection vector
- **Timing Window**: Active reflect period (not always on)
- **Damage Amplification**: Reflected attacks deal bonus damage
- **Stamina Cost**: Each reflection drains resource

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check reflect input
- If reflecting:
  - Set reflect state (active window)
  - Play reflect animation (shield stance)
  - Drain stamina continuously
- While reflect active:
  - Monitor for projectile collision events
  - On projectile hit:
    - Calculate reflection angle (mirror across normal)
    - Apply damage multiplier
    - Reverse projectile velocity
    - Change projectile owner
    - Trigger reflect VFX (energy ripple)
    - Drain stamina on impact
- If stamina depleted: end reflect
```

**Performance**: Collision monitoring, vector reflection calculations, stamina tracking

---

## 44. ABSORB

### Complexities
- **Damage Conversion**: Convert incoming damage to resource (health/mana)
- **Absorption Cap**: Maximum damage that can be absorbed
- **Shield Visualization**: Absorption barrier effect
- **Overflow Handling**: Excess damage bleeds through
- **Cooldown System**: Time between absorption activations

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check absorb input && cooldown <= 0
- If absorbing:
  - Activate absorption shield
  - Set absorption pool (e.g., 100 damage capacity)
  - Play shield effect
- While shield active:
  - Monitor for damage events
  - On damage received:
    - If damage <= pool:
      - Negate damage
      - Convert to resource (e.g., health)
      - Decrease pool
    - If damage > pool:
      - Absorb pool amount
      - Take overflow as damage
      - Deactivate shield
  - Update shield visual (transparency based on pool)
  - Decrease shield duration
- On deactivation: start cooldown
```

**Performance**: Damage event interception, resource conversion, shader updates

---

## 45. PHASE

### Complexities
- **Collision Toggle**: Disable collision with specific layers
- **Visual Feedback**: Ghost/transparent shader while phasing
- **Energy Drain**: Continuous resource consumption
- **Phase Restrictions**: Can't attack while phased
- **Stuck Prevention**: Force-end phase if exiting inside wall

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check phase input && energy > 0
- If phasing:
  - Disable collision with walls (change layer or ignore)
  - Apply ghost shader (transparency, outline)
  - Drain energy continuously
  - Disable attack actions
  - Spawn phase particles
- While phased:
  - Check energy level
  - If energy depleted || input released:
    - Check if inside solid object (overlap check)
    - If clear: end phase normally
    - If inside wall: find nearest clear position
    - Re-enable collisions
    - Restore normal shader
- Update energy UI
```

**Performance**: Collision layer management, overlap checks, shader swaps

---

## 46. SUMMON

### Complexities
- **Entity Spawning**: Instantiate AI companion/creature
- **Spawn Location**: Valid ground position near player
- **AI Behavior**: Command system (attack, defend, follow)
- **Multiple Summons**: Track active summons, limit count
- **Lifetime Management**: Duration-based or until dismissed

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check summon input && mana >= cost && summonCount < max
- If summoning:
  - Play summon animation
  - Find valid spawn position (ground raycast)
  - Instantiate summon entity from pool
  - Initialize AI behavior (follow player default)
  - Spawn summoning VFX
  - Deduct mana
  - Add to active summons list
- For each active summon:
  - Update AI behavior
  - Check distance from player (dismiss if too far)
  - Update lifetime timer (if duration-based)
  - If timer expired: despawn with VFX
- Check dismiss input
```

**Performance**: Entity instantiation, AI updates, position validation

---

## 47. REVIVE

### Complexities
- **Target Detection**: Find downed ally
- **Channeling**: Timed interaction, interruptible
- **Resource Cost**: Consume item or mana
- **Restoration Amount**: Full health vs partial
- **Invincibility Window**: Brief immunity after revival

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check for downed allies in range (overlap sphere)
- If revive input && valid target && hasResource:
  - Begin revive channel
  - Lock player movement
  - Play revive animation
  - Update progress bar
  - Check for interruption (damage received)
- While channeling:
  - Update timer
  - Check for cancel input
  - If completed:
    - Restore target health
    - Consume resource
    - Trigger revive VFX
    - Grant brief invincibility to target
    - Play revive sound
- Update revive progress UI
```

**Performance**: Overlap checks, timer tracking, UI updates

---

## 48. TAUNT

### Complexities
- **Aggro Management**: Force enemies to target player
- **Radius Effect**: All enemies in range affected
- **Duration**: Temporary aggro vs until damaged
- **Threat Modifier**: Increase threat level in AI system
- **Animation/Audio**: Distinctive taunt gesture and voice line

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check taunt input && cooldown <= 0
- If taunt activated:
  - Play taunt animation
  - Spawn taunt audio and VFX
  - Detect enemies in radius (overlap sphere)
  - For each enemy:
    - Set AI target to player (override current target)
    - Increase threat level
    - Set taunt duration timer
  - Start cooldown
- For each taunted enemy:
  - Decrease taunt timer
  - Maintain forced targeting
  - If timer expired: resume normal AI behavior
- Update cooldown UI
```

**Performance**: Overlap sphere for detection, AI target overrides

---

## 49. CAPTURE

### Complexities
- **Weakening Requirement**: Target must be below health threshold
- **Struggle System**: Target attempts to break free (QTE)
- **Success Chance**: Based on target health and player stats
- **Storage Management**: Add to captured creature inventory
- **Failure Consequences**: Target regains health on failed capture

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check capture input && target health < threshold
- If capturing:
  - Play throw animation (capture device)
  - Spawn capture projectile
  - On projectile hit:
    - Initiate struggle minigame
    - Calculate success chance
    - Update struggle UI (shaking, progress bar)
- While struggling:
  - RNG check each frame against success chance
  - Decrease struggle timer
  - If success: add to inventory
  - If failure: release target, restore partial health
  - Update capture attempt UI
- On success:
  - Play capture success VFX
  - Remove target from scene
```

**Performance**: RNG calculations, minigame UI, projectile physics

---

## 50. MORPH

### Complexities
- **Target Copying**: Assume appearance and abilities of target
- **Ability Mapping**: Learn and use target's skill set
- **Detection Risk**: Close examination reveals morph
- **Duration Limit**: Time-limited or energy-based
- **Stat Mirroring**: Copy health, speed, damage values

### Per-Frame Loop Impact
```javascript
// Every frame:
- Check morph input && valid target scanned
- If morphing:
  - Play morph animation
  - Swap character model to target's model
  - Copy target's ability set
  - Mirror target stats (health, speed, etc.)
  - Start energy drain timer
  - Spawn morph VFX
- While morphed:
  - Drain energy continuously
  - Allow use of copied abilities
  - Check for detection (proximity to suspicious NPCs)
  - If energy depleted: revert to original form
- On revert:
  - Restore original model
  - Restore original abilities and stats
  - Play revert VFX
```

**Performance**: Model swapping, stat copying, ability system updates

---

## Summary: Per-Frame Considerations

Every verb impacts the game loop differently, but common patterns emerge:

### Universal Per-Frame Tasks
1. **Input Polling**: Check button/key states
2. **State Management**: Track verb activation, completion, cooldowns
3. **Physics Updates**: Apply forces, velocities, constraints
4. **Animation Control**: Blend trees, triggers, parameter updates
5. **UI Updates**: Health bars, cooldown indicators, progress meters
6. **Audio Management**: Trigger sounds, adjust pitch/volume
7. **VFX Updates**: Particle systems, shaders, dynamic lights
8. **Collision Checks**: Raycasts, overlap tests, trigger volumes
9. **Timer Tracking**: Cooldowns, durations, intervals
10. **Resource Management**: Stamina, mana, ammo depletion/regeneration

### Performance Optimization Strategies
- **Object Pooling**: Reuse projectiles, particles, decals
- **LOD Systems**: Reduce complexity for distant verbs
- **Async Operations**: Spread expensive calculations over multiple frames
- **Spatial Partitioning**: Only check nearby entities for interactions
- **Frame Budgets**: Limit expensive operations to X per frame
- **Dirty Flags**: Only recalculate when state changes
- **Fixed Timestep**: Physics calculations in separate loop from rendering

This document provides a foundation for understanding how player verbs translate into real-time gameplay systems.