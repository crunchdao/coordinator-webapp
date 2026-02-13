import apiClient from "@coordinator/utils/src/api";
import { NodeCheckpoint } from "../domain/nodeTypes";

/**
 * Fetch checkpoints from the coordinator node's report API.
 */
export const getNodeCheckpoints = async (
  crunchName: string,
  status?: string
): Promise<NodeCheckpoint[]> => {
  const params: Record<string, string> = {};
  if (status) params.status = status;

  const response = await apiClient.get(
    `/crunches/${crunchName}/reports/checkpoints`,
    { params }
  );
  return response.data;
};

/**
 * Create a manual checkpoint on the node (saves as PENDING).
 */
export const createNodeCheckpoint = async (
  crunchName: string,
  prizes: { model: string; prize: number }[]
): Promise<NodeCheckpoint> => {
  const response = await apiClient.post(
    `/crunches/${crunchName}/reports/checkpoints`,
    { prizes }
  );
  return response.data;
};

/**
 * Confirm a checkpoint was submitted on-chain (sends tx_hash back to node).
 */
export const confirmNodeCheckpoint = async (
  crunchName: string,
  checkpointId: string,
  txHash: string
): Promise<void> => {
  await apiClient.post(
    `/crunches/${crunchName}/reports/checkpoints/${checkpointId}/confirm`,
    { tx_hash: txHash }
  );
};
