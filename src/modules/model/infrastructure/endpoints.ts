import { JobLogType } from "../domain/types";

export const endpoints = {
  getModels: () => "/models",
  addModel: () => "/models",
  updateModel: (modelId: string) => `/models/${modelId}`,
  deleteModel: (modelId: number) => `/models/${modelId}`,
  getJobLogsByType: (type: JobLogType, jobId: string) =>
    `/models/logs/${type}/${jobId}`,
};
