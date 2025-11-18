# Claude Code Subagent Patterns - Quick Reference

**Practical templates for using Task tool and subagents in Claude Code**

Last Updated: 2025-01-18

---

## Table of Contents

1. [How to Ask Claude to Use Subagents](#how-to-ask-claude-to-use-subagents)
2. [Common Patterns](#common-patterns)
3. [Custom Subagent Templates](#custom-subagent-templates)
4. [Real Conversation Examples](#real-conversation-examples)
5. [Troubleshooting](#troubleshooting)

---

## How to Ask Claude to Use Subagents

### Basic Syntax

Claude Code responds to natural language requests for parallel work:

```
❌ Don't say: "Use the Task tool to spawn 5 subagents"
✅ Do say: "Analyze this in parallel using multiple agents"
✅ Do say: "Use subagents to speed this up"
✅ Do say: "Parallelize this work across the codebase"
```

### Explicit Patterns

For complex orchestration, be specific:

```markdown
User: "Migrate our authentication system. Use this pipeline:
1. Research phase (3 parallel agents): Find all auth code, security issues, test coverage
2. Planning phase (1 agent): Design new architecture
3. Implementation phase (5 parallel agents): Convert each module
4. Verification phase (2 parallel agents): Run tests + security audit"

Claude will recognize the pipeline structure and use Task tool appropriately.
```

---

## Common Patterns

### Pattern 1: Parallel Codebase Analysis

**Use when**: Need to analyze large codebase across multiple dimensions

```markdown
User: "Analyze our codebase for:
- Security vulnerabilities
- Performance issues
- Code quality issues
- Test coverage gaps
Run these in parallel."

Claude responds:
"I'll launch 4 parallel Explore agents to analyze different aspects simultaneously..."

[4 Task tool calls execute in parallel]

Results aggregated:
- Security: 3 critical issues found
- Performance: 12 slow queries identified
- Quality: 45 code smells detected
- Coverage: 23% of code untested
```

**Behind the scenes**:
```
Task(Explore, "Find security vulnerabilities in codebase", thoroughness="very thorough")
Task(Explore, "Identify performance bottlenecks", thoroughness="medium")
Task(Explore, "Detect code quality issues", thoroughness="medium")
Task(Explore, "Calculate test coverage gaps", thoroughness="quick")
```

### Pattern 2: Sequential Pipeline with Checkpoints

**Use when**: Each stage depends on previous stage output

```markdown
User: "Add OAuth authentication:
1. First, research existing auth code
2. Then design OAuth integration
3. Then implement it
4. Finally test everything
Use separate agents for each stage."

Claude responds:
"I'll execute this as a 4-stage pipeline with checkpoints..."

Stage 1 (Research):
[Task tool call] → Outputs: auth_analysis.md

✅ Checkpoint 1 complete

Stage 2 (Design):
[Task tool call using auth_analysis.md] → Outputs: oauth_design.md

✅ Checkpoint 2 complete

[User can review/intervene here]

Stage 3 (Implementation):
[Task tool call using oauth_design.md] → Outputs: code changes

✅ Checkpoint 3 complete

Stage 4 (Testing):
[Task tool call] → Outputs: test results

✅ All stages complete
```

### Pattern 3: Scatter-Gather for Large Refactoring

**Use when**: Need to modify 100+ files consistently

```markdown
User: "Refactor all API routes to use new error handling pattern.
We have 150 route files. Use scatter-gather to parallelize."

Claude responds:
"I'll divide the 150 files into 10 batches and process in parallel..."

Scatter Phase:
[10 Task tool calls, each handling 15 files]

Agent 1: routes/auth/*.py (15 files)
Agent 2: routes/users/*.py (15 files)
...
Agent 10: routes/analytics/*.py (15 files)

Gather Phase:
All changes collected, conflicts resolved
Generated unified test suite

✅ 150 files refactored in 8 minutes (vs 80 minutes sequential)
```

### Pattern 4: Ensemble Voting for Critical Decisions

**Use when**: Need high confidence on important changes

```markdown
User: "Review this security patch for vulnerabilities.
Use ensemble voting with 3 different approaches."

Claude responds:
"I'll analyze the patch using 3 independent reviewers..."

Reviewer 1 (Conservative security scan):
[Task with strict security rules] → Found: 2 issues

Reviewer 2 (General code review):
[Task with balanced approach] → Found: 1 issue

Reviewer 3 (Performance-focused):
[Task checking for security performance issues] → Found: 2 issues

Voting Results:
- Issue A (SQL injection): 3/3 agree → ✅ CONFIRMED
- Issue B (rate limiting): 2/3 agree → ⚠️ LIKELY
- Issue C (logging): 1/3 flagged → ℹ️ OPTIONAL

High-confidence finding: SQL injection must be fixed
```

### Pattern 5: Iterative Refinement with Quality Gates

**Use when**: Need multiple improvement passes

```markdown
User: "Implement complex algorithm with iterative refinement.
Keep improving until all tests pass and code review approves."

Claude responds:
"I'll use iterative refinement with quality gates..."

Iteration 1:
[Task: Implement] → code v1
[Task: Test] → 15/20 tests pass
[Task: Review] → 8 issues found

Quality gate: ❌ Not ready (tests failing)

Iteration 2:
[Task: Fix issues from review] → code v2
[Task: Test] → 20/20 tests pass
[Task: Review] → 2 minor style issues

Quality gate: ⚠️ Tests pass but review concerns

Iteration 3:
[Task: Address style issues] → code v3
[Task: Review] → ✅ Approved

Quality gate: ✅ PASSED
```

---

## Custom Subagent Templates

### Template 1: Code Reviewer Agent

Create `.claude/agents/code-reviewer.md`:

```markdown
---
name: code-reviewer
description: Expert code reviewer for security, performance, and quality
tools:
  - Read
  - Grep
  - Glob
model: sonnet
color: red
---

# Code Reviewer Agent

You are an expert code reviewer. For each file you review:

## Security Checklist
- [ ] No SQL injection (parameterized queries)
- [ ] No XSS (input sanitization)
- [ ] No hardcoded secrets
- [ ] Proper authentication checks
- [ ] Rate limiting on public endpoints

## Performance Checklist
- [ ] No N+1 queries
- [ ] Efficient algorithms (no O(n²) where O(n) possible)
- [ ] Proper indexing on database queries
- [ ] No memory leaks
- [ ] Caching where appropriate

## Quality Checklist
- [ ] Functions <50 lines
- [ ] No code duplication
- [ ] Clear variable names
- [ ] Error handling present
- [ ] Tests exist and pass

## Output Format

For each issue:
```
🔴 CRITICAL: [file.py:42] SQL injection vulnerability
   Current: cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
   Fix: cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
```

Severity levels:
- 🔴 CRITICAL: Security, data loss, crashes
- 🟡 WARNING: Performance, maintainability
- 🟢 SUGGESTION: Code style, minor improvements
```

**Usage**:
```markdown
User: "Review my new API endpoint for issues"

Claude: [Launches code-reviewer agent]
```

### Template 2: Migration Specialist Agent

Create `.claude/agents/migration-specialist.md`:

```markdown
---
name: migration-specialist
description: Specializes in code migrations between languages/frameworks
tools:
  - Read
  - Write
  - Grep
  - Glob
model: sonnet
color: blue
---

# Migration Specialist Agent

You specialize in migrating code between languages and frameworks.

## Process

### 1. Analysis Phase
- Read source files
- Identify patterns (frameworks, libraries, idioms)
- Map dependencies source → target
- Note incompatibilities

### 2. Planning Phase
- Determine migration order (least → most dependencies)
- Identify risks
- Plan fallback strategies

### 3. Implementation Phase
- Translate syntax
- Convert APIs to target equivalents
- Preserve logic and behavior
- Add target-specific improvements (e.g., type hints in Python)

### 4. Verification Phase
- Ensure tests pass
- Check for regressions
- Validate performance (should be ±20% of original)

## Output

Provide:
1. migration_plan.md (strategy document)
2. Converted code files
3. dependency_mapping.json (old → new libraries)
4. test_results.md (validation report)

## Common Pitfalls to Avoid

- Don't change business logic during migration
- Don't skip error handling
- Don't ignore edge cases from original
- Don't remove tests (convert them)
```

### Template 3: Performance Optimizer Agent

Create `.claude/agents/perf-optimizer.md`:

```markdown
---
name: perf-optimizer
description: Identifies and fixes performance bottlenecks
tools:
  - Read
  - Write
  - Bash
  - Grep
model: sonnet
color: yellow
---

# Performance Optimizer Agent

You identify and fix performance issues.

## Analysis Tools

1. **Database Queries**
   - Find N+1 queries: grep for queries in loops
   - Check for missing indexes
   - Identify slow queries (EXPLAIN ANALYZE)

2. **Algorithm Complexity**
   - Scan for nested loops (O(n²))
   - Find inefficient data structures
   - Identify unnecessary computations

3. **Memory Usage**
   - Find memory leaks
   - Identify large objects kept in memory
   - Check for unbounded growth

## Optimization Strategies

### Database
```python
# Before (N+1):
for user in users:
    orders = Order.query.filter_by(user_id=user.id).all()

# After (1 query):
users = User.query.options(joinedload('orders')).all()
```

### Algorithms
```python
# Before O(n²):
for i in items:
    if i in other_items:  # list lookup

# After O(n):
other_set = set(other_items)  # hash set
for i in items:
    if i in other_set:  # O(1) lookup
```

### Caching
```python
# Before:
def expensive_computation(x):
    return compute(x)  # runs every time

# After:
@lru_cache(maxsize=1000)
def expensive_computation(x):
    return compute(x)  # cached
```

## Measurement

Before/after metrics:
- Execution time (use profiler)
- Memory usage (use memory_profiler)
- Database queries (use query logger)
- API response time (use benchmark tool)

Require >20% improvement to justify changes.
```

---

## Real Conversation Examples

### Example 1: Full-Stack Feature Implementation

```markdown
User: "Add bookmark feature to our website. Use parallel agents for frontend and backend."

Claude: "I'll use 2 parallel agents for frontend and backend, then integrate."

[Launches 2 Task tool calls simultaneously]

Task 1 (Backend Agent):
"Implementing backend for bookmarks..."
- Created models/bookmark.py
- Added routes/bookmarks.py (REST API)
- Wrote tests/test_bookmarks.py
✅ Backend complete (12 minutes)

Task 2 (Frontend Agent):
"Implementing frontend for bookmarks..."
- Created components/BookmarkButton.jsx
- Added state management (Redux)
- Styled with CSS
✅ Frontend complete (15 minutes)

[Main agent integrates]
"Integrating frontend + backend..."
- Connected API calls
- Tested end-to-end
- All 47 tests passing

✅ Bookmark feature complete (18 minutes total vs 30 minutes sequential)
Speedup: 1.67x
```

### Example 2: Security Audit of Large Codebase

```markdown
User: "Perform comprehensive security audit of our 200-file codebase.
Check for SQL injection, XSS, auth issues, secrets, and rate limiting.
Use parallel agents."

Claude: "I'll launch 5 specialized security agents in parallel..."

[Launches 5 Task tool calls]

Agent 1 (SQL Injection Hunter):
Scanned 87 database queries
Found: 3 injection vulnerabilities
- users.py:42, orders.py:156, analytics.py:78

Agent 2 (XSS Scanner):
Scanned 45 templates + 62 API responses
Found: 7 XSS risks
- All in user-generated content rendering

Agent 3 (Auth Auditor):
Checked 134 endpoints
Found: 12 missing auth checks
- Public routes accessing private data

Agent 4 (Secret Scanner):
Scanned all files + git history
Found: 5 hardcoded secrets
- API keys in 3 files, password in config

Agent 5 (Rate Limiter):
Checked public endpoints
Found: 23 endpoints without rate limiting
- All POST routes vulnerable to abuse

[Main agent aggregates + prioritizes]

Security Report:
🔴 CRITICAL (5):
  - SQL injection x3
  - Hardcoded API keys x2

🟡 HIGH (19):
  - Missing auth checks x12
  - XSS vulnerabilities x7

🟢 MEDIUM (23):
  - Missing rate limits x23

Recommended: Fix critical first (4 hours), then high (12 hours)
Total: ~16 hours work with 5 parallel agents = ~3 real hours
```

### Example 3: Complex Refactoring with Confidence Checks

```markdown
User: "Refactor our monolith into microservices.
Use ensemble voting to verify each service is correctly extracted.
I want high confidence before we deploy."

Claude: "I'll extract services using ensemble verification..."

Service 1: Authentication
[Implementation Agent] → Extracts auth to separate service
[Verification Ensemble]:
  - Agent A (correctness): ✅ All auth logic preserved
  - Agent B (completeness): ✅ No missing endpoints
  - Agent C (security): ⚠️ Missing CORS configuration
Consensus: 2/3 ✅ (with caveat)

[Fix CORS issue]
[Re-verify] → 3/3 ✅
Service 1 approved ✅

Service 2: User Management
[Implementation Agent] → Extracts user service
[Verification Ensemble]:
  - Agent A: ✅ Logic correct
  - Agent B: ❌ Missing user deletion endpoint
  - Agent C: ✅ Security good
Consensus: 2/3 with critical missing feature

[Add deletion endpoint]
[Re-verify] → 3/3 ✅
Service 2 approved ✅

Service 3: Orders
[Implementation Agent] → Extracts order service
[Verification Ensemble]:
  - Agent A: ✅ Correct
  - Agent B: ✅ Complete
  - Agent C: ✅ Secure
Consensus: 3/3 ✅ on first try
Service 3 approved ✅

Result: 3 microservices extracted with 95%+ confidence
Deployment recommended ✅
```

### Example 4: Research Paper Implementation

```markdown
User: "Implement the algorithm from this research paper (Raft consensus).
Use iterative refinement until formal verification passes."

Claude: "I'll implement Raft with multiple refinement iterations..."

Iteration 1 (Understanding):
[Task: Research agent reads paper]
✅ Extracted algorithm specification
✅ Created pseudocode

Iteration 2 (Initial Implementation):
[Task: Implementation agent]
✅ Wrote raft.go (500 lines)
[Task: Critic agent]
❌ Found 8 issues with leader election

Iteration 3 (Fix Leader Election):
[Task: Fix agent]
✅ Fixed leader election bugs
[Task: Test agent]
⚠️ 67/100 tests passing

Iteration 4 (Fix Failing Tests):
[Task: Debug agent]
✅ Fixed log replication edge cases
[Task: Test agent]
✅ 100/100 tests passing
[Task: Jepsen agent - chaos testing]
⚠️ Found partition edge case

Iteration 5 (Production Hardening):
[Task: Fix partition handling]
✅ Added partition recovery logic
[Task: Formal verification agent]
✅ TLA+ model checking passed
[Task: Final test suite]
✅ All tests pass, no crashes in 10K iterations

✅ Raft implementation complete and verified
Iterations: 5
Confidence: 99%+ (formal verification passed)
```

---

## Troubleshooting

### Problem: "Claude isn't using subagents"

**Solutions**:

1. **Be explicit about parallelization**:
   ```
   ❌ "Analyze the codebase"
   ✅ "Analyze the codebase using parallel agents for speed"
   ```

2. **Mention scale/complexity**:
   ```
   ✅ "We have 500 files - use multiple agents"
   ✅ "This is a large project, parallelize the work"
   ```

3. **Request specific pattern**:
   ```
   ✅ "Use scatter-gather pattern to process files in batches"
   ✅ "Launch 5 parallel agents, one per module"
   ```

### Problem: "Subagent failed with error"

**Common causes**:

1. **Context too large**: Subagent tried to read entire codebase
   - Solution: Be specific about which files to analyze

2. **Tool permission denied**: Subagent tried to use Bash but only has Read
   - Solution: Request general-purpose agent for full tool access

3. **Timeout**: Task took >10 minutes
   - Solution: Break into smaller subtasks

### Problem: "Results from parallel agents conflict"

**Solutions**:

1. **Use ensemble voting**: Let 3 agents vote on correct approach
2. **Add verification stage**: Single agent checks all parallel outputs
3. **Define interfaces clearly**: Specify exact output format for each agent

### Problem: "Too slow despite using subagents"

**Check**:

1. **Are tasks actually parallel?** If sequential dependencies, no speedup
2. **Is context too large?** Reduce files sent to each agent
3. **Wrong model?** Use Haiku for simple tasks, Sonnet for complex

**Optimizations**:
```markdown
❌ Slow: "Each agent analyzes entire 500-file codebase"
✅ Fast: "Agent 1 analyzes auth/ (50 files), Agent 2 analyzes api/ (50 files), ..."

❌ Slow: "Use Opus for file searching"
✅ Fast: "Use Haiku for searching, Opus for critical reviews"
```

---

## Appendix: Cheat Sheet

### Quick Patterns

```markdown
# Parallel Analysis
"Analyze X, Y, Z in parallel"

# Sequential Pipeline
"Do A, then B, then C - use separate agents for each"

# Scatter-Gather
"We have 500 files, split into 10 batches and process in parallel"

# Ensemble Voting
"Review this using 3 different approaches and vote on issues"

# Iterative Refinement
"Implement this, then iterate until all tests pass"

# Hybrid
"Phase 1: Parallel research (3 agents). Phase 2: Sequential design (1 agent). Phase 3: Parallel implementation (5 agents)."
```

### Model Selection Guide

| Task Type | Model | Why |
|-----------|-------|-----|
| File search, simple analysis | Haiku | Fast, cheap ($0.25/M) |
| Code implementation | Sonnet | Balanced quality/cost ($3/M) |
| Architecture design | Sonnet/Opus | Complex reasoning needed |
| Security review | Opus | Can't miss anything ($15/M) |
| Test running | Haiku | Just executing commands |
| Documentation | Haiku | Straightforward task |

### Cost Estimation

```
Small task (10K tokens):
- Haiku: $0.015
- Sonnet: $0.15
- Opus: $0.90

Medium task (100K tokens):
- Haiku: $0.15
- Sonnet: $1.50
- Opus: $9.00

Large task (500K tokens):
- Haiku: $0.75
- Sonnet: $7.50
- Opus: $45.00
```

**Pro tip**: Mix models within pipeline:
- Haiku for research → Sonnet for implementation → Opus for final security review
- Saves 60-80% vs all-Opus while maintaining quality

---

**Last Updated**: 2025-01-18
**Related Docs**:
- MULTI_AGENT_PIPELINE_GUIDE.md
- ULTRA_COMPLEXITY_LEVEL_6_PLUS.md
