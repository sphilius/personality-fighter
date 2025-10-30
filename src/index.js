import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import AssessmentScene from './scenes/AssessmentScene.js';

/**
 * @type {Phaser.Types.Core.GameConfig}
 */
const config = {
  type: Phaser.AUTO,
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
  scene: [BootScene, MenuScene, AssessmentScene],
};

const game = new Phaser.Game(config);

// Mobile touch input handling
window.addEventListener('touchstart', (event) => {
  event.preventDefault();
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  event.preventDefault();
}, { passive: false });
