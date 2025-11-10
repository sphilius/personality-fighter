import Phaser from 'phaser';
import Fighter from '../combat/Fighter.js';
import FighterAI from '../combat/FighterAI.js';

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

    // Round management
    this.roundActive = true;
    this.roundOverText = null;

    // AI opponent
    this.opponentAI = new FighterAI(this.opponent, this.player, 'intermediate');

    console.log('Combat Test Scene ready!');
  }

  createInstructions() {
    const instructions = [
      'COMBAT vs AI OPPONENT',
      '',
      'Controls:',
      'A/D - Move Left/Right',
      'W - Jump',
      'J - Light Attack (10 dmg)',
      'K - Heavy Attack (25 dmg)',
      'L - Block (hold)',
      'R - Restart Round',
      '',
      'AI Difficulty: Intermediate',
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
      o: this.input.keyboard.addKey('O'),
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

    // Test damage (knockback pushes fighter AWAY from opponent)
    this.keys.space.on('down', () => {
      // Player is on left, push them LEFT (negative x)
      this.player.takeDamage(15, { x: -50, y: 0 });
    });

    // Test damage to opponent
    this.keys.o.on('down', () => {
      // Opponent is on right, push them RIGHT (positive x)
      this.opponent.takeDamage(15, { x: 50, y: 0 });
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

    // Handle movement input (only if round is active)
    if (this.roundActive) {
      let moveX = 0;

      if (this.keys.a.isDown) moveX = -1;
      if (this.keys.d.isDown) moveX = 1;

      this.player.setMoveDirection(moveX);
    }

    // Update fighters (always update for animations)
    this.player.update(delta);
    this.opponent.update(delta);

    // Update AI opponent (only if round is active)
    if (this.roundActive && this.opponentAI) {
      this.opponentAI.update(delta);
    }

    // Handle body collision between fighters
    this.player.handleCollision(this.opponent);

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

    // Reset AI
    if (this.opponentAI) {
      this.opponentAI.reset();
    }

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
