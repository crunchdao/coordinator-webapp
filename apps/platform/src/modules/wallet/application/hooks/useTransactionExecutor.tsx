import { useCallback } from "react";
import {
  Connection,
  Transaction,
  TransactionInstruction,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import { useAnchorProvider } from "./useAnchorProvider";
import { useEffectiveAuthority } from "./useEffectiveAuthority";

export interface ExecuteTransactionParams {
  instructions: TransactionInstruction[];
  partialSigners?: Keypair[];
  memo: string;
}

export interface ExecuteTransactionResult {
  signature: string;
  isMultisig: boolean;
  proposalUrl?: string;
  /** For multisig proposals: the transaction index to track status */
  transactionIndex?: bigint;
  /** For multisig proposals: the multisig PDA address */
  multisigPda?: PublicKey;
}

const POLL_INTERVAL_MS = 2_000;
const MAX_POLL_DURATION_MS = 120_000;

/**
 * Poll `getSignatureStatuses` until the transaction reaches the desired
 * commitment or the deadline is exceeded.  This is intentionally decoupled
 * from both the WebSocket subscription path and the blockhash-based expiry
 * check in `Connection.confirmTransaction`, both of which are unreliable
 * when the RPC node's WebSocket endpoint is flaky or when the RPC is slow
 * to report signature statuses.
 */
async function pollForConfirmation(
  connection: Connection,
  signature: string,
  commitment: "confirmed" | "finalized" = "confirmed",
): Promise<void> {
  const deadline = Date.now() + MAX_POLL_DURATION_MS;

  while (Date.now() < deadline) {
    const { value } = await connection.getSignatureStatuses([signature]);
    const status = value?.[0];

    if (status?.err) {
      throw new Error(
        `Transaction ${signature} failed: ${JSON.stringify(status.err)}`,
      );
    }

    if (status !== null && status !== undefined) {
      const reached =
        commitment === "confirmed"
          ? status.confirmationStatus === "confirmed" ||
            status.confirmationStatus === "finalized"
          : status.confirmationStatus === "finalized";

      if (reached) return;
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  throw new Error(
    `Transaction ${signature} was not confirmed within ${MAX_POLL_DURATION_MS / 1000}s. ` +
      "It may still succeed — check the Solana Explorer.",
  );
}

export const useTransactionExecutor = () => {
  const { anchorProvider } = useAnchorProvider();
  const {
    authority,
    walletPublicKey,
    isMultisigMode,
    multisigAddress,
    multisigService,
    ready,
  } = useEffectiveAuthority();

  const executeTransaction = useCallback(
    async ({
      instructions,
      partialSigners = [],
      memo,
    }: ExecuteTransactionParams): Promise<ExecuteTransactionResult> => {
      if (!anchorProvider || !walletPublicKey) {
        throw new Error("Wallet not connected");
      }

      // Multisig mode: propose transaction instead of executing
      if (isMultisigMode && multisigService) {
        const result = await multisigService.proposeTransaction(
          instructions,
          memo,
          0, // vaultIndex — default vault (index 0) of the multisig
          { createProposal: true }
        );

        return {
          signature: result.signature,
          isMultisig: true,
          proposalUrl: result.proposalUrl,
          transactionIndex: result.transactionIndex,
          multisigPda: result.multisigPda,
        };
      }

      // Direct execution mode
      const transaction = new Transaction();
      transaction.add(...instructions);

      const { blockhash } = await anchorProvider.connection.getLatestBlockhash(
        "confirmed",
      );
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = walletPublicKey;

      if (partialSigners.length > 0) {
        transaction.partialSign(...partialSigners);
      }

      // Sign with the wallet, send the raw transaction, then poll for
      // confirmation ourselves.  Both the WebSocket-based and the
      // blockhash-expiry-based confirmation strategies built into
      // @solana/web3.js are unreliable when the RPC WebSocket is down or
      // the node is slow to report signature statuses — they throw
      // "TransactionExpiredTimeoutError" / "TransactionExpiredBlockheight-
      // ExceededError" even when the transaction has already landed on-chain.
      const signedTx =
        await anchorProvider.wallet.signTransaction(transaction);
      const signature = await anchorProvider.connection.sendRawTransaction(
        signedTx.serialize(),
      );

      await pollForConfirmation(anchorProvider.connection, signature);

      return {
        signature,
        isMultisig: false,
      };
    },
    [anchorProvider, walletPublicKey, isMultisigMode, multisigService],
  );

  return {
    executeTransaction,
    /** The effective authority for building instructions - vault in multisig mode, wallet otherwise */
    authority,
    isMultisigMode,
    multisigAddress,
    ready: ready && Boolean(anchorProvider),
  };
};
