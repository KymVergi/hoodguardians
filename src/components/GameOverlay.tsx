"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import WalletConnectButton from "./WalletConnectButton";
import Leaderboard from "./Leaderboard";
import GuardianSelector from "./GuardianSelector";
import { claimReward } from "@/lib/claim/claimReward";
import { GAME_OVER_EVENT } from "@/game/gameEvents";
import styles from "./GameOverlay.module.css";

const PhaserGame = dynamic(() => import("@/game/PhaserGame"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 60, textAlign: "center", fontSize: 12, color: "#a9bd9c" }}>
      Loading the forest…
    </div>
  ),
});

type ClaimStatus = "idle" | "pending" | "done" | "error";

export default function GameOverlay() {
  const { address, isConnected } = useAccount();
  const [result, setResult] = useState<{ victory: boolean; score: number } | null>(null);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>("idle");
  const [rank, setRank] = useState<number | null>(null);
  const [leaderboardKey, setLeaderboardKey] = useState(0);

  useEffect(() => {
    function onGameOver(e: Event) {
      const detail = (e as CustomEvent).detail as { victory: boolean; score: number };
      setResult(detail);
      setClaimStatus("idle");
      setRank(null);
    }
    window.addEventListener(GAME_OVER_EVENT, onGameOver);
    return () => window.removeEventListener(GAME_OVER_EVENT, onGameOver);
  }, []);

  async function handleClaim() {
    if (!address || !result) return;
    setClaimStatus("pending");
    const res = await claimReward(address, result.score);
    if (res.ok) {
      setClaimStatus("done");
      setRank(res.rank ?? null);
      setLeaderboardKey((k) => k + 1);
    } else {
      setClaimStatus("error");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link href="/" className={styles.logo}>
          ← HoodGuardians
        </Link>
        <WalletConnectButton />
      </div>

      {!isConnected && (
        <div className={styles.gate}>
          <h2 className={styles.gateTitle}>Connect your wallet to play</h2>
          <p className={styles.gateBody}>
            HoodGuardians rewards runs to the wallet that played them. Connect on
            Robinhood Chain before hatching your guardian so your score can be
            claimed at the end.
          </p>
          <WalletConnectButton />
        </div>
      )}

      {isConnected && (
        <div className={styles.stage}>
          <PhaserGame />
        </div>
      )}

      {isConnected && <GuardianSelector />}

      {isConnected && <div className={styles.bottomRow}>
        <div className={`pixel-panel ${styles.claimPanel}`}>
          <p className={styles.claimTitle}>RUN REWARD</p>
          {!result && <p className={styles.claimMsg}>Finish a run to claim your score.</p>}
          {result && (
            <>
              <p className={styles.claimScore}>
                {result.victory ? "🌲 " : "💀 "}
                SCORE: {result.score}
              </p>
              {claimStatus !== "done" && (
                <button
                  className="pixel-btn pixel-btn--accent"
                  disabled={claimStatus === "pending"}
                  onClick={handleClaim}
                >
                  {claimStatus === "pending" ? "Claiming…" : "Claim reward"}
                </button>
              )}
              {claimStatus === "done" && (
                <p className={styles.claimMsg}>
                  Claimed! Rank #{rank} on the leaderboard.
                  <br />
                  (MVP: recorded off-chain for now — real on-chain claim plugs in next, see README.)
                </p>
              )}
              {claimStatus === "error" && <p className={styles.claimMsg}>Something went wrong claiming. Try again.</p>}
            </>
          )}
        </div>

        <Leaderboard refreshKey={leaderboardKey} />
      </div>}
    </div>
  );
}
