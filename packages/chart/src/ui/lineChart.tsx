"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { Button } from "@crunch-ui/core";
import { RANDOM_COLORS } from "../application/utils";
import { formatNumber } from "@coordinator/utils/src/number-formatter";
import {
  LineChartDefinition,
  MetricItem,
} from "@coordinator/metrics/src/domain/types";

interface LineChartProps {
  data: MetricItem[];
  definition: LineChartDefinition;
  projectIdProperty: string;
  getLabel?: (id: string | number) => string;
  selectedFilters?: Record<string, string | string[]>;
}

interface DatasetWithOriginalLabel {
  originalLabel?: string;
  label?: string;
  alertReason?: boolean;
}

interface AlertPoint {
  x: number;
  y: number | null;
  reason: string;
}

function calculateEvolution(dataPoints: MetricItem[]): string | null {
  if (dataPoints.length === 0) return null;

  const firstNonNull = dataPoints.find((point) => point.y !== null);
  const lastNonNull = [...dataPoints]
    .reverse()
    .find((point) => point.y !== null);

  if (
    !firstNonNull ||
    !lastNonNull ||
    firstNonNull.y === null ||
    lastNonNull.y === null ||
    firstNonNull.y === 0
  ) {
    return null;
  }

  const firstY = Number(firstNonNull.y);
  const lastY = Number(lastNonNull.y);

  if (isNaN(firstY) || isNaN(lastY)) {
    return null;
  }

  const evolution = ((lastY - firstY) / firstY) * 100;
  const evolutionSign = evolution > 0 ? "+" : "";
  return `${evolutionSign}${evolution.toFixed(1)}%`;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  definition,
  projectIdProperty,
  getLabel = (id) => String(id),
  selectedFilters = {},
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const shouldShowRow = useCallback(
    (row: MetricItem) => {
      if (!definition.nativeConfiguration.filterConfig?.length) {
        return true;
      }

      return Object.entries(selectedFilters).every(
        ([property, filterValue]) => {
          if (!filterValue || filterValue === "") return true;

          if (Array.isArray(filterValue)) {
            return filterValue.includes(String(row[property]));
          }

          return String(row[property]) === filterValue;
        }
      );
    },
    [selectedFilters, definition.nativeConfiguration.filterConfig]
  );

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        import("chartjs-plugin-zoom").then((module) => {
          Chart.register(module.default);
        });
        const computedStyle = getComputedStyle(document.documentElement);
        const gridColor = computedStyle.getPropertyValue("--background").trim();
        const ticksColor = computedStyle
          .getPropertyValue("--muted-foreground")
          .trim();

        const groupByProperty = definition.nativeConfiguration.groupByProperty;

        const groupedData = data.reduce((acc, row) => {
          const projectKey = String(row[projectIdProperty] || "Unknown");
          const groupKey = groupByProperty
            ? String(row[groupByProperty] || "Unknown")
            : "";
          const key = groupByProperty
            ? `${projectKey}::${groupKey}`
            : projectKey;

          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(row);
          return acc;
        }, {} as Record<string, MetricItem[]>);

        const yAxisConfig = definition.nativeConfiguration.yAxis;
        const ySeries = yAxisConfig.series;

        const datasets = Object.entries(groupedData)
          .flatMap(([key, rows], groupIndex) => {
            return ySeries.map((series, seriesIndex) => {
              const dataPoints = rows
                .filter((row) => row[definition.nativeConfiguration.xAxis.name])
                .map((row) => {
                  const value = row[series.name];
                  const xValue =
                    row[definition.nativeConfiguration.xAxis.name]!;
                  return {
                    x: new Date(xValue + "Z").getTime(),
                    y: typeof value === "number" ? value : null,
                  };
                })
                .sort((a, b) => a.x - b.x);

              const colorIndex =
                ySeries.length > 1
                  ? groupIndex * ySeries.length + seriesIndex
                  : groupIndex;
              const color =
                series.color ||
                RANDOM_COLORS[colorIndex % RANDOM_COLORS.length];

              let projectLabel;
              if (groupByProperty && key.includes("::")) {
                const [projectId, groupValue] = key.split("::");
                const projectName = getLabel(projectId);
                projectLabel = `${projectName} - ${groupValue}`;
              } else {
                projectLabel = getLabel(key);
              }

              const metricLabel = series.label || series.name;

              const baseLabel =
                ySeries.length > 1
                  ? `${projectLabel} - ${metricLabel}`
                  : projectLabel;

              const hasData =
                dataPoints.length > 0 &&
                dataPoints.some((point) => point.y !== null);

              const isFilteredOut =
                definition.nativeConfiguration?.filterConfig &&
                definition.nativeConfiguration?.filterConfig?.length > 0 &&
                !rows.some((row) => shouldShowRow(row));

              if (isFilteredOut) {
                return null;
              }

              let evolutionLabel = baseLabel;
              if (!hasData) {
                evolutionLabel = `${baseLabel} (no data)`;
              } else if (definition.nativeConfiguration.displayEvolution) {
                const evolutionPercent = calculateEvolution(dataPoints);
                if (evolutionPercent) {
                  evolutionLabel = `${baseLabel} (${evolutionPercent})`;
                }
              }

              return {
                label: evolutionLabel,
                data: dataPoints,
                borderColor: color,
                borderWidth: 1.2,
                spanGaps: false,
                originalLabel: baseLabel,
                hidden: !hasData,

                pointStyle: "circle",
                pointRadius: 1.5,
                pointHoverRadius: 3,
                pointBackgroundColor: color,
                pointBorderWidth: 0,
                pointHoverBorderWidth: 1,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: "#fff",
                showLine: true,
                pointHitRadius: 4,
              };
            });
          })
          .filter(Boolean);

        const alertConfig = definition.nativeConfiguration.alertConfig;
        const alertDatasets: typeof datasets = [];

        if (alertConfig) {
          const alertPoints: Record<string, AlertPoint[]> = {};

          Object.entries(groupedData).forEach(([key, rows]) => {
            // Check if this group is filtered out
            const isFilteredOut =
              definition.nativeConfiguration?.filterConfig &&
              definition.nativeConfiguration?.filterConfig?.length > 0 &&
              !rows.some((row) => shouldShowRow(row));

            if (isFilteredOut) return;

            ySeries.forEach((series) => {
              const seriesKey = `${key}_${series.name}`;
              alertPoints[seriesKey] = [];

              rows.forEach((row) => {
                const fieldValue = row[alertConfig.field];
                if (fieldValue === true && row[alertConfig.reasonField]) {
                  const x = row[definition.nativeConfiguration.xAxis.name];
                  const y = row[series.name];
                  if (x) {
                    alertPoints[seriesKey].push({
                      x: new Date(x + "Z").getTime(),
                      y: typeof y === "number" ? y : null,
                      reason: String(row[alertConfig.reasonField]),
                    });
                  }
                }
              });

              if (alertPoints[seriesKey].length > 0) {
                alertDatasets.push({
                  label: `Alerts`,
                  data: alertPoints[seriesKey],
                  borderColor: "#f97316",
                  borderWidth: 1.2,
                  spanGaps: false,
                  originalLabel: `Alerts`,
                  pointRadius: 8,
                  pointHoverRadius: 10,
                  pointBackgroundColor: "#f97316",
                  pointBorderWidth: 0,
                  pointStyle: "triangle",
                  pointHoverBorderWidth: 0,
                  pointHoverBackgroundColor: "#f97316",
                  pointHoverBorderColor: "",
                  showLine: false,
                  hidden: false,
                  pointHitRadius: 4,
                });
              }
            });
          });
        }

        const allDatasets = [...datasets, ...alertDatasets].filter(
          (dataset) => dataset !== null
        );

        const allTimestamps = allDatasets.flatMap((dataset) =>
          dataset.data.filter((point) => point !== null).map((point) => point.x)
        );
        const minTimestamp = Math.min(...allTimestamps);
        const maxTimestamp = Math.max(...allTimestamps);

        chartInstanceRef.current = new Chart(ctx, {
          type: "line",
          data: {
            datasets: allDatasets,
          },
          options: {
            interaction: {
              mode: "x",
              intersect: false,
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                boxWidth: 20,
                boxHeight: 1,
                callbacks: {
                  label: function (context) {
                    const dataset = context.dataset as DatasetWithOriginalLabel;
                    if (
                      context.raw &&
                      typeof context.raw === "object" &&
                      "reason" in context.raw
                    ) {
                      return `${context.raw.reason}`;
                    }

                    const label =
                      dataset.originalLabel || context.dataset.label || "";
                    const value = context.parsed.y;
                    const formattedValue = formatNumber(
                      value,
                      yAxisConfig.format
                    );
                    return `${label}: ${formattedValue}`;
                  },
                },
              },
              legend: {
                display: definition.nativeConfiguration.displayLegend !== false,
                labels: {
                  usePointStyle: true,
                  boxWidth: 20,
                  boxHeight: 2,
                  color: `hsl(${ticksColor})`,
                  filter: function (item) {
                    return !item.text.includes("Alerts");
                  },
                },
              },
              title: {
                display: false,
              },
              zoom: {
                zoom: {
                  wheel: {
                    enabled: false,
                  },
                  pinch: {
                    enabled: true,
                  },
                  mode: "x",
                  drag: {
                    enabled: true,
                    backgroundColor: "rgba(235,105,36,0.25)",
                  },
                  onZoomComplete: () => {
                    setIsZoomed(true);
                  },
                },
                pan: {
                  enabled: true,
                  mode: "x",
                  modifierKey: "ctrl",
                },
                limits: {
                  x: {
                    min: minTimestamp,
                    max: maxTimestamp,
                    minRange: 60 * 1000,
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  color: `hsl(${gridColor})`,
                  lineWidth: 1,
                },
                type: "time",
                time: {
                  unit: undefined,
                  displayFormats: {
                    millisecond: "HH:mm:ss.SSS",
                    second: "HH:mm:ss",
                    minute: "HH:mm",
                    hour: "dd MMM - HH:mm",
                    day: "dd MMM",
                    week: "dd MMM",
                    month: "MMM yyyy",
                    quarter: "MMM yyyy",
                    year: "yyyy",
                  },
                  tooltipFormat: "PPpp",
                },
                ticks: {
                  autoSkip: true,
                  autoSkipPadding: 50,
                  maxRotation: 0,
                  color: `hsl(${ticksColor})`,
                },
                title: {
                  display: false,
                },
              },
              y: {
                type: "linear",
                ticks: {
                  color: `hsl(${ticksColor})`,
                  callback: function (value) {
                    return formatNumber(value, yAxisConfig.format);
                  },
                },
                grid: {
                  color: `hsl(${gridColor})`,
                  lineWidth: 1,
                },
                title: {
                  display: false,
                },
              },
            },
          },
        });
        return () => {
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
          }
        };
      }
    }
  }, [
    data,
    projectIdProperty,
    getLabel,
    definition.nativeConfiguration,
    selectedFilters,
    shouldShowRow,
  ]);

  const handleResetZoom = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resetZoom();
      setIsZoomed(false);
    }
  };

  if (!data || data.length === 0) {
    return (
      <p className="body text-center text-muted-foreground">
        No data available
      </p>
    );
  }

  return (
    <div>
      {isZoomed && (
        <div className="flex justify-end mb-2">
          <Button onClick={handleResetZoom} variant="secondary" size="sm">
            Reset zoom
          </Button>
        </div>
      )}
      <div style={{ height: "400px", position: "relative" }}>
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};
