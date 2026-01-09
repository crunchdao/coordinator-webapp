import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { useStakingContext } from "../context/stakingContext";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import { convertFromCrunch } from "@/utils/solana";
import { PublicKey } from "@solana/web3.js";

interface UnstakeFromCoordinatorParams {
  amount: number;
  coordinatorWallet?: string;
}

export const useUnstakeFromCoordinator = () => {
  const queryClient = useQueryClient();
  const { stakingClient } = useStakingContext();
  const { publicKey } = useWallet();

  const mutation = useMutation({
    mutationFn: async ({ amount, coordinatorWallet }: UnstakeFromCoordinatorParams) => {
      if (!stakingClient) {
        throw new Error("Staking client not initialized");
      }

      const convertedAmount = convertFromCrunch(amount);
      if (convertedAmount <= BigInt(0)) {
        throw new Error("Amount must be greater than 0");
      }

      const targetWallet = coordinatorWallet ? new PublicKey(coordinatorWallet) : publicKey;
      if (!targetWallet) {
        throw new Error("No target wallet specified");
      }

      const txHash = await stakingClient.unstakeFromCoordinator(targetWallet, convertedAmount);
      
      if (!txHash) {
        throw new Error("Failed to unstake");
      }
      
      return { txHash, amount: convertedAmount, targetWallet: targetWallet.toString() };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["staking-info"] });
      queryClient.invalidateQueries({ queryKey: ["coordinator"] });
      
      const isSelfUnstake = result.targetWallet === publicKey?.toString();
      toast({
        title: "Successfully unstaked",
        description: `Unstaked ${result.amount.toString()} CRNCH ${isSelfUnstake ? 'from yourself' : 'from coordinator'}`,
      });
    },
    onError: (error: any) => {
      console.error("Unstaking error:", error);
      toast({
        title: "Failed to unstake",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    unstakeFromCoordinator: mutation.mutate,
    unstakeFromCoordinatorAsync: mutation.mutateAsync,
    unstakeFromCoordinatorLoading: mutation.isPending,
    unstakeFromCoordinatorError: mutation.error,
  };
};