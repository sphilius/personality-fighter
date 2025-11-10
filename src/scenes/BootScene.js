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
    // This spritesheet format uses 56x56 frames and TWO files per character

    // Generic fighter (using Brullov's generic_char pack)
    // File 1: idle, attack, run, jump, damage, death, spell, crouch, shield
    this.load.spritesheet('fighter_generic_1', 'assets/fighters/char_blue_1.png', {
      frameWidth: 56,
      frameHeight: 56,
    });

    // File 2: walking, sliding, critical attack, ladder climbing
    this.load.spritesheet('fighter_generic_2', 'assets/fighters/char_blue_2.png', {
      frameWidth: 56,
      frameHeight: 56,
    });

    // Future: Other color variants or class-specific fighters
    // this.load.spritesheet('fighter_green_1', 'assets/fighters/char_green_1.png', { frameWidth: 56, frameHeight: 56 });
    // this.load.spritesheet('fighter_green_2', 'assets/fighters/char_green_2.png', { frameWidth: 56, frameHeight: 56 });

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
    // Check if spritesheets loaded successfully
    const hasSheet1 = this.textures.exists('fighter_generic_1');
    const hasSheet2 = this.textures.exists('fighter_generic_2');

    if (!hasSheet1 || !hasSheet2) {
      console.warn('Fighter spritesheets not loaded - animations will be skipped');
      return;
    }

    // Animation configuration for Brullov's generic_char pack
    // Frame size: 56x56 pixels
    // Layout: Irregular grid with different frame counts per animation

    const anims = this.anims;

    // IDLE - char_blue_1.png, frames 0-5 (6 frames)
    anims.create({
      key: 'generic_idle',
      frames: anims.generateFrameNumbers('fighter_generic_1', { start: 0, end: 5 }),
      frameRate: 8,
      repeat: -1,
    });

    // WALK - char_blue_2.png, frames 0-7 (8 frames)
    anims.create({
      key: 'generic_walk',
      frames: anims.generateFrameNumbers('fighter_generic_2', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    // LIGHT ATTACK - char_blue_1.png, frames 6-13 (8 frames)
    // Attack state: 5+3+7 = 15 frames @ 60fps = 0.25s
    // Animation: 8 frames / 0.25s = 32 fps
    anims.create({
      key: 'generic_light',
      frames: anims.generateFrameNumbers('fighter_generic_1', { start: 6, end: 13 }),
      frameRate: 32,
      repeat: 0,
    });

    // HEAVY ATTACK - char_blue_2.png, frames 22-29 (8 frames, critical attack)
    // Attack state: 12+5+15 = 32 frames @ 60fps = 0.533s
    // Animation: 8 frames / 0.533s = 15 fps
    anims.create({
      key: 'generic_heavy',
      frames: anims.generateFrameNumbers('fighter_generic_2', { start: 22, end: 29 }),
      frameRate: 15,
      repeat: 0,
    });

    // BLOCK - char_blue_1.png, frames 61-63 (3 frames, shield defense)
    anims.create({
      key: 'generic_block',
      frames: anims.generateFrameNumbers('fighter_generic_1', { start: 61, end: 63 }),
      frameRate: 8,
      repeat: -1,
    });

    // HIT REACTION - char_blue_1.png, frames 38-41 (4 frames, taking damage)
    anims.create({
      key: 'generic_hit',
      frames: anims.generateFrameNumbers('fighter_generic_1', { start: 38, end: 41 }),
      frameRate: 15,
      repeat: 0,
    });

    // DOWNED/DEATH - char_blue_1.png, frames 42-49 (8 frames)
    anims.create({
      key: 'generic_downed',
      frames: anims.generateFrameNumbers('fighter_generic_1', { start: 42, end: 49 }),
      frameRate: 10,
      repeat: 0,
    });

    // JUMP - char_blue_1.png, frames 22-37 (16 frames, full jump sequence)
    // Includes: jump prep, flying up, jumping reload, falling, landing
    anims.create({
      key: 'generic_jump',
      frames: anims.generateFrameNumbers('fighter_generic_1', { start: 22, end: 37 }),
      frameRate: 20,
      repeat: 0,
    });

    console.log('Fighter animations created successfully (Brullov generic_char pack)');
  }
}
