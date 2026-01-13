import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { useStakingContext } from "../context/stakingContext";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { convertFromCrunch } from "@crunchdao/solana-utils";
import { useWaitForConfirmation } from "@/modules/blockchain/application/hooks/useWaitForConfirmation";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";

interface StakeToCoordinatorParams {
  amount: number;
  coordinatorWallet?: string;
}

export const useStakeToCoordinator = () => {
  const queryClient = useQueryClient();
  const { stakingClient } = useStakingContext();
  const { publicKey } = useWallet();
  const [isConfirming, setIsConfirming] = useState(false);
  const { waitForConfirmation } = useWaitForConfirmation();

  const mutation = useMutation({
    mutationFn: async ({ amount, coordinatorWallet }: StakeToCoordinatorParams) => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      if (!stakingClient) {
        throw new Error("Staking client not initialized");
      }

      const convertedAmount = convertFromCrunch(amount);
      if (convertedAmount <= BigInt(0)) {
        throw new Error("Amount must be greater than 0");
      }

      const targetWallet = coordinatorWallet ? new PublicKey(coordinatorWallet) : publicKey;

      // Get initial deposit amount before transaction
      const initialDepositAmount = await stakingClient.getAvailableAmountToStake();

      const signature = await stakingClient.stakeToCoordinator(targetWallet, convertedAmount);

      setIsConfirming(true);

      await waitForConfirmation(
        signature,
        async () => {
          // Check if user's balance has decreased by expected amount
          const currentDepositAmount = await stakingClient.getAvailableAmountToStake();
          const diff = initialDepositAmount - currentDepositAmount;
          
          return diff >= convertedAmount;
        },
        10, // maxAttempts
        3500 // delayMs
      );

      setIsConfirming(false);

      return { signature, amount: convertedAmount, targetWallet: targetWallet.toString() };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["staking-info"] });
      queryClient.invalidateQueries({ queryKey: ["coordinator"] });
      
      const isSelfStake = result.targetWallet === publicKey?.toString();
      toast({
        title: "Successfully staked",
        description: `Staked ${result.amount.toString()} CRNCH ${isSelfStake ? 'to yourself' : 'to coordinator'}`,
      });
    },
    onError: (error: any) => {
      setIsConfirming(false);
      console.error("Staking error:", error);
      toast({
        title: "Failed to stake",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
    retry: 1,
  });

  useEffect(() => {
    if (mutation.isIdle && isConfirming) {
      // Timeout reached, invalidate queries
      queryClient.invalidateQueries({ queryKey: ["staking-info"] });
      setIsConfirming(false);
    }
  }, [mutation.isIdle, isConfirming, queryClient]);

  return {
    stakeToCoordinator: mutation.mutateAsync,
    stakeToCoordinatorLoading: mutation.isPending || isConfirming,
  };
};