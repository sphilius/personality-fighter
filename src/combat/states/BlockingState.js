import State from './State.js';

export default class BlockingState extends State {
  constructor() {
    super('blocking');
    this.damageReduction = 0.5; // Block reduces damage by 50%
  }

  enter(fighter) {
    super.enter(fighter);

    // Stop movement - handled manually
    fighter.isBlocking = true;

    // Play block animation (if available)
    if (fighter.anims) {
      const animKey = `${fighter.fighterType}_block`;
      if (fighter.anims.exists(animKey)) {
        fighter.anims.play(animKey, true);
      }
    }

    console.log(`${fighter.name} is blocking`);
  }

  update(fighter, delta) {
    super.update(fighter, delta);

    // Allow slow movement while blocking (250 speed max)
    const deltaSeconds = delta / 1000;
    const blockMoveSpeed = 250; // Slower than normal (400)
    const targetSpeed = blockMoveSpeed * fighter.moveDirection.x;

    // Accelerate/decelerate toward target speed
    if (Math.abs(targetSpeed - fighter.velocity.x) < 10) {
      fighter.velocity.x = targetSpeed;
    } else if (targetSpeed > fighter.velocity.x) {
      fighter.velocity.x += fighter.acceleration * deltaSeconds;
      fighter.velocity.x = Math.min(fighter.velocity.x, targetSpeed);
    } else {
      const accel = (fighter.moveDirection.x === 0) ? fighter.deceleration : fighter.acceleration;
      fighter.velocity.x -= accel * deltaSeconds;
      fighter.velocity.x = Math.max(fighter.velocity.x, targetSpeed);
    }

    // Update facing direction based on movement (if moving)
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
    fighter.isBlocking = false;
  }

  canTransitionTo(toState) {
    // Can exit block to idle or moving at any time
    // Can be hit while blocking (for blockstun)
    return true;
  }
}
