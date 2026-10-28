"""Phase 1 programming questions: Python, SQL, data structures and algorithms.
Python answers come from running the snippet; SQL answers from running the query on an in-memory SQLite database;
algorithm answers from running a reference implementation."""
import contextlib
import io
import math
import sqlite3
from collections import deque

from question_tools import near

PY, SQ, DS = "python", "sql", "data_structures_algorithms"


def run(code):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(code, {})
    return buf.getvalue().strip()


def py_q(b, level, sub, code, explain, wrong=(), prompt="What does this code print?"):
    out = run(code)
    pool = [w for w in wrong if w != out]
    b.add(PY, sub, level, f"{prompt}\n\n{code}", out, pool, explain, qtype="multiple_choice")


def python(b):
    r = b.rng
    # --- slicing
    for _ in range(18):
        n = r.randint(5, 9); data = [r.randint(1, 9) for _ in range(n)]
        a, c = r.randint(0, 2), r.randint(3, n)
        st = r.choice([1, 1, 2, 3]); neg = r.random() < 0.3
        sl = f"[::-1]" if neg else f"[{a}:{c}:{st}]" if st != 1 else f"[{a}:{c}]"
        code = f"data = {data}\nprint(data{sl})"
        out = run(code)
        ref = eval(f"data{sl}", {"data": data})
        assert out == str(ref)
        wrong = [str(data[a + 1:c]), str(data[a:c + 1]), str(data[::-1] if not neg else data), str(data[a:]), str(data[:c])]
        py_q(b, "beginner", "slicing", code, "Slices include the start index and exclude the stop index; a negative step walks backwards.", wrong)
    # --- list comprehensions / functions
    for _ in range(16):
        n = r.randint(4, 8); k = r.randint(2, 4); op = r.choice(["x * x", "x + 1", "x * 2"]); cond = r.choice([f"x % {k} == 0", f"x > {k}", f"x % 2 == 1"])
        code = f"nums = list(range({n}))\nprint([{op} for x in nums if {cond}])"
        out = run(code)
        wrong = [str([eval(op) for x in range(n)]), str([x for x in range(n) if eval(cond)]), str([eval(op) for x in range(n) if not eval(cond)]), str(len([x for x in range(n) if eval(cond)])), "[]"]
        py_q(b, "beginner", "comprehensions", code, "The condition filters first, then the expression is applied to what remains.", wrong)
    for _ in range(12):
        words = r.sample(["apple", "kiwi", "banana", "fig", "cherry", "date", "plum", "grape"], 4); f = r.choice(["len", "str.upper", "lambda w: w[-1]"])
        code = f"words = {words}\nprint(sorted(words, key={f}))" if f != "str.upper" else f"words = {words}\nprint(sorted(words, key=str.upper))"
        out = run(code)
        wrong = [str(sorted(words)), str(sorted(words, reverse=True)), str(words), str(sorted(words, key=len, reverse=True))]
        py_q(b, "intermediate", "sorting", code, "sorted() returns a new list ordered by the key function; ties keep their original order (it is stable).", wrong)
    # --- dictionaries
    for _ in range(14):
        keys = r.sample("abcdefg", 4); d = {k: r.randint(1, 9) for k in keys}; k0 = r.choice(keys)
        op = r.choice(["d.get('z', 0)", f"d.get('{k0}')", "sum(d.values())", "len(d)", "max(d, key=d.get)", f"d.pop('{k0}') + len(d)", "list(d.items())[0]"])
        code = f"d = {d}\nprint({op})"
        out = run(code)
        wrong = [str(len(d)), str(sum(d.values())), "None", "0", str(max(d.values())), str(list(d)[0]), str(min(d, key=d.get))]
        py_q(b, "beginner", "dictionaries", code, "Work through the dictionary operation line by line.", wrong)
    # --- strings
    for _ in range(18):
        s = r.choice(["data science", "Hello, World", "machine learning", "python3 rocks", "AI Engineer", "a-b-c-d", "  padded  ", "mississippi"])
        op = r.choice(["s.upper()", "s.title()", "s.split()", "s.replace('s', 'z')", "s.count('s')", "s.find('e')", "s[::-1]", "s.strip()", "s.split('-')", "len(s)", "s.startswith('m')", "s.swapcase()", "'-'.join(s.split())", "s.index('a')"])
        code = f"s = {s!r}\nprint({op})"
        try:
            out = run(code)
        except Exception:
            continue
        wrong = [str(len(s)), s.upper() if op != "s.upper()" else s.lower(), str(s.split()), s.title() if op != "s.title()" else s, str(s.count("a")), "-1", "True", "False"]
        py_q(b, "beginner", "strings", code, "Strings are immutable; each method returns a new value.", wrong)
    # --- loops and ranges
    for _ in range(16):
        a, c, st = r.randint(0, 3), r.randint(6, 14), r.randint(1, 4)
        body = r.choice(["total += i", "total += i * i", "total += 1 if i % 2 == 0 else 0", "total = total * 2 + i"])
        code = f"total = 0\nfor i in range({a}, {c}, {st}):\n    {body}\nprint(total)"
        out = run(code)
        wrong = [str(int(out) + 1), str(int(out) - 1), str(int(out) * 2), str(sum(range(a, c))), str(len(range(a, c, st)))]
        py_q(b, "beginner", "loops", code, "range(start, stop, step) stops before `stop`; trace the loop variable and the total.", wrong)
    for _ in range(8):
        n = r.randint(3, 6)
        code = f"i = 0\nwhile i < {n}:\n    i += {r.randint(1, 3)}\n    if i == {r.randint(2, 4)}:\n        continue\n    print(i, end=' ')"
        py_q(b, "intermediate", "loops", code, "`continue` skips the rest of that pass of the loop, here the print.", [run(code.replace('continue', 'pass')), "0 1 2", str(n), "1 2 3"])
    # --- mutability and scope pitfalls
    for _ in range(6):
        a = r.randint(1, 4)
        code = f"a = [{a}, 2]\nb = a\nb.append(3)\nprint(a)"
        py_q(b, "intermediate", "mutability", code, "b = a copies the reference, not the list, so both names see the change.", [f"[{a}, 2]", f"[{a}, 2, 3, 3]", f"[3, {a}, 2]", "None"])
        code = f"a = [{a}, 2]\nb = a.copy()\nb.append(3)\nprint(a, b)"
        py_q(b, "intermediate", "mutability", code, "copy() makes a new list, so appending to b leaves a alone.", [f"[{a}, 2, 3] [{a}, 2, 3]", f"[{a}, 2] [{a}, 2]", f"[{a}, 2, 3] [{a}, 2]", "None None"])
    for n in (2, 3, 4):
        code = f"def add(x, items=[]):\n    items.append(x)\n    return items\n\nadd(1)\nprint(add({n}))"
        py_q(b, "advanced", "functions", code, "The default list is created once, when the function is defined, so it is shared between calls.", [f"[{n}]", "[1]", f"[{n}, 1]", "None"])
    for n in (3, 5, 7):
        code = f"def f(n):\n    if n <= 1:\n        return n\n    return f(n - 1) + f(n - 2)\nprint(f({n}))"
        py_q(b, "intermediate", "recursion", code, "This is the Fibonacci recurrence with f(0)=0 and f(1)=1.", [str(int(run(code)) + 1), str(int(run(code)) - 1), str(n), str(2 * int(run(code)))])
    for nums in ([1, 2, 3], [2, 4, 6, 8], [5, 1, 4]):
        code = f"nums = {nums}\nprint(sum(x * i for i, x in enumerate(nums)))"
        py_q(b, "intermediate", "enumerate", code, "enumerate pairs each value with its index starting at 0.", [str(sum(nums)), str(sum(x * (i + 1) for i, x in enumerate(nums))), str(sum(nums) * len(nums)), "0"])
    for a, c in [([1, 2, 3], ["a", "b", "c"]), ([4, 5], ["x", "y", "z"]), ([7, 8, 9], ["p", "q"])]:
        code = f"a = {a}\nb = {c}\nprint(list(zip(a, b)))"
        py_q(b, "beginner", "zip", code, "zip stops at the shorter input.", [str(list(zip(c, a))), str(a + c), str([(x, y) for x in a for y in c][:3]), str(len(a))])
    for expr in ("0.1 + 0.2 == 0.3", "7 // 2", "-7 // 2", "7 % 3", "-7 % 3", "2 ** 3 ** 2", "bool([])", "bool([0])", "3 in {3: 'x'}", "'a' < 'b'", "10 / 4", "10 // 4", "int('7') + 1", "round(2.5)", "round(3.5)", "type(3 / 1).__name__", "not (True and False)", "[] == []", "[] is []", "None == False"):
        code = f"print({expr})"
        out = run(code)
        if out in ("True", "False"):
            pool = ["True" if out == "False" else "False", "None", "Error", "0"]
        elif out.lstrip("-").replace(".", "").isdigit():
            v = float(out); pool = [str(int(v) + k) if v == int(v) else str(v + k) for k in (-1, 1, 2, -2)] + [str(-int(v)) if v == int(v) else str(-v)]
        else:
            pool = ["int", "float", "str", "bool"]
        py_q(b, "intermediate", "expressions", code, "Evaluate the expression following Python's operator rules.", pool)
    for code, expl in [
        ("try:\n    int('x')\nexcept ValueError:\n    print('bad')\nelse:\n    print('ok')\nfinally:\n    print('done')", "The except branch runs, the else branch is skipped, and finally always runs."),
        ("try:\n    x = 1\nexcept ValueError:\n    print('bad')\nelse:\n    print('ok')\nfinally:\n    print('done')", "No error, so else runs, then finally."),
        ("def g():\n    try:\n        return 1\n    finally:\n        print('cleanup')\nprint(g())", "finally runs before the function returns."),
        ("x = 10\ndef f():\n    x = 5\n    return x\nf()\nprint(x)", "The assignment inside f creates a local x, so the global is unchanged."),
        ("def gen():\n    for i in range(3):\n        yield i * i\nprint(list(gen()))", "A generator produces one value per yield."),
        ("t = (1, 2, 3)\ntry:\n    t[0] = 5\nexcept TypeError:\n    print('immutable')", "Tuples cannot be changed after creation."),
        ("s = {1, 2, 2, 3}\nprint(len(s))", "A set stores each distinct value once."),
        ("print(list(map(lambda x: x * 2, filter(lambda x: x % 2, range(6)))))", "filter keeps the odd numbers, then map doubles them."),
    ]:
        out = run(code)
        py_q(b, "intermediate", "control_flow", code, expl, [w for w in ["bad\ndone", "ok\ndone", "bad", "ok", "done", "1", "cleanup\n1", "1\ncleanup", "10", "5", "[0, 1, 4]", "[0, 2, 4]", "3", "4", "[2, 6, 10]", "[0, 4, 8]", "immutable", "1\nbad"] if w != out])


# ----------------------------------------------------------------------------------------------------------------- SQL
SCHEMA = """
CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, dept TEXT, salary INTEGER, manager_id INTEGER);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT, amount INTEGER, status TEXT);
"""


def make_db(r):
    db = sqlite3.connect(":memory:")
    db.executescript(SCHEMA)
    names = r.sample(["Ada", "Ben", "Cleo", "Dev", "Eli", "Fay", "Gus", "Hana", "Ivo", "Jun"], 7)
    depts = ["Eng", "Ops", "Sales"]
    rows = []
    for i, n in enumerate(names, 1):
        rows.append((i, n, r.choice(depts), r.choice([40, 50, 60, 70, 80, 90]) * 1000, None if i == 1 else r.randint(1, i - 1)))
    db.executemany("INSERT INTO employees VALUES (?,?,?,?,?)", rows)
    custs = r.sample(["Ana", "Bo", "Cy", "Di"], 4)
    orders = [(i, r.choice(custs), r.choice([10, 20, 35, 50, 75, 100]), r.choice(["paid", "paid", "pending", "refunded"])) for i in range(1, 9)]
    db.executemany("INSERT INTO orders VALUES (?,?,?,?)", orders)
    return db, rows, orders


def table_text(title, cols, rows):
    head = " | ".join(cols)
    return f"{title}\n{head}\n" + "\n".join(" | ".join("NULL" if v is None else str(v) for v in row) for row in rows)


def fmt_result(rows):
    if len(rows) == 1 and len(rows[0]) == 1:
        v = rows[0][0]
        return "NULL" if v is None else (str(int(v)) if isinstance(v, float) and v == int(v) else (f"{v:.2f}".rstrip("0").rstrip(".") if isinstance(v, float) else str(v)))
    return "; ".join(", ".join("NULL" if v is None else str(v) for v in row) for row in rows)


def perturb(rows):
    """Plausible wrong results: reordered, a row lost or added, numbers off, columns swapped."""
    out = []
    if len(rows) > 1:
        out += [fmt_result(rows[::-1]), fmt_result(rows[:-1]), fmt_result(rows[1:])]
    for k in range(len(rows[0])):
        for delta in (1, -1, 10000, -10000):
            shifted = [tuple((v + delta) if (i == k and isinstance(v, (int, float))) else v for i, v in enumerate(row)) for row in rows]
            if shifted != rows:
                out.append(fmt_result(shifted))
                break
    if len(rows[0]) > 1:
        out.append(fmt_result([tuple(reversed(row)) for row in rows]))
    if len(rows) == 1 and len(rows[0]) == 1 and isinstance(rows[0][0], (int, float)):
        v = rows[0][0]
        out += [fmt_result([(v + 1,)]), fmt_result([(max(v - 1, 0),)]), fmt_result([(v * 2,)])]
    return out


def sql(b):
    r = b.rng
    templates = [
        ("beginner", "select_where", "SELECT COUNT(*) FROM employees WHERE dept = '{d}'", "Count the rows whose dept equals {d}."),
        ("beginner", "aggregates", "SELECT SUM(salary) FROM employees WHERE dept = '{d}'", "Add up the salaries of the {d} department."),
        ("beginner", "aggregates", "SELECT MAX(salary) FROM employees", "The highest salary in the table."),
        ("beginner", "aggregates", "SELECT MIN(salary) FROM employees WHERE dept <> '{d}'", "The lowest salary outside {d}."),
        ("beginner", "aggregates", "SELECT AVG(salary) FROM employees WHERE dept = '{d}'", "The average salary within {d}."),
        ("beginner", "select_where", "SELECT name FROM employees WHERE salary > {s} ORDER BY name", "Names with salary above {s}, in alphabetical order."),
        ("beginner", "order_limit", "SELECT name FROM employees ORDER BY salary DESC, name LIMIT 1", "Highest salary first, ties broken by name; LIMIT 1 keeps the first row."),
        ("beginner", "order_limit", "SELECT name FROM employees ORDER BY salary ASC, name LIMIT 2", "Lowest two salaries, ties broken by name."),
        ("beginner", "distinct", "SELECT COUNT(DISTINCT dept) FROM employees", "The number of different departments."),
        ("intermediate", "group_by", "SELECT dept, COUNT(*) FROM employees GROUP BY dept ORDER BY dept", "One row per department with its head count."),
        ("intermediate", "group_by", "SELECT dept, SUM(salary) FROM employees GROUP BY dept HAVING SUM(salary) > {t} ORDER BY dept", "HAVING filters groups after aggregation."),
        ("intermediate", "group_by", "SELECT dept, MAX(salary) FROM employees GROUP BY dept ORDER BY dept", "The top salary in each department."),
        ("intermediate", "joins", "SELECT e.name, m.name FROM employees e JOIN employees m ON e.manager_id = m.id ORDER BY e.id LIMIT 3", "A self join pairs each employee with their manager's name."),
        ("intermediate", "joins", "SELECT COUNT(*) FROM employees e LEFT JOIN employees m ON e.manager_id = m.id WHERE m.id IS NULL", "A LEFT JOIN keeps unmatched rows; those with no manager have NULL on the right."),
        ("intermediate", "nulls", "SELECT COUNT(manager_id) FROM employees", "COUNT(column) ignores NULLs."),
        ("intermediate", "nulls", "SELECT COUNT(*) FROM employees WHERE manager_id = NULL", "Comparing with = NULL is never true; use IS NULL."),
        ("intermediate", "nulls", "SELECT COUNT(*) - COUNT(manager_id) FROM employees", "COUNT(*) counts rows, COUNT(manager_id) counts non-NULL values."),
        ("intermediate", "subqueries", "SELECT name FROM employees WHERE salary = (SELECT MAX(salary) FROM employees) ORDER BY name", "The subquery finds the maximum; the outer query returns everyone who has it."),
        ("intermediate", "subqueries", "SELECT COUNT(*) FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)", "Count rows above the overall average."),
        ("intermediate", "orders", "SELECT customer, SUM(amount) FROM orders WHERE status = 'paid' GROUP BY customer ORDER BY customer", "Only paid orders are summed, per customer."),
        ("intermediate", "orders", "SELECT COUNT(*) FROM orders WHERE status IN ('pending', 'refunded')", "IN matches any value in the list."),
        ("beginner", "orders", "SELECT SUM(amount) FROM orders WHERE status = 'paid'", "Sum of the amount column for paid orders."),
        ("advanced", "orders", "SELECT status, COUNT(*) FROM orders GROUP BY status HAVING COUNT(*) > 1 ORDER BY status", "Statuses that appear more than once."),
        ("advanced", "window", "SELECT name, RANK() OVER (ORDER BY salary DESC) FROM employees ORDER BY salary DESC, name LIMIT 3", "RANK gives tied rows the same rank and skips the next number."),
        ("advanced", "window", "SELECT dept, name FROM (SELECT dept, name, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC, name) AS rn FROM employees) WHERE rn = 1 ORDER BY dept", "ROW_NUMBER inside each department picks one top earner per department."),
        ("advanced", "case", "SELECT SUM(CASE WHEN salary >= 70000 THEN 1 ELSE 0 END) FROM employees", "CASE turns each row into 1 or 0, and SUM counts the 1s."),
    ]
    for rep in range(14):
        db, emp, orders = make_db(r)
        et = table_text("employees", ["id", "name", "dept", "salary", "manager_id"], emp)
        ot = table_text("orders", ["id", "customer", "amount", "status"], orders)
        for lvl, sub, tpl, expl in templates:
            if r.random() > 0.5 and rep > 1:
                continue
            d = r.choice(["Eng", "Ops", "Sales"]); s = r.choice([50000, 60000, 70000]); t = r.choice([100000, 150000, 200000])
            query = tpl.format(d=d, s=s, t=t)
            try:
                res = fmt_result(db.execute(query).fetchall())
            except Exception:
                continue
            if res == "":
                continue
            rows_ = db.execute(query).fetchall()
            variants = perturb(rows_)
            for v in {tpl.replace("'{d}'", "'%s'" % o).format(d=o, s=s, t=t) for o in ("Eng", "Ops", "Sales")} | {tpl.format(d=d, s=s + 10000, t=t + 50000), tpl.format(d=d, s=s - 10000, t=t - 50000)}:
                try:
                    variants.append(fmt_result(db.execute(v).fetchall()))
                except Exception:
                    pass
            use = ot if "orders" in tpl else et
            both = ot if "orders" in tpl and "employees" not in tpl else (et if "orders" not in tpl else et + "\n\n" + ot)
            b.add(SQ, sub, lvl, f"Given the table(s)\n\n{both}\n\nWhat does this query return? (Columns are separated by commas and rows by semicolons; NULL means no value.)\n\n{query}", res, variants, expl.format(d=d, s=s, t=t), qtype="multiple_choice")
        db.close()
    b.add_concepts(SQ, "concepts", "beginner", [
        ("Which clause filters rows BEFORE they are grouped?", "WHERE", ["HAVING", "ORDER BY", "LIMIT", "SELECT"], "WHERE runs before GROUP BY; HAVING filters the groups afterwards."),
        ("What is the difference between WHERE and HAVING?", "WHERE filters rows; HAVING filters groups after aggregation", ["They are identical", "HAVING filters rows; WHERE filters groups", "WHERE only works on text", "HAVING can only be used with ORDER BY"], "Aggregate functions are only allowed in HAVING."),
        ("What does INNER JOIN return?", "Only rows with a match in both tables", ["All rows of the left table", "All rows of both tables", "Rows with no match", "The cross product of both tables"], "Unmatched rows are dropped."),
        ("What does LEFT JOIN do that INNER JOIN does not?", "Keeps every row of the left table, with NULLs where there is no match", ["Keeps only unmatched rows", "Sorts the left table", "Removes duplicates", "Joins on the primary key only"], "It is the way to find rows with no partner."),
        ("Which keyword removes duplicate rows from a result?", "DISTINCT", ["UNIQUE", "GROUP", "SINGLE", "REMOVE"], "SELECT DISTINCT keeps one copy of each row."),
        ("What is a primary key?", "A column (or set) that uniquely identifies each row", ["A column that can hold duplicates", "The first column of any table", "A column always containing text", "An index on every column"], "It must be unique and not NULL."),
        ("Why are indexes used?", "To speed up lookups, at some cost to writes and storage", ["To make queries return fewer rows", "To enforce NOT NULL", "To encrypt the table", "To remove duplicates"], "An index is a lookup structure kept alongside the table."),
        ("What does a foreign key do?", "Links a column to the primary key of another table and keeps the link valid", ["Encrypts a column", "Sorts the table", "Makes a column unique", "Counts related rows"], "It enforces referential integrity."),
        ("What is the result of 5 + NULL in SQL?", "NULL", ["5", "0", "An error", "FALSE"], "Arithmetic with NULL yields NULL."),
        ("What does COUNT(*) count?", "All rows, including those with NULLs", ["Only non-NULL values of the first column", "Distinct rows", "Columns", "Only rows matching the last WHERE"], "COUNT(column) skips NULLs; COUNT(*) does not."),
        ("In what order does SQL logically process a query?", "FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY", ["SELECT, FROM, WHERE, GROUP BY", "WHERE, FROM, SELECT, HAVING", "ORDER BY, SELECT, FROM", "GROUP BY, WHERE, FROM"], "That is why a SELECT alias cannot be used in WHERE."),
        ("What does ACID stand for in database transactions?", "Atomicity, Consistency, Isolation, Durability", ["Accuracy, Consistency, Integrity, Durability", "Atomicity, Concurrency, Isolation, Delay", "Availability, Consistency, Isolation, Data", "Access, Control, Integrity, Delete"], "The four guarantees of a reliable transaction."),
        ("Which statement adds rows to a table?", "INSERT INTO", ["ADD ROW", "UPDATE", "APPEND", "CREATE ROW"], "INSERT INTO table VALUES (...)."),
        ("What does UNION do compared with UNION ALL?", "UNION removes duplicate rows; UNION ALL keeps them", ["UNION keeps duplicates; UNION ALL removes them", "They are identical", "UNION joins on keys", "UNION ALL sorts the result"], "UNION must sort or hash to remove duplicates, so UNION ALL is faster."),
        ("Normalisation is mainly about…", "Reducing redundancy by splitting data into related tables", ["Making queries slower", "Encrypting data", "Adding duplicate copies", "Sorting columns alphabetically"], "Each fact is stored once."),
    ])


# ----------------------------------------------------------------------------------------- data structures and algorithms
def bst_insert(root, v):
    if root is None:
        return [v, None, None]
    if v < root[0]:
        root[1] = bst_insert(root[1], v)
    else:
        root[2] = bst_insert(root[2], v)
    return root


def inorder(t): return [] if t is None else inorder(t[1]) + [t[0]] + inorder(t[2])
def preorder(t): return [] if t is None else [t[0]] + preorder(t[1]) + preorder(t[2])
def postorder(t): return [] if t is None else postorder(t[1]) + postorder(t[2]) + [t[0]]
def height(t): return 0 if t is None else 1 + max(height(t[1]), height(t[2]))


def dsa(b):
    r = b.rng
    # --- binary search steps
    for _ in range(12):
        n = r.choice([7, 15, 31, 10, 20, 50, 100, 1000, 8, 64]); steps = math.floor(math.log2(n)) + 1
        b.add(DS, "binary_search", "intermediate", f"What is the maximum number of comparisons binary search needs on a sorted list of {n} items?", steps, near(r, steps) + [n, n // 2], f"Each step halves the range, so it takes at most ⌊log₂ {n}⌋ + 1 = {steps} comparisons.")
    for _ in range(8):
        arr = sorted(r.sample(range(1, 60), 9)); tgt = r.choice(arr); lo, hi, probes = 0, len(arr) - 1, []
        while lo <= hi:
            mid = (lo + hi) // 2; probes.append(arr[mid])
            if arr[mid] == tgt: break
            if arr[mid] < tgt: lo = mid + 1
            else: hi = mid - 1
        wrong = [str(len(probes) + 1), str(len(probes) - 1 if len(probes) > 1 else 3), str(arr.index(tgt) + 1), "9"]
        b.add(DS, "binary_search", "intermediate", f"Binary search for {tgt} in {arr}, always taking mid = (low + high) // 2. How many elements are examined?", len(probes), wrong, f"The probes are {probes}, so {len(probes)} elements are examined.")
    # --- complexity facts (hand-written)
    b.add_concepts(DS, "complexity", "beginner", [
        ("What is the time complexity of looking up a key in a hash table, on average?", "O(1)", ["O(log n)", "O(n)", "O(n log n)", "O(n²)"], "Hashing jumps straight to the bucket."),
        ("What is the time complexity of binary search on a sorted array?", "O(log n)", ["O(1)", "O(n)", "O(n log n)", "O(n²)"], "The search range halves each step."),
        ("What is the average time complexity of quicksort?", "O(n log n)", ["O(n)", "O(log n)", "O(n²)", "O(1)"], "Balanced partitions give log n levels of n work each; the worst case is O(n²)."),
        ("What is the worst-case time complexity of bubble sort?", "O(n²)", ["O(n)", "O(n log n)", "O(log n)", "O(2ⁿ)"], "Two nested passes over the data."),
        ("Appending to the end of a Python list is, amortised, what complexity?", "O(1)", ["O(n)", "O(log n)", "O(n log n)", "O(n²)"], "Occasional resizing is spread over many appends."),
        ("Inserting at the front of a Python list is what complexity?", "O(n)", ["O(1)", "O(log n)", "O(n log n)", "O(n²)"], "Every existing element must shift one place."),
        ("What is the complexity of checking `x in some_list` for a list of n items?", "O(n)", ["O(1)", "O(log n)", "O(n log n)", "O(n²)"], "It scans item by item."),
        ("What is the complexity of checking `x in some_set`?", "O(1) on average", ["O(n)", "O(log n)", "O(n log n)", "O(n²)"], "Sets are hash tables."),
        ("What is the time complexity of merge sort in the worst case?", "O(n log n)", ["O(n)", "O(n²)", "O(log n)", "O(2ⁿ)"], "It always splits in half and merges in linear time."),
        ("Which data structure gives first-in, first-out order?", "Queue", ["Stack", "Heap", "Binary search tree", "Hash table"], "People in a line: the first in is served first."),
        ("Which data structure gives last-in, first-out order?", "Stack", ["Queue", "Heap", "Linked list", "Graph"], "A stack of plates: the last placed is the first taken."),
        ("What is the time to get the smallest item from a binary min-heap?", "O(1)", ["O(log n)", "O(n)", "O(n log n)", "O(n²)"], "It sits at the root; removing it costs O(log n)."),
        ("What is the time complexity of inserting into a balanced binary search tree?", "O(log n)", ["O(1)", "O(n)", "O(n log n)", "O(n²)"], "The path from the root is log n long."),
        ("What is the time complexity of breadth-first search on a graph with V vertices and E edges?", "O(V + E)", ["O(V·E)", "O(V²)", "O(log V)", "O(E log V)"], "Each vertex and edge is visited once."),
        ("Dynamic programming speeds up recursive solutions mainly by…", "Storing the results of overlapping subproblems", ["Using more recursion", "Sorting the input", "Random sampling", "Removing the base case"], "Memoisation avoids recomputing the same subproblem."),
        ("Which problem is a classic use of a stack?", "Matching brackets in an expression", ["Finding the shortest path", "Scheduling tasks by arrival time", "Looking up a word", "Sorting by value"], "Push an opener, pop on a closer."),
        ("A hash collision happens when…", "Two different keys map to the same bucket", ["A key is missing", "The table is empty", "A value is None", "Two values are equal"], "Tables handle it by chaining or probing."),
        ("What is the space complexity of an in-place algorithm that uses a few extra variables?", "O(1)", ["O(n)", "O(log n)", "O(n²)", "O(n log n)"], "Extra memory does not grow with the input."),
        ("Which of these is NOT a stable sorting algorithm by default?", "Heap sort", ["Merge sort", "Insertion sort", "Bubble sort", "Python's sorted()"], "Heap sort can reorder equal elements."),
        ("In Big-O terms, which grows fastest as n gets large?", "2ⁿ", ["n²", "n log n", "n", "log n"], "Exponential growth overtakes polynomial growth."),
    ])
    for n in [10, 20, 100, 1000]:
        for code, ans, why in [
            (f"for i in range({n}):\n    print(i)", "O(n)", "One pass of n iterations."),
            (f"for i in range({n}):\n    for j in range({n}):\n        print(i, j)", "O(n²)", "Nested loops over n items each."),
            (f"i = {n}\nwhile i > 1:\n    i //= 2", "O(log n)", "The value halves each time."),
            (f"for i in range({n}):\n    for j in range(i):\n        pass", "O(n²)", "1 + 2 + … + n iterations, which is n(n+1)/2."),
        ]:
            b.add(DS, "complexity", "intermediate", f"What is the time complexity of this code in terms of n (here n = {n})?\n\n{code}", ans, [w for w in ("O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)") if w != ans], why)
    # --- trees
    for _ in range(14):
        vals = r.sample(range(1, 30), 7); root = None
        for v in vals: root = bst_insert(root, v)
        io, pre, post, h = inorder(root), preorder(root), postorder(root), height(root)
        assert io == sorted(vals)
        b.add(DS, "trees", "intermediate", f"Values {vals} are inserted in order into an empty binary search tree. What is the in-order traversal?", str(io), [str(pre), str(post), str(vals), str(io[::-1])], "In-order on a binary search tree visits the values in sorted order.")
        b.add(DS, "trees", "intermediate", f"Values {vals} are inserted in order into an empty binary search tree. What is the pre-order traversal (root, left, right)?", str(pre), [str(io), str(post), str(vals), str(sorted(vals, reverse=True))], "Pre-order visits the root first, then the left subtree, then the right.")
        b.add(DS, "trees", "intermediate", f"Values {vals} are inserted in order into an empty binary search tree. What is the height of the tree (number of levels)?", h, near(r, h) + [len(vals)], f"Follow the longest path from the root: {h} levels.")
    # --- graph traversal
    for _ in range(10):
        n = 6; edges = set()
        while len(edges) < 7:
            a, c = sorted(r.sample(range(n), 2)); edges.add((a, c))
        adj = {i: sorted([c for a, c in edges if a == i] + [a for a, c in edges if c == i]) for i in range(n)}
        seen, q, order = {0}, deque([0]), []
        while q:
            u = q.popleft(); order.append(u)
            for v in adj[u]:
                if v not in seen: seen.add(v); q.append(v)
        stack, seen2, dfs = [0], set(), []
        def rec(u):
            seen2.add(u); dfs.append(u)
            for v in adj[u]:
                if v not in seen2: rec(v)
        rec(0)
        text = ", ".join(f"{a}-{c}" for a, c in sorted(edges))
        b.add(DS, "graphs", "intermediate", f"An undirected graph has edges {text}. Starting at node 0 and visiting neighbours in increasing order, what is the breadth-first order of the nodes reached?", str(order), [str(dfs), str(sorted(order)), str(order[::-1]), str(order[:-1])], "BFS visits all neighbours of a node before moving deeper, using a queue.")
        b.add(DS, "graphs", "intermediate", f"An undirected graph has edges {text}. Starting at node 0 and visiting neighbours in increasing order, what is the depth-first order of the nodes reached?", str(dfs), [str(order), str(sorted(dfs)), str(dfs[::-1]), str(dfs[:-1])], "DFS follows one path as far as possible before backtracking.")
    # --- stack / queue
    for _ in range(12):
        ops, st, out = [], [], []
        for _ in range(8):
            if st and r.random() < 0.4: ops.append("pop"); out.append(st.pop())
            else: v = r.randint(1, 9); ops.append(f"push({v})"); st.append(v)
        b.add(DS, "stacks_queues", "beginner", f"A stack starts empty. Operations: {', '.join(ops)}. What is the stack from bottom to top at the end?", str(st) if st else "[]", [str(st[::-1]), str(sorted(st)), str(out), str(st[1:])], "Push adds on top; pop removes the most recent item.")
    for _ in range(10):
        ops, q, out = [], deque(), []
        for _ in range(8):
            if q and r.random() < 0.4: ops.append("dequeue"); out.append(q.popleft())
            else: v = r.randint(1, 9); ops.append(f"enqueue({v})"); q.append(v)
        left = list(q)
        b.add(DS, "stacks_queues", "beginner", f"A queue starts empty. Operations: {', '.join(ops)}. What is the queue from front to back at the end?", str(left) if left else "[]", [str(left[::-1]), str(sorted(left)), str(out), str(left[1:])], "Enqueue adds at the back; dequeue removes from the front (first in, first out).")
    # --- sorting passes
    for _ in range(12):
        arr = r.sample(range(1, 20), 6); k = r.randint(1, 3); a = arr[:]
        for p in range(k):
            for i in range(len(a) - 1 - p):
                if a[i] > a[i + 1]: a[i], a[i + 1] = a[i + 1], a[i]
        ins = arr[:]
        for i in range(1, k + 1):
            key = ins[i]; j = i - 1
            while j >= 0 and ins[j] > key: ins[j + 1] = ins[j]; j -= 1
            ins[j + 1] = key
        sel = arr[:]
        for i in range(k):
            m = min(range(i, len(sel)), key=lambda t: sel[t]); sel[i], sel[m] = sel[m], sel[i]
        b.add(DS, "sorting", "intermediate", f"Bubble sort (ascending) is applied to {arr}. What does the list look like after {k} full pass{'es' if k > 1 else ''}?", str(a), [str(ins), str(sel), str(sorted(arr)), str(arr)], f"Each pass bubbles the next-largest remaining element to the end.")
        b.add(DS, "sorting", "intermediate", f"Selection sort (ascending) is applied to {arr}. What does the list look like after {k} swap{'s' if k > 1 else ''}?", str(sel), [str(a), str(ins), str(sorted(arr)), str(arr)], "Each step swaps the smallest remaining value into the next front position.")
    # --- recursion and math algorithms
    for a, c in [(48, 18), (100, 75), (17, 5), (54, 24), (81, 27), (35, 14), (120, 84), (45, 60)]:
        b.add(DS, "algorithms", "beginner", f"What does Euclid's algorithm give for gcd({a}, {c})?", math.gcd(a, c), near(r, math.gcd(a, c)) + [a % c], f"Repeat (a, b) → (b, a mod b) until b is 0: the answer is {math.gcd(a, c)}.")
    for n in [10, 20, 30, 50, 100]:
        primes = [p for p in range(2, n + 1) if all(p % d for d in range(2, int(p ** 0.5) + 1))]
        b.add(DS, "algorithms", "intermediate", f"How many prime numbers are there up to and including {n}?", len(primes), near(r, len(primes)) + [n // 2], f"The primes up to {n} are {primes}.")
    for n in [4, 5, 6, 8, 10, 12]:
        fib = [0, 1]
        for _ in range(n): fib.append(fib[-1] + fib[-2])
        b.add(DS, "algorithms", "beginner", f"With F(0) = 0 and F(1) = 1, what is F({n}) in the Fibonacci sequence?", fib[n], near(r, fib[n]) + [fib[n + 1]], f"The sequence runs {fib[:n + 1]}.")
    for n in [3, 4, 5, 6]:
        b.add(DS, "algorithms", "intermediate", f"The Tower of Hanoi with {n} disks needs at least how many moves?", 2 ** n - 1, [2 ** n, n * n, 2 * n, 2 ** (n - 1)], "The minimum is 2ⁿ − 1.")
    for coins, amt in [((1, 5, 10), 12), ((1, 3, 4), 6), ((2, 5), 11), ((1, 2, 5), 11), ((1, 5, 12), 15), ((3, 7), 13)]:
        best = [0] + [10 ** 9] * amt
        for a in range(1, amt + 1):
            for c in coins:
                if c <= a: best[a] = min(best[a], best[a - c] + 1)
        ans = best[amt]
        if ans >= 10 ** 9: continue
        b.add(DS, "dynamic_programming", "advanced", f"What is the fewest coins from {coins} needed to make {amt}?", ans, near(r, ans) + [amt // max(coins)], f"Build the best count for every amount up to {amt}; the minimum for {amt} is {ans}.")
