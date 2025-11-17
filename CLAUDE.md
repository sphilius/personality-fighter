# CLAUDE.md - AI Assistant Guide for Personality Fighter
**Version:** 1.0
**Last Updated:** 2025-11-17
**For:** AI assistants (Claude, GPT, Gemini, etc.) working on this codebase

---

## Purpose of This Document

This file helps AI assistants understand the **Personality Fighter** codebase structure, development workflows, coding conventions, and project context. Read this FIRST before making any changes.

**Quick Links:**
- Project overview → [README.md](./README.md)
- Development roadmap → [complete_implementation_roadmap.md](./complete_implementation_roadmap.md)
- Current status → [UPDATES.md](./UPDATES.md)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Codebase Structure](#codebase-structure)
3. [Key Architectural Patterns](#key-architectural-patterns)
4. [Development Workflow](#development-workflow)
5. [Coding Conventions](#coding-conventions)
6. [Phaser 3 Specifics](#phaser-3-specifics)
7. [Testing Guidelines](#testing-guidelines)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)
10. [Do's and Don'ts](#dos-and-donts)

---

## Project Overview

### What is Personality Fighter?

A **2D fighting game** where players:
1. Take a HEXACO personality assessment ("The Proving Grounds")
2. Get assigned to one of 8 ability classes based on personality
3. Fight with class-specific movesets and abilities
4. Experience matchup advantages/disadvantages based on personality types

**Target Platform:** Mobile-first web app (responsive, works on desktop)
**Tech Stack:** Phaser 3, JavaScript (ES6+), Vite
**Current Phase:** Phase 2 (Combat Engine) - ~60% complete

### Core Unique Selling Point

**Personality psychology drives gameplay mechanics.** This is not just flavor - HEXACO scores determine:
- Which class you're assigned
- Your stats (HP, ATK, DEF, SPD)
- Your available moves
- Your matchup advantages against other classes

**Do not remove or undermine this connection** - it's what makes the game unique.

---

## Codebase Structure

### High-Level Architecture

```
personality-fighter/
├── src/                        # All source code
│   ├── index.js               # Game entry point (Phaser config)
│   ├── scenes/                # Phaser scenes (game states)
│   ├── combat/                # Combat system (fighters, states)
│   ├── systems/               # Game systems (personality scoring)
│   ├── ui/                    # Reusable UI components
│   └── data/                  # Game data (scenarios, classes)
├── public/                     # Static assets
│   └── assets/                # Images, sounds, spritesheets
├── dist/                       # Build output (gitignored)
├── node_modules/              # Dependencies (gitignored)
└── [config files]             # package.json, vite.config.js, etc.
```

### Source Code Breakdown (`src/`)

#### `src/index.js` (37 LOC)
**Purpose:** Phaser game initialization and configuration

**Key Responsibilities:**
- Create Phaser game instance
- Configure physics (Arcade with gravity)
- Set canvas size and scaling (1920×1080 logical, responsive scaling)
- Register all scenes
- Handle window resize events

**When to modify:**
- Adding new scenes (register in `scene` array)
- Changing game dimensions
- Adjusting physics settings

**Do NOT modify:**
- Core Phaser configuration unless you know what you're doing
- Scene order (BootScene must be first)

---

#### `src/scenes/` (6 scenes, 1,488 LOC)

Phaser uses a **scene-based architecture** - each scene is a self-contained game state.

| Scene | File | LOC | Purpose | Status |
|-------|------|-----|---------|--------|
| **BootScene** | `BootScene.js` | 168 | Asset loading, animations | ✅ Complete |
| **MainMenuScene** | `MainMenuScene.js` | 130 | Main menu | ✅ Complete |
| **IntroScene** | `IntroScene.js` | 187 | Observer intro | ✅ Complete |
| **AssessmentScene** | `AssessmentScene.js` | 263 | Personality test | ✅ Complete |
| **ResultsScene** | `ResultsScene.js` | 487 | Class reveal | ✅ Complete |
| **CombatTestScene** | `CombatTestScene.js` | 253 | Combat testing | 🔶 Functional |

**Scene Lifecycle:**
```javascript
class MyScene extends Phaser.Scene {
  preload() {
    // Load assets (runs once when scene starts)
  }

  create() {
    // Initialize scene objects (runs once after preload)
  }

  update(time, delta) {
    // Game loop (runs every frame, 60 FPS)
  }
}
```

**Scene Transitions:**
```javascript
// From any scene
this.scene.start('SceneKey'); // Stop current, start new
this.scene.launch('SceneKey'); // Run in parallel
this.scene.pause('SceneKey');
this.scene.resume('SceneKey');
```

**Important Scene Notes:**

1. **BootScene** is the **preloader** - all asset loading happens here
   - Spritesheets loaded with `this.load.spritesheet()`
   - Animations created in `createAnimations()`
   - Must complete before other scenes can use assets

2. **AssessmentScene** drives personality test
   - Uses `scenarios.js` data file
   - Tracks HEXACO scores in `this.scores` object
   - Passes final scores to ResultsScene via `data` parameter

3. **ResultsScene** uses PersonalityScorer to assign class
   - Receives scores from AssessmentScene
   - Calculates class assignment
   - Shows personality breakdown

4. **CombatTestScene** is for **development testing only**
   - Should be replaced by proper `FightScene` in Phase 2
   - Keyboard-only controls
   - Simplified UI

---

#### `src/combat/` (874 LOC)

**Core combat system** - state machine pattern for fighter behavior.

##### `Fighter.js` (330 LOC)

**Base class for all fighters** - extends `Phaser.GameObjects.Sprite`

**Key Properties:**
```javascript
{
  // Identity
  name: string,              // "Player", "Opponent", etc.
  fighterType: string,       // "generic", "paladin", etc.

  // Stats
  maxHP: number,             // Default 100
  currentHP: number,
  maxMeter: number,          // Default 100
  currentMeter: number,
  stats: {
    attack: number,          // Damage multiplier
    defense: number,         // Damage reduction
    speed: number            // Movement speed (px/s)
  },

  // Physics
  velocity: {x, y},          // Current velocity
  acceleration: number,      // px/s² (default 2200)
  gravity: number,           // px/s² (default 1500)
  jumpForce: number,         // Negative = upward (default -600)
  isGrounded: boolean,
  groundY: number,           // Y position of ground

  // State
  facingRight: boolean,
  isBlocking: boolean,
  isVulnerable: boolean,
  hitboxActive: boolean,

  // Systems
  stateMachine: FighterStateMachine
}
```

**Key Methods:**
```javascript
update(delta)              // Called every frame - apply physics, update state machine
attack(moveData)           // Perform attack (if can act)
startBlock()               // Begin blocking
stopBlock()                // End blocking
setMoveDirection(x)        // Set horizontal movement (-1, 0, 1)
jump()                     // Make fighter jump
takeDamage(damage, knockback) // Apply damage, transition to hit state
handleCollision(otherFighter) // Pushbox separation
gainMeter(amount)          // Add meter
spendMeter(amount)         // Use meter (returns success)
reset()                    // Reset for new round
```

**Important Fighter Notes:**

1. **Sprite Fallback:** If fighter spritesheet doesn't exist, uses colored rectangle
   ```javascript
   const hasTexture = scene.textures.exists(textureKey);
   super(scene, x, y, hasTexture ? textureKey : 'white');
   ```

2. **Physics are manual:** Not using Phaser Arcade bodies, custom velocity-based
   - Gravity applied in `update()`
   - Ground collision checked each frame
   - Velocity applied to position each frame

3. **State Machine controls behavior:** Don't manually set states
   ```javascript
   // ❌ BAD
   this.currentState = 'attacking';

   // ✅ GOOD
   this.stateMachine.transition('attacking', moveData);
   ```

4. **Damage calculation includes blocking:**
   ```javascript
   if (this.isBlocking) {
     finalDamage *= 0.5; // 50% reduction
   }
   ```

5. **KO triggers event:**
   ```javascript
   this.scene.events.emit('fighter-ko', this);
   ```

---

##### `FighterStateMachine.js` (122 LOC)

**Manages fighter behavior states** using State pattern.

**Available States:**
- `idle` - Standing still, can act
- `moving` - Walking left/right
- `attacking` - Performing attack (startup → active → recovery)
- `blocking` - Defensive stance
- `hit` - Taking damage (hitstun)
- `downed` - Knocked out

**Key Methods:**
```javascript
constructor(fighter)           // Initialize with fighter reference
transition(stateName, context) // Change state (validates transition)
forceTransition(stateName, context) // Change state (ignores validation)
update(delta)                  // Update current state
canAct()                       // Returns true if can perform action
isInState(stateName)           // Check current state
```

**State Transition Rules:**
```javascript
// Some transitions are blocked
attacking → attacking  // ❌ Can't attack during attack
hit → attacking        // ❌ Can't attack during hitstun
downed → anything      // ❌ Can't act when downed

// Force transitions bypass rules
forceTransition('hit', {...}) // ✅ Always works (for damage)
```

**Important State Machine Notes:**

1. **States are stateless classes** - they don't store data, just behavior
   ```javascript
   class IdleState extends State {
     enter(fighter, context) { /* setup */ }
     update(fighter, delta) { /* per-frame logic */ }
     exit(fighter, context) { /* cleanup */ }
   }
   ```

2. **Context object** passes data between states
   ```javascript
   this.stateMachine.transition('attacking', {
     name: 'Light Punch',
     damage: 10,
     frames: { startup: 5, active: 3, recovery: 7 }
   });
   ```

3. **Frame data drives timing:**
   - Startup frames: before hitbox activates
   - Active frames: hitbox is active
   - Recovery frames: after hitbox deactivates
   - Total frames @ 60 FPS = duration in ms ÷ 16.67

4. **Hitstun prevents action:**
   - HitState lasts for `hitstun` frames
   - Fighter cannot act during hitstun
   - Longer hitstun enables combos

---

##### `src/combat/states/` (7 state classes, 422 LOC)

Each state is a separate class extending `State.js`.

**State.js (47 LOC)** - Base class
```javascript
class State {
  enter(fighter, context) {}   // Called when entering state
  update(fighter, delta) {}     // Called every frame
  exit(fighter, context) {}     // Called when leaving state
}
```

**Key State Behaviors:**

| State | Enter | Update | Exit |
|-------|-------|--------|------|
| **IdleState** | Play idle animation | Check for jump input | - |
| **MovingState** | Play walk animation | Apply acceleration/deceleration | Stop velocity |
| **AttackingState** | Store move data | Track frame count, activate hitbox | Deactivate hitbox |
| **BlockingState** | Set `isBlocking = true` | Reduce velocity | Set `isBlocking = false` |
| **HitState** | Apply knockback, flash red | Count hitstun frames | Clear tint |
| **DownedState** | Play downed animation | Wait for recovery | - |

**Important State Notes:**

1. **AttackingState has phases:**
   ```javascript
   frameCount < startup → 'startup' (no hitbox)
   frameCount < startup + active → 'active' (hitbox on)
   frameCount < total → 'recovery' (hitbox off, can't cancel)
   ```

2. **MovingState updates facing direction:**
   ```javascript
   if (fighter.moveDirection.x > 0) {
     fighter.facingRight = true;
     fighter.setFlipX(false);
   }
   ```

3. **HitState is force-transitioned:**
   ```javascript
   // From Fighter.takeDamage()
   this.stateMachine.forceTransition('hit', {
     damage: finalDamage,
     hitstun: hitstun,
     knockback: knockback
   });
   ```

4. **States can play animations (if available):**
   ```javascript
   const animKey = `${fighter.fighterType}_idle`;
   if (fighter.anims && fighter.anims.exists(animKey)) {
     fighter.anims.play(animKey, true);
   }
   ```

---

#### `src/systems/` (213 LOC)

**Game systems** - reusable logic not tied to specific scenes.

##### `PersonalityScorer.js` (213 LOC)

**HEXACO personality scoring algorithm** - the core of the game's uniqueness.

**Key Responsibilities:**
1. Normalize raw scores (-12 to +12 → 0 to 100)
2. Assign ability class based on scores
3. Calculate confidence score (based on variance)
4. Provide class descriptions and themes

**HEXACO Dimensions:**
- **H** = Honesty-Humility
- **E** = Emotionality
- **X** = eXtraversion
- **A** = Agreeableness
- **C** = Conscientiousness
- **O** = Openness to Experience

**Class Assignment Logic:**
```javascript
// Decision tree approach
if (H >= 50 && E >= 50) return 'Paladin';      // High H+E = defender
if (H < 50 && O >= 50) return 'Shadow Dancer'; // Low H, high O = rogue
if (C >= 50 && E < 50) return 'Tactician';     // High C, low E = strategist
// ... etc for all 8 classes

// Fallback: Euclidean distance to class prototypes
const distances = ABILITY_CLASSES.map(cls =>
  euclideanDistance(scores, cls.prototype)
);
return closestMatch;
```

**8 Ability Classes:**

| Class | Personality Profile | Theme | Fighting Style |
|-------|-------------------|-------|----------------|
| **Paladin** | High H+E | Shield of the Innocent | Defensive tank |
| **Shadow Dancer** | Low H, High O | Walker of Hidden Paths | High mobility assassin |
| **Tactician** | High C, Low E | Master of Strategy | Zoning/control |
| **Berserker** | Low A, High X | Fury Unleashed | Aggressive glass cannon |
| **Elementalist** | High O+C | Wielder of Primal Forces | Long-range caster |
| **Warden** | High A+E | Keeper of Balance | All-rounder support |
| **Trickster** | Low H, High X | Breaker of Rules | Unpredictable mixups |
| **Shapeshifter** | High O, Low C | Master of Change | Adaptive stance-switching |

**Important PersonalityScorer Notes:**

1. **Do not change class assignments without reason** - they're based on psychology research
2. **Confidence score** indicates how clear-cut the assignment was
   ```javascript
   // High variance in scores = low confidence
   // Low variance = high confidence
   confidence = 100 - (variance / maxPossibleVariance * 100)
   ```
3. **Visual themes** are used for fighter colors/effects:
   ```javascript
   ABILITY_CLASSES.Paladin.theme = {
     primaryColor: 0xFFD700,    // Gold
     secondaryColor: 0xFFFFFF,  // White
     particleEffect: 'holy_light'
   }
   ```

---

#### `src/ui/` (225 LOC)

**Reusable UI components** - not tied to specific scenes.

##### `ChoiceButton.js` (172 LOC)

**Interactive button for assessment choices** - extends `Phaser.GameObjects.Container`

**Features:**
- Mobile gesture support (tap, swipe)
- Hover effects and animations
- Color coding by choice type (aggressive = red, cautious = blue, balanced = green)
- Auto-sizing text
- Keyboard shortcuts (1, 2, 3)

**Usage:**
```javascript
const button = new ChoiceButton(scene, x, y, choiceText, choiceData, callback);
scene.add.existing(button);
```

**Important ChoiceButton Notes:**

1. **Handles both mouse and touch:**
   ```javascript
   this.on('pointerdown', callback);  // Works for both
   ```
2. **Self-contained interaction logic** - don't add listeners externally
3. **Color comes from choice.impact:**
   ```javascript
   if (impact.H < 0 || impact.A < 0) return 0xff5555; // Aggressive
   if (impact.H > 0 || impact.A > 0) return 0x5555ff; // Cautious
   return 0x55ff55;                                    // Balanced
   ```

---

##### `DialogueBox.js` (53 LOC)

**Observer character dialogue display** - simple text box with typewriter effect.

**Features:**
- Centered text box
- Typewriter animation (1 character per 30ms)
- Auto-advances after completion
- Semi-transparent background

**Usage:**
```javascript
const dialogue = new DialogueBox(scene, text);
scene.add.existing(dialogue);
```

---

#### `src/data/` (Game Data)

**Data-driven design** - game content in separate files, not hardcoded.

##### `scenarios.js`

**6 personality assessment scenarios** - each tests 2 HEXACO dimensions.

**Structure:**
```javascript
{
  id: string,                    // Unique identifier
  title: string,                 // Scenario name
  context: string,               // Setup description
  situation: string,             // The dilemma
  choices: [                     // 3 choices
    {
      text: string,              // Choice description
      impact: { H: ±2, E: ±2, ... }, // HEXACO score changes
      feedback: string           // Observer's response
    }
  ]
}
```

**Example:**
```javascript
{
  id: 'artifact_theft',
  title: 'The Stolen Artifact',
  context: 'A priceless artifact has been stolen...',
  situation: 'You discover the thief. What do you do?',
  choices: [
    {
      text: 'Return it to authorities',
      impact: { H: +2, C: +2 },  // High honesty, conscientiousness
      feedback: 'You chose the lawful path.'
    },
    {
      text: 'Keep it for yourself',
      impact: { H: -2, X: +2 },  // Low honesty, high extraversion
      feedback: 'You seized an opportunity.'
    },
    {
      text: 'Sell it on black market',
      impact: { H: -2, O: +2 },  // Low honesty, high openness
      feedback: 'You walked a darker path.'
    }
  ]
}
```

**Important Scenarios Notes:**

1. **Each scenario must test exactly 2 dimensions** - this ensures balanced coverage
2. **Total 6 scenarios × 3 choices = 18 data points** - enough for reliable scoring
3. **Impact values are small (±2)** - scores accumulate across all scenarios
4. **Feedback is narrative** - Observer comments on your choice (adds flavor)

---

### Asset Structure (`public/assets/`)

```
public/assets/
└── fighters/
    ├── fighter_generic.png     # Generic fighter spritesheet (missing - using placeholders)
    ├── fighter_paladin.png     # Paladin spritesheet (missing)
    ├── fighter_shadow_dancer.png
    └── ... (other classes)
```

**Spritesheet Specification:**
- Format: PNG with transparency
- Size: 1024×1024 pixels
- Grid: 8 columns × 8 rows = 64 frames
- Frame size: 128×128 pixels each
- Naming: `fighter_{fighterType}.png`

**Animation Mapping:**
```
Row 0 (frames 0-7):   idle
Row 1 (frames 8-15):  walk
Row 2 (frames 16-23): light_attack
Row 3 (frames 24-31): heavy_attack
Row 4 (frames 32-39): block
Row 5 (frames 40-47): hit
Row 6 (frames 48-55): downed
Row 7 (frames 56-63): jump
```

**Current State:** All spritesheets missing - using colored rectangles as placeholders.

---

## Key Architectural Patterns

### 1. Scene-Based State Management

**Pattern:** Each major game state is a Phaser Scene
**Why:** Built-in to Phaser, handles lifecycle, asset management, input

**Example:**
```javascript
// Main menu
this.scene.start('MainMenuScene');

// After assessment complete
this.scene.start('ResultsScene', { scores: this.scores });

// Start fight
this.scene.start('FightScene', {
  playerClass: 'Paladin',
  opponentClass: 'Berserker'
});
```

---

### 2. State Machine Pattern (Combat)

**Pattern:** Fighter behavior controlled by state objects
**Why:** Clean separation of concerns, easy to add new states, prevents invalid transitions

**Implementation:**
```
Fighter
  └── FighterStateMachine
        ├── IdleState
        ├── MovingState
        ├── AttackingState
        ├── BlockingState
        ├── HitState
        └── DownedState
```

**Adding a new state:**
1. Create `NewState.js` extending `State`
2. Implement `enter()`, `update()`, `exit()`
3. Register in `FighterStateMachine.states` object
4. Add transition logic in `canTransition()`

---

### 3. Data-Driven Design

**Pattern:** Game content in data files, not code
**Why:** Easy to modify, no code changes needed for balance/content

**Examples:**
- Scenarios in `scenarios.js`
- Ability classes in `PersonalityScorer.js` (future: move to `abilityClasses.js`)
- Move data passed as objects to `attack()` method

**Adding new scenario:**
```javascript
// Just add to scenarios.js array
{
  id: 'new_scenario',
  title: 'New Scenario',
  context: '...',
  situation: '...',
  choices: [/* 3 choices */]
}
```

---

### 4. Component-Based UI

**Pattern:** Reusable UI elements as Phaser GameObjects
**Why:** DRY principle, consistent behavior, easy to maintain

**Examples:**
- `ChoiceButton` - used in AssessmentScene
- `DialogueBox` - used in IntroScene, ResultsScene

**Creating new component:**
```javascript
export default class MyComponent extends Phaser.GameObjects.Container {
  constructor(scene, x, y, options) {
    super(scene, x, y);
    // Add children (sprites, text, etc.)
    // Add interaction logic
  }
}
```

---

### 5. Event-Driven Communication

**Pattern:** Scenes/objects emit events instead of direct coupling
**Why:** Loose coupling, easier testing, more flexible

**Examples:**
```javascript
// Fighter emits KO event
this.scene.events.emit('fighter-ko', this);

// FightScene listens
this.events.on('fighter-ko', (fighter) => {
  this.handleRoundEnd(fighter);
});
```

**When to use events:**
- Cross-scene communication
- Fighter → Scene communication
- UI → Scene communication

**When NOT to use events:**
- Parent → child (use direct method calls)
- Synchronous operations (use return values)

---

## Development Workflow

### Setting Up Dev Environment

**Prerequisites:**
- Node.js 16+ installed
- Modern web browser (Chrome, Edge, Firefox)
- Code editor (VS Code recommended)

**Installation:**
```bash
# Clone repository
git clone https://github.com/sphilius/personality-fighter.git
cd personality-fighter

# Install dependencies (use pnpm on Windows for better compatibility)
npm install        # or: pnpm install

# Start dev server
npm run dev        # or: pnpm run dev

# Open http://localhost:5173
```

**Development Server:**
- Vite dev server with hot module replacement (HMR)
- Changes auto-reload in browser
- Port 5173 by default
- Exposes to network (test on mobile via IP)

---

### Git Workflow

**Branch Strategy:**
- `main` - production-ready code
- `feature/*` - feature branches
- `claude/*` - AI agent work branches

**Current Development Branch:**
- `claude/document-repo-status-01AqsBe589eBum5gRUmoaAeg`

**Workflow:**
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ... edit files ...

# Commit (descriptive messages)
git add .
git commit -m "Implement AI opponent decision-making system"

# Push to remote
git push -u origin feature/my-feature

# Create PR when ready (via GitHub web UI)
```

**Commit Message Convention:**
```
# Good
"Add virtual joystick for mobile controls"
"Fix animation bug in AttackingState"
"Implement Paladin class with unique moveset"

# Bad
"updates"
"fix"
"WIP"
```

---

### Building for Production

```bash
# Build
npm run build      # Creates dist/ folder

# Preview build
npm run preview    # Test production build locally

# Deploy
# Upload dist/ to:
# - Netlify (drag & drop)
# - GitHub Pages (gh-pages branch)
# - itch.io (zip dist/ folder)
# - Vercel (auto-deploy from GitHub)
```

**Build Output:**
- `dist/index.html` - entry point
- `dist/assets/` - bundled JS, CSS, images
- Minified and optimized (terser)
- Ready to deploy

---

### Testing Workflow

**Current State:** No automated tests (manual testing only)

**Manual Testing Checklist:**

**Phase 1 (Assessment):**
- [ ] Can complete all 6 scenarios without errors
- [ ] Each choice registers correctly (check console logs)
- [ ] Results screen shows correct class assignment
- [ ] Personality breakdown matches expected scores
- [ ] Works on mobile (touch inputs)

**Phase 2 (Combat):**
- [ ] Fighters spawn correctly
- [ ] Movement works (keyboard: WASD)
- [ ] Attacks connect (J = light, K = heavy)
- [ ] Blocking reduces damage (hold L)
- [ ] HP decreases correctly
- [ ] KO triggers when HP = 0
- [ ] Round restarts (R key)

**Cross-Browser Testing:**
- Chrome (primary target)
- Firefox
- Safari (iOS/macOS)
- Edge

**Device Testing:**
- Desktop (1920×1080)
- Tablet (iPad, 768×1024)
- Mobile (iPhone, Android 360×640)

---

### Debugging

**Browser DevTools:**
```javascript
// Phaser debug logging (already enabled)
console.log(`Fighter "${this.name}" created at (${x}, ${y})`);

// Check game state
console.log(this.scene.scene.key); // Current scene name
console.log(this.stateMachine.currentState.constructor.name); // Current state
```

**Common Debugging Steps:**

1. **Scene not loading:**
   - Check BootScene completed (assets loaded)
   - Verify scene registered in `index.js`
   - Check console for errors

2. **Animation not playing:**
   - Verify spritesheet loaded in BootScene
   - Check animation created (`this.anims.create()`)
   - Confirm texture key matches (`fighter_${fighterType}`)
   - If missing, falls back to colored rectangle (expected)

3. **Fighter not responding:**
   - Check state machine (might be in hit/downed state)
   - Verify `update()` being called
   - Console log input events

4. **Physics acting weird:**
   - Check gravity (1500 px/s²)
   - Verify `delta` in milliseconds (not seconds)
   - Console log velocity values

**Phaser DevTools Plugin:**
```javascript
// Add to index.js for visual debugging
game.config.plugins = {
  scene: [
    { key: 'PhaserDebugPlugin', plugin: PhaserDebugPlugin, mapping: 'debug' }
  ]
};
```

---

## Coding Conventions

### JavaScript Style

**ES6+ Features:**
```javascript
// ✅ Use modern syntax
import Fighter from './Fighter.js';
export default class MyClass {}
const arrow = () => {};
const { x, y } = position;
const combined = { ...defaults, ...overrides };

// ❌ Avoid old syntax
var x = 5;
function oldStyle() {}
```

**Naming Conventions:**
```javascript
// Classes: PascalCase
class FighterStateMachine {}

// Files: match class name
FighterStateMachine.js

// Constants: UPPER_SNAKE_CASE
const MAX_HEALTH = 100;

// Variables/functions: camelCase
let currentHealth = 100;
function takeDamage() {}

// Private (convention): _prefix
_internalMethod() {}

// Phaser scenes: PascalCase + "Scene"
class AssessmentScene extends Phaser.Scene {}
```

**File Organization:**
```javascript
// 1. Imports
import Phaser from 'phaser';
import Fighter from './Fighter.js';

// 2. Constants
const GRAVITY = 1500;

// 3. Class definition
export default class MyClass {
  constructor() {}

  // Public methods
  publicMethod() {}

  // Private methods
  _privateMethod() {}
}

// 4. Exports (if multiple)
export { GRAVITY, MyClass };
```

---

### Comments

**What to comment:**
```javascript
// ✅ Why, not what
// Apply defense mitigation to balance damage across classes
const mitigatedDamage = damage - (this.defense * 0.5);

// ✅ Complex logic
// Use Euclidean distance as fallback when no clear decision tree match
const distance = Math.sqrt(/* ... */);

// ✅ TODOs
// TODO: Replace with actual sprite when asset ready

// ❌ Obvious code
// Set x to 5
const x = 5;
```

**JSDoc (recommended but not enforced):**
```javascript
/**
 * Apply damage to fighter
 * @param {number} damage - Raw damage amount
 * @param {Object} knockback - Knockback vector {x, y}
 * @returns {number} - Actual damage taken (after mitigation)
 */
takeDamage(damage, knockback = { x: 0, y: 0 }) {
  // ...
}
```

---

### Error Handling

**Graceful Degradation:**
```javascript
// ✅ Check before using
if (this.anims && this.anims.exists(animKey)) {
  this.anims.play(animKey);
}

// ✅ Fallback values
const texture = scene.textures.exists(key) ? key : 'white';

// ✅ Helpful error messages
if (!moveData.damage) {
  console.error('Attack missing damage value:', moveData);
  return false;
}
```

**Don't crash silently:**
```javascript
// ❌ Silent failure
if (!this.fighter) return;

// ✅ Log the issue
if (!this.fighter) {
  console.error('Fighter not initialized in state machine!');
  return;
}
```

---

### Phaser-Specific Conventions

**Scene Methods:**
```javascript
// Use Phaser's built-in methods
this.add.sprite(x, y, texture);      // Add sprite
this.physics.add.body(sprite);       // Add physics (if needed)
this.time.delayedCall(1000, fn);     // Delayed execution
this.tweens.add({ ... });            // Animations

// Access scene properties
this.cameras.main                    // Main camera
this.input.keyboard                  // Keyboard input
this.scene.start('OtherScene')       // Scene transition
```

**Sprite Extensions:**
```javascript
// Extend Phaser classes, don't wrap them
class Fighter extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, texture);
    scene.add.existing(this); // Register with scene
  }
}
```

---

## Phaser 3 Specifics

### Scene Lifecycle

**Order of Operations:**
```
1. constructor()       // Scene created
2. init(data)          // Receive data from previous scene
3. preload()           // Load assets (BootScene only)
4. create()            // Initialize scene objects
5. update(time, delta) // Game loop (60 FPS)
   ↓ (repeated every frame)
6. shutdown()          // Scene stopped
7. destroy()           // Scene destroyed
```

**Important Notes:**
- `preload()` only in BootScene (centralized asset loading)
- `create()` runs once, `update()` runs every frame
- `delta` is milliseconds since last frame (~16.67 ms @ 60 FPS)
- `time` is total elapsed time since game start

---

### Coordinate System

**Phaser uses screen coordinates:**
```
(0, 0) = Top-left corner
X increases → right
Y increases ↓ down

Game configured as:
Width: 1920 pixels
Height: 1080 pixels

Ground level typically: y = 880 (height - 200)
```

**Origins:**
```javascript
sprite.setOrigin(0.5, 0.5);  // Center (default)
sprite.setOrigin(0.5, 1);    // Bottom-center (fighters use this)
sprite.setOrigin(0, 0);      // Top-left
```

---

### Input Handling

**Keyboard:**
```javascript
// In create()
this.keys = {
  w: this.input.keyboard.addKey('W'),
  space: this.input.keyboard.addKey('SPACE')
};

// In update() - check held
if (this.keys.w.isDown) {
  // W is being held
}

// One-time press
this.keys.space.on('down', () => {
  // Spacebar pressed
});
```

**Touch/Mouse:**
```javascript
// On sprite
sprite.setInteractive();
sprite.on('pointerdown', () => {
  // Clicked/tapped
});

// Scene-wide
this.input.on('pointerdown', (pointer) => {
  console.log(pointer.x, pointer.y);
});
```

---

### Animations

**Creating Animations (in BootScene):**
```javascript
this.anims.create({
  key: 'fighter_idle',           // Unique key
  frames: this.anims.generateFrameNumbers('fighter_generic', {
    start: 0,                    // Frame 0
    end: 7                       // Frame 7
  }),
  frameRate: 10,                 // 10 FPS
  repeat: -1                     // Loop forever
});
```

**Playing Animations:**
```javascript
sprite.anims.play('fighter_idle', true); // Force restart
sprite.anims.play('fighter_walk');       // Play if not already
```

---

### Physics (Arcade)

**Note:** This game uses **custom physics**, not Phaser's Arcade bodies (for more control).

**If you need Arcade physics:**
```javascript
// Enable for sprite
this.physics.add.existing(sprite);

// Access body
sprite.body.setVelocity(100, 200);
sprite.body.setGravityY(300);
sprite.body.setCollideWorldBounds(true);

// Collisions
this.physics.add.collider(sprite1, sprite2, callback);
```

**Current Implementation:**
- Manual velocity (`this.velocity.x`, `this.velocity.y`)
- Manual gravity application in `update()`
- Manual collision detection in `handleCollision()`

---

## Testing Guidelines

### What to Test

**Phase 1 (Assessment):**
1. All 6 scenarios display correctly
2. All 18 choices (6 × 3) work
3. Scores accumulate correctly
4. Class assignment matches expected personality
5. Results screen shows correct data
6. Mobile touch works

**Phase 2 (Combat):**
1. Fighters spawn and display
2. Movement (left, right, jump)
3. Attacks (light, heavy)
4. Blocking (damage reduction)
5. Damage calculation (defense mitigation)
6. HP/Meter updates
7. KO detection
8. Round system

**Future Phases:**
1. Each class feels distinct
2. Matchup advantages work (30% damage difference)
3. AI provides appropriate challenge
4. Touch controls responsive
5. 60 FPS maintained
6. No crashes in 50+ matches

---

### How to Test

**Local Testing:**
```bash
# Start dev server
npm run dev

# Open browser console (F12)
# Check for errors (red text)
# Check console.log output (state transitions, damage, etc.)

# Test on mobile:
# 1. Find local IP (ipconfig/ifconfig)
# 2. Open http://YOUR_IP:5173 on phone
# 3. Same network required
```

**Manual Test Cases:**

**Test Case: Fighter Takes Damage**
```
1. Start CombatTestScene
2. Press O (damage opponent)
3. Expected: Red fighter HP decreases, flashes red, enters hit state
4. Verify: Console logs damage amount
5. Verify: Fighter recovers after hitstun
```

**Test Case: Blocking Reduces Damage**
```
1. Start CombatTestScene
2. Hold L (block)
3. Press O (damage opponent)
4. Expected: Damage reduced to 50%
5. Verify: Console log shows "blocked!"
```

**Test Case: KO Triggers Round End**
```
1. Start CombatTestScene
2. Press O repeatedly until opponent HP = 0
3. Expected: "Opponent KO!" message appears
4. Verify: Round can restart with R
```

---

## Common Tasks

### Task: Add a New Scene

**Steps:**
1. Create scene file
   ```javascript
   // src/scenes/NewScene.js
   import Phaser from 'phaser';

   export default class NewScene extends Phaser.Scene {
     constructor() {
       super({ key: 'NewScene' });
     }

     create() {
       // Initialize scene
     }

     update(time, delta) {
       // Game loop
     }
   }
   ```

2. Register in `src/index.js`
   ```javascript
   import NewScene from './scenes/NewScene.js';

   const config = {
     scene: [
       BootScene,
       MainMenuScene,
       NewScene,  // Add here
       // ...
     ]
   };
   ```

3. Transition to scene
   ```javascript
   this.scene.start('NewScene');
   ```

---

### Task: Add a New Fighter State

**Steps:**
1. Create state file
   ```javascript
   // src/combat/states/NewState.js
   import State from './State.js';

   export default class NewState extends State {
     enter(fighter, context) {
       console.log(`${fighter.name} entered new state`);
       // Setup
     }

     update(fighter, delta) {
       // Per-frame logic
     }

     exit(fighter, context) {
       // Cleanup
     }
   }
   ```

2. Register in `FighterStateMachine.js`
   ```javascript
   import NewState from './states/NewState.js';

   this.states = {
     idle: new IdleState(),
     // ...
     newState: new NewState()
   };
   ```

3. Add transition logic
   ```javascript
   canTransition(from, to) {
     if (to === 'newState' && from === 'downed') {
       return false; // Can't transition from downed
     }
     // ...
   }
   ```

4. Transition to state
   ```javascript
   fighter.stateMachine.transition('newState', { /* context */ });
   ```

---

### Task: Add a New Ability Class

**Steps:**
1. Define class data
   ```javascript
   // In PersonalityScorer.js or future abilityClasses.js
   {
     name: 'NewClass',
     description: '...',
     stats: {
       hp: 100,
       attack: 10,
       defense: 10,
       speed: 5
     },
     moves: {
       lightAttack: { /* ... */ },
       heavyAttack: { /* ... */ },
       specialMove: { /* ... */ },
       superMove: { /* ... */ }
     },
     passive: {
       name: 'Passive Ability',
       description: '...',
       effect: { /* ... */ }
     },
     theme: {
       primaryColor: 0xFF0000,
       secondaryColor: 0x00FF00
     },
     prototype: { H: 50, E: 50, X: 50, A: 50, C: 50, O: 50 }
   }
   ```

2. Add to class assignment logic
   ```javascript
   // In PersonalityScorer.js
   if (/* personality condition */) {
     return 'NewClass';
   }
   ```

3. Create spritesheet
   - Follow ASSET_GENERATION_GUIDE.md
   - Place in `public/assets/fighters/fighter_newclass.png`

4. Add animations in BootScene
   ```javascript
   // In BootScene.createAnimations()
   this.createFighterAnimations('newclass');
   ```

---

### Task: Add a New Scenario

**Steps:**
1. Add to `src/data/scenarios.js`
   ```javascript
   {
     id: 'new_scenario',
     title: 'The New Scenario',
     context: 'Setup description...',
     situation: 'The dilemma...',
     choices: [
       {
         text: 'Choice 1',
         impact: { H: +2, E: -2 },
         feedback: 'Observer response...'
       },
       {
         text: 'Choice 2',
         impact: { X: +2, A: -2 },
         feedback: 'Observer response...'
       },
       {
         text: 'Choice 3',
         impact: { C: +2, O: -2 },
         feedback: 'Observer response...'
       }
     ]
   }
   ```

2. Test in AssessmentScene (auto-loads from scenarios array)

---

### Task: Modify Fighter Stats/Behavior

**Stats:**
```javascript
// In Fighter.js constructor
this.stats = {
  attack: 15,    // Increase damage
  defense: 5,    // Reduce damage mitigation
  speed: 800     // Faster movement
};

this.acceleration = 3000;  // Faster acceleration
this.jumpForce = -700;     // Higher jumps
```

**Frame Data:**
```javascript
// When calling attack()
fighter.attack({
  name: 'Light Attack',
  damage: 10,
  frames: {
    startup: 3,   // Faster startup (was 5)
    active: 5,    // Longer active (was 3)
    recovery: 5   // Faster recovery (was 7)
  }
});
```

**Balance Testing:**
- Startup too fast → feels spammy
- Startup too slow → feels unresponsive
- Active too long → hard to punish
- Recovery too long → can't combo

**Rule of thumb (@ 60 FPS):**
- Light attack: 15 frames total (~250ms)
- Heavy attack: 30 frames total (~500ms)
- Special: 40-50 frames total (~700ms)

---

## Troubleshooting

### Common Issues

**Issue: "Cannot find module 'phaser'"**
```bash
# Solution: Install dependencies
npm install
```

**Issue: Black screen on load**
```
# Check browser console for errors
# Common causes:
1. BootScene not loading assets
2. Scene key typo
3. Missing import

# Fix:
- Verify BootScene registered first
- Check console.log in create()
- Confirm all imports have .js extension
```

**Issue: Animations not playing**
```javascript
// Debug steps:
1. Check spritesheet loaded:
   console.log(this.textures.exists('fighter_generic'));

2. Check animation created:
   console.log(this.anims.exists('fighter_idle'));

3. Check playing:
   sprite.on('animationstart', (anim) => {
     console.log('Playing:', anim.key);
   });

// Common causes:
- Spritesheet missing (expected - uses fallback)
- Animation key typo
- Frame range wrong
```

**Issue: Fighter not moving**
```javascript
// Debug steps:
1. Check state:
   console.log(fighter.stateMachine.currentState.constructor.name);

2. Check velocity:
   console.log(fighter.velocity);

3. Check input:
   console.log('Move direction:', fighter.moveDirection.x);

// Common causes:
- In hit/downed state (can't act)
- Velocity not being applied
- Input not registering
```

**Issue: Damage not working**
```javascript
// Debug steps:
1. Check hitbox active:
   console.log(fighter.hitboxActive);

2. Check damage call:
   console.log('Damage:', damage, 'Knockback:', knockback);

3. Check HP:
   console.log('HP:', fighter.currentHP, '/', fighter.maxHP);

// Common causes:
- Hitbox not active (wrong attack phase)
- Not calling takeDamage()
- isVulnerable = false
```

**Issue: Mobile touch not working**
```javascript
// Debug steps:
1. Check if interactive:
   sprite.setInteractive();

2. Test pointer events:
   this.input.on('pointerdown', (pointer) => {
     console.log('Touch at:', pointer.x, pointer.y);
   });

3. Check device:
   console.log('Is touch:', this.input.touch.enabled);

// Common causes:
- Not calling setInteractive()
- Z-index issues (other object blocking)
- Touch events disabled in browser
```

---

### Performance Issues

**Symptom: Low FPS (<60)**

**Debug:**
```javascript
// Add to update()
if (this.time.now % 1000 < 16) {  // Every ~1 second
  console.log('FPS:', this.game.loop.actualFps);
}
```

**Common Causes:**
1. Too many particles
2. Too many sprites
3. Large textures
4. Heavy calculations in update()

**Solutions:**
1. Reduce particle count
2. Object pooling for sprites
3. Compress/resize textures
4. Move calculations to create() or cache results

**Profiling:**
```javascript
// Measure performance
const start = performance.now();
// ... expensive operation ...
const end = performance.now();
console.log('Took:', end - start, 'ms');
```

---

### Vite Build Issues

**Issue: Build fails**
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build

# Check for:
- Syntax errors
- Missing imports
- Import paths (must include .js extension)
```

**Issue: Assets not loading in production**
```javascript
// Ensure assets in public/ folder
// Access without /public prefix:
this.load.image('key', '/assets/image.png');  // ✅
this.load.image('key', 'assets/image.png');   // ✅
this.load.image('key', '/public/assets/image.png');  // ❌
```

---

## Do's and Don'ts

### ✅ DO

1. **Follow the roadmap** - stick to phased development
2. **Test incrementally** - verify each change before moving on
3. **Use console.log liberally** - debugging is easier with output
4. **Commit often** - small, focused commits
5. **Check existing code first** - don't duplicate functionality
6. **Preserve personality → gameplay link** - it's the USP
7. **Graceful degradation** - work without assets
8. **Mobile-first** - test touch/responsive
9. **Comment complex logic** - future you will thank you
10. **Ask before major changes** - discuss architecture shifts

---

### ❌ DON'T

1. **Don't change personality algorithm without reason** - it's psychologically grounded
2. **Don't hardcode data** - use data files
3. **Don't skip BootScene** - assets must load first
4. **Don't modify state directly** - use state machine transitions
5. **Don't use Phaser Arcade bodies** - custom physics implemented
6. **Don't assume sprites exist** - always check texture
7. **Don't break existing tests** - Phase 1 should always work
8. **Don't add dependencies lightly** - keep bundle small
9. **Don't remove console.logs in dev** - helpful for debugging
10. **Don't optimize prematurely** - get it working first

---

## Project-Specific Guidelines

### Personality Assessment System (Phase 1)

**This is complete and working - do not break it.**

**If you must modify:**
1. Test ALL 6 scenarios
2. Verify class assignments still work
3. Check mobile touch support
4. Ensure no regressions

**Common mistakes:**
- Changing HEXACO scoring ranges (breaks class assignment)
- Modifying scenario impacts without rebalancing
- Breaking Observer dialogue timing

---

### Combat System (Phase 2)

**This is in progress - incomplete but functional.**

**Current priorities:**
1. AI opponent system (Task 2.4)
2. Match UI (Task 2.5)
3. Touch controls (Task 2.2)
4. Complete match flow (Task 2.6)

**When adding combat features:**
1. Test with CombatTestScene first
2. Verify state transitions work
3. Check frame data timing (60 FPS)
4. Ensure both fighters behave correctly

**Common mistakes:**
- Forgetting to update both fighters
- Breaking state machine transitions
- Incorrect frame data math (frames vs milliseconds)
- Not handling edge cases (e.g., both fighters KO simultaneously)

---

### Asset Pipeline

**Current state:** No assets - using placeholders

**When adding assets:**
1. Follow ASSET_GENERATION_GUIDE.md specifications
2. Place in `public/assets/fighters/`
3. Name: `fighter_{fighterType}.png`
4. Format: 1024×1024, 8×8 grid, 128px frames
5. Test: Load in BootScene, verify animations

**Don't:**
- Rely on assets existing (always fallback)
- Use non-standard sizes (breaks grid)
- Forget transparency (PNG alpha required)

---

## Additional Resources

### Documentation
- [Phaser 3 Docs](https://photonstorm.github.io/phaser3-docs/)
- [Phaser Examples](https://phaser.io/examples)
- [Vite Docs](https://vitejs.dev/)

### In This Repository
- `README.md` - Project overview, setup instructions
- `complete_implementation_roadmap.md` - Full 7-phase plan
- `UPDATES.md` - Current status, what's done/todo
- `ASSET_GENERATION_GUIDE.md` - AI sprite generation guide
- `personality_assessment_scenarios.md` - Scenario design specs

### External
- HEXACO personality model: https://hexaco.org/
- Fighting game frame data: https://glossary.infil.net/

---

## Quick Reference

### File Paths
```
Fighter class:           src/combat/Fighter.js
State machine:           src/combat/FighterStateMachine.js
States:                  src/combat/states/*.js
Personality scoring:     src/systems/PersonalityScorer.js
Scenarios:               src/data/scenarios.js
Main menu:               src/scenes/MainMenuScene.js
Assessment:              src/scenes/AssessmentScene.js
Combat test:             src/scenes/CombatTestScene.js
Game config:             src/index.js
```

### Key Constants
```javascript
// Game dimensions
WIDTH: 1920
HEIGHT: 1080

// Fighter stats (default)
HP: 100
METER: 100
ATTACK: 10
DEFENSE: 10
SPEED: 600

// Physics
GRAVITY: 1500 px/s²
JUMP_FORCE: -600 px/s
ACCELERATION: 2200 px/s²
MAX_FALL_SPEED: 800 px/s

// Frame data (typical)
LIGHT_ATTACK: 15 frames (250ms)
HEAVY_ATTACK: 30 frames (500ms)
HITSTUN: 10-40 frames based on damage

// Spritesheet
SIZE: 1024×1024 px
GRID: 8×8 (64 frames)
FRAME_SIZE: 128×128 px
```

### Common Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
git status           # Check git status
git log --oneline    # View commits
git diff             # View changes
```

---

## Version History

**v1.0 (2025-11-17)**
- Initial CLAUDE.md creation
- Documented current state (Phase 1 complete, Phase 2 partial)
- Covered all major systems and patterns

**Future updates:**
- Add after Phase 2 complete (AI, UI, touch controls)
- Add after Phase 3 complete (ability classes)
- Update as architecture evolves

---

## Contact & Support

**Repository:** https://github.com/sphilius/personality-fighter
**Issues:** https://github.com/sphilius/personality-fighter/issues
**Primary Developer:** sphilius

**For AI Assistants:**
If you're unsure about something:
1. Check this file (CLAUDE.md)
2. Check UPDATES.md for current status
3. Check existing code for patterns
4. Ask the user before major architectural changes

**Philosophy:**
> "Make it work, make it right, make it fast - in that order."
> - Kent Beck

Focus on getting features working first, then refine. The codebase is designed for iteration and improvement.

---

**End of CLAUDE.md**

*Last updated: 2025-11-17 by Claude (Sonnet 4.5)*
