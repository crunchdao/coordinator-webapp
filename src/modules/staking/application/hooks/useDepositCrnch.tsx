import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { useStakingContext } from "../context/stakingContext";
import { convertFromCrunch } from "@crunchdao/solana-utils";

export const useDepositCrnch = () => {
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

      const txHash = await stakingClient.depositAmount(convertedAmount);
      return { txHash, amount: convertedAmount };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["staking-info"] });
      toast({
        title: "CRNCH deposited successfully",
        description: `Deposited ${result.amount.toString()} CRNCH to your staking account`,
      });
    },
    onError: (error: any) => {
      console.error("Deposit error:", error);
      toast({
        title: "Failed to deposit CRNCH",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    depositCrnch: mutation.mutate,
    depositCrnchAsync: mutation.mutateAsync,
    depositCrnchLoading: mutation.isPending,
    depositCrnchError: mutation.error,
  };
};