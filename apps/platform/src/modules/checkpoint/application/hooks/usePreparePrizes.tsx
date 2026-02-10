"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import {
  getCoordinatorProgram,
  CrunchServiceWithContext,
  Prize,
  PreparedPrize,
} from "@crunchdao/sdk";
import { useAnchorProvider } from "@/modules/wallet/application/hooks/useAnchorProvider";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";

export function usePreparePrizes() {
  const { anchorProvider } = useAnchorProvider();
  const { crunchName } = useCrunchContext();

  const mutation = useMutation({
    mutationFn: async (prizes: Prize[]): Promise<PreparedPrize[]> => {
      if (!anchorProvider) {
        throw new Error("Wallet not connected");
      }

      const program = getCoordinatorProgram(anchorProvider);
      const crunchService = CrunchServiceWithContext({ program });
      return crunchService.checkpointPreparePrizes(crunchName, prizes);
    },
    onError: (error) => {
      console.error("Prepare prizes error:", error);
      toast({
        title: "Failed to prepare prizes",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    preparePrizes: mutation.mutateAsync,
    preparePrizesLoading: mutation.isPending,
    preparePrizesError: mutation.error,
  };
}
