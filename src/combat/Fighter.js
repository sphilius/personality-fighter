import Phaser from 'phaser';
import FighterStateMachine from './FighterStateMachine.js';

/**
 * Fighter - Base class for all fighting characters
 * Uses state machine for behavior management
 */
export default class Fighter extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, name = 'Fighter') {
    // Create sprite (using placeholder for now)
    super(scene, x, y, 'white');

    this.scene = scene;
    this.name = name;

    // Visual setup (placeholder)
    this.setDisplaySize(60, 160);
    this.setOrigin(0.5, 1); // Bottom-center origin

    // Fighter properties
    this.fighterType = 'generic'; // Will be overridden by class-specific fighters
    this.maxHP = 100;
    this.currentHP = 100;
    this.maxMeter = 100;
    this.currentMeter = 0;

    // Stats
    this.stats = {
      attack: 10,
      defense: 10,
      speed: 300, // Increased from 200 for snappier movement
    };

    // Physics
    this.velocity = { x: 0, y: 0 };
    this.acceleration = 1200; // How fast we reach max speed
    this.deceleration = 1800; // How fast we stop (snappier)
    this.gravity = 1500; // Pixels per second squared
    this.jumpForce = -600; // Negative = upward
    this.groundY = y; // Remember ground position
    this.isGrounded = true;
    this.maxFallSpeed = 800;

    // State
    this.facingRight = true;
    this.isBlocking = false;
    this.isVulnerable = true;
    this.hitboxActive = false;
    this.attackPhase = null; // 'startup', 'active', or 'recovery'

    // Movement
    this.moveDirection = { x: 0, y: 0 };

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

    // Apply gravity
    if (!this.isGrounded) {
      this.velocity.y += this.gravity * deltaSeconds;
      this.velocity.y = Math.min(this.velocity.y, this.maxFallSpeed);
    }

    // Apply velocity to position
    this.x += this.velocity.x * deltaSeconds;
    this.y += this.velocity.y * deltaSeconds;

    // Ground check
    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }

    // Update state machine
    this.stateMachine.update(delta);

    // Keep fighter on screen
    this.constrainToScreen();
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
   * Set movement direction (horizontal only)
   * @param {number} x - Horizontal direction (-1, 0, 1)
   */
  setMoveDirection(x) {
    this.moveDirection.x = x;

    if (x !== 0) {
      // Start moving if idle and grounded
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
   * Make fighter jump
   */
  jump() {
    if (this.isGrounded && this.stateMachine.canAct()) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
      console.log(`${this.name} jumps!`);
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
