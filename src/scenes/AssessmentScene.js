import Phaser from 'phaser';

export default class AssessmentScene extends Phaser.Scene {
  constructor() {
    super('AssessmentScene');
  }

  create() {
    // Add placeholder text
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'The Proving Grounds', {
      font: '96px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);
  }

  update() {
    // This method is called once per frame
  }
}
