"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./Leaderboard.module.css";

interface Entry {
  address: string;
  score: number;
  ts: number;
}

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function Leaderboard({ refreshKey }: { refreshKey?: number }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  const load = useCallback(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return (
    <div className={`pixel-panel ${styles.wrap}`}>
      <p className={styles.title}>LEADERBOARD</p>
      {entries.length === 0 && <p className={styles.empty}>No one has claimed a score yet. Be the first!</p>}
      {entries.map((e, i) => (
        <div className={styles.row} key={e.address + e.ts}>
          <span>
            #{i + 1} {short(e.address)}
          </span>
          <span>{e.score}</span>
        </div>
      ))}
    </div>
  );
}
