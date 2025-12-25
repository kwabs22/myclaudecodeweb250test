# Merge Implementation Guide
## Practical Scripts and Step-by-Step Instructions

**Companion to**: REPOSITORY_MERGE_PLAN.md
**Purpose**: Executable instructions for safe repository merge

---

## Quick Start

### Prerequisites Checklist

```bash
# 1. Verify you're in the repository
pwd
# Should show: /home/user/myclaudecodeweb250test

# 2. Check you have all branches
git branch -r | grep 'origin/claude' | wc -l
# Should show: 30

# 3. Verify git status is clean
git status
# Should show: nothing to commit, working tree clean

# 4. Create external backup (CRITICAL!)
cd ..
tar -czf myclaudecodeweb250test-backup-$(date +%Y%m%d).tar.gz myclaudecodeweb250test/
cd myclaudecodeweb250test
```

---

## Implementation Scripts

### Script 1: Tag All Branches (Safety Net)

**Purpose**: Create recovery points for all branches

```bash
#!/bin/bash
# File: tag_all_branches.sh

echo "Creating safety tags for all branches..."

for branch in $(git branch -r | grep 'origin/claude' | sed 's/origin\///'); do
    tag_name="pre-merge/${branch}"
    echo "Tagging: ${tag_name}"

    git tag "${tag_name}" "origin/${branch}"
done

echo "All branches tagged!"
echo "Tags created:"
git tag | grep 'pre-merge'

# Push tags to remote
read -p "Push tags to remote? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin --tags
    echo "Tags pushed to remote"
fi
```

**Run with**:
```bash
chmod +x tag_all_branches.sh
./tag_all_branches.sh
```

---

### Script 2: Analyze Unique Files Per Branch

**Purpose**: Generate detailed report of unique content

```bash
#!/bin/bash
# File: analyze_unique_files.sh

# Define base files (common across branches)
BASE_FILES=(
    "ANALYSIS_SUMMARY.txt"
    "FILE_INDEX.md"
    "GASSHOOTER_ANALYSIS_INDEX.md"
    "GASSHOOTER_DETAILED_ANALYSIS.md"
    "GASSHOOTER_EXECUTIVE_SUMMARY.md"
    "GASSHOOTER_QUICK_REFERENCE.txt"
    "GASSHOOTER_TOP_20_FUNCTIONS.csv"
    "GASSHOOTER_TOP_20_FUNCTIONS.json"
    "PlayCanvas_Complexity_Analysis.md"
    "PlayCanvas_Function_Analysis.md"
    "QUICK_START.md"
    "README.md"
    "README_GASSHOOTER_ANALYSIS.txt"
    "ai-tools-3d-gaming-impact.md"
    "easybpy-concepts-for-playcanvas.md"
    "github-projects-to-learn-from.md"
    "top-20-functions-analysis.md"
    "playcanvas_top_functions.json"
    "top_20_functions_summary.csv"
)

OUTPUT_FILE="unique_files_report.md"
echo "# Unique Files Report" > "$OUTPUT_FILE"
echo "Generated: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for branch in $(git branch -r | grep 'origin/claude' | sed 's/origin\///'); do
    echo "Analyzing: $branch"
    echo "## Branch: $branch" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    # Get all files in branch
    all_files=$(git ls-tree -r --name-only "origin/$branch")

    # Filter out base files
    unique_files=""
    for file in $all_files; do
        is_base=false
        for base in "${BASE_FILES[@]}"; do
            if [ "$file" == "$base" ]; then
                is_base=true
                break
            fi
        done

        if [ "$is_base" == "false" ]; then
            unique_files="${unique_files}\n- ${file}"
        fi
    done

    if [ -n "$unique_files" ]; then
        echo -e "**Unique files:**" >> "$OUTPUT_FILE"
        echo -e "$unique_files" >> "$OUTPUT_FILE"
    else
        echo "No unique files (base content only)" >> "$OUTPUT_FILE"
    fi

    echo "" >> "$OUTPUT_FILE"
    echo "---" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
done

echo "Report saved to: $OUTPUT_FILE"
```

**Run with**:
```bash
chmod +x analyze_unique_files.sh
./analyze_unique_files.sh
```

---

### Script 3: Create Directory Structure

**Purpose**: Set up organized target directories

```bash
#!/bin/bash
# File: create_directory_structure.sh

echo "Creating target directory structure..."

# Create main branch if it doesn't exist
git checkout -b main 2>/dev/null || git checkout main

# Game Development
mkdir -p game-development/{gasshooter,playcanvas,ai-tools,blender,algorithms,game-design,modding,retro,react-native}

# AI & ML
mkdir -p ai-ml/careers/{ai-engineer-roadmap,ai-career-transformation}
mkdir -p ai-ml/{marketing,nlp,mcp}
mkdir -p ai-ml/computer-vision/openpose

# Creative & Media
mkdir -p creative-media/{memes,music,storytelling,social-media}

# Learning Resources
mkdir -p learning-resources/{languages,mathematics,chess}

# Development Tools
mkdir -p development-tools/{claude-code,gradio,apis,benchmarking,visualization}

# Industry Research
mkdir -p industry-research/robotics
mkdir -p industry-research/business/vending-machine

echo "Directory structure created!"
tree -L 2 -d .
```

**Run with**:
```bash
chmod +x create_directory_structure.sh
./create_directory_structure.sh
```

---

### Script 4: Merge Base Content First

**Purpose**: Establish base game development content

```bash
#!/bin/bash
# File: merge_base_content.sh

echo "Merging base game development content..."

# Checkout main branch
git checkout main

# Use easybpy-3d-gaming-docs as the base (has most complete content)
BASE_BRANCH="origin/claude/easybpy-3d-gaming-docs-01NYaChUDoQK14BheVPXVPU2"

# Create game-development directory structure
mkdir -p game-development/{gasshooter,playcanvas,ai-tools,blender}

# Extract base files
git checkout "$BASE_BRANCH" -- \
    ANALYSIS_SUMMARY.txt \
    FILE_INDEX.md \
    QUICK_START.md \
    README.md

# Move to game-development directory
mv ANALYSIS_SUMMARY.txt game-development/
mv FILE_INDEX.md game-development/
mv QUICK_START.md game-development/
mv README.md game-development/README_ORIGINAL.md

# GASShooter files
git checkout "$BASE_BRANCH" -- \
    GASSHOOTER_ANALYSIS_INDEX.md \
    GASSHOOTER_DETAILED_ANALYSIS.md \
    GASSHOOTER_EXECUTIVE_SUMMARY.md \
    GASSHOOTER_QUICK_REFERENCE.txt \
    GASSHOOTER_TOP_20_FUNCTIONS.csv \
    GASSHOOTER_TOP_20_FUNCTIONS.json

mv GASSHOOTER_* game-development/gasshooter/

# PlayCanvas files
git checkout "$BASE_BRANCH" -- \
    PlayCanvas_Complexity_Analysis.md \
    PlayCanvas_Function_Analysis.md

mv PlayCanvas_* game-development/playcanvas/

# AI tools
git checkout "$BASE_BRANCH" -- ai-tools-3d-gaming-impact.md
mv ai-tools-3d-gaming-impact.md game-development/ai-tools/

# Blender
git checkout "$BASE_BRANCH" -- easybpy-concepts-for-playcanvas.md
mv easybpy-concepts-for-playcanvas.md game-development/blender/

# Additional game dev files if they exist
git checkout "$BASE_BRANCH" -- github-projects-to-learn-from.md 2>/dev/null && \
    mv github-projects-to-learn-from.md game-development/

git checkout "$BASE_BRANCH" -- top-20-functions-analysis.md 2>/dev/null && \
    mv top-20-functions-analysis.md game-development/

echo "Base content merged to game-development/"
ls -R game-development/
```

---

### Script 5: Extract Unique Content from Each Branch

**Purpose**: Copy unique files to appropriate directories

```bash
#!/bin/bash
# File: extract_unique_content.sh

echo "Extracting unique content from all branches..."

# Branch-to-directory mapping
declare -A BRANCH_MAP=(
    # Game Development
    ["claude/list-algorithms-01R6DxjEpQMDeoFtEzYZXHPY"]="game-development/algorithms"
    ["claude/react-native-games-expo-01N2dumztdEBv68b728wS5SS"]="game-development/react-native"
    ["claude/game-mechanics-verbs-01GjyLrByno7T88BLQUt6DA7"]="game-development/game-design"
    ["claude/modding-guide-repos-014WgnV6vbzs7nGrgFZKUJ84"]="game-development/modding"
    ["claude/retro-game-dev-learning-01TrwpZE6Uc6XuaJZeEo8wB2"]="game-development/retro"
    ["claude/blender-ui-settings-guide-01Rq5Ezr72LNS65nn5gAACEF"]="game-development/blender"
    ["claude/discuss-data-workflows-01TjBboyiq9FS3yTjjVtkxrw"]="game-development/blender"
    ["claude/research-mermaid-dependencies-01FbashtYZnEvLQbnw5MWYmC"]="game-development/game-design"

    # AI & ML
    ["claude/ai-engineer-roadmap-01Vdd82zXPQVaG4z4bKMkJxC"]="ai-ml/careers/ai-engineer-roadmap"
    ["claude/vi-implementation-plan-01VspkRyToFJoQFmMWhm8sLC"]="ai-ml/careers/ai-career-transformation"
    ["claude/autonomous-ai-marketing-agents-01Um5dqsqgSHHsfBzjrMgyHL"]="ai-ml/marketing"
    ["claude/nlp-vs-llm-comparison-01MBazithQVx2Y5E9o4h5ZLW"]="ai-ml/nlp"
    ["claude/mcp-research-list-01TDupzDZEdYUYJMLvxutus3"]="ai-ml/mcp"
    ["claude/research-openpose-01TZGJc18LJGLJuVLopb3QU5"]="ai-ml/computer-vision/openpose"

    # Creative & Media
    ["claude/meme-repos-collection-01XXya7wPEyCT77xdhS5QRGK"]="creative-media/memes"
    ["claude/music-theory-guide-01DSFgbdXWYgMe8uVUfkTUvd"]="creative-media/music"
    ["claude/understand-code-concepts-01DvjAY7wYtU1Mwjo3PUwRNP"]="creative-media/music"
    ["claude/explore-story-generation-repos-01GAbz3WFMKVP84a6CHJdRKN"]="creative-media/storytelling"
    ["claude/trending-topics-ui-01MV9wjLN8KoWe7mhM3yfVFY"]="creative-media/social-media"

    # Learning Resources
    ["claude/find-language-learning-repos-0139c4Gb8V4Rn21BE3bWU9cR"]="learning-resources/languages"
    ["claude/find-combinatorics-repos-01VVqaPNV9nxjMWWxFR8zuFU"]="learning-resources/mathematics"
    ["claude/chess-calculation-app-01R5MURF4MXfH462BwqUmRy7"]="learning-resources/chess"

    # Development Tools
    ["claude/gradio-planning-interface-01B6rKWt8YqNSoQbuYzUPSd2"]="development-tools"
    ["claude/api-call-examples-01D2c2SkVKPtnY9b3aXR7BfM"]="development-tools/apis"

    # Industry Research
    ["claude/document-humanoid-robots-01KQQh5VbVEZ6WcirbT7RLE3"]="industry-research/robotics"
    ["claude/drone-tech-research-018RqDhAciadTMfxP7FEGd24"]="industry-research/robotics"
    ["claude/vending-machine-benchmark-01UU2raokGYz8AYz8M61RVSN"]="industry-research/business/vending-machine"
    ["claude/lead-generation-research-013kexLG1fpWKLeDK2z5XKY8"]="industry-research/business"
)

# Base files to exclude
BASE_FILES=(
    "ANALYSIS_SUMMARY.txt"
    "FILE_INDEX.md"
    "GASSHOOTER_ANALYSIS_INDEX.md"
    "GASSHOOTER_DETAILED_ANALYSIS.md"
    "GASSHOOTER_EXECUTIVE_SUMMARY.md"
    "GASSHOOTER_QUICK_REFERENCE.txt"
    "GASSHOOTER_TOP_20_FUNCTIONS.csv"
    "GASSHOOTER_TOP_20_FUNCTIONS.json"
    "PlayCanvas_Complexity_Analysis.md"
    "PlayCanvas_Function_Analysis.md"
    "QUICK_START.md"
    "README.md"
    "README_GASSHOOTER_ANALYSIS.txt"
    "ai-tools-3d-gaming-impact.md"
    "easybpy-concepts-for-playcanvas.md"
    "github-projects-to-learn-from.md"
    "top-20-functions-analysis.md"
    "playcanvas_top_functions.json"
    "top_20_functions_summary.csv"
)

# Function to check if file is base file
is_base_file() {
    local file="$1"
    for base in "${BASE_FILES[@]}"; do
        if [ "$file" == "$base" ]; then
            return 0
        fi
    done
    return 1
}

# Process each branch
for branch in "${!BRANCH_MAP[@]}"; do
    target_dir="${BRANCH_MAP[$branch]}"

    echo ""
    echo "Processing: $branch -> $target_dir"

    # Get all files from branch
    files=$(git ls-tree -r --name-only "origin/$branch")

    # Extract unique files
    for file in $files; do
        if ! is_base_file "$file"; then
            echo "  Extracting: $file"

            # Create subdirectory if file has path
            file_dir=$(dirname "$file")
            if [ "$file_dir" != "." ]; then
                mkdir -p "$target_dir/$file_dir"
            fi

            # Extract file
            git checkout "origin/$branch" -- "$file" 2>/dev/null

            # Move to target directory
            mv "$file" "$target_dir/" 2>/dev/null || mv "$file" "$target_dir/$file"
        fi
    done

    echo "  ✓ Complete"
done

echo ""
echo "All unique content extracted!"
echo "Verify with: tree -L 3"
```

---

## Manual Merge Steps (Safe Alternative)

If scripts seem risky, follow these manual steps:

### Step 1: Set Up Main Branch
```bash
git checkout -b main
```

### Step 2: Merge Base Content
```bash
# Cherry-pick base game development content
git checkout origin/claude/easybpy-3d-gaming-docs-01NYaChUDoQK14BheVPXVPU2 -- .

# Organize into directories
mkdir -p game-development/{gasshooter,playcanvas,ai-tools,blender}
# Move files manually
```

### Step 3: For Each Branch with Unique Content

```bash
# Example: list-algorithms branch
BRANCH="claude/list-algorithms-01R6DxjEpQMDeoFtEzYZXHPY"

# List files
git ls-tree -r --name-only "origin/$BRANCH"

# Checkout unique files only
git checkout "origin/$BRANCH" -- 100-algorithms-to-games.md
git checkout "origin/$BRANCH" -- 50-aruco-marker-games.md

# Move to target directory
mkdir -p game-development/algorithms
mv *algorithms*.md game-development/algorithms/

# Repeat for all unique files in branch
```

---

## Verification Checklist

After merge, verify:

### File Count Verification
```bash
# Count unique files expected
wc -l unique_files_report.md

# Count files in merged repo
find . -type f -not -path './.git/*' | wc -l

# Compare - should match!
```

### Content Spot Check
```bash
# Verify specific high-value content
test -f game-development/algorithms/100-algorithms-to-games.md && echo "✓ Algorithms"
test -f ai-ml/mcp/MCP_SERVERS_OVERVIEW.md && echo "✓ MCP docs"
test -f creative-media/memes/MEME_DICTIONARY.md && echo "✓ Memes"
test -d learning-resources/chess && echo "✓ Chess app"
```

### Documentation Check
```bash
# Ensure key docs exist
test -f README.md && echo "✓ Master README"
test -f REPOSITORY_MERGE_PLAN.md && echo "✓ Merge plan"
test -f REPOSITORY_HISTORY.md && echo "✓ History docs"
```

---

## Rollback Procedures

### Rollback Entire Merge
```bash
# Delete main branch
git branch -D main

# Start over
git checkout -b main origin/claude/easybpy-3d-gaming-docs-01NYaChUDoQK14BheVPXVPU2
```

### Restore Specific Branch
```bash
# From tag
git checkout -b restored-branch pre-merge/claude/branch-name

# Or from remote
git checkout -b restored-branch origin/claude/branch-name
```

---

## Post-Merge Tasks

### 1. Create Master README
```bash
# Edit README.md to include:
# - Repository overview
# - Navigation guide
# - Link to all categories
# - Quick start for different user types
```

### 2. Create REPOSITORY_HISTORY.md
```bash
# Document:
# - Original 30 branches
# - Merge strategy used
# - Date of merge
# - Mapping of old branches to new locations
```

### 3. Clean Up
```bash
# Add all changes
git add .

# Commit
git commit -m "Merge all 30 Claude branches into organized structure

- Consolidated 30 research branches
- Organized into 5 main categories
- Preserved all unique content (150+ files)
- Created comprehensive documentation
- See REPOSITORY_MERGE_PLAN.md for details"

# Push to remote
git push -u origin main
```

### 4. Archive Old Branches (Optional)
```bash
# After verifying merge success

# Option 1: Keep branches with tags only
git push origin --delete claude/branch-name

# Option 2: Keep all branches for now
# Do nothing - tags provide safety net
```

---

## Emergency Contacts

If something goes wrong:

1. **STOP immediately**
2. **Don't push** to remote
3. **Check tags**: `git tag | grep pre-merge`
4. **Restore from tag**: `git checkout pre-merge/branch-name`
5. **Review backup**: Extract from `.tar.gz` file

---

## Success Criteria

Merge is complete when:

- [ ] All 30 branches tagged
- [ ] Main branch created with directory structure
- [ ] All unique files extracted (verified by count)
- [ ] Base game dev content organized
- [ ] Master README created
- [ ] REPOSITORY_HISTORY.md created
- [ ] All links working
- [ ] Committed and pushed to remote
- [ ] Tested clone and navigation

---

**Document Status**: READY TO EXECUTE
**Last Updated**: 2025-12-25
**Estimated Time**: 8-12 hours for manual approach
