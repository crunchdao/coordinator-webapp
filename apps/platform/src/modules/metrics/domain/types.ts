import type {
  LineChartConfiguration,
  GaugeConfiguration,
  MatrixConfiguration,
} from "@crunchdao/chart";

export type HubChartDefinition = {
  id: number;
  name: string;
  displayName: string;
  type: "CHART" | "IFRAME";
  endpointUrl: string;
  dataKey: string;
  projectIdProperty: string;
  nativeConfiguration: LineChartConfiguration | GaugeConfiguration | MatrixConfiguration | null;
  order: number;
};

export type CreateChartDefinitionPayload = {
  name: string;
  displayName: string;
  type: "CHART" | "IFRAME";
  endpointUrl: string;
  projectIdProperty: string;
  nativeConfiguration: LineChartConfiguration | GaugeConfiguration | MatrixConfiguration | null;
  order: number;
};

export type UpdateChartDefinitionPayload = Partial<CreateChartDefinitionPayload>;

export interface MetricsModelItem {
  model_id: string | number;
  model_name: string;
  cruncher_name: string;
}
