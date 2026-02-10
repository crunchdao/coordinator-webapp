"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getCoordinatorProgram,
  CrunchModelsService,
  clientConfigFromProgram,
  ModelAccount,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useCrunchContext } from "../context/crunchContext";

export type CrunchModelDetail = {
  modelId: string;
  modelKey: string;
  owner: string;
  cruncherIndex: number;
};

export function useGetCrunchModels() {
  const { crunchName, crunchAddress } = useCrunchContext();
  const { anchorProvider } = useAnchorProvider();

  const query = useQuery({
    queryKey: ["crunch-models", crunchName],
    queryFn: async () => {
      const program = getCoordinatorProgram(anchorProvider!);
      const config = clientConfigFromProgram(program);
      const crunchModelsSvc = new CrunchModelsService(crunchAddress!, config);

      const crunchModels = await crunchModelsSvc.getCrunchModels();
      const modelAddresses = crunchModels.map((m) => m.modelKey);
      const modelAccounts = await program.account.model.fetchMultiple(modelAddresses);

      const results: CrunchModelDetail[] = [];
      modelAccounts.forEach((account: ModelAccount | null, index: number) => {
        if (!account) return;
        results.push({
          modelId: account.id,
          modelKey: modelAddresses[index].toString(),
          owner: account.owner.toString(),
          cruncherIndex: crunchModels[index].cruncherIndex,
        });
      });

      return results;
    },
    enabled: !!anchorProvider && !!crunchAddress,
  });

  return {
    models: query.data ?? [],
    modelsLoading: query.isLoading,
    modelsError: query.error,
  };
}
