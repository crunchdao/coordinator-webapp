import nodeClient from "@/modules/node/infrastructure/nodeClient";
import {
  BackfillFeed,
  BackfillJob,
  BackfillFile,
  StartBackfillRequest,
} from "../domain/types";

export const getBackfillFeeds = async (
  nodeUrl: string
): Promise<BackfillFeed[]> => {
  const response = await nodeClient.get(
    `${nodeUrl}/reports/backfill/feeds`
  );
  return response.data;
};

export const startBackfill = async (
  nodeUrl: string,
  body: StartBackfillRequest
): Promise<BackfillJob> => {
  const response = await nodeClient.post(
    `${nodeUrl}/reports/backfill`,
    body
  );
  return response.data;
};

export const getBackfillJobs = async (
  nodeUrl: string,
  status?: string
): Promise<BackfillJob[]> => {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  const response = await nodeClient.get(
    `${nodeUrl}/reports/backfill/jobs`,
    { params }
  );
  return response.data;
};

export const getBackfillIndex = async (
  nodeUrl: string
): Promise<BackfillFile[]> => {
  const response = await nodeClient.get(
    `${nodeUrl}/data/backfill/index`
  );
  return response.data;
};
