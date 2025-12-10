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
import { DataTable } from "@/ui/data-table";
import { useLeaderboardTable } from "../application/hooks/useLeaderboardTable";
import { useGetLeaderboard } from "../application/hooks/useGetLeaderboard";

export const LeaderboardTable: React.FC = () => {
  const { leaderboard, leaderboardLoading } = useGetLeaderboard();
  const columns = useLeaderboardTable();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm || !leaderboard) return leaderboard || [];
    
    return leaderboard.filter((item) => {
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
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
        <DataTable
          data={filteredData}
          loading={leaderboardLoading}
          columns={columns}
        />
      </CardContent>
    </Card>
  );
};