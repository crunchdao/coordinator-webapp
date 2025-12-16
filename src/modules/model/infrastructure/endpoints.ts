export const endpoints = {
  getModels: () => "/api/models",
  addModel: () => "/api/models",
  deleteModel: (modelId: number) => `/api/models/${modelId}`,
};
