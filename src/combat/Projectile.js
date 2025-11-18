import Phaser from 'phaser';

/**
 * Projectile - Bullets, magic attacks, etc.
 */
export default class Projectile extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'white'); // Placeholder texture

    this.scene = scene;

    // Visual setup (placeholder)
    this.setDisplaySize(8, 8);
    this.setOrigin(0.5, 0.5);

    // Projectile properties
    this.speed = 800;
    this.damage = 10;
    this.lifetime = 3000; // ms
    this.owner = null; // 'player' or 'enemy'
    this.active = false;

    // Velocity
    this.velocity = { x: 0, y: 0 };

    // Lifetime tracking
    this.aliveTime = 0;

    // Add to scene
    scene.add.existing(this);

    // Start inactive
    this.setActive(false);
    this.setVisible(false);
  }

  /**
   * Fire the projectile
   * @param {Object} config - Configuration object
   */
  fire(config) {
    this.setActive(true);
    this.setVisible(true);
    this.active = true;

    // Set position
    this.x = config.x;
    this.y = config.y;

    // Set properties
    this.damage = config.damage || 10;
    this.speed = config.speed || 800;
    this.owner = config.owner || 'player';
    this.lifetime = config.lifetime || 3000;

    // Calculate velocity based on target or angle
    if (config.targetX !== undefined && config.targetY !== undefined) {
      const angle = Phaser.Math.Angle.Between(config.x, config.y, config.targetX, config.targetY);
      this.velocity.x = Math.cos(angle) * this.speed;
      this.velocity.y = Math.sin(angle) * this.speed;
      this.setRotation(angle);
    } else if (config.angle !== undefined) {
      this.velocity.x = Math.cos(config.angle) * this.speed;
      this.velocity.y = Math.sin(config.angle) * this.speed;
      this.setRotation(config.angle);
    }

    // Visual color based on owner
    if (this.owner === 'player') {
      this.setTint(0x00ff88);
    } else {
      this.setTint(0xff4444);
    }

    // Reset lifetime
    this.aliveTime = 0;

    // Add glow effect
    this.setScale(1.5);
    this.scene.tweens.add({
      targets: this,
      scale: 1,
      duration: 100,
      ease: 'Power2'
    });
  }

  /**
   * Update projectile (called every frame)
   * @param {number} delta - Time since last frame (ms)
   */
  update(delta) {
    if (!this.active) return;

    const deltaSeconds = delta / 1000;

    // Move projectile
    this.x += this.velocity.x * deltaSeconds;
    this.y += this.velocity.y * deltaSeconds;

    // Update lifetime
    this.aliveTime += delta;

    // Check if expired
    if (this.aliveTime >= this.lifetime) {
      this.deactivate();
    }

    // Check if out of bounds (rough check)
    const bounds = this.scene.cameras.main;
    if (this.x < -100 || this.x > bounds.width + 100 ||
        this.y < -100 || this.y > bounds.height + 100) {
      this.deactivate();
    }
  }

  /**
   * Deactivate projectile (return to pool)
   */
  deactivate() {
    this.active = false;
    this.setActive(false);
    this.setVisible(false);
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  /**
   * Hit something
   */
  onHit() {
    // Visual feedback
    this.scene.tweens.add({
      targets: this,
      scale: 2,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        this.deactivate();
      }
    });
  }
}
