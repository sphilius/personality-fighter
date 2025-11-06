import Phaser from 'phaser';
import DialogueBox from '../ui/DialogueBox.js';

export default class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'IntroScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create mystical background
    this.createBackground();

    // Create Observer silhouette
    this.createObserver();

    // Create six glowing pillars
    this.createPillars();

    // Create dialogue system
    this.dialogueBox = new DialogueBox(this, width / 2, height - 150);

    // Start opening narrative
    this.startOpeningNarrative();
  }

  createBackground() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create gradient background
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a1a3a, 0x1a1a3a, 1);
    graphics.fillRect(0, 0, width, height);

    // Add mystical particles
    const particles = this.add.particles(0, 0, 'white', {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      scale: { start: 0.1, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 3000,
      frequency: 200,
      blendMode: 'ADD',
    });

    // Create circular arena floor
    const arena = this.add.circle(width / 2, height / 2 + 100, 400, 0x2a2a4a, 0.3);
    arena.setStrokeStyle(4, 0x4a4a7a, 0.8);
  }

  createObserver() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create hooded figure silhouette (placeholder - simple shape for now)
    const observer = this.add.graphics();
    observer.fillStyle(0x000000, 0.9);

    // Hooded robe shape
    observer.beginPath();
    observer.moveTo(width / 2 - 60, height / 2 - 200);
    observer.lineTo(width / 2 - 80, height / 2);
    observer.lineTo(width / 2 - 40, height / 2 + 50);
    observer.lineTo(width / 2 + 40, height / 2 + 50);
    observer.lineTo(width / 2 + 80, height / 2);
    observer.lineTo(width / 2 + 60, height / 2 - 200);
    observer.closePath();
    observer.fillPath();

    // Glowing eyes
    const leftEye = this.add.circle(width / 2 - 20, height / 2 - 150, 5, 0x4af4ff);
    const rightEye = this.add.circle(width / 2 + 20, height / 2 - 150, 5, 0x4af4ff);

    // Pulse effect on eyes
    this.tweens.add({
      targets: [leftEye, rightEye],
      alpha: { from: 0.5, to: 1 },
      scale: { from: 0.8, to: 1.2 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    this.observer = observer;
    this.observerEyes = [leftEye, rightEye];
  }

  createPillars() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const centerX = width / 2;
    const centerY = height / 2 + 100;
    const radius = 500;

    this.pillars = [];

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Create pillar
      const pillar = this.add.rectangle(x, y, 40, 120, 0x4a4a7a, 0.5);
      pillar.setStrokeStyle(2, 0x6a6aaa, 0.8);

      // Add glow
      const glow = this.add.circle(x, y - 70, 20, 0x4af4ff, 0);

      this.pillars.push({ pillar, glow, active: false });
    }
  }

  startOpeningNarrative() {
    const dialogueSequence = [
      {
        text: "You wake. The arena calls.",
        duration: 2500,
      },
      {
        text: "Many have stood where you stand. Few have seen their true form.",
        duration: 3000,
      },
      {
        text: "Six trials. Six truths. The arena will know you by your choices.",
        duration: 3500,
        onComplete: () => this.activatePillars(),
      },
      {
        text: "Step forward. The first trial begins.",
        duration: 3000,
        onComplete: () => this.startAssessment(),
      },
    ];

    this.playDialogueSequence(dialogueSequence, 0);
  }

  playDialogueSequence(sequence, index) {
    if (index >= sequence.length) return;

    const dialogue = sequence[index];
    this.dialogueBox.show(dialogue.text);

    this.time.delayedCall(dialogue.duration, () => {
      if (dialogue.onComplete) dialogue.onComplete();
      this.playDialogueSequence(sequence, index + 1);
    });
  }

  activatePillars() {
    this.pillars.forEach((pillarData, index) => {
      this.time.delayedCall(index * 200, () => {
        this.tweens.add({
          targets: pillarData.glow,
          alpha: 0.6,
          scale: 1.2,
          duration: 500,
          ease: 'Power2',
        });
      });
    });

    // Highlight first pillar
    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: this.pillars[0].glow,
        alpha: 1,
        scale: 1.5,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });
    });
  }

  startAssessment() {
    this.time.delayedCall(500, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.time.delayedCall(1000, () => {
        this.scene.start('AssessmentScene');
      });
    });
  }
}
