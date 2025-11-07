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
      const animKey = `${fighter.fighterType}_walk`;
      if (fighter.anims.exists(animKey)) {
        fighter.anims.play(animKey, true);
      }
    }
  }

  update(fighter, delta) {
    super.update(fighter, delta);

    const deltaSeconds = delta / 1000;
    const targetSpeed = fighter.stats.speed * fighter.moveDirection.x;

    // Accelerate/decelerate toward target speed (snappier movement)
    if (Math.abs(targetSpeed - fighter.velocity.x) < 10) {
      // Close enough, snap to target
      fighter.velocity.x = targetSpeed;
    } else if (targetSpeed > fighter.velocity.x) {
      // Accelerate right
      fighter.velocity.x += fighter.acceleration * deltaSeconds;
      fighter.velocity.x = Math.min(fighter.velocity.x, targetSpeed);
    } else {
      // Accelerate left or decelerate
      const accel = (fighter.moveDirection.x === 0) ? fighter.deceleration : fighter.acceleration;
      fighter.velocity.x -= accel * deltaSeconds;
      fighter.velocity.x = Math.max(fighter.velocity.x, targetSpeed);
    }

    // Update facing direction
    if (fighter.moveDirection.x > 0) {
      fighter.facingRight = true;
      fighter.setFlipX(false);
    } else if (fighter.moveDirection.x < 0) {
      fighter.facingRight = false;
      fighter.setFlipX(true);
    }
  }

  exit(fighter) {
    super.exit(fighter);
    // Apply deceleration when stopping
    fighter.moveDirection.x = 0;
  }

  canTransitionTo(toState) {
    // Can't move while attacking, blocking, or hit
    if (toState === 'attacking' || toState === 'blocking' || toState === 'hit' || toState === 'downed') {
      return true; // These override movement
    }
    return true;
  }
}
