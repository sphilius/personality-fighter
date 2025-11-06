import State from './State.js';

export default class HitState extends State {
  constructor() {
    super('hit');
    this.hitstunDuration = 20; // frames of hitstun
    this.knockback = { x: 0, y: 0 };
  }

  enter(fighter, damageData) {
    super.enter(fighter);

    // Apply hitstun
    this.hitstunDuration = damageData.hitstun || 20;
    this.knockback = damageData.knockback || { x: 0, y: 0 };

    // Stop current actions
    fighter.setVelocity(0, 0);
    fighter.hitboxActive = false;

    // Apply knockback
    if (this.knockback.x !== 0 || this.knockback.y !== 0) {
      fighter.x += this.knockback.x;
      fighter.y += this.knockback.y;
    }

    // Play hit animation
    if (fighter.anims) {
      fighter.anims.play(`${fighter.fighterType}_hit`, true);
    }

    // Visual feedback
    fighter.setTint(0xff0000);
    fighter.scene.time.delayedCall(100, () => {
      fighter.clearTint();
    });

    console.log(`${fighter.name} hit! Hitstun: ${this.hitstunDuration} frames, Knockback: ${JSON.stringify(this.knockback)}`);
  }

  update(fighter, delta) {
    super.update(fighter, delta);

    // Exit hitstun after duration
    if (this.frameCount >= this.hitstunDuration) {
      fighter.stateMachine.transition('idle');
    }
  }

  canTransitionTo(toState) {
    // Can only exit to idle after hitstun, or to downed if hit again
    if (toState === 'downed') {
      return true;
    }
    if (toState === 'idle' && this.frameCount >= this.hitstunDuration) {
      return true;
    }
    return false;
  }
}
