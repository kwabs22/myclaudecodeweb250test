# Greenfield Development Quick Start

**Fast reference for building new systems with multi-agent orchestration**

---

## 🎯 Build Approach Decision Tree

```
Starting a new project?
│
├─ Small (<5 components)?
│  └─ Code-First → MVP fast, iterate
│
├─ Medium (5-15 components)?
│  └─ Scaffold-Then-Parallelize → Standard patterns
│
└─ Large (15+ components)?
   └─ Architecture-First → Design complete system
```

---

## ⚡ Quick Patterns

### Pattern 1: MVP Sprint (Code-First)

```
Time: 4-8 hours
Agents: 2-3

Step 1: Core Feature (1 agent, 2h)
→ Working prototype

Step 2: Add Features (2 agents parallel, 2h each)
→ Essential features

Step 3: Polish (1 agent, 1h)
→ Shippable MVP

Use for: Prototypes, MVPs, demos
```

**Example Prompt**:
```markdown
"Build note-taking app MVP with markdown and tags.
Code-first approach - working prototype in 4 hours."
```

### Pattern 2: Scaffolding Sprint

```
Time: 8-16 hours
Agents: 4-6

Step 1: Generate Scaffold (1 agent, 1h)
→ Project structure + boilerplate

Step 2: Feature Implementation (4 agents parallel, 4h each)
→ Business logic

Step 3: Integration (1 agent, 2h)
→ Connect features

Use for: Standard tech stacks, clear requirements
```

**Example Prompt**:
```markdown
"Build REST API with Django.
Generate scaffold, then implement auth, CRUD, search in parallel."
```

### Pattern 3: Architecture Sprint

```
Time: 24-48 hours
Agents: 10-20

Step 1: Architecture (1 agent, 6h)
→ Complete system design

Step 2: Implementation (15 agents parallel, 12h each)
→ All components

Step 3: Integration (2 agents, 8h)
→ Full system

Use for: Enterprise apps, microservices, Level 6+
```

**Example Prompt**:
```markdown
"Build SaaS platform with 5 microservices.
Architecture-first with complete design before implementation."
```

---

## 🏗️ Architecture-First Template

### Phase 1: Design (1 Agent)

```markdown
User: "Design complete architecture for [PROJECT] with:
- [Feature 1]
- [Feature 2]
- [Feature 3]

Output:
- System architecture diagram
- Tech stack recommendations
- Database schemas
- API contracts (OpenAPI)
- Service boundaries
- Infrastructure plan
- Development roadmap"
```

**Output**: architecture.md, api-specs/, schemas/

### Phase 2: Parallel Build (N Agents)

```markdown
"Implement [PROJECT] using architecture.md as blueprint.

Assign:
- Agent A: [Component 1] (full stack)
- Agent B: [Component 2] (full stack)
- Agent C: [Component 3] (full stack)
...

Each agent:
- Follows architecture.md strictly
- Implements complete vertical slice
- Includes tests
- Documents code"
```

### Phase 3: Integration (2 Agents)

```markdown
"Integrate all components:
- Agent 1: Connect services, resolve conflicts
- Agent 2: End-to-end testing, deployment"
```

---

## 📋 Vertical Slice Template

**Concept**: Each agent builds ONE complete feature (frontend + backend + DB)

```markdown
User: "Build [APP NAME] with:
- Feature A
- Feature B
- Feature C
- Feature D

Use vertical slice pattern - each agent owns complete feature."

Agent 1: Feature A (complete)
├── Frontend: [UI components]
├── Backend: [API endpoints]
├── Database: [Schema + migrations]
└── Tests: [E2E tests]

Agent 2: Feature B (complete)
...

Parallel execution → Full features delivered together
```

**Example**:
```markdown
"Build social app with posts, likes, comments, follows.
Vertical slices - 4 agents, each owns one feature end-to-end."

Agent A: Posts (create, view, delete) - ALL layers
Agent B: Likes (like button, counts) - ALL layers
Agent C: Comments (thread, replies) - ALL layers
Agent D: Follows (follow button, feed) - ALL layers
```

---

## 🔄 Interface-First Template

**Concept**: Define contracts first, implement in parallel

```markdown
Phase 1: Interface Design (1 Agent, 2h)
Output:
- api-spec.yaml (OpenAPI)
- types.ts (TypeScript interfaces)
- schema.prisma (Database schema)

Phase 2: Parallel Implementation (2 Agents, 6h each)

Agent A (Backend):
- Implements API per spec
- Uses defined types
- Mock data for testing

Agent B (Frontend):
- Uses defined types
- Mock API (MSW)
- UI components

Both work independently!

Phase 3: Integration (1 Agent, 1h)
- Connect real API
- Should work immediately (contracts match)
```

---

## 🚀 Real-World Prompts

### E-Commerce Site
```markdown
"Build e-commerce site from scratch:
- Product catalog with search
- Shopping cart
- Checkout with Stripe
- User reviews

Architecture-first approach.
Estimate: 20 hours with 6 parallel agents."
```

### SaaS Dashboard
```markdown
"Build admin dashboard for SaaS:
- User management (CRUD)
- Analytics charts
- Settings pages
- API key management

Scaffold-then-parallelize.
Use Next.js + Prisma + PostgreSQL."
```

### Mobile App
```markdown
"Build React Native app:
- Authentication (OAuth)
- User profiles
- Feed (infinite scroll)
- Messaging
- Push notifications

Vertical slices - 5 agents, each owns feature."
```

### Microservices
```markdown
"Build microservices for delivery app:
- User service
- Restaurant service
- Order service
- Delivery service
- Payment service

Architecture-first with:
- gRPC contracts
- Message queue design
- K8s deployment

Parallel implementation - 1 agent per service."
```

---

## 💡 Pro Tips

### Tip 1: Standards First
```markdown
Before parallel work:
"Create standards document:
- Code style guide
- Naming conventions
- Error handling patterns
- Testing approach

All agents will follow these standards."
```

### Tip 2: Reference Implementation
```markdown
"For unfamiliar tech stack:
1. Research agent finds best practices
2. Build ONE reference component (fully featured)
3. Other agents copy the pattern

Example: First build complete User Profile page,
then other pages follow same structure."
```

### Tip 3: Progressive Sprints
```markdown
Sprint 1 (1 week): MVP
- 2 agents
- Core features only
- Works but minimal

Sprint 2 (1 week): Features
- 4 agents parallel
- Add major features

Sprint 3 (1 week): Polish
- 3 agents
- Performance, UX, docs
```

### Tip 4: Mock Dependencies
```markdown
"If Agent B needs Agent A's output:
- Define interface contract
- Give Agent B a mock
- Both agents work parallel
- Integration agent swaps mock for real"
```

---

## 📊 Speed Comparison

| Project Size | Single Agent | Multi-Agent | Speedup |
|--------------|--------------|-------------|---------|
| Small (MVP) | 8 hours | 5 hours | 1.6x |
| Medium (Full app) | 80 hours | 24 hours | 3.3x |
| Large (SaaS platform) | 400 hours | 100 hours | 4x |
| Microservices | 1000 hours | 200 hours | 5x |

---

## 💰 Cost Estimation

```python
# Quick formula
agents = number_of_parallel_agents
hours_per_agent = estimated_work_hours
tokens_per_agent = hours_per_agent * 100_000  # rough estimate

# Cost = agents × tokens × model_price
haiku_cost = agents × tokens_per_agent × 0.25 / 1_000_000
sonnet_cost = agents × tokens_per_agent × 3 / 1_000_000
opus_cost = agents × tokens_per_agent × 15 / 1_000_000

# Example: 5 agents, 10 hours each, using Sonnet
# Cost = 5 × (10 × 100,000) × $3/M = $15
```

**Rule of thumb**:
- Small MVP: $50-200
- Medium app: $500-2,000
- Large platform: $2,000-10,000
- Enterprise system: $10,000-50,000

---

## 🔍 Common Mistakes

### ❌ Mistake 1: No Architecture
```
User: "Build complex app. Start coding immediately."
→ Chaos, inconsistency, wasted time
```

### ✅ Fix: Design First
```
User: "Design architecture first. Then implement with parallel agents."
→ Clear blueprint, consistent code
```

### ❌ Mistake 2: Wrong Parallelization
```
Feature B depends on Feature A
→ Both agents work in parallel
→ Agent B blocked, wasted time
```

### ✅ Fix: Phased or Mocked
```
Phase 1: Build Feature A
Phase 2: Build Feature B (uses A)

OR

Give Agent B a mock of A, swap later
```

### ❌ Mistake 3: Late Integration
```
10 agents work for 3 weeks
Try to integrate at end
→ Major conflicts, nothing works
```

### ✅ Fix: Continuous Integration
```
Integration agent merges continuously
Catches conflicts early
Main branch always working
```

---

## 🎯 Checklist: Before Starting

- [ ] Requirements documented
- [ ] Build approach selected (code-first vs architecture-first)
- [ ] Parallelization strategy chosen
- [ ] Contracts/interfaces defined (if parallel)
- [ ] Standards document created (if multiple agents)
- [ ] Success criteria defined
- [ ] Cost estimated
- [ ] Timeline estimated

---

## 📚 See Also

- **BUILDING_NEW_SYSTEMS_GUIDE.md** - Complete guide
- **MULTI_AGENT_PIPELINE_GUIDE.md** - Orchestration patterns
- **CLAUDE_CODE_SUBAGENT_PATTERNS.md** - Practical patterns
- **ORCHESTRATION_QUICK_REF.md** - General orchestration reference

---

**Version**: 1.0 | **Last Updated**: 2025-01-18 | **Quick Start** ⚡
