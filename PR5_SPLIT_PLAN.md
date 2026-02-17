# PR #5 Split Plan

This document outlines the strategy for splitting PR #5 (player-fields branch) into 5 focused, reviewable PRs.

## Overview

PR #5 contains 83 changed files with 13,568 additions and 470 deletions. This is too large for effective code review. We will split it into 5 focused PRs that can be reviewed and merged independently or sequentially.

## File Categorization

### PR1: Scaffold/Platform (React Native Infrastructure)
**Purpose:** Set up the React Native project with Android/iOS native code and build configuration.

**Files (51 files):**
- `.gitignore` - Updated for React Native
- `.watchmanconfig` - Watchman configuration for Metro bundler
- `app.json` - React Native app configuration
- `Gemfile` - Ruby dependencies for iOS build
- `babel.config.js` - Babel configuration updates
- `metro.config.js` - Metro bundler configuration
- `tsconfig.json` - TypeScript configuration updates
- `package.json` - Dependencies for React Native, NativeWind, Zustand, etc.
- `package-lock.json` - Lock file
- `tailwind.config.js` - Tailwind/NativeWind configuration
- `global.css` - Global CSS file
- `nativewind-env.d.ts` - TypeScript definitions for NativeWind
- `App.tsx` - Root component (minimal placeholder for PR1)
- `index.js` - App registration
- `android/**/*` - All Android native files (28 files)
- `ios/**/*` - All iOS native files (11 files)

**Dependencies:** None (base PR)

**Status:** Branch `pr1-scaffold-platform` created locally ✅

---

### PR2: Domain Model/Types (Core Data Structures)
**Purpose:** Define the core types, constants, and state management for players, careers, and teams.

**Files (9 files):**
- `src/types/player.ts` - Player data types, attributes, position enums
- `src/types/career.ts` - Career progression types
- `src/types/team.ts` - Team types
- `src/constants/archetypes.ts` - Player archetype definitions
- `src/constants/leagueScaling.ts` - League scaling formulas
- `src/store/useCareerStore.ts` - Zustand store for career state
- `src/components/playerCardUtils.ts` - Player card utilities (domain logic)
- `package.json` - Updated dependencies
- `tsconfig.json` - TypeScript configuration

**Dependencies:** PR1 (needs React Native packages)

**Status:** Not started

---

### PR3: Match Engine (Game Simulation)
**Purpose:** Implement the basketball match simulation engine with Markov chain possessions.

**Files (10 files):**
- `src/matchEngine.ts` - Core match simulation logic
- `src/matchEngineAdapter.ts` - Adapter between engine and UI
- `src/matchEngineStore.ts` - Zustand store for match state
- `src/matchEngineTuning.js` - Tuning parameters
- `src/matchEngineTuning.d.ts` - Type definitions for tuning
- `src/verifyMatchEngine.js` - Verification script
- `src/verifyMatchEngineIntegration.js` - Integration verification
- `src/verifyMatchEngineStore.js` - Store verification
- `src/verifyMatchEngineStoreTransitions.js` - State transition verification
- `src/verifyLeagueScaling.js` - League scaling verification

**Dependencies:** PR2 (needs player/team types)

**Status:** Not started

---

### PR4: Narrative Integration (Ink Story System)
**Purpose:** Integrate the Ink narrative engine for story-driven gameplay.

**Files (7 files):**
- `src/narrative/inkManager.ts` - Ink.js integration and manager
- `src/narrative/practice_coach.ink` - Practice coach narrative (source)
- `src/narrative/assets/practice_coach.json` - Compiled Ink story
- `src/scripts/setupNodeVerificationEnv.ts` - Node environment setup
- `src/scripts/testInkBridge.ts` - Ink bridge testing
- `src/scripts/verifyNarrativeViewBridge.ts` - Narrative-view bridge verification
- Removed: `src/narrative/index.ts` (deleted in PR #5)

**Dependencies:** PR2 (needs player types and career store)

**Status:** Not started

---

### PR5: UI Components (User Interface)
**Purpose:** Add UI components for displaying player information, narratives, and screens.

**Files (4 new files + removed files):**
- `src/components/PlayerCard.tsx` - Player card component
- `src/components/NarrativeOverlay.tsx` - Narrative overlay component
- `src/screens/HomeScreen.tsx` - Main home screen
- `App.tsx` - Update to use HomeScreen (replace placeholder)
- Removed files:
  - `src/app.tsx` (deleted)
  - `README.md` (deleted)
  - `.eslintrc.js` (deleted)
  - `jest.config.js` (deleted)
  - `tests/app.test.tsx` (deleted)
  - `tests/setup.ts` (deleted)
  - `src/engine/index.ts` (deleted)
  - `src/models/index.ts` (deleted)

**Dependencies:** PR2 (needs types), PR3 (needs match engine store), PR4 (needs narrative manager)

**Status:** Not started

---

### Additional Files in PR #5

**Cursor Rules (Documentation - could be separate or in PR1):**
- `.cursor/rules/leaguebound-match-engine.mdc` - Match engine rules
- `.cursor/rules/leaguebound-prd-feature.mdc` - PRD feature rules
- `.cursor/rules/leaguebound-simulation.mdc` - Simulation rules (modified)
- `.cursor/rules/leaguebound-stack-and-philosophy.mdc` - Stack philosophy (modified)

**Test Files (could be with PR5 or separate):**
- `test/verifyPersistence.test.ts` - Persistence verification test

---

## Merge Strategy

### Option A: Sequential Merging (Recommended)
Merge PRs in order, with each building on the previous:
1. PR1 (Scaffold) → main
2. PR2 (Types) → main (after PR1)
3. PR3 (Match Engine) → main (after PR2)
4. PR4 (Narrative) → main (after PR2)
5. PR5 (UI) → main (after PR2, PR3, PR4)

### Option B: Parallel Development
- PR1 → main first
- PR2 → main (after PR1)
- PR3 and PR4 can be developed/merged in parallel (both depend on PR2)
- PR5 → main last (after all others)

---

## Branch Creation Commands

```bash
# PR1: Already created
git checkout main
git checkout -b pr1-scaffold-platform
# ... apply changes ...
git push -u origin pr1-scaffold-platform

# PR2: Domain Model
git checkout main
git checkout -b pr2-domain-model
git checkout player-fields -- src/types/ src/constants/ src/store/
git push -u origin pr2-domain-model

# PR3: Match Engine
git checkout pr2-domain-model  # Build on PR2
git checkout -b pr3-match-engine
git checkout player-fields -- src/matchEngine*.* src/verify*.js
git push -u origin pr3-match-engine

# PR4: Narrative
git checkout main
git checkout -b pr4-narrative-integration
git checkout player-fields -- src/narrative/ src/scripts/
git push -u origin pr4-narrative-integration

# PR5: UI Components
git checkout pr3-match-engine  # Build on fully integrated base
git checkout -b pr5-ui-components
git checkout player-fields -- src/components/ src/screens/
# Update App.tsx to use HomeScreen
git push -u origin pr5-ui-components
```

---

## Superseding PR #5

Once all 5 PRs are created and merged:
1. Close PR #5 with a comment explaining the split
2. Reference all 5 new PRs in the closing comment
3. Keep the player-fields branch for reference but mark as superseded

## Notes

- Each PR should compile and pass TypeScript checks
- Each PR should include only its specific scope
- Verification scripts can be run but are not required for basic compilation
- All PRs maintain the same functionality as the original PR #5 when combined
