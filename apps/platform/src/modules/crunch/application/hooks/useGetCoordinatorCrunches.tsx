import { useQuery } from "@tanstack/react-query";
import {
  getCoordinatorProgram,
  getCrunchesForCoordinatorWallet,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";

export const useGetCoordinatorCrunches = () => {
  const { authority, isMultisigMode, ready } = useEffectiveAuthority();
  const { anchorProvider } = useAnchorProvider();

  const query = useQuery({
    queryKey: ["coordinator-crunches", authority?.toString(), isMultisigMode],
    queryFn: async () => {
      if (!authority || !anchorProvider) {
        return [];
      }
      const coordinatorProgram = getCoordinatorProgram(anchorProvider);
      const crunches = await getCrunchesForCoordinatorWallet(
        coordinatorProgram,
        authority
      );

      const transformedCrunches = crunches?.map((crunch) => ({
        ...crunch,
        state: crunch.state ? Object.keys(crunch.state)[0] : undefined,
      }));

      return transformedCrunches || [];
    },
    enabled: !!authority && !!anchorProvider && ready,
  });

  return {
    crunches: query.data,
    crunchesLoading: query.isLoading,
    crunchesPending: query.isPending,
    isMultisigMode,
  };
};
