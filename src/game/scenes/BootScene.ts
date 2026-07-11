import Phaser from "phaser";
import { ENEMY_TYPES, ENEMY_FRAME_SIZE } from "../data/enemyTypes";

export const GUARDIAN_FRAME_SIZE = 48;
export const GUARDIAN_IDLE_FRAMES = 4;
export const GUARDIAN_ATTACK_FRAMES = 6;

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.image("bg_forest", "/assets/bg/forest.jpg");
    this.load.image("keep", "/assets/keep/keep.png");
    this.load.image("arrow", "/assets/guardians/arrow.png");

    this.load.spritesheet("guardian_idle", "/assets/guardians/archer_idle.png", {
      frameWidth: GUARDIAN_FRAME_SIZE,
      frameHeight: GUARDIAN_FRAME_SIZE,
    });
    this.load.spritesheet("guardian_attack", "/assets/guardians/archer_attack.png", {
      frameWidth: GUARDIAN_FRAME_SIZE,
      frameHeight: GUARDIAN_FRAME_SIZE,
    });

    Object.values(ENEMY_TYPES).forEach((e) => {
      this.load.spritesheet(e.walkKey, `/assets/enemies/${e.id}/walk.png`, {
        frameWidth: ENEMY_FRAME_SIZE,
        frameHeight: ENEMY_FRAME_SIZE,
      });
      this.load.spritesheet(e.deathKey, `/assets/enemies/${e.id}/death.png`, {
        frameWidth: ENEMY_FRAME_SIZE,
        frameHeight: ENEMY_FRAME_SIZE,
      });
    });
  }

  create() {
    Object.values(ENEMY_TYPES).forEach((e) => {
      this.anims.create({
        key: `${e.walkKey}_anim`,
        frames: this.anims.generateFrameNumbers(e.walkKey, { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: `${e.deathKey}_anim`,
        frames: this.anims.generateFrameNumbers(e.deathKey, { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0,
      });
    });

    // Guardian unit — from the "defenders" pack. All 3 guardian types share
    // this same base sprite and are told apart with a per-type tint
    // (see Guardian.ts / guardianTypes.ts).
    this.anims.create({
      key: "guardian_idle_anim",
      frames: this.anims.generateFrameNumbers("guardian_idle", { start: 0, end: GUARDIAN_IDLE_FRAMES - 1 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "guardian_attack_anim",
      frames: this.anims.generateFrameNumbers("guardian_attack", { start: 0, end: GUARDIAN_ATTACK_FRAMES - 1 }),
      frameRate: 14,
      repeat: 0,
    });

    this.scene.start("MenuScene");
  }
}
