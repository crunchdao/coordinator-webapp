export const endpoints = {
  getModels: () => "/api/models",
  addModel: () => "/api/models",
  updateModel: (modelId: number) => `/api/models/${modelId}`,
  deleteModel: (modelId: number) => `/api/models/${modelId}`,
};
