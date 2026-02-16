"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Button } from "@crunch-ui/core";
import { RANDOM_COLORS } from "@crunchdao/chart";
import { formatNumber } from "@crunchdao/chart";
import { BarChartConfiguration } from "../domain/types";

type MetricItem = Record<string, string | number | null | boolean | undefined>;

interface BarChartProps {
  data: MetricItem[];
  config: BarChartConfiguration;
  projectIdProperty: string;
  getLabel?: (id: string | number) => string;
  selectedFilters?: Record<string, string | string[]>;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  config,
  projectIdProperty,
  getLabel = (id) => String(id),
  selectedFilters = {},
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!chartRef.current || !data.length) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const computedStyle = getComputedStyle(document.documentElement);
    const gridColor = computedStyle.getPropertyValue("--background").trim();
    const ticksColor = computedStyle
      .getPropertyValue("--muted-foreground")
      .trim();

    // Apply filters
    const filteredData = data.filter((row) => {
      if (!config.filterConfig?.length) return true;
      return Object.entries(selectedFilters).every(([property, filterValue]) => {
        if (!filterValue || filterValue === "") return true;
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(row[property]));
        }
        return String(row[property]) === filterValue;
      });
    });

    // Group by project/model if groupByProperty is set
    const groupByProperty = config.groupByProperty;
    let categories: string[];
    let datasets: {
      label: string;
      data: (number | null)[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];

    if (groupByProperty) {
      // Grouped bar: categories are unique group values, bars are per value property
      const groups = new Map<string, MetricItem[]>();
      filteredData.forEach((row) => {
        const key = String(row[groupByProperty] || "Unknown");
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(row);
      });

      categories = Array.from(groups.keys()).sort();

      datasets = config.valueProperties.map((vp, i) => {
        const color = vp.color || RANDOM_COLORS[i % RANDOM_COLORS.length];
        return {
          label: vp.label || vp.name,
          data: categories.map((cat) => {
            const rows = groups.get(cat) || [];
            // Average the values for this category
            const values = rows
              .map((r) => (typeof r[vp.name] === "number" ? (r[vp.name] as number) : null))
              .filter((v): v is number => v !== null);
            return values.length > 0
              ? values.reduce((s, v) => s + v, 0) / values.length
              : null;
          }),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
        };
      });

      // Resolve labels if groupByProperty is the project id
      if (groupByProperty === projectIdProperty) {
        categories = categories.map((c) => getLabel(c));
      }
    } else {
      // Simple bar: one bar per row, category is the categoryProperty
      categories = filteredData.map((row) => {
        const raw = String(row[config.categoryProperty] || "Unknown");
        return config.categoryProperty === projectIdProperty
          ? getLabel(raw)
          : raw;
      });

      datasets = config.valueProperties.map((vp, i) => {
        const color = vp.color || RANDOM_COLORS[i % RANDOM_COLORS.length];
        return {
          label: vp.label || vp.name,
          data: filteredData.map((row) =>
            typeof row[vp.name] === "number" ? (row[vp.name] as number) : null
          ),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
        };
      });
    }

    import("chartjs-plugin-zoom").then((module) => {
      Chart.register(module.default);
    });

    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: categories,
        datasets,
      },
      options: {
        indexAxis: config.horizontal ? "y" : "x",
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: datasets.length > 1,
            labels: {
              usePointStyle: true,
              boxWidth: 20,
              boxHeight: 2,
              color: `hsl(${ticksColor})`,
            },
          },
          tooltip: {
            boxWidth: 20,
            boxHeight: 1,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || "";
                const value = context.parsed[config.horizontal ? "x" : "y"];
                const formatted = formatNumber(value, config.format);
                return `${label}: ${formatted}`;
              },
            },
          },
          zoom: {
            zoom: {
              wheel: { enabled: false },
              pinch: { enabled: true },
              mode: "x",
              drag: {
                enabled: true,
                backgroundColor: "rgba(235,105,36,0.25)",
              },
              onZoomComplete: () => setIsZoomed(true),
            },
            pan: {
              enabled: true,
              mode: "x",
              modifierKey: "ctrl" as const,
            },
          },
        },
        scales: {
          x: {
            stacked: config.stacked,
            grid: {
              color: `hsl(${gridColor})`,
              lineWidth: 1,
            },
            ticks: {
              color: `hsl(${ticksColor})`,
              maxRotation: 45,
              autoSkip: true,
              ...(config.horizontal && config.format
                ? {
                    callback: (value: string | number) =>
                      formatNumber(value, config.format),
                  }
                : {}),
            },
          },
          y: {
            stacked: config.stacked,
            grid: {
              color: `hsl(${gridColor})`,
              lineWidth: 1,
            },
            ticks: {
              color: `hsl(${ticksColor})`,
              ...(!config.horizontal && config.format
                ? {
                    callback: (value: string | number) =>
                      formatNumber(value, config.format),
                  }
                : {}),
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
  }, [data, config, projectIdProperty, getLabel, selectedFilters]);

  const handleResetZoom = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resetZoom();
      setIsZoomed(false);
    }
  };

  if (!data || data.length === 0) {
    return (
      <p className="body text-center text-muted-foreground">
        {config.noDataMessage || "No data available"}
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
