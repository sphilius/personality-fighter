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

    // Load fighter spritesheets
    // Note: These will fail gracefully if files don't exist yet
    // Fighter spritesheets should be in public/assets/fighters/

    // Generic fighter (placeholder/default)
    this.load.spritesheet('fighter_generic', 'assets/fighters/fighter_generic.png', {
      frameWidth: 128,
      frameHeight: 128,
    });

    // Future: Class-specific fighters
    // this.load.spritesheet('fighter_paladin', 'assets/fighters/paladin.png', { frameWidth: 128, frameHeight: 128 });
    // this.load.spritesheet('fighter_shadow_dancer', 'assets/fighters/shadow_dancer.png', { frameWidth: 128, frameHeight: 128 });

    // Handle load errors gracefully
    this.load.on('loaderror', (file) => {
      console.warn(`Asset not found: ${file.key} - Will use placeholder graphics`);
    });
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

    // Create fighter animations (if spritesheets loaded successfully)
    this.createFighterAnimations();

    // Start the main menu
    this.scene.start('MainMenuScene');
  }

  createFighterAnimations() {
    // Only create animations if the spritesheet loaded successfully
    if (!this.textures.exists('fighter_generic')) {
      console.warn('fighter_generic spritesheet not loaded - animations will be skipped');
      return;
    }

    // Animation configuration
    // Assumes spritesheet layout (128x128 frames):
    // Row 0 (frames 0-7): Idle animation
    // Row 1 (frames 8-15): Walk animation
    // Row 2 (frames 16-23): Light attack animation
    // Row 3 (frames 24-31): Heavy attack animation
    // Row 4 (frames 32-39): Block animation
    // Row 5 (frames 40-47): Hit reaction animation
    // Row 6 (frames 48-55): Downed animation
    // Row 7 (frames 56-63): Jump animation

    const anims = this.anims;

    // Generic fighter animations
    anims.create({
      key: 'generic_idle',
      frames: anims.generateFrameNumbers('fighter_generic', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: 'generic_walk',
      frames: anims.generateFrameNumbers('fighter_generic', { start: 8, end: 15 }),
      frameRate: 12,
      repeat: -1,
    });

    anims.create({
      key: 'generic_light',
      frames: anims.generateFrameNumbers('fighter_generic', { start: 16, end: 23 }),
      frameRate: 15,
      repeat: 0,
    });

    anims.create({
      key: 'generic_heavy',
      frames: anims.generateFrameNumbers('fighter_generic', { start: 24, end: 31 }),
      frameRate: 12,
      repeat: 0,
    });

    anims.create({
      key: 'generic_block',
      frames: anims.generateFrameNumbers('fighter_generic', { start: 32, end: 39 }),
      frameRate: 10,
      repeat: -1,
    });

    anims.create({
      key: 'generic_hit',
      frames: anims.generateFrameNumbers('fighter_generic', { start: 40, end: 47 }),
      frameRate: 15,
      repeat: 0,
    });

    anims.create({
      key: 'generic_downed',
      frames: anims.generateFrameNumbers('fighter_generic', { start: 48, end: 55 }),
      frameRate: 10,
      repeat: 0,
    });

    anims.create({
      key: 'generic_jump',
      frames: anims.generateFrameNumbers('fighter_generic', { start: 56, end: 63 }),
      frameRate: 15,
      repeat: 0,
    });

    console.log('Fighter animations created successfully');
  }
}
