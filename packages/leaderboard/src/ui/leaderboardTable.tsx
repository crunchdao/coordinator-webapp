"use client";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "@crunch-ui/core";
import { Search } from "@crunch-ui/icons";
import { DataTable } from "@coordinator/ui/src/data-table";
import { LeaderboardPosition, LeaderboardColumn } from "../domain/types";
import { useBuildLeaderboardColumns } from "../application/hooks/useBuildLeaderboardColumns";

export interface LeaderboardTableProps {
  leaderboard: LeaderboardPosition[];
  columns: LeaderboardColumn[];
  loading?: boolean;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  leaderboard,
  columns,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const tableColumns = useBuildLeaderboardColumns(columns);

  const filteredData = useMemo(() => {
    if (!searchTerm) return leaderboard;

    return leaderboard.filter((item) => {
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        return value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    });
  }, [leaderboard, searchTerm]);

  return (
    <Card displayCorners>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Leaderboard</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
        <DataTable data={filteredData} loading={loading} columns={tableColumns} />
      </CardContent>
    </Card>
  );
};
