import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a1a3a, 0x1a1a3a, 0x2a2a4a, 0x2a2a4a, 1);
    graphics.fillRect(0, 0, width, height);

    // Title
    this.add.text(width / 2, height / 4, 'PERSONALITY FIGHTER', {
      fontFamily: 'Arial',
      fontSize: '72px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#4af4ff',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height / 4 + 80, 'Phase 1 & 2 Development Build', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#cccccc',
    }).setOrigin(0.5);

    // Menu buttons
    this.createMenuButtons();

    // Version info
    this.add.text(width - 20, height - 20, 'v0.2.0-alpha | Phase 2 Combat System', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#666666',
    }).setOrigin(1, 1);
  }

  createMenuButtons() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const buttons = [
      {
        label: 'THE PROVING GROUNDS',
        subtitle: 'Personality Assessment (Phase 1)',
        color: 0xffd700,
        action: () => this.scene.start('IntroScene'),
      },
      {
        label: 'COMBAT TEST',
        subtitle: 'Fighter State Machine Demo (Phase 2)',
        color: 0xff4444,
        action: () => this.scene.start('CombatTestScene'),
      },
    ];

    buttons.forEach((btn, index) => {
      const y = height / 2 + index * 180;

      // Button background
      const bg = this.add.rectangle(width / 2, y, 700, 140, btn.color, 0.2);
      bg.setStrokeStyle(4, btn.color, 0.8);
      bg.setInteractive({ useHandCursor: true });

      // Button label
      const label = this.add.text(width / 2, y - 20, btn.label, {
        fontFamily: 'Arial',
        fontSize: '36px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // Button subtitle
      const subtitle = this.add.text(width / 2, y + 25, btn.subtitle, {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#cccccc',
      }).setOrigin(0.5);

      // Hover effects
      bg.on('pointerover', () => {
        this.tweens.add({
          targets: [bg, label, subtitle],
          scale: 1.05,
          duration: 200,
        });
        bg.setFillStyle(btn.color, 0.4);
      });

      bg.on('pointerout', () => {
        this.tweens.add({
          targets: [bg, label, subtitle],
          scale: 1,
          duration: 200,
        });
        bg.setFillStyle(btn.color, 0.2);
      });

      // Click handler
      bg.on('pointerdown', () => {
        this.tweens.add({
          targets: [bg, label, subtitle],
          scale: 0.95,
          duration: 100,
          yoyo: true,
          onComplete: () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
              btn.action();
            });
          },
        });
      });
    });

    // Instructions
    this.add.text(width / 2, height - 100, 'Click a button to continue', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#888888',
    }).setOrigin(0.5);
  }
}
