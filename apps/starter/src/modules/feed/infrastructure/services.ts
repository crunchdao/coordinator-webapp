import apiClient from "@coordinator/utils/src/api";
import { endpoints } from "./endpoints";
import { FeedSummary, FeedTailRecord } from "../domain/types";

export type FeedTailFilters = {
  source?: string;
  subject?: string;
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
      source: filters.source,
      subject: filters.subject,
      kind: filters.kind,
      granularity: filters.granularity,
      limit: filters.limit ?? 50,
    },
  });
  return response.data;
};
