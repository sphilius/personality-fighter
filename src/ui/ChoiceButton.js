import Phaser from 'phaser';

export default class ChoiceButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, choiceData) {
    super(scene, x, y);

    this.scene = scene;
    this.choiceData = choiceData;
    this.isDisabled = false;

    this.create();
    this.setupInteractivity();

    scene.add.existing(this);
  }

  create() {
    const { label, subtitle, color } = this.choiceData;

    // Background
    this.background = this.scene.add.rectangle(0, 0, 350, 200, color, 0.3);
    this.background.setStrokeStyle(4, color, 0.8);
    this.add(this.background);

    // Label text
    this.labelText = this.scene.add.text(0, -30, label, {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffffff',
      align: 'center',
      fontStyle: 'bold',
    });
    this.labelText.setOrigin(0.5, 0.5);
    this.add(this.labelText);

    // Subtitle text
    this.subtitleText = this.scene.add.text(0, 20, subtitle, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#cccccc',
      align: 'center',
      wordWrap: { width: 320 },
    });
    this.subtitleText.setOrigin(0.5, 0.5);
    this.add(this.subtitleText);

    // Gesture hint (if provided)
    if (this.choiceData.gesture) {
      this.gestureText = this.scene.add.text(0, 70, `[${this.choiceData.gesture}]`, {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#888888',
        align: 'center',
      });
      this.gestureText.setOrigin(0.5, 0.5);
      this.add(this.gestureText);
    }

    // Glow effect
    this.glow = this.scene.add.rectangle(0, 0, 360, 210, color, 0);
    this.add(this.glow);
    this.sendToBack(this.glow);

    // Initial entrance animation
    this.setAlpha(0);
    this.setScale(0.8);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut',
    });
  }

  setupInteractivity() {
    this.background.setInteractive({ useHandCursor: true });

    // Hover effects
    this.background.on('pointerover', () => {
      if (this.isDisabled) return;

      this.scene.tweens.add({
        targets: this,
        scale: 1.05,
        duration: 200,
        ease: 'Power2',
      });

      this.scene.tweens.add({
        targets: this.glow,
        alpha: 0.3,
        duration: 200,
      });

      // Pulse border
      this.scene.tweens.add({
        targets: this.background,
        scaleX: 1.02,
        scaleY: 1.02,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    });

    this.background.on('pointerout', () => {
      if (this.isDisabled) return;

      this.scene.tweens.add({
        targets: this,
        scale: 1,
        duration: 200,
      });

      this.scene.tweens.add({
        targets: this.glow,
        alpha: 0,
        duration: 200,
      });

      this.scene.tweens.killTweensOf(this.background);
      this.background.setScale(1, 1);
    });

    // Click handler
    this.background.on('pointerdown', () => {
      if (this.isDisabled) return;

      // Flash effect
      this.scene.tweens.add({
        targets: this,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: () => {
          this.emit('selected', this.choiceData);
        },
      });
    });

    // Keyboard support (for desktop testing)
    if (this.choiceData.id === 'A') {
      this.scene.input.keyboard.on('keydown-ONE', () => {
        if (!this.isDisabled) this.emit('selected', this.choiceData);
      });
    } else if (this.choiceData.id === 'B') {
      this.scene.input.keyboard.on('keydown-TWO', () => {
        if (!this.isDisabled) this.emit('selected', this.choiceData);
      });
    } else if (this.choiceData.id === 'C') {
      this.scene.input.keyboard.on('keydown-THREE', () => {
        if (!this.isDisabled) this.emit('selected', this.choiceData);
      });
    }
  }

  disable() {
    this.isDisabled = true;
    this.background.disableInteractive();

    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 300,
    });
  }

  destroy() {
    super.destroy();
  }
}
