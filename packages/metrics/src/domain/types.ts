import type {
  GaugeConfiguration,
  LineChartConfiguration,
} from "@crunchdao/chart";

export type MetricType = "CHART" | "IFRAME";

export type BaseDefinition = {
  id: number;
  type: MetricType;
  displayName: string;
  tooltip?: string | null;
  order: number;
  endpointUrl: string;
};

export type LineChartDefinition = BaseDefinition & {
  nativeConfiguration: LineChartConfiguration;
};

export type GaugeDefinition = BaseDefinition & {
  nativeConfiguration: GaugeConfiguration;
};

export type IframeChartDefinition = BaseDefinition;

export type Widget =
  | LineChartDefinition
  | GaugeDefinition
  | IframeChartDefinition;

export interface GetMetricDataParams {
  modelIds: string[];
  start: string;
  end: string;
}
