export default class DialogueBox {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    // Create container
    this.container = scene.add.container(x, y);
    this.container.setDepth(1000);
    this.container.setAlpha(0);

    // Create background box
    this.background = scene.add.rectangle(0, 0, 1400, 180, 0x000000, 0.85);
    this.background.setStrokeStyle(3, 0x4a4a7a, 0.9);

    // Create text
    this.text = scene.add.text(0, 0, '', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 1300 },
    });
    this.text.setOrigin(0.5, 0.5);

    this.container.add([this.background, this.text]);
  }

  show(message) {
    this.text.setText(message);

    // Fade in
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 300,
      ease: 'Power2',
    });
  }

  hide() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
    });
  }

  destroy() {
    this.container.destroy();
  }
}
