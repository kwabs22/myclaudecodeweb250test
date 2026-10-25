# Task Complexity Grading Guide

## 🎯 Quick Assessment: What Model Do I Need?

Answer these questions to find your minimum model:

1. **How many files to understand?**
   - 1 file → **1.5B model**
   - 2-3 files → **3B model**
   - 4-10 files → **7B model**
   - 11-50 files → **14B model**
   - 50+ files → **32B model**

2. **What's the task complexity?**
   - UI tweak / simple fix → **1.5B**
   - Single feature → **3-7B**
   - Multi-component → **7-14B**
   - System-wide → **14-32B**
   - Architecture change → **32B+**

3. **How critical is quality?**
   - Internal tool → **Smaller OK**
   - Customer-facing → **+1 size up**
   - Security/payments → **Largest model**

---

## 📊 Task Complexity Levels

### Level 1: TRIVIAL ⚡
**"I could do this in my sleep"**

**Model**: Qwen2.5-Coder-**0.5B-1.5B**
**GPU**: T4
**Cost**: $15-60/month
**Time**: < 1 minute

**Examples:**
```
✓ Add a button to HTML
✓ Fix missing semicolon
✓ Add console.log for debugging
✓ Rename a variable
✓ Change text in UI
✓ Add CSS class
✓ Simple comment
```

**Characteristics:**
- 1-10 lines of code
- 1 file
- No dependencies
- Visual check is enough
- Can't break anything

**Why small model works:**
- Pattern is obvious
- No complex reasoning needed
- Minimal context required
- Fast iteration is more valuable than perfection

---

### Level 2: SIMPLE 🔧
**"Standard feature, done it before"**

**Model**: Qwen2.5-Coder-**1.5B-3B**
**GPU**: T4
**Cost**: $60-100/month
**Time**: 5-15 minutes

**Examples:**
```
✓ Add bookmark functionality (LocalStorage)
✓ Form validation (email, password)
✓ Dark mode toggle
✓ Pagination for list
✓ Modal dialog
✓ Search filter for table
✓ Tooltip on hover
```

**Example: Add Bookmarks**
```javascript
// What the model needs to generate:
// 1. HTML button
<button onclick="saveBookmark()">Save</button>

// 2. Save function
function saveBookmark() {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  bookmarks.push(window.location.href);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// 3. Load function
function loadBookmarks() {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  // Display bookmarks
}
```

**Characteristics:**
- 10-50 lines
- 1-3 files
- 0-1 libraries
- Basic tests
- Low risk

**Why this model size:**
- Understands common patterns (LocalStorage, forms)
- Can handle basic state management
- Fast enough for interactive use
- Cheap enough to run constantly

---

### Level 3: MODERATE 🏗️
**"Requires thought and planning"**

**Model**: Qwen2.5-Coder-**3B-7B**
**GPU**: T4 (GPTQ) or L4
**Cost**: $100-720/month
**Time**: 15-60 minutes

**Examples:**
```
✓ REST API with authentication
✓ Shopping cart with state management
✓ Data table with sorting/filtering
✓ File upload with validation
✓ Infinite scroll with API
✓ Notification system
✓ Autocomplete search
✓ Refactor large function
```

**Example: REST API Endpoint**
```javascript
// What the model needs to generate:
const express = require('express');
const jwt = require('jsonwebtoken');

// 1. Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 2. Validation
const validateBookmark = (req, res, next) => {
  const { url, title } = req.body;
  if (!url || !title) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  next();
};

// 3. Endpoint
app.post('/api/bookmarks', authenticate, validateBookmark, async (req, res) => {
  try {
    const bookmark = await Bookmark.create({
      userId: req.user.id,
      url: req.body.url,
      title: req.body.title
    });
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

**Characteristics:**
- 50-200 lines
- 3-10 files
- 2-5 libraries
- Unit + integration tests
- Moderate risk

**Why this model size:**
- Understands architectural patterns (middleware, MVC)
- Knows best practices (auth, validation, error handling)
- Can handle multiple moving parts
- Balances quality with cost

---

### Level 4: COMPLEX 🏛️
**"This needs expertise and care"**

**Model**: Qwen2.5-Coder-**7B-14B** or DeepSeek-Coder-V2-Lite
**GPU**: L4, A10G, or A100
**Cost**: $720-2500/month
**Time**: 1-4 hours

**Examples:**
```
✓ Complete authentication system (OAuth, JWT, reset)
✓ Database migration with zero downtime
✓ Real-time collaborative editing
✓ Caching layer with invalidation
✓ GraphQL API with complex resolvers
✓ Payment processing integration
✓ CI/CD pipeline
✓ Legacy refactor to modern architecture
✓ Error tracking system
```

**Example: Authentication System**
```javascript
// What the model needs to understand and generate:

// 1. Architecture Decision
// - Stateless JWT vs stateful sessions?
// - Refresh token strategy?
// - Password hashing algorithm?
// - OAuth provider integration?

// 2. Registration
async function register(email, password) {
  // Validate email format
  // Check if user exists
  // Hash password (bcrypt, 12 rounds)
  // Store in database
  // Send verification email
  // Generate JWT
  // Handle errors
}

// 3. Login
async function login(email, password) {
  // Find user
  // Verify password
  // Check if verified
  // Generate access token (15 min)
  // Generate refresh token (7 days)
  // Store refresh token
  // Return both tokens
}

// 4. Refresh Token
async function refreshToken(token) {
  // Validate refresh token
  // Check if revoked
  // Generate new access token
  // Rotate refresh token (optional)
}

// 5. Password Reset
async function resetPassword(email) {
  // Generate reset token
  // Store with expiry
  // Send email
  // Handle token validation
  // Update password
}

// 6. OAuth Integration
async function oauthCallback(provider, code) {
  // Exchange code for token
  // Get user info
  // Create or link account
  // Generate JWT
}

// 7. Security Considerations
// - Rate limiting
// - CSRF protection
// - XSS prevention
// - Secure cookies
// - Token blacklisting
```

**Characteristics:**
- 200-1000 lines
- 10-50 files
- 5-15 libraries
- Comprehensive tests
- High risk

**Why this model size:**
- Deep understanding of security
- Knows multiple patterns and trade-offs
- Can handle complex state and edge cases
- Makes sound architectural decisions

---

### Level 5: EXPERT 🎓
**"This is a major undertaking"**

**Model**: Qwen2.5-Coder-**14B-32B** or DeepSeek-Coder-V2-**236B**
**GPU**: A100, H100, B200
**Cost**: $2500-5000+/month
**Time**: 4+ hours to days

**Examples:**
```
✓ Microservices architecture design
✓ Database optimization (millions of records)
✓ Security audit and remediation
✓ ML pipeline (train, version, deploy)
✓ Distributed consensus (Raft/Paxos)
✓ Custom compiler/transpiler
✓ Event sourcing system
✓ Custom protocol implementation
✓ Zero-downtime deployment system
✓ Custom search engine
```

**Example: Microservices Migration**
```
What the model needs to do:

1. ANALYSIS
   - Understand entire monolith (10K+ lines)
   - Identify domain boundaries
   - Find tight coupling
   - Assess data dependencies
   - Evaluate business logic

2. DESIGN
   - Define service boundaries
   - Design service contracts (APIs)
   - Choose communication patterns (REST/gRPC/Events)
   - Plan data strategy (DB per service vs shared)
   - Design service mesh
   - Plan for failures (circuit breakers, retries)

3. IMPLEMENTATION
   - Extract service #1 (user service)
     * Extract user domain logic
     * Create new API
     * Migrate data
     * Update all callers
   - Extract service #2 (payment service)
   - ... repeat for 10+ services

4. INFRASTRUCTURE
   - Set up service discovery
   - Implement API gateway
   - Add distributed tracing
   - Set up centralized logging
   - Implement monitoring

5. MIGRATION STRATEGY
   - Strangler pattern
   - Feature flags
   - Rollback plan
   - Data migration
   - Testing strategy

6. DOCUMENTATION
   - Architecture diagrams
   - Service contracts
   - Deployment guides
   - Runbooks
```

**Characteristics:**
- 1000+ lines
- 50+ files
- 15+ libraries
- Full test suite
- Very high risk
- Requires system-level thinking

**Why this model size:**
- Needs to see entire codebase (128K-160K context)
- Makes complex architectural decisions
- Understands subtle trade-offs
- Expert-level pattern recognition
- Can optimize for performance, security, and maintainability

---

## 🎯 Quick Decision Matrix

### Your Task: "Add bookmarks to website"

**Questions:**
1. Files affected? → 2-3 (HTML, JS, maybe CSS)
2. Complexity? → Basic localStorage, click handlers
3. Context needed? → Just bookmark-related code (~2K tokens)
4. Reasoning? → Standard pattern (save/load from storage)

**Result:** **Level 2 - SIMPLE**

**Minimum Model:** Qwen2.5-Coder-1.5B
**Recommended:** Qwen2.5-Coder-3B (more reliable)
**GPU:** T4
**Cost:** $60/month

---

### Your Task: "Build authentication system"

**Questions:**
1. Files affected? → 10+ (routes, middleware, models, email, tests)
2. Complexity? → OAuth, JWT, refresh tokens, security
3. Context needed? → Auth patterns, security best practices (~32K tokens)
4. Reasoning? → Architectural decisions, security implications

**Result:** **Level 4 - COMPLEX**

**Minimum Model:** Qwen2.5-Coder-7B
**Recommended:** Qwen2.5-Coder-14B
**GPU:** A100
**Cost:** $2500/month

---

### Your Task: "Refactor to microservices"

**Questions:**
1. Files affected? → 100+ (entire codebase)
2. Complexity? → System architecture redesign
3. Context needed? → Full codebase understanding (128K+ tokens)
4. Reasoning? → Domain modeling, service boundaries, trade-offs

**Result:** **Level 5 - EXPERT**

**Minimum Model:** Qwen2.5-Coder-14B
**Recommended:** Qwen2.5-Coder-32B
**GPU:** A100 or H100
**Cost:** $2880-5760/month

---

## 💰 Cost Optimization

### Usage Patterns

**24/7 Production:**
```
L4 (720/mo) + Qwen2.5-Coder-7B
→ Best for: Always-on code assistant
```

**8 Hours/Day (Development):**
```
L4 (~$240/mo) + Qwen2.5-Coder-7B
→ Best for: Daily development work
```

**On-Demand (As Needed):**
```
T4 (~$15-60/mo) + Qwen2.5-Coder-1.5B
→ Best for: Occasional tasks
```

### Smart Sizing Strategy

1. **Start Small**: Begin with 1.5B or 3B
2. **Measure Quality**: Does it produce correct code?
3. **Upgrade If Needed**: If quality suffers, go up one size
4. **Don't Over-provision**: Bigger ≠ always better for simple tasks

**Example:**
```
Task: Add bookmark button
Try: 1.5B → Works great → Done! ($60/mo)

Task: Build API endpoint
Try: 3B → Some errors → Try 7B → Perfect! ($720/mo)

Task: Refactor architecture
Try: 7B → Misses context → Try 14B → Better → Try 32B → Excellent! ($2880/mo)
```

---

## 📊 Model Comparison by Task Level

| Task Level | Minimum | Recommended | Premium | Cost/Month |
|------------|---------|-------------|---------|------------|
| **Trivial** | 0.5B | 1.5B | 3B | $15-100 |
| **Simple** | 1.5B | 3B | 7B | $60-720 |
| **Moderate** | 3B | 7B | DeepSeek-Lite | $100-720 |
| **Complex** | 7B | 14B | 32B | $720-2880 |
| **Expert** | 14B | 32B | DeepSeek-236B | $2500-5760 |

---

## 🎓 Real-World Examples

### Startup MVP Development

**Scenario**: Building basic CRUD app
- Most tasks: Level 2-3 (Simple to Moderate)
- **Model**: Qwen2.5-Coder-7B on L4
- **Cost**: $720/month
- **Why**: Handles 90% of tasks, good quality, reasonable cost

### Enterprise Refactoring

**Scenario**: Modernizing legacy system
- Most tasks: Level 4-5 (Complex to Expert)
- **Model**: Qwen2.5-Coder-32B on A100
- **Cost**: $2880/month
- **Why**: Needs to understand large codebase, make architectural decisions

### Solo Dev Side Project

**Scenario**: Building personal tool
- Most tasks: Level 1-2 (Trivial to Simple)
- **Model**: Qwen2.5-Coder-1.5B on T4
- **Cost**: $60/month (or $15 for 8hr/day)
- **Why**: Fast, cheap, good enough for simple features

---

## 🔍 Task Assessment Tool

Use this to grade your specific task:

```bash
# Coming soon:
python assess_task.py "Add bookmarks to website"

Output:
  Task Level: SIMPLE (Level 2)
  Minimum Model: Qwen2.5-Coder-1.5B
  Recommended: Qwen2.5-Coder-3B
  Files Affected: 2-3
  Context Needed: 2-8K tokens
  Estimated Time: 5-15 minutes
  Cost: $60-100/month
```

---

## 💡 Key Insights

### 1. Context Length Matters More Than You Think
- 1.5B with 128K context > 7B with 4K context for large codebases
- Qwen2.5-Coder has 128K context at all sizes
- Can see entire small projects at once

### 2. Smaller Models Are Faster
- 1.5B: 150 TPS on T4
- 7B: 55 TPS on L4
- 32B: 38 TPS on A100
- For simple tasks, speed > absolute quality

### 3. Task-Specific Beats General-Purpose
- Qwen2.5-Coder-7B (coding) > Qwen2.5-7B (general)
- Specialized training shows at all sizes
- +20-30% better on code tasks

### 4. Start Small, Scale Up
- 70% of dev tasks: Level 1-2 (Simple)
- 20% of tasks: Level 3-4 (Moderate-Complex)
- 10% of tasks: Level 5 (Expert)
- Don't pay for 32B if 7B works!

### 5. Quality Threshold
- Below threshold: Model makes mistakes
- Above threshold: Bigger model = diminishing returns
- Find your threshold, then stop

---

## 🚀 Get Started

1. **Assess your most common tasks**
   - What do you do most often?
   - What complexity level?

2. **Pick starting model**
   - Most devs: Start with 3B or 7B
   - Simple tasks: 1.5B is enough
   - Complex refactors: Start with 14B

3. **Test and iterate**
   - Try on real tasks
   - Measure quality
   - Adjust if needed

4. **Optimize costs**
   - Use smaller models for simple tasks
   - Reserve larger models for complex work
   - Use on-demand pricing smartly

---

## 📞 Quick Reference

**I need to...** → **Use this model**

- Fix bugs → 1.5B
- Add simple features → 3B
- Build APIs → 7B
- Refactor code → 7B-14B
- Design systems → 14B-32B
- Optimize performance → 32B
- Security audit → 32B

**Most common answer: 7B covers 80% of professional development tasks**
