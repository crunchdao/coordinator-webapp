import nodeClient from "./nodeClient";

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
  nodeUrl: string,
  params?: {
    source?: string;
    subject?: string;
    kind?: string;
    granularity?: string;
    limit?: number;
  }
): Promise<FeedRecord[]> => {
  const response = await nodeClient.get(`${nodeUrl}/reports/feeds/tail`, {
    params: { limit: 50, ...params },
  });
  return response.data;
};
