import apiClient from "@coordinator/utils/src/api";
import { NodeHealth, NodeInfo } from "../domain/types";

export const getNodeHealth = async (): Promise<NodeHealth> => {
  try {
    const response = await apiClient.get("/healthz");
    return response.data;
  } catch {
    // Older nodes may not have /healthz — try /reports/models as connectivity check
    const response = await apiClient.get("/reports/models");
    if (response.status === 200) {
      return { status: "ok" };
    }
    throw new Error("Node unreachable");
  }
};

export const getNodeInfo = async (): Promise<NodeInfo> => {
  const response = await apiClient.get("/info");
  return response.data;
};

export const getNodeModelCount = async (): Promise<number> => {
  const response = await apiClient.get("/reports/models");
  return Array.isArray(response.data) ? response.data.length : 0;
};

export const getNodeFeedCount = async (): Promise<number> => {
  const response = await apiClient.get("/reports/feeds");
  return Array.isArray(response.data) ? response.data.length : 0;
};

export const getNodeCheckpointCount = async (): Promise<number> => {
  const response = await apiClient.get("/reports/checkpoints");
  return Array.isArray(response.data) ? response.data.length : 0;
};
