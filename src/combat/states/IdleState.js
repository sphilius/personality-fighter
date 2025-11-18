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

    // Apply friction in idle (smooth stop on both axes)
    const deltaSeconds = delta / 1000;
    const friction = fighter.friction * deltaSeconds;

    // X axis friction
    if (Math.abs(fighter.velocity.x) > 5) {
      if (fighter.velocity.x > 0) {
        fighter.velocity.x = Math.max(0, fighter.velocity.x - friction);
      } else {
        fighter.velocity.x = Math.min(0, fighter.velocity.x + friction);
      }
    } else {
      fighter.velocity.x = 0;
    }

    // Y axis friction
    if (Math.abs(fighter.velocity.y) > 5) {
      if (fighter.velocity.y > 0) {
        fighter.velocity.y = Math.max(0, fighter.velocity.y - friction);
      } else {
        fighter.velocity.y = Math.min(0, fighter.velocity.y + friction);
      }
    } else {
      fighter.velocity.y = 0;
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
