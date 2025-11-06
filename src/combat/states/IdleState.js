import State from './State.js';

export default class IdleState extends State {
  constructor() {
    super('idle');
  }

  enter(fighter) {
    super.enter(fighter);
    // Velocity handled manually in Fighter class, not via physics

    // Play idle animation (if available)
    if (fighter.anims) {
      const animKey = `${fighter.fighterType}_idle`;
      if (fighter.anims.exists(animKey)) {
        fighter.anims.play(animKey, true);
      }
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
