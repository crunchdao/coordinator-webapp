"use client";
import { PublicKey } from "@solana/web3.js";
import { useGetRewardVaultBalance } from "../application/hooks/useGetRewardVaultBalance";

interface RewardVaultBalanceProps {
  rewardVaultAddress: PublicKey;
}

export function RewardVaultBalance({
  rewardVaultAddress,
}: RewardVaultBalanceProps) {
  const { vaultBalance, vaultBalanceLoading } =
    useGetRewardVaultBalance(rewardVaultAddress);

  if (vaultBalanceLoading) {
    return <span className="text-muted-foreground animate-pulse">Loading...</span>;
  }

  return <span>{vaultBalance.toLocaleString()} USDC</span>;
}
