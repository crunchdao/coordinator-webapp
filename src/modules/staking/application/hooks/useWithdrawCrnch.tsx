import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { useStakingContext } from "../context/stakingContext";
import { convertFromCrunch } from "@/utils/solana";

export const useWithdrawCrnch = () => {
  const queryClient = useQueryClient();
  const { stakingClient } = useStakingContext();

  const mutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!stakingClient) {
        throw new Error("Staking client not initialized");
      }

      const convertedAmount = convertFromCrunch(amount);
      if (convertedAmount <= BigInt(0)) {
        throw new Error("Amount must be greater than 0");
      }

      const txHash = await stakingClient.withdrawAmount(convertedAmount);
      return { txHash, amount: convertedAmount };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["staking-info"] });
      toast({
        title: "CRNCH withdrawn successfully",
        description: `Withdrawn ${result.amount.toString()} CRNCH from your staking account`,
      });
    },
    onError: (error: any) => {
      console.error("Withdraw error:", error);
      toast({
        title: "Failed to withdraw CRNCH",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    withdrawCrnch: mutation.mutate,
    withdrawCrnchAsync: mutation.mutateAsync,
    withdrawCrnchLoading: mutation.isPending,
    withdrawCrnchError: mutation.error,
  };
};