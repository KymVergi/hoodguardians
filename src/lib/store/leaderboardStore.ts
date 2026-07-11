export interface LeaderboardEntry {
  address: string;
  score: number;
  ts: number;
}

// In-memory store for the MVP. Survives across requests in a single dev/
// prod server process (kept on globalThis so Next's HMR doesn't wipe it
// between recompiles). Swap for a real DB or on-chain read once the
// rewards contract exists.
const g = globalThis as unknown as { __hgLeaderboard?: LeaderboardEntry[] };
if (!g.__hgLeaderboard) g.__hgLeaderboard = [];

export const leaderboardStore = {
  submit(entry: LeaderboardEntry) {
    g.__hgLeaderboard!.push(entry);
    return leaderboardStore.rank(entry.address);
  },
  top(limit = 10): LeaderboardEntry[] {
    const bestByAddress = new Map<string, LeaderboardEntry>();
    for (const e of g.__hgLeaderboard!) {
      const prev = bestByAddress.get(e.address);
      if (!prev || e.score > prev.score) bestByAddress.set(e.address, e);
    }
    return [...bestByAddress.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
  rank(address: string): number {
    const all = leaderboardStore.top(Number.MAX_SAFE_INTEGER);
    const idx = all.findIndex((e) => e.address === address);
    return idx === -1 ? all.length + 1 : idx + 1;
  },
};
