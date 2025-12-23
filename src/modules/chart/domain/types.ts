import { FormatType } from "@/utils/number-formatter";

export type FilterConfig = {
  property: string;
  label: string;
  type: "select";
  autoSelectFirst?: boolean;
};

export type YAxisSeries = {
  name: string;
  label?: string;
  color?: string;
};

export type LineChartConfiguration = {
  type: "line";
  xAxis: { name: string };
  yAxis: {
    series: YAxisSeries[];
    format?: FormatType;
  };
  displayEvolution: boolean;
  displayLegend?: boolean;
  tooltip?: string;
  groupByProperty?: string;
  alertConfig?: {
    field: string;
    reasonField: string;
  };
  filterConfig?: FilterConfig[];
};

export type GaugeConfiguration = {
  type: "gauge";
  percentage?: boolean;
  seriesConfig?: GaugeSeriesConfig[];
  filterConfig?: FilterConfig[];
};

export type GaugeSeriesConfig = {
  name?: string;
  color?: string;
  label?: string;
};
