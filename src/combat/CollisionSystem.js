import Phaser from 'phaser';

/**
 * CollisionSystem - Handles hitbox/hurtbox collision detection
 * Manages attack collision and damage application
 */
export default class CollisionSystem {
  constructor(scene, fighter1, fighter2) {
    this.scene = scene;
    this.fighter1 = fighter1;
    this.fighter2 = fighter2;

    // Visual debug mode
    this.debugMode = false;
    this.debugGraphics = null;

    // Hit tracking (prevent multiple hits from same attack)
    this.fighter1HitLanded = false;
    this.fighter2HitLanded = false;

    console.log('CollisionSystem initialized');
  }

  /**
   * Enable/disable visual debug mode
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;

    if (enabled && !this.debugGraphics) {
      this.debugGraphics = this.scene.add.graphics();
    } else if (!enabled && this.debugGraphics) {
      this.debugGraphics.destroy();
      this.debugGraphics = null;
    }
  }

  /**
   * Update collision detection (call every frame)
   */
  update() {
    // Clear previous debug drawings
    if (this.debugGraphics) {
      this.debugGraphics.clear();
    }

    // Check fighter1 attacking fighter2
    if (this.fighter1.hitboxActive && !this.fighter1HitLanded) {
      const hit = this.checkHit(this.fighter1, this.fighter2);
      if (hit) {
        this.applyHit(this.fighter1, this.fighter2);
        this.fighter1HitLanded = true;
      }
    }

    // Check fighter2 attacking fighter1
    if (this.fighter2.hitboxActive && !this.fighter2HitLanded) {
      const hit = this.checkHit(this.fighter2, this.fighter1);
      if (hit) {
        this.applyHit(this.fighter2, this.fighter1);
        this.fighter2HitLanded = true;
      }
    }

    // Reset hit tracking when hitbox becomes inactive
    if (!this.fighter1.hitboxActive) {
      this.fighter1HitLanded = false;
    }
    if (!this.fighter2.hitboxActive) {
      this.fighter2HitLanded = false;
    }

    // Draw debug visuals
    if (this.debugMode) {
      this.drawDebug();
    }
  }

  /**
   * Check if attacker's hitbox overlaps defender's hurtbox
   */
  checkHit(attacker, defender) {
    // Get hitbox from attacker
    const hitbox = this.getHitbox(attacker);

    // Get hurtbox from defender
    const hurtbox = this.getHurtbox(defender);

    // Check overlap
    return Phaser.Geom.Rectangle.Overlaps(hitbox, hurtbox);
  }

  /**
   * Get attacker's hitbox based on current attack
   */
  getHitbox(fighter) {
    // Get current move data from attacking state
    const attackingState = fighter.stateMachine.states.attacking;
    const moveData = attackingState.currentMove;

    if (!moveData) {
      // Default hitbox if no move data
      return this.getDefaultHitbox(fighter);
    }

    // Use move's hitbox data if available
    const hitboxData = moveData.hitbox || { x: 50, y: -30, width: 60, height: 40 };

    // Calculate world position based on fighter position and facing
    const worldX = fighter.facingRight
      ? fighter.x + hitboxData.x
      : fighter.x - hitboxData.x - hitboxData.width;

    const worldY = fighter.y + hitboxData.y;

    return new Phaser.Geom.Rectangle(
      worldX,
      worldY,
      hitboxData.width,
      hitboxData.height
    );
  }

  /**
   * Get default hitbox when no specific data is available
   */
  getDefaultHitbox(fighter) {
    const offset = fighter.facingRight ? 50 : -110;
    return new Phaser.Geom.Rectangle(
      fighter.x + offset,
      fighter.y - 60,
      60,
      60
    );
  }

  /**
   * Get fighter's hurtbox (vulnerable area)
   */
  getHurtbox(fighter) {
    // Hurtbox is the fighter's body
    const width = fighter.displayWidth * 0.6; // 60% of visual width
    const height = fighter.displayHeight * 0.8; // 80% of visual height

    return new Phaser.Geom.Rectangle(
      fighter.x - width / 2,
      fighter.y - height,
      width,
      height
    );
  }

  /**
   * Apply hit - damage, knockback, meter gain
   */
  applyHit(attacker, defender) {
    // Get move data
    const attackingState = attacker.stateMachine.states.attacking;
    const moveData = attackingState.currentMove;

    if (!moveData) return;

    // Calculate damage
    const baseDamage = moveData.damage || 10;

    // Apply attack stat multiplier
    const attackMultiplier = attacker.stats.attack / 10;
    const totalDamage = baseDamage * attackMultiplier;

    // Calculate knockback
    const knockbackDirection = attacker.facingRight ? 1 : -1;
    const knockbackStrength = moveData.damage > 20 ? 200 : 100; // Heavy attacks push more
    const knockback = {
      x: knockbackDirection * knockbackStrength,
      y: 0
    };

    // Apply damage to defender
    const actualDamage = defender.takeDamage(totalDamage, knockback);

    // Attacker gains meter for landing hit
    attacker.gainMeter(actualDamage * 0.5);

    // Visual/audio feedback
    this.onHitLanded(attacker, defender, actualDamage);

    console.log(`HIT! ${attacker.name} hit ${defender.name} for ${Math.round(actualDamage)} damage`);
  }

  /**
   * Visual/audio feedback when hit lands
   */
  onHitLanded(attacker, defender, damage) {
    // Flash defender white briefly
    defender.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      defender.clearTint();
      if (defender.currentHP > 0) {
        // Re-apply colored tint if fighter has one
        const color = defender === this.fighter1 ? 0x44ff44 : 0xff4444;
        defender.setTint(color);
      }
    });

    // Camera shake for heavy hits
    if (damage > 20) {
      this.scene.cameras.main.shake(100, 0.005);
    }

    // Freeze frame for impact (optional)
    // this.scene.time.delayedCall(0, () => {
    //   this.scene.time.paused = true;
    //   this.scene.time.delayedCall(50, () => {
    //     this.scene.time.paused = false;
    //   });
    // });
  }

  /**
   * Draw debug visualization of hitboxes/hurtboxes
   */
  drawDebug() {
    if (!this.debugGraphics) return;

    // Draw fighter1 hitbox (red) if active
    if (this.fighter1.hitboxActive) {
      const hitbox = this.getHitbox(this.fighter1);
      this.debugGraphics.lineStyle(2, 0xff0000, 1);
      this.debugGraphics.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
      this.debugGraphics.fillStyle(0xff0000, 0.2);
      this.debugGraphics.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }

    // Draw fighter2 hitbox (red) if active
    if (this.fighter2.hitboxActive) {
      const hitbox = this.getHitbox(this.fighter2);
      this.debugGraphics.lineStyle(2, 0xff0000, 1);
      this.debugGraphics.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
      this.debugGraphics.fillStyle(0xff0000, 0.2);
      this.debugGraphics.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
    }

    // Draw fighter1 hurtbox (green)
    const hurtbox1 = this.getHurtbox(this.fighter1);
    this.debugGraphics.lineStyle(2, 0x00ff00, 1);
    this.debugGraphics.strokeRect(hurtbox1.x, hurtbox1.y, hurtbox1.width, hurtbox1.height);

    // Draw fighter2 hurtbox (green)
    const hurtbox2 = this.getHurtbox(this.fighter2);
    this.debugGraphics.lineStyle(2, 0x00ff00, 1);
    this.debugGraphics.strokeRect(hurtbox2.x, hurtbox2.y, hurtbox2.width, hurtbox2.height);
  }

  /**
   * Clean up
   */
  destroy() {
    if (this.debugGraphics) {
      this.debugGraphics.destroy();
    }
  }
}
