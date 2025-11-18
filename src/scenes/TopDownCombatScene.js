import Phaser from 'phaser';
import Fighter from '../combat/Fighter.js';
import ProjectileManager from '../systems/ProjectileManager.js';
import WaveManager from '../systems/WaveManager.js';

/**
 * TopDownCombatScene - Main combat arena for top-down action RPG gameplay
 * Handles player movement, camera, and wave-based combat
 */
export default class TopDownCombatScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TopDownCombatScene' });
  }

  init(data) {
    // Receive data from previous scene (personality class)
    this.playerClass = data.playerClass || 'paladin';
    this.personalityScores = data.personalityScores || {};

    console.log(`TopDownCombatScene initialized with class: ${this.playerClass}`);
  }

  create() {
    const { width, height } = this.cameras.main;

    // Create simple arena background
    this.createArena(width, height);

    // Create player at center
    this.createPlayer(width / 2, height / 2);

    // Initialize game systems
    this.projectileManager = new ProjectileManager(this, 100);
    this.waveManager = new WaveManager(this);

    // Setup camera
    this.setupCamera();

    // Setup input
    this.setupInput();

    // UI
    this.createUI();

    // Setup event listeners
    this.setupEventListeners();

    // Start first wave after a delay
    this.time.delayedCall(2000, () => {
      this.waveManager.startWave();
    });

    console.log('TopDownCombatScene: Ready for combat!');
  }

  createArena(width, height) {
    // Simple background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Arena boundaries (visual)
    const arenaWidth = 1600;
    const arenaHeight = 1200;
    const arenaX = width / 2;
    const arenaY = height / 2;

    // Floor
    this.add.rectangle(arenaX, arenaY, arenaWidth, arenaHeight, 0x2d2d44);

    // Border
    const border = this.add.graphics();
    border.lineStyle(4, 0x00ff88, 1);
    border.strokeRect(
      arenaX - arenaWidth / 2,
      arenaY - arenaHeight / 2,
      arenaWidth,
      arenaHeight
    );

    // Grid lines for visual reference
    const gridSize = 100;
    const gridLines = this.add.graphics();
    gridLines.lineStyle(1, 0x3d3d5c, 0.3);

    for (let x = arenaX - arenaWidth / 2; x <= arenaX + arenaWidth / 2; x += gridSize) {
      gridLines.moveTo(x, arenaY - arenaHeight / 2);
      gridLines.lineTo(x, arenaY + arenaHeight / 2);
    }

    for (let y = arenaY - arenaHeight / 2; y <= arenaY + arenaHeight / 2; y += gridSize) {
      gridLines.moveTo(arenaX - arenaWidth / 2, y);
      gridLines.lineTo(arenaX + arenaWidth / 2, y);
    }

    gridLines.strokePath();

    // Store arena bounds for collision
    this.arenaBounds = {
      left: arenaX - arenaWidth / 2,
      right: arenaX + arenaWidth / 2,
      top: arenaY - arenaHeight / 2,
      bottom: arenaY + arenaHeight / 2
    };
  }

  createPlayer(x, y) {
    // Create player fighter
    this.player = new Fighter(this, x, y, 'Player', this.playerClass);
    this.player.mouseAim = true; // Enable mouse aiming
    this.player.setTint(0x00ff88); // Player color

    // Enable auto-attack (Vampire Survivors style)
    this.player.autoAttackEnabled = true;
    this.player.autoAttackCooldown = 500; // 0.5 seconds
    this.player.autoAttackDamage = 15;

    // Visual placeholder (will be replaced with sprites)
    if (!this.player.hasSprite) {
      this.player.setDisplaySize(40, 40);
      this.player.setOrigin(0.5, 0.5); // Center origin for top-down
    }
  }

  setupCamera() {
    // Camera follows player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Camera bounds (larger than viewport for smooth scrolling)
    this.cameras.main.setBounds(
      this.arenaBounds.left - 200,
      this.arenaBounds.top - 200,
      (this.arenaBounds.right - this.arenaBounds.left) + 400,
      (this.arenaBounds.bottom - this.arenaBounds.top) + 400
    );

    // Zoom (adjust as needed)
    this.cameras.main.setZoom(1);
  }

  setupInput() {
    // WASD keys
    this.keys = {
      W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // Arrow keys (alternative)
    this.cursors = this.input.keyboard.createCursorKeys();

    // Mouse pointer for aiming
    this.input.on('pointermove', (pointer) => {
      // Store mouse position in world coordinates
      this.mouseWorldX = pointer.worldX;
      this.mouseWorldY = pointer.worldY;
    });

    // Debug: ESC to return to menu
    this.input.keyboard.on('keydown-ESC', () => {
      console.log('Returning to main menu...');
      this.scene.start('MainMenuScene');
    });
  }

  createUI() {
    // Fixed UI container (doesn't scroll with camera)
    const uiContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(100);

    // Health bar
    const hpBarX = 20;
    const hpBarY = 20;
    const hpBarWidth = 200;
    const hpBarHeight = 20;

    this.hpBarBg = this.add.rectangle(hpBarX, hpBarY, hpBarWidth, hpBarHeight, 0x000000, 0.7)
      .setOrigin(0, 0);

    this.hpBarFill = this.add.rectangle(hpBarX + 2, hpBarY + 2, hpBarWidth - 4, hpBarHeight - 4, 0xff0000)
      .setOrigin(0, 0);

    this.hpText = this.add.text(hpBarX + hpBarWidth / 2, hpBarY + hpBarHeight / 2, '', {
      fontSize: '12px',
      color: '#ffffff'
    }).setOrigin(0.5);

    uiContainer.add([this.hpBarBg, this.hpBarFill, this.hpText]);

    // Class name
    this.classText = this.add.text(20, 50, `Class: ${this.playerClass.toUpperCase()}`, {
      fontSize: '14px',
      color: '#00ff88'
    }).setOrigin(0, 0).setScrollFactor(0).setDepth(100);

    // Wave info
    this.waveText = this.add.text(this.cameras.main.width - 20, 20, '', {
      fontSize: '18px',
      color: '#ffaa00',
      fontStyle: 'bold'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.enemyCountText = this.add.text(this.cameras.main.width - 20, 45, '', {
      fontSize: '14px',
      color: '#ff4444'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // Controls hint
    this.controlsText = this.add.text(20, this.cameras.main.height - 60,
      'WASD: Move | Mouse: Aim | Shoot automatically | ESC: Menu', {
      fontSize: '12px',
      color: '#888888'
    }).setOrigin(0, 1).setScrollFactor(0).setDepth(100);

    // Debug position text
    this.debugText = this.add.text(20, 80, '', {
      fontSize: '10px',
      color: '#666666'
    }).setOrigin(0, 0).setScrollFactor(0).setDepth(100);
  }

  setupEventListeners() {
    // Listen for enemy killed event
    this.events.on('enemy-killed', (data) => {
      console.log('Enemy killed! XP:', data.xpValue);
      // Future: Spawn XP orb here
    });

    // Listen for wave events
    this.events.on('wave-start', (waveNum) => {
      this.showWaveText(`Wave ${waveNum}`);
    });

    this.events.on('wave-complete', (waveNum) => {
      this.showWaveText(`Wave ${waveNum} Complete!`);
    });
  }

  showWaveText(text) {
    // Create temporary text in center of screen
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    const waveText = this.add.text(centerX, centerY, text, {
      fontSize: '48px',
      color: '#ffaa00',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150);

    // Fade out and destroy
    this.tweens.add({
      targets: waveText,
      alpha: 0,
      y: centerY - 50,
      duration: 2000,
      onComplete: () => waveText.destroy()
    });
  }

  update(time, delta) {
    // Handle player input
    this.handlePlayerInput();

    // Update player
    this.player.update(delta);

    // Constrain player to arena bounds
    this.constrainPlayerToArena();

    // Update game systems
    this.updateCombat(time, delta);

    // Update UI
    this.updateUI();
  }

  updateCombat(time, delta) {
    // Update wave manager (spawns and updates enemies)
    this.waveManager.update(delta, this.player);

    // Update projectiles
    this.projectileManager.update(delta);

    // Player auto-attack
    this.player.tryAutoAttack((config) => {
      this.projectileManager.fire(config);
    });

    // Check collisions
    this.checkCollisions();
  }

  checkCollisions() {
    const enemies = this.waveManager.getEnemies();
    const projectiles = this.projectileManager.getActiveProjectiles('player');

    // Check projectile vs enemy collisions
    projectiles.forEach(projectile => {
      enemies.forEach(enemy => {
        if (this.projectileManager.checkCollision(projectile, enemy)) {
          // Damage enemy
          const died = enemy.takeDamage(projectile.damage);

          // Deactivate projectile
          projectile.onHit();

          if (died) {
            console.log('Enemy defeated!');
          }
        }
      });
    });

    // Future: Check enemy vs player collision
  }

  handlePlayerInput() {
    // Calculate movement direction from WASD/Arrow keys
    let moveX = 0;
    let moveY = 0;

    // Horizontal
    if (this.keys.A.isDown || this.cursors.left.isDown) {
      moveX = -1;
    } else if (this.keys.D.isDown || this.cursors.right.isDown) {
      moveX = 1;
    }

    // Vertical
    if (this.keys.W.isDown || this.cursors.up.isDown) {
      moveY = -1;
    } else if (this.keys.S.isDown || this.cursors.down.isDown) {
      moveY = 1;
    }

    // Set player movement
    this.player.setMoveDirection(moveX, moveY);

    // Update facing direction based on mouse
    if (this.mouseWorldX !== undefined && this.mouseWorldY !== undefined) {
      this.player.setFacingFromMouse(this.mouseWorldX, this.mouseWorldY);
    }
  }

  constrainPlayerToArena() {
    // Keep player within arena bounds
    this.player.x = Phaser.Math.Clamp(
      this.player.x,
      this.arenaBounds.left + 20,
      this.arenaBounds.right - 20
    );
    this.player.y = Phaser.Math.Clamp(
      this.player.y,
      this.arenaBounds.top + 20,
      this.arenaBounds.bottom - 20
    );
  }

  updateUI() {
    // Update health bar
    const hpPercent = this.player.currentHP / this.player.maxHP;
    this.hpBarFill.width = (200 - 4) * hpPercent;
    this.hpText.setText(`HP: ${Math.ceil(this.player.currentHP)}/${this.player.maxHP}`);

    // Update wave info
    const wave = this.waveManager.getCurrentWave();
    const enemyCount = this.waveManager.getEnemies().length;
    this.waveText.setText(`Wave ${wave}`);
    this.enemyCountText.setText(`Enemies: ${enemyCount}`);

    // Update debug text
    const projectileCount = this.projectileManager.getActiveProjectiles().length;
    this.debugText.setText(
      `Pos: (${Math.floor(this.player.x)}, ${Math.floor(this.player.y)})\n` +
      `Vel: (${Math.floor(this.player.velocity.x)}, ${Math.floor(this.player.velocity.y)})\n` +
      `State: ${this.player.stateMachine.getCurrentState()}\n` +
      `Facing: ${Math.floor(Phaser.Math.RadToDeg(this.player.facingAngle))}°\n` +
      `Projectiles: ${projectileCount}`
    );
  }
}
