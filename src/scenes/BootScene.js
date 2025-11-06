import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 320, height / 2 - 30, 640, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5, 0.5);

    // Update progress bar
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 310, height / 2 - 20, 620 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load assets (placeholder for now - we'll add actual assets later)
    // this.load.image('observer', 'assets/observer.png');
  }

  create() {
    // Create white pixel texture for particles
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, 0, 2, 2);
    graphics.generateTexture('white', 2, 2);
    graphics.destroy();

    // Initialize game data
    if (!this.registry.get('personalityScores')) {
      this.registry.set('personalityScores', {
        H: 0,  // Honesty-Humility
        E: 0,  // Emotionality
        X: 0,  // eXtraversion
        A: 0,  // Agreeableness
        C: 0,  // Conscientiousness
        O: 0,  // Openness
      });
    }

    if (!this.registry.get('currentScenario')) {
      this.registry.set('currentScenario', 0);
    }

    // Start the intro scene
    this.scene.start('IntroScene');
  }
}
