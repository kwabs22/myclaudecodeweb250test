"""Phase 2 questions: classical machine learning, deep learning and prompt engineering.
Numeric answers are computed with numpy or the standard library, and cross-checked a second way where one exists.
The conceptual lists are written out in full."""
import math
from fractions import Fraction

import numpy as np

from question_tools import num, near

ML, DL, PE = "classical_ml", "deep_learning", "prompt_engineering"


def fnum(x, d=3):
    return f"{x:.{d}f}"


def classical(b):
    r = b.rng
    # --- classification metrics from a confusion matrix
    seen = 0
    while seen < 40:
        tp, fp, fn, tn = r.randint(5, 60), r.randint(1, 30), r.randint(1, 30), r.randint(10, 100)
        n = tp + fp + fn + tn
        acc, prec, rec = (tp + tn) / n, tp / (tp + fp), tp / (tp + fn)
        f1 = 2 * prec * rec / (prec + rec); assert abs(f1 - 2 * tp / (2 * tp + fp + fn)) < 1e-12
        spec = tn / (tn + fp)
        stem = f"A classifier has TP = {tp}, FP = {fp}, FN = {fn} and TN = {tn}."
        kind = seen % 5
        if kind == 0:
            ok = b.add(ML, "model_evaluation", "beginner", f"{stem} What is its accuracy?", fnum(acc), [fnum(prec), fnum(rec), fnum(f1), fnum(tn / n), fnum(1 - acc)], f"Accuracy = (TP + TN)/total = {tp + tn}/{n} = {fnum(acc)}.")
        elif kind == 1:
            ok = b.add(ML, "model_evaluation", "beginner", f"{stem} What is its precision?", fnum(prec), [fnum(rec), fnum(acc), fnum(f1), fnum(fp / (tp + fp)), fnum(spec)], f"Precision = TP/(TP + FP) = {tp}/{tp + fp} = {fnum(prec)}.")
        elif kind == 2:
            ok = b.add(ML, "model_evaluation", "beginner", f"{stem} What is its recall (sensitivity)?", fnum(rec), [fnum(prec), fnum(acc), fnum(f1), fnum(fn / (tp + fn)), fnum(spec)], f"Recall = TP/(TP + FN) = {tp}/{tp + fn} = {fnum(rec)}.")
        elif kind == 3:
            ok = b.add(ML, "model_evaluation", "intermediate", f"{stem} What is its F1 score?", fnum(f1), [fnum(acc), fnum((prec + rec) / 2), fnum(prec), fnum(rec), fnum(prec * rec)], f"F1 is the harmonic mean of precision ({fnum(prec)}) and recall ({fnum(rec)}): {fnum(f1)}.")
        else:
            ok = b.add(ML, "model_evaluation", "intermediate", f"{stem} What is its specificity (true negative rate)?", fnum(spec), [fnum(rec), fnum(prec), fnum(acc), fnum(fp / (tn + fp)), fnum(f1)], f"Specificity = TN/(TN + FP) = {tn}/{tn + fp} = {fnum(spec)}.")
        if ok: seen += 1
    for pos, rate in [(1, 0.99), (5, 0.95), (2, 0.98), (10, 0.9)]:
        b.add(ML, "model_evaluation", "intermediate", f"Only {pos}% of transactions are fraud. A model that always predicts 'not fraud' has what accuracy?", f"{100 - pos}%", [f"{pos}%", "50%", "100%", f"{100 - pos * 2}%"], f"It is right on every non-fraud case, so accuracy is {100 - pos}%, which hides the fact it finds no fraud at all.")
    # --- regression
    seen = 0
    while seen < 16:
        n = r.choice([4, 5, 6]); m, c = r.randint(-3, 4), r.randint(-5, 6)
        xs = sorted(r.sample(range(1, 12), n)); ys = [m * x + c for x in xs]
        slope, icpt = np.polyfit(xs, ys, 1); assert abs(slope - m) < 1e-6 and abs(icpt - c) < 1e-6
        xm, ym = np.mean(xs), np.mean(ys); s2 = sum((x - xm) * (y - ym) for x, y in zip(xs, ys)) / sum((x - xm) ** 2 for x in xs); assert abs(s2 - m) < 1e-9
        pts = ", ".join(f"({x}, {y})" for x, y in zip(xs, ys))
        if seen % 2 == 0:
            ok = b.add(ML, "regression", "intermediate", f"The points {pts} lie exactly on a line. What is the least-squares slope?", m, near(r, m) + [c, 0], f"The points are exactly linear, so the best-fit slope equals the line's slope, {m}.")
        else:
            ok = b.add(ML, "regression", "intermediate", f"The points {pts} lie exactly on a line. What is the least-squares intercept?", c, near(r, c) + [m], f"The fit passes through every point, so the intercept is {c}.")
        if ok: seen += 1
    seen = 0
    while seen < 14:
        n = r.choice([4, 5, 6]); y = [r.randint(1, 15) for _ in range(n)]; p = [v + r.randint(-4, 4) for v in y]
        mse = np.mean([(a - c) ** 2 for a, c in zip(y, p)]); mae = np.mean([abs(a - c) for a, c in zip(y, p)]); rmse = math.sqrt(mse)
        if mse == 0: continue
        if seen % 2 == 0:
            ok = b.add(ML, "regression", "beginner", f"True values are {y} and predictions are {p}. What is the mean squared error?", num(mse, 3), [num(mae, 3), num(rmse, 3), num(mse * 2, 3), num(sum((a - c) ** 2 for a, c in zip(y, p)), 3), num(mse + 1, 3)], f"Average the squared differences: {num(mse, 3)}.")
        else:
            ok = b.add(ML, "regression", "beginner", f"True values are {y} and predictions are {p}. What is the mean absolute error?", num(mae, 3), [num(mse, 3), num(rmse, 3), num(mae * 2, 3), num(sum(abs(a - c) for a, c in zip(y, p)), 3), num(mae + 1, 3)], f"Average the absolute differences: {num(mae, 3)}.")
        if ok: seen += 1
    for y_true, ybar in [([3, 5, 7, 9], 6), ([2, 4, 6], 4), ([1, 3, 5, 7, 9], 5)]:
        ss = sum((v - ybar) ** 2 for v in y_true)
        b.add(ML, "regression", "intermediate", f"A model that always predicts the mean ({ybar}) for the values {y_true} has what total squared error?", ss, near(r, ss) + [ss // len(y_true)], "It equals the total variation, Σ(y − ȳ)², and gives R² = 0.")
    # --- decision trees: gini and entropy
    seen = 0
    while seen < 22:
        a, c = r.randint(1, 20), r.randint(1, 20); n = a + c; pa, pc = a / n, c / n
        gini = 1 - pa ** 2 - pc ** 2; ent = -(pa * math.log2(pa) + pc * math.log2(pc))
        if seen % 2 == 0:
            ok = b.add(ML, "decision_trees", "intermediate", f"A node holds {a} examples of class A and {c} of class B. What is its Gini impurity?", fnum(gini), [fnum(ent), fnum(1 - max(pa, pc)), fnum(pa * pc), fnum(pa), fnum(gini * 2)], f"Gini = 1 − ({a}/{n})² − ({c}/{n})² = {fnum(gini)}.")
        else:
            ok = b.add(ML, "decision_trees", "intermediate", f"A node holds {a} examples of class A and {c} of class B. What is its entropy in bits?", fnum(ent), [fnum(gini), fnum(-math.log(pa) * pa - math.log(pc) * pc), fnum(max(pa, pc)), fnum(1 - ent), fnum(ent / 2)], f"Entropy = −Σ p·log₂ p = {fnum(ent)} bits.")
        if ok: seen += 1
    for a, c in [(10, 0), (0, 7), (5, 5), (8, 8)]:
        pure = a == 0 or c == 0
        b.add(ML, "decision_trees", "beginner", f"A node holds {a} examples of class A and {c} of class B. Which statement is correct?", "Gini impurity is 0, so the node is pure" if pure else "Gini impurity is 0.5, the maximum for two classes", ["Gini impurity is 1" if pure else "Gini impurity is 0", "Entropy is 1 bit" if pure else "Entropy is 0 bits", "The node is impure" if pure else "The node is pure", "Entropy is negative"], "A pure node has all one class; an even two-class split has Gini 0.5 and entropy 1 bit.")
    # --- k-NN
    seen = 0
    while seen < 14:
        pts = [(r.randint(0, 9), r.randint(0, 9)) for _ in range(6)]; labels = [r.choice("AB") for _ in pts]; q = (r.randint(0, 9), r.randint(0, 9)); k = 3
        d = sorted((math.dist(p, q), i) for i, p in enumerate(pts))
        if len(set(round(x[0], 6) for x in d[:5])) < 5: continue
        votes = [labels[i] for _, i in d[:k]]; pred = max("AB", key=votes.count); one = labels[d[0][1]]
        text = ", ".join(f"{p}→{l}" for p, l in zip(pts, labels))
        if pred == one and seen % 2: continue
        if b.add(ML, "knn", "intermediate", f"Training points (with labels): {text}. Using Euclidean distance and k = 3, what class is predicted for the query point {q}?", pred, ["A" if pred == "B" else "B", "Tie", "Cannot be determined", one if one != pred else ("A" if pred == "B" else "B")], f"The 3 nearest points have labels {votes}; the majority is {pred}."):
            seen += 1
    # --- k-means centroid update
    seen = 0
    while seen < 10:
        pts = [(r.randint(0, 10), r.randint(0, 10)) for _ in range(r.choice([3, 4, 5]))]
        cx, cy = np.mean([p[0] for p in pts]), np.mean([p[1] for p in pts]); c = f"({num(cx, 2)}, {num(cy, 2)})"
        wrong = [f"({num(np.median([p[0] for p in pts]), 2)}, {num(np.median([p[1] for p in pts]), 2)})", f"({sum(p[0] for p in pts)}, {sum(p[1] for p in pts)})", f"({num(cy, 2)}, {num(cx, 2)})", f"({max(p[0] for p in pts)}, {max(p[1] for p in pts)})"]
        if b.add(ML, "clustering", "intermediate", f"In k-means, the points {pts} are assigned to one cluster. What is the new centroid?", c, wrong, "The centroid is the mean of the assigned points in each coordinate."):
            seen += 1
    # --- gradient descent on linear regression
    seen = 0
    while seen < 14:
        xs = [r.randint(1, 5) for _ in range(3)]; ys = [r.randint(1, 9) for _ in range(3)]; w0 = r.choice([0, 1, 2]); lr = r.choice([0.01, 0.02, 0.05])
        grad = np.mean([2 * (w0 * x - y) * x for x, y in zip(xs, ys)]); new = w0 - lr * grad
        if abs(grad) < 1e-9: continue
        if b.add(ML, "gradient_descent", "advanced", f"For the model ŷ = w·x with mean squared error on x = {xs}, y = {ys}, one gradient descent step starts at w = {w0} with learning rate {lr}. What is the new w?", num(new, 4), [num(w0 + lr * grad, 4), num(w0 - grad, 4), num(w0 - lr * grad / 2, 4), num(grad, 4), num(w0 - lr * sum(2 * (w0 * x - y) * x for x, y in zip(xs, ys)), 4)], f"dMSE/dw = mean(2(wx − y)x) = {num(grad, 4)}, so w ← {w0} − {lr}×{num(grad, 4)} = {num(new, 4)}."):
            seen += 1
    # --- sigmoid and logistic regression
    for z in [0, 1, 2, -1, -2, 3, -3, 0.5]:
        s = 1 / (1 + math.exp(-z))
        b.add(ML, "logistic_regression", "intermediate", f"What is the sigmoid σ(z) = 1/(1 + e^(−z)) at z = {z}, to 3 decimal places?", fnum(s), [fnum(1 - s), fnum(math.exp(z)), fnum(math.tanh(z)), fnum(s * 2), fnum(z / 2 + 0.5)], f"σ({z}) = 1/(1 + e^({-z})) = {fnum(s)}.")
    for w, bias, xv in [(2, -3, 2), (1, 0, -1), (0.5, 1, 4), (-1, 2, 3), (3, -6, 1)]:
        z = w * xv + bias; p = 1 / (1 + math.exp(-z)); label = 1 if p >= 0.5 else 0
        b.add(ML, "logistic_regression", "intermediate", f"A logistic regression has weight {w} and bias {bias}. For input x = {xv}, which class does it predict with a 0.5 threshold?", f"Class {label}", [f"Class {1 - label}", "Cannot tell without more data", "Both with equal probability"], f"z = {w}×{xv} + {bias} = {num(z)}, σ(z) = {fnum(p)} {'≥' if label else '<'} 0.5.")
    # --- cross-validation and splitting
    for n, k in [(100, 5), (1000, 10), (50, 5), (200, 4), (60, 3), (120, 6), (500, 5), (90, 9)]:
        b.add(ML, "validation", "beginner", f"In {k}-fold cross-validation on {n} examples, how many examples are in each validation fold?", n // k, [n, n - n // k, k, n // k + 1], f"{n} ÷ {k} = {n // k}.")
        b.add(ML, "validation", "beginner", f"In {k}-fold cross-validation on {n} examples, how many examples does each training run use?", n - n // k, [n // k, n, k, n - 1], f"Each run trains on the other {k - 1} folds: {n} − {n // k} = {n - n // k}.")
    for n, a, c in [(1000, 70, 15), (500, 60, 20), (2000, 80, 10), (10000, 90, 5), (300, 70, 15)]:
        te = 100 - a - c
        b.add(ML, "validation", "beginner", f"A data set of {n} examples is split {a}% train, {c}% validation and the rest test. How many test examples are there?", n * te // 100, [n * a // 100, n * c // 100, n * (te + c) // 100, n // 10], f"The test share is {te}%, which is {n * te // 100} examples.")
    # --- similarity and PCA
    for u, v in [((1, 0), (1, 1)), ((3, 4), (4, 3)), ((1, 2, 3), (4, 5, 6)), ((2, 0), (0, 3)), ((1, 1), (-1, -1)), ((5, 12), (12, 5))]:
        cos = float(np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v)))
        b.add(ML, "similarity", "intermediate", f"What is the cosine similarity of {u} and {v}, to 3 decimal places?", fnum(cos), [fnum(np.dot(u, v)), fnum(-cos), fnum(math.dist(u, v)), fnum(cos / 2), fnum(1 - cos)], "cos θ = (u·v)/(‖u‖‖v‖).")
    for ev in [(4, 3, 2, 1), (6, 2, 1, 1), (10, 5, 3, 2), (8, 1, 1, 0), (5, 5, 5, 5)]:
        tot = sum(ev); top2 = (ev[0] + ev[1]) / tot
        b.add(ML, "dimensionality_reduction", "advanced", f"The covariance matrix of a data set has eigenvalues {ev}. What fraction of the variance do the top 2 principal components explain?", fnum(top2), [fnum(ev[0] / tot), fnum(1 - top2), fnum((ev[0] + ev[1] + ev[2]) / tot), fnum(2 / len(ev))] , f"The top two eigenvalues sum to {ev[0] + ev[1]} out of {tot}, which is {fnum(top2)}.")
    # --- regularisation arithmetic
    for w in [(3, -4), (1, 2, 2), (0.5, 0.5), (2, -2, 1), (6, 8)]:
        l2 = sum(x * x for x in w); l1 = sum(abs(x) for x in w)
        b.add(ML, "regularization", "intermediate", f"A model's weights are {w}. What is its L2 penalty term Σw² (before multiplying by λ)?", num(l2), [num(l1), num(math.sqrt(l2)), num(sum(w)), num(l2 * 2)], f"Square and add: {num(l2)}.")
        b.add(ML, "regularization", "intermediate", f"A model's weights are {w}. What is its L1 penalty term Σ|w| (before multiplying by λ)?", num(l1), [num(l2), num(math.sqrt(l2)), num(sum(w)), num(l1 * 2)], f"Add the absolute values: {num(l1)}.")
    # --- bias, variance, overfitting etc. (hand-written)
    b.add_concepts(ML, "concepts", "beginner", [
        ("A model scores 99% on training data and 70% on validation data. What is the most likely problem?", "Overfitting", ["Underfitting", "Data leakage in reverse", "Too much regularization", "A learning rate of zero"], "A large gap between training and validation performance is the sign of overfitting."),
        ("A model scores 55% on both training and validation data for a task where 90% is achievable. What is the most likely problem?", "Underfitting (high bias)", ["Overfitting", "Data leakage", "Class imbalance only", "Too many features only"], "Poor performance everywhere means the model is too simple or poorly trained."),
        ("What does high variance mean for a model?", "Its predictions change a lot with different training samples", ["It always predicts the mean", "It cannot fit the training data", "It has too few parameters", "Its errors are always the same sign"], "Flexible models chase noise in the particular sample."),
        ("Which change usually reduces overfitting?", "Adding more training data or stronger regularization", ["Training for more epochs with no checks", "Adding more layers", "Removing the validation set", "Lowering the regularization strength"], "More data or constraints on the model reduce its freedom to memorise."),
        ("What is data leakage?", "Information from the test (or future) data influencing training", ["Losing rows during cleaning", "Data being stolen", "Too few features", "Unbalanced classes"], "Leakage makes scores look better than they will be in use."),
        ("Why must a scaler (e.g. StandardScaler) be fit on the training set only?", "Fitting on all data would leak test-set statistics into training", ["It runs faster", "It is required by the API", "Test data has no mean", "It improves accuracy by definition"], "Compute the mean and variance on training data, then apply them to validation and test data."),
        ("When classes are heavily imbalanced, which metric is more informative than accuracy?", "Precision and recall (or F1)", ["Number of features", "Training time", "Mean of the labels", "Model size"], "Accuracy can be high even if the rare class is never found."),
        ("What does L1 regularization tend to do to weights?", "Push many of them to exactly zero (sparsity)", ["Make all weights equal", "Make all weights large", "Leave them unchanged", "Make them negative"], "The L1 penalty has a constant pull toward zero."),
        ("What does L2 regularization tend to do to weights?", "Shrink them smoothly toward zero without usually making them exactly zero", ["Set most of them to zero", "Increase them", "Randomise them", "Remove the bias term"], "The L2 penalty pulls each weight in proportion to its size."),
        ("What is the purpose of a validation set?", "To tune choices (hyperparameters, early stopping) without touching the test set", ["To train the final model", "To replace the test set", "To increase the training data", "To store the labels"], "The test set should only be used once, at the end."),
        ("What does a random forest do?", "Averages (or votes over) many decision trees trained on random samples of rows and features", ["Trains one very deep tree", "Uses gradient descent on a single tree", "Clusters the data", "Reduces dimensions"], "Averaging many decorrelated trees reduces variance."),
        ("How does gradient boosting build its model?", "Adds trees one at a time, each fixing the errors of the ones before", ["Trains all trees independently and votes", "Uses one deep tree", "Clusters the residuals", "Uses nearest neighbours"], "Each new tree fits the remaining error (the gradient of the loss)."),
        ("What is the 'curse of dimensionality'?", "In high dimensions, data becomes sparse and distances less informative", ["Models cannot use more than 3 features", "Training always takes exponentially long", "Features must be uncorrelated", "More features always help"], "Volume grows so fast that points end up far apart."),
        ("Which of these is an unsupervised learning task?", "Clustering customers into groups", ["Predicting house prices from past sales", "Classifying emails as spam", "Predicting whether a tumour is malignant", "Forecasting next month's sales"], "There are no target labels in clustering."),
        ("In k-means, what does choosing k too large risk?", "Splitting natural groups into meaningless fragments", ["Merging all points into one cluster", "Making the data labelled", "Increasing bias in labels", "Making centroids undefined"], "With k equal to the number of points, every point is its own cluster."),
        ("Why should features usually be scaled before k-NN or k-means?", "Distance is dominated by features with large numeric ranges", ["The algorithms cannot read small numbers", "Scaling removes outliers", "It makes labels numeric", "It reduces the number of classes"], "A feature measured in thousands would swamp one measured in fractions."),
        ("What does ROC AUC of 0.5 mean?", "The classifier ranks no better than random", ["Perfect classification", "Always predicting the positive class", "All predictions are wrong", "The classes are balanced"], "AUC is the probability a random positive is ranked above a random negative; 0.5 is a coin flip."),
        ("Which is true of the bias–variance trade-off?", "Making a model more flexible usually lowers bias but raises variance", ["More flexibility lowers both", "Bias and variance are unrelated", "Simple models always have high variance", "Variance is the error on the training set"], "The goal is to find the flexibility that minimises total error."),
        ("A model's precision is high but its recall is low. What does that mean?", "When it predicts positive it is usually right, but it misses many real positives", ["It flags many false positives", "It finds almost all positives", "It is always wrong", "It is balanced"], "Few false alarms, many misses."),
        ("What is the purpose of stratified sampling in a train/test split?", "To keep the class proportions the same in each split", ["To sort the data by label", "To remove the minority class", "To use more test data", "To normalise features"], "Important when one class is rare."),
        ("What does feature engineering mean?", "Creating or transforming input variables to make patterns easier for the model to learn", ["Building the server", "Choosing the optimizer", "Removing all outliers", "Splitting the data"], "For example, extracting day of week from a timestamp."),
        ("Which algorithm assumes features are conditionally independent given the class?", "Naive Bayes", ["k-nearest neighbours", "Random forest", "Linear regression", "k-means"], "That 'naive' assumption makes the likelihood a simple product."),
        ("What is a hyperparameter?", "A setting chosen before training, such as the learning rate or tree depth", ["A weight learned during training", "The loss value", "A feature", "The number of predictions"], "Parameters are learned; hyperparameters are set by you."),
        ("What is the main idea of a support vector machine?", "Find the decision boundary with the widest margin between classes", ["Average the nearest neighbours", "Minimise the number of features", "Split on the best feature", "Cluster by centroids"], "The margin is the gap to the closest points of each class."),
        ("Why can a decision tree of unlimited depth reach 100% training accuracy?", "It can keep splitting until each leaf holds a single example, memorising the data", ["Trees are always correct", "It uses a perfect loss", "It ignores the labels", "Pruning is automatic"], "Which is exactly why unrestricted trees overfit."),
    ])


# ----------------------------------------------------------------------------------------------------------- deep learning
def deep(b):
    r = b.rng
    # --- dense layer parameter counts
    seen = 0
    while seen < 20:
        sizes = [r.choice([4, 8, 10, 16, 32, 64, 100, 128]) for _ in range(r.choice([3, 4]))]
        params = sum(a * c + c for a, c in zip(sizes, sizes[1:])); weights = sum(a * c for a, c in zip(sizes, sizes[1:]))
        arch = " → ".join(map(str, sizes))
        if b.add(DL, "network_size", "intermediate", f"A fully connected network has layers of size {arch} (input to output), with a bias on every non-input neuron. How many trainable parameters does it have?", params, [weights, params + sizes[0], params - sizes[-1], sum(sizes), params * 2], f"Each layer has (inputs × outputs) weights plus one bias per output: total {params}."):
            seen += 1
    # --- conv layer
    seen = 0
    while seen < 18:
        k, cin, cout = r.choice([1, 3, 5, 7]), r.choice([1, 3, 16, 32, 64]), r.choice([8, 16, 32, 64, 128])
        p = k * k * cin * cout + cout
        if b.add(DL, "cnn", "intermediate", f"A convolutional layer has {cout} filters of size {k}×{k} over {cin} input channels, with one bias per filter. How many parameters does it have?", p, [k * k * cout, k * k * cin * cout, (k * k * cin + 1) * cout * 2, k * cin * cout + cout, p + cin], f"Each filter has {k}×{k}×{cin} weights plus a bias; times {cout} filters gives {p}."):
            seen += 1
    seen = 0
    while seen < 22:
        n, k, pad, st = r.choice([28, 32, 64, 224, 100, 56]), r.choice([3, 5, 7]), r.choice([0, 1, 2]), r.choice([1, 1, 2])
        out = (n + 2 * pad - k) // st + 1
        if out < 1: continue
        wrong = [(n - k) // st + 1 if pad else n, out + 1, out - 1, n, (n + 2 * pad) // st]
        if b.add(DL, "cnn", "intermediate", f"A {n}×{n} image goes through a convolution with a {k}×{k} kernel, padding {pad} and stride {st}. What is the output width?", out, wrong, f"⌊(n + 2p − k)/s⌋ + 1 = ⌊({n} + {2 * pad} − {k})/{st}⌋ + 1 = {out}."):
            seen += 1
    for n, pool in [(28, 2), (32, 2), (64, 4), (14, 2), (100, 5), (26, 2), (56, 2), (224, 2)]:
        out = n // pool
        b.add(DL, "cnn", "beginner", f"A {n}×{n} feature map goes through {pool}×{pool} max pooling with stride {pool}. What is the output width?", out, [out + 1, out * 2, n - pool, n], f"Each {pool}×{pool} block becomes one value: {n}/{pool} = {out}.")
    # --- softmax and cross-entropy
    seen = 0
    while seen < 18:
        z = [r.randint(-2, 4) for _ in range(r.choice([3, 4]))]; e = np.exp(z); sm = e / e.sum(); assert abs(sm.sum() - 1) < 1e-12
        ok = b.add(DL, "softmax", "intermediate", f"What is the softmax probability of the first entry for the logits {z}? (3 decimal places)", fnum(sm[0]), [fnum(1 / len(z)), fnum(z[0] / sum(abs(v) for v in z) if sum(abs(v) for v in z) else 0.25), fnum(float(np.exp(z[0]))), fnum(sm[int(np.argmax(sm))] if int(np.argmax(sm)) != 0 else sm[-1]), fnum(1 - sm[0])], f"softmax(z)₁ = e^{z[0]} / Σe^z = {fnum(sm[0])}.")
        if ok: seen += 1
    for p in [0.9, 0.5, 0.25, 0.1, 0.8, 0.99, 0.7, 0.01]:
        ce = -math.log(p)
        b.add(DL, "loss_functions", "intermediate", f"A classifier gives the true class probability {p}. What is the cross-entropy loss −ln(p) for this example, to 3 decimal places?", fnum(ce), [fnum(1 - p), fnum(math.log(p)), fnum(-math.log10(p)), fnum(p), fnum(ce * 2)], f"−ln({p}) = {fnum(ce)}; confident correct predictions give small loss.")
    for y, p in [(1, 0.9), (0, 0.2), (1, 0.4), (0, 0.7), (1, 0.6), (0, 0.05)]:
        loss = -(y * math.log(p) + (1 - y) * math.log(1 - p))
        b.add(DL, "loss_functions", "advanced", f"Binary cross-entropy for true label {y} and predicted probability {p} is what, to 3 decimal places?", fnum(loss), [fnum(abs(y - p)), fnum((y - p) ** 2), fnum(-math.log(p)) if y == 0 else fnum(-math.log(1 - p)), fnum(loss * 2), fnum(1 - loss)], f"−[y·ln p + (1 − y)·ln(1 − p)] = {fnum(loss)}.")
    # --- activations
    for z in [-2, -1, 0, 0.5, 1, 2, 3]:
        b.add(DL, "activations", "beginner", f"What is tanh({z}) to 3 decimal places?", fnum(math.tanh(z)), [fnum(1 / (1 + math.exp(-z))), fnum(max(0, z)), fnum(math.exp(z)), fnum(-math.tanh(z)), fnum(z)], f"tanh({z}) = {fnum(math.tanh(z))}; its range is (−1, 1).")
    for z in [-3, -1, 0, 2, 5, -0.5]:
        b.add(DL, "activations", "beginner", f"What is ReLU({z})?", num(max(0, z)), [num(z), num(-z), num(abs(z) + 1), "1"], "ReLU(z) = max(0, z).")
        b.add(DL, "activations", "intermediate", f"What is Leaky ReLU({z}) with slope 0.1 for negative inputs?", num(z if z > 0 else 0.1 * z), [num(max(0, z)), num(-z), num(z * 10), "0.1"], "Leaky ReLU keeps a small slope for z < 0 instead of zero.")
    # --- single neuron forward and backward
    seen = 0
    while seen < 16:
        w, x, bias = r.randint(-3, 3), r.randint(1, 4), r.randint(-2, 2); y = r.randint(-3, 5)
        z = w * x + bias; pred = max(0, z); loss = (pred - y) ** 2
        if seen % 2 == 0:
            ok = b.add(DL, "backpropagation", "intermediate", f"A neuron computes ŷ = ReLU(w·x + b) with w = {w}, x = {x}, b = {bias}. The target is y = {y} and the loss is (ŷ − y)². What is the loss?", loss, near(r, loss) + [pred, z], f"z = {z}, ŷ = ReLU({z}) = {pred}, loss = ({pred} − {y})² = {loss}.")
        else:
            grad = 2 * (pred - y) * (x if z > 0 else 0)
            ok = b.add(DL, "backpropagation", "advanced", f"A neuron computes ŷ = ReLU(w·x + b) with w = {w}, x = {x}, b = {bias}. The target is y = {y} and the loss is (ŷ − y)². What is ∂loss/∂w?", grad, near(r, grad) + [2 * (pred - y), x], f"Chain rule: 2(ŷ − y) × ReLU′(z) × x = 2({pred} − {y}) × {1 if z > 0 else 0} × {x} = {grad}.")
        if ok: seen += 1
    seen = 0
    while seen < 8:
        w1, w2, x = r.randint(1, 3), r.randint(1, 3), r.randint(1, 3)
        h = w1 * x; out = w2 * h; d_w1 = w2 * x
        if b.add(DL, "backpropagation", "advanced", f"A two-layer linear chain computes h = w₁·x and ŷ = w₂·h with w₁ = {w1}, w₂ = {w2}, x = {x}. What is ∂ŷ/∂w₁?", d_w1, [w2, x, w1 * x, w1 * w2 * x], f"ŷ = w₂w₁x, so ∂ŷ/∂w₁ = w₂·x = {d_w1}."):
            seen += 1
    # --- recurrent / attention / embeddings sizes
    for x, h in [(10, 20), (50, 64), (100, 128), (32, 32), (300, 256), (8, 16)]:
        rnn = h * (h + x) + h; lstm = 4 * rnn; gru = 3 * rnn
        b.add(DL, "rnn", "advanced", f"A simple RNN layer has input size {x} and hidden size {h}, with one bias vector. How many parameters does it have?", rnn, [h * x + h, rnn - h, 2 * rnn, h * h, lstm], f"Weights for input→hidden ({h}×{x}) and hidden→hidden ({h}×{h}) plus {h} biases: {rnn}.")
        b.add(DL, "rnn", "advanced", f"An LSTM layer has input size {x} and hidden size {h}. Counting one bias vector per gate, how many parameters does it have?", lstm, [rnn, 3 * rnn, 2 * rnn, 4 * h * x], f"An LSTM has four gates, each with the size of a simple RNN layer ({rnn}): 4 × {rnn} = {lstm}.")
        b.add(DL, "rnn", "advanced", f"A GRU layer has input size {x} and hidden size {h}. Counting one bias vector per gate, how many parameters does it have?", gru, [rnn, lstm, 2 * rnn, 3 * h * x], f"A GRU has three gate-sized blocks of {rnn} parameters each: {gru}.")
    for v, d in [(1000, 64), (50000, 128), (30000, 768), (10000, 300), (500, 32), (100000, 256)]:
        b.add(DL, "embeddings", "beginner", f"An embedding layer maps a vocabulary of {v} tokens to vectors of size {d}. How many parameters does it have?", v * d, [v + d, v, d, v * d * 2], f"It is a table with one {d}-dimensional row per token: {v} × {d} = {v * d}.")
    seen = 0
    while seen < 12:
        d = r.choice([4, 9, 16]); q = [r.randint(-2, 2) for _ in range(d)]; k = [r.randint(-2, 2) for _ in range(d)]
        dot = sum(x * y for x, y in zip(q, k)); score = dot / math.sqrt(d)
        if dot == 0: continue
        if b.add(DL, "attention", "advanced", f"In scaled dot-product attention, a query q = {q} meets a key k = {k}, both of length d = {d}. What is the scaled score q·k/√d, to 3 decimal places?", fnum(score), [fnum(dot), fnum(score / math.sqrt(d)), fnum(dot / d), fnum(-score), fnum(score + 1)], f"q·k = {dot}; divide by √{d} = {fnum(math.sqrt(d), 3)} to get {fnum(score)}."):
            seen += 1
    for L, d in [(10, 64), (128, 512), (512, 768), (4, 8), (2048, 1024)]:
        b.add(DL, "attention", "advanced", f"A self-attention layer processes {L} tokens. How many entries does the attention-score matrix (before softmax) have, for one head?", L * L, [L * d, L, 2 * L, L * L * d], "Every token attends to every token: L × L scores, which is why the cost grows quadratically with length.")
    for L, d in [(16, 64), (100, 128), (512, 768)]:
        b.add(DL, "attention", "intermediate", f"A transformer layer's output for a batch has shape (batch, {L}, {d}). What do {L} and {d} represent?", f"{L} tokens, each with a {d}-dimensional vector", [f"{L} features, {d} tokens", f"{L} layers, {d} heads", f"{L} classes, {d} samples"], "Shape is (batch, sequence length, hidden size).")
    # --- batch norm and dropout
    for c in [16, 32, 64, 128, 256]:
        b.add(DL, "normalization", "intermediate", f"A BatchNorm layer is applied to {c} channels. How many trainable parameters does it have (scale and shift)?", 2 * c, [c, 4 * c, c * c, 2], f"One scale (γ) and one shift (β) per channel: 2 × {c} = {2 * c}.")
    for p in [0.1, 0.2, 0.25, 0.5]:
        b.add(DL, "regularization", "intermediate", f"With inverted dropout at rate {p}, surviving activations are scaled up by what factor during training?", num(1 / (1 - p), 4), [num(p, 4), num(1 - p, 4), num(1 / p, 4), "1"], f"Scaling by 1/(1 − p) = {num(1 / (1 - p), 4)} keeps the expected activation unchanged.")
    for n, b_ in [(1000, 32), (50000, 128), (60000, 64), (1281167, 256), (10000, 100)]:
        steps = math.ceil(n / b_)
        b.add(DL, "training", "beginner", f"A data set has {n} examples and the batch size is {b_}. How many gradient steps are in one epoch?", steps, [steps + 1, steps - 1, n, b_], f"⌈{n}/{b_}⌉ = {steps}.")
    for lr, steps in [(0.1, 10), (0.01, 100), (1.0, 3), (0.5, 4)]:
        w = 1.0
        for _ in range(steps): w -= lr * 2 * w   # minimising w² from w = 1
        b.add(DL, "optimization", "advanced", f"Gradient descent minimises L(w) = w² starting at w = 1 with learning rate {lr}. What is w after {steps} step{'s' if steps > 1 else ''}, to 3 decimal places?", fnum(w), [fnum(1 - lr * steps), fnum(w * 2), fnum(abs(w)), fnum((1 - lr) ** steps), "0.000"] if abs(w - (1 - lr) ** steps) > 1e-9 else [fnum(1 - lr * steps), fnum(w * 2), fnum(abs(w) + 0.1), "0.000", "1.000"], f"Each step multiplies w by (1 − 2·lr) = {num(1 - 2 * lr)}, so w = {fnum(w)}.")
    b.add_concepts(DL, "concepts", "beginner", [
        ("Why do neural networks need non-linear activation functions?", "Without them, stacked layers collapse into one linear transformation", ["To make training faster by itself", "To reduce the number of weights", "To allow negative weights", "To normalise the inputs"], "A composition of linear maps is linear."),
        ("What problem do ReLU activations help with compared with sigmoid?", "Vanishing gradients for large positive inputs", ["Exploding activations in the output", "Lack of non-linearity", "Slow inference", "Needing more layers"], "Sigmoid saturates and its gradient shrinks; ReLU has a constant gradient of 1 for positive inputs."),
        ("What is the vanishing gradient problem?", "Gradients shrink as they flow back through many layers, so early layers learn very slowly", ["The loss becomes negative", "The model has too few parameters", "Weights become infinite", "The data disappears"], "Repeated multiplication by small numbers drives gradients toward zero."),
        ("What does backpropagation compute?", "The gradient of the loss with respect to every parameter, using the chain rule", ["The best learning rate", "The next training batch", "The number of layers", "The validation score"], "It reuses intermediate results to be efficient."),
        ("What is the purpose of the learning rate?", "It sets the size of each parameter update", ["It sets the number of epochs", "It sets the batch size", "It sets the number of layers", "It sets the dropout rate"], "Too high overshoots; too low is slow."),
        ("What does an epoch mean?", "One full pass through the training data", ["One gradient step", "One batch", "One layer", "One test run"], "Many steps make up an epoch."),
        ("Why use mini-batches rather than the whole data set for each step?", "They give a noisy but cheap gradient estimate, allowing many more updates", ["They are always more accurate", "They remove the need for a learning rate", "They avoid overfitting entirely", "Full batches are impossible on any computer"], "Mini-batch SGD balances cost and gradient quality."),
        ("What does momentum add to gradient descent?", "A running average of past gradients, smoothing and speeding the updates", ["A larger batch", "A second loss function", "More layers", "A random restart"], "It helps roll through shallow valleys and dampens oscillations."),
        ("How does Adam differ from plain SGD?", "It adapts the step size per parameter using running averages of gradients and squared gradients", ["It does not use gradients", "It uses the whole data set each step", "It has no learning rate", "It only works for CNNs"], "Adam combines momentum with per-parameter scaling."),
        ("What is the main benefit of convolutional layers for images?", "They share weights across positions and use local patterns, cutting parameters", ["They need no training", "They make images smaller always", "They remove noise", "They ignore colour"], "The same filter is applied everywhere."),
        ("What does max pooling do?", "Keeps the largest value in each window, shrinking the feature map", ["Averages all channels", "Adds noise", "Doubles the resolution", "Normalises the values"], "It gives some translation invariance."),
        ("What does a residual (skip) connection do?", "Adds a layer's input to its output, easing the flow of gradients in deep networks", ["Removes a layer", "Doubles the batch size", "Normalises the input", "Applies dropout"], "The network only has to learn the change, F(x), in x + F(x)."),
        ("Why are LSTMs and GRUs preferred over simple RNNs for long sequences?", "Gates help keep gradients stable over long spans", ["They have fewer parameters than every RNN", "They need no training", "They use convolutions", "They ignore order"], "Gating lets information (and gradient) pass through many steps."),
        ("What problem did the Transformer's self-attention address versus RNNs?", "It connects any two positions directly and parallelises over the sequence", ["It removed the need for data", "It uses fewer parameters than any model", "It handles only images", "It needs no positional information"], "RNNs process tokens one by one."),
        ("Why do Transformers add positional encodings?", "Self-attention alone does not know the order of tokens", ["To reduce parameters", "To normalise values", "To add dropout", "To produce probabilities"], "Without them the model treats the input as a bag of tokens."),
        ("What is transfer learning?", "Reusing a model trained on one task as the starting point for another", ["Moving data between servers", "Training with no labels", "Copying the test set", "Using the same optimizer"], "Fine-tuning a pretrained model needs far less data."),
        ("When fine-tuning a pretrained model on a small data set, which is a common approach?", "Freeze the early layers and train the later ones (or use a small learning rate)", ["Randomly re-initialise everything", "Train with a very large learning rate", "Remove all pretrained weights", "Double the batch size only"], "Early layers capture general features worth keeping."),
        ("What is early stopping?", "Stopping training when validation performance stops improving", ["Stopping after one epoch", "Stopping when loss is zero", "Stopping when the batch ends", "Stopping at random"], "It prevents overfitting by watching a validation metric."),
        ("What does batch normalisation do?", "Normalises layer inputs using batch statistics, stabilising and speeding up training", ["Normalises the labels", "Removes outliers from the data set", "Adds noise to weights", "Reduces the number of layers"], "It keeps activations in a stable range."),
        ("What is a good reason to use data augmentation for images?", "It creates varied training examples, helping the model generalise", ["It reduces the test set size", "It makes labels more accurate", "It speeds up inference", "It removes the need for a validation set"], "Flips, crops and colour shifts teach invariances."),
        ("Why initialise all weights of a layer to the same value (e.g. 0)?", "You should not: every neuron would compute and learn the same thing", ["It speeds up training", "It is required by backpropagation", "It prevents overfitting", "It improves symmetry"], "Random initialisation breaks the symmetry between neurons."),
        ("What is an autoencoder trained to do?", "Reconstruct its input through a narrow bottleneck", ["Classify its input", "Generate labels", "Translate languages", "Predict the next token"], "The bottleneck forces a compact representation."),
        ("What is the role of the discriminator in a GAN?", "To tell real samples from the generator's fakes", ["To generate images", "To label data", "To compress data", "To choose the learning rate"], "The two networks train against each other."),
        ("Why is the softmax output not a measure of how sure a model really is?", "It always sums to 1 over the classes, even for inputs unlike anything seen in training", ["It is random", "It ignores the logits", "It is always 0.5", "It is exact"], "Probabilities from softmax can be overconfident and uncalibrated."),
        ("Why use a GPU for training neural networks?", "Matrix operations parallelise across thousands of cores", ["GPUs never need data", "GPUs have no memory limits", "GPUs run Python faster than CPUs", "GPUs avoid backpropagation"], "Neural networks are dominated by large matrix multiplications."),
    ])


# ------------------------------------------------------------------------------------------------------ prompt engineering
def prompts(b):
    # Hand-written conceptual questions with the answer discussed in the explanation.
    b.add_concepts(PE, "basics", "beginner", [
        ("What is a prompt?", "The input text (and any context) given to a language model to elicit a response", ["The model's output", "The training data set", "A fine-tuning algorithm", "The model's parameter count"], "A prompt is everything you send to the model."),
        ("What is a system prompt used for?", "Setting the model's role, rules and tone before the conversation", ["Increasing the context window", "Storing user passwords", "Training the model", "Choosing the GPU"], "It sets standing instructions that apply to the whole conversation."),
        ("Why is it good practice to state the desired output format in a prompt?", "Models follow explicit format instructions far more reliably than implied ones", ["It makes responses longer", "It reduces cost to zero", "It changes the model's weights", "It disables safety filters"], "For example: 'Reply as JSON with keys name and age'."),
        ("Which prompt is better for a summary task?", "'Summarise the article below in three bullet points for a busy executive.'", ["'Summarise.'", "'Article: ... What?'", "'Do the thing.'", "'Make it good.'"], "Specific length, audience and format give the model a clear target."),
        ("What is a token in a language model?", "A chunk of text (often part of a word) that the model reads and writes", ["A password", "A GPU core", "A training example", "A whole document"], "Costs and context limits are measured in tokens."),
        ("What is the context window?", "The maximum number of tokens the model can consider at once, prompt and reply together", ["The number of users", "The training data size", "The learning rate", "The number of layers"], "Input that does not fit is cut off or must be summarised."),
        ("What does a higher temperature do?", "Makes the model's word choices more varied and less predictable", ["Makes it more deterministic", "Makes it faster", "Reduces the cost", "Increases the context window"], "Temperature scales the probabilities before sampling."),
        ("When is temperature near 0 a good choice?", "Extracting data or writing code where you want consistent output", ["Brainstorming wild ideas", "Writing poetry", "Generating names", "Role-play"], "Low temperature picks the most likely tokens."),
        ("What does top-p (nucleus) sampling do?", "Samples only from the smallest set of tokens whose probabilities add up to p", ["Picks the top p tokens by length", "Removes the system prompt", "Sets the context size", "Repeats the prompt p times"], "It trims the unlikely tail of the distribution."),
        ("What is the difference between zero-shot and few-shot prompting?", "Zero-shot gives no examples; few-shot includes a few worked examples in the prompt", ["Zero-shot uses a larger model", "Few-shot trains the model's weights", "Zero-shot is always more accurate", "They are the same"], "Examples in the prompt steer format and style without any training."),
        ("In few-shot prompting, what makes good examples?", "Varied, correct and in the exact format you want back", ["As many as will fit, even if wrong", "All identical", "Written in a different format", "Only edge cases"], "The model copies patterns, including mistakes."),
        ("What is chain-of-thought prompting?", "Asking the model to reason step by step before giving a final answer", ["Chaining several models together", "Fine-tuning on reasoning data", "Hiding the reasoning", "Asking for the shortest possible answer"], "Intermediate steps often improve accuracy on multi-step problems."),
        ("Which instruction elicits step-by-step reasoning?", "'Think through the problem step by step, then give the final answer.'", ["'Answer instantly.'", "'Be brief.'", "'Guess.'", "'Do not explain.'"], "It gives the model room to work before committing."),
        ("What is a role prompt?", "Telling the model to act as a specific persona, e.g. 'You are a patient maths tutor'", ["A prompt about job roles", "A database permission", "A model parameter", "A training method"], "It shapes tone and focus."),
        ("Why should instructions and the data to process be clearly separated in a prompt?", "To stop the model confusing text to be processed with instructions to follow", ["To save tokens", "To make the answer longer", "To avoid using a system prompt", "To disable few-shot examples"], "Delimiters such as triple quotes or XML-style tags help."),
        ("What is a good way to handle a very long document that exceeds the context window?", "Split it into chunks, process each, and combine the results", ["Paste it anyway and hope", "Increase the temperature", "Remove the system prompt", "Ask for a shorter answer only"], "Chunking (and retrieval) works within the limit."),
        ("What is hallucination in a language model?", "Fluent output that is false or unsupported by the input or reality", ["A crash", "A slow response", "Repeated output", "A formatting error"], "Models generate plausible text, which is not always true."),
        ("Which prompt change most directly reduces hallucination on a question about a supplied document?", "'Answer only from the document below. If the answer is not there, say you cannot tell.'", ["'Be creative.'", "'Answer with confidence.'", "'Use your imagination.'", "'Always give a number.'"], "Grounding plus permission to say 'unknown' reduces invention."),
        ("What is prompt injection?", "Text in the input that tries to override the developer's instructions", ["Adding more examples", "A way to speed up output", "A fine-tuning step", "A token limit"], "For example a web page saying 'ignore all previous instructions'."),
        ("Which is the safest way to treat untrusted text (such as an email) in a prompt?", "Mark it clearly as data, keep privileges minimal, and never let it trigger sensitive actions unreviewed", ["Trust it as instructions", "Merge it into the system prompt", "Give the model admin tools", "Hide it from logs"], "Treat model input from outside as untrusted."),
        ("What is structured output (for example JSON mode) useful for?", "Getting machine-readable results that code can parse reliably", ["Making responses poetic", "Increasing the temperature", "Shortening the context window", "Changing the model size"], "Parsing is much easier when the format is constrained."),
        ("Why validate a model's JSON output in code?", "Models can still produce invalid or incomplete JSON", ["JSON cannot be parsed", "Validation makes it faster", "It is required by the model licence", "It reduces token use"], "Always check, and retry or repair if invalid."),
        ("What is the purpose of an evaluation set for prompts?", "To measure whether a prompt change really improves results across many cases", ["To train the model", "To lower the temperature", "To raise the token limit", "To store system prompts"], "One good-looking answer is not evidence."),
        ("What is retrieval-augmented generation (RAG)?", "Fetching relevant documents and adding them to the prompt before generating", ["Retraining the model on each question", "Generating images from text", "Compressing prompts", "Using a bigger temperature"], "It grounds the answer in up-to-date or private data."),
        ("What is prompt chaining?", "Splitting a task into steps where each step's output feeds the next prompt", ["Making one prompt very long", "Running the same prompt twice", "Sending prompts to different users", "Repeating the system prompt"], "Smaller focused prompts are easier to test and debug."),
        ("When should you give the model an 'out', such as 'say N/A if unknown'?", "When the input may not contain the answer, to avoid forced guesses", ["Never", "Only when temperature is high", "Only for translation", "Only for code"], "Otherwise the model tends to fill the gap."),
        ("Why might the same prompt give different answers on different runs?", "Sampling is random unless the temperature is 0 (and even then outputs can vary slightly)", ["The model forgets", "The prompt changes itself", "The internet changed", "Tokens are shuffled"], "Variation is a property of sampling."),
        ("What is self-consistency prompting?", "Sampling several reasoning paths and taking the most common answer", ["Asking the model to repeat itself", "Using temperature 0", "Checking spelling", "Using a longer prompt"], "Majority agreement across paths improves reliability."),
        ("What does 'few-shot' cost compared with zero-shot?", "More input tokens per request, because the examples are sent every time", ["Nothing", "Fewer input tokens", "A new model", "Extra training time"], "Examples occupy context and add to the bill."),
        ("Which is a sign of a weak prompt?", "Vague goals with no audience, format or constraints", ["A clear output schema", "Worked examples", "A stated role", "Explicit success criteria"], "The model has to guess what you mean."),
        ("What does it mean to put the most important instructions at the start or end of a long prompt?", "Models tend to attend best to the beginning and end of long contexts", ["Middle text is deleted", "It changes the temperature", "It reduces the token count", "It is required by every API"], "Important details buried in the middle of long text are more likely to be missed."),
        ("Which is better for classification: 'Is this review positive?' or 'Classify the review as exactly one of: positive, negative, neutral. Output only the label.'?", "The second, because it fixes the allowed labels and format", ["The first, because it is shorter", "They are equivalent", "Neither", "The first, because it is open-ended"], "Constrained outputs are easier to parse and evaluate."),
        ("Why test prompts on edge cases (empty input, very long input, odd formats)?", "Real inputs are messy and failures usually appear there", ["Edge cases are always ignored", "They lower the temperature", "They reduce cost", "They change the model"], "A prompt that works on neat examples may break in production."),
        ("What is the right way to compare two prompt versions?", "Run both on the same set of test cases and compare against agreed criteria", ["Pick the one that looks longer", "Try each once", "Use the cheaper one", "Ask the model which it prefers without checking"], "Same inputs, same scoring."),
        ("What should you NOT put in a prompt sent to a third-party model service?", "Secrets or personal data you are not allowed to share", ["A task description", "Output format instructions", "Examples", "A role"], "Prompts leave your environment; follow your data-handling rules."),
        ("What is a stop sequence?", "A string that makes the model stop generating when it appears", ["A prompt delimiter", "A safety filter", "A token limit", "A fine-tuning step"], "Useful to end output before the model starts a new turn."),
        ("What does max_tokens control?", "The maximum length of the generated reply", ["The size of the prompt window", "The model's vocabulary", "The temperature", "The number of examples"], "A reply may be cut off mid-sentence when it is too low."),
        ("An answer is cut off mid-sentence. What is a likely cause?", "The max_tokens limit (or the context window) was reached", ["The temperature was too low", "The prompt had a typo", "The model refused", "The system prompt was missing"], "The reply ran out of allowed tokens."),
        ("Which technique is best when a task needs facts the model was not trained on?", "Retrieval (add the facts to the prompt) or fine-tuning, with retrieval usually cheaper and easier to update", ["Raise the temperature", "Add 'be accurate' to the prompt", "Use fewer tokens", "Lower top-p"], "Telling the model to be accurate cannot supply knowledge it lacks."),
        ("What is the main difference between fine-tuning and prompting?", "Fine-tuning changes the model's weights; prompting only changes the input", ["Prompting changes the weights", "Fine-tuning needs no data", "They are identical", "Prompting needs a GPU cluster"], "Prompts are instant and reversible; fine-tuning bakes in behaviour."),
        ("Why ask the model to quote supporting text from a document?", "It makes answers checkable and discourages unsupported claims", ["It saves tokens", "It increases creativity", "It lowers latency", "It removes the need for the document"], "Quotes let you verify the answer against the source."),
        ("What is a good practice for prompts used in a product?", "Keep them in version control and test changes against an evaluation set", ["Edit them live without records", "Copy them from the web unchecked", "Store them in chat history only", "Never change them"], "Prompts are part of your software."),
        ("What is the likely effect of adding 'Let's think step by step' to a simple factual lookup ('Capital of France?')?", "Little or no gain, with longer output and higher cost", ["A dramatic accuracy gain", "The model refuses", "The context window grows", "The temperature changes"], "Reasoning prompts help multi-step problems, not trivial lookups."),
        ("What does it mean to 'ground' a model's response?", "To base it on supplied, verifiable sources", ["To lower the temperature", "To run it offline", "To shorten it", "To translate it"], "Grounding ties claims to evidence."),
        ("What is the benefit of asking the model to output its answer in a fixed template (headings, fields)?", "Consistent, easy-to-compare results across many inputs", ["Lower cost per token", "A bigger context window", "Higher temperature", "Faster training"], "Templates make downstream use predictable."),
        ("A user asks the assistant to ignore its rules. What should a well-designed system do?", "Keep enforcing its rules in the system prompt and in code, not rely on the model alone", ["Always obey the latest instruction", "Delete the system prompt", "Raise the temperature", "Log the user out of the model"], "Security checks belong outside the model as well."),
        ("What is 'prompt leakage'?", "The model revealing hidden instructions or private context from its prompt", ["A slow response", "A prompt being too long", "A formatting bug", "The model forgetting"], "Do not put secrets in prompts that users can probe."),
        ("What does 'few-shot' example ordering affect?", "Models can be biased toward the most recent or most frequent example label", ["Nothing", "Only the cost", "Only the temperature", "Only the context window"], "Shuffle and balance labels in classification examples."),
        ("How can you make a classification prompt less sensitive to wording?", "Test several phrasings and pick the one that scores best on a labelled set", ["Use the first one that works once", "Write it in all capitals", "Make it as long as possible", "Remove the labels"], "Prompts are brittle; measure them."),
        ("Which is a valid reason to split a complex task into several prompts?", "Each step can be tested, and errors are easier to locate", ["The model can only read one sentence", "It always costs less", "It increases temperature", "It removes hallucination entirely"], "Modularity helps debugging."),
        ("What is the effect of very high temperature (e.g. 2) on factual answers?", "More errors and incoherent text, because unlikely tokens are sampled more often", ["More accuracy", "Shorter answers always", "No change", "Deterministic output"], "Randomness works against precision."),
    ])
