import Phaser from 'phaser';
import scenarios from '../data/scenarios.js';
import DialogueBox from '../ui/DialogueBox.js';
import ChoiceButton from '../ui/ChoiceButton.js';

export default class AssessmentScene extends Phaser.Scene {
  constructor() {
    super({ key: 'AssessmentScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Get current scenario index
    this.currentScenarioIndex = this.registry.get('currentScenario') || 0;
    this.currentScenario = scenarios[this.currentScenarioIndex];

    // Create background
    this.createBackground();

    // Create Observer
    this.createObserver();

    // Create scenario progress indicator
    this.createProgressIndicator();

    // Create dialogue box
    this.dialogueBox = new DialogueBox(this, width / 2, height - 150);

    // Start scenario presentation
    this.presentScenario();
  }

  createBackground() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Gradient background based on scenario
    const colors = [
      [0x1a1a3a, 0x3a2a1a], // Scenario 1: Golden treasure
      [0x0a0a1a, 0x1a0a2a], // Scenario 2: Dark shadows
      [0x1a1a3a, 0x2a2a3a], // Scenario 3: Reflective mirror
      [0x2a2a1a, 0x3a3a2a], // Scenario 4: Earthy bridge
      [0x2a1a1a, 0x3a2a2a], // Scenario 5: Intense battle
      [0x2a1a3a, 0x3a2a4a], // Scenario 6: Mystical power
    ];

    const colorPair = colors[this.currentScenarioIndex] || [0x1a1a3a, 0x2a2a3a];

    const graphics = this.add.graphics();
    graphics.fillGradientStyle(...colorPair, ...colorPair, 1);
    graphics.fillRect(0, 0, width, height);

    // Add ambient particles
    this.createAmbientEffects();
  }

  createAmbientEffects() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Different particle effects for each scenario
    const particleConfigs = {
      0: { tint: 0xffd700, scale: 0.15 }, // Golden
      1: { tint: 0x440044, scale: 0.2 }, // Shadow
      2: { tint: 0x4444ff, scale: 0.1 }, // Mirror
      3: { tint: 0x888844, scale: 0.15 }, // Earth
      4: { tint: 0xff4444, scale: 0.2 }, // Battle
      5: { tint: 0xaa44ff, scale: 0.15 }, // Power
    };

    const config = particleConfigs[this.currentScenarioIndex];

    const particles = this.add.particles(0, 0, 'white', {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      scale: { start: config.scale, end: 0 },
      alpha: { start: 0.4, end: 0 },
      tint: config.tint,
      lifespan: 4000,
      frequency: 300,
      blendMode: 'ADD',
    });
  }

  createObserver() {
    const width = this.cameras.main.width;

    // Observer text at top
    this.observerText = this.add.text(width / 2, 100, 'The Observer', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#4af4ff',
      align: 'center',
    });
    this.observerText.setOrigin(0.5, 0.5);
    this.observerText.setAlpha(0.7);
  }

  createProgressIndicator() {
    const width = this.cameras.main.width;

    // Show scenario progress (e.g., "Trial 3 of 6")
    this.progressText = this.add.text(width - 50, 50,
      `Trial ${this.currentScenarioIndex + 1} of 6`, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
      align: 'right',
    });
    this.progressText.setOrigin(1, 0);

    // Progress dots
    const dotSpacing = 40;
    const startX = width / 2 - (6 * dotSpacing) / 2;

    this.progressDots = [];
    for (let i = 0; i < 6; i++) {
      const dot = this.add.circle(
        startX + i * dotSpacing,
        50,
        8,
        i < this.currentScenarioIndex ? 0x4af4ff : 0x444444,
        i <= this.currentScenarioIndex ? 1 : 0.3
      );
      this.progressDots.push(dot);

      if (i === this.currentScenarioIndex) {
        // Pulse current dot
        this.tweens.add({
          targets: dot,
          scale: { from: 1, to: 1.3 },
          alpha: { from: 0.8, to: 1 },
          duration: 800,
          yoyo: true,
          repeat: -1,
        });
      }
    }
  }

  presentScenario() {
    const scenario = this.currentScenario;

    // Fade in
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Show scenario description
    this.time.delayedCall(1000, () => {
      this.dialogueBox.show(scenario.description);
    });

    this.time.delayedCall(3500, () => {
      this.dialogueBox.show(scenario.setup);
    });

    // Show choice buttons after setup
    this.time.delayedCall(6000, () => {
      this.showChoices();
    });
  }

  showChoices() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const scenario = this.currentScenario;

    this.dialogueBox.hide();

    // Create choice buttons
    const buttonSpacing = 450;
    const startX = width / 2 - buttonSpacing;

    this.choiceButtons = [];

    scenario.choices.forEach((choice, index) => {
      const x = startX + index * buttonSpacing;
      const y = height / 2 + 100;

      const button = new ChoiceButton(this, x, y, choice);
      button.on('selected', () => this.onChoiceSelected(choice));
      this.choiceButtons.push(button);
    });

    // Add choice prompt text
    this.choicePromptText = this.add.text(width / 2, height / 2 - 100,
      'Choose your path...', {
      fontFamily: 'Arial',
      fontSize: '36px',
      color: '#ffffff',
      align: 'center',
    });
    this.choicePromptText.setOrigin(0.5, 0.5);

    // Pulse effect
    this.tweens.add({
      targets: this.choicePromptText,
      alpha: { from: 0.6, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  onChoiceSelected(choice) {
    // Disable all buttons
    this.choiceButtons.forEach(btn => btn.disable());

    // Update personality scores
    const scores = this.registry.get('personalityScores');
    Object.entries(choice.scores).forEach(([dimension, value]) => {
      scores[dimension] = (scores[dimension] || 0) + value;
    });
    this.registry.set('personalityScores', scores);

    // Show narrative feedback
    this.choicePromptText.destroy();
    this.dialogueBox.show(choice.narrative);

    // Visual feedback
    this.cameras.main.flash(500,
      (choice.color >> 16) & 0xFF,
      (choice.color >> 8) & 0xFF,
      choice.color & 0xFF
    );

    // Move to next scenario or results
    this.time.delayedCall(3000, () => {
      this.nextScenario();
    });
  }

  nextScenario() {
    // Clean up
    this.choiceButtons.forEach(btn => btn.destroy());
    this.dialogueBox.hide();

    const nextIndex = this.currentScenarioIndex + 1;

    if (nextIndex < scenarios.length) {
      // More scenarios to go
      this.registry.set('currentScenario', nextIndex);

      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.time.delayedCall(1000, () => {
        this.scene.restart();
      });
    } else {
      // All scenarios complete - show results
      this.registry.set('currentScenario', 0); // Reset for potential replay

      this.dialogueBox.show('The six truths are known. The arena has judged.');

      this.time.delayedCall(3000, () => {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.time.delayedCall(1000, () => {
          this.scene.start('ResultsScene');
        });
      });
    }
  }
}
