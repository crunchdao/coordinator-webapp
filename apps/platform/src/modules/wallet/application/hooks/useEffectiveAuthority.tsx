import { useMemo } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { createMultisigService } from "@crunchdao/sdk";
import { useWallet } from "../context/walletContext";

/**
 * Returns the effective authority based on multisig settings.
 * - Multisig mode: returns the multisig vault PDA (the actual signer/owner)
 * - Direct mode: returns the connected wallet's publicKey
 *
 * Use this hook whenever you need to:
 * - Query on-chain data for the coordinator (e.g., fetch crunches)
 * - Build transaction instructions that require a signer/authority
 */
export const useEffectiveAuthority = () => {
  const { connection } = useConnection();
  const {
    publicKey,
    multisigAddress,
    isMultisigMode,
    signTransaction,
    signAllTransactions,
  } = useWallet();

  const { authority, multisigService } = useMemo(() => {
    // Direct mode: use connected wallet
    if (!isMultisigMode || !publicKey) {
      return {
        authority: publicKey,
        multisigService: null,
      };
    }

    // Multisig mode: use vault PDA
    try {
      // Pass the full wallet interface with signing capabilities
      const wallet = {
        publicKey,
        signTransaction,
        signAllTransactions,
      };
      const service = createMultisigService(
        connection,
        multisigAddress,
        wallet
      );
      const vaultPDA = service.getVaultPDA();

      return {
        authority: vaultPDA,
        multisigService: service,
      };
    } catch (error) {
      console.error("Failed to create multisig service:", error);
      // Fallback to wallet if multisig service fails
      return {
        authority: publicKey,
        multisigService: null,
      };
    }
  }, [
    isMultisigMode,
    connection,
    multisigAddress,
    publicKey,
    signTransaction,
    signAllTransactions,
  ]);

  return {
    /** The effective authority - vault PDA in multisig mode, wallet otherwise */
    authority,
    /** The connected wallet's public key (proposer in multisig mode) */
    walletPublicKey: publicKey,
    /** Whether multisig mode is active */
    isMultisigMode,
    /** The multisig address from settings (null if not configured) */
    multisigAddress: isMultisigMode ? multisigAddress : null,
    /** The multisig service instance (null in direct mode) */
    multisigService,
    /** Whether the hook is ready (wallet connected) */
    ready: Boolean(publicKey),
  };
};
