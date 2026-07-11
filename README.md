# HoodGuardians — Pixel Forest Defense (MVP)

Browser tower defense, pixel-art style. Next.js 16 for the app, Phaser 4 for
the game, wagmi/viem for wallet + Robinhood Chain. No Tailwind — plain CSS.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack) — landing + `/play`
- **Phaser 4** — game engine, mounted client-side (`src/game`)
- **wagmi 3 + viem 2** — wallet connection, configured for **Robinhood Chain
  mainnet** (chainId `4663`, see `src/lib/chain/robinhoodChain.ts`)
- **Alchemy RPC** — uses your paid Alchemy endpoint by default (set in
  `.env.local`), falls back to the public rate-limited RPC if unset
- CSS Modules + CSS variables — pixel theme, no UI framework

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. `.env.local` already has your Alchemy RPC URL
for Robinhood Chain mainnet. You'll need an injected wallet (MetaMask, Rabby,
etc.) to test connect/claim — the wallet button offers to switch networks if
you're on the wrong chain.

`npm run build && npm run start` to test the production build.

⚠️ **This is mainnet.** Real ETH, real gas, real transactions once the claim
is wired to a real contract (see below — right now claim is still mocked).
Don't commit `.env.local` to a public repo; the Alchemy key is a paid key
exposed to the client bundle by design (RPC calls happen in the browser),
but treat it like any other client-exposed key and rotate it if it leaks.

## Implemented mechanics (MVP)

- Landing (`/`) with pitch, guardians, and CTA into `/play`.
- Hatch: pick a starter guardian (Oak/tank, Breeze/fast, Ember/AoE).
- In-run selector (under the canvas) to switch which of the 3 you place
  next, anytime — not locked to your hatch pick.
- Place guardians along the path (costs coins, per type).
- 6 waves across 4 enemy types (CraftPix packs), increasing difficulty.
- Grove with 5 lives, coins, score.
- Game over → connect wallet → **claim** your score.
- Simple leaderboard (top 10), fed by claims.

## About the assets

- Level background/theme: CraftPix "Free Tower Defense 2D Vector Tileset"
  (`game_background_4`, forest theme).
- Enemies (4 types, walk/death animations): CraftPix "Free Field Enemies
  Pixel Art for Tower Defense".
  Both under CraftPix's free license (craftpix.net/file-licenses).
- Guardians (idle/attack animations) and the Grove keep: from `defenders.zip`.
  All 3 guardian types share the same base unit sprite
  (`public/assets/guardians/archer_idle.png` / `archer_attack.png`), told apart
  with a per-type color tint applied at runtime (see `Guardian.ts`) — that
  pack only shipped one clearly-readable unit design, so re-tinting was the
  fastest way to get 3 distinct-looking guardians without mixing art styles.
  The arrow projectile and the level-7 keep art (used as the Grove's home
  base at the end of the path) are from the same pack.

## On-chain claim: still mocked, wired for the real contract

As agreed, the claim in this build does **not** send any transaction — it
records the score in an in-memory server store
(`src/lib/store/leaderboardStore.ts`) via `POST /api/claim`. Everything else
(wallet connected to Robinhood Chain mainnet via Alchemy, address, claim UI)
is real.

To connect your contract once it's deployed:

1. Set the address in `.env.local`:
   ```
   NEXT_PUBLIC_REWARDS_CONTRACT_ADDRESS=0x...
   ```
2. Paste the real ABI into `src/lib/chain/rewardsContract.ts` (already shaped
   for a `claim(uint256 score)` function).
3. In `src/lib/claim/claimReward.ts`, set `USE_MOCK_CLAIM = false` and
   uncomment the `writeContract` block (already written, just needs
   enabling).

No UI or game logic needs to change — everything goes through
`claimReward()`.

## Structure

```
src/
  app/                 landing, /play, API routes (claim, leaderboard)
  components/          WalletConnectButton, GameOverlay, Leaderboard, Providers
  game/                Phaser: scenes, entities, balance data
  lib/chain/           Robinhood Chain + wagmi config + contract stub
  lib/claim/           claimReward() (mock -> real contract)
  lib/store/           in-memory leaderboard (swap for a real DB)
public/assets/         forest background + 4 enemy sprite sheets
```

## Logo

`public/logohg.png` (and `src/app/icon.png` for the favicon) is currently a
generated placeholder shield in the game's palette — the real logo you
shared came through as an inline paste rather than an attached file, so
there was nothing to save to disk (only actual file attachments make it into
the project, the same way `defenders.zip` did). Attach it as a file and I'll
drop it in place of the placeholder.

## Obvious next steps for production

- Drop in the logo once it comes through as a real file (see above).
- Deployed rewards contract + real `writeContract` integration.
- Real leaderboard persistence (currently in-memory, resets on server
  restart).
- Difficulty/economy balancing pass now that real guardian sprites are in.
- Consider sourcing 2-3 more distinct unit designs so guardians don't rely
  purely on color tinting to read apart.
