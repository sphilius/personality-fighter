import Phaser from 'phaser';
import PersonalityScorer from '../systems/PersonalityScorer.js';
import DialogueBox from '../ui/DialogueBox.js';

export default class ResultsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultsScene' });
  }

  create() {
    try {
      const width = this.cameras.main.width;
      const height = this.cameras.main.height;

      // Get personality scores
      const scores = this.registry.get('personalityScores');
      console.log('Personality Scores:', scores);

      // Calculate final class
      this.result = PersonalityScorer.calculateFinalClass(scores);
      console.log('Assigned Class:', this.result.abilityClass);

      this.classData = PersonalityScorer.getClassDescription(this.result.abilityClass);
      this.classColors = PersonalityScorer.getClassColors(this.result.abilityClass);

      // Store result
      this.registry.set('assignedClass', this.result.abilityClass);

      // Create background with class color
      this.createBackground();

      // Create dialogue box
      this.dialogueBox = new DialogueBox(this, width / 2, height - 150);

      // Start reveal sequence
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      this.time.delayedCall(1000, () => {
        this.startRevealSequence();
      });
    } catch (error) {
      console.error('Error in ResultsScene.create():', error);
      // Fallback: show simple text
      this.add.text(960, 540, 'Error loading results. Check console.', {
        fontSize: '32px',
        color: '#ff0000',
      }).setOrigin(0.5);
    }
  }

  createBackground() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Gradient background with class colors
    const graphics = this.add.graphics();
    const color1 = this.classColors.secondary;
    const color2 = this.classColors.primary;

    graphics.fillGradientStyle(color1, color1, color2, color2, 0.3);
    graphics.fillRect(0, 0, width, height);

    // Add class-colored particles (optional - don't break if it fails)
    try {
      if (this.textures.exists('white')) {
        const particles = this.add.particles(0, 0, 'white', {
          x: { min: 0, max: width },
          y: { min: 0, max: height },
          scale: { start: 0.2, end: 0 },
          alpha: { start: 0.6, end: 0 },
          tint: this.classColors.primary,
          lifespan: 3000,
          frequency: 150,
          blendMode: 'ADD',
        });
      }
    } catch (error) {
      console.warn('Could not create particles:', error);
    }

    // Create arena floor with class symbol
    this.createClassSymbol();
  }

  createClassSymbol() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Large circle with class color
    this.symbolCircle = this.add.circle(
      width / 2,
      height / 2,
      150,
      this.classColors.primary,
      0
    );
    this.symbolCircle.setStrokeStyle(6, this.classColors.primary, 0);

    // Add glow effect
    this.symbolGlow = this.add.circle(
      width / 2,
      height / 2,
      180,
      this.classColors.primary,
      0
    );
  }

  startRevealSequence() {
    console.log('Starting reveal sequence...');
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Sequence of reveals
    const sequence = [
      {
        action: () => {
          console.log('Step 1: Showing dialogue');
          this.dialogueBox.show('The arena has spoken. You are...');
        },
        delay: 2500,
      },
      {
        action: () => {
          console.log('Step 2: Revealing class name');
          this.revealClassName();
        },
        delay: 3000,
      },
      {
        action: () => {
          console.log('Step 3: Showing class description');
          this.dialogueBox.show(this.classData.description);
        },
        delay: 4000,
      },
      {
        action: () => {
          console.log('Step 4: Showing class details');
          this.showClassDetails();
        },
        delay: 5000,
      },
      {
        action: () => {
          console.log('Step 5: Showing continue button');
          this.showContinueButton();
        },
        delay: 2000,
      },
    ];

    this.playSequence(sequence, 0);
  }

  playSequence(sequence, index) {
    if (index >= sequence.length) {
      console.log('Sequence complete');
      return;
    }

    console.log(`Playing sequence step ${index + 1} of ${sequence.length}`);
    const step = sequence[index];

    try {
      step.action();
    } catch (error) {
      console.error(`Error in sequence step ${index}:`, error);
    }

    this.time.delayedCall(step.delay, () => {
      this.playSequence(sequence, index + 1);
    });
  }

  revealClassName() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Animate symbol
    this.tweens.add({
      targets: this.symbolCircle,
      alpha: 0.3,
      scale: { from: 0, to: 1 },
      duration: 1000,
      ease: 'Back.easeOut',
    });

    this.tweens.add({
      targets: this.symbolCircle,
      strokeAlpha: 1,
      duration: 1000,
      ease: 'Power2',
    });

    this.tweens.add({
      targets: this.symbolGlow,
      alpha: 0.2,
      scale: { from: 0, to: 1.2 },
      duration: 1000,
      ease: 'Power2',
    });

    // Flash effect
    this.cameras.main.flash(
      1000,
      (this.classColors.primary >> 16) & 0xFF,
      (this.classColors.primary >> 8) & 0xFF,
      this.classColors.primary & 0xFF
    );

    // Class name text
    this.time.delayedCall(500, () => {
      this.classTitle = this.add.text(
        width / 2,
        height / 2 - 50,
        this.classData.title,
        {
          fontFamily: 'Arial',
          fontSize: '72px',
          color: '#ffffff',
          align: 'center',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 6,
        }
      );
      this.classTitle.setOrigin(0.5, 0.5);
      this.classTitle.setAlpha(0);

      this.tweens.add({
        targets: this.classTitle,
        alpha: 1,
        y: height / 2,
        duration: 1000,
        ease: 'Power2',
      });

      // Subtitle
      this.classSubtitle = this.add.text(
        width / 2,
        height / 2 + 80,
        this.classData.subtitle,
        {
          fontFamily: 'Arial',
          fontSize: '36px',
          color: '#cccccc',
          align: 'center',
        }
      );
      this.classSubtitle.setOrigin(0.5, 0.5);
      this.classSubtitle.setAlpha(0);

      this.tweens.add({
        targets: this.classSubtitle,
        alpha: 1,
        duration: 1000,
        delay: 300,
        ease: 'Power2',
      });
    });
  }

  showClassDetails() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Hide previous elements
    this.tweens.add({
      targets: [this.classTitle, this.classSubtitle, this.symbolCircle, this.symbolGlow],
      alpha: 0,
      duration: 500,
    });

    this.dialogueBox.hide();

    // Show detailed information
    this.time.delayedCall(600, () => {
      // Class traits
      const traitsText = this.add.text(
        width / 2,
        height / 2 - 150,
        'Core Traits',
        {
          fontFamily: 'Arial',
          fontSize: '32px',
          color: '#ffffff',
          align: 'center',
          fontStyle: 'bold',
        }
      );
      traitsText.setOrigin(0.5, 0.5);

      const traits = this.classData.traits.map(t => `• ${t}`).join('\n');
      const traitsContent = this.add.text(
        width / 2,
        height / 2 - 70,
        traits,
        {
          fontFamily: 'Arial',
          fontSize: '28px',
          color: '#cccccc',
          align: 'center',
          lineSpacing: 10,
        }
      );
      traitsContent.setOrigin(0.5, 0.5);

      // Playstyle
      const playstyleTitle = this.add.text(
        width / 2,
        height / 2 + 50,
        'Combat Style',
        {
          fontFamily: 'Arial',
          fontSize: '32px',
          color: '#ffffff',
          align: 'center',
          fontStyle: 'bold',
        }
      );
      playstyleTitle.setOrigin(0.5, 0.5);

      const playstyleContent = this.add.text(
        width / 2,
        height / 2 + 120,
        this.classData.playstyle,
        {
          fontFamily: 'Arial',
          fontSize: '24px',
          color: '#cccccc',
          align: 'center',
          wordWrap: { width: 1000 },
        }
      );
      playstyleContent.setOrigin(0.5, 0.5);

      // HEXACO scores visualization
      this.showHEXACOScores(width / 2, height - 250);
    });
  }

  showHEXACOScores(x, y) {
    const scores = this.result.hexaco;
    const labels = {
      H: 'Honesty',
      E: 'Emotionality',
      X: 'Extraversion',
      A: 'Agreeableness',
      C: 'Conscientiousness',
      O: 'Openness',
    };

    const scoreText = this.add.text(x, y - 50, 'Personality Profile', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
      fontStyle: 'bold',
    });
    scoreText.setOrigin(0.5, 0.5);

    const barWidth = 200;
    const barHeight = 15;
    const spacing = 25;
    let offsetY = 0;

    Object.entries(scores).forEach(([key, value]) => {
      // Label
      const label = this.add.text(x - barWidth - 80, y + offsetY, labels[key], {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#cccccc',
      });
      label.setOrigin(0, 0.5);

      // Background bar
      const bgBar = this.add.rectangle(
        x - barWidth / 2,
        y + offsetY,
        barWidth,
        barHeight,
        0x333333,
        0.5
      );

      // Filled bar
      const fillWidth = (value / 100) * barWidth;
      const fillBar = this.add.rectangle(
        x - barWidth / 2 - (barWidth - fillWidth) / 2,
        y + offsetY,
        0,
        barHeight,
        this.classColors.primary,
        0.8
      );

      // Animate bar
      this.tweens.add({
        targets: fillBar,
        width: fillWidth,
        x: x - barWidth / 2 + fillWidth / 2 - barWidth / 2,
        duration: 1000,
        ease: 'Power2',
      });

      // Value text
      const valueText = this.add.text(x + barWidth / 2 + 20, y + offsetY, Math.round(value), {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#ffffff',
      });
      valueText.setOrigin(0, 0.5);

      offsetY += spacing;
    });
  }

  showContinueButton() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Continue button
    const button = this.add.rectangle(width / 2, height - 80, 300, 60, this.classColors.primary, 0.8);
    button.setStrokeStyle(3, 0xffffff, 1);
    button.setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(width / 2, height - 80, 'Continue', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5, 0.5);

    // Hover effects
    button.on('pointerover', () => {
      this.tweens.add({
        targets: [button, buttonText],
        scale: 1.1,
        duration: 200,
      });
    });

    button.on('pointerout', () => {
      this.tweens.add({
        targets: [button, buttonText],
        scale: 1,
        duration: 200,
      });
    });

    button.on('pointerdown', () => {
      this.continueToGame();
    });

    // Pulse effect
    this.tweens.add({
      targets: button,
      alpha: { from: 0.8, to: 1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }

  continueToGame() {
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.time.delayedCall(1000, () => {
      // For now, restart to intro (later this will go to main menu/game)
      console.log('Assessment complete! Assigned class:', this.result.abilityClass);
      console.log('HEXACO scores:', this.result.hexaco);

      // In a full implementation, this would go to main menu or character select
      // For now, show completion message
      this.scene.start('BootScene');
    });
  }
}
