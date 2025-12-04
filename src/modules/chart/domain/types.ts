export type FilterConfig = {
  property: string;
  label: string;
  type: "select";
  autoSelectFirst?: boolean;
};

export type LineChartConfiguration = {
  xAxis: { name: string };
  yAxis:
    | { name: string; format?: string }
    | { names: string[]; format?: string };
  displayEvolution: boolean;
  displayLegend?: boolean;
  tooltip?: string;
  groupByProperty?: string;
  alertConfig?: {
    field: string;
    reasonField: string;
  };
  filterConfig?: FilterConfig[];
  seriesConfig?: Record<
    string,
    {
      color?: string;
      label?: string;
    }
  >;
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
