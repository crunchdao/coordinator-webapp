import { useQuery } from "@tanstack/react-query";
import {
  getCoordinatorProgram,
  getCrunchesForCoordinatorWallet,
} from "@crunchdao/sdk";
import { PublicKey } from "@solana/web3.js";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useWallet } from "@/modules/wallet/application/context/walletContext";

export const useGetCoordinatorCrunches = () => {
  const { publicKey } = useWallet();
  const provider = useAnchorProvider();

  const query = useQuery({
    queryKey: ["coordinator-crunches", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey || !provider) {
        return [];
      }

      try {
        const coordinatorProgram = getCoordinatorProgram(provider);
        const crunches = await getCrunchesForCoordinatorWallet(
          coordinatorProgram,
          new PublicKey(publicKey)
        );

        return crunches || [];
      } catch (error) {
        console.error("Error fetching coordinator crunches:", error);
        throw error;
      }
    },
    enabled: !!publicKey && !!provider,
  });

  return {
    crunches: query.data,
    crunchesLoading: query.isLoading,
    crunchesPending: query.isPending,
  };
};
