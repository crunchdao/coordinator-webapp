"use client";
import { useEffectiveAuthority as useEffectiveAuthorityBase } from "@crunchdao/solana-utils";
import { useWallet } from "../context/walletContext";
import { useWalletAdapter } from "./useWalletAdapter";

/**
 * Wrapper that provides the wallet adapter context
 * to @crunchdao/solana-utils's useEffectiveAuthority.
 *
 * Falls back to the raw publicKey when the full wallet adapter
 * isn't ready yet (e.g., signTransaction not available during initial load).
 */
export const useEffectiveAuthority = () => {
  const { walletAdapter, connection } = useWalletAdapter();
  const { publicKey, connected } = useWallet();

  const result = useEffectiveAuthorityBase({
    connection,
    wallet: walletAdapter,
  });

  return {
    ...result,
    // If walletAdapter isn't ready yet but we have a publicKey,
    // use it as the authority so read-only queries can still work
    authority: result.authority ?? publicKey,
    ready: result.ready || (connected && !!publicKey),
  };
};
