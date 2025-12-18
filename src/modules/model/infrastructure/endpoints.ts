export const endpoints = {
  getModels: () => "/models",
  addModel: () => "/models",
  updateModel: (modelId: number) => `/models/${modelId}`,
  deleteModel: (modelId: number) => `/models/${modelId}`,
};
