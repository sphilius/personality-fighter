import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import IntroScene from './scenes/IntroScene.js';
import AssessmentScene from './scenes/AssessmentScene.js';
import ResultsScene from './scenes/ResultsScene.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, IntroScene, AssessmentScene, ResultsScene],
  backgroundColor: '#000000',
};

const game = new Phaser.Game(config);

// Handle window resize
window.addEventListener('resize', () => {
  game.scale.refresh();
});

export default game;
