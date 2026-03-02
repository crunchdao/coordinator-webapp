"use client";

import { PublicKey } from "@solana/web3.js";
import { Alert, AlertDescription, Skeleton } from "@crunch-ui/core";
import { Check } from "@crunch-ui/icons";
import { FundCrunchForm } from "@/modules/crunch/ui/fundCrunchForm";
import { useGetCoordinator } from "@/modules/coordinator/application/hooks/useGetCoordinator";
import { useGetCrunches } from "@/modules/crunch/application/hooks/useGetCrunches";
import { useGetRewardVaultBalance } from "@/modules/crunch/application/hooks/useGetRewardVaultBalance";

interface OnboardingFundCrunchFormProps {
  onSuccess?: () => void;
}

export function OnboardingFundCrunchForm({ onSuccess }: OnboardingFundCrunchFormProps) {
  const { coordinator, coordinatorLoading } = useGetCoordinator();
  const { crunches, crunchesLoading } = useGetCrunches(
    coordinator?.address ? { coordinator: coordinator.address } : undefined
  );

  const firstCrunch = crunches[0];
  const rewardVaultPubkey = firstCrunch?.rewardVault
    ? new PublicKey(firstCrunch.rewardVault)
    : undefined;
  const { vaultBalance, vaultBalanceLoading } =
    useGetRewardVaultBalance(rewardVaultPubkey);

  if (coordinatorLoading || crunchesLoading || vaultBalanceLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (!firstCrunch) {
    return (
      <p className="text-sm text-muted-foreground">
        No crunch found. Please create a crunch first.
      </p>
    );
  }

  const isFunded = vaultBalance > 0;

  if (isFunded) {
    return (
      <Alert variant="success">
        <Check className="w-4 h-4" />
        <AlertDescription>
          Your Crunch is funded with{" "}
          <span className="font-medium">
            {vaultBalance.toLocaleString()} USDC
          </span>
          . You're ready to go live!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <FundCrunchForm
      crunchName={firstCrunch.name}
      crunchAddress={new PublicKey(firstCrunch.address)}
      rewardVault={new PublicKey(firstCrunch.rewardVault)}
      showCrunchInfo
      onSuccess={onSuccess}
    />
  );
}
