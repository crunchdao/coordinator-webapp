"use client";
import { ReactNode, useCallback } from "react";
import { TooltipProvider } from "@crunch-ui/core";
import { WalletProvider } from "@/modules/wallet/application/context/walletContext";
import { CoordinatorAuthProvider } from "@/modules/coordinator/application/context/coordinatorAuthContext";
import { StakingProvider } from "@crunchdao/staking";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { MultisigProposalTrackerProvider } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import { MultisigProposalTrackerDialog } from "@/modules/wallet/ui/multisigProposalTrackerDialog";
import { useMultisigProposalTracker } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import { useQueryClient } from "@tanstack/react-query";
import type { TransactionExecutor } from "@crunchdao/solana-utils";
import {
  EnvironmentProvider,
  useEnvironment,
} from "@/modules/environment/application/context/environmentContext";

const StakingWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { anchorProvider } = useAnchorProvider();
  const { authority, isMultisigMode } = useEffectiveAuthority();
  const { executeTransaction } = useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();
  const queryClient = useQueryClient();

  const { config } = useEnvironment();
  const cluster = config.solana.cluster;

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
};

const InnerProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { environment } = useEnvironment();

  return (
    <WalletProvider key={environment}>
      <CoordinatorAuthProvider>
        <MultisigProposalTrackerProvider>
          <StakingWrapper>
            <TooltipProvider delayDuration={50}>
              {children}
              <MultisigProposalTrackerDialog />
            </TooltipProvider>
          </StakingWrapper>
        </MultisigProposalTrackerProvider>
      </CoordinatorAuthProvider>
    </WalletProvider>
  );
};

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <EnvironmentProvider>
      <InnerProviders>{children}</InnerProviders>
    </EnvironmentProvider>
  );
};

export default Providers;
