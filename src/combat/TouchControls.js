import Phaser from 'phaser';

/**
 * TouchControls - Mobile touch control system
 * Left side: Virtual joystick for movement
 * Right side: Gesture recognition for attacks
 */
export default class TouchControls {
  constructor(scene, fighter) {
    this.scene = scene;
    this.fighter = fighter;

    // Screen dimensions
    this.screenWidth = scene.cameras.main.width;
    this.screenHeight = scene.cameras.main.height;

    // Touch zones
    this.leftZoneWidth = this.screenWidth * 0.4; // Left 40% for joystick
    this.rightZoneX = this.screenWidth * 0.4; // Right 60% for gestures

    // Virtual joystick
    this.joystick = {
      active: false,
      pointerId: null,
      baseX: 0,
      baseY: 0,
      knobX: 0,
      knobY: 0,
      radius: 80,
      deadzone: 15,
    };

    // Gesture tracking
    this.gesture = {
      active: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      startTime: 0,
      lastTapTime: 0,
      swipeThreshold: 50,
      doubleTapDelay: 300,
    };

    // Visual elements
    this.joystickGraphics = null;
    this.gestureIndicator = null;

    // Create visuals
    this.createVisuals();

    // Set up input handlers
    this.setupInput();

    console.log('TouchControls initialized');
  }

  /**
   * Create visual elements for touch controls
   */
  createVisuals() {
    // Joystick graphics
    this.joystickGraphics = this.scene.add.graphics();
    this.joystickGraphics.setDepth(1000); // Always on top
    this.joystickGraphics.setAlpha(0); // Hidden by default

    // Gesture indicator (optional visual feedback)
    this.gestureIndicator = this.scene.add.graphics();
    this.gestureIndicator.setDepth(1000);
    this.gestureIndicator.setAlpha(0);

    // Touch zone visual hints (semi-transparent overlays - for debugging)
    // Uncomment to see touch zones:
    // const leftZone = this.scene.add.rectangle(
    //   this.leftZoneWidth / 2,
    //   this.screenHeight / 2,
    //   this.leftZoneWidth,
    //   this.screenHeight,
    //   0x0000ff,
    //   0.1
    // );
    // const rightZone = this.scene.add.rectangle(
    //   this.rightZoneX + (this.screenWidth - this.rightZoneX) / 2,
    //   this.screenHeight / 2,
    //   this.screenWidth - this.rightZoneX,
    //   this.screenHeight,
    //   0xff0000,
    //   0.1
    // );
  }

  /**
   * Set up touch input handlers
   */
  setupInput() {
    // Pointer down - check which zone
    this.scene.input.on('pointerdown', (pointer) => {
      if (pointer.x < this.leftZoneWidth) {
        // Left zone - activate joystick
        this.activateJoystick(pointer);
      } else {
        // Right zone - start gesture
        this.startGesture(pointer);
      }
    });

    // Pointer move - update joystick or track gesture
    this.scene.input.on('pointermove', (pointer) => {
      if (this.joystick.active && pointer.id === this.joystick.pointerId) {
        this.updateJoystick(pointer);
      } else if (this.gesture.active && pointer.id === this.gesture.pointerId) {
        // Track gesture movement (for swipe detection)
      }
    });

    // Pointer up - deactivate and recognize gesture
    this.scene.input.on('pointerup', (pointer) => {
      if (this.joystick.active && pointer.id === this.joystick.pointerId) {
        this.deactivateJoystick();
      } else if (this.gesture.active && pointer.id === this.gesture.pointerId) {
        this.recognizeGesture(pointer);
      }
    });
  }

  /**
   * Activate virtual joystick
   */
  activateJoystick(pointer) {
    this.joystick.active = true;
    this.joystick.pointerId = pointer.id;
    this.joystick.baseX = pointer.x;
    this.joystick.baseY = pointer.y;
    this.joystick.knobX = pointer.x;
    this.joystick.knobY = pointer.y;

    // Show joystick
    this.joystickGraphics.setAlpha(0.6);

    console.log('Joystick activated');
  }

  /**
   * Update joystick position
   */
  updateJoystick(pointer) {
    // Calculate offset from base
    const dx = pointer.x - this.joystick.baseX;
    const dy = pointer.y - this.joystick.baseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Constrain knob to radius
    if (distance > this.joystick.radius) {
      const angle = Math.atan2(dy, dx);
      this.joystick.knobX = this.joystick.baseX + Math.cos(angle) * this.joystick.radius;
      this.joystick.knobY = this.joystick.baseY + Math.sin(angle) * this.joystick.radius;
    } else {
      this.joystick.knobX = pointer.x;
      this.joystick.knobY = pointer.y;
    }

    // Calculate movement direction
    const knobDx = this.joystick.knobX - this.joystick.baseX;
    const knobDy = this.joystick.knobY - this.joystick.baseY;
    const knobDistance = Math.sqrt(knobDx * knobDx + knobDy * knobDy);

    if (knobDistance > this.joystick.deadzone) {
      // Horizontal movement only (2D fighter)
      const moveX = knobDx / this.joystick.radius; // Normalized -1 to 1
      this.fighter.setMoveDirection(moveX > 0.3 ? 1 : moveX < -0.3 ? -1 : 0);

      // Vertical (jump) - threshold for upward movement
      if (knobDy < -30 && this.fighter.isGrounded) {
        this.fighter.jump();
      }
    } else {
      this.fighter.setMoveDirection(0);
    }

    // Draw joystick
    this.drawJoystick();
  }

  /**
   * Deactivate joystick
   */
  deactivateJoystick() {
    this.joystick.active = false;
    this.joystick.pointerId = null;
    this.fighter.setMoveDirection(0);

    // Hide joystick
    this.joystickGraphics.setAlpha(0);
    this.joystickGraphics.clear();

    console.log('Joystick deactivated');
  }

  /**
   * Draw joystick visual
   */
  drawJoystick() {
    this.joystickGraphics.clear();

    // Draw base (outer circle)
    this.joystickGraphics.lineStyle(4, 0xffffff, 0.8);
    this.joystickGraphics.strokeCircle(this.joystick.baseX, this.joystick.baseY, this.joystick.radius);
    this.joystickGraphics.fillStyle(0x444444, 0.4);
    this.joystickGraphics.fillCircle(this.joystick.baseX, this.joystick.baseY, this.joystick.radius);

    // Draw knob (inner circle)
    this.joystickGraphics.fillStyle(0xffffff, 0.8);
    this.joystickGraphics.fillCircle(this.joystick.knobX, this.joystick.knobY, 30);
    this.joystickGraphics.lineStyle(3, 0x4444ff, 1);
    this.joystickGraphics.strokeCircle(this.joystick.knobX, this.joystick.knobY, 30);
  }

  /**
   * Start gesture tracking
   */
  startGesture(pointer) {
    this.gesture.active = true;
    this.gesture.pointerId = pointer.id;
    this.gesture.startX = pointer.x;
    this.gesture.startY = pointer.y;
    this.gesture.startTime = Date.now();

    // Visual feedback
    this.gestureIndicator.setAlpha(0.5);
    this.gestureIndicator.clear();
    this.gestureIndicator.fillStyle(0xff0000, 0.3);
    this.gestureIndicator.fillCircle(pointer.x, pointer.y, 40);
  }

  /**
   * Recognize and execute gesture
   */
  recognizeGesture(pointer) {
    const dx = pointer.x - this.gesture.startX;
    const dy = pointer.y - this.gesture.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = Date.now() - this.gesture.startTime;

    // Clear visual feedback
    this.gestureIndicator.setAlpha(0);
    this.gestureIndicator.clear();

    // Double tap detection
    const timeSinceLastTap = Date.now() - this.gesture.lastTapTime;
    if (distance < 30 && duration < 200 && timeSinceLastTap < this.gesture.doubleTapDelay) {
      console.log('Double tap - Special move!');
      // Special move (requires meter)
      // this.fighter.specialMove();
      this.gesture.lastTapTime = 0; // Reset
      this.gesture.active = false;
      return;
    }

    // Swipe detection
    if (distance > this.gesture.swipeThreshold && duration < 500) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Swipe up (-90° ±45°)
      if (angle < -45 && angle > -135) {
        console.log('Swipe up - Heavy attack!');
        this.fighter.attack({
          name: 'Heavy Attack',
          damage: 25,
          frames: { startup: 12, active: 5, recovery: 15 },
          hitbox: { x: 60, y: -80, width: 80, height: 70 },
        });
      }
      // Swipe down (90° ±45°)
      else if (angle > 45 && angle < 135) {
        console.log('Swipe down - Block!');
        this.fighter.startBlock();
        // Auto-release block after a moment
        this.scene.time.delayedCall(500, () => {
          this.fighter.stopBlock();
        });
      }
      // Swipe horizontal
      else {
        console.log('Swipe horizontal - Light attack!');
        this.fighter.attack({
          name: 'Light Attack',
          damage: 10,
          frames: { startup: 5, active: 3, recovery: 7 },
          hitbox: { x: 50, y: -60, width: 60, height: 50 },
        });
      }
    }
    // Tap (quick touch with minimal movement)
    else if (distance < 30 && duration < 200) {
      console.log('Tap - Light attack!');
      this.gesture.lastTapTime = Date.now();
      this.fighter.attack({
        name: 'Light Attack',
        damage: 10,
        frames: { startup: 5, active: 3, recovery: 7 },
        hitbox: { x: 50, y: -60, width: 60, height: 50 },
      });
    }

    this.gesture.active = false;
  }

  /**
   * Update (called every frame if needed)
   */
  update(delta) {
    // Currently all logic is event-driven
    // Add frame-based logic here if needed
  }

  /**
   * Clean up
   */
  destroy() {
    if (this.joystickGraphics) {
      this.joystickGraphics.destroy();
    }
    if (this.gestureIndicator) {
      this.gestureIndicator.destroy();
    }
  }
}
