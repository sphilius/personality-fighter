import State from './State.js';

export default class AttackingState extends State {
  constructor() {
    super('attacking');
    this.currentMove = null;
    this.startupFrames = 0;
    this.activeFrames = 0;
    this.recoveryFrames = 0;
    this.totalFrames = 0;
  }

  enter(fighter, moveData) {
    super.enter(fighter);

    // Store move data
    this.currentMove = moveData;
    this.startupFrames = moveData.frames.startup;
    this.activeFrames = moveData.frames.active;
    this.recoveryFrames = moveData.frames.recovery;
    this.totalFrames = this.startupFrames + this.activeFrames + this.recoveryFrames;

    // Stop movement - handled manually in Fighter class

    // Play attack animation (if available)
    if (fighter.scene && fighter.scene.anims && moveData.animationKey) {
      if (fighter.scene.anims.exists(moveData.animationKey)) {
        fighter.play(moveData.animationKey, true);
      }
    }

    console.log(`${fighter.name} attacking with ${moveData.name}: ${this.totalFrames} total frames`);
  }

  update(fighter, delta) {
    super.update(fighter, delta);

    const currentFrame = this.frameCount;

    // Startup phase (vulnerable, no hitbox)
    if (currentFrame < this.startupFrames) {
      fighter.attackPhase = 'startup';
      fighter.hitboxActive = false;
    }
    // Active phase (hitbox active)
    else if (currentFrame < this.startupFrames + this.activeFrames) {
      fighter.attackPhase = 'active';
      fighter.hitboxActive = true;

      // Activate hitbox on first active frame
      if (currentFrame === this.startupFrames && fighter.onHitboxActivate) {
        fighter.onHitboxActivate(this.currentMove);
      }
    }
    // Recovery phase (vulnerable, no hitbox)
    else if (currentFrame < this.totalFrames) {
      fighter.attackPhase = 'recovery';
      fighter.hitboxActive = false;
    }
    // Move complete
    else {
      fighter.hitboxActive = false;
      fighter.stateMachine.transition('idle');
    }
  }

  exit(fighter) {
    super.exit(fighter);
    fighter.hitboxActive = false;
    fighter.attackPhase = null;
    this.currentMove = null;
  }

  canTransitionTo(toState) {
    // Can't transition out of attacking except to hit/downed or when move completes
    if (toState === 'hit' || toState === 'downed') {
      return true; // Being hit interrupts attack
    }
    if (toState === 'idle' && this.frameCount >= this.totalFrames) {
      return true; // Attack finished
    }
    return false;
  }
}
