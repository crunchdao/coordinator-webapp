"use client";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  PulseRing,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { InfoCircle } from "@crunch-ui/icons";
import { useQuery } from "@tanstack/react-query";
import { Gauge } from "@/modules/chart/ui/gauge";
import { LeaderboardPosition } from "../../domain/types";
import { getLeaderboardColumns } from "../../infrastructure/services";
import { formatNumber } from "@/utils/numberFormatter";

export const useLeaderboardTable = () => {
  const { data: leaderboardColumns } = useQuery({
    queryKey: ["leaderboardColumns"],
    queryFn: getLeaderboardColumns,
  });

  return useMemo<ColumnDef<LeaderboardPosition>[]>(() => {
    if (!leaderboardColumns) return [];

    return leaderboardColumns.map((column) => {
      if (column.type === "MODEL") {
        return {
          id: `column_${column.id}`,
          accessorKey: column.property,
          header: column.displayName || "Model",
          cell: ({ row }) => {
            const modelName = row.original[column.property] as string;
            const statusProperty =
              column.nativeConfiguration?.type === "model"
                ? column.nativeConfiguration.statusProperty
                : undefined;

            if (statusProperty) {
              const status = row.original[statusProperty] as string | boolean;
              const isActive =
                typeof status === "boolean" ? status : status === "active";

              return (
                <span className="flex items-center gap-2">
                  <PulseRing
                    active={isActive}
                    className={!isActive ? "invisible" : undefined}
                  />
                  {modelName}
                </span>
              );
            }

            return <span>{modelName}</span>;
          },
        };
      }

      if (column.type === "USERNAME") {
        return {
          id: `column_${column.id}`,
          accessorKey: column.property,
          header: column.tooltip
            ? () => (
                <div>
                  {column.displayName}&nbsp;
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                    </TooltipTrigger>
                    <TooltipContent>{column.tooltip}</TooltipContent>
                  </Tooltip>
                </div>
              )
            : column.displayName || "",
          cell: ({ row }) => {
            const username = row.original[column.property] as string;
            return <span>{username || ""}</span>;
          },
        };
      }

      return {
        id: `column_${column.id}`,
        accessorKey: column.property,
        header: column.tooltip
          ? () => (
              <div>
                {column.displayName}&nbsp;
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                  </TooltipTrigger>
                  <TooltipContent>{column.tooltip}</TooltipContent>
                </Tooltip>
              </div>
            )
          : column.displayName || "",
        meta: {
          className: column.type === "CHART" ? "text-left" : "text-right",
        },
        cell: ({ row }) => {
          const value = row.original[column.property];

          if (
            column.type === "CHART" &&
            column.nativeConfiguration?.type === "gauge"
          ) {
            return (
              <Gauge
                config={column.nativeConfiguration}
                data={value as Record<string, number>}
              />
            );
          }

          return formatNumber(value, column.format);
        },
      };
    });
  }, [leaderboardColumns]);
};
