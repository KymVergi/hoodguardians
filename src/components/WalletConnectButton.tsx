"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { robinhoodChain } from "@/lib/chain/robinhoodChain";
import styles from "./WalletConnectButton.module.css";

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function WalletConnectButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const wrongChain = isConnected && chainId !== robinhoodChain.id;

  if (isConnected && address) {
    return (
      <div className={styles.wrap}>
        <span className={styles.address}>{short(address)}</span>
        {wrongChain && (
          <button
            className="pixel-btn pixel-btn--accent"
            disabled={isSwitching}
            onClick={() => switchChain({ chainId: robinhoodChain.id })}
          >
            {isSwitching ? "Switching…" : "Switch to Robinhood Chain"}
          </button>
        )}
        <button className="pixel-btn" onClick={() => disconnect()}>
          Disconnect
        </button>
      </div>
    );
  }

  const connector = connectors[0];

  return (
    <div className={styles.wrap}>
      <button
        className="pixel-btn pixel-btn--accent"
        disabled={!connector || isPending}
        onClick={() => connector && connect({ connector, chainId: robinhoodChain.id })}
      >
        {isPending ? "Connecting…" : "Connect wallet"}
      </button>
      {!connector && (
        <span className={styles.hint}>
          No wallet detected (e.g. MetaMask). Install one to connect to
          Robinhood Chain.
        </span>
      )}
    </div>
  );
}
