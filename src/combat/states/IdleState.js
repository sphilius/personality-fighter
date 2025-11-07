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

    // Apply deceleration in idle (smooth stop)
    const deltaSeconds = delta / 1000;
    if (Math.abs(fighter.velocity.x) > 5) {
      const decel = fighter.deceleration * deltaSeconds;
      if (fighter.velocity.x > 0) {
        fighter.velocity.x = Math.max(0, fighter.velocity.x - decel);
      } else {
        fighter.velocity.x = Math.min(0, fighter.velocity.x + decel);
      }
    } else {
      fighter.velocity.x = 0;
    }
  }

  canTransitionTo(toState) {
    // From idle, can go to any state except downed (unless hit hard enough)
    if (toState === 'downed') {
      return false;
    }
    return true;
  }
}
