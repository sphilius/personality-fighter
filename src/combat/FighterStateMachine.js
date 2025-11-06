import IdleState from './states/IdleState.js';
import MovingState from './states/MovingState.js';
import AttackingState from './states/AttackingState.js';
import BlockingState from './states/BlockingState.js';
import HitState from './states/HitState.js';
import DownedState from './states/DownedState.js';

/**
 * Fighter State Machine
 * Manages fighter behavior through state transitions
 */
export default class FighterStateMachine {
  constructor(fighter) {
    this.fighter = fighter;

    // Initialize all states
    this.states = {
      idle: new IdleState(),
      moving: new MovingState(),
      attacking: new AttackingState(),
      blocking: new BlockingState(),
      hit: new HitState(),
      downed: new DownedState(),
    };

    // Start in idle state
    this.currentState = this.states.idle;
    this.currentStateName = 'idle';
    this.previousStateName = null;

    // Transition queue for buffered inputs
    this.queuedTransition = null;

    console.log(`FighterStateMachine initialized for ${fighter.name}`);
  }

  /**
   * Transition to a new state
   * @param {string} stateName - Name of state to transition to
   * @param {Object} data - Optional data to pass to new state
   * @returns {boolean} - Success of transition
   */
  transition(stateName, data = null) {
    // Check if state exists
    if (!this.states[stateName]) {
      console.warn(`State "${stateName}" does not exist`);
      return false;
    }

    // Check if current state allows this transition
    if (!this.currentState.canTransitionTo(stateName)) {
      console.log(`Transition from ${this.currentStateName} to ${stateName} not allowed, queuing...`);
      // Queue the transition for later (input buffering)
      this.queuedTransition = { stateName, data };
      return false;
    }

    // Perform transition
    this.previousStateName = this.currentStateName;
    this.currentState.exit(this.fighter);

    this.currentStateName = stateName;
    this.currentState = this.states[stateName];
    this.currentState.enter(this.fighter, data);

    console.log(`Transitioned: ${this.previousStateName} → ${this.currentStateName}`);

    return true;
  }

  /**
   * Update current state (called every frame)
   * @param {number} delta - Time since last frame (ms)
   */
  update(delta) {
    // Update current state
    this.currentState.update(this.fighter, delta);

    // Check if queued transition can now execute
    if (this.queuedTransition) {
      const { stateName, data } = this.queuedTransition;
      if (this.currentState.canTransitionTo(stateName)) {
        this.queuedTransition = null;
        this.transition(stateName, data);
      }
    }
  }

  /**
   * Force transition without validation (use carefully!)
   * @param {string} stateName
   * @param {Object} data
   */
  forceTransition(stateName, data = null) {
    if (!this.states[stateName]) {
      console.warn(`State "${stateName}" does not exist`);
      return false;
    }

    this.previousStateName = this.currentStateName;
    this.currentState.exit(this.fighter);

    this.currentStateName = stateName;
    this.currentState = this.states[stateName];
    this.currentState.enter(this.fighter, data);

    console.log(`Force transitioned: ${this.previousStateName} → ${this.currentStateName}`);
    return true;
  }

  /**
   * Get current state name
   * @returns {string}
   */
  getCurrentState() {
    return this.currentStateName;
  }

  /**
   * Check if fighter is in a specific state
   * @param {string} stateName
   * @returns {boolean}
   */
  isInState(stateName) {
    return this.currentStateName === stateName;
  }

  /**
   * Check if fighter can act (not in hit/downed/attacking recovery)
   * @returns {boolean}
   */
  canAct() {
    return this.currentStateName === 'idle' ||
           this.currentStateName === 'moving' ||
           this.currentStateName === 'blocking';
  }
}
