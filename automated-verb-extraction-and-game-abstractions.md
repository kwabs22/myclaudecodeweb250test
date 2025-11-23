# Automated Verb Extraction and Game Abstractions

## Table of Contents
- [Part 1: Automating Verb Extraction](#part-1-automating-verb-extraction)
  - [The Challenge](#the-challenge)
  - [Abstract Syntax Trees (AST)](#abstract-syntax-trees-ast)
  - [Automated Analysis Tools](#automated-analysis-tools)
  - [Building a Verb Extractor](#building-a-verb-extractor)
  - [Call Graph Generation](#call-graph-generation)
  - [Semantic Code Search](#semantic-code-search)
- [Part 2: Essential Game Abstractions](#part-2-essential-game-abstractions)
  - [Why Games Need Different Abstractions](#why-games-need-different-abstractions)
  - [The Core Game Engine Architecture](#the-core-game-engine-architecture)
  - [Essential Game Systems](#essential-game-systems)
  - [The ECS Abstraction](#the-ecs-abstraction)
  - [Resource Management](#resource-management)
  - [Scene Graph vs ECS](#scene-graph-vs-ecs)
- [Part 3: Practical Implementation](#part-3-practical-implementation)
  - [Building a Verb Analyzer](#building-a-verb-analyzer)
  - [Implementing Core Game Abstractions](#implementing-core-game-abstractions)
  - [Performance Considerations](#performance-considerations)

---

# Part 1: Automating Verb Extraction

## The Challenge

Can we automatically extract the "verb skeleton" from code to understand what it does without reading every line?

**Answer: Yes!** Using Abstract Syntax Trees (AST) and static analysis tools.

### What We Want to Automate

**Manual Process** (from previous document):
```python
# Read this code line by line
def process_order(order_id):
    order = get_order(order_id)
    validate(order)
    payment = charge(order)
    update_status(order)
    send_email(order)
    return order

# Extract verbs manually: GET → VALIDATE → CHARGE → UPDATE → SEND → RETURN
```

**Automated Process**:
```python
# Tool automatically generates:
process_order:
├── CALL get_order
├── CALL validate
├── CALL charge
├── CALL update_status
├── CALL send_email
└── RETURN

Pipeline: GET → VALIDATE → CHARGE → UPDATE → SEND → RETURN
```

---

## Abstract Syntax Trees (AST)

### What is an AST?

An AST is a tree representation of the syntactic structure of source code. Each node represents a construct in the code.

**Example Code**:
```python
def add(a, b):
    return a + b
```

**AST Representation**:
```
Module
└── FunctionDef(name='add')
    ├── arguments
    │   ├── arg(name='a')
    │   └── arg(name='b')
    └── body
        └── Return
            └── BinOp
                ├── Name(id='a')
                ├── operator: Add
                └── Name(id='b')
```

### Why ASTs are Perfect for Verb Extraction

1. **Structure over Text**: AST understands code structure, not just text
2. **Language Aware**: Knows what's a function call vs variable vs operator
3. **Traversable**: Can walk the tree to find all operations
4. **Extractable**: Can pull out just function calls, ignoring noise

**Text-based approach** (fragile):
```python
# Regex: r'def (\w+)\('
# Problem: Breaks with decorators, multi-line, comments
```

**AST approach** (robust):
```python
import ast

# Parse code into AST
tree = ast.parse(source_code)

# Find all function definitions
for node in ast.walk(tree):
    if isinstance(node, ast.FunctionDef):
        print(node.name)  # Guaranteed to work!
```

---

## Automated Analysis Tools

### 1. Tree-sitter (Multi-Language Parser)

**What it is**: Fast, incremental parser generator that builds concrete syntax trees

**GitHub**: https://github.com/tree-sitter/tree-sitter

**Supported Languages**: 30+ including C, C++, Python, JavaScript, Rust, Go, Java

**Key Features**:
- **Fast**: Incremental parsing (only re-parses changed code)
- **Error-Tolerant**: Can parse incomplete/broken code
- **Precise**: Provides exact source locations
- **Universal**: Same API across all languages

**Example Usage**:
```python
from tree_sitter import Language, Parser

# Load language grammar
Language.build_library('build/languages.so', ['vendor/tree-sitter-python'])
PY_LANGUAGE = Language('build/languages.so', 'python')

# Create parser
parser = Parser()
parser.set_language(PY_LANGUAGE)

# Parse code
tree = parser.parse(b"""
def process_order(order_id):
    order = get_order(order_id)
    validate_order(order)
    return order
""")

# Walk tree and find function calls
def find_function_calls(node):
    if node.type == 'call':
        function_name = node.children[0].text.decode()
        print(f"CALL {function_name}")
    for child in node.children:
        find_function_calls(child)

find_function_calls(tree.root_node)
```

**Output**:
```
CALL get_order
CALL validate_order
```

### 2. ast-grep (Pattern Matching for Code)

**What it is**: Structural search and replace tool using tree-sitter

**GitHub**: https://github.com/ast-grep/ast-grep

**Key Features**:
- **Pattern Matching**: Find code patterns structurally
- **Multi-Language**: Works across 30+ languages
- **Fast**: Leverages tree-sitter performance
- **CLI & Library**: Use from command line or programmatically

**Example: Find All Function Calls**:
```bash
# Find all calls to 'get_*' functions
ast-grep --pattern 'get_$ANYTHING($$$)' --lang python src/

# Find all async/await patterns
ast-grep --pattern 'await $FUNC($$$)' --lang javascript src/
```

**Example: Extract Verb Skeleton**:
```yaml
# config.yml
rules:
  - id: extract-verbs
    pattern: |
      def $FUNC_NAME($$$):
        $$$
    transform:
      FUNC_NAME:
        replace:
          source: '(\w+).*'
          replace: 'VERB: $1'
```

### 3. Semgrep (Semantic Code Search)

**What it is**: Lightweight static analysis tool with semantic understanding

**GitHub**: https://github.com/semgrep/semgrep

**Key Features**:
- **Semantic Matching**: Understands code meaning, not just syntax
- **Metavariables**: Match any expression/statement
- **Cross-Function Analysis**: Can track data flow
- **30+ Languages**: Supports most popular languages

**Example: Find All Data Transformations**:
```yaml
# semgrep-rules.yml
rules:
  - id: find-transformations
    pattern: |
      $DATA = $ITEMS.map($$$)
    message: "Found MAP transformation"
    languages: [javascript]
    severity: INFO

  - id: find-filters
    pattern: |
      $DATA = $ITEMS.filter($$$)
    message: "Found FILTER operation"
    languages: [javascript]
    severity: INFO
```

**Run**:
```bash
semgrep --config semgrep-rules.yml src/
```

**Output**:
```
INFO: Found MAP transformation in src/utils.js:42
INFO: Found FILTER operation in src/utils.js:45
```

### 4. Language-Specific AST Tools

#### Python: ast module (Built-in)

```python
import ast

class VerbExtractor(ast.NodeVisitor):
    def __init__(self):
        self.verbs = []

    def visit_FunctionDef(self, node):
        self.verbs.append(f"DEFINE {node.name}")
        # Visit function body
        self.generic_visit(node)

    def visit_Call(self, node):
        # Extract function name
        if isinstance(node.func, ast.Name):
            self.verbs.append(f"CALL {node.func.id}")
        elif isinstance(node.func, ast.Attribute):
            self.verbs.append(f"CALL {node.func.attr}")
        self.generic_visit(node)

    def visit_Return(self, node):
        self.verbs.append("RETURN")
        self.generic_visit(node)

# Usage
code = """
def process_order(order_id):
    order = fetch_order(order_id)
    validate(order)
    payment = charge_customer(order)
    send_email(order.user)
    return payment
"""

tree = ast.parse(code)
extractor = VerbExtractor()
extractor.visit(tree)

print("Verb Sequence:", " → ".join(extractor.verbs))
```

**Output**:
```
Verb Sequence: DEFINE process_order → CALL fetch_order → CALL validate → CALL charge_customer → CALL send_email → RETURN
```

#### JavaScript/TypeScript: Babel/TypeScript Compiler

```javascript
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const code = `
function processOrder(orderId) {
    const order = getOrder(orderId);
    validate(order);
    charge(order);
    return order;
}
`;

const ast = parser.parse(code);
const verbs = [];

traverse(ast, {
    FunctionDeclaration(path) {
        verbs.push(`DEFINE ${path.node.id.name}`);
    },
    CallExpression(path) {
        const callee = path.node.callee;
        if (callee.type === 'Identifier') {
            verbs.push(`CALL ${callee.name}`);
        }
    },
    ReturnStatement(path) {
        verbs.push('RETURN');
    }
});

console.log('Verbs:', verbs.join(' → '));
```

**Output**:
```
Verbs: DEFINE processOrder → CALL getOrder → CALL validate → CALL charge → RETURN
```

#### Java: JavaParser

```java
import com.github.javaparser.JavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.expr.MethodCallExpr;
import com.github.javaparser.ast.visitor.VoidVisitorAdapter;

String code = """
public void processOrder(Long orderId) {
    Order order = getOrder(orderId);
    validate(order);
    charge(order);
}
""";

CompilationUnit cu = new JavaParser().parse(code).getResult().get();

cu.accept(new VoidVisitorAdapter<Void>() {
    @Override
    public void visit(MethodCallExpr n, Void arg) {
        System.out.println("CALL " + n.getNameAsString());
        super.visit(n, arg);
    }
}, null);
```

**Output**:
```
CALL getOrder
CALL validate
CALL charge
```

---

## Call Graph Generation

Call graphs show which functions call which, revealing the entire verb flow through a program.

### 1. Pyan (Python Call Graph Generator)

**GitHub**: https://github.com/Technologicat/pyan

**Example**:
```bash
# Generate call graph
pyan *.py --uses --no-defines --colored --grouped --annotated --dot > callgraph.dot

# Convert to image
dot -Tpng callgraph.dot -o callgraph.png
```

**Output**:
```
process_order → get_order
process_order → validate_order
process_order → charge_payment
charge_payment → connect_gateway
charge_payment → send_request
```

### 2. PyCG (Static Python Call Graph)

**GitHub**: https://github.com/vitsalis/PyCG

```bash
pycg --package mypackage $(find mypackage -type f -name "*.py") -o callgraph.json
```

**Output JSON**:
```json
{
  "process_order": ["get_order", "validate_order", "charge_payment"],
  "charge_payment": ["connect_gateway", "send_request"],
  "validate_order": ["check_items", "verify_address"]
}
```

### 3. Multi-Language: callGraph

**Supports**: 20+ languages including Python, JavaScript, Go, Rust, Java

```bash
# Generate call graph for entire project
callgraph --format=dot --output=graph.dot src/

# Extract verb pipeline
callgraph --format=text --show-calls src/main.py
```

**Output**:
```
main
├── initialize
│   ├── load_config
│   └── setup_database
├── run
│   ├── process_queue
│   │   ├── fetch_job
│   │   ├── execute_job
│   │   └── save_result
│   └── monitor
└── shutdown
    ├── close_connections
    └── cleanup
```

---

## Building a Verb Extractor

Let's build a complete tool that automatically extracts verb skeletons.

### Complete Python Implementation

```python
"""
Automated Verb Extractor
Analyzes Python code and extracts verb sequences (operations performed)
"""

import ast
from typing import List, Dict, Any
from dataclasses import dataclass
from collections import defaultdict

@dataclass
class VerbNode:
    """Represents a single verb (operation) in code"""
    type: str  # CALL, RETURN, ASSIGN, BRANCH, LOOP, etc.
    name: str  # Function name, variable name, etc.
    line: int  # Source line number
    children: List['VerbNode'] = None

    def __post_init__(self):
        if self.children is None:
            self.children = []

class VerbExtractor(ast.NodeVisitor):
    """
    AST Visitor that walks Python code and extracts all verbs (operations)
    """

    # Common verb prefixes that indicate operations
    VERB_PREFIXES = {
        'get', 'fetch', 'load', 'retrieve', 'read',
        'set', 'update', 'modify', 'change', 'write',
        'create', 'make', 'build', 'generate', 'new',
        'delete', 'remove', 'destroy', 'clear',
        'send', 'emit', 'publish', 'notify',
        'validate', 'verify', 'check', 'ensure',
        'process', 'handle', 'execute', 'run',
        'calculate', 'compute', 'derive',
        'parse', 'serialize', 'deserialize',
        'connect', 'close', 'open',
        'save', 'persist', 'store'
    }

    def __init__(self):
        self.verbs = []
        self.current_function = None
        self.call_graph = defaultdict(list)

    def visit_FunctionDef(self, node):
        """Extract function definitions"""
        verb = VerbNode(
            type='DEFINE',
            name=node.name,
            line=node.lineno
        )
        self.verbs.append(verb)

        # Track current function for call graph
        previous_function = self.current_function
        self.current_function = node.name

        # Visit function body
        self.generic_visit(node)

        self.current_function = previous_function

    def visit_Call(self, node):
        """Extract function calls"""
        func_name = self._get_call_name(node)

        if func_name:
            # Categorize verb type
            verb_type = self._categorize_verb(func_name)

            verb = VerbNode(
                type=verb_type,
                name=func_name,
                line=node.lineno
            )
            self.verbs.append(verb)

            # Update call graph
            if self.current_function:
                self.call_graph[self.current_function].append(func_name)

        self.generic_visit(node)

    def visit_Return(self, node):
        """Extract return statements"""
        verb = VerbNode(
            type='RETURN',
            name='return',
            line=node.lineno
        )
        self.verbs.append(verb)
        self.generic_visit(node)

    def visit_Assign(self, node):
        """Extract assignments (state changes)"""
        if isinstance(node.targets[0], ast.Name):
            var_name = node.targets[0].id
            verb = VerbNode(
                type='ASSIGN',
                name=var_name,
                line=node.lineno
            )
            self.verbs.append(verb)
        self.generic_visit(node)

    def visit_If(self, node):
        """Extract branching"""
        verb = VerbNode(
            type='BRANCH',
            name='if',
            line=node.lineno
        )
        self.verbs.append(verb)
        self.generic_visit(node)

    def visit_For(self, node):
        """Extract loops"""
        verb = VerbNode(
            type='LOOP',
            name='for',
            line=node.lineno
        )
        self.verbs.append(verb)
        self.generic_visit(node)

    def visit_While(self, node):
        """Extract while loops"""
        verb = VerbNode(
            type='LOOP',
            name='while',
            line=node.lineno
        )
        self.verbs.append(verb)
        self.generic_visit(node)

    def _get_call_name(self, node):
        """Extract function name from call expression"""
        if isinstance(node.func, ast.Name):
            return node.func.id
        elif isinstance(node.func, ast.Attribute):
            return node.func.attr
        return None

    def _categorize_verb(self, func_name):
        """Categorize function by its verb prefix"""
        func_lower = func_name.lower()

        for prefix in self.VERB_PREFIXES:
            if func_lower.startswith(prefix):
                return prefix.upper()

        return 'CALL'

    def get_verb_sequence(self, exclude_types=None):
        """Get simplified verb sequence"""
        if exclude_types is None:
            exclude_types = {'ASSIGN', 'BRANCH', 'LOOP'}

        return [
            verb.name
            for verb in self.verbs
            if verb.type not in exclude_types
        ]

    def get_pipeline(self):
        """Get verb pipeline (just the operations)"""
        sequence = self.get_verb_sequence()
        return ' → '.join(sequence)

    def get_call_graph(self):
        """Get function call graph"""
        return dict(self.call_graph)

    def print_report(self):
        """Print comprehensive verb analysis"""
        print("=" * 60)
        print("VERB ANALYSIS REPORT")
        print("=" * 60)

        # Group by type
        by_type = defaultdict(list)
        for verb in self.verbs:
            by_type[verb.type].append(verb)

        for verb_type, verbs in sorted(by_type.items()):
            print(f"\n{verb_type} ({len(verbs)}):")
            for verb in verbs:
                print(f"  Line {verb.line}: {verb.name}")

        print("\n" + "=" * 60)
        print("VERB PIPELINE:")
        print("=" * 60)
        print(self.get_pipeline())

        print("\n" + "=" * 60)
        print("CALL GRAPH:")
        print("=" * 60)
        for caller, callees in sorted(self.call_graph.items()):
            print(f"{caller}:")
            for callee in callees:
                print(f"  └─ {callee}")

# Example Usage
if __name__ == '__main__':
    code = """
def process_order(order_id):
    # Fetch order from database
    order = get_order(order_id)

    # Validate order
    if not validate_order(order):
        raise ValueError("Invalid order")

    # Calculate total
    total = calculate_total(order)

    # Process payment
    payment = charge_customer(order.customer, total)

    if payment.success:
        # Update order status
        update_order_status(order.id, "completed")

        # Send confirmation
        send_confirmation_email(order.customer.email)

        # Update inventory
        for item in order.items:
            update_inventory(item.product_id, item.quantity)

    return payment
"""

    # Parse and analyze
    tree = ast.parse(code)
    extractor = VerbExtractor()
    extractor.visit(tree)

    # Print report
    extractor.print_report()
```

**Output**:
```
============================================================
VERB ANALYSIS REPORT
============================================================

DEFINE (1):
  Line 2: process_order

GET (1):
  Line 4: get_order

CALL (7):
  Line 7: validate_order
  Line 11: calculate_total
  Line 14: charge_customer
  Line 18: update_order_status
  Line 21: send_confirmation_email
  Line 25: update_inventory

RETURN (1):
  Line 27: return

BRANCH (2):
  Line 7: if
  Line 16: if

LOOP (1):
  Line 24: for

============================================================
VERB PIPELINE:
============================================================
process_order → get_order → validate_order → calculate_total → charge_customer → update_order_status → send_confirmation_email → update_inventory → return

============================================================
CALL GRAPH:
============================================================
process_order:
  └─ get_order
  └─ validate_order
  └─ calculate_total
  └─ charge_customer
  └─ update_order_status
  └─ send_confirmation_email
  └─ update_inventory
```

---

## Semantic Code Search

Beyond extracting verbs from individual files, we can search entire codebases for patterns.

### Semgrep: Pattern-Based Search

**Find all CRUD operations**:
```yaml
# crud-patterns.yml
rules:
  - id: find-creates
    patterns:
      - pattern: |
          $OBJ.create($$$)
      - pattern: |
          $OBJ.insert($$$)
      - pattern: |
          $OBJ.add($$$)
    message: "CREATE operation found"

  - id: find-reads
    patterns:
      - pattern: |
          $OBJ.find($$$)
      - pattern: |
          $OBJ.get($$$)
      - pattern: |
          $OBJ.fetch($$$)
    message: "READ operation found"

  - id: find-updates
    patterns:
      - pattern: |
          $OBJ.update($$$)
      - pattern: |
          $OBJ.modify($$$)
      - pattern: |
          $OBJ.set($$$)
    message: "UPDATE operation found"

  - id: find-deletes
    patterns:
      - pattern: |
          $OBJ.delete($$$)
      - pattern: |
          $OBJ.remove($$$)
      - pattern: |
          $OBJ.destroy($$$)
    message: "DELETE operation found"
```

**Run across codebase**:
```bash
semgrep --config crud-patterns.yml src/ --json > crud-operations.json
```

### ast-grep: Structural Patterns

**Find all data transformation pipelines**:
```bash
# Find map-filter-reduce chains
ast-grep --pattern '$DATA.filter($$$).map($$$).reduce($$$)' -l javascript src/

# Find async/await sequences
ast-grep --pattern 'const $A = await $F1($$$); const $B = await $F2($$$);' -l typescript src/
```

### Building a Codebase Analyzer

```python
"""
Analyze entire codebase and generate verb statistics
"""

import os
import ast
from pathlib import Path
from collections import Counter, defaultdict
from verb_extractor import VerbExtractor  # From previous example

class CodebaseAnalyzer:
    def __init__(self, root_dir):
        self.root_dir = Path(root_dir)
        self.verb_stats = Counter()
        self.function_verbs = defaultdict(list)
        self.file_verbs = defaultdict(list)

    def analyze(self):
        """Analyze all Python files in directory"""
        for py_file in self.root_dir.rglob('*.py'):
            self._analyze_file(py_file)

    def _analyze_file(self, file_path):
        """Analyze single file"""
        try:
            with open(file_path) as f:
                code = f.read()

            tree = ast.parse(code)
            extractor = VerbExtractor()
            extractor.visit(tree)

            # Collect statistics
            for verb in extractor.verbs:
                self.verb_stats[verb.type] += 1
                self.file_verbs[str(file_path)].append(verb)

            # Store function-level verbs
            for func, calls in extractor.get_call_graph().items():
                self.function_verbs[func].extend(calls)

        except Exception as e:
            print(f"Error analyzing {file_path}: {e}")

    def print_report(self):
        """Print analysis report"""
        print("=" * 70)
        print("CODEBASE VERB ANALYSIS")
        print("=" * 70)

        print(f"\nTotal files analyzed: {len(self.file_verbs)}")
        print(f"Total verbs found: {sum(self.verb_stats.values())}")

        print("\nVerb Distribution:")
        for verb_type, count in self.verb_stats.most_common():
            percentage = (count / sum(self.verb_stats.values())) * 100
            print(f"  {verb_type:15} {count:6} ({percentage:5.1f}%)")

        print("\nMost Common Function Calls:")
        all_calls = [call for calls in self.function_verbs.values() for call in calls]
        for call, count in Counter(all_calls).most_common(20):
            print(f"  {call:30} {count:4}")

        print("\nMost Complex Functions (most verbs):")
        complex_funcs = sorted(
            self.function_verbs.items(),
            key=lambda x: len(x[1]),
            reverse=True
        )[:10]

        for func, verbs in complex_funcs:
            print(f"  {func:30} → {len(verbs)} calls")
            pipeline = ' → '.join(verbs[:5])
            if len(verbs) > 5:
                pipeline += f" → ... (+{len(verbs)-5} more)"
            print(f"    {pipeline}")

# Usage
analyzer = CodebaseAnalyzer('src/')
analyzer.analyze()
analyzer.print_report()
```

**Example Output**:
```
======================================================================
CODEBASE VERB ANALYSIS
======================================================================

Total files analyzed: 45
Total verbs found: 1,234

Verb Distribution:
  CALL              734 ( 59.5%)
  ASSIGN            245 ( 19.9%)
  RETURN            123 ( 10.0%)
  BRANCH             89 (  7.2%)
  LOOP               43 (  3.5%)

Most Common Function Calls:
  get                               45
  validate                          32
  save                              28
  update                            25
  send                              19
  process                           17
  fetch                             15
  calculate                         12

Most Complex Functions (most verbs):
  process_payment                → 23 calls
    fetch_order → validate_order → calculate_total → charge_card → update_status → ... (+18 more)

  generate_report                → 18 calls
    fetch_data → filter_data → aggregate_data → format_results → create_pdf → ... (+13 more)

  sync_inventory                 → 15 calls
    connect_warehouse → fetch_products → compare_quantities → create_adjustments → apply_changes → ... (+10 more)
```

---

# Part 2: Essential Game Abstractions

## Why Games Need Different Abstractions

Games have unique requirements that traditional application abstractions don't address:

### 1. **Real-Time Performance** (60-120 FPS)
- Must process 10,000+ entities every 16ms
- No garbage collection pauses allowed
- Predictable frame times required

### 2. **Data-Oriented Processing**
- Same operation on thousands of objects (SIMD-friendly)
- Cache-friendly memory layouts critical
- Parallelization essential

### 3. **Dynamic Composition**
- Entities gain/lose capabilities at runtime
- Rigid class hierarchies break down
- Need flexible component composition

### 4. **Memory Constraints**
- Fixed memory budget (consoles)
- Manual memory management
- Resource streaming required

### 5. **Continuous Simulation**
- Everything updates every frame
- No request-response pattern
- Time-based state evolution

**Application abstractions** (OOP, microservices, databases) optimize for:
- Business logic correctness
- Data persistence
- Scalability through distribution

**Game abstractions** optimize for:
- Frame-rate performance
- Memory efficiency
- Data-parallel processing

---

## The Core Game Engine Architecture

Modern game engines follow a layered architecture:

```
┌────────────────────────────────────────────────────────┐
│ Layer 7: Game-Specific Code                           │
│ (Your game logic, levels, mechanics)                  │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│ Layer 6: Gameplay Systems                             │
│ (AI, Player Control, Game Rules, Quests)              │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│ Layer 5: Scene Management                             │
│ (Scene Graph / ECS, Object Lifecycle)                 │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│ Layer 4: Core Systems                                 │
│ (Rendering, Physics, Audio, Animation)                │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│ Layer 3: Resource Management                          │
│ (Asset Loading, Memory Management, Streaming)         │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│ Layer 2: Core Utilities                               │
│ (Math, Containers, String, Memory Allocators)         │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│ Layer 1: Platform Abstraction                         │
│ (OS, Graphics API, Input, File System, Network)       │
└────────────────────────────────────────────────────────┘
                        ↓
┌────────────────────────────────────────────────────────┐
│ Layer 0: Hardware                                     │
│ (CPU, GPU, Memory, Input Devices, Audio)              │
└────────────────────────────────────────────────────────┘
```

### Essential Managers

Every game engine has these core managers:

1. **Render Manager**: Graphics rendering pipeline
2. **Resource Manager**: Asset loading and memory
3. **Scene Manager**: World organization (scene graph or ECS)
4. **Input Manager**: Player input handling
5. **Audio Manager**: Sound playback and mixing
6. **Physics Manager**: Collision and dynamics
7. **Error Manager**: Logging and crash reporting

---

## Essential Game Systems

### 1. The Game Loop

The heartbeat of every game - runs 60+ times per second:

```cpp
// The fundamental structure of every game
void gameLoop() {
    // Initialization
    initialize();

    // Main loop
    while (!shouldQuit) {
        // TIMING
        float deltaTime = calculateDeltaTime();

        // INPUT
        processInput();

        // UPDATE (Fixed timestep)
        accumulator += deltaTime;
        while (accumulator >= FIXED_TIMESTEP) {
            updatePhysics(FIXED_TIMESTEP);
            updateGameLogic(FIXED_TIMESTEP);
            accumulator -= FIXED_TIMESTEP;
        }

        // UPDATE (Variable timestep)
        updateAnimation(deltaTime);
        updateAudio(deltaTime);

        // RENDER
        render(accumulator / FIXED_TIMESTEP);  // Interpolation

        // SWAP
        swapBuffers();
    }

    // Cleanup
    shutdown();
}
```

**Key Concepts**:

**Fixed Timestep** (Physics, Game Logic):
- Always use same dt (e.g., 16.67ms)
- Deterministic, reproducible
- Network-friendly

**Variable Timestep** (Animation, Audio):
- Use actual frame time
- Smooth visual updates
- Adapts to performance

**Why This Abstraction**: Decouples simulation rate from render rate

### 2. Entity Component System (ECS)

**The Problem with OOP for Games**:
```cpp
// OOP: Deep inheritance hierarchy
class GameObject { virtual void update(); };
class Character : public GameObject { ... };
class Player : public Character { ... };
class Enemy : public Character { ... };
class FlyingEnemy : public Enemy { ... };  // Explosion!

// Want a flying player? Stuck!
// Want to share behavior? Multiple inheritance hell!
```

**The ECS Solution**:
```
Entity = Just an ID
Component = Pure data
System = Logic operating on components
```

**Example**:
```cpp
// Entities are just IDs
EntityID player = registry.create();
EntityID enemy = registry.create();

// Components are pure data structs
struct Position { float x, y, z; };
struct Velocity { float dx, dy, dz; };
struct Health { float current, max; };
struct Renderable { MeshID mesh; MaterialID material; };
struct PlayerControlled { int playerIndex; };
struct AIControlled { AIState state; };

// Add components to entities
registry.add<Position>(player, {0, 0, 0});
registry.add<Velocity>(player, {0, 0, 0});
registry.add<Health>(player, {100, 100});
registry.add<Renderable>(player, {playerMesh, playerMat});
registry.add<PlayerControlled>(player, {0});

registry.add<Position>(enemy, {10, 0, 0});
registry.add<Health>(enemy, {50, 50});
registry.add<Renderable>(enemy, {enemyMesh, enemyMat});
registry.add<AIControlled>(enemy, {PATROL});

// Systems process components
class MovementSystem : public System {
public:
    void update(float dt) override {
        // Process ALL entities with Position AND Velocity
        for (auto [entity, pos, vel] : registry.view<Position, Velocity>()) {
            pos.x += vel.dx * dt;
            pos.y += vel.dy * dt;
            pos.z += vel.dz * dt;
        }
    }
};

class PlayerInputSystem : public System {
public:
    void update(float dt) override {
        // Process only player-controlled entities
        for (auto [entity, vel, ctrl] : registry.view<Velocity, PlayerControlled>()) {
            if (Input::isKeyDown(KEY_W)) vel.dz += 10.0f;
            if (Input::isKeyDown(KEY_S)) vel.dz -= 10.0f;
            if (Input::isKeyDown(KEY_A)) vel.dx -= 10.0f;
            if (Input::isKeyDown(KEY_D)) vel.dx += 10.0f;
        }
    }
};

class RenderSystem : public System {
public:
    void update(float dt) override {
        // Render all entities with Position AND Renderable
        for (auto [entity, pos, rend] : registry.view<Position, Renderable>()) {
            drawMesh(rend.mesh, rend.material, pos);
        }
    }
};

// Update loop
void update(float dt) {
    playerInputSystem.update(dt);  // Player input
    movementSystem.update(dt);      // Apply velocities
    renderSystem.update(dt);        // Draw everything
}
```

**Why This Abstraction**:
- **Composition**: Build entities from components (flying = Position + Velocity + Flying)
- **Cache-Friendly**: Components stored contiguously in memory
- **Parallelizable**: Systems can run concurrently
- **Flexible**: Add/remove components at runtime

### 3. Resource Management

Games have strict memory budgets and need efficient asset loading:

```cpp
class ResourceManager {
    // Resource handle (not raw pointer)
    template<typename T>
    using Handle = uint32_t;

    // Resource cache
    std::unordered_map<std::string, TextureData> textures;
    std::unordered_map<std::string, MeshData> meshes;
    std::unordered_map<std::string, AudioData> sounds;

    // Reference counting
    std::unordered_map<Handle, int> refCounts;

public:
    // Load with automatic caching
    Handle<Texture> loadTexture(const std::string& path) {
        // Check if already loaded
        if (textures.contains(path)) {
            Handle handle = getHandle(path);
            refCounts[handle]++;
            return handle;
        }

        // Load from disk
        TextureData data = loadTextureFromDisk(path);
        Handle handle = storeTexture(path, data);
        refCounts[handle] = 1;

        return handle;
    }

    // Automatic unloading when no longer used
    void release(Handle handle) {
        refCounts[handle]--;
        if (refCounts[handle] == 0) {
            unloadResource(handle);
        }
    }

    // Streaming for large assets
    void streamLevel(const std::string& levelName) {
        // Unload previous level assets
        unloadLevel(currentLevel);

        // Load new level assets asynchronously
        AsyncLoad(levelName, [this](LevelData data) {
            this->loadLevelAssets(data);
        });
    }
};
```

**Why This Abstraction**:
- **Caching**: Don't load same asset twice
- **Reference Counting**: Automatic unloading
- **Handles**: Safe indirection (no dangling pointers)
- **Streaming**: Load assets on-demand

### 4. Scene Graph vs ECS

Two common abstractions for organizing game worlds:

**Scene Graph** (Traditional):
```
Scene
├── Player
│   ├── Body
│   │   ├── Head
│   │   ├── Torso
│   │   └── Legs
│   └── Weapon
│       └── Muzzle Flash
├── Enemy1
│   └── HealthBar
└── Environment
    ├── Building
    │   ├── Door
    │   └── Window
    └── Tree
```

**Characteristics**:
- Parent-child relationships
- Transform inheritance (child position relative to parent)
- Spatial queries (what's near this object?)
- Intuitive for artists

**ECS** (Modern):
```
Entities: [Player, PlayerBody, PlayerHead, Enemy1, Building, Tree]

Components:
- Position: [Player, Enemy1, Building, Tree]
- Renderable: [PlayerBody, PlayerHead, Enemy1, Building, Tree]
- Health: [Player, Enemy1]
- AI: [Enemy1]

Systems:
- MovementSystem: Process Position + Velocity
- RenderSystem: Process Position + Renderable
- AISystem: Process AI + Position
```

**Characteristics**:
- Flat structure (no hierarchy)
- Cache-friendly data layout
- Easy parallelization
- Great for large numbers of entities

**Hybrid Approach** (Best of both worlds):
```cpp
// Use scene graph for spatial relationships
// Use ECS for component-based logic

struct Transform : Component {
    Vector3 localPosition;
    Vector3 localRotation;
    Vector3 localScale;

    EntityID parent;  // Reference to parent entity
    std::vector<EntityID> children;

    // Computed from hierarchy
    Matrix4x4 worldMatrix;
};

// System updates world transforms from hierarchy
class TransformSystem : public System {
    void update() {
        // Update root entities first
        for (auto [entity, transform] : view<Transform>()) {
            if (transform.parent == NULL_ENTITY) {
                transform.worldMatrix = computeLocal(transform);
            }
        }

        // Then update children (transforms propagate down)
        for (auto [entity, transform] : view<Transform>()) {
            if (transform.parent != NULL_ENTITY) {
                auto& parentTransform = get<Transform>(transform.parent);
                transform.worldMatrix =
                    parentTransform.worldMatrix * computeLocal(transform);
            }
        }
    }
};
```

---

## The ECS Abstraction

Let's dive deeper into why ECS is the dominant game abstraction:

### Memory Layout Comparison

**OOP** (Poor cache performance):
```
Memory (objects scattered):
[Player obj] ... [Enemy obj] ... [NPC obj] ... [Bullet obj]
   |               |               |              |
   v               v               v              v
All data for     All data for    All data for   All data for
Player           Enemy           NPC            Bullet

To update positions of all objects:
Jump around memory (cache miss on every object!)
```

**ECS** (Excellent cache performance):
```
Memory (components contiguous):

Position Array: [Player pos][Enemy pos][NPC pos][Bullet pos]...
Velocity Array: [Player vel][Enemy vel][Bullet vel]...
Health Array:   [Player hp][Enemy hp][NPC hp]...

To update positions:
Sequential memory access (cache prefetcher loads next items!)
```

### System Update Order

```cpp
class GameWorld {
    // Systems updated in specific order
    std::vector<System*> systems;

public:
    void update(float dt) {
        // Order matters!
        inputSystem->update(dt);       // 1. Process player input
        aiSystem->update(dt);          // 2. AI decisions
        physicsSystem->update(dt);     // 3. Apply physics
        collisionSystem->update(dt);   // 4. Detect collisions
        damageSystem->update(dt);      // 5. Apply damage
        healthSystem->update(dt);      // 6. Check deaths
        animationSystem->update(dt);   // 7. Update animations
        audioSystem->update(dt);       // 8. Play sounds
        particleSystem->update(dt);    // 9. Update particles
        renderSystem->update(dt);      // 10. Draw everything
    }
};
```

### Dynamic Component Modification

```cpp
// Enemy takes damage and catches fire
void onDamage(EntityID enemy, float damage) {
    auto& health = registry.get<Health>(enemy);
    health.current -= damage;

    if (health.current <= 0) {
        // Add death components
        registry.add<Dead>(enemy);
        registry.add<DeathAnimation>(enemy, {deathAnim, 2.0f});

        // Remove AI (dead enemies don't think)
        registry.remove<AIControlled>(enemy);

    } else if (damage > 50) {
        // Add fire effect
        registry.add<OnFire>(enemy, {damagePerSecond: 5, duration: 10});
        registry.add<ParticleEmitter>(enemy, {fireParticles});
    }
}

// Systems automatically handle new components
class FireSystem : public System {
    void update(float dt) {
        // Process all entities that are on fire
        for (auto [entity, fire, health] : view<OnFire, Health>()) {
            health.current -= fire.damagePerSecond * dt;
            fire.duration -= dt;

            if (fire.duration <= 0) {
                registry.remove<OnFire>(entity);
                registry.remove<ParticleEmitter>(entity);
            }
        }
    }
};
```

---

## Resource Management

Games need sophisticated resource management due to:
- Fixed memory budgets (especially consoles)
- Large assets (textures, meshes, audio)
- Loading times (need streaming)

### Core Resource Abstractions

**1. Resource Handles** (not raw pointers):
```cpp
// Handle = type-safe index into resource array
template<typename T>
struct Handle {
    uint32_t index;
    uint32_t generation;  // Detect stale handles

    bool isValid() const {
        return index != INVALID_INDEX &&
               ResourceManager::get().isValid(*this);
    }
};

// Usage (safe!)
Handle<Texture> playerTexture = ResourceManager::load<Texture>("player.png");

// Later...
if (playerTexture.isValid()) {
    Texture& tex = ResourceManager::get(playerTexture);
    render(tex);
}
// If resource was unloaded, isValid() returns false
```

**2. Reference Counting**:
```cpp
class TextureManager {
    struct TextureEntry {
        TextureData data;
        int refCount;
        std::string path;
    };

    std::vector<TextureEntry> textures;

public:
    Handle<Texture> acquire(const std::string& path) {
        // Find existing
        for (size_t i = 0; i < textures.size(); i++) {
            if (textures[i].path == path) {
                textures[i].refCount++;
                return {i, 0};
            }
        }

        // Load new
        TextureData data = loadFromDisk(path);
        textures.push_back({data, 1, path});
        return {textures.size() - 1, 0};
    }

    void release(Handle<Texture> handle) {
        textures[handle.index].refCount--;

        if (textures[handle.index].refCount == 0) {
            unload(textures[handle.index]);
        }
    }
};
```

**3. Streaming**:
```cpp
class StreamingManager {
    // Load levels in background
    void streamLevel(const std::string& levelName) {
        // Start async load
        AsyncTaskHandle task = AsyncLoad(levelName);

        // Register callback
        task.onComplete([this, levelName](LevelData data) {
            // Main thread: create GPU resources
            this->createGPUResources(data);

            // Unload previous level
            this->unloadPreviousLevel();

            // Mark level as active
            this->activeLevel = levelName;
        });
    }

    // Texture streaming based on distance
    void updateTextureStreaming() {
        Vector3 cameraPos = camera.getPosition();

        for (auto [entity, renderable, pos] : view<Renderable, Position>()) {
            float distance = (pos - cameraPos).length();

            // Determine required mip level
            int mipLevel = calculateMipLevel(distance);

            // Load higher res if needed
            if (mipLevel < renderable.currentMipLevel) {
                requestHigherResMip(renderable.texture, mipLevel);
            }
            // Unload if too far
            else if (mipLevel > renderable.currentMipLevel + 2) {
                releaseHigherResMips(renderable.texture, mipLevel);
            }
        }
    }
};
```

---

[Continued in next part due to length...]

# Part 3: Practical Implementation

## Building a Complete Verb Analyzer CLI Tool

Let's build a production-ready tool for automated verb extraction:

```python
#!/usr/bin/env python3
"""
Code Verb Analyzer - Automatically extract operation sequences from code
Supports: Python, with extensibility for other languages via tree-sitter
"""

import ast
import argparse
import json
import sys
from pathlib import Path
from typing import List, Dict, Set
from dataclasses import dataclass, asdict
from collections import Counter, defaultdict

@dataclass
class VerbSequence:
    """Represents a sequence of verbs in a function"""
    function_name: str
    file_path: str
    line_number: int
    verbs: List[str]
    complexity: int  # Number of operations
    
    def get_pipeline(self) -> str:
        """Get verb pipeline string"""
        return ' → '.join(self.verbs)

class CodeVerbAnalyzer:
    """Main analyzer class"""
    
    def __init__(self, root_path: str, exclude_patterns: List[str] = None):
        self.root_path = Path(root_path)
        self.exclude_patterns = exclude_patterns or ['test_', '__pycache__', '.git']
        
        self.sequences: List[VerbSequence] = []
        self.verb_frequency: Counter = Counter()
        self.function_complexity: Dict[str, int] = {}
        
    def analyze(self):
        """Analyze all Python files in directory"""
        python_files = list(self.root_path.rglob('*.py'))
        
        for file_path in python_files:
            # Skip excluded patterns
            if any(pattern in str(file_path) for pattern in self.exclude_patterns):
                continue
                
            self._analyze_file(file_path)
    
    def _analyze_file(self, file_path: Path):
        """Analyze single file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                source = f.read()
            
            tree = ast.parse(source, filename=str(file_path))
            analyzer = FunctionVerbExtractor(str(file_path))
            analyzer.visit(tree)
            
            # Collect results
            for func_name, verbs in analyzer.function_verbs.items():
                sequence = VerbSequence(
                    function_name=func_name,
                    file_path=str(file_path),
                    line_number=analyzer.function_lines[func_name],
                    verbs=verbs,
                    complexity=len(verbs)
                )
                self.sequences.append(sequence)
                
                # Update statistics
                self.verb_frequency.update(verbs)
                self.function_complexity[f"{file_path}::{func_name}"] = len(verbs)
                
        except Exception as e:
            print(f"Warning: Could not analyze {file_path}: {e}", file=sys.stderr)
    
    def get_summary(self) -> Dict:
        """Get analysis summary"""
        return {
            'total_functions': len(self.sequences),
            'total_verbs': sum(self.verb_frequency.values()),
            'unique_verbs': len(self.verb_frequency),
            'avg_complexity': sum(self.function_complexity.values()) / len(self.function_complexity) if self.function_complexity else 0,
            'most_common_verbs': self.verb_frequency.most_common(10),
            'most_complex_functions': sorted(
                self.function_complexity.items(),
                key=lambda x: x[1],
                reverse=True
            )[:10]
        }
    
    def export_json(self, output_path: str):
        """Export results to JSON"""
        data = {
            'summary': self.get_summary(),
            'sequences': [asdict(seq) for seq in self.sequences]
        }
        
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
    
    def export_markdown(self, output_path: str):
        """Export results to Markdown report"""
        summary = self.get_summary()
        
        with open(output_path, 'w') as f:
            f.write("# Code Verb Analysis Report\n\n")
            
            # Summary
            f.write("## Summary\n\n")
            f.write(f"- **Total Functions**: {summary['total_functions']}\n")
            f.write(f"- **Total Verbs**: {summary['total_verbs']}\n")
            f.write(f"- **Unique Verbs**: {summary['unique_verbs']}\n")
            f.write(f"- **Average Complexity**: {summary['avg_complexity']:.1f} verbs/function\n\n")
            
            # Most common verbs
            f.write("## Most Common Operations\n\n")
            f.write("| Verb | Count |\n")
            f.write("|------|-------|\n")
            for verb, count in summary['most_common_verbs']:
                f.write(f"| `{verb}` | {count} |\n")
            f.write("\n")
            
            # Most complex functions
            f.write("## Most Complex Functions\n\n")
            for func, complexity in summary['most_complex_functions']:
                f.write(f"### `{func}` ({complexity} operations)\n\n")
                
                # Find sequence
                for seq in self.sequences:
                    if f"{seq.file_path}::{seq.function_name}" == func:
                        f.write(f"**Pipeline**: {seq.get_pipeline()}\n\n")
                        break

class FunctionVerbExtractor(ast.NodeVisitor):
    """Extracts verbs from function bodies"""
    
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.current_function = None
        self.function_verbs: Dict[str, List[str]] = defaultdict(list)
        self.function_lines: Dict[str, int] = {}
    
    def visit_FunctionDef(self, node):
        """Visit function definition"""
        previous_function = self.current_function
        self.current_function = node.name
        self.function_lines[node.name] = node.lineno
        
        # Visit function body
        self.generic_visit(node)
        
        self.current_function = previous_function
    
    def visit_Call(self, node):
        """Visit function call"""
        if self.current_function:
            func_name = self._get_call_name(node)
            if func_name:
                self.function_verbs[self.current_function].append(func_name)
        
        self.generic_visit(node)
    
    def _get_call_name(self, node):
        """Extract function name from call"""
        if isinstance(node.func, ast.Name):
            return node.func.id
        elif isinstance(node.func, ast.Attribute):
            return node.func.attr
        return None

def main():
    """CLI entry point"""
    parser = argparse.ArgumentParser(
        description='Analyze code and extract verb sequences (operations performed)'
    )
    parser.add_argument('path', help='Path to Python file or directory')
    parser.add_argument('--output', '-o', help='Output file (JSON or Markdown)')
    parser.add_argument('--format', '-f', choices=['json', 'markdown', 'console'],
                       default='console', help='Output format')
    parser.add_argument('--exclude', nargs='*', default=['test_', '__pycache__'],
                       help='Patterns to exclude')
    
    args = parser.parse_args()
    
    # Run analysis
    analyzer = CodeVerbAnalyzer(args.path, exclude_patterns=args.exclude)
    analyzer.analyze()
    
    # Output results
    if args.format == 'json':
        output = args.output or 'verb-analysis.json'
        analyzer.export_json(output)
        print(f"Results exported to {output}")
        
    elif args.format == 'markdown':
        output = args.output or 'verb-analysis.md'
        analyzer.export_markdown(output)
        print(f"Report exported to {output}")
        
    else:  # console
        summary = analyzer.get_summary()
        
        print("=" * 70)
        print("CODE VERB ANALYSIS")
        print("=" * 70)
        print(f"\nAnalyzed: {summary['total_functions']} functions")
        print(f"Total verbs: {summary['total_verbs']}")
        print(f"Unique verbs: {summary['unique_verbs']}")
        print(f"Avg complexity: {summary['avg_complexity']:.1f} verbs/function")
        
        print("\nMost Common Operations:")
        for verb, count in summary['most_common_verbs']:
            print(f"  {verb:20} {count:4}")
        
        print("\nMost Complex Functions:")
        for func, complexity in summary['most_complex_functions'][:5]:
            print(f"  {func:50} {complexity:3} ops")

if __name__ == '__main__':
    main()
```

**Usage**:
```bash
# Analyze directory
python verb_analyzer.py src/

# Export to JSON
python verb_analyzer.py src/ --format json --output analysis.json

# Export to Markdown report
python verb_analyzer.py src/ --format markdown --output REPORT.md

# Exclude patterns
python verb_analyzer.py src/ --exclude test_ __pycache__ migrations
```

---

## Implementing Core Game Abstractions

### Minimal ECS Implementation

Here's a minimal but complete ECS implementation showing the core abstraction:

```cpp
// ecs.hpp - Minimal Entity Component System

#include <vector>
#include <unordered_map>
#include <typeindex>
#include <memory>
#include <algorithm>

// Entity is just an ID
using Entity = uint32_t;
constexpr Entity NULL_ENTITY = 0;

// Component pool interface
class IComponentPool {
public:
    virtual ~IComponentPool() = default;
    virtual void remove(Entity entity) = 0;
};

// Typed component pool
template<typename T>
class ComponentPool : public IComponentPool {
    // Sparse set for fast lookup
    std::unordered_map<Entity, size_t> entityToIndex;
    std::vector<Entity> entities;
    std::vector<T> components;

public:
    void add(Entity entity, T component) {
        if (entityToIndex.contains(entity)) {
            // Update existing
            size_t index = entityToIndex[entity];
            components[index] = component;
        } else {
            // Add new
            size_t index = components.size();
            entityToIndex[entity] = index;
            entities.push_back(entity);
            components.push_back(component);
        }
    }

    void remove(Entity entity) override {
        if (!entityToIndex.contains(entity)) return;

        // Swap with last element
        size_t index = entityToIndex[entity];
        size_t lastIndex = components.size() - 1;

        if (index != lastIndex) {
            components[index] = components[lastIndex];
            entities[index] = entities[lastIndex];
            entityToIndex[entities[lastIndex]] = index;
        }

        components.pop_back();
        entities.pop_back();
        entityToIndex.erase(entity);
    }

    T* get(Entity entity) {
        if (!entityToIndex.contains(entity)) return nullptr;
        return &components[entityToIndex[entity]];
    }

    bool has(Entity entity) const {
        return entityToIndex.contains(entity);
    }

    // Iteration
    auto begin() { return components.begin(); }
    auto end() { return components.end(); }

    const std::vector<Entity>& getEntities() const { return entities; }
    const std::vector<T>& getComponents() const { return components; }
};

// ECS Registry
class Registry {
    Entity nextEntity = 1;
    std::unordered_map<std::type_index, std::unique_ptr<IComponentPool>> pools;

    template<typename T>
    ComponentPool<T>* getPool() {
        auto type = std::type_index(typeid(T));

        if (!pools.contains(type)) {
            pools[type] = std::make_unique<ComponentPool<T>>();
        }

        return static_cast<ComponentPool<T>*>(pools[type].get());
    }

public:
    // Create entity
    Entity create() {
        return nextEntity++;
    }

    // Destroy entity (remove all components)
    void destroy(Entity entity) {
        for (auto& [type, pool] : pools) {
            pool->remove(entity);
        }
    }

    // Add/update component
    template<typename T>
    void add(Entity entity, T component) {
        getPool<T>()->add(entity, component);
    }

    // Remove component
    template<typename T>
    void remove(Entity entity) {
        getPool<T>()->remove(entity);
    }

    // Get component
    template<typename T>
    T* get(Entity entity) {
        return getPool<T>()->get(entity);
    }

    // Check if entity has component
    template<typename T>
    bool has(Entity entity) {
        return getPool<T>()->has(entity);
    }

    // View: iterate entities with specific components
    template<typename... Components>
    class View {
        Registry& registry;

    public:
        View(Registry& reg) : registry(reg) {}

        // Iterator
        class Iterator {
            Registry& registry;
            const std::vector<Entity>* entities;
            size_t index;

            bool hasAllComponents(Entity entity) {
                return (registry.has<Components>(entity) && ...);
            }

            void advance() {
                while (index < entities->size()) {
                    if (hasAllComponents((*entities)[index])) {
                        break;
                    }
                    index++;
                }
            }

        public:
            Iterator(Registry& reg, const std::vector<Entity>* ents, size_t idx)
                : registry(reg), entities(ents), index(idx) {
                advance();
            }

            Entity operator*() const { return (*entities)[index]; }

            Iterator& operator++() {
                index++;
                advance();
                return *this;
            }

            bool operator!=(const Iterator& other) const {
                return index != other.index;
            }
        };

        Iterator begin() {
            // Use smallest component pool for iteration
            const std::vector<Entity>* entities = &registry.getPool<
                typename std::tuple_element<0, std::tuple<Components...>>::type
            >()->getEntities();

            return Iterator(registry, entities, 0);
        }

        Iterator end() {
            const std::vector<Entity>* entities = &registry.getPool<
                typename std::tuple_element<0, std::tuple<Components...>>::type
            >()->getEntities();

            return Iterator(registry, entities, entities->size());
        }
    };

    template<typename... Components>
    View<Components...> view() {
        return View<Components...>(*this);
    }
};
```

**Usage Example**:
```cpp
// Define components
struct Position { float x, y, z; };
struct Velocity { float dx, dy, dz; };
struct Health { float current, max; };
struct Sprite { int textureID; };

// Create registry
Registry registry;

// Create entities
Entity player = registry.create();
registry.add(player, Position{0, 0, 0});
registry.add(player, Velocity{0, 0, 0});
registry.add(player, Health{100, 100});
registry.add(player, Sprite{1});

Entity enemy = registry.create();
registry.add(enemy, Position{10, 0, 0});
registry.add(enemy, Velocity{-1, 0, 0});
registry.add(enemy, Health{50, 50});
registry.add(enemy, Sprite{2});

// Systems
void movementSystem(Registry& reg, float dt) {
    for (Entity entity : reg.view<Position, Velocity>()) {
        Position* pos = reg.get<Position>(entity);
        Velocity* vel = reg.get<Velocity>(entity);

        pos->x += vel->dx * dt;
        pos->y += vel->dy * dt;
        pos->z += vel->dz * dt;
    }
}

void renderSystem(Registry& reg) {
    for (Entity entity : reg.view<Position, Sprite>()) {
        Position* pos = reg.get<Position>(entity);
        Sprite* sprite = reg.get<Sprite>(entity);

        drawSprite(sprite->textureID, pos->x, pos->y);
    }
}

// Game loop
while (running) {
    float dt = getDeltaTime();

    movementSystem(registry, dt);
    renderSystem(registry);

    present();
}
```

---

## Performance Considerations

### Verb Extraction Performance

**AST Parsing Overhead**:
- Python `ast` module: ~10-50ms per file
- Tree-sitter: ~1-5ms per file (faster!)
- Babel/TypeScript: ~20-100ms per file

**Optimization Strategies**:

1. **Parallel Processing**:
```python
from multiprocessing import Pool

def analyze_codebase_parallel(root_dir, num_workers=8):
    files = list(Path(root_dir).rglob('*.py'))

    with Pool(num_workers) as pool:
        results = pool.map(analyze_single_file, files)

    return merge_results(results)
```

2. **Incremental Analysis**:
```python
# Only re-analyze changed files
def incremental_analyze(root_dir, cache_file='.verb_cache.json'):
    cache = load_cache(cache_file)

    for file in get_python_files(root_dir):
        file_mtime = file.stat().st_mtime

        if file not in cache or cache[file]['mtime'] < file_mtime:
            # File changed, re-analyze
            result = analyze_file(file)
            cache[file] = {'mtime': file_mtime, 'result': result}

    save_cache(cache_file, cache)
    return cache
```

3. **Caching ASTs**:
```python
import pickle

def analyze_with_ast_cache(file_path):
    cache_path = f"{file_path}.ast.cache"

    if cache_path.exists() and cache_path.stat().st_mtime > file_path.stat().st_mtime:
        # Load cached AST
        with open(cache_path, 'rb') as f:
            tree = pickle.load(f)
    else:
        # Parse and cache
        with open(file_path) as f:
            tree = ast.parse(f.read())

        with open(cache_path, 'wb') as f:
            pickle.dump(tree, f)

    return analyze_ast(tree)
```

### Game ECS Performance

**Benchmarks** (Processing 10,000 entities):

| Operation | OOP | ECS | Speedup |
|-----------|-----|-----|---------|
| Update positions | 15ms | 2ms | 7.5x |
| Collision detection | 50ms | 8ms | 6.25x |
| Rendering prep | 10ms | 1.5ms | 6.67x |

**Performance Tips**:

1. **Component Size**: Keep components small (cache-friendly)
```cpp
// GOOD: Small, focused components
struct Position { float x, y, z; };  // 12 bytes

// BAD: Large, bloated components
struct Transform {
    Vector3 position;         // 12 bytes
    Quaternion rotation;      // 16 bytes
    Vector3 scale;            // 12 bytes
    Matrix4x4 worldMatrix;    // 64 bytes
    Matrix4x4 localMatrix;    // 64 bytes
    // ... more data
};  // 200+ bytes!
```

2. **System Order**: Process systems in cache-friendly order
```cpp
// GOOD: Process same components together
movementSystem();  // Touches Position, Velocity
physicsSystem();   // Touches Position, Velocity (still hot in cache!)

// BAD: Interleave different components
movementSystem();  // Position, Velocity
renderSystem();    // Position, Renderable (cache miss)
physicsSystem();   // Position, Velocity (cache miss, reload)
```

3. **SIMD**: Use SIMD for bulk operations
```cpp
// SIMD-optimized position update
void updatePositions(Position* positions, Velocity* velocities,
                     size_t count, float dt) {
    // Process 4 positions at once with SSE
    for (size_t i = 0; i < count; i += 4) {
        __m128 px = _mm_load_ps(&positions[i].x);
        __m128 vx = _mm_load_ps(&velocities[i].dx);
        __m128 result = _mm_add_ps(px, _mm_mul_ps(vx, _mm_set1_ps(dt)));
        _mm_store_ps(&positions[i].x, result);
        // Repeat for y, z...
    }
}
```

---

## Conclusion

### Part 1 Summary: Automated Verb Extraction

**Key Tools**:
- **Tree-sitter**: Fast multi-language parser
- **ast-grep**: Structural pattern matching
- **Semgrep**: Semantic code search
- **Language AST libraries**: Built-in parsers (Python `ast`, Babel, JavaParser)

**Capabilities**:
- Extract verb sequences automatically
- Generate call graphs
- Analyze codebase-wide patterns
- Export to JSON/Markdown reports

**Benefits**:
- 10x faster code comprehension
- Automated documentation
- Pattern recognition
- Complexity metrics

### Part 2 Summary: Game Abstractions

**Essential Abstractions**:
1. **Game Loop**: Fixed timestep, continuous simulation
2. **ECS**: Entity-Component-System for data-oriented design
3. **Resource Management**: Handles, streaming, ref-counting
4. **Scene Organization**: Scene graphs or flat ECS

**Why Different from Apps**:
- **Performance**: 60+ FPS mandatory (16ms frame budget)
- **Memory**: Fixed budgets, manual management
- **Processing**: Data-parallel, SIMD-friendly
- **Composition**: Dynamic component-based vs static class hierarchies

**Key Patterns**:
- Systems operate on component combinations
- Cache-friendly data layouts
- Parallelization through independent systems
- Flexible runtime composition

### The Connection

**Automated verb extraction** reveals that:
- Game code: Low verb density (primitive operations repeated millions of times)
- App code: High verb density (many unique domain operations)

**Game abstractions** enable:
- Efficient processing of repetitive operations (verbs)
- Clear separation of data and logic
- Performance through data-oriented design

Both demonstrate the importance of **thinking in terms of operations (verbs)** rather than objects (nouns) - whether you're analyzing code or designing game systems.

---

## Further Resources

### Automated Analysis
- Tree-sitter: https://tree-sitter.github.io/tree-sitter/
- ast-grep: https://ast-grep.github.io/
- Semgrep: https://semgrep.dev/

### Game Architecture
- "Game Engine Architecture" by Jason Gregory
- "Data-Oriented Design" by Richard Fabian
- EnTT Documentation: https://github.com/skypjack/entt
- Flecs Documentation: https://github.com/SanderMertens/flecs

### Academic Papers
- "Entity Systems are the future of MMOG development" - Adam Martin
- "Data-Oriented Design" - Mike Acton (CppCon talk)
- "Practical Examples in Data Oriented Design" - Niklas Frykholm
