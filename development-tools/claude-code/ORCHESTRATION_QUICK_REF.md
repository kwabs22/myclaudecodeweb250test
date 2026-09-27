# Multi-Agent Orchestration Quick Reference Card

**One-page guide to orchestrating AI agents for complex tasks**

---

## 🎯 When to Use Multi-Agent

| Metric | Single-Agent | Multi-Agent |
|--------|--------------|-------------|
| Files affected | <20 | **100+** |
| Context needed | <128K tokens | **>200K tokens** |
| Timeline critical | No | **Yes (10-50x speedup)** |
| Quality required | 75-85% | **95%+** |
| Parallel tasks | No | **3+ independent tasks** |
| Cost | $15-2,800/month | **$5K-50K/month** |

---

## 🏗️ Orchestration Patterns

### 1. Sequential Pipeline
```
A → B → C → D
```
**When**: B needs A's output
**Example**: Analysis → Planning → Implementation → Verification

### 2. Parallel Specialists
```
     Main
    /  |  \
   A   B   C
    \  |  /
   Combiner
```
**When**: Independent tasks
**Example**: Backend + Frontend + Database in parallel

### 3. Iterative Refinement
```
Draft → Review → Feedback
  ↑__________________|
```
**When**: Quality gates, multiple improvement passes
**Example**: Code → Test → Fix (repeat until 100% pass)

### 4. Ensemble Voting
```
Task → [A, B, C] → Vote → Decision
```
**When**: Critical decisions, high confidence needed
**Example**: 3 security reviewers vote on vulnerabilities

### 5. Scatter-Gather
```
1000 files → [A1...A10] → Aggregate
```
**When**: Large dataset, distributed processing
**Example**: 10 agents refactor 100 files each

---

## ⚙️ Claude Code Subagent System

### Built-in Agent Types

| Type | Speed | Tools | Use For |
|------|-------|-------|---------|
| **Explore** | Fast | All | Finding files, searching code |
| **Plan** | Fast | All | Breaking down tasks, architecture |
| **general-purpose** | Normal | All | Implementation, complex tasks |

### How to Trigger Subagents

```markdown
✅ "Use parallel agents to analyze security + performance"
✅ "Process these 500 files with scatter-gather pattern"
✅ "Launch 5 agents, one per microservice"
✅ "Use ensemble voting with 3 reviewers"

❌ "Analyze the code" (too vague)
```

### Custom Subagent Template

`.claude/agents/my-agent.md`:
```markdown
---
name: my-agent
description: What this agent does
tools: [Read, Write, Grep]  # Or all tools
model: sonnet  # haiku | sonnet | opus
color: blue
---

# Instructions
You are a specialist in...

## Process
1. Step one
2. Step two

## Output Format
Provide results as...
```

---

## 💰 Cost Optimization

### Strategy 1: Model Selection
```
Research/Search    → Haiku   ($0.25/M)  ←  20x cheaper
Implementation     → Sonnet  ($3/M)
Critical Review    → Opus    ($15/M)
```

### Strategy 2: Context Pruning
```
❌ Send 500K LOC to each agent: 2.5M tokens = $7.50
✅ Send only relevant files:    360K tokens = $1.08
Savings: 86%
```

### Strategy 3: Caching
```
❌ Re-analyze same code 10x: $15
✅ Cache first analysis:       $1.53
Savings: 90%
```

### Strategy 4: Early Stopping
```
Planned: 5 iterations
Stop after 2 (quality >95%)
Savings: 60%
```

---

## 📋 Level 6+ Task Checklist

Before launching multi-agent pipeline:

- [ ] Task decomposed into **parallelizable subtasks**
- [ ] Dependencies mapped (sequential vs parallel)
- [ ] Orchestration pattern selected
- [ ] Agent roles defined (specialist per domain)
- [ ] Communication protocol chosen (files, state, messages)
- [ ] Success criteria defined (exit conditions)
- [ ] Error handling planned (retry, escalation)
- [ ] Costs estimated (tokens × pricing)

---

## 🎬 Example: Enterprise Migration (500K LOC)

```
Phase 1: Discovery (Parallel)         Cost: $5    Time: 2h
├── API Surface Mapper (Haiku)
├── Dependency Analyzer (Haiku)
├── Database Extractor (Haiku)
└── Config Auditor (Sonnet)

Phase 2: Architecture (Sequential)     Cost: $15   Time: 3h
└── Planner (Opus - critical)

Phase 3: Implementation (Parallel)     Cost: $500  Time: 8h
├── Auth Service (Sonnet)
├── User Service (Sonnet)
├── Product Service (Sonnet)
├── Order Service (Sonnet)
└── Notification Service (Sonnet)

Phase 4: Integration (Sequential)      Cost: $100  Time: 8h
├── Integration Engineer (Sonnet)
└── Test Runner (Haiku)

Phase 5: Audit (Parallel)              Cost: $80   Time: 4h
├── Security Auditor (Opus)
└── Perf Benchmarker (Sonnet)

Total: $700, 25 real hours (vs $34K, 12 months single-agent)
ROI: 98% cost savings, 50x speedup
```

---

## 🚨 Common Pitfalls

| Problem | Solution |
|---------|----------|
| Agents not parallel | Be explicit: "use parallel agents" |
| Context too large | Prune to relevant files only |
| Conflicts in output | Add ensemble voting or verification stage |
| Cost too high | Mix Haiku/Sonnet/Opus based on criticality |
| Still slow | Check for hidden dependencies (forces sequential) |
| Subagent failed | Reduce scope, check tool permissions |

---

## 🔀 Framework Decision Tree

```
Need coding tasks in existing codebase?
├─ Yes → Claude Code (native integration)
└─ No → Need complex branching logic?
    ├─ Yes → LangGraph (DAG control flow)
    └─ No → Need multi-agent debate?
        ├─ Yes → AutoGen (group chat)
        └─ No → Fast prototype?
            ├─ Yes → CrewAI (role-based)
            └─ No → Build custom
```

---

## 📞 Quick Commands

### Claude Code Natural Language

```markdown
# Sequential
"Do A, then B, then C - separate agents for each"

# Parallel
"Analyze X, Y, Z in parallel using multiple agents"

# Scatter-Gather
"We have 500 files, split into 10 batches, process in parallel"

# Ensemble
"Review using 3 different approaches, vote on findings"

# Iterative
"Implement, then iterate until all tests pass"

# Hybrid
"Phase 1: Parallel research. Phase 2: Planning. Phase 3: Parallel implementation."
```

### Verify Parallelism

```markdown
User: "How many agents will run in parallel?"
Claude: "I'll launch X agents simultaneously..."
```

---

## 📊 ROI Calculator

```python
# Single-agent cost
single_cost = hours × hourly_rate
single_timeline = hours

# Multi-agent cost
multi_cost = (agent_count × tokens × model_price) + orchestration_overhead
multi_timeline = max(parallel_stages) + sum(sequential_stages)

# ROI
speedup = single_timeline / multi_timeline
cost_savings = (single_cost - multi_cost) / single_cost × 100%

# Example: 500K LOC migration
Single: $34K, 2880h (12 months)
Multi:  $700, 57h (2.5 days)
Speedup: 50x
Savings: 98%
```

---

## 🎓 Learning Path

1. **Start**: Single Level 6 task with Pattern 2 (Parallel Specialists)
2. **Practice**: Try all 5 patterns on small projects
3. **Optimize**: Apply cost strategies, measure savings
4. **Scale**: Move to Level 7 tasks with hybrid orchestration
5. **Advanced**: Custom subagents, ensemble voting, formal verification

---

## 📚 Related Documentation

- **MULTI_AGENT_PIPELINE_GUIDE.md** - Complete orchestration guide
- **CLAUDE_CODE_SUBAGENT_PATTERNS.md** - Practical patterns & templates
- **ULTRA_COMPLEXITY_LEVEL_6_PLUS.md** - Level 6-8 framework
- **TASK_GRADING_GUIDE.md** - Level 1-5 complexity assessment
- **model_catalog_2025.json** - Model selection by GPU/cost

---

**Version**: 1.0 | **Last Updated**: 2025-01-18 | **1-Page Reference** ✅
