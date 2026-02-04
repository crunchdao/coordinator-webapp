import { useCallback } from "react";
import {
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
        "confirmed"
      );
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = walletPublicKey;

      if (partialSigners.length > 0) {
        transaction.partialSign(...partialSigners);
      }

      const signature = await anchorProvider.sendAndConfirm(transaction);

      return {
        signature,
        isMultisig: false,
      };
    },
    [anchorProvider, walletPublicKey, isMultisigMode, multisigService]
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
