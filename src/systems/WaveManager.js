import Enemy from '../combat/Enemy.js';

/**
 * WaveManager - Spawns enemies in waves with increasing difficulty
 */
export default class WaveManager {
  constructor(scene) {
    this.scene = scene;
    this.enemies = [];

    // Wave configuration
    this.currentWave = 0;
    this.enemiesPerWave = 5;
    this.spawnInterval = 2000; // ms between spawns
    this.spawnTimer = 0;
    this.enemiesToSpawn = 0;
    this.waveActive = false;

    // Difficulty scaling
    this.difficultyMultiplier = 1.0;

    // Spawn bounds (around player)
    this.spawnDistance = 400; // Distance from player to spawn

    console.log('WaveManager: Initialized');
  }

  /**
   * Start a new wave
   */
  startWave() {
    this.currentWave++;
    this.waveActive = true;
    this.enemiesToSpawn = this.enemiesPerWave + Math.floor(this.currentWave / 2);
    this.spawnTimer = 0;

    // Increase difficulty
    this.difficultyMultiplier = 1.0 + (this.currentWave * 0.1);

    console.log(`WaveManager: Starting wave ${this.currentWave} with ${this.enemiesToSpawn} enemies`);

    // Notify scene
    this.scene.events.emit('wave-start', this.currentWave);
  }

  /**
   * Update wave spawning
   * @param {number} delta - Time since last frame (ms)
   * @param {Object} player - Player reference for AI
   */
  update(delta, player) {
    if (!this.waveActive) return;

    // Update spawn timer
    this.spawnTimer += delta;

    // Spawn enemy if timer exceeded and enemies remaining
    if (this.spawnTimer >= this.spawnInterval && this.enemiesToSpawn > 0) {
      this.spawnEnemy(player);
      this.spawnTimer = 0;
      this.enemiesToSpawn--;

      // Check if wave spawn complete
      if (this.enemiesToSpawn === 0) {
        console.log(`WaveManager: All enemies spawned for wave ${this.currentWave}`);
      }
    }

    // Update all enemies
    this.enemies = this.enemies.filter(enemy => enemy.isActive);
    this.enemies.forEach(enemy => {
      enemy.update(delta, player);
    });

    // Check if wave complete (all enemies dead and none left to spawn)
    if (this.enemiesToSpawn === 0 && this.enemies.length === 0) {
      this.onWaveComplete();
    }
  }

  /**
   * Spawn an enemy near the player
   * @param {Object} player - Player reference for spawn position
   */
  spawnEnemy(player) {
    // Random angle around player
    const angle = Math.random() * Math.PI * 2;
    const distance = this.spawnDistance + Math.random() * 100;

    const x = player.x + Math.cos(angle) * distance;
    const y = player.y + Math.sin(angle) * distance;

    // Create enemy
    const enemy = new Enemy(this.scene, x, y, 'grunt');

    // Scale with difficulty
    enemy.maxHP = Math.floor(enemy.maxHP * this.difficultyMultiplier);
    enemy.currentHP = enemy.maxHP;
    enemy.speed = enemy.speed + (this.currentWave * 5);

    this.enemies.push(enemy);

    console.log(`WaveManager: Spawned enemy at (${Math.floor(x)}, ${Math.floor(y)})`);
  }

  /**
   * Wave complete
   */
  onWaveComplete() {
    this.waveActive = false;
    console.log(`WaveManager: Wave ${this.currentWave} complete!`);

    // Notify scene
    this.scene.events.emit('wave-complete', this.currentWave);

    // Auto-start next wave after delay
    this.scene.time.delayedCall(3000, () => {
      this.startWave();
    });
  }

  /**
   * Get all active enemies
   * @returns {Array<Enemy>}
   */
  getEnemies() {
    return this.enemies;
  }

  /**
   * Check if wave is active
   * @returns {boolean}
   */
  isWaveActive() {
    return this.waveActive;
  }

  /**
   * Get current wave number
   * @returns {number}
   */
  getCurrentWave() {
    return this.currentWave;
  }
}
