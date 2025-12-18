export const endpoints = {
  getModels: () => "/models",
  addModel: () => "/models",
  updateModel: (modelId: string) => `/models/${modelId}`,
  deleteModel: (modelId: number) => `/models/${modelId}`,
};
