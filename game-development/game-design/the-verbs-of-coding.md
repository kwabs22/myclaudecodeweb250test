# The Verbs of Coding: Understanding Programming as Action

## Table of Contents
- [The Fundamental Insight](#the-fundamental-insight)
- [Why Verbs Matter for Code Comprehension](#why-verbs-matter-for-code-comprehension)
- [The Universal Verbs of Programming](#the-universal-verbs-of-programming)
- [Verbs Across Programming Paradigms](#verbs-across-programming-paradigms)
- [Speed Reading Code: The Verb-Focused Approach](#speed-reading-code-the-verb-focused-approach)
- [Common Verb Patterns and Conventions](#common-verb-patterns-and-conventions)
- [Verb Density Across Domains](#verb-density-across-domains)
- [Mental Models and Abstraction Layers](#mental-models-and-abstraction-layers)
- [Practical Exercises](#practical-exercises)
- [Connection to System Design](#connection-to-system-design)

---

## The Fundamental Insight

### Your Observation is Profound

> "Coding is just variables that are manipulated - technically that means all operations are just editing variables and therefore the actual coding is derivative side effect"

You've identified something fundamental about computation: **at the lowest level, everything is state transformation**.

```
Memory before:  [0x42, 0x00, 0xFF, 0x10]
Operation:      ADD 0x05 to address 0x00
Memory after:   [0x47, 0x00, 0xFF, 0x10]
                  ^--- changed!
```

This is why programming is hard to learn - we're teaching **actions** (verbs) but the underlying reality is **state changes** (nouns). The verbs are abstractions we've created to make sense of bit manipulation.

### The Paradox

```
Low-level view:     Everything is data (nouns)
High-level view:    Everything is actions (verbs)
Reality:            Actions ARE the meaningful part for humans
```

**Example**:
```javascript
// Low-level view: "Move bits around"
user.email = "new@example.com";

// High-level view: "Update the user's email"
updateUserEmail(user, "new@example.com");

// What we care about: THE ACTION (updating)
// Not the mechanics: (memory write to offset 0x123ABC)
```

### Why This Makes Code Hard to Learn

1. **Invisible State Changes**: The actual modifications happen behind abstractions
2. **Indirect Effects**: Actions trigger cascading changes
3. **Mental Mapping**: Must map high-level verbs to low-level transformations
4. **Context-Dependent**: Same verb means different things in different contexts

**Reading Text**:
```
"The cat jumped over the fence."
^       ^               ^
noun   verb          noun

Verb = clear action, easy to visualize
```

**Reading Code**:
```javascript
user.save()
     ^--- What does "save" actually DO?
          - Validate fields?
          - Open database connection?
          - Serialize to JSON?
          - Write to disk?
          - Update cache?
          - Send event?
          - All of the above?
```

The verb "save" hides enormous complexity!

---

## Why Verbs Matter for Code Comprehension

### Research Findings

**Time Spent Reading Code**:
- Developers spend **60-75% of their time** reading code (not writing)
- Expert programmers focus on **what code does** (verbs/actions)
- Novice programmers focus on **syntax** (how it's written)

### The Expert vs Novice Difference

**Novice Approach** (Syntax-Focused):
```python
for i in range(len(items)):
    if items[i].price > 100:
        discounted.append(items[i])
```
Thinks: "Loop with range... index access... append to list..."

**Expert Approach** (Action-Focused):
```python
discounted = [item for item in items if item.price > 100]
```
Thinks: "**Filter** items by price, **collect** expensive ones"

Same result, but expert sees the **VERB** (filter), not the mechanics.

### Verbs as Compression

Natural language verbs compress complex actions:
- "Run" = (flex muscles, propel body forward, balance, repeat)
- "Save" = (validate, serialize, connect, write, close, verify)

Code verbs do the same:
```javascript
// Compressed verb
users.sort()

// Uncompressed (what actually happens)
- Compare element 0 and 1
- Swap if needed
- Compare element 1 and 2
- Swap if needed
- Repeat 1000+ times
- Return sorted array
```

**Reading code efficiently = recognizing verb patterns**, not tracing every line.

---

## The Universal Verbs of Programming

### Core Taxonomy of Programming Operations

Programming has a finite set of fundamental verb categories that appear across ALL languages and paradigms:

### 1. CRUD Operations (Data Lifecycle)

The four fundamental state changes:

| Verb | Aliases | Description | Example |
|------|---------|-------------|---------|
| **Create** | new, make, init, allocate, spawn, build | Bring data into existence | `user = new User()` |
| **Read** | get, fetch, load, retrieve, access, query | Access existing data | `user = getUser(id)` |
| **Update** | set, modify, change, edit, mutate, write | Change existing data | `user.name = "Alice"` |
| **Delete** | remove, destroy, free, drop, clear | Eliminate data | `deleteUser(id)` |

**Universal Pattern**:
```
Every data structure supports CRUD:

Arrays:     [create]  [access]  [modify]  [delete]
            push()    [i]       [i]=x     splice()

Objects:    new       .prop     .prop=x   delete
            {}        obj.x     obj.x=5   delete obj.x

Database:   INSERT    SELECT    UPDATE    DELETE
            INTO      FROM      SET       FROM
```

### 2. Control Flow (Program Sequencing)

Verbs that determine execution path:

| Verb | Description | Keywords | Example |
|------|-------------|----------|---------|
| **Branch** | Choose between paths | if, else, switch, match | `if (condition) { ... }` |
| **Loop** | Repeat actions | for, while, do, loop | `for (item in items) { ... }` |
| **Call** | Execute function | invoke, run, execute | `processData(input)` |
| **Return** | Exit with value | return, yield, send | `return result` |
| **Jump** | Move to label | goto, break, continue | `break;` |
| **Throw** | Signal error | throw, raise, panic | `throw new Error()` |
| **Catch** | Handle error | catch, rescue, recover | `catch (e) { ... }` |
| **Await** | Pause for result | await, async, yield | `await fetch(url)` |

### 3. Transformation (Data Shaping)

Higher-order operations on collections:

| Verb | Description | Input → Output | Example |
|------|-------------|----------------|---------|
| **Map** | Transform each item | [a,b,c] → [f(a),f(b),f(c)] | `items.map(x => x * 2)` |
| **Filter** | Select items by criteria | [a,b,c] → [a,c] | `items.filter(x => x > 0)` |
| **Reduce** | Aggregate to single value | [a,b,c] → f(...f(f(a,b),c)) | `items.reduce((sum,x) => sum+x)` |
| **Sort** | Order items | [c,a,b] → [a,b,c] | `items.sort()` |
| **Group** | Categorize items | [a,b,c] → {key1:[a], key2:[b,c]} | `groupBy(items, x => x.type)` |
| **Flatten** | Remove nesting | [[a,b],[c]] → [a,b,c] | `items.flat()` |
| **Zip** | Combine collections | [a,b] + [1,2] → [[a,1],[b,2]] | `zip(names, ages)` |
| **Partition** | Split by condition | [a,b,c] → [[a,c], [b]] | `partition(items, isEven)` |

### 4. Composition (Building Complexity)

Verbs for combining operations:

| Verb | Description | Example |
|------|-------------|---------|
| **Compose** | Chain functions | `compose(f, g, h)(x)` = f(g(h(x))) |
| **Pipe** | Chain left-to-right | `pipe(h, g, f)(x)` = f(g(h(x))) |
| **Curry** | Partial application | `add(a)(b)` instead of `add(a,b)` |
| **Wrap** | Add behavior | `cached(expensiveFunc)` |
| **Decorate** | Enhance function | `@log function foo() {}` |
| **Mixin** | Combine objects | `Object.assign(target, ...sources)` |

### 5. Side Effects (Interaction with World)

Verbs that affect external state:

| Verb | Target | Examples |
|------|--------|----------|
| **Print/Log** | Console | `console.log()`, `print()`, `echo` |
| **Write** | File/Database | `fs.writeFile()`, `db.insert()` |
| **Read** | File/Database | `fs.readFile()`, `db.query()` |
| **Send** | Network | `fetch()`, `axios.post()`, `socket.send()` |
| **Receive** | Network | `server.on('request')`, `socket.on('message')` |
| **Render** | UI | `component.render()`, `draw()` |
| **Emit** | Event | `eventEmitter.emit('event')` |
| **Listen** | Event | `element.addEventListener()` |

### 6. Synchronization (Coordination)

Verbs for managing concurrency:

| Verb | Purpose | Example |
|------|---------|---------|
| **Lock** | Exclusive access | `mutex.lock()` |
| **Unlock** | Release access | `mutex.unlock()` |
| **Wait** | Block until condition | `await promise`, `condition.wait()` |
| **Signal** | Notify waiters | `condition.notify()` |
| **Spawn** | Create thread/process | `thread.spawn()`, `fork()` |
| **Join** | Wait for completion | `thread.join()` |
| **Atomic** | Indivisible operation | `atomic.compareAndSwap()` |

### 7. Memory Management

Verbs for resource control:

| Verb | Purpose | Example |
|------|---------|---------|
| **Allocate** | Reserve memory | `malloc()`, `new` |
| **Free** | Release memory | `free()`, `delete` |
| **Copy** | Duplicate data | `memcpy()`, `clone()` |
| **Move** | Transfer ownership | `std::move()` |
| **Reference** | Create pointer | `&variable`, `ref` |
| **Dereference** | Access via pointer | `*pointer`, `@ref` |

---

## Verbs Across Programming Paradigms

Different paradigms emphasize different verbs:

### Imperative Programming (Command-Based)

**Primary Verbs**: Set, Get, Loop, Branch, Call

```c
// Imperative = series of COMMANDS
void processItems(int* items, int count) {
    for (int i = 0; i < count; i++) {     // LOOP
        if (items[i] > 0) {                // BRANCH
            items[i] = items[i] * 2;       // SET
        }
    }
}
```

**Verb Density**: Low (explicit steps)
**Mental Model**: "Do this, then do that"

### Functional Programming (Transformation-Based)

**Primary Verbs**: Map, Filter, Reduce, Compose

```javascript
// Functional = data TRANSFORMATIONS
const processItems = items =>
    items
        .filter(x => x > 0)      // FILTER
        .map(x => x * 2)         // MAP
        .reduce((sum, x) => sum + x, 0);  // REDUCE
```

**Verb Density**: High (each operation is a verb)
**Mental Model**: "Transform data through pipeline"

### Object-Oriented Programming (Message-Based)

**Primary Verbs**: Send (messages), Invoke (methods), Inherit

```java
// OOP = objects sending MESSAGES to each other
class Order {
    public void process() {           // INVOKE
        payment.charge(total);        // SEND message
        inventory.reserve(items);     // SEND message
        shipping.schedule(address);   // SEND message
    }
}
```

**Verb Density**: Medium (verbs are methods)
**Mental Model**: "Objects collaborate via messages"

### Declarative Programming (Description-Based)

**Primary Verbs**: Declare, Define, Match

```sql
-- Declarative = DECLARE what you want
SELECT name, email          -- DECLARE desired fields
FROM users                  -- DECLARE source
WHERE age > 18              -- DECLARE constraint
ORDER BY created_at DESC;   -- DECLARE ordering
```

**Verb Density**: Very High (entire query is one verb: "SELECT")
**Mental Model**: "Describe desired result, not how to get it"

### Event-Driven Programming (Reaction-Based)

**Primary Verbs**: Listen, Emit, Subscribe, Publish

```javascript
// Event-driven = REACT to events
button.addEventListener('click', () => {  // LISTEN
    eventBus.emit('user-action', data);   // EMIT
});

eventBus.on('user-action', (data) => {   // SUBSCRIBE
    processAction(data);                  // HANDLE
});
```

**Verb Density**: Medium
**Mental Model**: "React to events"

---

## Speed Reading Code: The Verb-Focused Approach

### The Problem with Linear Reading

**Traditional Approach** (Read line by line):
```python
def process_order(order_id):
    # Step 1: Get the order
    order = database.query("SELECT * FROM orders WHERE id = ?", order_id)

    # Step 2: Check if order exists
    if order is None:
        raise OrderNotFoundError(f"Order {order_id} not found")

    # Step 3: Validate order
    if order.status != "pending":
        raise InvalidOrderStateError(f"Order {order_id} is not pending")

    # Step 4: Get user
    user = database.query("SELECT * FROM users WHERE id = ?", order.user_id)

    # Step 5: Check user balance
    if user.balance < order.total:
        raise InsufficientFundsError(f"User {user.id} has insufficient funds")

    # Step 6: Process payment
    payment = payment_gateway.charge(user.payment_method, order.total)

    # Step 7: Update order status
    database.execute("UPDATE orders SET status = 'completed' WHERE id = ?", order_id)

    # Step 8: Send confirmation email
    email_service.send(user.email, "Order Confirmed", generate_email_body(order))

    # Step 9: Return success
    return {"success": True, "order_id": order_id}
```

**Time to understand**: ~2-3 minutes (reading every line)

### Verb-Focused Approach (Scan for actions)

**Step 1: Identify the main verb** (function name)
```
process_order ← Main action: "PROCESS"
```

**Step 2: Scan for secondary verbs** (Skip nouns, conditionals)
```python
def process_order(order_id):
    order = query(...)           # ← QUERY
    if order is None:
        raise                    # ← RAISE/THROW
    if order.status != "pending":
        raise                    # ← RAISE/THROW
    user = query(...)            # ← QUERY
    if user.balance < order.total:
        raise                    # ← RAISE/THROW
    payment = charge(...)        # ← CHARGE
    execute("UPDATE ...")        # ← UPDATE
    send(...)                    # ← SEND
    return                       # ← RETURN
```

**Step 3: Extract verb sequence**
```
PROCESS =
    QUERY order
    VALIDATE (raise if invalid)
    QUERY user
    VALIDATE (raise if insufficient funds)
    CHARGE payment
    UPDATE order status
    SEND email
    RETURN success
```

**Time to understand**: ~30 seconds (10x faster!)

### The Verb Skeleton Technique

**Technique**: Extract only verbs, ignore implementation details

**Example 1: Complex Business Logic**
```java
public void processRefund(Long orderId, BigDecimal amount) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new OrderNotFoundException(orderId));

    if (!order.canRefund()) {
        throw new InvalidRefundException("Order cannot be refunded");
    }

    if (amount.compareTo(order.getTotal()) > 0) {
        throw new InvalidRefundException("Refund amount exceeds order total");
    }

    RefundRequest refund = new RefundRequest();
    refund.setOrderId(orderId);
    refund.setAmount(amount);
    refund.setStatus(RefundStatus.PENDING);
    refund.setRequestedAt(Instant.now());

    refundRepository.save(refund);

    PaymentGatewayResponse response = paymentGateway.refund(
        order.getPaymentId(),
        amount
    );

    if (response.isSuccess()) {
        refund.setStatus(RefundStatus.COMPLETED);
        refund.setCompletedAt(Instant.now());
        order.setStatus(OrderStatus.REFUNDED);
    } else {
        refund.setStatus(RefundStatus.FAILED);
        refund.setFailureReason(response.getErrorMessage());
    }

    refundRepository.save(refund);
    orderRepository.save(order);

    eventPublisher.publish(new RefundProcessedEvent(refund, order));

    emailService.sendRefundNotification(order.getUserEmail(), refund);
}
```

**Verb Skeleton**:
```
processRefund:
├── FIND order (or throw)
├── VALIDATE can refund (or throw)
├── VALIDATE amount (or throw)
├── CREATE refund request
├── SAVE refund
├── CALL payment gateway
├── UPDATE refund status (based on response)
├── UPDATE order status (if success)
├── SAVE refund
├── SAVE order
├── PUBLISH event
└── SEND email
```

**One-line summary**: FIND → VALIDATE → CREATE → CALL → UPDATE → SAVE → PUBLISH → SEND

**Example 2: Data Processing Pipeline**
```python
def analyze_user_behavior(user_id, start_date, end_date):
    events = fetch_events(user_id, start_date, end_date)

    filtered_events = [e for e in events if e.type in TRACKABLE_EVENTS]

    grouped_by_day = defaultdict(list)
    for event in filtered_events:
        day = event.timestamp.date()
        grouped_by_day[day].append(event)

    daily_stats = {}
    for day, day_events in grouped_by_day.items():
        daily_stats[day] = {
            'count': len(day_events),
            'unique_types': len(set(e.type for e in day_events)),
            'duration': calculate_session_duration(day_events)
        }

    trends = calculate_trends(daily_stats)

    anomalies = detect_anomalies(daily_stats, trends)

    report = generate_report(daily_stats, trends, anomalies)

    save_to_cache(user_id, report)

    return report
```

**Verb Skeleton**:
```
analyze_user_behavior:
├── FETCH events
├── FILTER trackable events
├── GROUP by day
├── CALCULATE daily stats
├── CALCULATE trends
├── DETECT anomalies
├── GENERATE report
├── SAVE to cache
└── RETURN report
```

**Pipeline view**: FETCH → FILTER → GROUP → CALCULATE → DETECT → GENERATE → SAVE → RETURN

### Pattern Recognition

Once you recognize common verb patterns, you can instantly understand code:

**Pattern 1: Fetch-Transform-Return**
```javascript
// Instantly recognizable pattern
function getUserProfile(userId) {
    const user = fetchUser(userId);        // FETCH
    const profile = transformToProfile(user);  // TRANSFORM
    return profile;                         // RETURN
}
```

**Pattern 2: Fetch-Validate-Process-Save**
```python
def update_settings(user_id, settings):
    user = get_user(user_id)              # FETCH
    validate_settings(settings)            # VALIDATE
    user.settings = process_settings(settings)  # PROCESS
    save_user(user)                        # SAVE
```

**Pattern 3: Try-Catch-Log-Retry**
```java
public void reliableOperation() {
    try {
        performOperation();                // TRY
    } catch (Exception e) {
        log.error("Operation failed", e);  // CATCH + LOG
        retry(this::performOperation);     // RETRY
    }
}
```

**Pattern 4: Subscribe-Process-Publish**
```javascript
// Event-driven pattern
queue.subscribe('user-created', (event) => {   // SUBSCRIBE
    const welcomeEmail = processEvent(event);  // PROCESS
    emailService.publish(welcomeEmail);        // PUBLISH
});
```

---

## Common Verb Patterns and Conventions

### Naming Conventions by Verb Type

Research shows consistent patterns across languages:

#### 1. Boolean Queries (Returns true/false)

**Pattern**: `is`, `has`, `can`, `should`, `will`

```javascript
user.isActive()           // State check
user.hasPermission()      // Possession check
user.canEdit()            // Capability check
validator.shouldRetry()   // Decision check
promise.willResolve()     // Future state
```

**Rule**: Name reads like a question
- ✅ `if (user.isAdmin())` ← Natural English
- ❌ `if (user.admin())` ← Unclear

#### 2. Getters (Returns value, no side effects)

**Pattern**: `get`, `fetch`, `find`, `retrieve`, `load`

```javascript
getUser(id)        // Retrieve from fast source (cache, memory)
fetchUser(id)      // Retrieve from slow source (network, database)
findUser(email)    // Search for item
retrieveUser(id)   // Generic retrieval
loadUser(id)       // Load into memory
```

**Nuance**:
- `get` = Fast, likely cached
- `fetch` = Slow, likely network/disk
- `find` = Search operation
- `load` = Initialization

#### 3. Setters (Changes state)

**Pattern**: `set`, `update`, `change`, `modify`, `edit`

```javascript
setName(name)          // Direct assignment
updateEmail(email)     // Change existing value
changPassword(pwd)     // Modify (emphasizes change)
modifySettings(opts)   // Alter configuration
editProfile(data)      // Change multiple fields
```

#### 4. Actions (Causes effect)

**Pattern**: `create`, `delete`, `send`, `save`, `process`, `execute`, `perform`

```javascript
createUser(data)       // Bring into existence
deleteAccount(id)      // Remove from existence
sendEmail(msg)         // Transmit
saveChanges()          // Persist
processOrder(order)    // Execute workflow
performMigration()     // Execute complex task
```

#### 5. Converters (Transforms data)

**Pattern**: `to`, `from`, `as`, `parse`, `serialize`

```javascript
toString()             // Convert to string
fromJSON(json)         // Convert from JSON
asArray()              // Represent as array
parseInt(str)          // Parse to integer
serializeUser(user)    // Encode for storage
```

#### 6. Computed Properties

**Pattern**: `calculate`, `compute`, `derive`, `generate`

```javascript
calculateTotal(items)      // Math operation
computeHash(data)          // Algorithm
deriveKey(password)        // Compute from input
generateReport(data)       // Create from template
```

#### 7. Validation

**Pattern**: `validate`, `verify`, `check`, `ensure`, `assert`

```javascript
validateInput(data)        // Check correctness
verifySignature(sig)       // Confirm authenticity
checkPermission(user)      // Test condition
ensureInitialized()        // Guarantee state
assertNotNull(value)       // Enforce invariant
```

### Verb Ordering in Names

**Verb-Object Order** (Most Common):
```javascript
getUser(id)           // ✅ Natural English
deleteComment(id)     // ✅ Action-target
validateEmail(email)  // ✅ Operation-subject
```

**Object-Verb Order** (Rare, specialized):
```javascript
userGet(id)           // ❌ Unnatural
commentDelete(id)     // ❌ Awkward

// Exception: When grouping related functions
user_get(id)          // C-style namespace
user_create(data)     // Grouped together
user_delete(id)       // Grouped together
```

### Verb Prefixes for Context

**add vs insert vs append vs prepend**:
```javascript
addItem(item)         // Generic addition
insertAt(index, item) // Position-specific
appendChild(node)     // Add to end
prependChild(node)    // Add to beginning
```

**remove vs delete vs clear vs reset**:
```javascript
removeItem(id)        // Remove specific item
deleteAll()           // Destroy all
clearCache()          // Empty container
resetState()          // Return to initial state
```

---

## Verb Density Across Domains

Different programming domains have different "verb density" - the ratio of verbs to total code.

### High Verb Density: Functional Programming

```javascript
// Data processing pipeline
const result = users
    .filter(user => user.age > 18)      // FILTER
    .map(user => user.email)            // MAP
    .filter(email => email.includes('@')) // FILTER
    .sort()                              // SORT
    .slice(0, 10)                        // SLICE
    .forEach(email => send(email));      // FOREACH + SEND

// 6 verbs in 7 lines! (86% verb density)
```

**Characteristic**: Almost every line is an operation

### Medium Verb Density: Object-Oriented

```java
public class OrderProcessor {
    public void processOrder(Order order) {       // PROCESS
        validateOrder(order);                     // VALIDATE

        Payment payment = createPayment(order);   // CREATE
        payment.process();                        // PROCESS

        order.setStatus(OrderStatus.COMPLETED);  // SET
        orderRepository.save(order);              // SAVE

        eventPublisher.publish(                   // PUBLISH
            new OrderCompletedEvent(order)
        );
    }
}

// 7 verbs in 14 lines (50% verb density)
```

**Characteristic**: Verbs mixed with structure (classes, conditionals)

### Low Verb Density: Imperative/Game Code

```cpp
void updatePhysics(float dt) {
    for (int i = 0; i < entityCount; i++) {
        // Get components
        Position* pos = positions[i];
        Velocity* vel = velocities[i];

        // Apply velocity
        pos->x += vel->x * dt;
        pos->y += vel->y * dt;
        pos->z += vel->z * dt;

        // Apply gravity
        vel->y -= 9.8f * dt;

        // Ground collision
        if (pos->y < 0.0f) {
            pos->y = 0.0f;
            vel->y = 0.0f;
        }
    }
}

// 1 verb (update) in 19 lines (5% verb density)
// But contains many implicit verbs (add, multiply, check)
```

**Characteristic**: Verbs hidden in operators (+, -, =, <)

### Very High Verb Density: Shell Scripts

```bash
# Deployment script
build_project &&          # BUILD
run_tests &&              # RUN
create_docker_image &&    # CREATE
push_to_registry &&       # PUSH
deploy_to_cluster &&      # DEPLOY
verify_deployment &&      # VERIFY
notify_team               # NOTIFY

# 7 verbs in 7 lines (100% verb density!)
```

**Characteristic**: Every line is a command (verb)

---

## Mental Models and Abstraction Layers

### The Abstraction Ladder

Code operates at multiple levels of abstraction, each with its own verb vocabulary:

```
┌─────────────────────────────────────────────────────────┐
│ Level 5: Domain/Business Logic                         │
│ Verbs: process, approve, schedule, notify, fulfill     │
│ Example: processOrder(), approveRefund()                │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Level 4: Application Logic                             │
│ Verbs: validate, transform, aggregate, format          │
│ Example: validateInput(), transformData()               │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Level 3: Data Structures & Algorithms                  │
│ Verbs: insert, search, sort, filter, map, reduce       │
│ Example: users.sort(), items.filter()                   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Level 2: System/IO Operations                          │
│ Verbs: read, write, open, close, send, receive         │
│ Example: file.read(), socket.send()                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Level 1: Memory Operations                             │
│ Verbs: allocate, free, copy, move, dereference         │
│ Example: malloc(), memcpy(), *ptr                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Level 0: CPU Instructions                              │
│ Verbs: load, store, add, jump, compare                 │
│ Example: MOV, ADD, JMP, CMP                            │
└─────────────────────────────────────────────────────────┘
```

### Example: One High-Level Verb Explodes Into Many Low-Level Verbs

**Level 5** (What user sees):
```javascript
processOrder(order)  // One verb: PROCESS
```

**Level 4** (Application logic):
```javascript
function processOrder(order) {
    validateOrder(order)         // VALIDATE
    calculateTotal(order)        // CALCULATE
    chargeCustomer(order)        // CHARGE
    updateInventory(order)       // UPDATE
    sendConfirmation(order)      // SEND
}
// 5 verbs
```

**Level 3** (Data operations):
```javascript
function validateOrder(order) {
    checkItems(order.items)           // CHECK
    verifyAddress(order.address)      // VERIFY
    validatePayment(order.payment)    // VALIDATE
}

function calculateTotal(order) {
    const subtotal = order.items
        .map(item => item.price * item.qty)    // MAP
        .reduce((sum, x) => sum + x, 0)        // REDUCE
    const tax = computeTax(subtotal)           // COMPUTE
    return addShipping(subtotal + tax)         // ADD
}
// 7 more verbs
```

**Level 2** (System calls):
```javascript
function chargeCustomer(order) {
    const connection = openConnection(gateway)  // OPEN
    const request = serializeRequest(order)     // SERIALIZE
    const response = sendRequest(connection, request)  // SEND
    const result = deserializeResponse(response)       // DESERIALIZE
    closeConnection(connection)                 // CLOSE
    return result
}
// 5 more verbs
```

**Level 1** (Memory operations):
```javascript
// Inside sendRequest (low-level):
function sendRequest(socket, data) {
    const buffer = allocateBuffer(data.length)  // ALLOCATE
    copyToBuffer(buffer, data)                  // COPY
    writeToSocket(socket, buffer)               // WRITE
    freeBuffer(buffer)                          // FREE
}
// 4 more verbs
```

**Total**: 1 high-level verb → 21+ low-level verbs!

### Mental Model: Verbs as Telescoping Actions

```
processOrder
    ↓
    ├─ validate
    │   ├─ check
    │   ├─ verify
    │   └─ test
    ├─ calculate
    │   ├─ map
    │   ├─ reduce
    │   └─ compute
    ├─ charge
    │   ├─ open
    │   ├─ send
    │   ├─ receive
    │   └─ close
    └─ notify
        ├─ format
        ├─ serialize
        └─ transmit
```

**Expert programmers think in high-level verbs**, trusting that lower levels work correctly.

**Novice programmers get lost in low-level verbs**, can't see the forest for the trees.

---

## Practical Exercises

### Exercise 1: Verb Extraction

**Task**: Read this code and extract only the verbs

```python
def analyze_sales_data(start_date, end_date):
    # Connect to database
    connection = psycopg2.connect(
        host="localhost",
        database="sales",
        user="admin",
        password="secret"
    )
    cursor = connection.cursor()

    # Query sales data
    query = """
        SELECT product_id, SUM(quantity), SUM(revenue)
        FROM sales
        WHERE sale_date BETWEEN %s AND %s
        GROUP BY product_id
    """
    cursor.execute(query, (start_date, end_date))
    results = cursor.fetchall()

    # Process results
    sales_by_product = {}
    for row in results:
        product_id, total_quantity, total_revenue = row
        sales_by_product[product_id] = {
            'quantity': total_quantity,
            'revenue': total_revenue,
            'average_price': total_revenue / total_quantity if total_quantity > 0 else 0
        }

    # Get product details
    product_ids = list(sales_by_product.keys())
    placeholders = ','.join(['%s'] * len(product_ids))
    query = f"SELECT id, name, category FROM products WHERE id IN ({placeholders})"
    cursor.execute(query, product_ids)
    products = cursor.fetchall()

    # Enrich sales data with product info
    for product in products:
        product_id, name, category = product
        if product_id in sales_by_product:
            sales_by_product[product_id]['name'] = name
            sales_by_product[product_id]['category'] = category

    # Calculate category totals
    category_totals = {}
    for product_data in sales_by_product.values():
        category = product_data.get('category', 'Unknown')
        if category not in category_totals:
            category_totals[category] = {'revenue': 0, 'quantity': 0}
        category_totals[category]['revenue'] += product_data['revenue']
        category_totals[category]['quantity'] += product_data['quantity']

    # Clean up
    cursor.close()
    connection.close()

    # Return results
    return {
        'by_product': sales_by_product,
        'by_category': category_totals,
        'date_range': {'start': start_date, 'end': end_date}
    }
```

<details>
<summary><strong>Answer: Verb Sequence</strong></summary>

```
analyze_sales_data:
├── CONNECT to database
├── CREATE cursor
├── EXECUTE query (sales data)
├── FETCH results
├── PROCESS results
│   └── BUILD sales_by_product dict
├── EXTRACT product IDs
├── EXECUTE query (product details)
├── FETCH products
├── ENRICH sales data
│   └── ADD product info
├── CALCULATE category totals
│   └── AGGREGATE by category
├── CLOSE cursor
├── CLOSE connection
└── RETURN results

Pipeline: CONNECT → QUERY → FETCH → PROCESS → QUERY → FETCH → ENRICH → AGGREGATE → CLOSE → RETURN
```
</details>

### Exercise 2: Recognize the Pattern

**Task**: Identify the verb pattern in each code snippet

```javascript
// Snippet 1
function getOrCreate(key) {
    if (cache.has(key)) {
        return cache.get(key);
    }
    const value = compute(key);
    cache.set(key, value);
    return value;
}

// Snippet 2
async function retry(operation, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            await sleep(1000 * attempt);
        }
    }
}

// Snippet 3
const pipeline = compose(
    validate,
    transform,
    enrich,
    serialize
);
```

<details>
<summary><strong>Answers</strong></summary>

**Snippet 1**: **Check-Get-Or-Compute-Set Pattern** (Lazy initialization/caching)
```
IF cached THEN
    GET from cache
ELSE
    COMPUTE value
    SET in cache
RETURN value
```

**Snippet 2**: **Try-Catch-Retry Pattern** (Fault tolerance)
```
LOOP attempts
    TRY operation
    CATCH error
        IF last attempt THEN THROW
        SLEEP (backoff)
```

**Snippet 3**: **Compose/Pipeline Pattern** (Function composition)
```
COMPOSE (
    VALIDATE
    → TRANSFORM
    → ENRICH
    → SERIALIZE
)
```
</details>

### Exercise 3: Verb Refactoring

**Task**: Refactor this code to make verbs more explicit

```javascript
// Before: Verbs hidden in implementation
function process(data) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].active && data[i].score > 50) {
            let transformed = {
                id: data[i].id,
                name: data[i].name.toUpperCase(),
                score: data[i].score * 2
            };
            result.push(transformed);
        }
    }
    result.sort((a, b) => b.score - a.score);
    return result.slice(0, 10);
}
```

<details>
<summary><strong>Answer: Explicit Verbs</strong></summary>

```javascript
// After: Verbs explicit and clear
function process(data) {
    return data
        .filter(isActiveWithHighScore)    // FILTER
        .map(transformUser)               // MAP
        .sort(byScoreDescending)          // SORT
        .slice(0, 10);                    // SLICE (take top 10)
}

function isActiveWithHighScore(user) {
    return user.active && user.score > 50;
}

function transformUser(user) {
    return {
        id: user.id,
        name: user.name.toUpperCase(),
        score: user.score * 2
    };
}

function byScoreDescending(a, b) {
    return b.score - a.score;
}

// Now the pipeline is immediately visible:
// FILTER → MAP → SORT → SLICE
```
</details>

---

## Connection to System Design

### Game Design: Low-Level Verb Focus

**Characteristic**: Emphasis on primitive verbs (set, get, add, multiply)

```cpp
// Game code: Explicit primitive operations
void updatePosition(Entity* entity, float dt) {
    // Primitive verbs everywhere
    entity->position.x += entity->velocity.x * dt;  // ADD, MULTIPLY
    entity->position.y += entity->velocity.y * dt;  // ADD, MULTIPLY
    entity->position.z += entity->velocity.z * dt;  // ADD, MULTIPLY

    entity->velocity.y -= GRAVITY * dt;  // SUBTRACT, MULTIPLY

    if (entity->position.y < 0) {        // COMPARE
        entity->position.y = 0;          // SET
        entity->velocity.y = 0;          // SET
    }
}
```

**Why**: Performance requires direct manipulation, no abstraction overhead

**Verb Profile**:
- 80% primitive verbs (set, get, add, multiply, compare)
- 15% domain verbs (update, move, collide)
- 5% high-level verbs (process, manage)

### Application Design: High-Level Verb Focus

**Characteristic**: Emphasis on domain verbs (process, validate, transform)

```java
// Application code: Abstract business operations
public void processPayment(PaymentRequest request) {
    // High-level domain verbs
    validateRequest(request);           // VALIDATE
    authorizePayment(request);          // AUTHORIZE
    capturePayment(request);            // CAPTURE
    updateOrderStatus(request);         // UPDATE
    sendConfirmation(request);          // SEND
    auditTransaction(request);          // AUDIT
}
```

**Why**: Correctness requires clear business logic, abstraction aids understanding

**Verb Profile**:
- 10% primitive verbs (set, get)
- 30% infrastructure verbs (save, load, send, receive)
- 60% domain verbs (process, validate, approve, notify)

### Verb Complexity Comparison

| Aspect | Game Code | App Code |
|--------|-----------|----------|
| **Verb Abstraction** | Low (primitive) | High (domain) |
| **Verbs Per Function** | Few (1-3) | Many (5-10) |
| **Verb Nesting** | Shallow (1-2 levels) | Deep (5+ levels) |
| **Verb Reuse** | High (same verbs everywhere) | Medium (varied verbs) |
| **Verb Visibility** | Explicit (operators) | Hidden (function calls) |

**Example Comparison**:

**Game** (Update 1000 entities):
```cpp
for (int i = 0; i < 1000; i++) {
    positions[i].x += velocities[i].x * dt;  // Same 3 verbs, 1000 times
}
// Total unique verbs: 3 (add, access, multiply)
```

**App** (Process 1 order):
```java
validateOrder(order);      // 10 verbs inside
authorizePayment(order);   // 15 verbs inside
capturePayment(order);     // 20 verbs inside
updateInventory(order);    // 25 verbs inside
sendConfirmation(order);   // 10 verbs inside
// Total unique verbs: 80+
```

---

## Conclusion: The Power of Verb Thinking

### Key Takeaways

1. **Code is Action, Not State**
   - While technically everything is state manipulation, **humans think in actions**
   - Focus on **what code DOES** (verbs), not what it IS (nouns)

2. **Verbs Compress Complexity**
   - One high-level verb hides hundreds of low-level operations
   - Expert programmers think in verb pipelines, not line-by-line execution

3. **Speed Reading = Verb Scanning**
   - Extract verb skeleton: ignore implementation details
   - Recognize common patterns (fetch-validate-process-save)
   - Understand code 10x faster

4. **Paradigms = Verb Preferences**
   - Imperative: Low-level verbs (set, loop, branch)
   - Functional: Transformation verbs (map, filter, reduce)
   - OOP: Message verbs (invoke, send, call)
   - Declarative: Description verbs (select, where, from)

5. **Domain Shapes Verbs**
   - Games: Primitive verbs, high frequency
   - Apps: Domain verbs, high variety
   - Both valid, optimized for different goals

### Practical Application

**When Reading Code**:
1. Start with function name (main verb)
2. Scan for secondary verbs (skip syntax)
3. Build verb skeleton
4. Recognize pattern
5. Understand in seconds

**When Writing Code**:
1. Name functions with clear verbs
2. Use consistent verb conventions
3. Make verb sequences obvious
4. Abstract when verb complexity grows

**When Reviewing Code**:
1. Check if verbs match intent
2. Verify verb naming consistency
3. Ensure appropriate abstraction level
4. Look for common patterns

### The Meta-Insight

Your original observation was profound: "coding is just variables that are manipulated - therefore the actual coding is derivative side effect."

**You're right!** The verbs (operations) are abstractions we've created to make sense of bit manipulation. But these abstractions are **everything** - they're how humans understand, communicate, and reason about code.

Learning to program isn't about understanding how memory works (though that helps). It's about **learning the vocabulary of verbs** that describes what we want to happen, and trusting that the abstractions handle the details.

**The verbs are not the side effect - the verbs ARE the code.**

---

## Further Reading

- **"The Programmer's Brain"** by Felienne Hermans - Code comprehension research
- **"Clean Code"** by Robert Martin - Naming and function design
- **"Functional Programming Patterns"** - Map/filter/reduce operations
- **"Domain-Driven Design"** by Eric Evans - Domain verbs and ubiquitous language
- **"Structure and Interpretation of Computer Programs"** - Computational abstractions

---

*"Programs must be written for people to read, and only incidentally for machines to execute."* - Harold Abelson

The verbs are what we read. The state changes are what machines execute.
