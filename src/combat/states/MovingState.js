import State from './State.js';

export default class MovingState extends State {
  constructor() {
    super('moving');
    this.moveSpeed = 200; // pixels per second
  }

  enter(fighter) {
    super.enter(fighter);

    // Play walk/run animation (if available)
    if (fighter.anims) {
      const direction = fighter.facingRight ? 'right' : 'left';
      const animKey = `${fighter.fighterType}_walk_${direction}`;
      if (fighter.anims.exists(animKey)) {
        fighter.anims.play(animKey, true);
      }
    }
  }

  update(fighter, delta) {
    super.update(fighter, delta);

    // Apply movement based on input
    if (fighter.moveDirection) {
      const velocity = this.moveSpeed * (delta / 1000);
      fighter.x += fighter.moveDirection.x * velocity;
      fighter.y += fighter.moveDirection.y * velocity;

      // Update facing direction
      if (fighter.moveDirection.x > 0) {
        fighter.facingRight = true;
        fighter.setFlipX(false);
      } else if (fighter.moveDirection.x < 0) {
        fighter.facingRight = false;
        fighter.setFlipX(true);
      }
    }
  }

  exit(fighter) {
    super.exit(fighter);
    // Velocity handled manually in Fighter class
  }

  canTransitionTo(toState) {
    // Can't move while attacking, blocking, or hit
    if (toState === 'attacking' || toState === 'blocking' || toState === 'hit' || toState === 'downed') {
      return true; // These override movement
    }
    return true;
  }
}
