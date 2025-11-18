import Projectile from '../combat/Projectile.js';

/**
 * ProjectileManager - Manages projectile pooling and updates
 */
export default class ProjectileManager {
  constructor(scene, poolSize = 100) {
    this.scene = scene;
    this.projectiles = [];

    // Create object pool
    for (let i = 0; i < poolSize; i++) {
      const projectile = new Projectile(scene, 0, 0);
      this.projectiles.push(projectile);
    }

    console.log(`ProjectileManager: Created pool of ${poolSize} projectiles`);
  }

  /**
   * Fire a projectile
   * @param {Object} config - Projectile configuration
   * @returns {Projectile|null} - The fired projectile or null if pool exhausted
   */
  fire(config) {
    // Find inactive projectile from pool
    const projectile = this.projectiles.find(p => !p.active);

    if (!projectile) {
      console.warn('ProjectileManager: Pool exhausted!');
      return null;
    }

    // Fire it
    projectile.fire(config);
    return projectile;
  }

  /**
   * Update all active projectiles
   * @param {number} delta - Time since last frame (ms)
   */
  update(delta) {
    this.projectiles.forEach(projectile => {
      if (projectile.active) {
        projectile.update(delta);
      }
    });
  }

  /**
   * Get all active projectiles
   * @param {string} owner - Filter by owner ('player', 'enemy', or null for all)
   * @returns {Array<Projectile>}
   */
  getActiveProjectiles(owner = null) {
    return this.projectiles.filter(p => {
      if (!p.active) return false;
      if (owner && p.owner !== owner) return false;
      return true;
    });
  }

  /**
   * Check collision between projectile and target
   * @param {Projectile} projectile
   * @param {Phaser.GameObjects.Sprite} target
   * @returns {boolean}
   */
  checkCollision(projectile, target) {
    const distance = Phaser.Math.Distance.Between(
      projectile.x, projectile.y,
      target.x, target.y
    );

    // Simple circle collision (adjust radius as needed)
    const collisionRadius = 20;
    return distance < collisionRadius;
  }

  /**
   * Deactivate all projectiles
   */
  clear() {
    this.projectiles.forEach(p => p.deactivate());
  }
}
