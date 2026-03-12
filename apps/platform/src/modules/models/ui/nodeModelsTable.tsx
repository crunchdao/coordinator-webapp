"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@crunch-ui/core";
import type { MetricsModelItem } from "@/modules/metrics/domain/types";

const columns: ColumnDef<MetricsModelItem>[] = [
  {
    accessorKey: "model_id",
    header: "Model ID",
  },
  {
    accessorKey: "model_name",
    header: "Model Name",
  },
  {
    accessorKey: "cruncher_name",
    header: "Cruncher",
  },
];

interface NodeModelsTableProps {
  data: MetricsModelItem[];
  loading?: boolean;
}

export function NodeModelsTable({ data, loading }: NodeModelsTableProps) {
  return <DataTable columns={columns} data={data} loading={loading} />;
}
