# Game Loop Integration: UI, Collisions, and Character Design

## Table of Contents
- [The Complete Game Loop](#the-complete-game-loop)
- [UI Systems](#ui-systems)
- [Collision Detection](#collision-detection)
- [Character Animation Systems](#character-animation-systems)
- [Integration: How They Work Together](#integration-how-they-work-together)
- [ECS Integration](#ecs-integration)
- [Performance Optimization](#performance-optimization)
- [Complete Implementation Example](#complete-implementation-example)

---

## The Complete Game Loop

Let's start with the complete game loop showing where each system fits:

```cpp
// The full game loop with all systems
void gameLoop() {
    initialize();

    float accumulator = 0.0f;
    const float FIXED_TIMESTEP = 1.0f / 60.0f;  // 60 FPS physics

    while (!shouldQuit) {
        // ============================================================
        // 1. TIMING
        // ============================================================
        float deltaTime = calculateDeltaTime();
        accumulator += deltaTime;

        // ============================================================
        // 2. INPUT
        // ============================================================
        pollEvents();              // OS events (keyboard, mouse, etc.)
        processInput();            // Convert to game actions

        // ============================================================
        // 3. FIXED UPDATE (Physics/Collision - Fixed Timestep)
        // ============================================================
        while (accumulator >= FIXED_TIMESTEP) {
            // Character controller input
            updateCharacterControllers(FIXED_TIMESTEP);

            // Physics simulation
            updatePhysics(FIXED_TIMESTEP);

            // Collision detection
            broadPhaseCollision();
            narrowPhaseCollision();
            resolveCollisions();

            // Update fixed-rate game logic
            updateGameLogic(FIXED_TIMESTEP);

            accumulator -= FIXED_TIMESTEP;
        }

        // ============================================================
        // 4. VARIABLE UPDATE (Animation/AI - Variable Timestep)
        // ============================================================
        // Character animation
        updateAnimationStateMachines(deltaTime);
        updateSkeletalAnimations(deltaTime);
        updateBlendTrees(deltaTime);

        // AI updates
        updateAI(deltaTime);

        // Particle systems
        updateParticles(deltaTime);

        // Audio
        updateAudio(deltaTime);

        // ============================================================
        // 5. LATE UPDATE (Camera, Following)
        // ============================================================
        updateCameras(deltaTime);
        updateFollowSystems(deltaTime);

        // ============================================================
        // 6. UI UPDATE
        // ============================================================
        updateUI(deltaTime);           // Update UI state
        processUIInput();              // Handle UI interactions

        // ============================================================
        // 7. RENDERING
        // ============================================================
        // Interpolate physics for smooth rendering
        float interpolation = accumulator / FIXED_TIMESTEP;

        beginFrame();

        // Render 3D scene
        cullObjects();                 // Frustum culling
        renderOpaque();                // Opaque objects
        renderSkybox();                // Sky
        renderTransparent();           // Transparent objects
        renderParticles();             // Particle effects

        // Render UI (on top)
        renderUI();                    // In-game UI
        renderDebugUI();               // Debug overlays (ImGui)

        endFrame();
        swapBuffers();
    }

    shutdown();
}
```

**Key Observations**:

1. **Physics/Collisions** run at **fixed timestep** (deterministic, networked games)
2. **Animation/AI** run at **variable timestep** (smooth visual updates)
3. **UI** updates after game logic (responds to game state)
4. **Rendering** happens last (draws current state)

---

## UI Systems

### Two Philosophies: Immediate Mode vs Retained Mode

#### Retained Mode UI (Traditional)

**Concept**: Create UI objects that persist between frames

```cpp
// Retained Mode: Create once, update when needed
class Button {
    Vector2 position;
    Vector2 size;
    string text;
    bool isPressed;
    std::function<void()> onClick;

public:
    void update() {
        if (isMouseOver() && Input::isMouseButtonPressed(LEFT)) {
            isPressed = true;
            onClick();
        }
    }

    void render() {
        drawRectangle(position, size, isPressed ? PRESSED_COLOR : NORMAL_COLOR);
        drawText(text, position + textOffset);
    }
};

// Create once
Button playButton;
playButton.position = {100, 100};
playButton.text = "Play";
playButton.onClick = []() { startGame(); };

// Game loop
void gameLoop() {
    while (running) {
        // Update phase
        playButton.update();

        // Render phase
        playButton.render();
    }
}
```

**Characteristics**:
- UI elements exist as objects
- State persists between frames
- More memory usage
- Complex state management
- Good for persistent, complex UIs

**Used For**:
- Main menus
- Inventory systems
- Crafting interfaces
- Dialogue trees
- Mobile game UIs

#### Immediate Mode UI (ImGui)

**Concept**: Recreate UI every frame from scratch

```cpp
// Immediate Mode: Define in game loop
void gameLoop() {
    while (running) {
        // No UI objects created!

        // Define UI every frame
        if (ImGui::Button("Play")) {
            startGame();  // Callback happens immediately
        }

        // More complex example
        ImGui::Begin("Character Stats");
        ImGui::Text("Health: %d", player.health);
        ImGui::SliderFloat("Volume", &audioVolume, 0.0f, 1.0f);
        if (ImGui::Button("Save Game")) {
            saveGame();
        }
        ImGui::End();
    }
}
```

**Characteristics**:
- No persistent UI objects
- State in game variables (not UI)
- Less memory usage
- Simpler code
- Great for dynamic, data-driven UIs

**Used For**:
- Debug menus
- Editor tools
- HUD (Health, ammo, minimap)
- Developer consoles
- Lightweight overlays

### Modern Approach: Hybrid

**Use both systems in same game**:

```cpp
void gameLoop() {
    while (running) {
        // Retained Mode: Complex menus
        if (gameState == MAIN_MENU) {
            mainMenu.update();
            mainMenu.render();
        }

        // Immediate Mode: In-game HUD
        else if (gameState == PLAYING) {
            // HUD defined every frame
            ImGui::SetNextWindowPos({10, 10});
            ImGui::Begin("HUD", nullptr, ImGuiWindowFlags_NoTitleBar);
            ImGui::Text("Health: %d / %d", player.health, player.maxHealth);
            ImGui::ProgressBar(player.health / (float)player.maxHealth);
            ImGui::Text("Ammo: %d", player.ammo);
            ImGui::End();

            // Debug overlay
            if (showDebug) {
                ImGui::Begin("Debug");
                ImGui::Text("FPS: %.1f", fps);
                ImGui::Text("Entities: %d", entityCount);
                ImGui::Checkbox("Show Colliders", &showColliders);
                ImGui::End();
            }
        }
    }
}
```

### UI Integration with Game Loop

**UI Update Happens AFTER Game Logic**:

```cpp
// Game loop order
void update(float dt) {
    // 1. Game logic updates
    updatePlayer(dt);
    updateEnemies(dt);
    updateProjectiles(dt);

    // 2. UI reads game state (NOT before!)
    updateUI(dt);  // UI reflects current game state
}
```

**Why?** UI displays the **result** of game logic, not the input to it.

**Example: Health Bar**:
```cpp
// WRONG: UI updates before game logic
void wrongUpdate() {
    updateHealthBar();  // Reads player.health (old value!)
    updatePlayer();     // Player takes damage (new value)
    // Health bar shows OLD health for one frame!
}

// CORRECT: UI updates after game logic
void correctUpdate() {
    updatePlayer();     // Player takes damage (new value)
    updateHealthBar();  // Reads player.health (current value!)
    // Health bar always shows current health
}
```

### UI in ECS

**UI as Components**:

```cpp
// UI components
struct UIElement {
    Vector2 position;
    Vector2 size;
    int layer;  // Render order
};

struct UIButton {
    std::function<void()> onClick;
    bool isHovered;
    bool isPressed;
};

struct UIText {
    std::string text;
    FontID font;
    Color color;
};

struct UIHealthBar {
    EntityID targetEntity;  // Which entity's health to display
    float fillPercentage;
};

// Create UI entity
Entity healthBarUI = registry.create();
registry.add<UIElement>(healthBarUI, {{10, 10}, {200, 30}, 0});
registry.add<UIHealthBar>(healthBarUI, {playerEntity, 1.0f});

// UI System
class UIHealthBarSystem : public System {
public:
    void update(float dt) override {
        for (auto [entity, healthBar, uiElement] : registry.view<UIHealthBar, UIElement>()) {
            // Read target entity's health
            if (Health* health = registry.get<Health>(healthBar.targetEntity)) {
                healthBar.fillPercentage = health->current / health->max;
            }
        }
    }
};

// Render system
class UIRenderSystem : public System {
public:
    void render() override {
        // Sort by layer
        auto entities = getSortedUIEntities();

        for (Entity entity : entities) {
            if (UIHealthBar* bar = registry.get<UIHealthBar>(entity)) {
                UIElement* elem = registry.get<UIElement>(entity);

                // Draw background
                drawRect(elem->position, elem->size, GRAY);

                // Draw fill
                Vector2 fillSize = {elem->size.x * bar->fillPercentage, elem->size.y};
                drawRect(elem->position, fillSize, RED);
            }
        }
    }
};
```

---

## Collision Detection

### The Two-Phase Approach

Collision detection is expensive (O(n²) for naive implementation). Solution: **Broad Phase** + **Narrow Phase**.

#### Phase 1: Broad Phase (Spatial Partitioning)

**Goal**: Quickly eliminate pairs that **cannot** collide

**Techniques**:

1. **Grid / Spatial Hash**
2. **Quadtree (2D) / Octree (3D)**
3. **Sweep and Prune**

##### Grid-Based Broad Phase

```cpp
class SpatialGrid {
    static const int CELL_SIZE = 50;
    std::unordered_map<Vector2Int, std::vector<Entity>> cells;

public:
    void insert(Entity entity, Vector2 position, float radius) {
        // Find which cells this entity occupies
        int minX = (int)((position.x - radius) / CELL_SIZE);
        int maxX = (int)((position.x + radius) / CELL_SIZE);
        int minY = (int)((position.y - radius) / CELL_SIZE);
        int maxY = (int)((position.y + radius) / CELL_SIZE);

        // Add to all overlapping cells
        for (int x = minX; x <= maxX; x++) {
            for (int y = minY; y <= maxY; y++) {
                cells[{x, y}].push_back(entity);
            }
        }
    }

    std::vector<std::pair<Entity, Entity>> getPotentialCollisions() {
        std::vector<std::pair<Entity, Entity>> pairs;
        std::set<std::pair<Entity, Entity>> checked;  // Avoid duplicates

        for (auto& [cellPos, entities] : cells) {
            // Check all pairs within this cell
            for (size_t i = 0; i < entities.size(); i++) {
                for (size_t j = i + 1; j < entities.size(); j++) {
                    auto pair = std::make_pair(
                        std::min(entities[i], entities[j]),
                        std::max(entities[i], entities[j])
                    );

                    if (!checked.contains(pair)) {
                        pairs.push_back(pair);
                        checked.insert(pair);
                    }
                }
            }
        }

        return pairs;
    }

    void clear() {
        cells.clear();
    }
};

// Usage in game loop
void updateCollisions() {
    // Rebuild grid every frame
    grid.clear();

    for (auto [entity, pos, collider] : registry.view<Position, CircleCollider>()) {
        grid.insert(entity, {pos.x, pos.y}, collider.radius);
    }

    // Get potential collision pairs (BROAD PHASE)
    auto pairs = grid.getPotentialCollisions();

    // Check actual collisions (NARROW PHASE)
    for (auto [a, b] : pairs) {
        if (checkCollision(a, b)) {
            resolveCollision(a, b);
        }
    }
}
```

**Complexity**:
- Naive: O(n²) comparisons for n objects
- Grid: O(n) to build, O(k) for potential pairs (k << n²)

##### Quadtree (2D)

```cpp
class Quadtree {
    static const int MAX_OBJECTS = 4;
    static const int MAX_LEVELS = 5;

    int level;
    std::vector<Entity> objects;
    Rect bounds;
    std::unique_ptr<Quadtree> children[4];  // NW, NE, SW, SE

public:
    Quadtree(int level, Rect bounds) : level(level), bounds(bounds) {}

    void insert(Entity entity, Rect rect) {
        // If we have children, try to insert into them
        if (children[0] != nullptr) {
            int index = getIndex(rect);
            if (index != -1) {
                children[index]->insert(entity, rect);
                return;
            }
        }

        // Add to this node
        objects.push_back(entity);

        // Split if needed
        if (objects.size() > MAX_OBJECTS && level < MAX_LEVELS) {
            if (children[0] == nullptr) {
                split();
            }

            // Redistribute objects to children
            auto it = objects.begin();
            while (it != objects.end()) {
                int index = getIndex(getRect(*it));
                if (index != -1) {
                    children[index]->insert(*it, getRect(*it));
                    it = objects.erase(it);
                } else {
                    ++it;
                }
            }
        }
    }

    std::vector<Entity> retrieve(Rect rect) {
        std::vector<Entity> result = objects;

        if (children[0] != nullptr) {
            int index = getIndex(rect);
            if (index != -1) {
                auto childObjects = children[index]->retrieve(rect);
                result.insert(result.end(), childObjects.begin(), childObjects.end());
            } else {
                // Object spans multiple quadrants
                for (int i = 0; i < 4; i++) {
                    auto childObjects = children[i]->retrieve(rect);
                    result.insert(result.end(), childObjects.begin(), childObjects.end());
                }
            }
        }

        return result;
    }

private:
    void split() {
        float subWidth = bounds.width / 2.0f;
        float subHeight = bounds.height / 2.0f;
        float x = bounds.x;
        float y = bounds.y;

        children[0] = std::make_unique<Quadtree>(level + 1, Rect{x, y, subWidth, subHeight});  // NW
        children[1] = std::make_unique<Quadtree>(level + 1, Rect{x + subWidth, y, subWidth, subHeight});  // NE
        children[2] = std::make_unique<Quadtree>(level + 1, Rect{x, y + subHeight, subWidth, subHeight});  // SW
        children[3] = std::make_unique<Quadtree>(level + 1, Rect{x + subWidth, y + subHeight, subWidth, subHeight});  // SE
    }

    int getIndex(Rect rect) {
        int index = -1;
        float verticalMidpoint = bounds.x + bounds.width / 2.0f;
        float horizontalMidpoint = bounds.y + bounds.height / 2.0f;

        bool inTop = rect.y < horizontalMidpoint && rect.y + rect.height < horizontalMidpoint;
        bool inBottom = rect.y > horizontalMidpoint;
        bool inLeft = rect.x < verticalMidpoint && rect.x + rect.width < verticalMidpoint;
        bool inRight = rect.x > verticalMidpoint;

        if (inLeft) {
            if (inTop) index = 0;  // NW
            else if (inBottom) index = 2;  // SW
        } else if (inRight) {
            if (inTop) index = 1;  // NE
            else if (inBottom) index = 3;  // SE
        }

        return index;
    }
};
```

**Complexity**: O(log n) average case for queries

#### Phase 2: Narrow Phase (Actual Collision Detection)

**Common collision shapes**:

```cpp
// Circle vs Circle
bool checkCircleCollision(Vector2 posA, float radiusA, Vector2 posB, float radiusB) {
    float dx = posB.x - posA.x;
    float dy = posB.y - posA.y;
    float distanceSquared = dx * dx + dy * dy;
    float radiusSum = radiusA + radiusB;

    return distanceSquared < radiusSum * radiusSum;
}

// AABB (Axis-Aligned Bounding Box) vs AABB
bool checkAABBCollision(Rect a, Rect b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Circle vs AABB
bool checkCircleAABBCollision(Vector2 circlePos, float radius, Rect box) {
    // Find closest point on box to circle
    float closestX = std::clamp(circlePos.x, box.x, box.x + box.width);
    float closestY = std::clamp(circlePos.y, box.y, box.y + box.height);

    // Distance from circle to closest point
    float dx = circlePos.x - closestX;
    float dy = circlePos.y - closestY;
    float distanceSquared = dx * dx + dy * dy;

    return distanceSquared < radius * radius;
}
```

### Collision Resolution

```cpp
// Simple impulse-based resolution for circles
void resolveCircleCollision(Entity a, Entity b) {
    Position* posA = registry.get<Position>(a);
    Position* posB = registry.get<Position>(b);
    Velocity* velA = registry.get<Velocity>(a);
    Velocity* velB = registry.get<Velocity>(b);
    CircleCollider* collA = registry.get<CircleCollider>(a);
    CircleCollider* collB = registry.get<CircleCollider>(b);

    // Collision normal (from A to B)
    Vector2 normal = {posB->x - posA->x, posB->y - posA->y};
    float distance = std::sqrt(normal.x * normal.x + normal.y * normal.y);
    normal.x /= distance;
    normal.y /= distance;

    // Separate objects
    float overlap = (collA->radius + collB->radius) - distance;
    posA->x -= normal.x * overlap * 0.5f;
    posA->y -= normal.y * overlap * 0.5f;
    posB->x += normal.x * overlap * 0.5f;
    posB->y += normal.y * overlap * 0.5f;

    // Calculate relative velocity
    Vector2 relativeVel = {velB->dx - velA->dx, velB->dy - velA->dy};
    float velocityAlongNormal = relativeVel.x * normal.x + relativeVel.y * normal.y;

    // Don't resolve if velocities are separating
    if (velocityAlongNormal > 0) return;

    // Calculate impulse
    float restitution = 0.8f;  // Bounciness
    float impulse = -(1.0f + restitution) * velocityAlongNormal;
    impulse /= 2.0f;  // Two objects of equal mass

    // Apply impulse
    velA->dx -= impulse * normal.x;
    velA->dy -= impulse * normal.y;
    velB->dx += impulse * normal.x;
    velB->dy += impulse * normal.y;
}
```

### Collision Callbacks

```cpp
// Component for collision events
struct CollisionListener {
    std::function<void(Entity other)> onCollisionEnter;
    std::function<void(Entity other)> onCollisionStay;
    std::function<void(Entity other)> onCollisionExit;

    std::set<Entity> currentCollisions;
    std::set<Entity> previousCollisions;
};

// Collision system with callbacks
class CollisionSystem : public System {
public:
    void update(float dt) override {
        // Broad phase
        auto potentialPairs = broadPhase();

        // Track current frame collisions
        std::set<std::pair<Entity, Entity>> currentCollisions;

        // Narrow phase
        for (auto [a, b] : potentialPairs) {
            if (checkCollision(a, b)) {
                currentCollisions.insert({a, b});
                resolveCollision(a, b);

                // Trigger callbacks
                triggerCollisionEvent(a, b, currentCollisions);
            }
        }

        // Update previous collisions
        for (auto [entity, listener] : registry.view<CollisionListener>()) {
            listener.previousCollisions = listener.currentCollisions;
            listener.currentCollisions.clear();
        }
    }

private:
    void triggerCollisionEvent(Entity a, Entity b, const std::set<std::pair<Entity, Entity>>& current) {
        auto pair = std::make_pair(std::min(a, b), std::max(a, b));

        if (CollisionListener* listener = registry.get<CollisionListener>(a)) {
            bool wasColliding = listener->previousCollisions.contains(b);
            bool isColliding = true;

            listener->currentCollisions.insert(b);

            if (!wasColliding && isColliding) {
                // Enter
                if (listener->onCollisionEnter) {
                    listener->onCollisionEnter(b);
                }
            } else if (wasColliding && isColliding) {
                // Stay
                if (listener->onCollisionStay) {
                    listener->onCollisionStay(b);
                }
            }
        }

        // Same for entity b...
    }
};

// Usage
Entity player = registry.create();
registry.add<CollisionListener>(player, {
    .onCollisionEnter = [](Entity other) {
        if (registry.has<Enemy>(other)) {
            takeDamage(10);
            playSound(HURT_SOUND);
        }
        if (registry.has<Coin>(other)) {
            collectCoin(other);
            playSound(COIN_SOUND);
        }
    }
});
```

---

## Character Animation Systems

### The Three Pillars

1. **Skeletal Animation** - Bone hierarchy deforms mesh
2. **State Machines** - Manage which animation plays when
3. **Blend Trees** - Smooth transitions between animations

### 1. Skeletal Animation

```cpp
// Bone (joint in skeleton hierarchy)
struct Bone {
    std::string name;
    Matrix4x4 localTransform;      // Transform relative to parent
    Matrix4x4 worldTransform;      // Final world transform
    int parentIndex;               // -1 for root
};

// Skeleton
struct Skeleton {
    std::vector<Bone> bones;
    std::unordered_map<std::string, int> boneNameToIndex;

    void updateWorldTransforms() {
        // Root bones first
        for (size_t i = 0; i < bones.size(); i++) {
            if (bones[i].parentIndex == -1) {
                bones[i].worldTransform = bones[i].localTransform;
            } else {
                Matrix4x4 parentWorld = bones[bones[i].parentIndex].worldTransform;
                bones[i].worldTransform = parentWorld * bones[i].localTransform;
            }
        }
    }
};

// Animation clip (keyframes)
struct AnimationClip {
    std::string name;
    float duration;

    struct BoneAnimation {
        std::string boneName;
        std::vector<KeyframePosition> positions;
        std::vector<KeyframeRotation> rotations;
        std::vector<KeyframeScale> scales;
    };

    std::vector<BoneAnimation> boneAnimations;
};

struct KeyframePosition {
    float time;
    Vector3 position;
};

struct KeyframeRotation {
    float time;
    Quaternion rotation;
};

struct KeyframeScale {
    float time;
    Vector3 scale;
};

// Animation player
class AnimationPlayer {
    Skeleton* skeleton;
    AnimationClip* currentClip;
    float currentTime = 0.0f;
    bool looping = true;

public:
    void play(AnimationClip* clip, bool loop = true) {
        currentClip = clip;
        currentTime = 0.0f;
        looping = loop;
    }

    void update(float dt) {
        if (!currentClip) return;

        currentTime += dt;

        if (currentTime > currentClip->duration) {
            if (looping) {
                currentTime = std::fmod(currentTime, currentClip->duration);
            } else {
                currentTime = currentClip->duration;
                return;  // Stop
            }
        }

        // Apply animation to skeleton
        for (auto& boneAnim : currentClip->boneAnimations) {
            int boneIndex = skeleton->boneNameToIndex[boneAnim.boneName];

            // Interpolate position
            Vector3 position = interpolatePosition(boneAnim.positions, currentTime);

            // Interpolate rotation
            Quaternion rotation = interpolateRotation(boneAnim.rotations, currentTime);

            // Interpolate scale
            Vector3 scale = interpolateScale(boneAnim.scales, currentTime);

            // Build transform matrix
            skeleton->bones[boneIndex].localTransform =
                Matrix4x4::TRS(position, rotation, scale);
        }

        // Update hierarchy
        skeleton->updateWorldTransforms();
    }

private:
    Vector3 interpolatePosition(const std::vector<KeyframePosition>& keyframes, float time) {
        // Find surrounding keyframes
        for (size_t i = 0; i < keyframes.size() - 1; i++) {
            if (time >= keyframes[i].time && time < keyframes[i + 1].time) {
                float t = (time - keyframes[i].time) /
                         (keyframes[i + 1].time - keyframes[i].time);

                // Linear interpolation
                return Vector3::lerp(keyframes[i].position, keyframes[i + 1].position, t);
            }
        }

        return keyframes.back().position;
    }

    Quaternion interpolateRotation(const std::vector<KeyframeRotation>& keyframes, float time) {
        for (size_t i = 0; i < keyframes.size() - 1; i++) {
            if (time >= keyframes[i].time && time < keyframes[i + 1].time) {
                float t = (time - keyframes[i].time) /
                         (keyframes[i + 1].time - keyframes[i].time);

                // Spherical linear interpolation (smooth rotation)
                return Quaternion::slerp(keyframes[i].rotation, keyframes[i + 1].rotation, t);
            }
        }

        return keyframes.back().rotation;
    }

    Vector3 interpolateScale(const std::vector<KeyframeScale>& keyframes, float time) {
        for (size_t i = 0; i < keyframes.size() - 1; i++) {
            if (time >= keyframes[i].time && time < keyframes[i + 1].time) {
                float t = (time - keyframes[i].time) /
                         (keyframes[i + 1].time - keyframes[i].time);

                return Vector3::lerp(keyframes[i].scale, keyframes[i + 1].scale, t);
            }
        }

        return keyframes.back().scale;
    }
};
```

### 2. Animation State Machine

```cpp
// Animation state
struct AnimationState {
    std::string name;
    AnimationClip* clip;
    bool looping;
    float speed;
};

// Transition condition
struct Transition {
    std::string fromState;
    std::string toState;
    std::function<bool()> condition;  // When to transition
    float blendDuration;              // How long to blend
};

// State machine
class AnimationStateMachine {
    std::unordered_map<std::string, AnimationState> states;
    std::vector<Transition> transitions;

    std::string currentState;
    std::string previousState;
    float transitionTime = 0.0f;
    float transitionDuration = 0.0f;
    bool isTransitioning = false;

    AnimationPlayer player;

public:
    void addState(const std::string& name, AnimationClip* clip, bool looping = true, float speed = 1.0f) {
        states[name] = {name, clip, looping, speed};
    }

    void addTransition(const std::string& from, const std::string& to,
                      std::function<bool()> condition, float blendDuration = 0.2f) {
        transitions.push_back({from, to, condition, blendDuration});
    }

    void start(const std::string& initialState) {
        currentState = initialState;
        auto& state = states[currentState];
        player.play(state.clip, state.looping);
    }

    void update(float dt) {
        // Check for transitions
        if (!isTransitioning) {
            for (auto& transition : transitions) {
                if (transition.fromState == currentState && transition.condition()) {
                    // Start transition
                    previousState = currentState;
                    currentState = transition.toState;
                    transitionTime = 0.0f;
                    transitionDuration = transition.blendDuration;
                    isTransitioning = true;
                    break;
                }
            }
        }

        // Update transition
        if (isTransitioning) {
            transitionTime += dt;

            if (transitionTime >= transitionDuration) {
                // Transition complete
                isTransitioning = false;
                auto& state = states[currentState];
                player.play(state.clip, state.looping);
            } else {
                // Blend between animations
                float blendFactor = transitionTime / transitionDuration;
                blendAnimations(previousState, currentState, blendFactor);
            }
        } else {
            // Normal playback
            player.update(dt * states[currentState].speed);
        }
    }

private:
    void blendAnimations(const std::string& from, const std::string& to, float t) {
        // Sample both animations and blend bone transforms
        // (Simplified - actual implementation more complex)
        auto& fromClip = states[from].clip;
        auto& toClip = states[to].clip;

        // For each bone, blend its transform
        // transform = lerp(fromTransform, toTransform, t)
    }
};

// Example usage
AnimationStateMachine characterFSM;

// Add states
characterFSM.addState("idle", idleClip, true);
characterFSM.addState("walk", walkClip, true);
characterFSM.addState("run", runClip, true);
characterFSM.addState("jump", jumpClip, false);
characterFSM.addState("attack", attackClip, false);

// Add transitions
characterFSM.addTransition("idle", "walk",
    []() { return Input::getAxisRaw("Horizontal") != 0 && !Input::isKeyDown(SHIFT); });

characterFSM.addTransition("walk", "run",
    []() { return Input::isKeyDown(SHIFT); });

characterFSM.addTransition("walk", "idle",
    []() { return Input::getAxisRaw("Horizontal") == 0; });

characterFSM.addTransition("idle", "jump",
    []() { return Input::isKeyPressed(SPACE) && isGrounded(); });

characterFSM.addTransition("jump", "idle",
    []() { return isGrounded(); });

// Any state can transition to attack
for (auto& stateName : {"idle", "walk", "run"}) {
    characterFSM.addTransition(stateName, "attack",
        []() { return Input::isMouseButtonPressed(LEFT); });
}

characterFSM.addTransition("attack", "idle",
    []() { return true; });  // Attack animation finishes

// Start
characterFSM.start("idle");

// Game loop
void update(float dt) {
    characterFSM.update(dt);
}
```

### 3. Blend Trees

**1D Blend Tree** (e.g., speed):

```cpp
// Blend between walk and run based on speed
class BlendTree1D {
    struct BlendNode {
        AnimationClip* clip;
        float threshold;  // Parameter value for this animation
    };

    std::vector<BlendNode> nodes;
    float parameter;  // Current blend parameter (e.g., speed)

public:
    void addNode(AnimationClip* clip, float threshold) {
        nodes.push_back({clip, threshold});
        // Sort by threshold
        std::sort(nodes.begin(), nodes.end(),
            [](const BlendNode& a, const BlendNode& b) {
                return a.threshold < b.threshold;
            });
    }

    void setParameter(float value) {
        parameter = value;
    }

    Pose sample(float time) {
        // Find surrounding nodes
        for (size_t i = 0; i < nodes.size() - 1; i++) {
            if (parameter >= nodes[i].threshold && parameter < nodes[i + 1].threshold) {
                // Blend between nodes[i] and nodes[i+1]
                float t = (parameter - nodes[i].threshold) /
                         (nodes[i + 1].threshold - nodes[i].threshold);

                Pose pose1 = sampleAnimation(nodes[i].clip, time);
                Pose pose2 = sampleAnimation(nodes[i + 1].clip, time);

                return Pose::blend(pose1, pose2, t);
            }
        }

        // Outside range, use first or last
        if (parameter < nodes[0].threshold) {
            return sampleAnimation(nodes[0].clip, time);
        } else {
            return sampleAnimation(nodes.back().clip, time);
        }
    }
};

// Usage
BlendTree1D movementBlend;
movementBlend.addNode(idleClip, 0.0f);     // Speed 0 = idle
movementBlend.addNode(walkClip, 2.0f);     // Speed 2 = walk
movementBlend.addNode(runClip, 5.0f);      // Speed 5 = run

// Update
float currentSpeed = velocity.length();
movementBlend.setParameter(currentSpeed);  // Blends automatically!
```

**2D Blend Tree** (e.g., strafe movement):

```cpp
// Blend between 9 animations based on XY input
class BlendTree2D {
    struct BlendNode {
        AnimationClip* clip;
        Vector2 position;  // Position in blend space
    };

    std::vector<BlendNode> nodes;
    Vector2 parameter;  // 2D blend parameter

public:
    void addNode(AnimationClip* clip, Vector2 position) {
        nodes.push_back({clip, position});
    }

    void setParameter(Vector2 value) {
        parameter = value;
    }

    Pose sample(float time) {
        // Find closest triangle of nodes
        // Use barycentric interpolation
        // (Simplified - actual implementation uses Delaunay triangulation)

        // For now, just blend with 3 closest nodes
        std::vector<std::pair<float, int>> distances;
        for (size_t i = 0; i < nodes.size(); i++) {
            float dist = Vector2::distance(parameter, nodes[i].position);
            distances.push_back({dist, i});
        }

        std::sort(distances.begin(), distances.end());

        // Blend top 3
        Pose pose1 = sampleAnimation(nodes[distances[0].second].clip, time);
        Pose pose2 = sampleAnimation(nodes[distances[1].second].clip, time);
        Pose pose3 = sampleAnimation(nodes[distances[2].second].clip, time);

        // Weight by inverse distance
        float w1 = 1.0f / (distances[0].first + 0.001f);
        float w2 = 1.0f / (distances[1].first + 0.001f);
        float w3 = 1.0f / (distances[2].first + 0.001f);
        float total = w1 + w2 + w3;
        w1 /= total; w2 /= total; w3 /= total;

        return Pose::blend(pose1, pose2, pose3, w1, w2, w3);
    }
};

// Usage: 8-directional movement
BlendTree2D strafeBlend;
strafeBlend.addNode(idleClip,         {0, 0});    // Center
strafeBlend.addNode(walkForwardClip,  {0, 1});    // Forward
strafeBlend.addNode(walkBackClip,     {0, -1});   // Back
strafeBlend.addNode(strafeLeftClip,   {-1, 0});   // Left
strafeBlend.addNode(strafeRightClip,  {1, 0});    // Right
strafeBlend.addNode(walkFwdLeftClip,  {-1, 1});   // Forward-left
strafeBlend.addNode(walkFwdRightClip, {1, 1});    // Forward-right
strafeBlend.addNode(walkBackLeftClip, {-1, -1});  // Back-left
strafeBlend.addNode(walkBackRightClip,{1, -1});   // Back-right

// Update based on input
Vector2 inputDir = {Input::getAxis("Horizontal"), Input::getAxis("Vertical")};
strafeBlend.setParameter(inputDir);  // Smooth 360° movement!
```

---

[Continuing in next message due to length...]

## Integration: How They Work Together

### The Complete Update Cycle

Here's how UI, Collision, and Animation integrate in the game loop:

```cpp
class Game {
    // Core systems
    Registry registry;
    SpatialGrid collisionGrid;
    
    // Subsystems
    AnimationSystem animationSystem;
    CollisionSystem collisionSystem;
    UISystem uiSystem;
    RenderSystem renderSystem;

public:
    void gameLoop() {
        float accumulator = 0.0f;
        const float FIXED_TIMESTEP = 1.0f / 60.0f;

        while (!shouldQuit) {
            float deltaTime = getDeltaTime();
            accumulator += deltaTime;

            // ==================================================
            // INPUT (Highest Priority)
            // ==================================================
            pollEvents();

            // UI input first (if UI active, block game input)
            bool uiHandledInput = uiSystem.processInput();

            if (!uiHandledInput) {
                // Game input
                processGameInput();
            }

            // ==================================================
            // FIXED UPDATE (Physics/Collision)
            // ==================================================
            while (accumulator >= FIXED_TIMESTEP) {
                // Character controllers (convert input to forces)
                updateCharacterControllers(FIXED_TIMESTEP);

                // Physics
                updatePhysics(FIXED_TIMESTEP);

                // COLLISION DETECTION
                collisionSystem.update(FIXED_TIMESTEP);
                // 1. Broad phase (spatial grid/quadtree)
                // 2. Narrow phase (actual collision checks)
                // 3. Collision callbacks (trigger events)
                // 4. Resolution (separate/bounce)

                // Game logic (may trigger animations)
                updateGameLogic(FIXED_TIMESTEP);

                accumulator -= FIXED_TIMESTEP;
            }

            // ==================================================
            // VARIABLE UPDATE (Animation/AI/Particles)
            // ==================================================
            
            // ANIMATION UPDATE
            animationSystem.update(deltaTime);
            // 1. Update state machines (check transitions)
            // 2. Sample animation clips
            // 3. Update blend trees
            // 4. Apply to skeletons
            // 5. Calculate final bone transforms

            // AI updates
            updateAI(deltaTime);

            // Particles
            updateParticles(deltaTime);

            // Audio
            updateAudio(deltaTime);

            // Camera (follows player, updated after player moves)
            updateCameras(deltaTime);

            // ==================================================
            // UI UPDATE (After game state changes)
            // ==================================================
            uiSystem.update(deltaTime);
            // 1. Read current game state
            // 2. Update UI elements (health bars, ammo counts, etc.)
            // 3. Handle animations/transitions
            // 4. Process UI logic

            // ==================================================
            // RENDERING
            // ==================================================
            float interpolation = accumulator / FIXED_TIMESTEP;

            beginFrame();

            // Render 3D world
            renderSystem.render(interpolation);
            // 1. Frustum culling
            // 2. Render opaque geometry
            // 3. Render transparent geometry (sorted)
            // 4. Render particles
            // 5. Render debug (collision shapes if enabled)

            // Render UI (on top of everything)
            uiSystem.render();

            endFrame();
            swapBuffers();
        }
    }
};
```

### Example: Player Takes Damage

Let's trace what happens when a player collides with an enemy:

```cpp
// Frame N: Player and Enemy moving
void update(float dt) {
    // 1. PHYSICS UPDATE (Fixed timestep)
    updatePhysics(dt);
    // Player: pos (100, 100) → (105, 100)
    // Enemy:  pos (108, 100) → (103, 100)

    // 2. COLLISION DETECTION
    collisionSystem.update(dt);
    
    // Broad Phase: Both in same grid cell → potential collision
    // Narrow Phase: Distance = 2, Radii = 5+5 = 10 → COLLISION!
    
    // Collision callback triggered:
    playerCollisionListener.onCollisionEnter(enemyEntity);
    
    // Inside callback:
    void onHitByEnemy(Entity enemy) {
        // Reduce health
        player.health -= 10;  // 100 → 90

        // Trigger hurt animation
        characterFSM.triggerAnimation("hurt");

        // Play sound
        playSound(HURT_SOUND);

        // Visual feedback (flash red)
        player.hurtTimer = 0.5f;
    }

    // 3. ANIMATION UPDATE (Variable timestep)
    animationSystem.update(dt);
    
    // State machine detects "hurt" trigger
    // Transitions: idle → hurt
    // Starts playing hurt animation (0.3s duration)

    // 4. UI UPDATE
    uiSystem.update(dt);
    
    // Health bar component detects health change
    healthBar.targetHealth = 90;  // Was 100
    healthBar.animateTransition(0.3f);  // Smooth decrease

    // 5. RENDERING
    renderSystem.render();
    
    // Player rendered with hurt animation pose
    // Player material flashed red (hurtTimer > 0)
    // Health bar shows decreasing from 100 → 90
    // Particle effect spawned at impact point
}
```

**Timeline Visualization**:
```
Frame N:
├─ Physics: Player moves to (105, 100)
├─ Collision: Detects player-enemy collision
│   └─ Callback: player.health = 90, trigger "hurt"
├─ Animation: State machine → "hurt" animation (frame 0)
│   └─ Skeleton updated with hurt pose
├─ UI: Health bar detects change, starts animation
└─ Render: Draw hurt pose, red flash, health bar at 100

Frame N+1:
├─ Physics: Normal update
├─ Collision: Still colliding (or separated)
├─ Animation: "hurt" animation (frame 1/18)
├─ UI: Health bar lerp 100 → 93.33
└─ Render: Hurt animation continuing, bar animating

Frame N+2:
├─ Animation: "hurt" animation (frame 2/18)
├─ UI: Health bar lerp 93.33 → 91.67
└─ Render: ...

Frame N+18:
├─ Animation: "hurt" animation complete → back to "idle"
├─ UI: Health bar reaches 90 (animation complete)
└─ Render: Normal idle pose, health bar at 90
```

---

## ECS Integration

### Components for Each System

```cpp
// ============================================
// UI COMPONENTS
// ============================================
struct UIElement {
    Vector2 position;
    Vector2 size;
    int layer;
    bool visible;
};

struct UIButton {
    std::function<void()> onClick;
    bool isHovered;
    bool isPressed;
};

struct UIHealthBar {
    EntityID targetEntity;
    float currentDisplay;   // Animated value
    float targetDisplay;    // Actual value
    float animationSpeed;
};

struct UIText {
    std::string text;
    FontID font;
    Color color;
};

// ============================================
// COLLISION COMPONENTS
// ============================================
struct CircleCollider {
    float radius;
    Vector2 offset;     // Offset from position
    bool isTrigger;     // Doesn't resolve, just detects
};

struct BoxCollider {
    Vector2 size;
    Vector2 offset;
    bool isTrigger;
};

struct RigidBody {
    Vector2 velocity;
    float mass;
    float drag;
    bool isKinematic;   // Affected by physics?
};

struct CollisionListener {
    std::function<void(Entity)> onCollisionEnter;
    std::function<void(Entity)> onCollisionStay;
    std::function<void(Entity)> onCollisionExit;
    std::set<Entity> currentCollisions;
};

// ============================================
// ANIMATION COMPONENTS
// ============================================
struct SkeletalMesh {
    MeshID mesh;
    Skeleton* skeleton;
    std::vector<Matrix4x4> boneMatrices;  // For GPU
};

struct Animator {
    AnimationStateMachine* stateMachine;
    std::unordered_map<std::string, float> parameters;  // Blend tree params
};

struct AnimationState {
    std::string currentState;
    float normalizedTime;  // 0.0 to 1.0
    bool isTransitioning;
};
```

### Systems

```cpp
// ============================================
// COLLISION SYSTEM
// ============================================
class CollisionSystem : public System {
    SpatialGrid grid;

public:
    void update(float dt) override {
        // Rebuild spatial grid
        grid.clear();
        for (auto [entity, pos, collider] : registry.view<Position, CircleCollider>()) {
            grid.insert(entity, {pos.x, pos.y}, collider.radius);
        }

        // Broad phase
        auto pairs = grid.getPotentialCollisions();

        // Narrow phase
        for (auto [a, b] : pairs) {
            if (checkCollision(a, b)) {
                // Trigger callbacks
                handleCollision(a, b);

                // Resolve (if not trigger)
                if (!isTrigger(a) && !isTrigger(b)) {
                    resolveCollision(a, b);
                }
            }
        }
    }

private:
    bool checkCollision(Entity a, Entity b) {
        Position* posA = registry.get<Position>(a);
        Position* posB = registry.get<Position>(b);
        CircleCollider* collA = registry.get<CircleCollider>(a);
        CircleCollider* collB = registry.get<CircleCollider>(b);

        if (!posA || !posB || !collA || !collB) return false;

        float dx = posB->x - posA->x;
        float dy = posB->y - posA->y;
        float dist = std::sqrt(dx*dx + dy*dy);

        return dist < (collA->radius + collB->radius);
    }

    void handleCollision(Entity a, Entity b) {
        if (CollisionListener* listener = registry.get<CollisionListener>(a)) {
            bool wasColliding = listener->currentCollisions.contains(b);

            if (!wasColliding) {
                listener->currentCollisions.insert(b);
                if (listener->onCollisionEnter) {
                    listener->onCollisionEnter(b);
                }
            } else {
                if (listener->onCollisionStay) {
                    listener->onCollisionStay(b);
                }
            }
        }
    }

    void resolveCollision(Entity a, Entity b) {
        // Implementation from earlier...
    }
};

// ============================================
// ANIMATION SYSTEM
// ============================================
class AnimationSystem : public System {
public:
    void update(float dt) override {
        // Update all animators
        for (auto [entity, animator, skelMesh] : 
             registry.view<Animator, SkeletalMesh>()) {
            
            // Update state machine
            animator.stateMachine->update(dt);

            // Get current pose from state machine
            Pose currentPose = animator.stateMachine->getCurrentPose();

            // Apply pose to skeleton
            applyPoseToSkeleton(skelMesh.skeleton, currentPose);

            // Calculate final bone matrices for rendering
            updateBoneMatrices(skelMesh);
        }
    }

private:
    void applyPoseToSkeleton(Skeleton* skeleton, const Pose& pose) {
        for (size_t i = 0; i < skeleton->bones.size(); i++) {
            skeleton->bones[i].localTransform = pose.boneTransforms[i];
        }
        skeleton->updateWorldTransforms();
    }

    void updateBoneMatrices(SkeletalMesh& mesh) {
        mesh.boneMatrices.resize(mesh.skeleton->bones.size());

        for (size_t i = 0; i < mesh.skeleton->bones.size(); i++) {
            // Bone matrix = worldTransform * inverseBindPose
            mesh.boneMatrices[i] = 
                mesh.skeleton->bones[i].worldTransform *
                mesh.skeleton->bones[i].inverseBindPose;
        }
    }
};

// ============================================
// UI SYSTEM
// ============================================
class UISystem : public System {
public:
    void update(float dt) override {
        // Update health bars
        for (auto [entity, healthBar, uiElem] : 
             registry.view<UIHealthBar, UIElement>()) {
            
            // Get target entity's health
            if (Health* health = registry.get<Health>(healthBar.targetEntity)) {
                healthBar.targetDisplay = health->current / health->max;
            }

            // Animate towards target
            healthBar.currentDisplay = Math::lerp(
                healthBar.currentDisplay,
                healthBar.targetDisplay,
                dt * healthBar.animationSpeed
            );
        }

        // Update buttons
        for (auto [entity, button, uiElem] : 
             registry.view<UIButton, UIElement>()) {
            
            Vector2 mousePos = Input::getMousePosition();

            bool wasHovered = button.isHovered;
            button.isHovered = isPointInRect(mousePos, uiElem.position, uiElem.size);

            if (button.isHovered && Input::isMouseButtonDown(LEFT)) {
                button.isPressed = true;
            }

            if (button.isPressed && Input::isMouseButtonReleased(LEFT)) {
                button.isPressed = false;

                if (button.isHovered && button.onClick) {
                    button.onClick();  // Trigger callback
                }
            }
        }
    }

    void render() override {
        // Sort by layer
        auto uiEntities = getSortedByLayer();

        for (Entity entity : uiEntities) {
            if (UIElement* elem = registry.get<UIElement>(entity)) {
                if (!elem->visible) continue;

                if (UIButton* button = registry.get<UIButton>(entity)) {
                    renderButton(elem, button);
                }
                else if (UIHealthBar* bar = registry.get<UIHealthBar>(entity)) {
                    renderHealthBar(elem, bar);
                }
                else if (UIText* text = registry.get<UIText>(entity)) {
                    renderText(elem, text);
                }
            }
        }
    }

private:
    void renderHealthBar(UIElement* elem, UIHealthBar* bar) {
        // Background
        drawRect(elem->position, elem->size, Color{0.2f, 0.2f, 0.2f, 1.0f});

        // Fill (animated)
        Vector2 fillSize = {elem->size.x * bar->currentDisplay, elem->size.y};
        drawRect(elem->position, fillSize, Color{1.0f, 0.0f, 0.0f, 1.0f});

        // Border
        drawRectOutline(elem->position, elem->size, Color{1.0f, 1.0f, 1.0f, 1.0f});
    }
};
```

---

## Performance Optimization

### 1. Collision Optimization

**Problem**: Collision detection is O(n²) naive

**Solutions**:

```cpp
// BAD: Check every pair
for (int i = 0; i < entities.size(); i++) {
    for (int j = i + 1; j < entities.size(); j++) {
        if (checkCollision(entities[i], entities[j])) {
            resolveCollision(entities[i], entities[j]);
        }
    }
}
// 1000 entities = 499,500 checks! (0.5 million)

// GOOD: Spatial partitioning
SpatialGrid grid;
for (auto entity : entities) {
    grid.insert(entity);
}

auto pairs = grid.getPotentialCollisions();
for (auto [a, b] : pairs) {
    if (checkCollision(a, b)) {
        resolveCollision(a, b);
    }
}
// 1000 entities = ~5,000 checks (100x faster!)
```

**Benchmarks**:

| Entities | Naive (ms) | Grid (ms) | Quadtree (ms) |
|----------|------------|-----------|---------------|
| 100      | 0.5        | 0.1       | 0.15          |
| 500      | 12.5       | 0.8       | 1.2           |
| 1000     | 50.0       | 2.1       | 3.5           |
| 5000     | 1250.0     | 15.0      | 25.0          |

**Grid wins for uniformly distributed objects**
**Quadtree wins for clustered objects**

### 2. Animation Optimization

**Problem**: Skeletal animation is expensive (matrix math per bone per frame)

**Solutions**:

```cpp
// 1. LOD (Level of Detail)
void updateAnimations(float dt) {
    Vector3 cameraPos = camera.getPosition();

    for (auto [entity, animator, skelMesh, pos] : 
         registry.view<Animator, SkeletalMesh, Position>()) {
        
        float distance = Vector3::distance(cameraPos, {pos.x, pos.y, 0});

        if (distance < 10.0f) {
            // Close: Full skeleton (50 bones)
            animator.updateFullSkeleton(dt);
        }
        else if (distance < 30.0f) {
            // Medium: Update every other bone (25 bones)
            animator.updateReducedSkeleton(dt);
        }
        else if (distance < 100.0f) {
            // Far: Update only root bone (1 bone)
            animator.updateRootOnly(dt);
        }
        else {
            // Very far: Don't update at all (use last pose)
            continue;
        }
    }
}

// 2. Update rate reduction
void updateAnimations(float dt) {
    static float accumulator = 0.0f;
    accumulator += dt;

    // Far characters update at 15 FPS instead of 60 FPS
    if (accumulator >= 1.0f / 15.0f) {
        for (auto [entity, animator] : getFarCharacters()) {
            animator.update(accumulator);
        }
        accumulator = 0.0f;
    }

    // Close characters always update
    for (auto [entity, animator] : getCloseCharacters()) {
        animator.update(dt);
    }
}

// 3. Animation culling (don't update off-screen characters)
void updateAnimations(float dt) {
    Frustum cameraFrustum = camera.getFrustum();

    for (auto [entity, animator, pos] : 
         registry.view<Animator, Position>()) {
        
        if (!cameraFrustum.contains(pos)) {
            continue;  // Skip off-screen characters
        }

        animator.update(dt);
    }
}
```

**Benchmarks**:

| Characters | No Opt (ms) | LOD (ms) | Culling (ms) | Both (ms) |
|------------|-------------|----------|--------------|-----------|
| 100        | 5.0         | 2.0      | 3.0          | 1.2       |
| 500        | 25.0        | 8.0      | 12.0         | 4.5       |
| 1000       | 50.0        | 15.0     | 22.0         | 8.0       |

### 3. UI Optimization

**Problem**: UI rebuilding every frame (immediate mode) can be slow

**Solutions**:

```cpp
// 1. Dirty flag pattern (only update when needed)
struct UIHealthBar {
    EntityID targetEntity;
    float currentDisplay;
    float targetDisplay;
    bool isDirty;  // Needs redraw?
};

void updateHealthBars(float dt) {
    for (auto [entity, bar] : registry.view<UIHealthBar>()) {
        if (Health* health = registry.get<Health>(bar.targetEntity)) {
            float newTarget = health->current / health->max;

            if (newTarget != bar.targetDisplay) {
                bar.targetDisplay = newTarget;
                bar.isDirty = true;
            }
        }

        // Only animate if dirty
        if (bar.isDirty) {
            bar.currentDisplay = lerp(bar.currentDisplay, bar.targetDisplay, dt * 5.0f);

            if (abs(bar.currentDisplay - bar.targetDisplay) < 0.01f) {
                bar.currentDisplay = bar.targetDisplay;
                bar.isDirty = false;  // Done animating
            }
        }
    }
}

// 2. Texture atlas for UI (batch rendering)
class UIRenderer {
    TextureAtlas atlas;  // All UI elements in one texture

public:
    void renderBatch(const std::vector<Entity>& uiEntities) {
        // Start batch
        beginBatch(atlas.getTexture());

        for (Entity entity : uiEntities) {
            UIElement* elem = registry.get<UIElement>(entity);
            UISprite* sprite = registry.get<UISprite>(entity);

            // Add to batch (no draw call yet)
            addQuadToBatch(elem->position, elem->size, sprite->atlasRegion);
        }

        // Single draw call for all UI
        endBatch();
    }
};

// 3. Caching (ImGui optimization)
void renderUI() {
    // Cache static UI to render texture
    static RenderTexture cachedMenu;
    static bool menuDirty = true;

    if (menuDirty) {
        cachedMenu.beginRender();
        renderMainMenu();  // Complex UI
        cachedMenu.endRender();
        menuDirty = false;
    }

    // Just draw cached texture (fast!)
    drawTexture(cachedMenu);

    // Dynamic UI on top
    ImGui::Text("FPS: %.1f", fps);  // Updates every frame
}
```

---

## Complete Implementation Example

### Character with All Systems

```cpp
// Create a player character with UI, collision, and animation

void createPlayer(Registry& registry) {
    Entity player = registry.create();

    // Transform
    registry.add<Position>(player, {100.0f, 100.0f, 0.0f});
    registry.add<Rotation>(player, {0.0f, 0.0f, 0.0f});
    registry.add<Scale>(player, {1.0f, 1.0f, 1.0f});

    // Physics
    registry.add<RigidBody>(player, {
        .velocity = {0.0f, 0.0f},
        .mass = 1.0f,
        .drag = 5.0f,
        .isKinematic = false
    });

    // Collision
    registry.add<CircleCollider>(player, {
        .radius = 5.0f,
        .offset = {0.0f, 0.0f},
        .isTrigger = false
    });

    registry.add<CollisionListener>(player, {
        .onCollisionEnter = [player](Entity other) {
            if (registry.has<Enemy>(other)) {
                // Take damage
                Health* health = registry.get<Health>(player);
                health->current -= 10;

                // Trigger hurt animation
                Animator* anim = registry.get<Animator>(player);
                anim->stateMachine->setTrigger("hurt");

                // Play sound
                playSound(HURT_SOUND);

                // Knockback
                RigidBody* rb = registry.get<RigidBody>(player);
                Vector2 knockback = calculateKnockback(player, other);
                rb->velocity.x += knockback.x;
                rb->velocity.y += knockback.y;
            }
            else if (registry.has<Coin>(other)) {
                collectCoin(other);
                playSound(COIN_SOUND);
            }
        }
    });

    // Rendering
    registry.add<SkeletalMesh>(player, {
        .mesh = loadMesh("player.mesh"),
        .skeleton = loadSkeleton("player.skeleton")
    });

    // Animation
    AnimationStateMachine* fsm = new AnimationStateMachine();
    
    // States
    fsm->addState("idle", loadClip("idle.anim"), true);
    fsm->addState("walk", loadClip("walk.anim"), true);
    fsm->addState("run", loadClip("run.anim"), true);
    fsm->addState("jump", loadClip("jump.anim"), false);
    fsm->addState("hurt", loadClip("hurt.anim"), false);
    fsm->addState("attack", loadClip("attack.anim"), false);

    // Transitions
    fsm->addTransition("idle", "walk", []() {
        return Input::getMoveInput().length() > 0.1f && !Input::isShiftDown();
    });

    fsm->addTransition("walk", "run", []() {
        return Input::isShiftDown();
    });

    fsm->addTransition("*", "jump", []() {  // Any state
        return Input::isJumpPressed() && isGrounded();
    });

    fsm->addTransition("*", "hurt", []() {
        return false;  // Triggered manually from collision
    });

    fsm->start("idle");

    registry.add<Animator>(player, {
        .stateMachine = fsm
    });

    // Gameplay
    registry.add<Health>(player, {100.0f, 100.0f});
    registry.add<PlayerController>(player, {
        .moveSpeed = 10.0f,
        .jumpForce = 15.0f
    });

    // Tag
    registry.add<Player>(player, {});

    return player;
}

// Create UI for player
void createPlayerUI(Registry& registry, Entity player) {
    // Health bar
    Entity healthBarBG = registry.create();
    registry.add<UIElement>(healthBarBG, {
        .position = {10, 10},
        .size = {200, 30},
        .layer = 0,
        .visible = true
    });
    registry.add<UISprite>(healthBarBG, {
        .color = {0.2f, 0.2f, 0.2f, 1.0f}
    });

    Entity healthBarFill = registry.create();
    registry.add<UIElement>(healthBarFill, {
        .position = {10, 10},
        .size = {200, 30},
        .layer = 1,
        .visible = true
    });
    registry.add<UIHealthBar>(healthBarFill, {
        .targetEntity = player,
        .currentDisplay = 1.0f,
        .targetDisplay = 1.0f,
        .animationSpeed = 5.0f
    });

    // Coin counter
    Entity coinCounter = registry.create();
    registry.add<UIElement>(coinCounter, {
        .position = {10, 50},
        .size = {100, 30},
        .layer = 0,
        .visible = true
    });
    registry.add<UIText>(coinCounter, {
        .text = "Coins: 0",
        .font = loadFont("arial.ttf"),
        .color = {1.0f, 1.0f, 1.0f, 1.0f}
    });
}

// Main game loop
void gameLoop() {
    Registry registry;

    // Create systems
    CollisionSystem collisionSystem(registry);
    AnimationSystem animationSystem(registry);
    UISystem uiSystem(registry);
    RenderSystem renderSystem(registry);

    // Create player
    Entity player = createPlayer(registry);
    createPlayerUI(registry, player);

    // Game loop
    float accumulator = 0.0f;
    const float FIXED_TIMESTEP = 1.0f / 60.0f;

    while (!shouldQuit) {
        float dt = getDeltaTime();
        accumulator += dt;

        // Input
        pollEvents();
        bool uiHandledInput = uiSystem.processInput();

        if (!uiHandledInput) {
            processPlayerInput(player);
        }

        // Fixed update (physics/collision)
        while (accumulator >= FIXED_TIMESTEP) {
            updatePlayerController(player, FIXED_TIMESTEP);
            updatePhysics(registry, FIXED_TIMESTEP);
            collisionSystem.update(FIXED_TIMESTEP);
            accumulator -= FIXED_TIMESTEP;
        }

        // Variable update (animation)
        animationSystem.update(dt);
        updateAI(registry, dt);

        // UI update
        uiSystem.update(dt);

        // Rendering
        float interpolation = accumulator / FIXED_TIMESTEP;
        
        beginFrame();
        renderSystem.render(interpolation);
        uiSystem.render();
        endFrame();
        swapBuffers();
    }
}
```

---

## Summary

### Key Integration Points

1. **Update Order Matters**:
   ```
   Input → Physics → Collision → Animation → UI → Render
   ```

2. **Fixed vs Variable Timestep**:
   - **Fixed** (Physics, Collision): Deterministic, network-safe
   - **Variable** (Animation, UI): Smooth visual updates

3. **UI Comes After Game Logic**:
   - UI displays *results* of game state
   - Never update UI before game logic

4. **Collision Triggers Animation**:
   - Collision callbacks trigger state machine transitions
   - Animation responds to gameplay events

5. **Performance**:
   - Spatial partitioning for collisions (100x speedup)
   - LOD and culling for animations (5x speedup)
   - Dirty flags and batching for UI (10x speedup)

### The Three Systems Compared

| System | Update Frequency | Priority | Complexity | Performance Impact |
|--------|-----------------|----------|------------|-------------------|
| **Collision** | Fixed (60 Hz) | High | Medium | High (O(n²) → O(n log n)) |
| **Animation** | Variable | Medium | High | Medium (matrix math) |
| **UI** | Variable | Low | Low | Low (dirty flags) |

### Design Principles

1. **Separation of Concerns**: Each system has clear responsibility
2. **Data-Oriented**: Components are pure data, systems are pure logic
3. **Event-Driven**: Systems communicate via callbacks/events
4. **Performance-First**: Every system optimized for 60+ FPS
5. **Composition**: Build complex behaviors from simple components

---

## Further Resources

### Collision Detection
- "Real-Time Collision Detection" by Christer Ericson
- "Game Physics Engine Development" by Ian Millington
- Box2D source code (excellent 2D physics reference)

### Animation
- "Game Engine Architecture" Chapter 11 (Animation Systems)
- GDC talks on animation systems
- Unity Mecanim/Unreal Animation Blueprint documentation

### UI
- Dear ImGui: https://github.com/ocornut/imgui
- "Immediate Mode GUI" paradigm explanation
- "Retained Mode GUI" (Qt, WPF) documentation

### Integration
- "Game Programming Patterns" by Robert Nystrom
- Gaffer on Games: "Fix Your Timestep!"
- Casey Muratori's Handmade Hero (complete game from scratch)

---

*"Good game architecture isn't about clever code - it's about systems that work together simply and efficiently."*
