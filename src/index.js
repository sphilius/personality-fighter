import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MainMenuScene from './scenes/MainMenuScene.js';
import IntroScene from './scenes/IntroScene.js';
import AssessmentScene from './scenes/AssessmentScene.js';
import ResultsScene from './scenes/ResultsScene.js';
import CombatTestScene from './scenes/CombatTestScene.js';

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
  scene: [BootScene, MainMenuScene, IntroScene, AssessmentScene, ResultsScene, CombatTestScene],
  backgroundColor: '#000000',
};

const game = new Phaser.Game(config);

// Handle window resize
window.addEventListener('resize', () => {
  game.scale.refresh();
});

export default game;
