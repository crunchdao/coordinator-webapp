"use client";
import { ReactNode, useCallback } from "react";
import { TooltipProvider } from "@crunch-ui/core";
import { WalletProvider } from "@/modules/wallet/application/context/walletContext";
import { AuthProvider } from "@/modules/auth/application/context/authContext";
import { OnboardingProvider } from "@/modules/onboarding/application/context/onboardingContext";
import { StakingProvider } from "@crunchdao/staking";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import { useTransactionExecutor } from "@/modules/wallet/application/hooks/useTransactionExecutor";
import { MultisigProposalTrackerProvider } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import { MultisigProposalTrackerDialog } from "@/modules/wallet/ui/multisigProposalTrackerDialog";
import { useMultisigProposalTracker } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import { useQueryClient } from "@tanstack/react-query";
import type { TransactionExecutor } from "@crunchdao/solana-utils";

const StakingWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { anchorProvider } = useAnchorProvider();
  const { authority, isMultisigMode } = useEffectiveAuthority();
  const { executeTransaction } = useTransactionExecutor();
  const { trackProposal } = useMultisigProposalTracker();
  const queryClient = useQueryClient();

  const cluster =
    process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
      ? "mainnet-beta"
      : "devnet";

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

const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WalletProvider>
      <AuthProvider>
        <MultisigProposalTrackerProvider>
          <StakingWrapper>
            <TooltipProvider delayDuration={50}>
              {children}
              <MultisigProposalTrackerDialog />
            </TooltipProvider>
          </StakingWrapper>
        </MultisigProposalTrackerProvider>
      </AuthProvider>
    </WalletProvider>
  );
};

export default Providers;
