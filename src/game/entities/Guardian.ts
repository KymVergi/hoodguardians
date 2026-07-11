import Phaser from "phaser";
import type { GuardianType } from "../data/guardianTypes";

export class Guardian {
  x: number;
  y: number;
  type: GuardianType;
  sprite: Phaser.GameObjects.Sprite;
  rangeCircle?: Phaser.GameObjects.Arc;
  private cooldown = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, type: GuardianType) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.sprite = scene.add
      .sprite(x, y, "guardian_idle")
      .setScale(1.6)
      .setTint(type.color)
      .setDepth(20);
    this.sprite.play("guardian_idle_anim");
  }

  showRange(scene: Phaser.Scene) {
    this.rangeCircle = scene.add
      .circle(this.x, this.y, this.type.range, 0xffffff, 0.05)
      .setStrokeStyle(1, 0xffffff, 0.2)
      .setDepth(1);
  }

  update(deltaMs: number) {
    if (this.cooldown > 0) this.cooldown -= deltaMs;
  }

  canFire() {
    return this.cooldown <= 0;
  }

  fire() {
    this.cooldown = this.type.cooldownMs;
    this.sprite.play("guardian_attack_anim");
    this.sprite.once("animationcomplete", () => {
      // Guard against the sprite having been destroyed mid-animation.
      if (this.sprite.active) this.sprite.play("guardian_idle_anim");
    });
  }

  destroy() {
    this.rangeCircle?.destroy();
    this.sprite.destroy();
  }
}
