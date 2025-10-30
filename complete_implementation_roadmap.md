# Complete Implementation Roadmap: Personality Fighter
## From Assessment to Full Fighting Game

---

## CURRENT STATE: Phase 1 Complete ✅

**What You Have After Assessment System:**
- Working personality test (6 scenarios)
- Class assignment algorithm
- Observer character & dialogue system
- Mobile-optimized Phaser setup
- Git workflow established
- 8 ability classes designed (specs only)

**Playable?** No - assessment works but no actual fighting yet

---

## ROADMAP OVERVIEW

### Critical Path to Minimum Viable Game (MVP)
**Total Time:** 6-8 weeks part-time | **Your Direction:** ~30 hours | **Agent Work:** ~120 hours

```
Phase 1: Assessment System ✅ (2 weeks) - COMPLETE
    ↓
Phase 2: Core Combat Engine (3 weeks) - NEXT
    ↓
Phase 3: First 3 Classes (2 weeks)
    ↓
Phase 4: Basic Game Modes (1 week)
    ↓
MVP LAUNCH: Playable fighting game with personality-based matchmaking
    ↓
Phase 5: Remaining 5 Classes (3 weeks)
    ↓
Phase 6: Polish & Features (2 weeks)
    ↓
Phase 7: Advanced Features (ongoing)
```

### Phases by Priority (Pareto)

**Phase 2 (CRITICAL):** Core combat - 60% of remaining work, 80% of value  
**Phase 3 (HIGH):** 3 classes working - 20% of work, 15% of value  
**Phase 4 (HIGH):** Basic modes - 10% of work, 4% of value  
**Phase 5 (MEDIUM):** All 8 classes - 15% of work, 3% of value  
**Phase 6-7 (LOW):** Polish & extras - 15% of work, 2% of value

---

## PHASE 2: CORE COMBAT ENGINE (CRITICAL)
**Duration:** 3 weeks part-time  
**Your Time:** 10-12 hours direction  
**Agent Time:** 40-50 hours implementation  
**Goal:** Working fighting game with placeholder characters

### What This Delivers
After Phase 2, you can:
- Control a fighter with touch controls
- Attack, block, dodge
- Take and deal damage
- Win/lose matches
- Fight against basic AI

**This is the HARD part** - get this right and the rest is repetition.

---

### Task 2.1: Fighter State Machine (Week 1)
**Priority:** CRITICAL | **Time:** 8 hours (Jules) + 2 hours (you)

**What to Build:**
```
FighterStateMachine with 6 core states:
├── Idle
├── Moving (left, right, jump)
├── Attacking (light, heavy, special)
├── Blocking
├── Hit (taking damage)
└── Downed (knocked out)
```

**Implementation:**
```javascript
// src/systems/FighterStateMachine.js
class FighterStateMachine {
  states = {
    idle: new IdleState(),
    moving: new MovingState(),
    attacking: new AttackingState(),
    blocking: new BlockingState(),
    hit: new HitState(),
    downed: new DownedState()
  };
  
  // State transitions with validation
  transition(newState, context) {
    if (!this.canTransition(this.currentState, newState)) {
      return false;
    }
    this.currentState.exit(context);
    this.currentState = this.states[newState];
    this.currentState.enter(context);
  }
}
```

**Jules Prompt:**
```
Build a FighterStateMachine for a 2D fighting game.

REQUIREMENTS:
1. Six states: Idle, Moving, Attacking, Blocking, Hit, Downed
2. Each state has: enter(), update(), exit() methods
3. State transition validation (can't attack while downed)
4. Frame data tracking (how long in each state)
5. Animation triggers on state changes
6. Mobile touch input integration

TECHNICAL:
- Based on State pattern (clean separation)
- Frame-perfect timing (60 FPS)
- Support for canceling moves (spend meter)
- Input buffering (queue next move during current)

DELIVERABLE: Working state machine that logs transitions clearly.
```

**Testing:**
- Can transition through all states
- Invalid transitions blocked (can't attack while downed)
- Frame data accurate (attack lasts 20 frames = 333ms)
- Input buffering works (queue next move)

---

### Task 2.2: Touch Control System (Week 1)
**Priority:** CRITICAL | **Time:** 6 hours (Jules) + 1.5 hours (you)

**What to Build:**
```
Mobile touch controls for fighting:
├── Left side: Movement (virtual joystick)
├── Right side: Actions
│   ├── Tap = Light attack
│   ├── Swipe up = Heavy attack
│   ├── Swipe down = Block
│   └── Double tap = Special move
└── Gestures recognized in real-time
```

**Design Considerations:**
- **Virtual joystick:** Left 40% of screen, semi-transparent
- **Action zone:** Right 60% of screen, invisible but reactive
- **Gesture threshold:** Minimum 50px movement to register swipe
- **Multi-touch:** Support simultaneous move + attack

**Jules Prompt:**
```
Implement mobile touch controls for a 2D fighter.

REQUIREMENTS:
1. Virtual joystick (left side, 8-direction)
   - Visual feedback (joystick knob position)
   - Smooth character movement
   - Return to center when released

2. Action gestures (right side)
   - Single tap: Light attack
   - Swipe up: Heavy attack (upward motion)
   - Swipe down: Block
   - Double tap: Special move (< 300ms between taps)
   - Hold: Charge move (future)

3. Technical specs:
   - 60 FPS responsive
   - No input lag (< 50ms)
   - Visual feedback on all actions
   - Prevent accidental inputs (dead zones)
   - Works in portrait and landscape

4. Keyboard fallback for desktop testing
   - WASD: Movement
   - J/K/L: Attacks
   - Space: Block

DELIVERABLE: Working controls that feel responsive on mobile.
```

**Testing:**
- Joystick movement smooth
- All gestures detected accurately
- No ghost inputs (touch release = stop action)
- Visual feedback clear
- Works on actual phone

---

### Task 2.3: Combat Physics & Hitboxes (Week 1)
**Priority:** CRITICAL | **Time:** 10 hours (Jules) + 2 hours (you)

**What to Build:**
```
Combat collision system:
├── Hitboxes (attack areas)
├── Hurtboxes (vulnerable areas)
├── Pushboxes (character collision)
├── Hit detection (overlap checking)
├── Damage calculation
└── Knockback system
```

**Key Concepts:**
```javascript
class Fighter {
  hitboxes = {
    // Active during attack frames 5-10
    lightPunch: { x: 50, y: -30, width: 60, height: 40, damage: 10 },
    heavyKick: { x: 70, y: 0, width: 80, height: 50, damage: 25 }
  };
  
  hurtbox = {
    // Always active (body vulnerable area)
    x: 0, y: -80, width: 60, height: 160
  };
  
  pushbox = {
    // Prevents fighters overlapping
    x: 0, y: -80, width: 60, height: 160
  };
}
```

**Frame Data:**
```
Light Attack:
- Startup: 5 frames (83ms)
- Active: 3 frames (50ms) - hitbox active
- Recovery: 7 frames (117ms)
- Total: 15 frames (250ms)
- On hit: +2 frame advantage
- On block: -1 frame disadvantage

Heavy Attack:
- Startup: 12 frames (200ms)
- Active: 5 frames (83ms)
- Recovery: 15 frames (250ms)
- Total: 32 frames (533ms)
- On hit: Knockdown
- On block: -8 (very punishable)
```

**Jules Prompt:**
```
Build the combat physics system for a 2D fighter.

REQUIREMENTS:
1. Hitbox/Hurtbox system:
   - Fighters have hurtboxes (always vulnerable)
   - Attacks create hitboxes (only during active frames)
   - Check overlap each frame
   - Visual debug mode (draw boxes in red/green)

2. Damage calculation:
   - Base damage from move
   - Apply defense stat reduction
   - Check for counter-hit (extra damage if opponent attacking)
   - Apply type advantage (from personality matchup system)

3. Hit reactions:
   - Hitstun (victim can't act for X frames)
   - Blockstun (reduced hitstun if blocking)
   - Knockback (push opponent back on hit)
   - Knockdown (heavy attacks)

4. Frame data system:
   - Each move has startup, active, recovery frames
   - Track current frame of animation
   - Hitboxes only active during "active" frames
   - Frame advantage calculation

5. Collision prevention:
   - Fighters can't overlap (pushboxes)
   - Edge of screen collision
   - Juggle prevention (can't combo after knockdown)

TECHNICAL:
- Use Phaser's arcade physics initially
- 60 FPS frame-perfect timing
- Visual debug overlay for testing
- Log all hits with frame data

DELIVERABLE: Two fighters can hit each other with accurate damage/knockback.
```

**Testing:**
- Attacks connect when hitbox overlaps hurtbox
- Damage numbers accurate
- Frame data matches specs (15 frames = 250ms)
- Blocking reduces damage
- Knockback looks natural
- Debug overlay shows hitboxes clearly

---

### Task 2.4: Basic AI Opponent (Week 2)
**Priority:** HIGH | **Time:** 8 hours (Jules) + 2 hours (you)

**What to Build:**
```
Three AI difficulty levels:
├── Beginner (reaction time: 500ms, random attacks)
├── Intermediate (reaction time: 300ms, basic combos)
└── Advanced (reaction time: 150ms, reads patterns)
```

**AI Behavior System:**
```javascript
class FighterAI {
  // Decision tree runs every 100ms
  makeDecision(gameState) {
    const distance = this.getDistance(opponent);
    const opponentState = opponent.stateMachine.currentState;
    
    // Priority hierarchy
    if (this.health < 30 && this.meter >= 50) {
      return 'useSuper'; // Desperate situation
    }
    
    if (opponentState === 'attacking' && this.canBlock()) {
      return 'block'; // Defensive
    }
    
    if (distance < 100 && this.canAttack()) {
      return this.chooseAttack(distance); // Offensive
    }
    
    if (distance > 200) {
      return 'moveForward'; // Close distance
    }
    
    return 'idle'; // Default
  }
  
  chooseAttack(distance) {
    if (distance < 50) return 'lightAttack'; // Fast, safe
    if (distance < 100) return 'heavyAttack'; // Committal
    return 'specialMove'; // Range attack
  }
}
```

**Jules Prompt:**
```
Build an AI opponent system for a 2D fighter.

REQUIREMENTS:
1. Three difficulty levels (beginner, intermediate, advanced)

2. Beginner AI:
   - Reaction time: 500ms (humans see action, then AI reacts)
   - Random attack selection
   - Basic blocking (blocks 30% of attacks)
   - Never uses special moves
   - Walks forward until in range

3. Intermediate AI:
   - Reaction time: 300ms
   - Basic combos (light → heavy)
   - Smart blocking (blocks 60% of attacks)
   - Uses special moves occasionally
   - Maintains optimal distance

4. Advanced AI:
   - Reaction time: 150ms (near-human)
   - Full combos
   - Reads player patterns (punishes repeated moves)
   - Perfect blocking (70% success)
   - Uses meter strategically
   - Baits and punishes

5. Decision-making:
   - Distance-based strategy (close = light attacks, far = special)
   - Health-based aggression (low health = desperate)
   - Meter management (saves for comebacks)
   - Anti-spam detection (if player spams move X, AI counters)

TECHNICAL:
- Decision loop runs every 100ms (not every frame)
- Weighted random for move selection
- Reaction delay simulates human response time
- AI should feel fair, not frame-perfect

DELIVERABLE: Three AI opponents with distinct personalities.
```

**Testing:**
- Beginner AI beatable by new players
- Intermediate AI challenges average players
- Advanced AI punishes mistakes
- AI doesn't feel robotic (some randomness)
- AI doesn't just block everything (boring)

---

### Task 2.5: Health, Meter & Round System (Week 2)
**Priority:** HIGH | **Time:** 6 hours (Jules) + 1.5 hours (you)

**What to Build:**
```
Match management:
├── Health bars (both fighters)
├── Meter gauge (special move resource)
├── Timer (90 seconds per round)
├── Round system (best of 3)
├── Victory/defeat conditions
└── Round transitions
```

**Meter System:**
```javascript
class MeterSystem {
  current = 0;
  max = 100;
  
  // Gain meter from actions
  onDealDamage(damage) {
    this.current += damage * 0.5; // 50% of damage dealt
  }
  
  onTakeDamage(damage) {
    this.current += damage * 0.3; // 30% of damage taken
  }
  
  onBlock() {
    this.current += 2; // Small reward for defense
  }
  
  // Spend meter
  useSpecialMove(cost = 25) {
    if (this.current >= cost) {
      this.current -= cost;
      return true;
    }
    return false;
  }
  
  useSuper(cost = 100) {
    if (this.current >= 100) {
      this.current = 0;
      return true;
    }
    return false;
  }
}
```

**Jules Prompt:**
```
Implement the match management system (health, meter, rounds).

REQUIREMENTS:
1. Health system:
   - Both fighters start at 100 HP
   - Health bars at top of screen (mirrored)
   - Smooth animations when health changes
   - Color coding: Green > 50%, Yellow 25-50%, Red < 25%
   - Health persists between rounds

2. Meter system:
   - Starts at 0 each round
   - Builds from: dealing damage (50%), taking damage (30%), blocking (2%)
   - Max 100 meter
   - Meter bar below health bar
   - Glows when full (can use super)
   - Special moves cost 25 meter
   - Super move costs 100 meter (full bar)

3. Timer:
   - 90 seconds per round
   - Displayed center-top
   - Counts down
   - When timer hits 0: Fighter with more HP wins
   - Flashes red at 10 seconds

4. Round system:
   - Best of 3 rounds to win match
   - Round indicators: "Round 1", "Round 2", "Round 3"
   - Between rounds: 2 second pause
   - Winner announced after match

5. Victory conditions:
   - KO: Reduce opponent to 0 HP
   - Timeout: Higher HP when timer expires
   - Perfect: Win without taking damage (bonus)

TECHNICAL:
- UI scales for mobile (large, readable)
- Health bar animations smooth (tween, not instant)
- Round transitions feel ceremonious
- Timer pauses during round transitions

DELIVERABLE: Complete match flow from start to victory/defeat.
```

**Testing:**
- Health bars accurate
- Meter gains correctly from all sources
- Timer counts down properly
- Rounds transition smoothly
- Match ends when victory condition met
- Can play full 3-round match

---

### Task 2.6: Match Scene Integration (Week 3)
**Priority:** HIGH | **Time:** 8 hours (Jules) + 2 hours (you)

**What to Build:**
```
Complete FightScene that ties everything together:
├── Fighter spawning & positioning
├── Input handling (both fighters)
├── State machine updates
├── Collision detection
├── UI rendering
├── Camera system
└── Pause menu
```

**Scene Structure:**
```javascript
class FightScene extends Phaser.Scene {
  create() {
    // 1. Initialize fighters
    this.player = new Fighter(this, 300, 500, 'Paladin');
    this.opponent = new Fighter(this, 1620, 500, 'Berserker');
    
    // 2. Set up combat systems
    this.collisionSystem = new CollisionSystem(this.player, this.opponent);
    this.ai = new FighterAI(this.opponent, 'intermediate');
    
    // 3. Create UI
    this.ui = new MatchUI(this);
    
    // 4. Input handling
    this.controls = new TouchControls(this);
    
    // 5. Camera
    this.setupCamera();
    
    // 6. Start first round
    this.startRound(1);
  }
  
  update(time, delta) {
    // Update fighters
    this.player.update(delta);
    this.opponent.update(delta);
    
    // AI decision-making
    this.ai.update(delta);
    
    // Check collisions
    this.collisionSystem.update();
    
    // Update UI
    this.ui.update();
    
    // Camera follow
    this.updateCamera();
    
    // Check win conditions
    this.checkVictory();
  }
}
```

**Jules Prompt:**
```
Create the FightScene that brings all combat systems together.

REQUIREMENTS:
1. Scene setup:
   - Spawn two fighters at opposite sides
   - Initialize combat systems (state machines, collision, AI)
   - Set up UI (health, meter, timer, round counter)
   - Configure camera

2. Update loop:
   - Update both fighters (state machines, animations)
   - Run AI decision-making for opponent
   - Check collisions (hits, blocks, pushboxes)
   - Update UI elements
   - Camera follows action
   - Check victory conditions

3. Camera system:
   - Keeps both fighters visible
   - Zooms in when fighters close
   - Zooms out when fighters far apart
   - Smooth interpolation (not jarring)
   - Never cuts off fighters at screen edges

4. Round flow:
   - "Round 1... FIGHT!" announcement
   - Both fighters active
   - Round ends on KO or timeout
   - "Player Wins!" or "Opponent Wins!"
   - 2 second pause
   - Next round starts (if match not over)
   - Match victory screen (best of 3)

5. Pause menu:
   - Pause button (top-right)
   - Resume, Restart, Quit options
   - Game frozen while paused

6. Debug features:
   - Toggle hitbox visualization (dev mode)
   - Show frame data overlay
   - AI behavior logging
   - Performance stats (FPS)

TECHNICAL:
- Clean separation: FightScene orchestrates, doesn't implement logic
- Event-driven (emit 'roundEnd', 'matchEnd', etc.)
- Easy to add new fighters (just pass class name)
- Smooth 60 FPS

DELIVERABLE: Fully playable fight scene, player vs AI.
```

**Testing:**
- Can fight complete match (3 rounds)
- All moves work correctly
- AI behaves intelligently
- Camera never breaks
- UI always visible and accurate
- Pause menu works
- Victory/defeat displays properly
- Frame rate stable

---

## END OF PHASE 2 CHECKPOINT

**What You Can Now Do:**
✅ Fight against AI with placeholder characters  
✅ Use light/heavy attacks, blocks, specials  
✅ Win/lose matches based on skill  
✅ Full match flow (rounds, timer, meter)  
✅ Mobile-optimized controls

**What You CANNOT Do Yet:**
❌ Play as different ability classes (all fighters identical)  
❌ See class-specific moves or abilities  
❌ Experience personality-driven matchups  
❌ Play versus another human  
❌ Progress or unlock anything

**Decision Point:**
- **Option A:** Ship MVP now (generic fighters, works but not unique)
- **Option B:** Continue to Phase 3 (add personality classes)

**Recommendation:** Continue to Phase 3 - this is what makes your game special.

---

## PHASE 3: FIRST 3 ABILITY CLASSES
**Duration:** 2 weeks part-time  
**Your Time:** 6-8 hours direction  
**Agent Time:** 20-25 hours implementation  
**Goal:** Paladin, Shadow Dancer, Berserker playable with unique movesets

### Why These 3 First?

**Paladin:** Defensive tank (easy for beginners)  
**Shadow Dancer:** High-mobility assassin (intermediate)  
**Berserker:** Aggressive glass cannon (advanced)

These 3 cover different playstyles and difficulty levels.

---

### Task 3.1: Ability Class Data Structure (Week 1)
**Priority:** CRITICAL | **Time:** 4 hours (Jules) + 1 hour (you)

**What to Build:**
```javascript
// src/data/abilityClasses.js
export const ABILITY_CLASSES = {
  Paladin: {
    name: 'Paladin',
    stats: {
      hp: 120,
      atk: 80,
      def: 100,
      spd: 70
    },
    moves: {
      lightAttack: {
        name: 'Holy Jab',
        damage: 8,
        frames: { startup: 5, active: 3, recovery: 7 },
        hitbox: { x: 50, y: -30, width: 60, height: 40 }
      },
      heavyAttack: {
        name: 'Shield Bash',
        damage: 20,
        frames: { startup: 15, active: 4, recovery: 18 },
        hitbox: { x: 60, y: -40, width: 70, height: 60 }
      },
      specialMove: {
        name: 'Righteous Shield',
        type: 'defensive',
        meterCost: 25,
        frames: { startup: 8, active: 12, recovery: 10 },
        effect: 'block_all_damage_reflect_50%'
      },
      superMove: {
        name: 'Divine Strike',
        meterCost: 100,
        damage: 60,
        frames: { startup: 20, active: 8, recovery: 25 },
        cinematic: true
      }
    },
    passive: {
      name: 'Aura of Protection',
      description: 'Take 20% less damage when below 30% HP'
    },
    visualTheme: {
      primaryColor: 0xFFD700, // Gold
      secondaryColor: 0xFFFFFF, // White
      particleEffect: 'holy_light'
    },
    matchups: {
      strongAgainst: ['Berserker', 'Trickster'],
      weakAgainst: ['Tactician', 'Shapeshifter']
    }
  },
  
  ShadowDancer: {
    // Similar structure...
  },
  
  Berserker: {
    // Similar structure...
  }
};
```

**Jules Prompt:**
```
Create the ability class data structure with stats and movesets.

REFERENCE: Use Personality_Fighter_Design_Document.docx for exact stats.

REQUIREMENTS:
1. Define data structure for all ability classes
2. Implement first 3 classes: Paladin, Shadow Dancer, Berserker
3. Each class includes:
   - Base stats (hp, atk, def, spd)
   - 4 moves (light, heavy, special, super)
   - Passive ability
   - Visual theme (colors, effects)
   - Matchup advantages/disadvantages

4. Move properties:
   - Name (displayed to player)
   - Damage value
   - Frame data (startup, active, recovery)
   - Hitbox dimensions
   - Meter cost (for specials/supers)
   - Special effects (if any)

5. Validate data:
   - All required fields present
   - Frame data adds up correctly
   - Damage balanced across classes
   - Matchups are reciprocal (if A beats B, B weak to A)

DELIVERABLE: Complete data file for 3 classes, importable by Fighter class.
```

---

### Task 3.2: Fighter Class Implementation (Week 1)
**Priority:** CRITICAL | **Time:** 8 hours (Jules) + 2 hours (you)

**What to Build:**
Update Fighter class to use ability class data:

```javascript
class Fighter extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, abilityClassName) {
    super(scene, x, y, 'fighter_sprite');
    
    // Load class data
    this.abilityClass = ABILITY_CLASSES[abilityClassName];
    
    // Apply stats
    this.maxHP = this.abilityClass.stats.hp;
    this.currentHP = this.maxHP;
    this.attack = this.abilityClass.stats.atk;
    this.defense = this.abilityClass.stats.def;
    this.speed = this.abilityClass.stats.spd;
    
    // Set up moves
    this.moves = this.abilityClass.moves;
    
    // Apply visual theme
    this.tint = this.abilityClass.visualTheme.primaryColor;
    
    // Passive ability
    this.passive = this.abilityClass.passive;
  }
  
  // Override damage calculation to use class stats
  takeDamage(damage, attackerClass) {
    // Apply defense
    const defenseMitigation = damage * (this.defense / 200);
    let finalDamage = damage - defenseMitigation;
    
    // Apply matchup advantage
    if (this.hasAdvantageAgainst(attackerClass)) {
      finalDamage *= 0.7; // Take 30% less damage
    } else if (this.hasDisadvantageAgainst(attackerClass)) {
      finalDamage *= 1.3; // Take 30% more damage
    }
    
    // Apply passive (Paladin's damage reduction when low)
    if (this.passive.name === 'Aura of Protection' && this.currentHP < this.maxHP * 0.3) {
      finalDamage *= 0.8;
    }
    
    this.currentHP -= finalDamage;
    return finalDamage;
  }
}
```

**Jules Prompt:**
```
Update the Fighter class to use ability class data.

REQUIREMENTS:
1. Modify Fighter constructor to accept abilityClassName parameter
2. Load stats from ability class data
3. Initialize moves from class moveset
4. Apply visual theme (color tint, particle effects)
5. Implement passive abilities

6. Update damage calculation:
   - Use class defense stat
   - Apply matchup advantages (+50% or -30% damage)
   - Trigger passive effects

7. Update move execution:
   - Use class-specific frame data
   - Apply class-specific hitboxes
   - Show class-specific visual effects
   - Play class-specific animations (placeholder for now)

8. Stat-based behavior:
   - Speed stat affects movement speed
   - Attack stat affects damage multiplier
   - Defense stat reduces incoming damage
   - HP stat sets max health

DELIVERABLE: Fighter class that correctly implements any ability class.
```

---

### Task 3.3: Class-Specific Animations (Week 2)
**Priority:** MEDIUM | **Time:** 8 hours (Jules) + 2 hours (you)

**What to Build:**
Sprite animations for each class (can be simple initially):

```
Animation sets per class:
├── idle (breathing/stance animation)
├── walk_forward
├── walk_backward
├── lightAttack
├── heavyAttack
├── specialMove
├── superMove (cinematic)
├── block
├── hit
├── knockdown
└── victory
```

**Initial Approach (Minimal Art):**
- Use colored rectangles with simple effects
- Paladin = Gold rectangle with white glow
- Shadow Dancer = Purple rectangle with smoke trail
- Berserker = Red rectangle with jagged edges

**Jules Prompt:**
```
Create animation system for ability classes.

REQUIREMENTS:
1. AnimationManager for each Fighter
2. Load animations based on ability class
3. 10 animation states per class

4. Animation specs:
   - Idle: 60 frames loop (breathing effect)
   - Attacks: Match frame data (15-32 frames)
   - Victory: 120 frames (celebratory pose)

5. Visual effects per class:
   - Paladin: Holy light particles on attacks
   - Shadow Dancer: Purple smoke trail on movement
   - Berserker: Red energy burst on heavy attacks

6. Cinematic supers:
   - Freeze gameplay
   - Zoom camera
   - Play super animation
   - Show damage
   - Resume gameplay

FOR NOW: Use simple placeholder sprites (colored rectangles)
FUTURE: Will replace with actual character sprites

DELIVERABLE: All 3 classes have distinct visual identities.
```

---

### Task 3.4: Class Selection Screen (Week 2)
**Priority:** MEDIUM | **Time:** 4 hours (Jules) + 1 hour (you)

**What to Build:**
```
Class Selection UI:
├── Show 3 available classes (locked silhouettes for others)
├── Display class stats (HP, ATK, DEF, SPD)
├── Show signature move previews
├── Highlight recommended class (from assessment)
├── "Random" option
└── Confirm selection → Fight
```

**Jules Prompt:**
```
Create class selection screen before fights.

REQUIREMENTS:
1. Display grid: 3 unlocked classes (Paladin, Shadow Dancer, Berserker)
2. Show 5 locked silhouettes (other classes, coming soon)

3. For each class:
   - Class name
   - Icon (colored circle for now)
   - Stat bars (HP, ATK, DEF, SPD)
   - One signature move description
   - "Strong vs: X, Y" matchup info

4. Recommended class (from assessment):
   - Highlighted with gold border
   - "Recommended for you" label
   - But player can choose any unlocked class

5. Selection flow:
   - Tap class to preview
   - Show enlarged view with full moveset
   - "Select" button to confirm
   - "Back" to return to menu

6. After selection:
   - AI randomly picks opponent class
   - Show matchup preview (advantage/neutral/disadvantage)
   - "Fight!" button to start

DELIVERABLE: Functional class selection that feeds into FightScene.
```

---

## END OF PHASE 3 CHECKPOINT

**What You Can Now Do:**
✅ Choose from 3 distinct ability classes  
✅ Experience class-specific movesets  
✅ See personality-driven matchups affect gameplay  
✅ Classes have unique visual identities  
✅ Your personality test result matters

**This is a PLAYABLE GAME** - you could ship this as MVP.

**Remaining Gaps:**
- Only 3 of 8 classes available
- No PvP (human vs human)
- No progression or unlocks
- Missing training mode
- No online features

---

## PHASE 4: BASIC GAME MODES
**Duration:** 1 week part-time  
**Your Time:** 3-4 hours direction  
**Agent Time:** 8-12 hours implementation  
**Goal:** Arcade mode, Training mode, Versus mode

### Task 4.1: Arcade Mode (3 hours Jules + 1 hour you)

**What to Build:**
```
Single-player campaign:
├── 5 AI opponents (increasing difficulty)
├── Score tracking
├── Victory screen with stats
└── Unlocks (future: new classes)
```

### Task 4.2: Training Mode (3 hours Jules + 1 hour you)

**What to Build:**
```
Practice mode:
├── Dummy opponent (doesn't attack)
├── Frame data overlay
├── Hitbox visualization
├── Move list reference
└── Reset button
```

### Task 4.3: Versus Mode (2 hours Jules + 30 min you)

**What to Build:**
```
Local PvP:
├── Two-player controls (split screen)
├── Both players pick classes
├── Standard match rules
└── Rematch option
```

---

## PHASE 5: REMAINING 5 CLASSES
**Duration:** 3 weeks part-time  
**Your Time:** 8-10 hours direction  
**Agent Time:** 30-40 hours implementation  
**Goal:** All 8 classes playable

This is largely repetition of Phase 3:
- Tactician (Week 1)
- Elementalist (Week 1)
- Warden (Week 2)
- Trickster (Week 2)
- Shapeshifter (Week 3)

Each class = 1 Task = 6-8 hours Jules + 1.5-2 hours you

---

## PHASE 6: POLISH & FEATURES
**Duration:** 2 weeks part-time  
**Your Time:** 6-8 hours direction  
**Agent Time:** 20-25 hours implementation

### Task 6.1: Visual Polish
- Proper character sprites (commission or generate)
- Particle effects for all moves
- UI polish (menus, transitions)
- Background art (arena environments)

### Task 6.2: Audio Integration
- Background music (3-4 tracks)
- Sound effects (hits, blocks, specials)
- Character voice clips (grunts, taunts)
- Menu sounds

### Task 6.3: Progression System
- Player profile (name, stats, main class)
- Win/loss tracking
- Character mastery (games played per class)
- Unlockables (titles, colors, taunts)

### Task 6.4: Social Features
- Replay saving
- Share results (screenshot + class)
- Leaderboards (local)
- Friend codes (for future online)

---

## PHASE 7: ADVANCED FEATURES (Post-Launch)
**Ongoing development based on player feedback**

### 7.1: Online Multiplayer
- Matchmaking
- Ranked mode
- Replay system
- Spectator mode

### 7.2: Content Updates
- New ability classes (expand beyond 8)
- New game modes
- Seasonal events
- Balance patches

### 7.3: Monetization (Optional)
- Cosmetic skins
- Battle pass
- Premium classes
- Remove ads

---

## CRITICAL PATH SUMMARY

### Minimum Viable Game (8 weeks)
```
Week 1-2:  Phase 1 - Assessment ✅
Week 3-5:  Phase 2 - Combat Engine
Week 6-7:  Phase 3 - First 3 Classes  
Week 8:    Phase 4 - Game Modes
→ SHIP MVP
```

### Full Featured Game (14 weeks)
```
Week 1-8:   MVP (above)
Week 9-11:  Phase 5 - All 8 Classes
Week 12-13: Phase 6 - Polish
Week 14:    Marketing & Launch
→ SHIP V1.0
```

### Live Service (Ongoing)
```
Month 3+: Phase 7 - Advanced Features
→ Updates every 2-4 weeks
```

---

## EFFORT BREAKDOWN

### Your Time Investment
| Phase | Your Time | Agent Time | Weeks |
|-------|-----------|------------|-------|
| 1. Assessment ✅ | 9 hours | 30 hours | 2 |
| 2. Combat | 12 hours | 45 hours | 3 |
| 3. First 3 Classes | 8 hours | 25 hours | 2 |
| 4. Game Modes | 4 hours | 12 hours | 1 |
| **MVP Total** | **33 hours** | **112 hours** | **8 weeks** |
| 5. All 8 Classes | 10 hours | 35 hours | 3 |
| 6. Polish | 8 hours | 25 hours | 2 |
| **Full Game Total** | **51 hours** | **172 hours** | **13 weeks** |

### Cost Analysis (If Using Paid Agents)
- Jules/Claude Code: ~$0.05/hour effective (extremely cheap)
- Gemini 2.5 Pro: Free (within limits)
- **Total cost:** ~$10-20 for entire development
- **Your opportunity cost:** 51 hours @ your rate

### Traditional Development Comparison
- Solo dev without AI: 400-600 hours
- With AI agents: 51 hours your time + 172 agent hours
- **Time savings:** ~85%
- **Allows focus on:** Systems design, testing, creative decisions

---

## QUALITY GATES

### Before Proceeding to Next Phase:

**After Phase 2 (Combat):**
- [ ] Can complete full 3-round match
- [ ] Controls feel responsive on mobile
- [ ] AI provides challenge but is beatable
- [ ] Frame rate stable 60 FPS
- [ ] No game-breaking bugs

**After Phase 3 (Classes):**
- [ ] All 3 classes feel distinct
- [ ] Matchup advantages noticeable
- [ ] Each class has learning curve
- [ ] Visual identities clear
- [ ] Personality → Class mapping validated

**After Phase 4 (Modes):**
- [ ] Arcade mode completable
- [ ] Training mode useful
- [ ] Versus mode works locally
- [ ] Game feels complete (even if limited)
- [ ] Ready for external playtesting

**Before Phase 6 (Launch):**
- [ ] All 8 classes balanced
- [ ] No critical bugs
- [ ] Performance optimized
- [ ] Tutorial/onboarding clear
- [ ] Feedback from 10+ playtesters incorporated

---

## DECISION POINTS

### After Phase 2 (Week 5):
**Question:** Ship early with generic fighters or wait for classes?
- **Ship early:** Get feedback faster, validate combat feel
- **Wait for classes:** Ship with unique selling proposition intact

**Recommendation:** Wait. Generic fighters = generic game. Your USP is personality-driven classes.

### After Phase 3 (Week 7):
**Question:** Ship with 3 classes or wait for all 8?
- **Ship with 3:** Minimum viable diversity, faster iteration
- **Wait for 8:** Complete vision, better first impression

**Recommendation:** Ship with 3 for early access, add 5 more as updates. Builds anticipation.

### After Phase 4 (Week 8):
**Question:** Focus on content (more classes) or features (online multiplayer)?
- **Content:** More classes = more variety
- **Features:** Online = more engagement

**Recommendation:** Content first. Single-player solid foundation. Online can wait.

---

## RISK MITIGATION

### Technical Risks:
1. **Combat feel off:** Extensive playtesting in Phase 2, iterate on frame data
2. **Performance issues:** Profile early, optimize iteratively
3. **Class balance broken:** Accept imbalance initially, patch based on data

### Scope Risks:
1. **Feature creep:** Stick to phased plan, add features post-launch
2. **Perfectionism:** Ship "good enough" MVP, iterate based on feedback
3. **Analysis paralysis:** Time-box decisions (max 1 day per design choice)

### Motivation Risks:
1. **Burnout:** Work in 1-2 hour sessions, celebrate phase completions
2. **Loneliness:** Share progress publicly, build community early
3. **Doubt:** Remember Phase 1 works, Phase 2 is just mechanics

---

## SUCCESS METRICS

### MVP Success (Week 8):
- [ ] 10 people complete a match
- [ ] Average session > 10 minutes
- [ ] Players try all 3 classes
- [ ] Positive feedback on personality test
- [ ] No crashes reported

### Launch Success (Week 14):
- [ ] 100 people play
- [ ] 30% return next day
- [ ] Average 3+ matches per session
- [ ] Class distribution roughly even (no dominant class)
- [ ] Personality test completion rate > 80%

### Long-term Success (Month 3+):
- [ ] 1000+ players
- [ ] 40% weekly retention
- [ ] Active community (Discord/Reddit)
- [ ] Organic sharing (word of mouth)
- [ ] Revenue > hosting costs (if monetized)

---

## WHAT TO DO MONDAY MORNING

**If starting Phase 2 (Core Combat):**

1. **Create branch:**
   ```bash
   git checkout -b feature/core-combat
   ```

2. **Start with Task 2.1 (State Machine):**
   - Open `agent_management_guide.md`
   - Copy Task 2.1 prompt for Jules
   - Paste into Jules
   - Test output
   - Commit

3. **By end of week:** Tasks 2.1-2.3 complete
   - State machine working
   - Touch controls responsive
   - Hitboxes detecting collisions

4. **By end of Phase 2:** Full combat engine working

**Timeline:**
- Week 1 (Phase 2): State machine, controls, physics
- Week 2 (Phase 2): AI, health/meter system
- Week 3 (Phase 2): Integration & testing

---

This is your complete roadmap. You know exactly what remains and the optimal path to get there.

**The hard truth:** Phase 2 (Combat Engine) is the biggest remaining challenge - 40-50 agent hours. But it's 80% of what makes the game fun. Get this right, everything else is incremental.

**The good news:** You've proven you can direct agents effectively with Phase 1. Phase 2 uses the same workflow, just different domain (fighting mechanics instead of assessment scenarios).

**Your next question should be:** "Let's start Phase 2, Task 2.1 - give me the detailed Jules prompt for the Fighter State Machine."

Want to proceed?
