import Phaser from 'phaser';

/**
 * XPOrb - Experience orb that drops from enemies
 */
export default class XPOrb extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'white'); // Placeholder texture

    this.scene = scene;

    // Visual setup (placeholder)
    this.setDisplaySize(12, 12);
    this.setOrigin(0.5, 0.5);
    this.setTint(0xffaa00); // Gold color

    // XP properties
    this.xpValue = 10;
    this.active = false;
    this.collectRadius = 50; // Distance at which it gets pulled toward player
    this.magnetSpeed = 400; // Speed when being pulled

    // State
    this.isBeingPulled = false;

    // Add to scene
    scene.add.existing(this);

    // Start inactive
    this.setActive(false);
    this.setVisible(false);
  }

  /**
   * Spawn the XP orb
   * @param {Object} config - Configuration object
   */
  spawn(config) {
    this.setActive(true);
    this.setVisible(true);
    this.active = true;

    // Set position
    this.x = config.x;
    this.y = config.y;

    // Set XP value
    this.xpValue = config.xpValue || 10;

    // Reset state
    this.isBeingPulled = false;

    // Spawn animation (pop in)
    this.setScale(0);
    this.scene.tweens.add({
      targets: this,
      scale: 1.5,
      duration: 200,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Idle float animation
        this.scene.tweens.add({
          targets: this,
          y: this.y - 5,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });

        // Rotate animation
        this.scene.tweens.add({
          targets: this,
          angle: 360,
          duration: 2000,
          repeat: -1,
          ease: 'Linear'
        });

        // Pulse scale
        this.scene.tweens.add({
          targets: this,
          scale: 1.7,
          duration: 500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });

    // Add glow effect
    this.glowCircle = this.scene.add.circle(this.x, this.y, 8, 0xffaa00, 0.3);
    this.scene.tweens.add({
      targets: this.glowCircle,
      scale: 1.5,
      alpha: 0.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  /**
   * Update XP orb (called every frame)
   * @param {number} delta - Time since last frame (ms)
   * @param {Object} player - Player to check distance to
   */
  update(delta, player) {
    if (!this.active) return;

    const deltaSeconds = delta / 1000;

    // Update glow position
    if (this.glowCircle) {
      this.glowCircle.x = this.x;
      this.glowCircle.y = this.y;
    }

    // Check distance to player
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      player.x, player.y
    );

    // If close enough, get pulled toward player
    if (distance < this.collectRadius) {
      this.isBeingPulled = true;
    }

    // Move toward player if being pulled
    if (this.isBeingPulled) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
      const speed = this.magnetSpeed + (this.collectRadius - distance) * 10; // Speed increases as it gets closer

      this.x += Math.cos(angle) * speed * deltaSeconds;
      this.y += Math.sin(angle) * speed * deltaSeconds;

      // Check if collected
      if (distance < 20) {
        this.collect(player);
      }
    }
  }

  /**
   * Collect the orb
   * @param {Object} player - Player collecting the orb
   */
  collect(player) {
    // Notify scene
    this.scene.events.emit('xp-collected', {
      xpValue: this.xpValue,
      x: this.x,
      y: this.y
    });

    // Collection animation
    this.scene.tweens.add({
      targets: this,
      scale: 2,
      alpha: 0,
      duration: 150,
      onComplete: () => {
        this.deactivate();
      }
    });

    // Visual feedback (sparkle)
    this.createCollectionEffect();
  }

  /**
   * Create visual effect when collected
   */
  createCollectionEffect() {
    // Create sparkle particles
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      const speed = 100;

      const particle = this.scene.add.circle(this.x, this.y, 3, 0xffaa00);

      this.scene.tweens.add({
        targets: particle,
        x: this.x + Math.cos(angle) * 30,
        y: this.y + Math.sin(angle) * 30,
        alpha: 0,
        scale: 0,
        duration: 300,
        onComplete: () => particle.destroy()
      });
    }
  }

  /**
   * Deactivate orb (return to pool)
   */
  deactivate() {
    this.active = false;
    this.setActive(false);
    this.setVisible(false);
    this.isBeingPulled = false;

    // Stop all tweens
    this.scene.tweens.killTweensOf(this);

    // Destroy glow
    if (this.glowCircle) {
      this.scene.tweens.killTweensOf(this.glowCircle);
      this.glowCircle.destroy();
      this.glowCircle = null;
    }
  }
}
