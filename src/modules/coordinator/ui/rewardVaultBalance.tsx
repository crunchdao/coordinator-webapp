"use client";
import { PublicKey } from "@solana/web3.js";
import { useGetRewardVaultBalance } from "../application/hooks/useGetRewardVaultBalance";
import { Skeleton } from "@crunch-ui/core";

interface RewardVaultBalanceProps {
  rewardVaultAddress: PublicKey;
}

export function RewardVaultBalance({
  rewardVaultAddress,
}: RewardVaultBalanceProps) {
  const { vaultBalance, vaultBalanceLoading } =
    useGetRewardVaultBalance(rewardVaultAddress);

  if (vaultBalanceLoading) {
    return <Skeleton className="h-4 w-20 inline-block" />;
  }

  return <span>{vaultBalance.toLocaleString()} USDC</span>;
}
