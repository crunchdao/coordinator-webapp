export const endpoints = {
  getReportModelsGlobal: () => "/reports/models/global",
  getReportModelsParams: () => "/reports/models/params",
  getReportPredictions: () => "/reports/models/predictions",
  getMetricsWidgets: () => "/api/metrics/widgets",
  createMetricsWidget: () => "/api/metrics/widgets",
  getMetricsWidget: (id: number) => `/api/metrics/widgets/${id}`,
  updateMetricsWidget: (id: number) => `/api/metrics/widgets/${id}`,
  deleteMetricsWidget: (id: number) => `/api/metrics/widgets/${id}`,
  resetMetricsWidgets: () => "/api/metrics/widgets/reset",
};
