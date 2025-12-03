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
import { formatValue } from "../utils/formatter";

export const useLeaderboardTable = () => {
  const { data: leaderboardColumns } = useQuery({
    queryKey: ["leaderboardColumns"],
    queryFn: getLeaderboardColumns,
  });

  return useMemo<ColumnDef<LeaderboardPosition>[]>(() => {
    if (!leaderboardColumns) return [];

    return leaderboardColumns
      .filter((col) => col.type !== "STATUS")
      .map((column) => {
        if (column.type === "PROJECT") {
          return {
            accessorKey: column.property,
            header: "Project",
            cell: ({ row }) => {
              const modelId = row.getValue(column.property) as string;
              const status = row.original.status as string;
              const modelActive = status === "active";

              return (
                <span>
                  <PulseRing
                    active={modelActive}
                    className={!modelActive ? "invisible" : undefined}
                  />
                  {modelId}
                </span>
              );
            },
          };
        }

        return {
          accessorKey: column.property,
          header: column.tooltip
            ? () => (
                <div>
                  {column.display_name}&nbsp;
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                    </TooltipTrigger>
                    <TooltipContent>{column.tooltip}</TooltipContent>
                  </Tooltip>
                </div>
              )
            : column.display_name || "",
          meta: {
            className: column.type === "CHART" ? "text-left" : "text-right",
          },
          cell: ({ getValue }) => {
            const value = getValue();

            if (
              column.type === "CHART" &&
              column.native_configuration?.type === "gauge"
            ) {
              return (
                <Gauge
                  config={column.native_configuration}
                  data={value as Record<string, number>}
                />
              );
            }

            return formatValue(value, column.format);
          },
        };
      });
  }, [leaderboardColumns]);
};
