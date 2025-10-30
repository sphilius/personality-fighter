# Personality Fighter - The Proving Grounds
## Complete 6-Scenario Assessment System

---

## OBSERVER CHARACTER

**Visual:** Hooded figure in flowing robes, face obscured by shadow. Eyes glow faintly with arcane energy. Voice is calm, measured, slightly otherworldly.

**Personality:** Ancient, wise, non-judgmental. Sees all paths as valid. Speaks in measured riddles and observations.

**Voice Pattern:** 
- Short, impactful sentences
- Uses "the arena" as third-person observer ("The arena watches. The arena remembers.")
- Never explicitly states what's being tested
- Acknowledges choices without approval/disapproval

---

## NARRATIVE FLOW

### Opening (Pre-Scenarios)

**[Screen: Fade from black to mystical arena]**

**Observer:** "You wake. The arena calls."

**[Player character appears in center of circular arena]**

**Observer:** "Many have stood where you stand. Few have seen their true form."

**[Six glowing pillars activate around the perimeter]**

**Observer:** "Six trials. Six truths. The arena will know you by your choices."

**[First pillar glows brighter]**

**Observer:** "Step forward. The first trial begins."

---

## SCENARIO 1: THE WOUNDED GUARDIAN
**Tests:** Honesty-Humility (H), Emotionality (E)  
**Duration:** 60-75 seconds

### Setup

**[Scene transition: Arena floor cracks open, revealing treasure chest radiating golden light]**

**Observer:** "Power. Unguarded. Almost."

**[Opponent appears: Guardian class, clearly wounded, barely standing, weapon lowered]**

**Observer:** "The guardian falls. The treasure waits. What do you do?"

### Visual State
- Opponent has visible injuries (cracks of light bleeding through armor)
- Opponent's stance is defensive, weak
- Treasure chest glows invitingly behind opponent
- Health bars show: You 100%, Opponent 30%

### Combat Situation
Player has 15 seconds to choose before opponent attacks anyway.

### Choice Prompts (appear as glowing combat options)

**CHOICE A: STRIKE NOW** 
- Visual: Red aggressive attack prompt (upward swipe zone)
- Label: "Press the advantage"
- Combat: Instant high-damage attack, opponent barely defends
- Narrative feedback: "Efficiency. The arena notes your pragmatism."

**CHOICE B: WAIT FOR GUARD**
- Visual: Blue neutral stance prompt (center tap zone)  
- Label: "Fight with honor"
- Combat: Opponent recovers 20% health, then fair fight begins
- Narrative feedback: "Patience. The arena respects your restraint."

**CHOICE C: HEAL FIRST**
- Visual: Gold supportive prompt (downward swipe zone)
- Label: "Share your strength"
- Combat: Opponent heals to 70%, thanks you, then honorable duel
- Narrative feedback: "Compassion. The arena sees your heart."

### Scoring Logic
```javascript
const scenario1Scoring = {
  choiceA: { H: -2, E: -1, X: +2 }, // Aggressive, no mercy
  choiceB: { H: 0, E: 0, X: 0 },    // Neutral honor
  choiceC: { H: +2, E: +2, A: +1 }  // Compassionate, empathetic
};
```

### Combat Mechanics
- **Choice A:** 3-hit combo finishes weakened opponent (5 seconds)
- **Choice B:** Balanced fight, opponent attacks moderately (15 seconds)
- **Choice C:** Opponent fights gratefully, pulls punches slightly (20 seconds)

All choices lead to victory, but timing and feel differ.

### Transition
**Observer:** "The first truth is revealed. Five remain."

**[First pillar fades, second pillar glows]**

---

## SCENARIO 2: THE SHADOW AMBUSH
**Tests:** Emotionality (E), eXtraversion (X)  
**Duration:** 45-60 seconds

### Setup

**[Scene transition: Arena dims, shadows creep from edges]**

**Observer:** "Darkness rises. Fear is... natural."

**[Multiple shadow creatures emerge from all sides - visually overwhelming]**

**Observer:** "Many come. You stand alone. How do you face the horde?"

### Visual State
- 8 shadow creatures surround player (intimidating visual)
- Dark, claustrophobic atmosphere
- Creatures are menacing but not attacking yet
- Eerie sound design (whispers, growls)

### Combat Situation
Player has 10 seconds to choose before horde attacks.

### Choice Prompts

**CHOICE A: CHARGE THE CENTER**
- Visual: Burning red aggressive prompt (forward swipe)
- Label: "Break through!"
- Combat: Dash attack through center, scatter enemies, fight 2v1
- Narrative feedback: "Boldness. The arena admires your courage."

**CHOICE B: DEFENSIVE CIRCLE**
- Visual: Cyan defensive prompt (circular swipe)
- Label: "Hold your ground"  
- Combat: Create defensive zone, enemies attack in waves
- Narrative feedback: "Caution. The arena understands your wisdom."

**CHOICE C: CALL FOR AID**
- Visual: Purple summoning prompt (tap + hold)
- Label: "Rally allies"
- Combat: Mysterious allies appear, fight alongside you
- Narrative feedback: "Trust. The arena values connection."

### Scoring Logic
```javascript
const scenario2Scoring = {
  choiceA: { E: -2, X: +2, C: -1 },  // Fearless, extroverted, impulsive
  choiceB: { E: +1, C: +2, X: -1 },  // Cautious, planned, introverted
  choiceC: { E: 0, A: +2, X: +1 }    // Balanced, cooperative, social
};
```

### Combat Mechanics
- **Choice A:** Fast-paced 2v1, high intensity (20 seconds)
- **Choice B:** Wave defense, strategic positioning (25 seconds)
- **Choice C:** Tag-team combat with NPC allies (20 seconds)

### Transition
**Observer:** "Fear reveals. Courage defines. Two truths known."

**[Second pillar fades, third pillar glows]**

---

## SCENARIO 3: THE REFLECTED SELF
**Tests:** eXtraversion (X), Agreeableness (A)  
**Duration:** 60-75 seconds

### Setup

**[Scene transition: Arena floor becomes mirror-like, reflective]**

**Observer:** "The arena shows you... yourself."

**[Mirror clone of player appears - exact copy]**

**Observer:** "Your equal. Your opposite. Your mirror. How do you engage?"

### Visual State
- Opponent is perfect visual copy of player
- Moves mirror player initially (unsettling effect)
- Arena is reflective, surreal
- Clone watches player with curiosity, not hostility

### Combat Situation
Clone doesn't attack first. Player must initiate OR wait 20 seconds.

### Choice Prompts

**CHOICE A: ATTACK IMMEDIATELY**
- Visual: Sharp red prompt (quick tap)
- Label: "Strike first"
- Combat: Aggressive fight, clone matches your aggression
- Narrative feedback: "Competition. The arena sees your drive."

**CHOICE B: OBSERVE AND ADAPT**
- Visual: Analytical blue prompt (swipe patterns)
- Label: "Study your mirror"
- Combat: Pattern-matching puzzle, then tactical fight
- Narrative feedback: "Analysis. The arena notes your mind."

**CHOICE C: OFFER PARTNERSHIP**
- Visual: Warm gold prompt (extended hand gesture)
- Label: "Seek understanding"
- Combat: Clone nods, transforms into cooperative sparring
- Narrative feedback: "Harmony. The arena feels your peace."

### Scoring Logic
```javascript
const scenario3Scoring = {
  choiceA: { X: +2, A: -2, C: -1 },  // Bold, competitive, impulsive
  choiceB: { X: 0, C: +2, O: +1 },   // Analytical, planned, curious
  choiceC: { X: -1, A: +2, E: +1 }   // Peaceful, agreeable, empathetic
};
```

### Combat Mechanics
- **Choice A:** Mirror match, escalates to intense duel (25 seconds)
- **Choice B:** Clone demonstrates patterns, player replicates (20 seconds)
- **Choice C:** Cooperative kata, synchronized moves (25 seconds)

### Transition
**Observer:** "The mirror shows truth. The self is known. Three trials passed."

**[Third pillar fades, fourth pillar glows - halfway marker]**

---

## SCENARIO 4: THE CRUMBLING BRIDGE
**Tests:** Conscientiousness (C), Openness (O)  
**Duration:** 75-90 seconds

### Setup

**[Scene transition: Arena transforms into narrow bridge over void]**

**Observer:** "A path forward. Or many paths. The choice shapes the way."

**[Three bridge sections appear - one stable, one puzzle, one chaotic]**

**Observer:** "Your opponent waits at the far end. The bridge... decides."

### Visual State
- Three distinct paths across chasm
- Left path: Solid, straight, predictable (traditional)
- Center path: Fragmented, requires puzzle-solving (creative)
- Right path: Crumbling, requires improvisation (chaotic)
- Opponent visible at far end, waiting

### Combat Situation
Player must choose path first, then fight. Path choice affects combat arena.

### Choice Prompts

**CHOICE A: STABLE PATH**
- Visual: Green solid prompt (straight line)
- Label: "The proven way"
- Combat: Traditional arena, straightforward fight
- Narrative feedback: "Discipline. The arena trusts your method."

**CHOICE B: PUZZLE PATH**
- Visual: Cyan geometric prompt (connect-dots pattern)
- Label: "The clever way"  
- Combat: Environmental puzzle elements in fight
- Narrative feedback: "Ingenuity. The arena celebrates your mind."

**CHOICE C: CHAOS PATH**
- Visual: Orange swirling prompt (erratic pattern)
- Label: "The untested way"
- Combat: Dynamic, unpredictable arena hazards
- Narrative feedback: "Adaptation. The arena marvels at your flexibility."

### Scoring Logic
```javascript
const scenario4Scoring = {
  choiceA: { C: +2, O: -1, E: +1 },  // Organized, conventional, cautious
  choiceB: { C: +1, O: +2, X: +1 },  // Planned creativity, curious
  choiceC: { C: -2, O: +2, X: +2 }   // Spontaneous, unconventional, bold
};
```

### Combat Mechanics
- **Choice A:** Standard arena fight, clean mechanics (30 seconds)
- **Choice B:** Must activate platforms/switches during fight (35 seconds)
- **Choice C:** Random hazards spawn, must adapt constantly (30 seconds)

### Transition
**Observer:** "The path chosen reveals the walker. Four truths shine. Two remain."

**[Fourth pillar fades, fifth pillar glows]**

---

## SCENARIO 5: THE UNWINNABLE FIGHT
**Tests:** Conscientiousness (C), Agreeableness (A)  
**Duration:** 90-120 seconds

### Setup

**[Scene transition: Arena expands, colossal opponent appears]**

**Observer:** "Power. Overwhelming. Inevitable."

**[Massive boss-type enemy, clearly overpowered, slow but devastating]**

**Observer:** "Victory seems... distant. What is your strategy?"

### Visual State
- Giant opponent (3x player size)
- Player attacks do minimal visible damage
- Opponent has massive health pool (appears impossible)
- Environmental objects scattered around arena

### Combat Situation
Fight begins immediately. Player realizes after 15 seconds that direct combat is failing.

### Choice Prompts (appear after 15 seconds of struggle)

**CHOICE A: KEEP FIGHTING**
- Visual: Red persistent prompt (rapid tapping)
- Label: "Never surrender"
- Combat: Chip damage continues, takes 90 seconds to win
- Narrative feedback: "Perseverance. The arena honors your will."

**CHOICE B: USE ENVIRONMENT**
- Visual: Yellow tactical prompt (target objects)
- Label: "Find another way"
- Combat: Trigger traps/hazards, win in 30 seconds
- Narrative feedback: "Strategy. The arena applauds your mind."

**CHOICE C: NEGOTIATE**
- Visual: Purple diplomatic prompt (open hands)
- Label: "Seek peace"
- Combat: Boss stops, nods, transforms into challenging but fair fight
- Narrative feedback: "Wisdom. The arena sees beyond combat."

### Scoring Logic
```javascript
const scenario5Scoring = {
  choiceA: { C: +2, E: -1, A: -1 },  // Stubborn, fearless, competitive
  choiceB: { C: +2, O: +2, X: 0 },   // Strategic, creative, balanced
  choiceC: { A: +2, O: +1, H: +1 }   // Cooperative, open, humble
};
```

### Combat Mechanics
- **Choice A:** Long grind, tests patience (90 seconds)
- **Choice B:** Environmental puzzle + finish (30 seconds)
- **Choice C:** Fair duel with honorable opponent (45 seconds)

### Transition
**Observer:** "Strength takes many forms. Five truths revealed. One trial remains."

**[Fifth pillar fades, sixth pillar glows - final trial]**

---

## SCENARIO 6: THE CHOICE OF POWER
**Tests:** Honesty-Humility (H), Openness (O)  
**Duration:** 60-90 seconds

### Setup

**[Scene transition: All pillars glow, arena becomes ethereal]**

**Observer:** "The final truth. The deepest question."

**[Three ethereal figures appear - representing different power sources]**

**Observer:** "The arena offers gifts. Each path leads to strength. Which do you choose?"

### Visual State
- Three glowing entities, each offering different power
- Left: Golden divine light (pure, righteous)
- Center: Balanced natural energy (harmonious, adaptive)
- Right: Dark chaotic flame (powerful, forbidden)
- Each whispers promises (text appears subtly)

### Combat Situation
Player must choose power source, then fight final test opponent with that power.

### Choice Prompts

**CHOICE A: DIVINE POWER**
- Visual: Radiant gold prompt (upward reach)
- Label: "The light of righteousness"
- Combat: Holy attacks, extra defense, protective aura
- Power whispers: "Be the shield. Protect the weak. Stand in the light."
- Narrative feedback: "Justice. The arena sees your noble heart."

**CHOICE B: NATURAL POWER**
- Visual: Green-blue balanced prompt (circular harmony)
- Label: "The balance of nature"  
- Combat: Adaptive abilities, healing, transformation
- Power whispers: "Flow like water. Grow like forest. Find the center."
- Narrative feedback: "Harmony. The arena feels your peace."

**CHOICE C: CHAOS POWER**
- Visual: Purple-black swirling prompt (grasp darkness)
- Label: "The flame of ambition"
- Combat: High damage, risky abilities, life-steal
- Power whispers: "Take what you desire. Embrace your hunger. Become more."
- Narrative feedback: "Ambition. The arena acknowledges your will."

### Scoring Logic
```javascript
const scenario6Scoring = {
  choiceA: { H: +2, E: +1, A: +1 },  // Altruistic, protective, cooperative
  choiceB: { H: 0, O: +2, A: +1 },   // Balanced, open, harmonious
  choiceC: { H: -2, O: +2, X: +2 }   // Self-interested, bold, unconventional
};
```

### Combat Mechanics
- **Choice A:** Defensive playstyle, counterattacks (45 seconds)
- **Choice B:** Adaptive toolkit, situation-dependent (45 seconds)
- **Choice C:** Glass cannon, high-risk high-reward (30 seconds)

All choices lead to victory, showcasing the chosen power's effectiveness.

### Transition to Reveal
**Observer:** "The six truths are known. The arena has judged."

**[All six pillars flare with light, energy flows to player]**

**Observer:** "You are not one truth. You are all six. But one calls loudest."

**[Class reveal sequence begins]**

---

## CLASS REVEAL SEQUENCE

### The Reveal

**[Arena floor glows with class color, symbol emerges beneath player]**

**Observer:** "The arena has spoken. You are..."

**[Class name appears with dramatic visual effect]**

**[Class description appears - personalized based on actual scores]**

### Example Reveals (based on dominant scores)

**IF PALADIN (High H, High E):**
**Observer:** "...a Paladin. You stand between the weak and the darkness. Your shield protects. Your light guides. The arena honors your compassion."

**IF SHADOW DANCER (Low H, High O):**
**Observer:** "...a Shadow Dancer. You move between moments, unseen until you strike. Your path is yours alone. The arena respects your freedom."

**IF TACTICIAN (High C, Low E):**
**Observer:** "...a Tactician. You see the patterns others miss. Your mind is your weapon. The arena acknowledges your wisdom."

**IF BERSERKER (Low A, High X):**
**Observer:** "...a Berserker. You break what stands before you. Your will cannot be denied. The arena feels your power."

**IF ELEMENTALIST (High O, High C):**
**Observer:** "...an Elementalist. You command the primal forces. Your mastery shapes reality. The arena marvels at your control."

**IF WARDEN (High A, High E):**
**Observer:** "...a Warden. You tend the balance, you mend what breaks. Your presence brings peace. The arena trusts your care."

**IF TRICKSTER (Low H, High X):**
**Observer:** "...a Trickster. You bend rules and expectations. Your cleverness confounds. The arena enjoys your games."

**IF SHAPESHIFTER (High O, Low C):**
**Observer:** "...a Shapeshifter. You are not one thing but many. Your nature defies constraint. The arena celebrates your fluidity."

### Post-Reveal

**[Player character transforms into class-specific appearance]**

**Observer:** "The Proving Grounds are complete. Your true form is revealed. Now... fight."

**[Fade to main menu with class selected and locked]**

---

## TECHNICAL SCORING ALGORITHM

### Full HEXACO Calculation

```javascript
class PersonalityScorer {
  constructor() {
    this.scores = {
      H: 0,  // Honesty-Humility
      E: 0,  // Emotionality
      X: 0,  // eXtraversion
      A: 0,  // Agreeableness
      C: 0,  // Conscientiousness
      O: 0   // Openness
    };
  }

  recordChoice(scenarioId, choiceId, choiceScores) {
    // Apply scores from choice
    for (const [dimension, value] of Object.entries(choiceScores)) {
      this.scores[dimension] += value;
    }
    
    // Store for analysis
    console.log(`Scenario ${scenarioId}, Choice ${choiceId}:`, choiceScores);
    console.log('Running totals:', this.scores);
  }

  calculateFinalClass() {
    // Normalize scores to 0-100 scale
    const normalized = {};
    for (const [key, value] of Object.entries(this.scores)) {
      // Scores range from -6 to +6 (3 scenarios * ±2 per dimension)
      // Normalize to 0-100 where 50 is neutral
      normalized[key] = 50 + (value * 4.17); // 50/12 = 4.17
      normalized[key] = Math.max(0, Math.min(100, normalized[key]));
    }

    // Determine primary ability class
    const abilityClass = this.mapToAbilityClass(normalized);
    
    // Suggest Enneagram type (can be refined later)
    const enneagramType = this.suggestEnneagram(normalized, abilityClass);

    return {
      hexaco: normalized,
      abilityClass: abilityClass,
      enneagram: enneagramType,
      confidence: this.calculateConfidence(normalized)
    };
  }

  mapToAbilityClass(hexaco) {
    // Decision tree based on HEXACO scores
    
    // Paladin: High H + High E
    if (hexaco.H > 60 && hexaco.E > 60) return 'Paladin';
    
    // Shadow Dancer: Low H + High O
    if (hexaco.H < 40 && hexaco.O > 60) return 'Shadow Dancer';
    
    // Tactician: High C + Low E
    if (hexaco.C > 60 && hexaco.E < 40) return 'Tactician';
    
    // Berserker: Low A + High X
    if (hexaco.A < 40 && hexaco.X > 60) return 'Berserker';
    
    // Elementalist: High O + High C
    if (hexaco.O > 60 && hexaco.C > 60) return 'Elementalist';
    
    // Warden: High A + High E
    if (hexaco.A > 60 && hexaco.E > 60) return 'Warden';
    
    // Trickster: Low H + High X
    if (hexaco.H < 40 && hexaco.X > 60) return 'Trickster';
    
    // Shapeshifter: High O + Low C
    if (hexaco.O > 60 && hexaco.C < 40) return 'Shapeshifter';
    
    // Default to closest match if no clear winner
    return this.findClosestMatch(hexaco);
  }

  findClosestMatch(hexaco) {
    // Calculate distance to each archetype
    const archetypes = {
      Paladin: { H: 70, E: 70, X: 50, A: 60, C: 50, O: 50 },
      'Shadow Dancer': { H: 30, E: 50, X: 60, A: 50, C: 50, O: 70 },
      Tactician: { H: 60, E: 30, X: 40, A: 50, C: 70, O: 60 },
      Berserker: { H: 40, E: 30, X: 70, A: 30, C: 40, O: 50 },
      Elementalist: { H: 50, E: 40, X: 50, A: 50, C: 70, O: 70 },
      Warden: { H: 60, E: 60, X: 50, A: 70, C: 60, O: 50 },
      Trickster: { H: 30, E: 40, X: 70, A: 40, C: 50, O: 60 },
      Shapeshifter: { H: 50, E: 50, X: 60, A: 50, C: 30, O: 70 }
    };

    let closestClass = 'Warden'; // Default balanced
    let minDistance = Infinity;

    for (const [className, archetype] of Object.entries(archetypes)) {
      const distance = this.calculateDistance(hexaco, archetype);
      if (distance < minDistance) {
        minDistance = distance;
        closestClass = className;
      }
    }

    return closestClass;
  }

  calculateDistance(scores1, scores2) {
    let sum = 0;
    for (const key of ['H', 'E', 'X', 'A', 'C', 'O']) {
      sum += Math.pow(scores1[key] - scores2[key], 2);
    }
    return Math.sqrt(sum);
  }

  suggestEnneagram(hexaco, abilityClass) {
    // Map HEXACO + ability class to likely Enneagram
    const enneagramMap = {
      Paladin: [1, 2, 6],
      'Shadow Dancer': [4, 7, 8],
      Tactician: [1, 5, 6],
      Berserker: [3, 7, 8],
      Elementalist: [1, 4, 5],
      Warden: [2, 6, 9],
      Trickster: [3, 7, 8],
      Shapeshifter: [4, 7, 9]
    };

    const candidates = enneagramMap[abilityClass] || [9];
    
    // Pick most likely based on secondary characteristics
    if (hexaco.C > 60 && hexaco.H > 60) return candidates.includes(1) ? 1 : candidates[0];
    if (hexaco.A > 60 && hexaco.E > 60) return candidates.includes(2) ? 2 : candidates[0];
    if (hexaco.X > 60 && hexaco.H < 50) return candidates.includes(3) ? 3 : candidates[0];
    if (hexaco.O > 60 && hexaco.E > 60) return candidates.includes(4) ? 4 : candidates[0];
    if (hexaco.O > 60 && hexaco.X < 50) return candidates.includes(5) ? 5 : candidates[0];
    if (hexaco.E > 60 && hexaco.C > 60) return candidates.includes(6) ? 6 : candidates[0];
    if (hexaco.X > 60 && hexaco.C < 50) return candidates.includes(7) ? 7 : candidates[0];
    if (hexaco.X > 60 && hexaco.A < 50) return candidates.includes(8) ? 8 : candidates[0];
    return candidates.includes(9) ? 9 : candidates[0];
  }

  calculateConfidence(hexaco) {
    // Higher variance = higher confidence (clear personality)
    const values = Object.values(hexaco);
    const mean = values.reduce((a, b) => a + b) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    // Normalize to 0-100
    return Math.min(100, variance * 0.5);
  }
}
```

### Usage Example

```javascript
const scorer = new PersonalityScorer();

// Scenario 1: Player chose to heal opponent
scorer.recordChoice(1, 'C', { H: +2, E: +2, A: +1 });

// Scenario 2: Player chose defensive circle
scorer.recordChoice(2, 'B', { E: +1, C: +2, X: -1 });

// Scenario 3: Player chose to study mirror
scorer.recordChoice(3, 'B', { X: 0, C: +2, O: +1 });

// Scenario 4: Player chose stable path
scorer.recordChoice(4, 'A', { C: +2, O: -1, E: +1 });

// Scenario 5: Player used environment
scorer.recordChoice(5, 'B', { C: +2, O: +2, X: 0 });

// Scenario 6: Player chose natural power
scorer.recordChoice(6, 'B', { H: 0, O: +2, A: +1 });

// Calculate final result
const result = scorer.calculateFinalClass();
console.log('Final Assessment:', result);
// Expected: Tactician or Elementalist (high C, moderate-high O)
```

---

## VISUAL DESIGN SPECIFICATIONS

### Observer Visual Assets Needed
- Observer portrait (hooded figure, glowing eyes) - 512x512px
- Observer silhouette (for scene transitions) - 256x256px
- 6 dialogue box variations (different emotional tones)

### Arena Environments
1. **Base Arena** - Circular stone platform, mystical runes
2. **Wounded Guardian** - Same arena + treasure chest prop
3. **Shadow Ambush** - Darkened version, shadow particles
4. **Reflected Self** - Mirror floor shader effect
5. **Crumbling Bridge** - Three path variations over void
6. **Unwinnable Fight** - Expanded arena, environmental hazards
7. **Choice of Power** - Ethereal, three glowing power sources

### Choice Prompt Visual System
- **Aggressive (Red):** Sharp angles, burning effect, rapid pulse
- **Defensive (Blue/Cyan):** Circular, shielding, steady glow
- **Strategic (Yellow):** Geometric, calculating, precise angles
- **Cooperative (Gold):** Warm, inviting, gentle pulse
- **Chaotic (Orange/Purple):** Swirling, unpredictable, jagged

### Class Reveal Effects
Each class gets unique reveal animation:
- **Paladin:** Golden light burst, divine rays
- **Shadow Dancer:** Purple smoke coalesce, shadow ribbons
- **Tactician:** Blue geometric patterns, precise lines
- **Berserker:** Red explosion, violent energy
- **Elementalist:** Multi-color elemental swirl
- **Warden:** Green nature growth, flowing water
- **Trickster:** Pink-blue glitch, illusion shimmer
- **Shapeshifter:** Prismatic morph, fluid transformation

---

## AUDIO DESIGN NOTES

### Observer Voice
- Gender-neutral, slightly processed (echo/reverb)
- Calm, measured pace
- Key phrases have musical sting emphasis
- Different tones for different scenario types

### Scenario Ambient Audio
1. **Wounded Guardian:** Soft battle sounds distant, treasure hum
2. **Shadow Ambush:** Creeping whispers, low menacing drones
3. **Reflected Self:** Echoes, reversed audio, disorienting
4. **Crumbling Bridge:** Wind, cracking stone, void ambience
5. **Unwinnable Fight:** Heavy footsteps, overwhelming presence
6. **Choice of Power:** Ethereal chimes, energy resonance

### Choice Feedback Audio
- **Aggressive choice:** Sharp strike, aggressive music swell
- **Defensive choice:** Shield bash, protective harmony
- **Strategic choice:** Puzzle click, analytical chime
- **Cooperative choice:** Warm chord, collaborative melody

### Class Reveal Music
- Dramatic orchestral swell
- Class-specific instrument highlight
- Transition into class theme loop

---

## MOBILE OPTIMIZATION

### Touch Gesture Mapping
- **Upward swipe:** Aggressive/Forward choice
- **Downward swipe:** Defensive/Compassionate choice
- **Left/Right swipe:** Movement (when applicable)
- **Circular swipe:** Defensive stance
- **Tap + Hold:** Special/Alternative action
- **Quick tap:** Neutral/Balanced choice

### Performance Targets
- 60 FPS throughout all scenarios
- Max 3 simultaneous particle effects per scene
- Texture atlasing for all scenario assets
- Preload all scenario assets during opening narration
- Scene transitions < 1 second loading

### Checkpoint System
Player can pause between scenarios:
- "Continue Proving Grounds" button
- Shows progress (X/6 complete)
- Can exit and resume later
- Scores saved to local storage

---

## SKIP/REPLAY OPTIONS

### Skip Assessment Button
Available at start and between scenarios:
- "Skip to Class Selection" - manual choice
- "I know my class" - returns players
- Hidden after first completion (per device)

### Replay Assessment
Available after first completion:
- "Retake Proving Grounds"
- Can update class assignment
- Shows previous result for comparison
- Tracks changes in scores over time

### Fast Track (Returning Players)
After completing once:
- "Quick Assessment" (3 scenarios instead of 6)
- Scenarios 1, 3, 5 only (covers all dimensions)
- 2-3 minute version
- Validates previous assessment or suggests new class

---

## IMPLEMENTATION PRIORITY

### Phase 1: Core System (Week 1)
- Observer character and dialogue system
- Scenario framework (all 6 scenarios)
- Choice prompt UI
- Basic scoring algorithm
- Class assignment logic

### Phase 2: Combat Integration (Week 2)
- Combat sequences for each choice
- Opponent AI for scenarios
- Victory conditions
- Transition animations

### Phase 3: Visual Polish (Week 3)
- Arena environments (all 6)
- Particle effects
- Class reveal animations
- UI polish

### Phase 4: Audio & Optimization (Week 4)
- Observer voice recording/processing
- Scenario ambient audio
- Music integration
- Performance optimization
- Mobile testing

---

## TESTING & VALIDATION

### Scoring Validation Tests
Create known personality profiles:
- **Test Profile A:** All aggressive choices → Should map to Berserker
- **Test Profile B:** All compassionate → Should map to Paladin  
- **Test Profile C:** All strategic → Should map to Tactician
- **Test Profile D:** Mixed balanced → Should map to Warden

### User Testing Metrics
- Time to complete (target: 5-7 minutes)
- Choice distribution (are all choices being used?)
- Drop-off rate (where do players quit?)
- Class distribution (is one class over-represented?)
- Replay rate (do players retake assessment?)

### Accuracy Validation
Post-assessment survey:
- "Does this class feel right for you?"
- "Which scenarios felt most impactful?"
- "Would you like to try a different class?"

Track correlation between:
- Initial assessment → Player behavior in actual matches
- If players switch classes → Why?
- Enneagram suggestions → Player feedback

---

## EXTENSION OPPORTUNITIES

### Future Enhancements
1. **Behavioral Tracking:** Layer invisible analytics under scenarios
2. **Dynamic Difficulty:** Adjust scenario combat based on player skill
3. **Narrative Branches:** Different Observer dialogue based on scores
4. **Multi-Language:** Localize scenarios (text-light design helps)
5. **Social Sharing:** "I'm a [Class]! Take the Proving Grounds"
6. **Class Migration:** If behavior changes, offer re-assessment

### Advanced Features
- **Streamer Mode:** Extended scenarios with audience voting
- **Tournament Mode:** Assessment becomes ranked qualifier
- **Story Campaign:** Observer becomes recurring character with lore
- **Class Mastery:** Unlock class variations through play

---

This complete scenario system is now ready for implementation. Next section covers detailed agent management for Jules, GitHub, and Gemini 2.5 Pro.
