/**
 * FighterAI - Controls a fighter with artificial intelligence
 * Makes decisions based on game state and opponent behavior
 */
export default class FighterAI {
  constructor(fighter, opponent, difficulty = 'intermediate') {
    this.fighter = fighter;
    this.opponent = opponent;
    this.difficulty = difficulty;

    // Decision-making timing
    this.decisionInterval = 100; // Make decision every 100ms
    this.timeSinceLastDecision = 0;
    this.currentDecision = null;

    // Reaction delay (makes AI feel more human)
    this.reactionDelay = this.getReactionDelay(difficulty);
    this.pendingAction = null;
    this.actionDelayTimer = 0;

    // Behavior parameters
    this.aggressiveness = 0.6; // 60% chance to attack when in range
    this.blockChance = 0.5; // 50% chance to block when opponent attacks
    this.optimalRange = 100; // Preferred distance from opponent

    // Attack cooldown (prevent spam)
    this.attackCooldown = 0;
    this.minAttackCooldown = 300; // 300ms between attacks

    console.log(`AI initialized for ${fighter.name} (${difficulty} difficulty)`);
  }

  /**
   * Get reaction delay based on difficulty
   */
  getReactionDelay(difficulty) {
    switch (difficulty) {
      case 'beginner':
        return 500; // 500ms delay (slow)
      case 'intermediate':
        return 300; // 300ms delay (average)
      case 'advanced':
        return 150; // 150ms delay (fast)
      default:
        return 300;
    }
  }

  /**
   * Update AI (called every frame)
   */
  update(delta) {
    // Update timers
    this.timeSinceLastDecision += delta;
    this.attackCooldown = Math.max(0, this.attackCooldown - delta);

    // Execute pending action after reaction delay
    if (this.pendingAction) {
      this.actionDelayTimer += delta;
      if (this.actionDelayTimer >= this.reactionDelay) {
        this.executeAction(this.pendingAction);
        this.pendingAction = null;
        this.actionDelayTimer = 0;
      }
    }

    // Make new decision if enough time has passed
    if (this.timeSinceLastDecision >= this.decisionInterval) {
      this.makeDecision();
      this.timeSinceLastDecision = 0;
    }

    // Continue executing current decision
    this.executeContinuousActions();
  }

  /**
   * Make a decision based on current game state
   */
  makeDecision() {
    // Don't make decisions if fighter is not in control
    if (!this.fighter.stateMachine.canAct()) {
      this.currentDecision = null;
      return;
    }

    const distance = this.getDistanceToOpponent();
    const opponentState = this.opponent.stateMachine.getCurrentState();

    // Priority 1: Block if opponent is attacking and we're in range
    if (opponentState === 'attacking' && distance < 150) {
      if (Math.random() < this.blockChance) {
        this.queueAction('block');
        return;
      }
    }

    // Priority 2: Attack if close enough and off cooldown
    if (distance < 120 && this.attackCooldown <= 0) {
      if (Math.random() < this.aggressiveness) {
        // Choose between light and heavy attack
        const attackType = Math.random() < 0.7 ? 'light' : 'heavy';
        this.queueAction('attack', attackType);
        this.attackCooldown = this.minAttackCooldown;
        return;
      }
    }

    // Priority 3: Move towards opponent if too far
    if (distance > this.optimalRange + 50) {
      this.queueAction('moveForward');
      return;
    }

    // Priority 4: Move away if too close (except when attacking)
    if (distance < this.optimalRange - 50) {
      this.queueAction('moveBackward');
      return;
    }

    // Priority 5: Stop blocking if we were blocking
    if (this.fighter.stateMachine.isInState('blocking')) {
      this.queueAction('stopBlock');
      return;
    }

    // Default: Idle/stop moving
    this.queueAction('idle');
  }

  /**
   * Queue an action with reaction delay
   */
  queueAction(action, data = null) {
    this.pendingAction = { action, data };
    this.actionDelayTimer = 0;
  }

  /**
   * Execute a queued action
   */
  executeAction(actionData) {
    const { action, data } = actionData;

    switch (action) {
      case 'attack':
        this.performAttack(data);
        this.currentDecision = 'attacking';
        break;

      case 'block':
        if (!this.fighter.stateMachine.isInState('blocking')) {
          this.fighter.startBlock();
          this.currentDecision = 'blocking';
        }
        break;

      case 'stopBlock':
        if (this.fighter.stateMachine.isInState('blocking')) {
          this.fighter.stopBlock();
          this.currentDecision = null;
        }
        break;

      case 'moveForward':
        this.currentDecision = 'moveForward';
        break;

      case 'moveBackward':
        this.currentDecision = 'moveBackward';
        break;

      case 'idle':
        this.currentDecision = null;
        break;
    }
  }

  /**
   * Execute continuous actions (like movement)
   */
  executeContinuousActions() {
    // Handle movement
    if (this.currentDecision === 'moveForward') {
      // Move towards opponent
      const direction = this.opponent.x > this.fighter.x ? 1 : -1;
      this.fighter.setMoveDirection(direction);
    } else if (this.currentDecision === 'moveBackward') {
      // Move away from opponent
      const direction = this.opponent.x > this.fighter.x ? -1 : 1;
      this.fighter.setMoveDirection(direction);
    } else if (this.currentDecision !== 'attacking' && this.currentDecision !== 'blocking') {
      // Stop moving if not doing anything else
      this.fighter.setMoveDirection(0);
    }
  }

  /**
   * Perform an attack
   */
  performAttack(attackType) {
    if (attackType === 'light') {
      this.fighter.attack({
        name: 'AI Light Attack',
        damage: 10,
        frames: { startup: 5, active: 3, recovery: 7 },
        animationKey: 'generic_light',
      });
    } else if (attackType === 'heavy') {
      this.fighter.attack({
        name: 'AI Heavy Attack',
        damage: 25,
        frames: { startup: 12, active: 5, recovery: 15 },
        animationKey: 'generic_heavy',
      });
    }
  }

  /**
   * Get distance to opponent
   */
  getDistanceToOpponent() {
    return Math.abs(this.fighter.x - this.opponent.x);
  }

  /**
   * Reset AI state
   */
  reset() {
    this.currentDecision = null;
    this.pendingAction = null;
    this.actionDelayTimer = 0;
    this.attackCooldown = 0;
    this.fighter.setMoveDirection(0);
  }
}
