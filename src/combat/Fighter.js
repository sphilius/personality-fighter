import Phaser from 'phaser';
import FighterStateMachine from './FighterStateMachine.js';

/**
 * Fighter - Base class for all fighting characters
 * Uses state machine for behavior management
 */
export default class Fighter extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = 'Fighter', fighterType = 'generic') {
    // Determine sprite texture
    const textureKey = `fighter_${fighterType}`;
    const hasTexture = scene.textures.exists(textureKey);

    // Create sprite (use spritesheet if available, fallback to placeholder)
    super(scene, x, y, hasTexture ? textureKey : 'white');

    this.scene = scene;
    this.name = name;
    this.fighterType = fighterType;
    this.hasSprite = hasTexture;

    // Visual setup
    if (this.hasSprite) {
      // Using actual spritesheet
      this.setOrigin(0.5, 1); // Bottom-center origin
      this.setScale(1.25); // Scale up from 128x128 to ~160px tall
    } else {
      // Using placeholder rectangle
      this.setDisplaySize(60, 160);
      this.setOrigin(0.5, 1); // Bottom-center origin
    }

    // Fighter properties
    // fighterType already set above
    this.maxHP = 100;
    this.currentHP = 100;
    this.maxMeter = 100;
    this.currentMeter = 0;

    // Stats
    this.stats = {
      attack: 10,
      defense: 10,
      speed: 600, // High-speed movement for fast-paced combat
    };

    // Physics (Top-down, no gravity)
    this.velocity = { x: 0, y: 0 };
    this.acceleration = 2200; // Very responsive acceleration
    this.friction = 2200; // Deceleration when no input
    this.maxSpeed = 600; // Maximum movement speed

    // State
    this.facingAngle = 0; // Radians, 0 = right
    this.facingRight = true; // For sprite flipping (legacy)
    this.isBlocking = false;
    this.isVulnerable = true;
    this.hitboxActive = false;
    this.attackPhase = null; // 'startup', 'active', or 'recovery'

    // Movement (8-directional)
    this.moveDirection = { x: 0, y: 0 };

    // Mouse aim
    this.mouseAim = false; // Whether to use mouse for facing direction

    // Auto-attack (Vampire Survivors style)
    this.autoAttackEnabled = false;
    this.autoAttackCooldown = 1000; // ms between attacks
    this.autoAttackTimer = 0;
    this.autoAttackDamage = 10;
    this.autoAttackRange = 600;
    this.autoAttackSpeed = 800;

    // Initialize state machine
    this.stateMachine = new FighterStateMachine(this);

    // Add to scene
    scene.add.existing(this);

    console.log(`Fighter "${this.name}" created at (${x}, ${y})`);
  }

  /**
   * Update fighter (called every frame)
   * @param {number} delta - Time since last frame (ms)
   */
  update(delta) {
    const deltaSeconds = delta / 1000;

    // Apply velocity to position (top-down, no gravity)
    this.x += this.velocity.x * deltaSeconds;
    this.y += this.velocity.y * deltaSeconds;

    // Update state machine
    this.stateMachine.update(delta);

    // Update auto-attack timer
    if (this.autoAttackEnabled) {
      this.autoAttackTimer += delta;
    }

    // Keep fighter on screen
    this.constrainToScreen();
  }

  /**
   * Attempt to auto-attack (Vampire Survivors style)
   * @param {Function} fireCallback - Callback to fire projectile
   * @returns {boolean} - True if attack was fired
   */
  tryAutoAttack(fireCallback) {
    if (!this.autoAttackEnabled) return false;
    if (this.autoAttackTimer < this.autoAttackCooldown) return false;

    // Reset timer
    this.autoAttackTimer = 0;

    // Fire projectile in facing direction
    if (fireCallback) {
      fireCallback({
        x: this.x,
        y: this.y,
        angle: this.facingAngle,
        damage: this.autoAttackDamage,
        speed: this.autoAttackSpeed,
        owner: 'player'
      });
    }

    return true;
  }

  /**
   * Perform an attack
   * @param {Object} moveData - Data about the attack move
   */
  attack(moveData) {
    if (this.stateMachine.canAct()) {
      this.stateMachine.transition('attacking', moveData);
      return true;
    }
    return false;
  }

  /**
   * Start blocking
   */
  startBlock() {
    if (this.stateMachine.canAct()) {
      this.stateMachine.transition('blocking');
      return true;
    }
    return false;
  }

  /**
   * Stop blocking
   */
  stopBlock() {
    if (this.stateMachine.isInState('blocking')) {
      this.stateMachine.transition('idle');
      return true;
    }
    return false;
  }

  /**
   * Set movement direction (8-directional)
   * @param {number} x - Horizontal direction (-1, 0, 1)
   * @param {number} y - Vertical direction (-1, 0, 1)
   */
  setMoveDirection(x, y = 0) {
    this.moveDirection.x = x;
    this.moveDirection.y = y;

    const isMoving = x !== 0 || y !== 0;

    if (isMoving) {
      // Start moving if idle
      if (this.stateMachine.isInState('idle')) {
        this.stateMachine.transition('moving');
      }
    } else {
      // Stop moving if currently moving
      if (this.stateMachine.isInState('moving')) {
        this.stateMachine.transition('idle');
      }
    }
  }

  /**
   * Set facing direction based on mouse position
   * @param {number} mouseX - Mouse X in world coordinates
   * @param {number} mouseY - Mouse Y in world coordinates
   */
  setFacingFromMouse(mouseX, mouseY) {
    const angle = Phaser.Math.Angle.Between(this.x, this.y, mouseX, mouseY);
    this.setFacingAngle(angle);
  }

  /**
   * Set facing angle directly
   * @param {number} angle - Angle in radians
   */
  setFacingAngle(angle) {
    this.facingAngle = angle;

    // Update legacy facingRight for sprite flipping
    // Consider "right" to be -90° to +90° (right half of circle)
    const degrees = Phaser.Math.RadToDeg(angle);
    this.facingRight = degrees >= -90 && degrees <= 90;
    this.setFlipX(!this.facingRight);
  }

  /**
   * Set facing direction based on movement
   * @param {number} x - X direction
   * @param {number} y - Y direction
   */
  setFacingFromMovement(x, y) {
    if (x !== 0 || y !== 0) {
      const angle = Math.atan2(y, x);
      this.setFacingAngle(angle);
    }
  }

  /**
   * Handle collision with another fighter
   * @param {Fighter} otherFighter - The fighter we're colliding with
   */
  handleCollision(otherFighter) {
    // Calculate overlap
    const thisLeft = this.x - this.displayWidth / 2;
    const thisRight = this.x + this.displayWidth / 2;
    const otherLeft = otherFighter.x - otherFighter.displayWidth / 2;
    const otherRight = otherFighter.x + otherFighter.displayWidth / 2;

    // Check if fighters are overlapping horizontally
    if (thisRight > otherLeft && thisLeft < otherRight) {
      // Calculate push direction and amount
      const overlapLeft = thisRight - otherLeft;
      const overlapRight = otherRight - thisLeft;
      const overlap = Math.min(overlapLeft, overlapRight);

      // Push fighters apart (split the overlap)
      const pushAmount = overlap / 2;

      if (this.x < otherFighter.x) {
        // This fighter is on the left
        this.x -= pushAmount;
        otherFighter.x += pushAmount;
      } else {
        // This fighter is on the right
        this.x += pushAmount;
        otherFighter.x -= pushAmount;
      }
    }
  }

  /**
   * Take damage
   * @param {number} damage - Amount of damage
   * @param {Object} knockback - Knockback vector
   * @returns {number} - Actual damage taken
   */
  takeDamage(damage, knockback = { x: 0, y: 0 }) {
    if (!this.isVulnerable) {
      return 0;
    }

    // Apply defense mitigation
    const defenseMitigation = this.stats.defense * 0.5;
    let finalDamage = Math.max(1, damage - defenseMitigation);

    // Block reduces damage
    if (this.isBlocking) {
      finalDamage *= 0.5;
      console.log(`${this.name} blocked! Damage reduced: ${damage} → ${finalDamage}`);
    }

    // Apply damage
    this.currentHP = Math.max(0, this.currentHP - finalDamage);

    // Calculate hitstun (more damage = more hitstun)
    const hitstun = Math.min(40, 10 + Math.floor(damage / 5));

    // Transition to hit state
    this.stateMachine.forceTransition('hit', {
      damage: finalDamage,
      hitstun: hitstun,
      knockback: knockback,
    });

    // Gain meter from taking damage
    this.gainMeter(finalDamage * 0.3);

    console.log(`${this.name} took ${finalDamage} damage! HP: ${this.currentHP}/${this.maxHP}`);

    // Check for KO
    if (this.currentHP <= 0) {
      this.onKO();
    }

    return finalDamage;
  }

  /**
   * Gain meter
   * @param {number} amount
   */
  gainMeter(amount) {
    this.currentMeter = Math.min(this.maxMeter, this.currentMeter + amount);
  }

  /**
   * Spend meter
   * @param {number} amount
   * @returns {boolean} - Success
   */
  spendMeter(amount) {
    if (this.currentMeter >= amount) {
      this.currentMeter -= amount;
      return true;
    }
    return false;
  }

  /**
   * Called when fighter is KO'd
   */
  onKO() {
    console.log(`${this.name} has been knocked out!`);
    this.stateMachine.forceTransition('downed');

    // Emit KO event
    this.scene.events.emit('fighter-ko', this);
  }

  /**
   * Callback when hitbox becomes active during attack
   * @param {Object} moveData
   */
  onHitboxActivate(moveData) {
    console.log(`${this.name} hitbox active for ${moveData.name}`);
    // This will be used by combat physics system
  }

  /**
   * Keep fighter within screen bounds
   */
  constrainToScreen() {
    const bounds = this.scene.cameras.main;
    this.x = Phaser.Math.Clamp(this.x, 50, bounds.width - 50);
    this.y = Phaser.Math.Clamp(this.y, 100, bounds.height - 100);
  }

  /**
   * Heal fighter
   * @param {number} amount
   */
  heal(amount) {
    this.currentHP = Math.min(this.maxHP, this.currentHP + amount);
  }

  /**
   * Reset fighter for new round
   */
  reset() {
    this.currentHP = this.maxHP;
    this.currentMeter = 0;
    this.stateMachine.forceTransition('idle');
    this.clearTint();
  }
}
