import Phaser from 'phaser';
import Fighter from '../combat/Fighter.js';
import CollisionSystem from '../combat/CollisionSystem.js';
import TouchControls from '../combat/TouchControls.js';

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

    // Collision system
    this.collisionSystem = new CollisionSystem(this, this.player, this.opponent);
    this.collisionSystem.setDebugMode(false); // Toggle with H key

    // Touch controls (optional - toggle with T key)
    this.touchControls = new TouchControls(this, this.player);
    this.touchEnabled = false; // Start with keyboard controls

    // Round management
    this.roundActive = true;
    this.roundOverText = null;

    console.log('Combat Test Scene ready!');
  }

  createInstructions() {
    const instructions = [
      'COMBAT STATE MACHINE TEST',
      '',
      'Keyboard Controls:',
      'A/D - Move Left/Right',
      'W - Jump',
      'J - Light Attack (10 dmg)',
      'K - Heavy Attack (25 dmg)',
      'L - Block (hold)',
      '',
      'Touch Controls (T to toggle):',
      'Left: Virtual joystick',
      'Right: Tap/Swipe to attack',
      '',
      'Debug:',
      'H - Toggle Hitbox Debug',
      'T - Toggle Touch/Keyboard',
      'R - Restart Round',
      '',
      'First to 0 HP loses!',
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
      h: this.input.keyboard.addKey('H'),
      t: this.input.keyboard.addKey('T'),
      o: this.input.keyboard.addKey('O'),
      space: this.input.keyboard.addKey('SPACE'),
    };

    // Attack on key press (only in keyboard mode)
    this.keys.j.on('down', () => {
      if (!this.touchEnabled) {
        this.player.attack({
          name: 'Light Attack',
          damage: 10,
          frames: { startup: 5, active: 3, recovery: 7 },
          animationKey: 'generic_light',
          hitbox: { x: 50, y: -60, width: 60, height: 50 }, // Forward punch hitbox
        });
      }
    });

    this.keys.k.on('down', () => {
      if (!this.touchEnabled) {
        this.player.attack({
          name: 'Heavy Attack',
          damage: 25,
          frames: { startup: 12, active: 5, recovery: 15 },
          animationKey: 'generic_heavy',
          hitbox: { x: 60, y: -80, width: 80, height: 70 }, // Larger kick hitbox
        });
      }
    });

    this.keys.l.on('down', () => {
      if (!this.touchEnabled) {
        this.player.startBlock();
      }
    });

    this.keys.l.on('up', () => {
      if (!this.touchEnabled) {
        this.player.stopBlock();
      }
    });

    // Jump on W key (only in keyboard mode)
    this.keys.w.on('down', () => {
      if (!this.touchEnabled) {
        this.player.jump();
      }
    });

    // Test damage
    this.keys.space.on('down', () => {
      this.player.takeDamage(15, { x: 50, y: 0 });
    });

    // Test damage to opponent
    this.keys.o.on('down', () => {
      this.opponent.takeDamage(15, { x: -50, y: 0 });
    });

    // Toggle hitbox debug
    this.keys.h.on('down', () => {
      this.collisionSystem.setDebugMode(!this.collisionSystem.debugMode);
      console.log(`Hitbox debug: ${this.collisionSystem.debugMode ? 'ON' : 'OFF'}`);
    });

    // Toggle touch controls
    this.keys.t.on('down', () => {
      this.touchEnabled = !this.touchEnabled;
      console.log(`Controls: ${this.touchEnabled ? 'TOUCH' : 'KEYBOARD'}`);
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
    // Check for KO
    if (this.roundActive) {
      if (this.player.currentHP <= 0) {
        this.endRound('OPPONENT WINS!');
      } else if (this.opponent.currentHP <= 0) {
        this.endRound('PLAYER WINS!');
      }
    }

    // Handle movement input (only if round is active and keyboard mode)
    if (this.roundActive && !this.touchEnabled) {
      let moveX = 0;

      if (this.keys.a.isDown) moveX = -1;
      if (this.keys.d.isDown) moveX = 1;

      this.player.setMoveDirection(moveX);
    }

    // Update fighters (always update for animations)
    this.player.update(delta);
    this.opponent.update(delta);

    // Handle body collision between fighters
    this.player.handleCollision(this.opponent);

    // Update collision detection (hitbox/hurtbox)
    if (this.roundActive) {
      this.collisionSystem.update();
    }

    // Update state display
    this.updateStateDisplay();
  }

  endRound(message) {
    this.roundActive = false;
    console.log(`Round over: ${message}`);

    // Display round over message
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    if (!this.roundOverText) {
      this.roundOverText = this.add.text(width / 2, height / 2 - 50, message, {
        fontFamily: 'Arial',
        fontSize: '64px',
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 8,
      });
      this.roundOverText.setOrigin(0.5);

      this.add.text(width / 2, height / 2 + 50, 'Press R to Restart', {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5);

      // Add R key for restart
      this.keys.r = this.input.keyboard.addKey('R');
      this.keys.r.on('down', () => {
        this.restartRound();
      });
    }
  }

  restartRound() {
    console.log('Restarting round...');

    // Reset fighters
    this.player.reset();
    this.opponent.reset();

    // Clear round over UI
    if (this.roundOverText) {
      this.roundOverText.destroy();
      this.roundOverText = null;
    }

    // Find and destroy the restart text
    this.children.list.forEach(child => {
      if (child.text === 'Press R to Restart') {
        child.destroy();
      }
    });

    // Restart round
    this.roundActive = true;
  }

  updateStateDisplay() {
    const playerState = this.player.stateMachine.getCurrentState();
    const playerFrame = this.player.stateMachine.currentState.frameCount;
    const opponentState = this.opponent.stateMachine.getCurrentState();

    const info = [
      `Player State: ${playerState.toUpperCase()}`,
      `Frame: ${playerFrame}`,
      `HP: ${this.player.currentHP}/${this.player.maxHP}`,
      `Meter: ${Math.round(this.player.currentMeter)}/${this.player.maxMeter}`,
      `Blocking: ${this.player.isBlocking}`,
      `Hitbox: ${this.player.hitboxActive}`,
      '',
      `--- OPPONENT ---`,
      `State: ${opponentState.toUpperCase()}`,
      `HP: ${this.opponent.currentHP}/${this.opponent.maxHP}`,
      `Meter: ${Math.round(this.opponent.currentMeter)}/${this.opponent.maxMeter}`,
    ];

    this.stateText.setText(info.join('\n'));
  }
}
