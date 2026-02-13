import apiClient from "@coordinator/utils/src/api";

export interface NodeHealth {
  status: string;
}

export interface NodeModel {
  model_id: string;
  model_name: string;
  cruncher_name: string;
  cruncher_id: string;
  deployment_id: string;
}

export interface NodeFeed {
  source: string;
  subject: string;
  kind: string;
  granularity: string;
  record_count: number;
  oldest_ts: string;
  newest_ts: string;
  watermark_ts: string;
  watermark_updated_at: string;
}

export interface NodeSnapshot {
  id: string;
  model_id: string;
  period_start: string;
  period_end: string;
  prediction_count: number;
  result_summary: Record<string, number>;
  created_at: string;
}

export const getNodeHealth = async (
  crunchName: string
): Promise<NodeHealth> => {
  const response = await apiClient.get(
    `/crunches/${crunchName}/healthz`
  );
  return response.data;
};

export const getNodeModels = async (
  crunchName: string
): Promise<NodeModel[]> => {
  const response = await apiClient.get(
    `/crunches/${crunchName}/reports/models`
  );
  return response.data;
};

export const getNodeFeeds = async (
  crunchName: string
): Promise<NodeFeed[]> => {
  const response = await apiClient.get(
    `/crunches/${crunchName}/reports/feeds`
  );
  return response.data;
};

export const getNodeSnapshots = async (
  crunchName: string,
  limit: number = 10
): Promise<NodeSnapshot[]> => {
  const response = await apiClient.get(
    `/crunches/${crunchName}/reports/snapshots`,
    { params: { limit } }
  );
  return response.data;
};
