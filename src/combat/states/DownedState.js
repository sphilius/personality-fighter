import State from './State.js';

export default class DownedState extends State {
  constructor() {
    super('downed');
    this.downDuration = 60; // frames until can get up (1 second at 60fps)
  }

  enter(fighter) {
    super.enter(fighter);

    // Fighter is knocked down - velocity handled manually
    fighter.hitboxActive = false;
    fighter.isVulnerable = false; // Can't be hit while getting up

    // Play knockdown animation (if available)
    if (fighter.scene && fighter.scene.anims) {
      const animKey = `${fighter.fighterType}_downed`;
      if (fighter.scene.anims.exists(animKey)) {
        fighter.play(animKey, true);
      }
    }

    console.log(`${fighter.name} is downed!`);
  }

  update(fighter, delta) {
    super.update(fighter, delta);

    // If KO'd (HP = 0), stay down - don't auto-recover
    if (fighter.currentHP <= 0) {
      return; // Stay in downed state
    }

    // Auto-recover after duration (only if not KO'd)
    if (this.frameCount >= this.downDuration) {
      fighter.stateMachine.transition('idle');
    }
  }

  exit(fighter) {
    super.exit(fighter);
    fighter.isVulnerable = true;
  }

  canTransitionTo(toState) {
    // Can't transition if KO'd
    if (this.fighter && this.fighter.currentHP <= 0) {
      return false;
    }

    // Can only exit to idle after recovery time
    if (toState === 'idle' && this.frameCount >= this.downDuration) {
      return true;
    }
    return false;
  }
}
