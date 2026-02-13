import nodeClient from "./nodeClient";
import { NodeCheckpoint } from "../../checkpoint/domain/nodeTypes";

export interface NodeHealth {
  status: string;
}

export interface NodeInfo {
  crunch_id: string;
  crunch_address: string;
  network: string;
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

export const getNodeInfo = async (nodeUrl: string): Promise<NodeInfo> => {
  const response = await nodeClient.get(`${nodeUrl}/info`);
  return response.data;
};

export const getNodeHealth = async (nodeUrl: string): Promise<NodeHealth> => {
  // Try /healthz first, fall back to /reports/models as a connectivity check
  try {
    const response = await nodeClient.get(`${nodeUrl}/healthz`);
    return response.data;
  } catch {
    // Older nodes may not have /healthz — try any reports endpoint
    const response = await nodeClient.get(`${nodeUrl}/reports/models`);
    if (response.status === 200) {
      return { status: "ok" };
    }
    throw new Error("Node unreachable");
  }
};

export const getNodeModels = async (nodeUrl: string): Promise<NodeModel[]> => {
  const response = await nodeClient.get(`${nodeUrl}/reports/models`);
  return response.data;
};

export const getNodeFeeds = async (nodeUrl: string): Promise<NodeFeed[]> => {
  const response = await nodeClient.get(`${nodeUrl}/reports/feeds`);
  return response.data;
};

export const getNodeSnapshots = async (
  nodeUrl: string,
  limit: number = 10
): Promise<NodeSnapshot[]> => {
  const response = await nodeClient.get(`${nodeUrl}/reports/snapshots`, {
    params: { limit },
  });
  return response.data;
};

export const getNodeCheckpoints = async (
  nodeUrl: string,
  status?: string
): Promise<NodeCheckpoint[]> => {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  const response = await nodeClient.get(`${nodeUrl}/reports/checkpoints`, {
    params,
  });
  return response.data;
};

export const confirmNodeCheckpoint = async (
  nodeUrl: string,
  checkpointId: string,
  txHash: string
): Promise<void> => {
  await nodeClient.post(
    `${nodeUrl}/reports/checkpoints/${checkpointId}/confirm`,
    { tx_hash: txHash }
  );
};

export const updateNodeCheckpointStatus = async (
  nodeUrl: string,
  checkpointId: string,
  newStatus: string
): Promise<void> => {
  await nodeClient.patch(
    `${nodeUrl}/reports/checkpoints/${checkpointId}/status`,
    { status: newStatus }
  );
};
