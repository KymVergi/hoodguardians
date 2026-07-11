import Link from "next/link";
import WalletConnectButton from "@/components/WalletConnectButton";
import { GUARDIAN_TYPES } from "@/game/data/guardianTypes";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <nav className={styles.nav}>
          <div className={styles.brandGroup}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logohg.png" alt="HoodGuardians" className={styles.brandLogo} />
            <span className={styles.brand}>HOODGUARDIANS</span>
          </div>
          <WalletConnectButton />
        </nav>

        <div className={styles.heroBody}>
          <h1 className={styles.title}>
            Defend the <span>Grove</span> from the forest
          </h1>
          <p className={styles.subtitle}>
            Hatch a guardian, place it on the path, and survive 6 waves of forest
            creatures. Every run ends in a score you can claim with your wallet.
          </p>
          <div className={styles.ctaRow}>
            <Link href="/play" className={`pixel-btn pixel-btn--accent ${styles.ctaBtn}`}>
              ▶ PLAY NOW
            </Link>
          </div>
          <span className={styles.chainBadge}>Connect your wallet to play &amp; claim rewards on Robinhood Chain</span>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>CHOOSE YOUR GUARDIAN</h2>
        <div className={styles.grid}>
          {GUARDIAN_TYPES.map((g) => (
            <div className={`pixel-panel ${styles.card}`} key={g.id}>
              <h3 className={styles.cardTitle}>{g.name}</h3>
              <p className={styles.cardBody}>
                {g.description}
                <br />
                DMG {g.damage} · Range {g.range} · Cooldown {g.cooldownMs}ms
                {g.splashRadius ? " · Area damage" : ""}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>HOW TO PLAY</h2>
        <div className={styles.steps}>
          <div className={`pixel-panel ${styles.step}`}>
            <span className={styles.stepNum}>1</span>
            <p className={styles.stepBody}>
              <b>Hatch</b> one of 3 basic guardians to start — you can switch between
              all 3 anytime while placing, mid-run.
            </p>
          </div>
          <div className={`pixel-panel ${styles.step}`}>
            <span className={styles.stepNum}>2</span>
            <p className={styles.stepBody}>
              <b>Place</b> copies of your guardian along the path using the coins you
              earn from kills and cleared waves.
            </p>
          </div>
          <div className={`pixel-panel ${styles.step}`}>
            <span className={styles.stepNum}>3</span>
            <p className={styles.stepBody}>
              <b>Survive 6 waves.</b> The Grove has 5 lives — if an enemy reaches the
              end, you lose one.
            </p>
          </div>
          <div className={`pixel-panel ${styles.step}`}>
            <span className={styles.stepNum}>4</span>
            <p className={styles.stepBody}>
              <b>Connect your wallet</b> and claim your score when you&apos;re done. Enter
              the global leaderboard.
            </p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.tokenSection}`}>
        <h2 className={styles.sectionTitle}>$GUARDIAN TOKEN</h2>
        <div className={`pixel-panel ${styles.tokenPanel}`}>
          <div className={styles.tokenAddressRow}>
            <span className={styles.tokenAddress}>Contract address — coming soon</span>
          </div>
          <div className={styles.socialRow}>
            <a
              className={styles.socialLink}
              href="https://x.com/hoodguardiansrh"
              target="_blank"
              rel="noreferrer"
              aria-label="HoodGuardians on X"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>HoodGuardians 2026 on Robin Hood Chain</p>
      </footer>
    </main>
  );
}
