"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@crunch-ui/core";
import { DataTable } from "@coordinator/ui/src/data-table";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { ModelState } from "../domain/types";

const columns: ColumnDef<ModelState>[] = [
  {
    accessorKey: "model.id",
    header: "Model ID",
  },
  {
    accessorKey: "desiredState",
    header: "State",
    cell: ({ row }) => (
      <Badge
        variant={row.original.desiredState === "START" ? "success" : "secondary"}
        size="sm"
      >
        {row.original.desiredState}
      </Badge>
    ),
  },
  {
    accessorKey: "model.address",
    header: "Model",
    cell: ({ row }) => <SolanaAddressLink address={row.original.model.address} />,
  },
  {
    accessorKey: "cruncherPubKey",
    header: "Cruncher",
    cell: ({ row }) => <SolanaAddressLink address={row.original.cruncherPubKey} />,
  },
  {
    accessorKey: "model.hardwareType",
    header: "Hardware",
  },
  {
    accessorKey: "model.modelHost",
    header: "Host",
  },
];

interface ModelStatesTableProps {
  data: ModelState[];
  loading?: boolean;
}

export function ModelStatesTable({ data, loading }: ModelStatesTableProps) {
  return <DataTable columns={columns} data={data} loading={loading} />;
}
