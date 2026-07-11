import Phaser from "phaser";
import { PATH } from "../data/path";
import type { EnemyType } from "../data/enemyTypes";

export class Enemy {
  sprite: Phaser.GameObjects.Sprite;
  hp: number;
  maxHp: number;
  speed: number;
  reward: number;
  type: EnemyType;
  segmentIndex = 0;
  segmentProgress = 0; // 0..1 along current segment
  dead = false;
  reachedEnd = false;
  private hpBarBg: Phaser.GameObjects.Rectangle;
  private hpBarFg: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, type: EnemyType) {
    this.type = type;
    this.hp = type.hp;
    this.maxHp = type.hp;
    this.speed = type.speed;
    this.reward = type.reward;

    const start = PATH[0];
    this.sprite = scene.add.sprite(start.x, start.y, type.walkKey, 0);
    this.sprite.setScale(1.4);
    this.sprite.play(`${type.walkKey}_anim`);
    this.sprite.setDepth(10);

    this.hpBarBg = scene.add.rectangle(start.x, start.y - 30, 34, 5, 0x000000, 0.6).setDepth(11);
    this.hpBarFg = scene.add.rectangle(start.x, start.y - 30, 34, 5, 0xe2543b).setDepth(12);
  }

  update(deltaMs: number) {
    if (this.dead || this.reachedEnd) return;
    const a = PATH[this.segmentIndex];
    const b = PATH[this.segmentIndex + 1];
    if (!b) {
      this.reachedEnd = true;
      return;
    }
    const segLen = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
    const travel = (this.speed * deltaMs) / 1000;
    this.segmentProgress += travel / segLen;

    if (this.segmentProgress >= 1) {
      this.segmentIndex++;
      this.segmentProgress = 0;
      if (this.segmentIndex >= PATH.length - 1) {
        this.reachedEnd = true;
        this.sprite.setPosition(b.x, b.y);
        this.syncBars();
        return;
      }
    }

    const p1 = PATH[this.segmentIndex];
    const p2 = PATH[this.segmentIndex + 1];
    const x = Phaser.Math.Linear(p1.x, p2.x, this.segmentProgress);
    const y = Phaser.Math.Linear(p1.y, p2.y, this.segmentProgress);
    this.sprite.setPosition(x, y);
    this.syncBars();
  }

  private syncBars() {
    this.hpBarBg.setPosition(this.sprite.x, this.sprite.y - 30);
    this.hpBarFg.setPosition(this.sprite.x, this.sprite.y - 30);
    const pct = Math.max(0, this.hp / this.maxHp);
    this.hpBarFg.width = 34 * pct;
    this.hpBarFg.x = this.sprite.x - (34 * (1 - pct)) / 2;
  }

  takeDamage(amount: number): boolean {
    if (this.dead) return false;
    this.hp -= amount;
    if (this.hp <= 0 && !this.dead) {
      this.die();
      return true;
    }
    return false;
  }

  private die() {
    this.dead = true;
    this.hpBarBg.destroy();
    this.hpBarFg.destroy();
    this.sprite.play(`${this.type.deathKey}_anim`);
    this.sprite.once("animationcomplete", () => this.sprite.destroy());
  }

  get x() {
    return this.sprite.x;
  }
  get y() {
    return this.sprite.y;
  }

  destroy() {
    this.hpBarBg.destroy();
    this.hpBarFg.destroy();
    this.sprite.destroy();
  }
}
