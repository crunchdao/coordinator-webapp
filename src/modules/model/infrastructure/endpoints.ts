export const endpoints = {
  getModels: () => "/models",
  addModel: () => "/models",
  updateModel: (modelId: string) => `/models/${modelId}`,
  deleteModel: (modelId: string) => `/models/${modelId}`,
};
