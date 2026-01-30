import { useCallback } from "react";
import { Transaction, TransactionInstruction, Keypair } from "@solana/web3.js";
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
          memo
        );

        return {
          signature: result.signature,
          isMultisig: true,
          proposalUrl: result.proposalUrl,
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
