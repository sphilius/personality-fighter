import XPOrb from '../combat/XPOrb.js';

/**
 * XPOrbManager - Manages XP orb pooling and spawning
 */
export default class XPOrbManager {
  constructor(scene, poolSize = 50) {
    this.scene = scene;
    this.orbs = [];

    // Create object pool
    for (let i = 0; i < poolSize; i++) {
      const orb = new XPOrb(scene, 0, 0);
      this.orbs.push(orb);
    }

    console.log(`XPOrbManager: Created pool of ${poolSize} XP orbs`);
  }

  /**
   * Spawn an XP orb
   * @param {Object} config - Orb configuration
   * @returns {XPOrb|null} - The spawned orb or null if pool exhausted
   */
  spawn(config) {
    // Find inactive orb from pool
    const orb = this.orbs.find(o => !o.active);

    if (!orb) {
      console.warn('XPOrbManager: Pool exhausted!');
      return null;
    }

    // Spawn it
    orb.spawn(config);
    return orb;
  }

  /**
   * Update all active orbs
   * @param {number} delta - Time since last frame (ms)
   * @param {Object} player - Player reference for attraction
   */
  update(delta, player) {
    this.orbs.forEach(orb => {
      if (orb.active) {
        orb.update(delta, player);
      }
    });
  }

  /**
   * Get all active orbs
   * @returns {Array<XPOrb>}
   */
  getActiveOrbs() {
    return this.orbs.filter(o => o.active);
  }

  /**
   * Clear all orbs
   */
  clear() {
    this.orbs.forEach(o => o.deactivate());
  }
}
