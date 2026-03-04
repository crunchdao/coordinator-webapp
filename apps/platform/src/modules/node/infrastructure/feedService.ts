import apiClient from "@coordinator/utils/src/api";

export interface FeedRecord {
  source: string;
  subject: string;
  kind: string;
  granularity: string;
  ts_event: string;
  ts_ingested: string;
  values: Record<string, number | string>;
  meta: Record<string, unknown>;
}

export const getNodeFeedTail = async (
  crunchName: string,
  params?: {
    source?: string;
    subject?: string;
    kind?: string;
    granularity?: string;
    limit?: number;
  }
): Promise<FeedRecord[]> => {
  const response = await apiClient.get(
    `/crunches/${crunchName}/reports/feeds/tail`,
    { params: { limit: 50, ...params } }
  );
  return response.data;
};
