export const endpoints = {
  getReportModelsGlobal: () => "/api/reports/models/global",
  getReportModelsParams: () => "/api/reports/models/params",
  getReportPredictions: () => "/api/reports/models/predictions",
  getMetricsWidgets: () => "/api/metrics/widgets",
  createMetricsWidget: () => "/api/metrics/widgets",
  getMetricsWidget: (id: number) => `/api/metrics/widgets/${id}`,
  updateMetricsWidget: (id: number) => `/api/metrics/widgets/${id}`,
  deleteMetricsWidget: (id: number) => `/api/metrics/widgets/${id}`,
  resetMetricsWidgets: () => "/api/metrics/widgets/reset",
};
