import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useWallet } from "@/modules/wallet/application/context/walletContext";

export const useRequestFaucet = () => {
  const queryClient = useQueryClient();
  const provider = useAnchorProvider();
  const { publicKey } = useWallet();

  const mutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!provider || !publicKey) {
        throw new Error("Wallet not connected");
      }

      if (process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta") {
        throw new Error("Faucet is only available on devnet");
      }

      throw new Error(
        "Faucet endpoint not implemented. Please contact admin for devnet CRNCH."
      );
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
      toast({
        title: "CRNCH received successfully",
        description: `Received ${result} CRNCH from faucet`,
      });
    },
    onError: (error: any) => {
      console.error("Faucet error:", error);
      toast({
        title: "Failed to request CRNCH",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  return {
    requestFaucet: mutation.mutate,
    requestFaucetAsync: mutation.mutateAsync,
    requestFaucetLoading: mutation.isPending,
    requestFaucetError: mutation.error,
  };
};
