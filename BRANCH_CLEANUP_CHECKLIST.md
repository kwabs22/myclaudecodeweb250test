# Branch & Chat Cleanup Checklist

Every old `claude/*` branch, the Claude Code chat that created it, and where its files now live in `main`.
File counts compare content by hash (`./verify_merge.sh` re-runs the check). Files every branch inherited from the first branch are not counted.

**For each row:** open the chat and look for anything that was answered in chat but never committed, or work the session said it would still do. Then delete the branch on GitHub and archive the chat.

Deleting a branch is safe: `main` contains all of its files and its full commit history.

## Branches with a chat

| Created | Chat | Branch | Files in main | Now in | Chat checked | Branch deleted | Chat archived |
|---|---|---|---|---|:-:|:-:|:-:|
| 2025-11-16 | [Document EasyBPY impact on 3D gaming](https://claude.ai/code/session_01NYaChUDoQK14BheVPXVPU2) | `easybpy-3d-gaming-docs` | 18/19 | `game-development`<br>`game-development/gasshooter` | [ ] | [ ] | [ ] |
| 2025-11-17 | [Create API call examples with search terms](https://claude.ai/code/session_01D2c2SkVKPtnY9b3aXR7BfM) | `api-call-examples` | 4/4 | `development-tools/apis` | [ ] | [ ] | [ ] |
| 2025-11-17 | [Build autonomous AI marketing agents](https://claude.ai/code/session_01Um5dqsqgSHHsfBzjrMgyHL) | `autonomous-ai-marketing-agents` | 4/4 | `ai-ml/marketing` | [ ] | [ ] | [ ] |
| 2025-11-17 | [Document technical information for humanoid robots](https://claude.ai/code/session_01KQQh5VbVEZ6WcirbT7RLE3) | `document-humanoid-robots` | 4/4 | `industry-research/robotics/humanoid-robots` | [ ] | [ ] | [ ] |
| 2025-11-17 | [Understand lead generation process and find repos](https://claude.ai/code/session_013kexLG1fpWKLeDK2z5XKY8) | `lead-generation-research` | 2/2 | `industry-research/business/lead-generation` | [ ] | [ ] | [ ] |
| 2025-11-17 | [List 100 unique algorithms from repositories](https://claude.ai/code/session_01R6DxjEpQMDeoFtEzYZXHPY) | `list-algorithms` | 155/155 | `game-development/algorithms/playcanvas-examples/dynamic-programming`<br>`game-development/algorithms/playcanvas-examples/graph` | [ ] | [ ] | [ ] |
| 2025-11-17 | [Create modding guide with top repositories](https://claude.ai/code/session_014WgnV6vbzs7nGrgFZKUJ84) | `modding-guide-repos` | 4/4 | `game-development/modding` | [ ] | [ ] | [ ] |
| 2025-11-17 | [Create React Native games folder with Expo](https://claude.ai/code/session_01N2dumztdEBv68b728wS5SS) | `react-native-games-expo` | 58/58 | `game-development/react-native/react-native-games-expo/expo-games-demo/games`<br>`game-development/react-native/react-native-games-expo/expo-games-demo` | [ ] | [ ] | [ ] |
| 2025-11-17 | [Research OpenPose repository and documentation](https://claude.ai/code/session_01TZGJc18LJGLJuVLopb3QU5) | `research-openpose` | 26/26 | `ai-ml/computer-vision/openpose`<br>`ai-ml/computer-vision/openpose/anatomy-viz-web` | [ ] | [ ] | [ ] |
| 2025-11-17 | [Learn retro game development and DS aesthetics](https://claude.ai/code/session_01TrwpZE6Uc6XuaJZeEo8wB2) | `retro-game-dev-learning` | 1/1 | `game-development/retro` | [ ] | [ ] | [ ] |
| 2025-11-18 | [Create AI Engineer learning roadmap repository](https://claude.ai/code/session_01Vdd82zXPQVaG4z4bKMkJxC) | `ai-engineer-roadmap` | 12/12 | `ai-ml/careers/ai-engineer-roadmap` | [ ] | [ ] | [ ] |
| 2025-11-18 | [Build chess calculation app with lookahead](https://claude.ai/code/session_01R5MURF4MXfH462BwqUmRy7) | `chess-calculation-app` | 33/33 | `learning-resources/chess`<br>`learning-resources/chess/gpu_providers` | [ ] | [ ] | [ ] |
| 2025-11-18 | [Find repositories about combinatorics](https://claude.ai/code/session_01VVqaPNV9nxjMWWxFR8zuFU) | `find-combinatorics-repos` | 2/2 | `learning-resources/mathematics` | [ ] | [ ] | [ ] |
| 2025-11-18 | [Find 50 language learning repositories](https://claude.ai/code/session_0139c4Gb8V4Rn21BE3bWU9cR) | `find-language-learning-repos` | 3/3 | `learning-resources/languages` | [ ] | [ ] | [ ] |
| 2025-11-18 | [Create planning interface with Gradio and Blaxel](https://claude.ai/code/session_01B6rKWt8YqNSoQbuYzUPSd2) | `gradio-planning-interface` | 37/37 | `learning-resources/chess`<br>`development-tools/claude-code` | [ ] | [ ] | [ ] |
| 2025-11-18 | [Research and compile list of good MCPs](https://claude.ai/code/session_01TDupzDZEdYUYJMLvxutus3) | `mcp-research-list` | 4/4 | `ai-ml/mcp` | [ ] | [ ] | [ ] |
| 2025-11-18 | [Find meme repositories and create collection](https://claude.ai/code/session_01XXya7wPEyCT77xdhS5QRGK) | `meme-repos-collection` | 3/3 | `creative-media/memes` | [ ] | [ ] | [ ] |
| 2025-11-18 | [Create music theory guide from production repos](https://claude.ai/code/session_01DSFgbdXWYgMe8uVUfkTUvd) | `music-theory-guide` | 4/4 | `creative-media/music` | [ ] | [ ] | [ ] |
| 2025-11-18 | [Create trending topics UI component](https://claude.ai/code/session_01MV9wjLN8KoWe7mhM3yfVFY) | `trending-topics-ui` | 18/18 | `creative-media/social-media/trending-topics-ui`<br>`creative-media/social-media/trending-topics-ui/src/components` | [ ] | [ ] | [ ] |
| 2025-11-18 | [Understand vending machine benchmark and Claudius](https://claude.ai/code/session_01UU2raokGYz8AYz8M61RVSN) | `vending-machine-benchmark` | 3/3 | `industry-research/business/vending-machine` | [ ] | [ ] | [ ] |
| 2025-11-18 | [Create implementation plan for vi ideas](https://claude.ai/code/session_01VspkRyToFJoQFmMWhm8sLC) | `vi-implementation-plan` | 2/2 | `ai-ml/careers/ai-career-transformation` | [ ] | [ ] | [ ] |
| 2025-11-19 | [Advise on merging branches](https://claude.ai/code/session_01DPqiVuG5YrfrMzKZ8DHizw) | `merge-branches-advice` | 1/1 | `development-tools/git` | [ ] | [ ] | [ ] |
| 2025-11-19 | [Compare traditional NLP repos with small LLMs](https://claude.ai/code/session_01MBazithQVx2Y5E9o4h5ZLW) | `nlp-vs-llm-comparison` | 1/1 | `ai-ml/nlp` | [ ] | [ ] | [ ] |
| 2025-11-20 | [Find drone tech repos and basic implementation](https://claude.ai/code/session_018RqDhAciadTMfxP7FEGd24) | `drone-tech-research` | 2/2 | `industry-research/robotics` | [ ] | [ ] | [ ] |
| 2025-11-21 | [Research mermaid diagrams and dependency management](https://claude.ai/code/session_01FbashtYZnEvLQbnw5MWYmC) | `research-mermaid-dependencies` | 7/7 | `game-development/game-design` | [ ] | [ ] | [ ] |
| 2025-11-23 | [Understand Blender UI settings and options](https://claude.ai/code/session_01Rq5Ezr72LNS65nn5gAACEF) | `blender-ui-settings-guide` | 1/1 | `game-development/blender` | [ ] | [ ] | [ ] |
| 2025-11-23 | [Discuss data workflows in and out](https://claude.ai/code/session_01TjBboyiq9FS3yTjjVtkxrw) | `discuss-data-workflows` | 4/4 | `game-development/blender` | [ ] | [ ] | [ ] |
| 2025-11-23 | [Understand existing story generation repositories](https://claude.ai/code/session_01GAbz3WFMKVP84a6CHJdRKN) | `explore-story-generation-repos` | 2/2 | `creative-media/story-generation` | [ ] | [ ] | [ ] |
| 2025-11-23 | [Concretize 50 verbs as game mechanics](https://claude.ai/code/session_01GjyLrByno7T88BLQUt6DA7) | `game-mechanics-verbs` | 2/2 | `game-development/game-design` | [ ] | [ ] | [ ] |
| 2025-11-23 | [Understanding Code Concepts and Debugging](https://claude.ai/code/session_01DvjAY7wYtU1Mwjo3PUwRNP) | `understand-code-concepts` | 5/5 | `creative-media/music/vst`<br>`creative-media/music` | [ ] | [ ] | [ ] |
| 2025-12-25 | [Plan repository merge strategy](https://claude.ai/code/session_01DUFYYuAhVtP8cshaWtNoWY) | `plan-repo-merge` | 280/282 | `game-development/react-native/react-native-games-expo/expo-games-demo/games`<br>`game-development/algorithms/playcanvas-examples/dynamic-programming` | [ ] | [ ] | [ ] |

Two rows are short on purpose:
- `easybpy-3d-gaming-docs` (18/19): its `README.md` is now `game-development/README.md`, with links updated to the new folders.
- `plan-repo-merge` (280/282): `README.md` and `MERGE_COMPLETE.md` were corrected after the audit, and `learning-resources/chess/assess_task.py` was replaced by the newer gradio version.

## Chats with no branch on GitHub

These sessions never pushed their branch, so anything they produced exists only in the chat. Read them before archiving and copy anything worth keeping into `main`.

| Created | Chat | Branch it would have used | Chat checked | Useful content saved | Chat archived |
|---|---|---|:-:|:-:|:-:|
| 2025-11-20 | [Explain Atlassian AI products overview](https://claude.ai/code/session_013g1X7T19KkBVXhqCZnAE9H) | `claude/atlassian-ai-products-013g1X7T19KkBVXhqCZnAE9H` | [ ] | [ ] | [ ] |
| 2025-12-05 | [Plan branch merge strategy](https://claude.ai/code/session_01QZ5J86FngB8pGaRdTZWhaK) | `claude/plan-branch-merge-01QZ5J86FngB8pGaRdTZWhaK` | [ ] | [ ] | [ ] |

## Keep

- `main` is the default branch and holds everything.
- `claude/repo-state-overview-ikx9w1` ([chat](https://claude.ai/code/session_01Pn9U5eKZFyLLmrzgpY6KQN)) is the organising branch. `main` was created from it; delete it last, once `main` carries this checklist too.
