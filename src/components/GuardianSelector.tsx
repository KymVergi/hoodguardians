"use client";

import { useEffect, useState } from "react";
import { GUARDIAN_TYPES } from "@/game/data/guardianTypes";
import { SELECT_GUARDIAN_EVENT, GUARDIAN_READY_EVENT, type GuardianReadyDetail } from "@/game/gameEvents";
import styles from "./GuardianSelector.module.css";

const ICONS: Record<string, string> = {
  roble: "/assets/guardians/icon_roble.png",
  brisa: "/assets/guardians/icon_brisa.png",
  ascua: "/assets/guardians/icon_ascua.png",
};

export default function GuardianSelector() {
  const [activeId, setActiveId] = useState(GUARDIAN_TYPES[0].id);

  useEffect(() => {
    function onReady(e: Event) {
      const detail = (e as CustomEvent<GuardianReadyDetail>).detail;
      if (detail?.guardianTypeId) setActiveId(detail.guardianTypeId);
    }
    window.addEventListener(GUARDIAN_READY_EVENT, onReady);
    return () => window.removeEventListener(GUARDIAN_READY_EVENT, onReady);
  }, []);

  function select(id: string) {
    setActiveId(id);
    window.dispatchEvent(new CustomEvent(SELECT_GUARDIAN_EVENT, { detail: { guardianTypeId: id } }));
  }

  return (
    <div className={`pixel-panel ${styles.wrap}`}>
      <span className={styles.label}>Place guardian:</span>
      <div className={styles.options}>
        {GUARDIAN_TYPES.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`${styles.option} ${g.id === activeId ? styles.optionActive : ""}`}
            onClick={() => select(g.id)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ICONS[g.id]} alt={g.name} className={styles.icon} />
            <span>
              <span className={styles.name}>{g.name}</span>
              <span className={styles.cost}>{g.cost} coins</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
