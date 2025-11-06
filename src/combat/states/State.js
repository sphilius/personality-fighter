/**
 * Base State class for Fighter State Machine
 * All fighter states extend this
 */

export default class State {
  constructor(name) {
    this.name = name;
    this.frameCount = 0;
  }

  /**
   * Called when entering this state
   * @param {Object} fighter - The fighter entering this state
   */
  enter(fighter) {
    this.frameCount = 0;
    console.log(`${fighter.name} entering state: ${this.name}`);
  }

  /**
   * Called every frame while in this state
   * @param {Object} fighter - The fighter in this state
   * @param {number} delta - Time since last frame (ms)
   */
  update(fighter, delta) {
    this.frameCount++;
  }

  /**
   * Called when exiting this state
   * @param {Object} fighter - The fighter exiting this state
   */
  exit(fighter) {
    console.log(`${fighter.name} exiting state: ${this.name} (${this.frameCount} frames)`);
  }

  /**
   * Check if this state can transition to another state
   * @param {string} toState - Name of state to transition to
   * @returns {boolean}
   */
  canTransitionTo(toState) {
    return true; // Override in subclasses for specific rules
  }
}
