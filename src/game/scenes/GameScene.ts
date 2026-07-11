import Phaser from "phaser";
import { PATH, distanceToPath } from "../data/path";
import { GUARDIAN_TYPES, type GuardianType } from "../data/guardianTypes";
import { ENEMY_TYPES } from "../data/enemyTypes";
import { WAVES, STARTING_LIVES, STARTING_COINS } from "../data/waves";
import { Enemy } from "../entities/Enemy";
import { Guardian } from "../entities/Guardian";
import { SELECT_GUARDIAN_EVENT, GUARDIAN_READY_EVENT } from "../gameEvents";

const PLACEMENT_MIN_DIST_TO_PATH = 40;
const PLACEMENT_MAX_DIST_TO_PATH = 110;
const PLACEMENT_MIN_DIST_TO_GUARDIAN = 55;

interface Projectile {
  gfx: Phaser.GameObjects.Image;
  target: Enemy;
  damage: number;
  splashRadius?: number;
  speed: number;
}

export class GameScene extends Phaser.Scene {
  private selectedGuardianType!: GuardianType;
  private onSelectGuardian = (e: Event) => {
    const detail = (e as CustomEvent).detail as { guardianTypeId: string };
    const type = GUARDIAN_TYPES.find((g) => g.id === detail.guardianTypeId);
    if (type) this.selectedGuardianType = type;
  };
  private guardians: Guardian[] = [];
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];

  private lives = STARTING_LIVES;
  private coins = STARTING_COINS;
  private score = 0;
  private waveIndex = 0;
  private waveActive = false;
  private waveEnemiesRemaining = 0;
  private spawnTimer?: Phaser.Time.TimerEvent;

  private hud!: {
    lives: Phaser.GameObjects.Text;
    coins: Phaser.GameObjects.Text;
    wave: Phaser.GameObjects.Text;
    score: Phaser.GameObjects.Text;
    waveBtn: Phaser.GameObjects.Text;
    tip: Phaser.GameObjects.Text;
  };

  constructor() {
    super("GameScene");
  }

  init(data: { guardianTypeId: string }) {
    this.selectedGuardianType =
      GUARDIAN_TYPES.find((g) => g.id === data.guardianTypeId) ?? GUARDIAN_TYPES[0];
    this.guardians = [];
    this.enemies = [];
    this.projectiles = [];
    this.lives = STARTING_LIVES;
    this.coins = STARTING_COINS;
    this.score = 0;
    this.waveIndex = 0;
    this.waveActive = false;
    this.waveEnemiesRemaining = 0;
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, "bg_forest").setDisplaySize(width, height);

    // Path overlay so the trail reads clearly regardless of the underlying art.
    const pathGfx = this.add.graphics();
    pathGfx.lineStyle(34, 0x4a3520, 0.45);
    this.drawPath(pathGfx);
    pathGfx.lineStyle(4, 0xffcf4d, 0.25);
    this.drawPath(pathGfx);

    // The Grove: a little keep at the end of the path — what you're defending.
    const groveEnd = PATH[PATH.length - 1];
    this.add.image(groveEnd.x, groveEnd.y, "keep").setScale(1.1).setDepth(9);

    this.buildHud();

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.y < 60) return; // avoid HUD strip
      this.tryPlaceGuardian(pointer.x, pointer.y);
    });

    // Let the React guardian selector (rendered under the canvas) drive
    // which type gets placed next, and tell it which one is active first.
    window.addEventListener(SELECT_GUARDIAN_EVENT, this.onSelectGuardian);
    this.events.once("shutdown", () => {
      window.removeEventListener(SELECT_GUARDIAN_EVENT, this.onSelectGuardian);
    });
    window.dispatchEvent(
      new CustomEvent(GUARDIAN_READY_EVENT, { detail: { guardianTypeId: this.selectedGuardianType.id } }),
    );

    this.startNextWave();
  }

  private drawPath(gfx: Phaser.GameObjects.Graphics) {
    gfx.beginPath();
    gfx.moveTo(PATH[0].x, PATH[0].y);
    for (let i = 1; i < PATH.length; i++) gfx.lineTo(PATH[i].x, PATH[i].y);
    gfx.strokePath();
  }

  private buildHud() {
    const style = { fontFamily: '"Press Start 2P"', fontSize: "12px", color: "#eaf3e2" };
    this.add.rectangle(this.scale.width / 2, 22, this.scale.width, 44, 0x0d130a, 0.75).setDepth(50);

    this.hud = {
      lives: this.add.text(20, 12, "", style).setDepth(51),
      coins: this.add.text(220, 12, "", { ...style, color: "#ffcf4d" }).setDepth(51),
      wave: this.add.text(420, 12, "", style).setDepth(51),
      score: this.add.text(620, 12, "", style).setDepth(51),
      waveBtn: this.add
        .text(this.scale.width - 20, 12, "", { ...style, color: "#8fd6ff" })
        .setOrigin(1, 0)
        .setDepth(51),
      tip: this.add
        .text(this.scale.width / 2, this.scale.height - 16, "Tap near the path to place a guardian", {
          fontFamily: '"Press Start 2P"',
          fontSize: "9px",
          color: "#a9bd9c",
        })
        .setOrigin(0.5, 1)
        .setDepth(51),
    };
    this.refreshHud();
  }

  private refreshHud() {
    this.hud.lives.setText(`LIVES ${this.lives}`);
    this.hud.coins.setText(`COINS ${this.coins}`);
    this.hud.wave.setText(`WAVE ${Math.min(this.waveIndex + 1, WAVES.length)}/${WAVES.length}`);
    this.hud.score.setText(`SCORE ${this.score}`);
  }

  private tryPlaceGuardian(x: number, y: number) {
    const distPath = distanceToPath(x, y);
    if (distPath < PLACEMENT_MIN_DIST_TO_PATH || distPath > PLACEMENT_MAX_DIST_TO_PATH) {
      this.flashTip("Too far from — or right on — the path");
      return;
    }
    const tooClose = this.guardians.some(
      (g) => Phaser.Math.Distance.Between(g.x, g.y, x, y) < PLACEMENT_MIN_DIST_TO_GUARDIAN,
    );
    if (tooClose) {
      this.flashTip("There is already a guardian there");
      return;
    }
    if (this.coins < this.selectedGuardianType.cost) {
      this.flashTip("Not enough coins");
      return;
    }

    this.coins -= this.selectedGuardianType.cost;
    const g = new Guardian(this, x, y, this.selectedGuardianType);
    this.guardians.push(g);
    this.refreshHud();
  }

  private flashTip(msg: string) {
    this.hud.tip.setText(msg).setColor("#e2543b");
    this.time.delayedCall(1200, () => {
      this.hud.tip.setText("Tap near the path to place a guardian").setColor("#a9bd9c");
    });
  }

  private startNextWave() {
    if (this.waveIndex >= WAVES.length) {
      this.endGame(true);
      return;
    }
    const wave = WAVES[this.waveIndex];
    this.waveActive = true;

    const queue: number[] = [];
    wave.spawns.forEach((s) => {
      for (let i = 0; i < s.count; i++) queue.push(s.enemyId);
    });
    Phaser.Utils.Array.Shuffle(queue);
    this.waveEnemiesRemaining = queue.length;
    this.refreshHud();

    let i = 0;
    this.spawnTimer = this.time.addEvent({
      delay: wave.intervalMs,
      repeat: queue.length - 1,
      callback: () => {
        const enemyId = queue[i++];
        const type = ENEMY_TYPES[enemyId];
        this.enemies.push(new Enemy(this, type));
      },
    });
  }

  update(_time: number, delta: number) {
    // Guardians: cooldown + auto target + fire
    this.guardians.forEach((g) => {
      g.update(delta);
      if (!g.canFire()) return;
      const target = this.findTarget(g);
      if (target) {
        this.shoot(g, target);
        g.fire();
      }
    });

    // Enemies: move, check reach end
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.dead) continue;
      e.update(delta);
      if (e.reachedEnd) {
        this.lives -= 1;
        this.score = Math.max(0, this.score - 2);
        e.destroy();
        this.enemies.splice(i, 1);
        this.waveEnemiesRemaining--;
        this.refreshHud();
        if (this.lives <= 0) {
          this.endGame(false);
          return;
        }
      }
    }

    // Projectiles: home toward target, hit on arrival
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (p.target.dead) {
        p.gfx.destroy();
        this.projectiles.splice(i, 1);
        continue;
      }
      const dist = Phaser.Math.Distance.Between(p.gfx.x, p.gfx.y, p.target.x, p.target.y);
      const step = (p.speed * delta) / 1000;
      if (dist <= step) {
        this.applyHit(p);
        p.gfx.destroy();
        this.projectiles.splice(i, 1);
        continue;
      }
      const angle = Phaser.Math.Angle.Between(p.gfx.x, p.gfx.y, p.target.x, p.target.y);
      p.gfx.x += Math.cos(angle) * step;
      p.gfx.y += Math.sin(angle) * step;
    }

    // Cleanup dead enemy entries once their death anim finished (sprite gone)
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].dead && !this.enemies[i].sprite.active) {
        this.enemies.splice(i, 1);
      }
    }

    // Wave completion check
    if (
      this.waveActive &&
      this.waveEnemiesRemaining <= 0 &&
      this.enemies.every((e) => e.dead) &&
      (!this.spawnTimer || this.spawnTimer.getOverallProgress() >= 1)
    ) {
      this.waveActive = false;
      const wave = WAVES[this.waveIndex];
      this.coins += wave.reward;
      this.score += 30 + this.waveIndex * 10;
      this.waveIndex++;
      this.refreshHud();
      this.hud.tip.setText(`Wave cleared! +${wave.reward} coins`).setColor("#7cb342");
      this.time.delayedCall(2200, () => this.startNextWave());
    }
  }

  private findTarget(g: Guardian): Enemy | null {
    let best: Enemy | null = null;
    let bestDist = g.type.range;
    for (const e of this.enemies) {
      if (e.dead) continue;
      const d = Phaser.Math.Distance.Between(g.x, g.y, e.x, e.y);
      if (d <= bestDist) {
        best = e;
        bestDist = d;
      }
    }
    return best;
  }

  private shoot(g: Guardian, target: Enemy) {
    const angle = Phaser.Math.Angle.Between(g.x, g.y - 14, target.x, target.y);
    const gfx = this.add
      .image(g.x, g.y - 14, "arrow")
      .setTint(g.type.color)
      .setRotation(angle + Math.PI / 2)
      .setDepth(15);
    this.projectiles.push({
      gfx,
      target,
      damage: g.type.damage,
      splashRadius: g.type.splashRadius,
      speed: g.type.projectileSpeed,
    });
  }

  private applyHit(p: Projectile) {
    if (p.splashRadius) {
      this.enemies.forEach((e) => {
        if (e.dead) return;
        const d = Phaser.Math.Distance.Between(p.gfx.x, p.gfx.y, e.x, e.y);
        if (d <= p.splashRadius!) this.registerHit(e, p.damage);
      });
    } else {
      this.registerHit(p.target, p.damage);
    }
  }

  private registerHit(e: Enemy, damage: number) {
    const killed = e.takeDamage(damage);
    if (killed) {
      this.coins += e.reward;
      this.score += 10;
      this.waveEnemiesRemaining--;
      this.refreshHud();
    }
  }

  private endGame(victory: boolean) {
    this.spawnTimer?.remove();
    this.scene.start("GameOverScene", { victory, score: this.score });
  }
}
