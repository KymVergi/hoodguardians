import { defineChain } from "viem";

/**
 * Robinhood Chain (mainnet).
 * Source: https://docs.robinhood.com/chain/connecting/
 *   Chain ID: 4663
 *   Native currency: ETH
 *   Block explorer: https://robinhoodchain.blockscout.com
 *
 * RPC: uses Alchemy (paid tier) when NEXT_PUBLIC_ALCHEMY_RPC_URL is set,
 * falling back to the public rate-limited endpoint otherwise.
 * Robinhood Chain is an Arbitrum-based Ethereum L2, so it's fully
 * EVM/JSON-RPC compatible — standard wagmi/viem tooling works as-is.
 */
const ALCHEMY_RPC_URL = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
const PUBLIC_FALLBACK_RPC_URL = "https://rpc.mainnet.chain.robinhood.com";

export const ROBINHOOD_CHAIN_RPC_URL = ALCHEMY_RPC_URL || PUBLIC_FALLBACK_RPC_URL;

export const robinhoodChain = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [ROBINHOOD_CHAIN_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "Robinhood Chain Explorer",
      url: "https://robinhoodchain.blockscout.com",
    },
  },
  testnet: false,
});
