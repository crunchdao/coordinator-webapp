import { proxyPost, proxyPatch } from "@/utils/api/proxyApiClient";

/**
 * Confirm a checkpoint was submitted on-chain (sends tx_hash back to node).
 * Transitions: PENDING → SUBMITTED
 */
export const confirmNodeCheckpoint = async (
  coordinatorNodeUrl: string,
  checkpointId: string,
  txHash: string
): Promise<void> => {
  await proxyPost(
    `${coordinatorNodeUrl}/reports/checkpoints/${checkpointId}/confirm`,
    { tx_hash: txHash }
  );
};

/**
 * Update checkpoint status on the node.
 * Transitions: SUBMITTED → CLAIMABLE, CLAIMABLE → PAID
 */
export const updateNodeCheckpointStatus = async (
  coordinatorNodeUrl: string,
  checkpointId: string,
  newStatus: string
): Promise<void> => {
  await proxyPatch(
    `${coordinatorNodeUrl}/reports/checkpoints/${checkpointId}/status`,
    { status: newStatus }
  );
};
