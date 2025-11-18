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

    // Normalize diagonal movement (8-directional)
    let dirX = fighter.moveDirection.x;
    let dirY = fighter.moveDirection.y;
    const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);

    if (magnitude > 0) {
      dirX /= magnitude;
      dirY /= magnitude;
    }

    // Calculate target velocity
    const targetVelocityX = fighter.stats.speed * dirX;
    const targetVelocityY = fighter.stats.speed * dirY;

    // Accelerate toward target velocity (X axis)
    if (Math.abs(targetVelocityX - fighter.velocity.x) < 10) {
      fighter.velocity.x = targetVelocityX;
    } else if (targetVelocityX > fighter.velocity.x) {
      fighter.velocity.x += fighter.acceleration * deltaSeconds;
      fighter.velocity.x = Math.min(fighter.velocity.x, targetVelocityX);
    } else {
      fighter.velocity.x -= fighter.acceleration * deltaSeconds;
      fighter.velocity.x = Math.max(fighter.velocity.x, targetVelocityX);
    }

    // Accelerate toward target velocity (Y axis)
    if (Math.abs(targetVelocityY - fighter.velocity.y) < 10) {
      fighter.velocity.y = targetVelocityY;
    } else if (targetVelocityY > fighter.velocity.y) {
      fighter.velocity.y += fighter.acceleration * deltaSeconds;
      fighter.velocity.y = Math.min(fighter.velocity.y, targetVelocityY);
    } else {
      fighter.velocity.y -= fighter.acceleration * deltaSeconds;
      fighter.velocity.y = Math.max(fighter.velocity.y, targetVelocityY);
    }

    // Update facing direction based on movement (if not using mouse aim)
    if (!fighter.mouseAim && magnitude > 0) {
      fighter.setFacingFromMovement(dirX, dirY);
    }
  }

  exit(fighter) {
    super.exit(fighter);
    // Reset move direction when stopping
    fighter.moveDirection.x = 0;
    fighter.moveDirection.y = 0;
  }

  canTransitionTo(toState) {
    // Can't move while attacking, blocking, or hit
    if (toState === 'attacking' || toState === 'blocking' || toState === 'hit' || toState === 'downed') {
      return true; // These override movement
    }
    return true;
  }
}
