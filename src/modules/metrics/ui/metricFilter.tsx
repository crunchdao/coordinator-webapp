import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";
import { FilterConfig } from "@/modules/chart/domain/types";

interface MetricFiltersProps {
  filters: FilterConfig[];
  data: Array<Record<string, unknown>>;
  onFilterChange: (property: string, value: string | string[]) => void;
  selectedFilters: Record<string, string | string[]>;
}

export const MetricFilters: React.FC<MetricFiltersProps> = ({
  filters,
  data,
  onFilterChange,
  selectedFilters,
}) => {
  const getUniqueValues = (property: string) => {
    const values = new Set<string>();
    data.forEach((row) => {
      const value = row[property];
      if (value !== null && value !== undefined) {
        values.add(String(value));
      }
    });
    return Array.from(values).sort();
  };

  return (
    <div className="flex gap-3">
      {filters.map((filter) => {
        const uniqueValues = getUniqueValues(filter.property);

        if (filter.type === "select") {
          return (
            <div key={filter.property} className="flex flex-col gap-1">
              <label className="text-sm text-muted-foreground">
                {filter.label}
              </label>
              <Select
                value={(selectedFilters[filter.property] as string) || "all"}
                onValueChange={(value) =>
                  onFilterChange(filter.property, value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueValues.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
