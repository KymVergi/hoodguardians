// Flip this to false once REWARDS_CONTRACT_ADDRESS (src/lib/chain/rewardsContract.ts)
// points at a real deployed contract, and fill in the writeContract branch below.
export const USE_MOCK_CLAIM = true;

export interface ClaimResult {
  ok: boolean;
  rank?: number;
  txHash?: string;
  error?: string;
}

export async function claimReward(address: string, score: number): Promise<ClaimResult> {
  if (USE_MOCK_CLAIM) {
    const res = await fetch("/api/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, score }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) return { ok: false, error: data.error ?? "claim failed" };
    return { ok: true, rank: data.rank };
  }

  // --- Real on-chain path (fill in once the contract is deployed) ---
  // import { writeContract } from "@wagmi/core";
  // import { wagmiConfig } from "@/lib/chain/wagmiConfig";
  // import { REWARDS_CONTRACT_ADDRESS, REWARDS_CONTRACT_ABI } from "@/lib/chain/rewardsContract";
  //
  // const hash = await writeContract(wagmiConfig, {
  //   address: REWARDS_CONTRACT_ADDRESS!,
  //   abi: REWARDS_CONTRACT_ABI,
  //   functionName: "claim",
  //   args: [BigInt(score)],
  // });
  // return { ok: true, txHash: hash };

  return { ok: false, error: "on-chain claim not configured yet" };
}
