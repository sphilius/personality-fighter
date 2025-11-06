import State from './State.js';

export default class BlockingState extends State {
  constructor() {
    super('blocking');
    this.damageReduction = 0.5; // Block reduces damage by 50%
  }

  enter(fighter) {
    super.enter(fighter);

    // Stop movement
    fighter.setVelocity(0, 0);
    fighter.isBlocking = true;

    // Play block animation
    if (fighter.anims) {
      fighter.anims.play(`${fighter.fighterType}_block`, true);
    }

    console.log(`${fighter.name} is blocking`);
  }

  update(fighter, delta) {
    super.update(fighter, delta);

    // Block state is maintained by input
    // Will exit when player releases block button
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
