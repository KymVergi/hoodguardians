import { NextResponse } from "next/server";
import { leaderboardStore } from "@/lib/store/leaderboardStore";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const address = typeof body?.address === "string" ? body.address : null;
  const score = typeof body?.score === "number" ? Math.max(0, Math.floor(body.score)) : null;

  if (!address || score === null) {
    return NextResponse.json(
      { ok: false, error: "address and score are required" },
      { status: 400 },
    );
  }

  // MOCK CLAIM: no on-chain transaction happens here yet. This just
  // records the run so the leaderboard/UI has something real to show.
  // Replace this block with a wagmi writeContract() call against
  // REWARDS_CONTRACT_ADDRESS once that contract is deployed — see
  // src/lib/chain/rewardsContract.ts and src/lib/claim/claimReward.ts.
  const rank = leaderboardStore.submit({ address, score, ts: Date.now() });

  return NextResponse.json({ ok: true, rank, mock: true });
}
