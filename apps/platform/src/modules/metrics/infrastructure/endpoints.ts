export const endpoints = {
  localMetricsWidgets: (slug: string) =>
    `/config/crunches/${slug}/metrics/widgets.json`,
};

export const hubEndpoints = {
  chartDefinitions: (competitionIdentifier: string) =>
    `/v1/competitions/${competitionIdentifier}/chart-definitions`,
  chartDefinition: (
    competitionIdentifier: string,
    chartDefinitionName: string
  ) =>
    `/v1/competitions/${competitionIdentifier}/chart-definitions/${chartDefinitionName}`,
};
