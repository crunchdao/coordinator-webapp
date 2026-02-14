import apiClient from "@coordinator/utils/src/api";
import { endpoints } from "./endpoints";
import { FeedSummary, FeedTailRecord } from "../domain/types";

export type FeedTailFilters = {
  provider?: string;
  asset?: string;
  kind?: string;
  granularity?: string;
  limit?: number;
};

export const getFeeds = async (): Promise<FeedSummary[]> => {
  const response = await apiClient.get(endpoints.getFeeds());
  return response.data;
};

export const getFeedsTail = async (
  filters: FeedTailFilters
): Promise<FeedTailRecord[]> => {
  const response = await apiClient.get(endpoints.getFeedsTail(), {
    params: {
      provider: filters.provider,
      asset: filters.asset,
      kind: filters.kind,
      granularity: filters.granularity,
      limit: filters.limit ?? 10,
    },
  });
  return response.data;
};
