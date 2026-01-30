export const endpoints = {
  getMetricsWidgets: () => "/metrics/widgets",
  updateMetricsWidget: (id: number) => `/metrics/widgets/${id}`,
  deleteMetricsWidget: (id: number) => `/metrics/widgets/${id}`,
  resetMetricsWidgets: () => "/metrics/widgets/reset",
};
