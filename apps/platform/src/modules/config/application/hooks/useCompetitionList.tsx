"use client";

import { useQuery } from "@tanstack/react-query";
import { listCompetitions } from "../../infrastructure/service";

export function useCompetitionList() {
  const query = useQuery({
    queryKey: ["localCrunches"],
    queryFn: listCompetitions,
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
