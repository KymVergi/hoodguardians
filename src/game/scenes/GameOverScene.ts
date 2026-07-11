import Phaser from "phaser";
import { GAME_OVER_EVENT } from "../gameEvents";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create(data: { victory: boolean; score: number }) {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x0d130a, 0.85);

    this.add
      .text(width / 2, height / 2 - 90, data.victory ? "THE GROVE IS SAFE!" : "THE GROVE HAS FALLEN", {
        fontFamily: '"Press Start 2P"',
        fontSize: "26px",
        color: data.victory ? "#7cb342" : "#e2543b",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 - 30, `FINAL SCORE: ${data.score}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: "16px",
        color: "#ffcf4d",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 10, "Claim your reward below with your wallet connected", {
        fontFamily: '"Press Start 2P"',
        fontSize: "10px",
        color: "#a9bd9c",
      })
      .setOrigin(0.5);

    const retry = this.add
      .text(width / 2, height / 2 + 70, "[ PLAY AGAIN ]", {
        fontFamily: '"Press Start 2P"',
        fontSize: "12px",
        color: "#8fd6ff",
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    retry.on("pointerdown", () => this.scene.start("MenuScene"));

    // Hand off to the React layer (wallet + claim + leaderboard live outside Phaser).
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(GAME_OVER_EVENT, { detail: { victory: data.victory, score: data.score } }),
      );
    }
  }
}
