/**
 * Placeholder for the on-chain rewards contract.
 *
 * The current MVP claim flow is a MOCK: scores are recorded server-side
 * (see src/app/api/claim/route.ts) and no on-chain transaction happens yet.
 *
 * Once you deploy your rewards/points contract on Robinhood Chain, wire it
 * up here and flip `USE_MOCK_CLAIM` to false in `src/lib/claim/claimReward.ts`.
 * Nothing else in the app needs to change — the claim button already calls
 * `claimReward()`, which will start using this contract automatically.
 */

// 1. Fill in once deployed:
export const REWARDS_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_REWARDS_CONTRACT_ADDRESS as `0x${string}` | undefined) ??
  undefined;

// 2. Paste the real ABI here (or generate it with wagmi CLI / abitype).
//    Shape assumed for a simple "claim(uint256 score)" rewards contract.
export const REWARDS_CONTRACT_ABI = [
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [{ name: "score", type: "uint256" }],
    outputs: [],
  },
  {
    type: "event",
    name: "Claimed",
    inputs: [
      { name: "player", type: "address", indexed: true },
      { name: "score", type: "uint256", indexed: false },
    ],
  },
] as const;
