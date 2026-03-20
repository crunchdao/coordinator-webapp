"use client";

import { ReactNode, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { StakingProvider } from "@crunchdao/staking";
import type { ExecuteTransactionParams, ExecuteTransactionResult } from "@crunchdao/solana-utils";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { useMultisigProposalTracker } from "@crunchdao/solana-utils";
import { useEnvironment } from "@/modules/environment/application/context/environmentContext";

export function StakingWrapper({ children }: { children: ReactNode }) {
  const { anchorProvider } = useAnchorProvider();
  const { authority, isMultisigMode } = useEffectiveAuthority();
  const { executeTransaction } = useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();
  const queryClient = useQueryClient();

  const { config } = useEnvironment();
  const cluster = config.solana.cluster;

  type TransactionExecutor = (params: ExecuteTransactionParams) => Promise<ExecuteTransactionResult>;

  const stakingTransactionExecutor: TransactionExecutor =
    useCallback<TransactionExecutor>(
      async ({ instructions, memo }) => {
        const result = await executeTransaction({
          instructions,
          memo,
        });

        if (
          result.isMultisig &&
          result.transactionIndex &&
          result.multisigPda
        ) {
          trackProposal({
            multisigPda: result.multisigPda,
            transactionIndex: result.transactionIndex,
            memo,
            proposalUrl: result.proposalUrl,
            signature: result.signature,
            onExecuted: () => {
              queryClient.invalidateQueries({ queryKey: ["staking"] });
            },
          });
        }

        return result;
      },
      [executeTransaction, trackProposal, queryClient]
    );

  return (
    <StakingProvider
      anchorProvider={anchorProvider}
      cluster={cluster}
      owner={authority ?? undefined}
      transactionExecutor={
        isMultisigMode ? stakingTransactionExecutor : undefined
      }
    >
      {children}
    </StakingProvider>
  );
}
