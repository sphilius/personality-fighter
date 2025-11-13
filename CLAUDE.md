# CLAUDE.md - AI Assistant Guide for Personality Fighter

## Project Overview

**Personality Fighter** is a 2D fighting game where personality traits determine combat abilities. Players take a HEXACO personality assessment that assigns them to one of 8 ability classes, each with unique fighting styles.

**Current Status**: Phase 1 Complete (Personality Assessment System)
**Next Phase**: Phase 2 (Core Combat Engine)
**Tech Stack**: Phaser 3, JavaScript, Vite
**Platform**: Mobile-first (touch controls), desktop compatible
**Repository**: https://github.com/sphilius/personality-fighter

---

## Architecture Overview

### Game Flow
```
BootScene (asset loading)
    ↓
MainMenuScene (menu options)
    ↓
IntroScene (Observer introduction)
    ↓
AssessmentScene (6 HEXACO scenarios)
    ↓
ResultsScene (class assignment reveal)
    ↓
CombatTestScene (fighting game - in development)
```

### Directory Structure
```
personality-fighter/
├── src/
│   ├── index.js                    # Phaser game initialization
│   ├── scenes/                     # Game scenes (Phaser Scene classes)
│   │   ├── BootScene.js           # Asset loading
│   │   ├── MainMenuScene.js       # Main menu
│   │   ├── IntroScene.js          # Introduction
│   │   ├── AssessmentScene.js     # Personality test
│   │   ├── ResultsScene.js        # Class reveal
│   │   └── CombatTestScene.js     # Combat system test
│   ├── combat/                     # Fighting game systems
│   │   ├── Fighter.js             # Base fighter class
│   │   ├── FighterStateMachine.js # State management
│   │   └── states/                # Fighter states
│   │       ├── State.js           # Base state class
│   │       ├── IdleState.js
│   │       ├── MovingState.js
│   │       ├── AttackingState.js
│   │       ├── BlockingState.js
│   │       ├── HitState.js
│   │       └── DownedState.js
│   ├── systems/                    # Game systems
│   │   └── PersonalityScorer.js   # HEXACO → Ability Class mapping
│   ├── ui/                         # UI components
│   │   ├── DialogueBox.js
│   │   └── ChoiceButton.js
│   └── data/
│       └── scenarios.js            # Assessment scenario data
├── public/
│   └── assets/                     # Game assets (images, sprites)
│       └── fighters/               # Fighter spritesheets (future)
├── index.html                      # Entry point
├── vite.config.js                  # Vite build configuration
├── package.json
├── README.md                       # User-facing documentation
├── complete_implementation_roadmap.md  # Phase 2-7 development plan
├── ASSET_GENERATION_GUIDE.md      # Spritesheet generation guide
└── personality_assessment_scenarios.md # Scenario specifications
```

---

## Core Systems

### 1. Personality Assessment System (✅ Complete)

**File**: `src/systems/PersonalityScorer.js`

**HEXACO Model**: 6 personality dimensions
- **H**: Honesty-Humility
- **E**: Emotionality
- **X**: eXtraversion
- **A**: Agreeableness
- **C**: Conscientiousness
- **O**: Openness to Experience

**8 Ability Classes**:
1. **Paladin**: High H+E (protective, compassionate)
2. **Shadow Dancer**: Low H + High O (cunning, agile)
3. **Tactician**: High C + Low E (strategic, logical)
4. **Berserker**: Low A + High X (aggressive, fearless)
5. **Elementalist**: High O+C (mastery, control)
6. **Warden**: High A+E (nurturing, balanced)
7. **Trickster**: Low H + High X (mischievous, bold)
8. **Shapeshifter**: High O + Low C (fluid, adaptive)

**Scoring Algorithm**:
- 6 scenarios × 3 choices each
- Each choice affects 2-3 HEXACO dimensions (±1 or ±2)
- Scores range: -12 to +12 per dimension
- Normalized to 0-100 scale (50 = neutral)
- Decision tree maps HEXACO profile to closest class
- Fallback: Euclidean distance in 6D HEXACO space

### 2. Fighter State Machine (⚙️ In Development)

**File**: `src/combat/FighterStateMachine.js`

**State Pattern Implementation**:
```javascript
States:
- Idle: Default resting state
- Moving: Walking left/right
- Attacking: Executing attack move
- Blocking: Defensive stance (damage reduction)
- Hit: Taking damage (hitstun)
- Downed: Knocked out (KO)
```

**State Transitions**:
- States validate transitions (can't attack while downed)
- Input buffering: Queue next action during recovery
- Force transitions for damage/KO (bypass validation)

**Frame Data**:
- 60 FPS (16.67ms per frame)
- Each state tracks frame count
- Moves have: startup, active, recovery frames
- Example: Light attack = 5 startup + 3 active + 7 recovery = 15 frames (250ms)

### 3. Fighter System

**File**: `src/combat/Fighter.js`

**Core Properties**:
```javascript
{
  name: 'Fighter',
  fighterType: 'generic', // 'paladin', 'berserker', etc.
  maxHP: 100,
  currentHP: 100,
  maxMeter: 100,
  currentMeter: 0,
  stats: {
    attack: 10,
    defense: 10,
    speed: 600
  },
  // Physics
  velocity: { x: 0, y: 0 },
  gravity: 1500,
  jumpForce: -600,
  groundY: 880,
  isGrounded: true,
  // State
  facingRight: true,
  isBlocking: false,
  isVulnerable: true,
  hitboxActive: false
}
```

**Key Methods**:
- `update(delta)`: Physics, state machine, constraints
- `attack(moveData)`: Execute attack move
- `startBlock()` / `stopBlock()`: Toggle blocking
- `takeDamage(damage, knockback)`: Apply damage, transition to hit state
- `jump()`: Apply jump force if grounded
- `handleCollision(otherFighter)`: Push fighters apart (pushboxes)
- `reset()`: Reset for new round

**Damage Calculation**:
```javascript
finalDamage = damage - (defense * 0.5)
if (blocking) finalDamage *= 0.5
hitstun = min(40, 10 + floor(damage / 5))
meterGain = damage * 0.3
```

### 4. Scene System

**Phaser Scene Lifecycle**:
1. `constructor()`: Initialize scene key
2. `preload()`: Load assets (BootScene only)
3. `create()`: Set up scene objects, UI, event listeners
4. `update(time, delta)`: Called every frame (60 FPS)

**Scene Transitions**:
```javascript
this.scene.start('SceneName'); // Stop current, start new
this.scene.switch('SceneName'); // Keep current, start new
this.scene.launch('SceneName'); // Run parallel scene
```

---

## Development Conventions

### Code Style

**File Naming**:
- Classes: PascalCase (e.g., `FighterStateMachine.js`)
- Scenes: PascalCase with "Scene" suffix (e.g., `CombatTestScene.js`)
- Data files: camelCase (e.g., `scenarios.js`)

**Code Structure**:
```javascript
// 1. Imports
import Phaser from 'phaser';
import Fighter from '../combat/Fighter.js';

// 2. Class definition with JSDoc
/**
 * ClassName - Brief description
 * Detailed explanation if needed
 */
export default class ClassName extends BaseClass {
  constructor(params) {
    super(params);
    // Properties
  }

  // Public methods
  publicMethod() {
    // Implementation
  }

  // Private methods (by convention, not enforced)
  _privateMethod() {
    // Implementation
  }
}
```

**Logging Conventions**:
- Console logs for state transitions: `console.log('Transitioned: idle → attacking')`
- Console logs for important events: `console.log('Fighter "Player" created at (300, 880)')`
- Warnings for invalid operations: `console.warn('State "invalid" does not exist')`
- Keep logs concise and informative

### Phaser-Specific Patterns

**Coordinate System**:
- Origin: (0, 0) is top-left
- Resolution: 1920×1080 (scales to fit)
- Ground Y: 880 (200 pixels from bottom)
- Fighter origin: (0.5, 1) = bottom-center anchor

**Display Objects**:
```javascript
// Creating sprites
this.add.sprite(x, y, textureKey);
this.add.rectangle(x, y, width, height, color);
this.add.text(x, y, 'content', styleObject);

// Common methods
.setOrigin(x, y)        // Anchor point (0-1 range)
.setScale(scale)        // Uniform scale
.setDisplaySize(w, h)   // Set display dimensions
.setTint(0xRRGGBB)      // Color tint
.setFlipX(boolean)      // Mirror horizontally
.destroy()              // Remove from scene
```

**Input Handling**:
```javascript
// Keyboard
this.keys = {
  w: this.input.keyboard.addKey('W')
};
this.keys.w.on('down', () => { /* action */ });
this.keys.w.isDown; // Check current state

// Touch (future)
this.input.on('pointerdown', (pointer) => {
  const x = pointer.x;
  const y = pointer.y;
});
```

**Animations**:
```javascript
// Create animation (in BootScene)
this.anims.create({
  key: 'generic_idle',
  frames: this.anims.generateFrameNumbers('fighter_generic', {
    start: 0,
    end: 7
  }),
  frameRate: 8,
  repeat: -1 // Loop forever
});

// Play animation
this.anims.play('generic_idle');
```

### State Machine Pattern

**Creating States**:
```javascript
// Extend base State class
export default class CustomState extends State {
  enter(fighter, data) {
    // Called when entering state
    // Set up animations, flags, timers
  }

  update(fighter, delta) {
    // Called every frame
    // Handle state logic
  }

  exit(fighter) {
    // Called when leaving state
    // Clean up
  }

  canTransitionTo(stateName) {
    // Return true if transition is allowed
    return ['idle', 'moving'].includes(stateName);
  }
}
```

**Frame-Based Timing**:
```javascript
this.frameCount = 0; // Initialize in enter()

update(fighter, delta) {
  this.frameCount++;

  // Startup phase
  if (this.frameCount <= this.startupFrames) {
    // Preparing attack
  }
  // Active phase
  else if (this.frameCount <= this.startupFrames + this.activeFrames) {
    fighter.hitboxActive = true; // Hitbox active
  }
  // Recovery phase
  else if (this.frameCount <= this.totalFrames) {
    fighter.hitboxActive = false;
  }
  // Done
  else {
    fighter.stateMachine.transition('idle');
  }
}
```

---

## Current Implementation Status

### ✅ Phase 1: Personality Assessment (COMPLETE)
- [x] 6 HEXACO scenarios
- [x] DialogueBox and ChoiceButton UI
- [x] Observer character
- [x] Personality scoring algorithm
- [x] 8 ability class assignments
- [x] Results screen with visualization

### ⚙️ Phase 2: Core Combat Engine (IN PROGRESS)
- [x] Fighter state machine (6 states)
- [x] Basic fighter physics (movement, gravity, jumping)
- [x] Health and meter system
- [x] Damage calculation with blocking
- [x] Body collision (pushboxes)
- [x] KO detection and round end
- [ ] Touch control system
- [ ] Hitbox/hurtbox collision detection
- [ ] AI opponent system
- [ ] Complete match flow (rounds, timer)
- [ ] Camera system

**Next Tasks** (see `complete_implementation_roadmap.md`):
1. Task 2.2: Touch Control System (6 hours)
2. Task 2.3: Combat Physics & Hitboxes (10 hours)
3. Task 2.4: Basic AI Opponent (8 hours)
4. Task 2.5: Health, Meter & Round System (6 hours)
5. Task 2.6: Match Scene Integration (8 hours)

### 📋 Phase 3-7: Remaining Development
- Phase 3: First 3 Classes (Paladin, Shadow Dancer, Berserker)
- Phase 4: Basic Game Modes (Arcade, Training, Versus)
- Phase 5: Remaining 5 Classes
- Phase 6: Polish & Features
- Phase 7: Advanced Features (Online multiplayer, etc.)

---

## Development Workflow

### Running the Game

```bash
# Install dependencies (Windows 11: use pnpm)
pnpm install

# Start development server
pnpm run dev

# Open browser to http://localhost:5173

# Build for production
pnpm run build
pnpm run preview
```

### Git Workflow

**Branch Naming**:
- Feature: `claude/feature-name-<session-id>`
- Current branch: `claude/claude-md-mhxu77dqvasfmpg7-011qu9bKJ3ob1DsVDQTsM72V`

**Commit Messages**:
- Format: `<type>: <concise description>`
- Types: `feat`, `fix`, `refactor`, `docs`, `test`, `style`
- Examples:
  - `feat: Add touch control system for mobile`
  - `fix: Prevent fighters from overlapping`
  - `refactor: Extract collision logic to separate system`

**Push Workflow**:
```bash
# Stage changes
git add <files>

# Commit with descriptive message
git commit -m "feat: implement hitbox collision detection"

# Push to feature branch
git push -u origin <branch-name>

# Retry with exponential backoff if network fails
# (2s, 4s, 8s, 16s delays)
```

**Important**:
- NEVER push to main/master without explicit permission
- Always develop on designated feature branches
- Branch names MUST start with `claude/` and end with session ID
- Commit frequently with clear messages

### Testing

**Combat Test Scene**:
```
Access: Main Menu → "COMBAT TEST"

Controls (Desktop):
- A/D: Move left/right
- W: Jump
- J: Light attack (10 dmg)
- K: Heavy attack (25 dmg)
- L: Block (hold)
- Space: Test self-damage
- O: Damage opponent
- R: Restart round

What to Test:
- State transitions (watch right-side debug info)
- Attack animations and hitboxes
- Blocking damage reduction
- Knockback on hit
- KO detection (HP reaches 0)
- Round restart
- Frame data accuracy
```

**Debug Logging**:
- State transitions logged to console
- Fighter creation logged
- Damage events logged
- Check browser DevTools Console (F12)

---

## Key Design Principles

### 1. Mobile-First Design
- Touch controls are primary input method
- UI elements large and readable (min 44×44px touch targets)
- Resolution: 1920×1080 scaled to fit
- Portrait and landscape support

### 2. State Machine for Clarity
- All fighter behavior through state machine
- No direct state manipulation
- States validate their own transitions
- Input buffering for responsive feel

### 3. Data-Driven Design
- Fighter stats in data files, not hardcoded
- Ability classes defined in `ABILITY_CLASSES` object (future)
- Scenarios in `scenarios.js`
- Easy to add new classes/moves without code changes

### 4. Frame-Perfect Timing
- 60 FPS target
- Frame-based timers (not milliseconds)
- Consistent physics across devices
- Delta time used for smooth interpolation

### 5. Phaser Best Practices
- Scene-based architecture
- Game objects added to scene with `this.add.*`
- Physics bodies managed by Phaser
- Animations defined in BootScene
- Event-driven communication between systems

---

## Common Tasks for AI Assistants

### Task 1: Adding a New Fighter State

1. Create state file: `src/combat/states/NewState.js`
2. Extend `State` base class
3. Implement `enter()`, `update()`, `exit()`, `canTransitionTo()`
4. Import in `FighterStateMachine.js`
5. Add to `this.states` object
6. Test transition from existing states

### Task 2: Adding a New Ability Class

1. Define class data in `src/data/abilityClasses.js`:
   - Stats (hp, atk, def, spd)
   - Moves (light, heavy, special, super)
   - Passive ability
   - Visual theme
   - Matchups
2. Update `PersonalityScorer.mapToAbilityClass()` decision tree
3. Add archetype profile to `findClosestMatch()`
4. Add description to `getClassDescription()`
5. Add colors to `getClassColors()`
6. Create fighter spritesheet (see `ASSET_GENERATION_GUIDE.md`)
7. Test in Combat Test Scene

### Task 3: Adding a New Scene

1. Create file: `src/scenes/NewScene.js`
2. Extend `Phaser.Scene`
3. Implement:
   ```javascript
   constructor() { super({ key: 'NewScene' }); }
   create() { /* Set up scene */ }
   update(time, delta) { /* Update loop */ }
   ```
4. Import in `src/index.js`
5. Add to `scene` array in Phaser config
6. Transition from another scene: `this.scene.start('NewScene')`

### Task 4: Implementing Hit Detection

1. Get hitbox from attacker's current move
2. Get hurtbox from defender
3. Check rectangle overlap:
   ```javascript
   Phaser.Geom.Rectangle.Overlaps(hitbox, hurtbox)
   ```
4. If overlap:
   - Call `defender.takeDamage(damage, knockback)`
   - Attacker gains meter: `attacker.gainMeter(damage * 0.5)`
   - Apply hitstun to defender
   - Apply frame advantage/disadvantage

### Task 5: Creating Touch Controls

1. Divide screen: left 40% = movement, right 60% = actions
2. Virtual joystick (left):
   - Graphics.fillCircle for base and knob
   - Track pointer distance from center
   - Convert to direction vector
   - Update fighter.setMoveDirection()
3. Gesture recognition (right):
   - Tap = light attack
   - Swipe up = heavy attack
   - Swipe down = block
   - Double tap = special
4. Multi-touch support: track pointer IDs
5. Visual feedback: Show touch indicators

---

## Troubleshooting

### Common Issues

**Issue**: Animations not playing
- **Cause**: Animation not created in BootScene, or texture missing
- **Fix**: Check BootScene.create() for animation definitions
- **Debug**: `console.log(this.anims.exists('animation_key'))`

**Issue**: Fighter falls through ground
- **Cause**: groundY position incorrect or gravity too strong
- **Fix**: Verify `this.groundY = 880` and `gravity = 1500`
- **Debug**: Log fighter.y and fighter.isGrounded

**Issue**: State transitions not working
- **Cause**: Current state's `canTransitionTo()` returns false
- **Fix**: Check state transition rules
- **Debug**: Log `stateMachine.getCurrentState()` and attempted transition

**Issue**: Hitboxes not connecting
- **Cause**: Hitbox not active during correct frames, or collision detection missing
- **Fix**: Verify `fighter.hitboxActive = true` during attack active frames
- **Debug**: Enable hitbox visualization (draw rectangles)

**Issue**: Inputs feel laggy
- **Cause**: Input buffering not working, or frame data too long
- **Fix**: Implement queued transitions in state machine
- **Reduce**: Startup frames for faster response

### Debug Tools

**Console Logging**:
```javascript
console.log(`Fighter: ${this.name}`);
console.log(`State: ${this.stateMachine.getCurrentState()}`);
console.log(`HP: ${this.currentHP}/${this.maxHP}`);
console.log(`Frame: ${this.stateMachine.currentState.frameCount}`);
```

**Visual Debug**:
```javascript
// Draw hitboxes
const graphics = this.add.graphics();
graphics.lineStyle(2, 0xff0000); // Red outline
graphics.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);

// Draw hurtboxes
graphics.lineStyle(2, 0x00ff00); // Green outline
graphics.strokeRect(hurtbox.x, hurtbox.y, hurtbox.width, hurtbox.height);
```

**Performance Monitoring**:
```javascript
// Enable in Phaser config
physics: {
  default: 'arcade',
  arcade: {
    debug: true // Shows physics bodies
  }
}

// FPS counter
const fpsText = this.add.text(10, 10, 'FPS: 60', { color: '#fff' });
this.time.addEvent({
  delay: 100,
  callback: () => {
    fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
  },
  loop: true
});
```

---

## Resources

### Internal Documentation
- `README.md` - User-facing setup and features
- `complete_implementation_roadmap.md` - Phase 2-7 detailed tasks
- `ASSET_GENERATION_GUIDE.md` - Spritesheet creation with AI
- `personality_assessment_scenarios.md` - Scenario specifications
- Design documents (`.docx` files) - Original game design

### External Resources
- [Phaser 3 API Docs](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://phaser.io/examples)
- [HEXACO Personality Model](https://hexaco.org/)
- [Fighting Game Glossary](https://glossary.infil.net/)

### Asset Tools
- [Gemini 2.5 Flash](https://gemini.google.com/) - AI asset generation
- [Aseprite](https://www.aseprite.org/) - Sprite editing
- [GIMP](https://www.gimp.org/) - Free image editing

---

## AI Assistant Guidelines

### When Working on This Project

**DO**:
- ✅ Read this file first to understand architecture
- ✅ Check `complete_implementation_roadmap.md` for current phase
- ✅ Follow existing code patterns and conventions
- ✅ Add console logs for debugging
- ✅ Test changes in Combat Test Scene
- ✅ Update this file if architecture changes
- ✅ Ask for clarification if requirements are unclear
- ✅ Commit frequently with clear messages
- ✅ Check existing state machine states before adding new ones

**DON'T**:
- ❌ Push to main/master branch
- ❌ Change core architecture without discussion
- ❌ Remove console logs (they're for debugging)
- ❌ Skip testing after changes
- ❌ Use `var` (use `const`/`let`)
- ❌ Mutate fighter state directly (use state machine)
- ❌ Hardcode values (use data files)
- ❌ Create circular dependencies between files

### Code Quality Checklist

Before committing:
- [ ] Code follows existing patterns
- [ ] Console logs are informative
- [ ] No syntax errors (check console)
- [ ] Tested in browser (Combat Test Scene)
- [ ] State machine transitions work correctly
- [ ] No performance issues (60 FPS maintained)
- [ ] Commit message is clear and descriptive

### Communication

When reporting progress:
- Describe what was implemented
- Note any issues encountered
- Suggest next steps
- Highlight any architectural decisions made

When asking questions:
- Reference specific files and line numbers
- Explain what you've tried
- Describe expected vs actual behavior

---

## Version History

**v0.1.0** - Phase 1 Complete
- Personality assessment system (6 scenarios)
- HEXACO scoring algorithm
- 8 ability class assignments
- Results screen with class reveal

**Current** - Phase 2 In Progress
- Fighter state machine (6 states)
- Basic fighter physics
- Health and meter system
- Damage calculation
- Combat Test Scene

---

## Contact & Support

**Repository**: https://github.com/sphilius/personality-fighter
**Issues**: https://github.com/sphilius/personality-fighter/issues

For AI assistants: This file is your source of truth. Trust the architecture described here. When in doubt, refer to existing code patterns in the codebase.

**Last Updated**: 2025-11-13
**Current Branch**: `claude/claude-md-mhxu77dqvasfmpg7-011qu9bKJ3ob1DsVDQTsM72V`
**Current Phase**: Phase 2 (Core Combat Engine)
