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

    // Stop current actions - velocity handled manually
    fighter.hitboxActive = false;

    // Apply knockback
    if (this.knockback.x !== 0 || this.knockback.y !== 0) {
      fighter.x += this.knockback.x;
      fighter.y += this.knockback.y;
    }

    // Play hit animation (if available)
    if (fighter.scene && fighter.scene.anims) {
      const animKey = `${fighter.fighterType}_hit`;
      if (fighter.scene.anims.exists(animKey)) {
        fighter.play(animKey, true);
      }
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
