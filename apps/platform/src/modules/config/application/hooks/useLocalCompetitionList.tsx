"use client";

import { useQuery } from "@tanstack/react-query";
import { listLocalCompetitions } from "../../infrastructure/service";

export function useLocalCompetitionList() {
  const query = useQuery({
    queryKey: ["localCrunches"],
    queryFn: listLocalCompetitions,
    retry: false,
  });

  const slugs =
    query.data?.entries
      ?.filter((e) => e.type === "directory")
      .map((e) => e.name) ?? [];

  return {
    slugs,
    competitionsLoading: query.isLoading,
    competitionsError: query.error,
  };
}
