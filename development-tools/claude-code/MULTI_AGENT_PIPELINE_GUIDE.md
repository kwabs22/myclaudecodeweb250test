# Multi-Agent Pipeline Planning Guide

**Complete guide to orchestrating multi-model systems for Level 6+ tasks**

Version: 1.0
Last Updated: 2025-01-18

---

## Table of Contents

1. [Introduction](#introduction)
2. [When to Use Multi-Agent Pipelines](#when-to-use-multi-agent-pipelines)
3. [Claude Code Subagent System](#claude-code-subagent-system)
4. [Pipeline Orchestration Patterns](#pipeline-orchestration-patterns)
5. [Framework Comparison](#framework-comparison)
6. [Planning Methodology](#planning-methodology)
7. [Practical Implementation Examples](#practical-implementation-examples)
8. [Cost Optimization Strategies](#cost-optimization-strategies)

---

## Introduction

Multi-agent pipelines are orchestrated systems where multiple specialized AI models work together to accomplish complex tasks that exceed the capabilities of a single model. This guide covers how to plan, design, and implement these systems using Claude Code and other frameworks.

### Key Concepts

**Single-Agent Tasks (Levels 1-5):**
- One model handles entire workflow
- Linear execution
- Context fits in single context window (≤128K tokens)
- Cost: $15-2,800/month

**Multi-Agent Tasks (Levels 6-8):**
- Multiple models working in parallel or sequence
- Specialized roles (analysis, planning, implementation, verification)
- Distributed context across agents
- Cost: $5,000-50,000/month

---

## When to Use Multi-Agent Pipelines

### Decision Matrix

Use multi-agent pipelines when ANY of these conditions are true:

| Condition | Threshold | Single-Agent | Multi-Agent |
|-----------|-----------|--------------|-------------|
| **Codebase size** | 100+ files | ❌ Struggles | ✅ Parallel analysis |
| **Context needed** | >200K tokens | ❌ Exceeds window | ✅ Distributed context |
| **Specialized tasks** | 3+ domains | ❌ Jack of all trades | ✅ Expert specialists |
| **Timeline** | Enterprise project | ❌ 12 months | ✅ 2 months |
| **Parallel work** | Independent tasks | ❌ Sequential only | ✅ Concurrent execution |
| **Quality needs** | >95% accuracy | ❌ 75-85% | ✅ 95%+ with voting |

### ROI Calculation Example

**Task**: Migrate 500K LOC enterprise platform to microservices

**Single 32B Model Approach:**
- Timeline: 12 months (sequential work)
- Cost: $2,800/month × 12 = $33,600
- Quality: 75% (requires heavy human review)
- Total cost with human fixes: ~$50,000

**Multi-Agent Approach (5 agents):**
- Timeline: 2 months (parallel work)
- Cost: $15,000/month × 2 = $30,000
- Quality: 95% (ensemble verification)
- Total cost: ~$32,000

**Result**: ✅ 10x faster, 36% cheaper, higher quality

---

## Claude Code Subagent System

### Overview

Claude Code has a built-in subagent system accessed via the **Task tool**. Subagents are specialized mini-agents with:

- **Independent context windows** (gain additional context capacity)
- **Custom tool permissions** (limit dangerous operations)
- **Specialized instructions** (domain expertise)
- **Parallel execution** (up to 10 concurrent tasks)

### How the Task Tool Works

```
Main Agent (You're talking to this)
    │
    ├── Task Tool Call #1 (Research subagent)
    │   └── Searches codebase for authentication patterns
    │
    ├── Task Tool Call #2 (Analysis subagent)
    │   └── Analyzes database schema in parallel
    │
    └── Task Tool Call #3 (Planning subagent)
        └── Designs new architecture based on findings
```

**Key Limitations:**
- Subagents **cannot spawn other subagents** (prevents infinite nesting)
- Maximum 10 concurrent tasks with intelligent queuing
- Each subagent has separate context (doesn't see main agent's full history)

### Built-in Subagent Types

Based on research, Claude Code provides these subagent types:

#### 1. **general-purpose**
- Tools: All tools (Read, Write, Edit, Bash, Grep, Glob, etc.)
- Use: Complex multi-step tasks requiring diverse operations
- Example: "Refactor authentication module and update tests"

#### 2. **Explore** (Fast agent)
- Tools: All tools, optimized for codebase exploration
- Use: Finding files, searching code, answering codebase questions
- Thoroughness: Specify "quick", "medium", or "very thorough"
- Example: "Find all API endpoints in src/ directory"

#### 3. **Plan** (Fast agent)
- Tools: All tools, optimized for planning
- Use: Breaking down tasks, designing architecture
- Auto-invoked: Claude automatically uses this in plan mode
- Example: "Design database migration strategy for user tables"

### Creating Custom Subagents

Custom subagents are stored in `.claude/agents/` as Markdown files with YAML frontmatter:

```markdown
---
name: code-reviewer
description: Reviews code for bugs, security issues, and best practices
tools:
  - Read
  - Grep
  - Glob
model: sonnet  # or haiku for speed, opus for quality
color: blue    # visual identification
---

# Code Reviewer Agent

You are an expert code reviewer specializing in:
- Security vulnerabilities (SQL injection, XSS, CSRF)
- Performance issues
- Code style and best practices
- Test coverage

## Review Process

1. Read the target file(s)
2. Search for common vulnerability patterns
3. Check for edge cases
4. Verify test coverage
5. Provide actionable feedback with file:line references

## Output Format

Provide findings as:
- 🔴 Critical: Security issues, crashes
- 🟡 Warning: Performance, code smell
- 🟢 Good: Well-implemented patterns

Always include specific file paths and line numbers.
```

### Using Subagents in Practice

**Example 1: Parallel Codebase Analysis**

```python
# In Claude Code conversation:

User: "Analyze our authentication system across the entire codebase"

Claude (Main Agent):
"I'll use multiple subagents to analyze different aspects in parallel:

[Launches 4 Task tool calls]
1. Explore agent: Find all auth-related files
2. Explore agent: Search for security vulnerabilities
3. Explore agent: Check for session management
4. Explore agent: Analyze password hashing
```

**Example 2: Multi-Stage Migration**

```
Main Agent: "Coordinate Node.js to Python migration"

Stage 1 - Analysis (Parallel):
├── Task: Explore → Map all API endpoints
├── Task: Explore → Identify dependencies
└── Task: Explore → Find database queries

Stage 2 - Planning (Sequential, waits for Stage 1):
└── Task: Plan → Design migration strategy

Stage 3 - Implementation (Parallel, waits for Stage 2):
├── Task: general-purpose → Convert auth module
├── Task: general-purpose → Convert API routes
├── Task: general-purpose → Convert database layer
└── Task: general-purpose → Update tests

Stage 4 - Verification (Sequential):
└── Task: code-reviewer → Review all changes
```

### Best Practices for Claude Code Subagents

1. **Limit Scope**: Each subagent should handle ONE well-defined task
   ```
   ✅ Good: "Find all uses of deprecated API in src/"
   ❌ Bad: "Analyze codebase and suggest improvements and refactor"
   ```

2. **Use Appropriate Thoroughness**:
   ```python
   Quick:    Known file patterns, simple searches
   Medium:   Cross-file analysis, moderate exploration
   Thorough: Enterprise codebases, comprehensive audits
   ```

3. **Leverage Parallelism**:
   ```
   Sequential (slow):
   1. Find auth files → 2. Analyze auth → 3. Find DB files → 4. Analyze DB

   Parallel (4x faster):
   1. Find auth files    |  Find DB files
   2. Analyze auth       |  Analyze DB
   ```

4. **Manage Context Windows**:
   - Main agent: High-level orchestration
   - Subagents: Detailed implementation
   - Each subagent gets fresh context (no bloat from main agent history)

5. **Tool Permissions**:
   ```yaml
   # Restrictive (for exploration only)
   tools:
     - Read
     - Grep
     - Glob

   # Permissive (for implementation)
   tools:
     - Read
     - Write
     - Edit
     - Bash
   ```

---

## Pipeline Orchestration Patterns

### Pattern 1: Sequential Pipeline

**When**: Tasks have strict dependencies (output of A needed for B)

```
Analysis Agent → Planning Agent → Implementation Agent → Verification Agent
    ↓               ↓                    ↓                      ↓
  Report       Architecture          Code Changes         Pass/Fail
```

**Example**: Database migration
```
1. Analysis: Map current schema → schema.json
2. Planning: Design new schema using schema.json → migration_plan.md
3. Implementation: Write migration using migration_plan.md → migrations/
4. Verification: Test migration → test_report.md
```

**Claude Code Implementation**:
```
Main agent orchestrates 4 sequential Task calls:
- Each Task waits for previous to complete
- Outputs stored in files that next agent reads
- Main agent validates each stage before proceeding
```

### Pattern 2: Parallel Specialists

**When**: Multiple independent tasks can run simultaneously

```
                Main Coordinator
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
    Backend       Frontend       Database
    Agent          Agent          Agent
        │              │              │
        └──────────────┴──────────────┘
                       │
                   Combiner
```

**Example**: Full-stack feature implementation
```
Parallel:
- Backend Agent: REST API endpoints
- Frontend Agent: React components
- Database Agent: Schema changes

Sequential after:
- Integration Agent: Connect all pieces
```

**Claude Code Implementation**:
```
Main agent launches 3 Task calls simultaneously:
- All 3 run in parallel (Claude Code supports up to 10 concurrent)
- Main agent waits for all to complete
- Main agent integrates results
```

### Pattern 3: Iterative Refinement

**When**: Quality improvement through multiple passes

```
Round 1: Draft Agent → Reviewer Agent → feedback.txt
                                ↓
Round 2: Draft Agent (with feedback) → Reviewer → feedback.txt
                                ↓
Round 3: Draft Agent (with feedback) → Reviewer → ✅ Approved
```

**Example**: Code generation with quality gates
```
Iteration 1:
- Generator: Create initial implementation
- Reviewer: Check for bugs → 5 issues found
- Feedback: "Fix null pointer exceptions, add error handling"

Iteration 2:
- Generator: Fix issues from feedback
- Reviewer: Re-check → 2 issues remaining
- Feedback: "Add input validation"

Iteration 3:
- Generator: Final fixes
- Reviewer: Re-check → ✅ All tests pass
```

**Claude Code Implementation**:
```python
max_iterations = 5
for i in range(max_iterations):
    # Task 1: Generate/improve code
    implementation = Task(general-purpose, "Implement feature with feedback")

    # Task 2: Review
    review = Task(code-reviewer, "Review implementation")

    if review.status == "APPROVED":
        break

    # Pass feedback to next iteration
```

### Pattern 4: Ensemble Voting

**When**: Critical decisions need high confidence

```
        Task Description
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
  Model A    Model B    Model C
  (Qwen)     (DeepSeek) (Llama)
    │          │          │
    └──────────┴──────────┘
              │
         Voting Logic
              │
         Final Decision
```

**Example**: Security vulnerability detection
```
3 specialist agents analyze code:
- Agent A (security focus): Flags 5 issues
- Agent B (general): Flags 3 issues
- Agent C (conservative): Flags 7 issues

Voting:
- Issue #1: 3/3 agents agree → ✅ TRUE POSITIVE
- Issue #2: 1/3 agents flagged → ⚠️  INVESTIGATE
- Issue #3: 2/3 agents agree → ⚠️  LIKELY ISSUE
```

**Claude Code Implementation**:
```
Main agent launches 3 Tasks with same prompt:
- Task 1: general-purpose agent with security instructions
- Task 2: general-purpose agent with conservative parameters
- Task 3: custom security-reviewer agent

Main agent compares outputs:
- Consensus (3/3): Auto-fix
- Majority (2/3): Flag for human review
- Minority (1/3): Log only
```

### Pattern 5: Scatter-Gather

**When**: Distributing work across large dataset, then aggregating

```
Large Dataset (1000 files)
         │
    Scatter Phase
         │
    ┌────┼────┐
    ▼    ▼    ▼
  A1   A2   A3  ... A10 (process 100 files each)
    │    │    │
    Gather Phase
         │
   Aggregated Result
```

**Example**: Codebase-wide refactoring
```
Scatter:
- 10 agents, each handles 1/10th of files
- Agent 1: Refactor files 1-100
- Agent 2: Refactor files 101-200
- ...
- Agent 10: Refactor files 901-1000

Gather:
- Collect all changes
- Check for conflicts
- Generate unified diff
```

**Claude Code Implementation**:
```
files = glob("src/**/*.py")  # 1000 files
chunk_size = 100
chunks = [files[i:i+chunk_size] for i in range(0, len(files), chunk_size)]

results = []
for chunk in chunks:
    task = Task(general-purpose, f"Refactor files: {chunk}")
    results.append(task)

# Main agent aggregates results from all tasks
```

---

## Framework Comparison

### Claude Code vs Other Frameworks

| Feature | Claude Code | LangGraph | AutoGen | CrewAI |
|---------|-------------|-----------|---------|--------|
| **Ease of Use** | ⭐⭐⭐⭐⭐ Natural language | ⭐⭐ Code required | ⭐⭐⭐ Moderate | ⭐⭐⭐⭐ Role-based |
| **Orchestration** | Task tool (max 10 parallel) | DAG-based graphs | Conversation chains | Sequential/parallel crews |
| **Context Sharing** | Separate per agent | Centralized state | Message passing | Shared context |
| **Parallelism** | ✅ Built-in (10 concurrent) | ✅ Graph nodes | ⚠️  Limited | ✅ Parallel tasks |
| **Human-in-Loop** | ✅ Native approval | ⚠️  Manual | ✅ Built-in | ⚠️  Custom |
| **Tool Access** | Granular per agent | Custom functions | Function calling | Integrated tools |
| **Best For** | Rapid prototyping, coding tasks | Complex workflows with branching | Conversational agents | Business workflows |
| **Learning Curve** | Low (English prompts) | High (graph programming) | Medium (Python) | Low-Medium |
| **Production Ready** | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️  MVP stage |
| **Cost Model** | Pay per token | Custom deployment | Custom deployment | Custom deployment |

### When to Use Each Framework

#### Claude Code ✅
- **Best for**: Software engineering, code analysis, rapid iteration
- **Strengths**:
  - Zero setup (just talk in English)
  - Integrated with codebase (Read, Write, Edit, Bash)
  - Human approval at critical stages
  - Perfect for Level 6+ coding tasks
- **Limitations**:
  - Max 10 concurrent agents
  - No custom orchestration logic (linear Task calls)
  - Agents can't spawn sub-agents

**Use when**: Building software, analyzing codebases, prototyping quickly

#### LangGraph ✅
- **Best for**: Complex decision trees, conditional workflows, state machines
- **Strengths**:
  - DAG-based control flow (conditionals, loops, branching)
  - Centralized state management
  - Explicit edge definitions (fine control)
  - Checkpointing and persistence
- **Limitations**:
  - Requires Python programming
  - Steeper learning curve
  - More boilerplate code

**Use when**: Workflows have complex branching logic, need state persistence

#### AutoGen ✅
- **Best for**: Multi-party conversations, human-in-the-loop systems
- **Strengths**:
  - Group chat patterns (multiple agents debate)
  - Rich observability (conversation logs)
  - Human proxy agent (seamless human integration)
  - Reflection patterns (agents critique each other)
- **Limitations**:
  - Less intuitive orchestration
  - Conversation-focused (not workflow-focused)
  - Requires more setup

**Use when**: Need multi-agent debate, human experts in the loop, auditable decisions

#### CrewAI ✅
- **Best for**: Role-based business workflows, MVPs, hackathons
- **Strengths**:
  - Intuitive role assignments (Manager, Developer, QA)
  - Fast to prototype
  - Built-in RAG support
  - Sequential and parallel execution
- **Limitations**:
  - Less mature than others
  - Limited customization
  - Better for simple workflows

**Use when**: Building MVPs, clear role separation, business process automation

---

## Planning Methodology

### Step-by-Step: How to Plan a Multi-Agent Pipeline

#### Step 1: Decompose the Task

Break mega-task into independent subtasks:

**Example**: "Migrate 500K LOC enterprise platform Node.js → Python"

```
Decomposition:
├── Analysis Phase
│   ├── Map API surface (REST endpoints, GraphQL)
│   ├── Identify dependencies (npm packages → pip)
│   ├── Catalog database queries
│   └── Find configuration files
│
├── Planning Phase
│   ├── Design new architecture
│   ├── Plan migration order (what first)
│   ├── Identify risks
│   └── Create test strategy
│
├── Implementation Phase (parallelizable)
│   ├── Convert authentication module
│   ├── Convert API routes
│   ├── Convert database layer
│   ├── Convert business logic
│   └── Convert utilities
│
└── Verification Phase
    ├── Run test suite
    ├── Performance benchmarks
    └── Security audit
```

#### Step 2: Identify Dependencies

Create dependency graph:

```
Analysis ─────→ Planning ─────→ Implementation ─────→ Verification
   ↓                               ↓ (no dependencies between)
Sequential                       Parallel
```

**Dependency Rules**:
- **Sequential**: B needs A's output → A must complete before B starts
- **Parallel**: A and B independent → run simultaneously
- **Conditional**: B only runs if A meets criteria → decision node

#### Step 3: Choose Orchestration Pattern

| Task Type | Pattern | Reason |
|-----------|---------|--------|
| Linear dependencies | Sequential Pipeline | Each stage needs previous output |
| Independent tasks | Parallel Specialists | No shared dependencies |
| Quality critical | Iterative Refinement | Multiple review passes |
| High-stakes decisions | Ensemble Voting | Reduce false positives |
| Large dataset | Scatter-Gather | Distribute work across agents |

#### Step 4: Select Agent Specializations

Assign roles based on task requirements:

```
Task: Enterprise migration

Agents:
1. Analysis Agent
   - Tools: Read, Grep, Glob (read-only)
   - Model: Haiku (fast, cost-effective)
   - Goal: Map codebase structure

2. Architecture Agent
   - Tools: Read, Write (design docs)
   - Model: Sonnet (balanced)
   - Goal: Design migration plan

3. Implementation Agents (5x in parallel)
   - Tools: Read, Write, Edit, Bash
   - Model: Sonnet or Opus (quality matters)
   - Goal: Convert code modules

4. Security Agent
   - Tools: Read, Grep (audit only)
   - Model: Opus (catch all issues)
   - Goal: Security review

5. Test Agent
   - Tools: Read, Write, Bash (run tests)
   - Model: Sonnet
   - Goal: Verify correctness
```

#### Step 5: Design Communication Protocol

How agents share information:

**Option A: File-based** (Claude Code default)
```
Agent 1: Writes findings to analysis_report.json
Agent 2: Reads analysis_report.json, writes to architecture.md
Agent 3: Reads architecture.md, writes code
```

**Option B: Centralized State** (LangGraph)
```python
state = {
    "findings": [],
    "architecture": {},
    "code_changes": []
}

# Each agent updates state
def analysis_agent(state):
    state["findings"] = analyze()
    return state
```

**Option C: Message Passing** (AutoGen)
```python
# Agents send messages to each other
analysis_agent.send(findings, to=planning_agent)
planning_agent.send(architecture, to=implementation_agent)
```

#### Step 6: Define Success Criteria

Each agent should have clear exit conditions:

```yaml
Analysis Agent:
  Success:
    - Found all API endpoints (grep returns 0 errors)
    - Catalogued dependencies (requirements.txt generated)
    - Mapped DB queries (queries.json created)
  Failure:
    - Missing critical files
    - Timeout (>10 minutes)

Implementation Agent:
  Success:
    - All tests pass (pytest exit code 0)
    - No syntax errors (python -m py_compile)
    - Meets coverage threshold (>80%)
  Failure:
    - Tests fail
    - Syntax errors
    - Coverage <80%
```

#### Step 7: Plan Error Handling

```
Error Handling Strategy:

1. Retry with backoff
   - Agent fails → wait 5s → retry
   - 2nd fail → wait 15s → retry
   - 3rd fail → escalate to human

2. Graceful degradation
   - Analysis agent can't find all files
   - → Use partial results + human review
   - → Don't block entire pipeline

3. Checkpoint system
   - Save state after each completed agent
   - If failure, resume from last checkpoint
   - Don't re-run completed work

4. Human escalation triggers
   - Any security issue found
   - >3 agent failures
   - Confidence <70% on critical decision
```

#### Step 8: Estimate Costs

```
Cost Calculation:

Agent 1 (Analysis):
- Model: Claude Haiku ($0.25/M input, $1.25/M output)
- Input: 100K tokens (codebase)
- Output: 10K tokens (report)
- Cost: (100K × $0.25/M) + (10K × $1.25/M) = $0.04

Agent 2 (Planning):
- Model: Claude Sonnet ($3/M input, $15/M output)
- Input: 50K tokens (report + examples)
- Output: 20K tokens (architecture doc)
- Cost: (50K × $3/M) + (20K × $15/M) = $0.45

Agents 3-7 (Implementation, 5 parallel):
- Model: Claude Sonnet
- Input: 200K tokens each (architecture + code)
- Output: 150K tokens each (new code)
- Cost per agent: (200K × $3/M) + (150K × $15/M) = $2.85
- Total (5x): $14.25

Agent 8 (Verification):
- Model: Claude Opus ($15/M input, $75/M output)
- Input: 500K tokens (all new code)
- Output: 50K tokens (review)
- Cost: (500K × $15/M) + (50K × $75/M) = $11.25

Total Pipeline Cost: $26.00 (one-time)
```

---

## Practical Implementation Examples

### Example 1: Level 6 - Enterprise Codebase Migration (500K LOC)

**Task**: Migrate Node.js monolith to Python microservices

**Orchestration**: Hybrid (Sequential phases with parallel execution within)

```markdown
## Phase 1: Discovery & Analysis (Parallel)
Duration: 2 hours
Cost: $5

Agent 1A: API Surface Mapper
- Task: Find all Express routes, document REST endpoints
- Tools: Grep, Read
- Model: Haiku (fast)
- Output: api_endpoints.json

Agent 1B: Dependency Analyzer
- Task: Parse package.json, find Python equivalents
- Tools: Read, WebSearch (for package mapping)
- Model: Haiku
- Output: dependency_map.json

Agent 1C: Database Query Extractor
- Task: Find all SQL queries, stored procedures
- Tools: Grep, Read
- Model: Haiku
- Output: database_queries.json

Agent 1D: Configuration Auditor
- Task: Find .env, config files, secrets
- Tools: Glob, Read
- Model: Sonnet (security important)
- Output: config_inventory.json

## Phase 2: Architecture Design (Sequential, waits for Phase 1)
Duration: 3 hours
Cost: $15

Agent 2: Architecture Planner
- Task: Design microservices breakdown using Phase 1 outputs
- Input: All .json files from Phase 1
- Tools: Read, Write
- Model: Opus (critical decision)
- Output: architecture.md, migration_order.md

## Phase 3: Implementation (Parallel, waits for Phase 2)
Duration: 40 hours (8 hours each in parallel)
Cost: $500

Agent 3A: Authentication Service
- Task: Convert auth module to FastAPI microservice
- Input: architecture.md, api_endpoints.json (filtered)
- Tools: Read, Write, Edit, Bash (run tests)
- Model: Sonnet
- Output: services/auth/

Agent 3B: User Service
- Task: Convert user management to FastAPI
- Tools: Read, Write, Edit, Bash
- Model: Sonnet
- Output: services/users/

Agent 3C: Product Service
- Task: Convert product catalog to FastAPI
- Tools: Read, Write, Edit, Bash
- Model: Sonnet
- Output: services/products/

Agent 3D: Order Service
- Task: Convert order processing to FastAPI
- Tools: Read, Write, Edit, Bash
- Model: Sonnet
- Output: services/orders/

Agent 3E: Notification Service
- Task: Convert email/SMS to FastAPI
- Tools: Read, Write, Edit, Bash
- Model: Sonnet
- Output: services/notifications/

## Phase 4: Integration & Testing (Sequential, waits for Phase 3)
Duration: 8 hours
Cost: $100

Agent 4A: Integration Engineer
- Task: Connect all microservices, set up API gateway
- Input: All services/ directories
- Tools: Read, Write, Bash (docker-compose)
- Model: Sonnet
- Output: docker-compose.yml, api-gateway config

Agent 4B: Test Suite Runner
- Task: Run full integration tests
- Tools: Bash, Read
- Model: Haiku (just running tests)
- Output: test_results.json

## Phase 5: Security & Performance Audit (Parallel, waits for Phase 4)
Duration: 4 hours
Cost: $80

Agent 5A: Security Auditor
- Task: Scan for vulnerabilities (SQL injection, auth bypasses)
- Tools: Read, Grep, custom security scanner
- Model: Opus (catch everything)
- Output: security_report.md

Agent 5B: Performance Benchmarker
- Task: Run load tests, profile bottlenecks
- Tools: Bash (k6, locust), Read
- Model: Sonnet
- Output: performance_report.md

## Total Project
Timeline: 57 hours (vs 2,880 hours single-agent)
Cost: $700 (vs $33,600 single-agent)
Speedup: 50x
Cost Savings: 98%
```

**Claude Code Implementation**:

```markdown
In Claude Code conversation:

User: "Migrate our Node.js monolith to Python microservices.
       Use multi-agent pipeline to parallelize work."

Claude (Main Agent):
"I'll orchestrate a multi-phase migration with parallel agents.

Phase 1: Discovery (launching 4 parallel Tasks)...
[Launches 4 Explore agents simultaneously]

✅ Phase 1 complete (2 hours)
- Found 147 API endpoints
- Mapped 83 npm packages to pip equivalents
- Extracted 412 database queries
- Identified 23 configuration files

Phase 2: Architecture (launching 1 Task)...
[Launches Plan agent]

✅ Phase 2 complete (3 hours)
- Designed 5 microservices
- Created migration order
- Identified 12 risks

Phase 3: Implementation (launching 5 parallel Tasks)...
[Launches 5 general-purpose agents simultaneously]

⚠️ Agent 3B (User Service) failed tests
- Issue: Password hashing algorithm mismatch
- Launching repair Task...

✅ Phase 3 complete (45 hours wall time, 9 hours real time)
- 5 microservices implemented
- All tests passing
- Docker containers built

Phase 4: Integration (launching 2 sequential Tasks)...

✅ Phase 4 complete (8 hours)
- API gateway configured
- Integration tests passing (412/412)

Phase 5: Audit (launching 2 parallel Tasks)...

⚠️ Security audit found 3 issues:
1. Missing rate limiting on auth endpoint
2. Secrets in environment variables (should use vault)
3. CORS configuration too permissive

Human approval needed: Review security findings?
[User reviews and approves fixes]

✅ Migration complete!
Total time: 2.5 days (vs 6 months single-agent)
All tests passing, ready for staging deployment.
"
```

### Example 2: Level 7 - Novel Consensus Algorithm Implementation

**Task**: Implement Raft consensus algorithm from research paper

**Orchestration**: Iterative Refinement with Ensemble Voting

```markdown
## Iteration 1: Research & Initial Design

Agent R1: Research Agent
- Task: Read Raft paper, extract algorithm details
- Model: Opus (deep understanding)
- Output: algorithm_spec.md

Agent D1: Design Agent
- Task: Design Go implementation based on spec
- Model: Sonnet
- Output: design.md, pseudocode

Agent C1: Critic Agent (Ensemble: 3 models)
- Task: Review design for correctness vs Raft spec
- Models: Opus + Sonnet + DeepSeek-V3
- Voting: 2/3 flagged issues with leader election
- Output: critique_iteration1.md

Issues found: 7

## Iteration 2: Refinement

Agent D2: Design Agent
- Task: Fix leader election based on critique
- Input: critique_iteration1.md
- Model: Sonnet
- Output: design_v2.md

Agent I2: Implementation Agent
- Task: Write initial Go code
- Model: Sonnet
- Output: raft.go, log.go, state_machine.go

Agent T2: Test Agent
- Task: Write test suite
- Model: Sonnet
- Output: raft_test.go

Agent C2: Critic Ensemble
- Voting: 1/3 flagged issues (log compaction)
- Output: critique_iteration2.md

Issues found: 3

## Iteration 3: Correctness Verification

Agent I3: Implementation Agent
- Task: Fix log compaction bug
- Model: Sonnet
- Output: Updated raft.go

Agent TV3: Test + Verification Agent
- Task: Run Jepsen-style tests (partition, fault injection)
- Model: Sonnet
- Output: test_results.json

Agent FV3: Formal Verification Agent
- Task: Use TLA+ to verify safety properties
- Model: Opus (complex formal methods)
- Output: raft.tla, verification_results.txt

Agent C3: Final Critic Ensemble
- Voting: 0/3 flagged critical issues
- Output: ✅ APPROVED

## Iteration 4: Optimization & Documentation

Agent O4: Optimization Agent
- Task: Profile performance, optimize hot paths
- Model: Sonnet
- Output: Optimized raft.go (2.5x faster)

Agent D4: Documentation Agent
- Task: Write comprehensive docs, examples
- Model: Sonnet
- Output: README.md, ARCHITECTURE.md, examples/

## Total Project
Iterations: 4
Timeline: 3 weeks (vs 3 months human expert)
Cost: $8,000
Validation: Formal verification passed, Jepsen tests passed
```

### Example 3: Level 6 - AI-Powered Code Review System

**Task**: Build automated code review system for pull requests

**Orchestration**: Parallel Specialists + Ensemble Voting

```markdown
## Architecture

PR Submitted (500 lines changed)
         │
    Scatter Phase (Parallel Analysis)
         │
    ┌────┼────┬────┬────┐
    ▼    ▼    ▼    ▼    ▼
   A1   A2   A3   A4   A5

A1: Security Specialist
- Model: Opus (critical)
- Focus: SQL injection, XSS, auth bypasses
- Confidence threshold: 90%

A2: Performance Specialist
- Model: Sonnet
- Focus: N+1 queries, memory leaks, Big O
- Confidence threshold: 80%

A3: Code Quality Specialist
- Model: Sonnet
- Focus: Code smells, DRY violations, naming
- Confidence threshold: 70%

A4: Test Coverage Specialist
- Model: Haiku (fast)
- Focus: Untested code paths, edge cases
- Confidence threshold: 85%

A5: Documentation Specialist
- Model: Haiku
- Focus: Missing docstrings, outdated comments
- Confidence threshold: 75%

## Voting & Aggregation

Each agent outputs:
{
  "findings": [
    {
      "file": "app.py",
      "line": 42,
      "severity": "critical",
      "category": "security",
      "message": "SQL injection vulnerability",
      "confidence": 0.95
    }
  ]
}

Aggregation Logic:
1. Collect all findings from 5 agents
2. Deduplicate (same file:line)
3. Voting:
   - If 3+ agents agree → Auto-comment on PR
   - If 2 agents agree → Flag for human review
   - If 1 agent only → Log to analytics
4. Severity override:
   - Any "critical" security → Block PR (require human approval)
   - 3+ "high" severity → Request changes
   - <3 "high" → Approve with suggestions

## Implementation in Claude Code

User: "Review PR #1234"

Claude:
[Fetches PR diff using GitHub API]

Launching 5 specialist agents in parallel...

Agent 1 (Security): Found 2 critical issues
- SQL injection in login.py:42
- Hardcoded API key in config.py:15

Agent 2 (Performance): Found 1 high issue
- N+1 query in get_users() loop

Agent 3 (Code Quality): Found 5 low issues
- Function too long (45 lines)
- Variable naming (x, tmp)

Agent 4 (Test Coverage): Found 1 medium issue
- No tests for new error handling

Agent 5 (Documentation): Found 3 low issues
- Missing docstring on new function
- Outdated comment references old API

Aggregating results...

Voting consensus:
- SQL injection: 5/5 agents flagged → ✅ CONSENSUS
- API key: 5/5 agents flagged → ✅ CONSENSUS
- N+1 query: 4/5 agents flagged → ✅ STRONG CONSENSUS
- Function length: 2/5 agents flagged → ⚠️  INVESTIGATE
- Missing tests: 3/5 agents flagged → ✅ CONSENSUS

Decision: BLOCK PR (2 critical security issues)

Posting review to GitHub:
---
## 🔴 Review: Changes Requested

### Critical Issues (2)
1. **SQL Injection** (login.py:42)
   - Use parameterized queries
   - Confidence: 95% (consensus: 5/5 agents)

2. **Hardcoded Secret** (config.py:15)
   - Move API key to environment variable
   - Confidence: 98% (consensus: 5/5 agents)

### High Priority (1)
3. **N+1 Query** (users.py:78)
   - Use eager loading: User.query.options(joinedload('orders'))
   - Confidence: 88% (consensus: 4/5 agents)

### Suggested Improvements (1)
4. **Test Coverage** (error_handler.py)
   - Add tests for new error handling logic
   - Confidence: 82% (consensus: 3/5 agents)
---

PR blocked pending fixes. ✋
```

---

## Cost Optimization Strategies

### Strategy 1: Model Selection per Agent

```markdown
Use cheaper models for routine tasks:

Expensive (Opus $15/M input):
- Critical security reviews
- Architecture decisions
- Formal verification

Mid-Range (Sonnet $3/M input):
- Code implementation
- Refactoring
- Integration work

Cheap (Haiku $0.25/M input):
- Code search
- File analysis
- Test running
- Documentation

Example savings:
All Opus: 1M tokens × $15/M = $15
Mixed (30% Opus, 50% Sonnet, 20% Haiku):
  300K × $15/M + 500K × $3/M + 200K × $0.25/M = $6.05
Savings: 60%
```

### Strategy 2: Caching & Checkpointing

```markdown
Avoid re-analyzing same code:

Without caching:
- Agent analyzes 100K LOC codebase
- Cost: 500K tokens × $3/M = $1.50
- Run 10 times = $15

With caching:
- First run: $1.50
- Cache analysis_report.json
- Subsequent runs: Read cache (1K tokens) × $3/M = $0.003
- 9 more runs: $0.027
- Total: $1.53 (vs $15)
Savings: 90%
```

### Strategy 3: Pruning Context

```markdown
Only send relevant context to each agent:

Without pruning:
- Send entire 500K LOC codebase to each agent
- 5 agents × 500K tokens = 2.5M tokens
- Cost: 2.5M × $3/M = $7.50

With pruning:
- Agent 1 (auth module): Only auth files (50K tokens)
- Agent 2 (API routes): Only routes (80K tokens)
- Agent 3 (database): Only models + migrations (60K tokens)
- Agent 4 (frontend): Only React components (100K tokens)
- Agent 5 (tests): Only test files (70K tokens)
- Total: 360K tokens
- Cost: 360K × $3/M = $1.08
Savings: 86%
```

### Strategy 4: Async Parallel Execution

```markdown
Reduce wall-clock time (developer waiting):

Sequential:
- 10 agents, 1 hour each
- Total: 10 hours waiting

Parallel (Claude Code max 10):
- 10 agents, all run simultaneously
- Total: 1 hour waiting
Speedup: 10x
```

### Strategy 5: Early Stopping

```markdown
Stop agents when confidence threshold met:

Ensemble voting:
- Run 3 agents in parallel
- If first 2 agree (consensus): Stop agent 3
- Saves 33% compute

Iterative refinement:
- Max 5 iterations planned
- If quality >95% after 2 iterations: Stop
- Saves 60% compute
```

---

## Conclusion

Multi-agent pipelines transform impossible tasks into tractable projects through:

1. **Parallelization**: 10-50x speedup vs single-agent
2. **Specialization**: Expert agents for each domain
3. **Quality**: Ensemble voting catches edge cases
4. **Cost Efficiency**: Right model for right task

### When to Use Multi-Agent

✅ **Use multi-agent when:**
- Task requires >200K token context
- 100+ files need modification
- Multiple independent subtasks exist
- Quality critical (>95% required)
- Timeline matters (parallel work)

❌ **Stick with single-agent when:**
- Task fits in 128K context window
- <20 files affected
- Sequential dependencies (can't parallelize)
- Simple CRUD operations
- Budget <$100

### Next Steps

1. **Read**: ULTRA_COMPLEXITY_LEVEL_6_PLUS.md for Level 6-8 framework
2. **Practice**: Start with Pattern 2 (Parallel Specialists) on small task
3. **Measure**: Track cost and time savings
4. **Optimize**: Use Strategy 1-5 to reduce costs
5. **Scale**: Apply to enterprise projects

---

## Appendix: Quick Reference

### Claude Code Subagent Patterns

```markdown
# Pattern 1: Sequential Research → Implementation
Task(Explore, "Find all auth files") → files.json
Task(general-purpose, "Refactor auth using files.json") → refactored code

# Pattern 2: Parallel Analysis
Task(Explore, "Security audit") in parallel with
Task(Explore, "Performance profiling") in parallel with
Task(Explore, "Test coverage analysis")

# Pattern 3: Iterative Improvement
for i in range(max_iterations):
    Task(general-purpose, "Improve code")
    review = Task(code-reviewer, "Review quality")
    if review.score > 95:
        break

# Pattern 4: Scatter-Gather
files = glob("src/**/*.py")
for chunk in files.split(n=10):
    Task(general-purpose, f"Process {chunk}")
```

### Cost Calculator

```python
def estimate_cost(agents):
    total = 0
    for agent in agents:
        input_cost = agent.input_tokens * MODEL_PRICING[agent.model]["input"] / 1_000_000
        output_cost = agent.output_tokens * MODEL_PRICING[agent.model]["output"] / 1_000_000
        total += input_cost + output_cost
    return total

MODEL_PRICING = {
    "opus": {"input": 15, "output": 75},
    "sonnet": {"input": 3, "output": 15},
    "haiku": {"input": 0.25, "output": 1.25}
}
```

### Decision Tree

```
Is task >100 files?
├─ Yes → Multi-agent
└─ No → Is context >200K tokens?
    ├─ Yes → Multi-agent
    └─ No → Is quality critical (>95%)?
        ├─ Yes → Multi-agent (ensemble voting)
        └─ No → Single-agent
```

---

**Document Version**: 1.0
**Last Updated**: 2025-01-18
**Related Docs**:
- ULTRA_COMPLEXITY_LEVEL_6_PLUS.md
- TASK_GRADING_GUIDE.md
- model_catalog_2025.json
