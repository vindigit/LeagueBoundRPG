# LeagueBoundRPG

A single-player, text-based RPG simulation built on React Native that simulates the career of a basketball player from Middle School prospect to NBA legend.

## Overview

**Leaguebound** features a dynamic background simulation where the NBA Draft is occurring, colleges are recruiting, and the economy is shifting while you're still in 8th grade. You're not the center of the universe; you're a participant trying to carve out space in a living ecosystem.

This project merges "Spreadsheet Sim" gameplay (Basketball GM) with "Narrative RPG" elements (BitLife/New Star Soccer) using a Markov Chain-based match engine and inkjs for narrative storytelling.

For detailed requirements and implementation plan, see [PRD.md](./PRD.md).

## Features (Roadmap)

- **Dynamic World Simulation**: Background simulation of basketball leagues, drafts, and recruiting
- **Narrative-Driven Gameplay**: Ink-based narrative engine with choices that impact your career
- **Statistical Depth**: Markov Chain match engine with realistic player progression
- **Mobile-First**: Built with React Native for iOS and Android
- **Offline-First**: 100% offline gameplay with local data storage

## Tech Stack

- **Frontend**: React Native (0.74+)
- **Language**: TypeScript (Strict mode)
- **Narrative Engine**: inkjs
- **State Management**: MobX or Redux Toolkit (TBD)
- **Local Database**: WatermelonDB (SQLite) + MMKV

## Setup

### Prerequisites

- **Node.js 20.x** (required for CI, recommended for development)
  - Check version: `node --version`
  - Download: [https://nodejs.org](https://nodejs.org)
- npm or yarn
- React Native development environment (see [React Native docs](https://reactnative.dev/docs/environment-setup))

### Installation

```bash
# Clone the repository
git clone https://github.com/vindigit/LeagueBoundRPG.git
cd LeagueBoundRPG

# Install dependencies
npm install

# iOS setup (macOS only)
cd ios && pod install && cd ..
```

## Development

### Prerequisites

- Node.js 20.x (required for CI and recommended for development)
- npm
- React Native development environment (see [React Native docs](https://reactnative.dev/docs/environment-setup))

### Available Scripts

```bash
# Start Metro bundler
npm start

# Run on iOS simulator (macOS only)
npm run ios

# Run on Android emulator/device
npm run android

# Type check
npm run typecheck

# Run tests
npm test

# Lint code
npm run lint
```

### Quality Checks

This project uses automated quality checks to ensure code quality. All checks must pass before merging:

```bash
# Run all quality checks
npm run lint        # ESLint checks for code style and potential errors
npm run typecheck   # TypeScript type checking
npm run test        # Jest unit tests
```

**CI/CD:** These checks run automatically on every pull request via GitHub Actions. The CI workflow (`ci.yml`) enforces:
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Unit tests (Jest)

All checks must pass before a PR can be merged.

### Project Structure

```
LeagueBoundRPG/
├── src/
│   ├── engine/       # Match engine and simulation logic
│   ├── narrative/    # Ink scripts and narrative system
│   ├── models/       # Data models and types
│   └── app.tsx       # Main application entry point
├── tests/            # Test files
├── PRD.md            # Product Requirements Document
└── README.md         # This file
```

## Implementation Roadmap

### Phase 1 (Weeks 1-9)
1. **Week 1-2**: Setup React Native repo, integrate inkjs, build basic Attribute/State store
2. **Week 3-4**: Build Match Engine (Markov Chain) generic logic
3. **Week 5-6**: Build News Feed UI and hook up Match Engine
4. **Week 7-8**: Implement Middle School tutorial loop (4 games + 1 Ink script)
5. **Week 9**: Internal Alpha Test (Playable Tutorial)

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Use TypeScript strict mode
- Follow existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Branch Protection (Repository Maintainers)

To enforce quality checks on pull requests, enable branch protection for the `main` branch:

**Steps to enable branch protection:**

1. Go to the repository on GitHub
2. Navigate to: **Settings** → **Branches** → **Branch protection rules**
3. Click **Add rule**
4. Configure the rule:
   - **Branch name pattern**: `main`
   - Enable: ✅ **Require a pull request before merging**
   - Enable: ✅ **Require status checks to pass before merging**
   - Search for and select: `Quality Checks` (this is the job name from `.github/workflows/ci.yml`)
   - Optional but recommended:
     - ✅ **Require branches to be up to date before merging**
     - ✅ **Require conversation resolution before merging**
5. Click **Create** or **Save changes**

Once enabled, all PRs to `main` must pass the CI quality checks before merging.
- Ensure all tests pass before submitting PR

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Basketball GM, BitLife, and New Star Soccer
- Built with React Native and inkjs
