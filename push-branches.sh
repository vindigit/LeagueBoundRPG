#!/bin/bash

# This script pushes all 5 focused PR branches to GitHub origin
# Run this script from the repository root

set -e

echo "🚀 Pushing focused PR branches to GitHub..."
echo ""

# Push PR1: Scaffold/Platform
echo "📦 Pushing pr1-scaffold-platform..."
git push -u origin pr1-scaffold-platform
echo "✅ PR1 pushed"
echo ""

# Push PR2: Domain Model
echo "📊 Pushing pr2-domain-model..."
git push -u origin pr2-domain-model
echo "✅ PR2 pushed"
echo ""

# Push PR3: Match Engine
echo "🏀 Pushing pr3-match-engine..."
git push -u origin pr3-match-engine
echo "✅ PR3 pushed"
echo ""

# Push PR4: Narrative Integration
echo "📖 Pushing pr4-narrative-integration..."
git push -u origin pr4-narrative-integration
echo "✅ PR4 pushed"
echo ""

# Push PR5: UI Components
echo "🎨 Pushing pr5-ui-components..."
git push -u origin pr5-ui-components
echo "✅ PR5 pushed"
echo ""

echo "🎉 All branches pushed successfully!"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/vindigit/LeagueBoundRPG/pulls"
echo "2. Create 5 Pull Requests (see PR_CREATION_INSTRUCTIONS.md for details)"
echo "3. Add superseding comment to PR #5 and close it"
