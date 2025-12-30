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
import { useGetModelList } from "../application/hooks/useGetModelList";

export const LeaderboardTable: React.FC = () => {
  const { leaderboard, leaderboardLoading } = useGetLeaderboard();
  const { models, modelsLoading } = useGetModelList();
  const columns = useLeaderboardTable();
  const [searchTerm, setSearchTerm] = useState("");

  const modelIdToInfo = useMemo(() => {
    if (!models) return {};
    return models.reduce((acc, model) => {
      if (model.model_id) {
        acc[String(model.model_id)] = {
          cruncher_name: model.cruncher_name,
          model_name: model.model_name,
        };
      }
      return acc;
    }, {} as Record<string, { cruncher_name: string; model_name: string }>);
  }, [models]);

  const enrichedLeaderboard = useMemo(() => {
    if (!leaderboard) return [];
    return leaderboard.map((item) => {
      const modelInfo = item.model_id ? modelIdToInfo[String(item.model_id)] : null;
      return {
        ...item,
        cruncher_name: modelInfo?.cruncher_name || "",
        model_name: modelInfo?.model_name || "",
      };
    });
  }, [leaderboard, modelIdToInfo]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return enrichedLeaderboard;
    
    return enrichedLeaderboard.filter((item) => {
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [enrichedLeaderboard, searchTerm]);

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
          loading={leaderboardLoading || modelsLoading}
          columns={columns}
        />
      </CardContent>
    </Card>
  );
};