import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@crunch-ui/core";
import { cn } from "@crunch-ui/utils";
import { GaugeConfiguration } from "../domain/types";
import { MetricItem } from "@coordinator/metrics/src/domain/types";

const colorClassMap: Record<string, string> = {
  orange: "bg-orange-700",
  yellow: "bg-yellow-700",
  green: "bg-green-400",
  red: "bg-red-700",
};

function getColorClass(color: string): string {
  return colorClassMap[color] || "bg-gray-700";
}

interface GaugeProps {
  config: GaugeConfiguration;
  data: Record<string, number> | MetricItem[];
  selectedFilters?: Record<string, string | string[]>;
}

export const Gauge: React.FC<GaugeProps> = ({ config, data, selectedFilters = {} }) => {
  if (!config.seriesConfig || !data) return null;

  let processedData: Record<string, number>;
  
  if (Array.isArray(data)) {
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
    
    processedData = {};
    config.seriesConfig.forEach((serie) => {
      if (serie.name) {
        processedData[serie.name] = filteredData.reduce((sum, row) => {
          const value = row[serie.name!];
          return sum + (typeof value === 'number' ? value : 0);
        }, 0);
      }
    });
  } else {
    processedData = data;
  }

  const values = Object.values(processedData);
  const total = values.reduce((sum, value) => sum + value, 0);

  if (values.every((v) => v === 0)) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-32 rounded-xs overflow-hidden cursor-pointer">
          <div className="w-full h-2 flex gap-px">
            {config.seriesConfig.map((serie) => {
              if (!serie.name) return null;
              const value = processedData[serie.name] || 0;
              let width = total > 0 ? (value / total) * 100 : 0;
              if (width > 0 && width < 1) {
                width = 0.5;
              }
              return (
                <div
                  key={serie.name}
                  style={{
                    width: `${width}%`,
                  }}
                  className={cn(
                    "h-full",
                    getColorClass(serie.color || "gray"),
                    width <= 0 && "hidden"
                  )}
                />
              );
            })}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <table className="body-xs text-left">
          <tbody>
            {config.seriesConfig.map((serie) => {
              if (!serie.name) return null;
              const value = processedData[serie.name] || 0;
              const percentage = total > 0 ? (value / total) * 100 : 0;
              const percentageDisplay =
                percentage === 0
                  ? "0%"
                  : percentage > 0 && percentage < 0.1
                  ? ">0.1%"
                  : `${percentage.toFixed(1)}%`;
              return (
                <tr key={serie.name}>
                  <td className="pr-2">
                    <span
                      className={cn(
                        "inline-block w-0.5 h-1.5 rounded-sm",
                        getColorClass(serie.color || "gray")
                      )}
                    />
                  </td>
                  <td className="pr-3">{serie.label}</td>
                  <td className="text-right pr-2">{value.toLocaleString()}</td>
                  <td className="text-right">({percentageDisplay})</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TooltipContent>
    </Tooltip>
  );
};
