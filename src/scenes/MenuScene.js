import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Add title text
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 3, 'Personality Fighter', {
      font: '128px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // Add "Start Assessment" button
    const startButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 'Start Assessment', {
      font: '64px Arial',
      fill: '#0f0',
    }).setOrigin(0.5).setInteractive();

    // Handle button click/tap
    startButton.on('pointerdown', () => {
      this.scene.start('AssessmentScene');
    });
  }
}
