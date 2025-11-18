import Phaser from 'phaser';

/**
 * Enemy - Basic enemy that chases the player
 */
export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, enemyType = 'grunt') {
    super(scene, x, y, 'white'); // Placeholder texture

    this.scene = scene;
    this.enemyType = enemyType;

    // Visual setup (placeholder)
    this.setDisplaySize(30, 30);
    this.setOrigin(0.5, 0.5);
    this.setTint(0xff4444); // Red for enemies

    // Enemy properties
    this.maxHP = 30;
    this.currentHP = 30;
    this.speed = 200;
    this.damage = 5;
    this.xpValue = 10;

    // AI state
    this.aiState = 'chase'; // 'chase', 'attack', 'dead'
    this.velocity = { x: 0, y: 0 };

    // Add to scene
    scene.add.existing(this);

    this.isActive = true;
  }

  /**
   * Update enemy AI
   * @param {number} delta - Time since last frame
   * @param {Object} player - Player to chase
   */
  update(delta, player) {
    if (!this.isActive || this.aiState === 'dead') return;

    const deltaSeconds = delta / 1000;

    switch (this.aiState) {
      case 'chase':
        this.chasePlayer(player, deltaSeconds);
        break;
      case 'attack':
        // Attack logic here (future)
        break;
    }

    // Apply velocity
    this.x += this.velocity.x * deltaSeconds;
    this.y += this.velocity.y * deltaSeconds;
  }

  /**
   * Chase the player
   * @param {Object} player - Player to chase
   * @param {number} deltaSeconds - Delta time in seconds
   */
  chasePlayer(player, deltaSeconds) {
    // Calculate direction to player
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);

    // Set velocity toward player
    this.velocity.x = Math.cos(angle) * this.speed;
    this.velocity.y = Math.sin(angle) * this.speed;

    // Face player (flip sprite if needed)
    if (player.x < this.x) {
      this.setFlipX(true);
    } else {
      this.setFlipX(false);
    }
  }

  /**
   * Take damage
   * @param {number} damage - Amount of damage
   * @returns {boolean} - True if enemy died
   */
  takeDamage(damage) {
    this.currentHP -= damage;

    // Flash red
    this.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      if (this.isActive) {
        this.setTint(0xff4444);
      }
    });

    // Check if dead
    if (this.currentHP <= 0) {
      this.die();
      return true;
    }

    return false;
  }

  /**
   * Enemy dies
   */
  die() {
    this.aiState = 'dead';
    this.isActive = false;

    // Death animation
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0.5,
      duration: 300,
      onComplete: () => {
        // Spawn XP orb here (future)
        this.scene.events.emit('enemy-killed', {
          x: this.x,
          y: this.y,
          xpValue: this.xpValue,
          enemy: this
        });

        this.destroy();
      }
    });
  }

  /**
   * Cleanup
   */
  destroy() {
    super.destroy();
  }
}
