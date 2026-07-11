import Phaser from "phaser";
import { GUARDIAN_TYPES } from "../data/guardianTypes";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    const { width, height } = this.scale;
    this.add.image(width / 2, height / 2, "bg_forest").setDisplaySize(width, height).setAlpha(0.35);
    this.add.rectangle(width / 2, height / 2, width, height, 0x0d130a, 0.35);

    this.add
      .text(width / 2, 70, "HATCH YOUR GUARDIAN", {
        fontFamily: '"Press Start 2P"',
        fontSize: "22px",
        color: "#ffcf4d",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 105, "Pick your starter — switch freely once you're in", {
        fontFamily: '"Press Start 2P"',
        fontSize: "10px",
        color: "#a9bd9c",
      })
      .setOrigin(0.5);

    const cardW = 280;
    const cardH = 340;
    const gap = 40;
    const totalW = cardW * 3 + gap * 2;
    const startX = width / 2 - totalW / 2 + cardW / 2;

    GUARDIAN_TYPES.forEach((g, i) => {
      const cx = startX + i * (cardW + gap);
      const cy = height / 2 + 30;

      const card = this.add.rectangle(cx, cy, cardW, cardH, 0x1d2a19, 0.95).setStrokeStyle(4, 0x4a6b32);
      card.setInteractive({ useHandCursor: true });

      this.add
        .sprite(cx, cy - 100, "guardian_idle")
        .setScale(2.6)
        .setTint(g.color)
        .play("guardian_idle_anim");

      this.add
        .text(cx, cy - 10, g.name.toUpperCase(), {
          fontFamily: '"Press Start 2P"',
          fontSize: "11px",
          color: "#eaf3e2",
          align: "center",
          wordWrap: { width: cardW - 30 },
        })
        .setOrigin(0.5);

      this.add
        .text(cx, cy + 45, g.description, {
          fontFamily: '"Press Start 2P"',
          fontSize: "9px",
          color: "#a9bd9c",
          align: "center",
          wordWrap: { width: cardW - 40 },
          lineSpacing: 6,
        })
        .setOrigin(0.5);

      this.add
        .text(
          cx,
          cy + 120,
          `DMG ${g.damage}\nRANGE ${g.range}\nSPEED ${(1000 / g.cooldownMs).toFixed(1)}/s`,
          {
            fontFamily: '"Press Start 2P"',
            fontSize: "9px",
            color: "#ffcf4d",
            align: "center",
            lineSpacing: 8,
          },
        )
        .setOrigin(0.5);

      card.on("pointerover", () => card.setStrokeStyle(4, 0xffcf4d));
      card.on("pointerout", () => card.setStrokeStyle(4, 0x4a6b32));
      card.on("pointerdown", () => {
        this.scene.start("GameScene", { guardianTypeId: g.id });
      });
    });
  }
}
