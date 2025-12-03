"use client";
import { useState } from "react";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { DataTable } from "@/ui/data-table";
import { useLeaderboardTable } from "../application/hooks/useLeaderboardTable";
import { useGetLeaderboard } from "../application/hooks/useGetLeaderboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@crunch-ui/core";
import { Search } from "@crunch-ui/icons";
import { AddColumnSheet } from "./addColumnSheet";

export const LeaderboardTable: React.FC<{}> = ({}) => {
  const { leaderboard, leaderboardLoading } = useGetLeaderboard();
  const columns = useLeaderboardTable();
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: leaderboard || [],
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    initialState: {
      pagination: { pageSize: 10 },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const currentPage = table
    .getPaginationRowModel()
    .rows.map((row) => row.original);

  const handleSearch = (value: string) => {
    setGlobalFilter(value);
    table.setPageIndex(0);
  };

  return (
    <Card displayCorners>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Leaderboard</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                value={globalFilter}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search projects..."
                className="max-w-md"
                clearable
                rightSlot={<Search className="text-muted-foreground" />}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          data={currentPage}
          loading={leaderboardLoading}
          columns={columns}
          pagination={{
            pagination: {
              page: table.getState().pagination.pageIndex,
              size: table.getState().pagination.pageSize,
              totalPages: table.getPageCount(),
              totalElements: table.getFilteredRowModel().rows.length,
            },
            onPaginationChange: (pagination) => {
              table.setPageIndex(pagination.page);
              table.setPageSize(pagination.size);
            },
          }}
        />
      </CardContent>
    </Card>
  );
};
