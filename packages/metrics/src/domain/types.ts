import type {
  GaugeConfiguration,
  LineChartConfiguration,
  FilterConfig,
  FormatType,
} from "@crunchdao/chart";

export type MetricType = "CHART" | "IFRAME";

export type BarChartConfiguration = {
  type: "bar";
  categoryProperty: string;
  valueProperties: { name: string; label?: string; color?: string }[];
  format?: FormatType | string;
  stacked?: boolean;
  horizontal?: boolean;
  groupByProperty?: string;
  filterConfig?: FilterConfig[];
  noDataMessage?: string;
};

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

export type BarChartDefinition = BaseDefinition & {
  nativeConfiguration: BarChartConfiguration;
};

export type IframeChartDefinition = BaseDefinition;

export type Widget =
  | LineChartDefinition
  | GaugeDefinition
  | BarChartDefinition
  | IframeChartDefinition;

export interface GetMetricDataParams {
  modelIds: string[];
  start: string;
  end: string;
  includeEnsembles?: boolean;
}
