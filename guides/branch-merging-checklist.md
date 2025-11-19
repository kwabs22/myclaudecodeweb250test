# Branch Merging Checklist

Here's a comprehensive checklist for safely merging branches:

## 1. **Pre-Merge Preparation**

- [ ] Ensure your working directory is clean (`git status`)
- [ ] Identify source branch (feature branch) and target branch (usually `main` or `develop`)
- [ ] Review what changes are being merged
- [ ] Ensure you have the latest changes: `git fetch origin`

## 2. **Update Both Branches**

```bash
# Update target branch (e.g., main)
git checkout main
git pull origin main

# Update source branch
git checkout feature-branch
git pull origin feature-branch
```

## 3. **Sync Feature Branch with Target**

Before merging, ensure your feature branch has the latest target branch changes:

```bash
git checkout feature-branch
git merge main  # or: git rebase main (if you prefer rebase workflow)
```

- [ ] Resolve any conflicts that arise
- [ ] Run tests after resolving conflicts

## 4. **Review Changes**

```bash
# See what commits will be merged
git log main..feature-branch

# See the full diff
git diff main...feature-branch
```

- [ ] Review all commits for quality
- [ ] Ensure commit messages are clear
- [ ] Check for sensitive data (passwords, API keys, etc.)

## 5. **Testing & Validation**

- [ ] Run all tests: `npm test` / `pytest` / etc.
- [ ] Run linters: `npm run lint` / `flake8` / etc.
- [ ] Build the project: `npm run build` / `make` / etc.
- [ ] Manual testing of new features
- [ ] Check for breaking changes

## 6. **Perform the Merge**

**Option A: Merge Commit (preserves history)**
```bash
git checkout main
git merge --no-ff feature-branch -m "Merge feature-branch: description"
```

**Option B: Squash Merge (cleaner history)**
```bash
git checkout main
git merge --squash feature-branch
git commit -m "Add feature: description"
```

**Option C: Rebase Merge (linear history)**
```bash
git checkout feature-branch
git rebase main
git checkout main
git merge feature-branch
```

## 7. **Post-Merge Verification**

- [ ] Run tests again on target branch
- [ ] Verify build succeeds
- [ ] Check that application runs correctly
- [ ] Review the merge commit

## 8. **Push & Cleanup**

```bash
# Push the merged changes
git push origin main

# Delete the feature branch (local)
git branch -d feature-branch

# Delete the feature branch (remote)
git push origin --delete feature-branch
```

## 9. **Additional Considerations**

- [ ] Update pull request status (if using PR workflow)
- [ ] Notify team members of the merge
- [ ] Update documentation if needed
- [ ] Tag release if appropriate: `git tag -a v1.0.0 -m "Release v1.0.0"`
- [ ] Deploy if this triggers deployment

## **Common Merge Strategies**

**Use Merge Commit when:**
- You want to preserve complete history
- Working on long-lived feature branches
- Multiple developers collaborated on the branch

**Use Squash Merge when:**
- Feature has many small/messy commits
- You want a clean linear history
- The detailed commit history isn't valuable

**Use Rebase when:**
- You want linear history
- Feature branch is short-lived
- You're the only one working on the branch

## **Conflict Resolution Tips**

1. **Understand the conflict**: Read both versions carefully
2. **Communicate**: Talk to the author of conflicting code
3. **Test after resolution**: Always test after resolving conflicts
4. **Use merge tools**: `git mergetool` or IDE merge tools
5. **Don't force push** after merge (unless you know what you're doing)

## **Quick Reference Commands**

```bash
# Check current branch and status
git status
git branch

# Fetch latest changes
git fetch origin

# Merge branch into current branch
git merge <branch-name>

# Abort a merge if things go wrong
git merge --abort

# See merge conflicts
git diff --name-only --diff-filter=U

# After resolving conflicts
git add <resolved-files>
git commit
```

---

*This guide provides best practices for branch merging. Adjust the workflow based on your team's conventions and project requirements.*
