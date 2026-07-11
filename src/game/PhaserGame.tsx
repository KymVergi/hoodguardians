"use client";

import { useEffect, useRef } from "react";
import type Phaser from "phaser";

export default function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    let destroyed = false;

    (async () => {
      const [{ buildGameConfig }] = await Promise.all([import("./config")]);
      const PhaserLib = (await import("phaser")).default;
      if (destroyed || !containerRef.current) return;
      const config = buildGameConfig(containerRef.current);
      gameRef.current = new PhaserLib.Game(config);
    })();

    return () => {
      destroyed = true;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", maxWidth: 1280, margin: "0 auto" }} />;
}
