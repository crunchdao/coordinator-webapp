import type {
  LineChartConfiguration,
  GaugeConfiguration,
} from "@crunchdao/chart";

export type HubChartDefinition = {
  id: number;
  name: string;
  displayName: string;
  type: "CHART" | "IFRAME";
  endpointUrl: string;
  dataKey: string;
  projectIdProperty: string;
  nativeConfiguration: LineChartConfiguration | GaugeConfiguration | null;
  order: number;
};

export type CreateChartDefinitionPayload = {
  name: string;
  displayName: string;
  type: "CHART" | "IFRAME";
  endpointUrl: string;
  projectIdProperty: string;
  nativeConfiguration: LineChartConfiguration | GaugeConfiguration | null;
  order: number;
};

export type UpdateChartDefinitionPayload = Partial<CreateChartDefinitionPayload>;
