# GitHub PR Creation Instructions

This document provides instructions for pushing the split PR branches and creating the GitHub Pull Requests.

## Branch Status

All 5 focused PR branches have been created and tested locally:

1. ✅ **pr1-scaffold-platform** - React Native infrastructure (51 files)
2. ✅ **pr2-domain-model** - Types, constants, and stores (9 files)
3. ✅ **pr3-match-engine** - Match simulation engine (10 files)
4. ✅ **pr4-narrative-integration** - Ink narrative system (7 files)
5. ✅ **pr5-ui-components** - UI components and screens (13 files, 9 deletions)

## Branch Relationships

```
main
├── pr1-scaffold-platform (independent)
└── pr2-domain-model (depends on pr1 for packages)
    ├── pr3-match-engine (depends on pr2)
    └── pr4-narrative-integration (depends on pr2)
        └── pr5-ui-components (depends on pr2, pr3, pr4)
```

## Pushing Branches

Since the branches are created locally, they need to be pushed to GitHub. Use these commands:

```bash
# Push PR1
git push -u origin pr1-scaffold-platform

# Push PR2
git push -u origin pr2-domain-model

# Push PR3
git push -u origin pr3-match-engine

# Push PR4
git push -u origin pr4-narrative-integration

# Push PR5
git push -u origin pr5-ui-components
```

## Creating Pull Requests

After pushing, create GitHub PRs with the following details:

### PR1: React Native Scaffold/Platform

**Title:** React Native Infrastructure Setup

**Base:** `main`

**Description:**
```markdown
This PR sets up the React Native project infrastructure including:

- Android native setup (Gradle, Kotlin, build config)
- iOS native setup (Xcode project, Swift, Podfile)
- Build tools (Metro bundler, Babel, TypeScript)
- Dependencies (React Native 0.76.6, NativeWind, Zustand, Ink.js)
- Project configuration files

Part of splitting PR #5 into focused PRs for better review.

**Files changed:** 51 files
**Dependencies:** None (base PR)
**Status:** Ready for review
```

---

### PR2: Domain Model and Types

**Title:** Add Core Domain Types and Constants

**Base:** `main` (or `pr1-scaffold-platform` if merging sequentially)

**Description:**
```markdown
This PR adds the core domain model for the game:

- Player types and attributes
- Career progression types
- Team types
- Player archetypes (Point Guard, Wing, etc.)
- League scaling constants
- Career state management (Zustand store)
- Player card utilities

Part of splitting PR #5 into focused PRs for better review.

**Files changed:** 9 files
**Dependencies:** PR1 (for React Native packages)
**Status:** Ready for review
```

---

### PR3: Match Engine

**Title:** Basketball Match Simulation Engine

**Base:** `pr2-domain-model`

**Description:**
```markdown
This PR implements the basketball match simulation engine:

- Core match engine with Markov chain possessions
- Match engine adapter for UI integration
- Match state management (Zustand store)
- Tuning parameters for game balance
- Verification scripts for engine testing

Part of splitting PR #5 into focused PRs for better review.

**Files changed:** 10 files
**Dependencies:** PR2 (for player/team types)
**Status:** Ready for review
```

---

### PR4: Ink Narrative Integration

**Title:** Narrative System with Ink.js

**Base:** `pr2-domain-model`

**Description:**
```markdown
This PR integrates the Ink narrative engine:

- Ink story manager
- Practice coach narrative (source + compiled)
- Narrative verification scripts
- Ink-UI bridge testing

Part of splitting PR #5 into focused PRs for better review.

**Files changed:** 7 files
**Dependencies:** PR2 (for player types and career store)
**Status:** Ready for review
```

---

### PR5: UI Components and Screens

**Title:** Add UI Components and Main Screen

**Base:** `pr3-match-engine` (after merging PR3 and PR4)

**Description:**
```markdown
This PR adds the user interface components:

- Player card component
- Narrative overlay component
- Home screen
- Updated App.tsx to use HomeScreen
- Test file for persistence verification
- Cursor AI rules for development
- Cleanup of deprecated files (old tests, empty index files)

Part of splitting PR #5 into focused PRs for better review.

**Files changed:** 13 new files, 9 deletions
**Dependencies:** PR2, PR3, PR4
**Status:** Ready for review
```

---

## Closing PR #5

After all focused PRs are created, add this comment to PR #5:

```markdown
This PR has been superseded by the following focused PRs for better review:

1. #X - React Native Infrastructure Setup
2. #Y - Core Domain Types and Constants  
3. #Z - Basketball Match Simulation Engine
4. #A - Narrative System with Ink.js
5. #B - UI Components and Main Screen

Each PR is focused on a specific concern and can be reviewed independently. The combined changes in these 5 PRs match the original changes in this PR.

Closing this PR in favor of the focused split.
```

Then close PR #5.

---

## Merge Strategy

### Recommended: Sequential Merging

1. Merge PR1 to `main`
2. Merge PR2 to `main` (rebase on main first if needed)
3. Merge PR3 to `main` (already based on PR2)
4. Merge PR4 to `main` (already based on PR2)  
5. Merge PR5 to `main` (already based on PR3 + PR4)

### Alternative: Parallel Development

PR3 and PR4 can be developed in parallel as both depend on PR2.

---

## Verification

Each PR passes TypeScript compilation:
- ✅ PR1: TypeScript compiles
- ✅ PR2: TypeScript compiles
- ✅ PR3: TypeScript compiles
- ✅ PR4: TypeScript compiles
- ✅ PR5: TypeScript compiles

---

## Notes

- All branches are local and need to be pushed to GitHub
- Each PR is focused on a specific concern
- Total changes match original PR #5 when combined
- Easier to review and merge incrementally
