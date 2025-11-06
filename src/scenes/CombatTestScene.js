import Phaser from 'phaser';
import Fighter from '../combat/Fighter.js';

/**
 * Combat Test Scene
 * Test the fighter state machine and basic combat
 */
export default class CombatTestScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CombatTestScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a3a);

    // Ground line
    const groundY = height - 200;
    this.add.line(width / 2, groundY, 0, 0, width, 0, 0x4a4a7a, 0.8).setLineWidth(3);

    // Create two fighters for testing
    this.player = new Fighter(this, width / 2 - 300, groundY, 'Player');
    this.player.setTint(0x44ff44); // Green

    this.opponent = new Fighter(this, width / 2 + 300, groundY, 'Opponent');
    this.opponent.setTint(0xff4444); // Red
    this.opponent.facingRight = false;
    this.opponent.setFlipX(true);

    // Instructions
    this.createInstructions();

    // Keyboard controls
    this.setupControls();

    // State display
    this.createStateDisplay();

    console.log('Combat Test Scene ready!');
  }

  createInstructions() {
    const instructions = [
      'COMBAT STATE MACHINE TEST',
      '',
      'Controls:',
      'A/D - Move Left/Right',
      'W - Jump',
      'J - Light Attack (10 dmg)',
      'K - Heavy Attack (25 dmg)',
      'L - Block (hold)',
      'Space - Take Damage (test)',
      '',
      'Physics: Gravity, acceleration, jumps!',
    ];

    this.add.text(20, 20, instructions.join('\n'), {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 10 },
    });
  }

  setupControls() {
    this.keys = {
      w: this.input.keyboard.addKey('W'),
      a: this.input.keyboard.addKey('A'),
      s: this.input.keyboard.addKey('S'),
      d: this.input.keyboard.addKey('D'),
      j: this.input.keyboard.addKey('J'),
      k: this.input.keyboard.addKey('K'),
      l: this.input.keyboard.addKey('L'),
      space: this.input.keyboard.addKey('SPACE'),
    };

    // Attack on key press
    this.keys.j.on('down', () => {
      this.player.attack({
        name: 'Light Attack',
        damage: 10,
        frames: { startup: 5, active: 3, recovery: 7 },
        animationKey: 'generic_light',
      });
    });

    this.keys.k.on('down', () => {
      this.player.attack({
        name: 'Heavy Attack',
        damage: 25,
        frames: { startup: 12, active: 5, recovery: 15 },
        animationKey: 'generic_heavy',
      });
    });

    this.keys.l.on('down', () => {
      this.player.startBlock();
    });

    this.keys.l.on('up', () => {
      this.player.stopBlock();
    });

    // Jump on W key
    this.keys.w.on('down', () => {
      this.player.jump();
    });

    // Test damage
    this.keys.space.on('down', () => {
      this.player.takeDamage(15, { x: 50, y: 0 });
    });
  }

  createStateDisplay() {
    this.stateText = this.add.text(this.cameras.main.width - 20, 20, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 10, y: 10 },
      align: 'right',
    });
    this.stateText.setOrigin(1, 0);
  }

  update(time, delta) {
    // Handle movement input
    let moveX = 0;
    let moveY = 0;

    if (this.keys.a.isDown) moveX = -1;
    if (this.keys.d.isDown) moveX = 1;
    if (this.keys.w.isDown) moveY = -1;
    if (this.keys.s.isDown) moveY = 1;

    this.player.setMoveDirection(moveX, moveY);

    // Update fighters
    this.player.update(delta);
    this.opponent.update(delta);

    // Update state display
    this.updateStateDisplay();
  }

  updateStateDisplay() {
    const playerState = this.player.stateMachine.getCurrentState();
    const playerFrame = this.player.stateMachine.currentState.frameCount;

    const info = [
      `Player State: ${playerState.toUpperCase()}`,
      `Frame: ${playerFrame}`,
      `HP: ${this.player.currentHP}/${this.player.maxHP}`,
      `Meter: ${Math.round(this.player.currentMeter)}/${this.player.maxMeter}`,
      `Blocking: ${this.player.isBlocking}`,
      `Hitbox: ${this.player.hitboxActive}`,
    ];

    this.stateText.setText(info.join('\n'));
  }
}
