import type {
  GaugeConfiguration,
  LineChartConfiguration,
  MatrixConfiguration,
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

export type MatrixDefinition = BaseDefinition & {
  nativeConfiguration: MatrixConfiguration;
};

export type IframeChartDefinition = BaseDefinition;

export type Widget =
  | LineChartDefinition
  | GaugeDefinition
  | MatrixDefinition
  | IframeChartDefinition;

export type LocalMetricsConfig = {
  widgets: Widget[];
};

export interface GetMetricDataParams {
  modelIds: string[];
  windowDays: number;
}
