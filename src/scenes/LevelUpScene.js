import Phaser from 'phaser';

/**
 * LevelUpScene - Shown when player levels up to choose upgrades
 */
export default class LevelUpScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelUpScene' });
  }

  init(data) {
    this.playerLevel = data.level || 2;
    this.playerClass = data.playerClass || 'paladin';
    this.parentScene = data.parentScene;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Semi-transparent overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

    // Title
    this.add.text(width / 2, height / 2 - 250, `LEVEL ${this.playerLevel}!`, {
      fontSize: '64px',
      color: '#ffaa00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, height / 2 - 180, 'Choose an upgrade:', {
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Generate upgrade choices
    const upgrades = this.generateUpgradeChoices();

    // Display upgrade choices (3 cards)
    const cardSpacing = 320;
    const startX = width / 2 - cardSpacing;

    upgrades.forEach((upgrade, index) => {
      this.createUpgradeCard(startX + index * cardSpacing, height / 2, upgrade);
    });

    // Instructions
    this.add.text(width / 2, height - 100, 'Click an upgrade to continue', {
      fontSize: '18px',
      color: '#888888'
    }).setOrigin(0.5);
  }

  /**
   * Generate random upgrade choices
   */
  generateUpgradeChoices() {
    const allUpgrades = [
      {
        id: 'damage',
        name: 'Increased Damage',
        description: '+20% Attack Damage',
        icon: '⚔️',
        apply: (player) => {
          player.autoAttackDamage = Math.floor(player.autoAttackDamage * 1.2);
        }
      },
      {
        id: 'fire_rate',
        name: 'Faster Attacks',
        description: '-15% Attack Cooldown',
        icon: '⚡',
        apply: (player) => {
          player.autoAttackCooldown = Math.floor(player.autoAttackCooldown * 0.85);
        }
      },
      {
        id: 'speed',
        name: 'Movement Speed',
        description: '+10% Move Speed',
        icon: '👟',
        apply: (player) => {
          player.stats.speed = Math.floor(player.stats.speed * 1.1);
        }
      },
      {
        id: 'health',
        name: 'Max Health',
        description: '+20 Max HP',
        icon: '❤️',
        apply: (player) => {
          player.maxHP += 20;
          player.heal(20);
        }
      },
      {
        id: 'projectile_speed',
        name: 'Projectile Speed',
        description: '+25% Bullet Speed',
        icon: '🎯',
        apply: (player) => {
          player.autoAttackSpeed = Math.floor(player.autoAttackSpeed * 1.25);
        }
      },
      {
        id: 'hp_regen',
        name: 'Regeneration',
        description: '+5 HP per wave complete',
        icon: '🌟',
        apply: (player) => {
          // This will be handled in combat scene
          player.hasRegen = true;
        }
      }
    ];

    // Randomly pick 3
    const shuffled = Phaser.Utils.Array.Shuffle([...allUpgrades]);
    return shuffled.slice(0, 3);
  }

  /**
   * Create upgrade card UI
   */
  createUpgradeCard(x, y, upgrade) {
    const cardWidth = 280;
    const cardHeight = 320;

    // Card container
    const card = this.add.container(x, y);

    // Background
    const bg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x1a1a2e, 1);
    bg.setStrokeStyle(4, 0x00ff88, 1);

    // Icon
    const icon = this.add.text(0, -80, upgrade.icon, {
      fontSize: '64px'
    }).setOrigin(0.5);

    // Name
    const name = this.add.text(0, -10, upgrade.name, {
      fontSize: '24px',
      color: '#ffaa00',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: cardWidth - 40 }
    }).setOrigin(0.5);

    // Description
    const desc = this.add.text(0, 50, upgrade.description, {
      fontSize: '18px',
      color: '#cccccc',
      align: 'center',
      wordWrap: { width: cardWidth - 40 }
    }).setOrigin(0.5);

    // Add to card
    card.add([bg, icon, name, desc]);

    // Make interactive
    bg.setInteractive({ useHandCursor: true });

    // Hover effects
    bg.on('pointerover', () => {
      bg.setStrokeStyle(4, 0xffaa00, 1);
      this.tweens.add({
        targets: card,
        scale: 1.05,
        duration: 150
      });
    });

    bg.on('pointerout', () => {
      bg.setStrokeStyle(4, 0x00ff88, 1);
      this.tweens.add({
        targets: card,
        scale: 1,
        duration: 150
      });
    });

    bg.on('pointerdown', () => {
      this.selectUpgrade(upgrade);
    });

    return card;
  }

  /**
   * Player selected an upgrade
   */
  selectUpgrade(upgrade) {
    console.log('Selected upgrade:', upgrade.name);

    // Flash effect
    const { width, height } = this.cameras.main;
    const flash = this.add.rectangle(width / 2, height / 2, width, height, 0xffaa00, 0.3);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      onComplete: () => flash.destroy()
    });

    // Apply upgrade to player
    if (this.parentScene && this.parentScene.player) {
      upgrade.apply(this.parentScene.player);

      // Store upgrade for later (future: track build)
      if (!this.parentScene.player.upgrades) {
        this.parentScene.player.upgrades = [];
      }
      this.parentScene.player.upgrades.push(upgrade.id);
    }

    // Close level up scene
    this.time.delayedCall(300, () => {
      this.scene.resume('TopDownCombatScene');
      this.scene.stop('LevelUpScene');
    });
  }
}
