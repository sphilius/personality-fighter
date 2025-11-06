# Asset Generation Guide for Personality Fighter
## Using Gemini 2.5 Flash for Fighter Spritesheets

---

## Technical Specifications

### Spritesheet Layout
- **Format:** PNG with transparency
- **Grid:** 8 columns × 8 rows = 64 frames total
- **Frame Size:** 128×128 pixels per frame
- **Total Size:** 1024×1024 pixels
- **File Location:** `public/assets/fighters/fighter_generic.png`

### Frame Allocation
```
Row 0 (frames 0-7):   Idle animation
Row 1 (frames 8-15):  Walk animation
Row 2 (frames 16-23): Light attack animation
Row 3 (frames 24-31): Heavy attack animation
Row 4 (frames 32-39): Block animation
Row 5 (frames 40-47): Hit reaction animation
Row 6 (frames 48-55): Downed animation
Row 7 (frames 56-63): Jump animation
```

---

## Base Character Design

### Generic Fighter (Neutral Template)
**Character Concept:**
- Balanced martial artist wearing simple training gear
- Neutral color scheme (gray/white with blue accents)
- Clean, readable silhouette for gameplay clarity
- Side-view stance (facing right by default)
- Grounded, athletic stance

---

## Image Generation Prompts

### Master Prompt (Use with ALL prompts below)
```
STYLE: 2D pixel art fighting game sprite, 128x128 pixels, side-view, transparent background, clean pixel art style similar to Street Fighter or King of Fighters, high contrast, readable silhouette, no anti-aliasing on edges, limited color palette (8-12 colors), character facing RIGHT, athletic proportions

CHARACTER: Human martial artist wearing simple gray training gi with blue belt, short dark hair, athletic build, barefoot, neutral expression, side profile stance
```

---

### Row 0: Idle Animation (8 frames)
**Prompt:**
```
{Master Prompt}

ANIMATION: Idle breathing animation, 8 frames showing gentle breathing motion
- Frame 0: Neutral stance, feet shoulder-width apart, hands in guard position
- Frames 1-3: Chest expands slightly, shoulders rise 2 pixels
- Frame 4: Peak inhale position
- Frames 5-7: Return to neutral, slight downward motion
- Subtle weight shift, head bobs 1-2 pixels

Create frame-by-frame sprite sheet showing smooth idle breathing loop
```

### Row 1: Walk Animation (8 frames)
**Prompt:**
```
{Master Prompt}

ANIMATION: Walking forward, 8 frames showing full walk cycle
- Frame 0: Right foot forward, left foot back
- Frame 1-2: Weight shifts forward, left foot lifts
- Frame 3: Mid-stride, left foot passing right foot
- Frame 4: Left foot lands forward, right foot back (mirror of frame 0)
- Frame 5-6: Weight shifts, right foot lifts
- Frame 7: Mid-stride, right foot passing left foot
- Arms swing naturally opposite to legs
- Head height remains constant (no bobbing up/down)

Create smooth walking motion sprite sheet, character moving RIGHT
```

### Row 2: Light Attack (8 frames)
**Prompt:**
```
{Master Prompt}

ANIMATION: Quick straight punch attack, 8 frames
- Frames 0-1: Startup - arm pulls back, shoulder rotates, weight shifts to back leg
- Frame 2: Arm extends halfway, body rotates
- Frames 3-4: Active frames - arm fully extended, fist at maximum reach, impact pose
- Frames 5-7: Recovery - arm retracts, returns to guard position
- Front arm (right) does the punch, leaves guard open
- Fast, snappy motion

Create punching attack animation sprite sheet
```

### Row 3: Heavy Attack (8 frames)
**Prompt:**
```
{Master Prompt}

ANIMATION: Powerful spinning kick attack, 8 frames
- Frames 0-2: Startup - weight shifts to standing leg, kicking leg pulls back, arms wind up
- Frame 3: Body begins rotation, leg starts to extend
- Frames 4-5: Active frames - full rotation, leg extended horizontally at head height, maximum power pose
- Frames 6-7: Recovery - leg retracts, body completes spin, returns to stance
- Dynamic pose with motion blur effect on foot
- Slower, more committal than light attack

Create heavy kick attack animation sprite sheet
```

### Row 4: Block Animation (8 frames)
**Prompt:**
```
{Master Prompt}

ANIMATION: Defensive blocking stance, 8 frames showing guard tightening
- Frame 0: Transition from idle to block
- Frames 1-2: Arms raise to defensive position, elbows in
- Frames 3-5: Steady block hold - forearms crossed in front of face/chest, legs braced
- Frames 6-7: Slight defensive sway, weight shifts between feet
- Tense, braced posture
- Arms form defensive barrier

Create blocking animation sprite sheet showing defensive stance
```

### Row 5: Hit Reaction (8 frames)
**Prompt:**
```
{Master Prompt}

ANIMATION: Taking damage hit reaction, 8 frames
- Frames 0-1: Impact - body recoils backward, head snaps back, arms flail
- Frames 2-3: Maximum recoil - body bent backward, off-balance, grimacing expression
- Frames 4-5: Recovery begins - body straightens, arms come back to center
- Frames 6-7: Return to guard position, still slightly stunned
- Pushback motion (character moves RIGHT from force)
- Visible pain/impact on face

Create hit reaction animation sprite sheet showing damage taken
```

### Row 6: Downed Animation (8 frames)
**Prompt:**
```
{Master Prompt}

ANIMATION: Knocked down to ground, 8 frames
- Frames 0-2: Falling - body tilts backward, legs buckle, arms out for balance
- Frames 3-4: Impact - character hits ground, lying on back
- Frames 5-6: Downed position - fully prone on ground, chest rising/falling
- Frame 7: Start of recovery attempt - slight movement, arm props up
- Character lies flat on ground
- Defeated pose but still conscious

Create knockdown animation sprite sheet showing fall to ground
```

### Row 7: Jump Animation (8 frames)
**Prompt:**
```
{Master Prompt}

ANIMATION: Jumping upward, 8 frames showing full jump arc
- Frames 0-1: Crouch - knees bend, arms swing back, preparing to leap
- Frame 2: Launch - legs extend, pushing off ground, arms swing up
- Frames 3-4: Ascent - body rises, legs tuck slightly, arms above head
- Frame 4: Peak of jump - highest point, body compact
- Frames 5-6: Descent - body extends, preparing to land, arms lower
- Frame 7: Landing anticipation - legs extend for ground contact
- Vertical motion (up and down)

Create jumping animation sprite sheet showing full jump motion
```

---

## Step-by-Step Generation Process

### Using Gemini 2.5 Flash

1. **Generate Each Row Separately:**
   ```
   Go to Gemini 2.5 Flash
   For each row (0-7):
   - Paste the Master Prompt + specific row prompt
   - Request: "Generate this as 8 separate frames in a horizontal strip"
   - Download the generated image
   ```

2. **Assemble the Spritesheet:**
   - Use image editing software (Photoshop, GIMP, Aseprite)
   - Create 1024×1024 pixel canvas
   - Place each 8-frame row in correct position:
     - Row 0 at y=0 (idle)
     - Row 1 at y=128 (walk)
     - Row 2 at y=256 (light attack)
     - etc.
   - Ensure transparent background
   - Export as PNG

3. **Alternative - Request Full Sheet:**
   ```
   Combine all prompts into one request:
   "Create a complete 8x8 sprite sheet (1024x1024 pixels) with the following animations:
   [Include all 8 row descriptions]
   Each row should have 8 frames. Maintain consistent character design across all frames."
   ```

---

## Color Palette Suggestions

### Generic Fighter
```
Base Colors:
- Gi: #CCCCCC (light gray)
- Belt: #3366CC (blue)
- Skin: #D4A574 (tan)
- Hair: #2C1810 (dark brown)
- Outlines: #000000 (black)

Shading:
- Gi Shadow: #999999
- Skin Shadow: #B38B5C
- Belt Shadow: #254C9A
```

---

## Tips for Consistent Results

### 1. Character Consistency
- Always include "same character as previous" when generating multiple rows
- Keep color palette notes in each prompt
- Reference frame 0 of Row 0 (idle) as the "base pose"

### 2. Animation Quality
- Request "smooth animation" and "natural motion"
- Specify "no motion blur" for clean pixel art (except heavy attack)
- Ask for "readable silhouette at small size"

### 3. Technical Requirements
- Always specify "transparent background"
- Request "pixel-perfect alignment" between frames
- Ask for "consistent character size across all frames"

### 4. Troubleshooting
- If Gemini generates 3D renders instead of pixel art: Add "2D pixel art ONLY, not 3D render"
- If proportions vary: Include "character height must be exactly 120 pixels in all frames"
- If animations are choppy: Request "smooth easing between keyframes"

---

## Testing Your Spritesheet

1. **Save file as:** `public/assets/fighters/fighter_generic.png`

2. **Create the directory:**
   ```bash
   mkdir -p public/assets/fighters
   ```

3. **Run the game:**
   ```bash
   pnpm run dev
   ```

4. **Check console:** Should see "Fighter animations created successfully"

5. **Test in Combat Scene:** Select "COMBAT TEST" from menu
   - Idle: Character should breathe
   - Walk: Press A/D to walk
   - Attack: Press J/K for attacks
   - Block: Hold L to block
   - Jump: Press W to jump

---

## Future: Class-Specific Fighters

Once generic fighter works, create variations:

### Paladin
- Heavy armor (gold/silver)
- Shield and sword
- Bulkier proportions
- File: `fighter_paladin.png`

### Shadow Dancer
- Dark ninja attire (purple/black)
- Dual daggers
- Slim, agile proportions
- File: `fighter_shadow_dancer.png`

### Berserker
- Tribal war paint
- Two-handed axe
- Muscular proportions
- File: `fighter_berserker.png`

**Modify Master Prompt for each class**, keep animation structure identical (8 rows × 8 frames).

---

## Alternative: Simpler 4-Frame Animations

If 8 frames per animation is too complex, you can use 4-frame versions:

### Modified Spritesheet (4-frame version)
- **Grid:** 8 columns × 4 rows = 32 frames total
- **Total Size:** 1024×512 pixels

Update `BootScene.js`:
```javascript
// Change animation frame ranges to 4 frames each
anims.create({
  key: 'generic_idle',
  frames: anims.generateFrameNumbers('fighter_generic', { start: 0, end: 3 }),
  frameRate: 8,
  repeat: -1,
});
```

This reduces generation complexity while maintaining functionality.

---

## Quick Start Template

**Minimal viable prompt for Gemini 2.5 Flash:**

```
Create a 1024x1024 pixel sprite sheet for a 2D fighting game character.

Layout: 8 rows × 8 columns grid (each cell 128×128 pixels)
Style: Clean pixel art, side-view, transparent background
Character: Martial artist in gray gi with blue belt, facing RIGHT

Animations (8 frames each row):
Row 0: Idle breathing
Row 1: Walking forward
Row 2: Punch attack
Row 3: Kick attack
Row 4: Block stance
Row 5: Hit reaction
Row 6: Knocked down
Row 7: Jump

Consistent character design across all 64 frames.
Export as PNG with transparency.
```

---

## Summary

1. Use the detailed prompts above for best results
2. Generate row-by-row or request complete sheet
3. Save to `public/assets/fighters/fighter_generic.png`
4. Reload game - animations should play automatically
5. Iterate on prompts to improve quality

**The game will automatically detect and use your spritesheets**, falling back to colored rectangles if files are missing.

Good luck creating your fighters! 🥊
