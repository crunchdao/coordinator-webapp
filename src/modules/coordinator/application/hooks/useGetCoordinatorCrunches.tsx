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
      const coordinatorProgram = getCoordinatorProgram(provider);
      const crunches = await getCrunchesForCoordinatorWallet(
        coordinatorProgram,
        new PublicKey(publicKey)
      );

      const transformedCrunches = crunches?.map((crunch) => ({
        ...crunch,
        state: crunch.state ? Object.keys(crunch.state)[0] : undefined,
      }));

      return transformedCrunches || [];
    },
    enabled: !!publicKey && !!provider,
  });

  return {
    crunches: query.data,
    crunchesLoading: query.isLoading,
    crunchesPending: query.isPending,
  };
};
