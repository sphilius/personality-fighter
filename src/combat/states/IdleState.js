import State from './State.js';

export default class IdleState extends State {
  constructor() {
    super('idle');
  }

  enter(fighter) {
    super.enter(fighter);
    fighter.setVelocity(0, 0);

    // Play idle animation
    if (fighter.anims) {
      fighter.anims.play(`${fighter.fighterType}_idle`, true);
    }
  }

  update(fighter, delta) {
    super.update(fighter, delta);

    // Idle state can transition to any other state based on input
    // This is the "neutral" state
  }

  canTransitionTo(toState) {
    // From idle, can go to any state except downed (unless hit hard enough)
    if (toState === 'downed') {
      return false;
    }
    return true;
  }
}
