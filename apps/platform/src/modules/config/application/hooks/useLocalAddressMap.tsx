"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { readConfigFile } from "../../infrastructure/service";
import { useLocalCompetitionList } from "./useLocalCompetitionList";
import type { CompetitionEnvironments } from "../../domain/types";

export function useLocalAddressMap() {
  const { slugs, competitionsLoading } = useLocalCompetitionList();

  const envQueries = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: ["configFile", `crunches/${slug}/environments.json`],
      queryFn: () =>
        readConfigFile<CompetitionEnvironments>(
          `crunches/${slug}/environments.json`
        ),
      retry: false,
      enabled: !competitionsLoading,
    })),
  });

  const isLoading = competitionsLoading || envQueries.some((q) => q.isLoading);

  const addressToSlug = useMemo(() => {
    const result: Record<string, string> = {};
    slugs.forEach((slug, i) => {
      const envs = envQueries[i]?.data;
      if (!envs) return;
      for (const env of envs) {
        if (env.address) {
          result[env.address] = slug;
        }
      }
    });
    return result;
  }, [slugs, envQueries]);

  return { addressToSlug, isLoading };
}
