# Personality Fighter
2D fighting game with personality-driven combat system

## Tech Stack
- Phaser 3
- JavaScript (vanilla, can migrate to TypeScript later)
- Vite build system
- Mobile-first responsive design (works on desktop too)

## Current Status

### Phase 1: Personality Assessment System ✅ COMPLETE
- [x] **The Proving Grounds** - 6-scenario personality assessment
- [x] Observer character and dialogue system
- [x] HEXACO personality scoring algorithm
- [x] 8 ability class assignments (Paladin, Shadow Dancer, Tactician, Berserker, Elementalist, Warden, Trickster, Shapeshifter)
- [x] Results screen with class reveal and personality visualization

### Phase 2-7: Remaining Development
- [ ] Core Combat Mechanics (3 weeks)
- [ ] First 3 Ability Classes (2 weeks)
- [ ] Basic Game Modes (1 week)
- [ ] Remaining 5 Classes (3 weeks)
- [ ] Polish & Features (2 weeks)

## Quick Start (Windows 11)

### Prerequisites
- Node.js 16+ installed ([download here](https://nodejs.org/))
- Modern web browser (Chrome, Edge, Firefox)

### Installation & Running

**For Windows 11 (Recommended):**
```bash
# 1. Clone the repository
git clone https://github.com/sphilius/personality-fighter.git
cd personality-fighter

# 2. Install pnpm (better Windows compatibility)
npm install -g pnpm

# 3. Install dependencies
pnpm install

# 4. Start development server
pnpm run dev

# 5. Open your browser to http://localhost:5173
```

**For macOS/Linux:**
```bash
# 1. Clone the repository
git clone https://github.com/sphilius/personality-fighter.git
cd personality-fighter

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open your browser to http://localhost:5173
```

> **Note for Windows users:** Due to an npm bug with optional dependencies ([#4828](https://github.com/npm/cli/issues/4828)), we recommend using **pnpm** instead of npm on Windows. This avoids issues with the `@rollup/rollup-win32-x64-msvc` package.

### Controls (Desktop Testing)
- **Keyboard**: Use number keys 1, 2, 3 to select choices during assessment
- **Mouse**: Click on choice buttons
- Works best in fullscreen mode (F11)

### Building for Production
```bash
# Windows (using pnpm)
pnpm run build
pnpm run preview

# macOS/Linux (using npm)
npm run build
npm run preview
```

## What's Playable Now?

**The Proving Grounds Assessment** - Complete personality test that:
- Takes 5-7 minutes to complete
- Presents 6 unique scenarios with meaningful choices
- Tracks your decisions across HEXACO personality dimensions
- Assigns you one of 8 ability classes based on your personality
- Provides detailed breakdown of your personality profile

## Next Steps

See `complete_implementation_roadmap.md` for detailed Phase 2-7 implementation plan.

**Immediate next phase**: Core Combat Engine (hitboxes, state machines, AI, touch controls)

## Documentation
- `complete_implementation_roadmap.md` - Full development roadmap
- `personality_assessment_scenarios.md` - Detailed scenario specifications
- `Personality_Fighter_Design_Document.docx` - Original design document
