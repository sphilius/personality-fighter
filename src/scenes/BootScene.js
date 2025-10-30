import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Preload loading bar assets here (if any)
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Loading...', {
      font: '48px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);
  }

  create() {
    // Set up asset loading system here (if any)

    // For now, we'll just transition to the MenuScene
    this.scene.start('MenuScene');
  }
}
