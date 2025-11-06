import State from './State.js';

export default class DownedState extends State {
  constructor() {
    super('downed');
    this.downDuration = 60; // frames until can get up (1 second at 60fps)
  }

  enter(fighter) {
    super.enter(fighter);

    // Fighter is knocked down
    fighter.setVelocity(0, 0);
    fighter.hitboxActive = false;
    fighter.isVulnerable = false; // Can't be hit while getting up

    // Play knockdown animation
    if (fighter.anims) {
      fighter.anims.play(`${fighter.fighterType}_downed`, true);
    }

    console.log(`${fighter.name} is downed!`);
  }

  update(fighter, delta) {
    super.update(fighter, delta);

    // Auto-recover after duration
    if (this.frameCount >= this.downDuration) {
      fighter.stateMachine.transition('idle');
    }
  }

  exit(fighter) {
    super.exit(fighter);
    fighter.isVulnerable = true;
  }

  canTransitionTo(toState) {
    // Can only exit to idle after recovery time
    if (toState === 'idle' && this.frameCount >= this.downDuration) {
      return true;
    }
    return false;
  }
}
