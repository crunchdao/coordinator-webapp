"use client";
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Spinner,
  Switch,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@crunch-ui/core";
import { InfoCircle, Search } from "@crunch-ui/icons";
import { useGetModels } from "../application/hooks/useGetModels";
import { useUpdateModel } from "../application/hooks/useUpdateModel";
import { useGetModelList } from "../application/hooks/useGetModelList";
import { DesiredState } from "../domain/types";
import { UpdateModelSheet } from "./updateModelSheet";
import { LogsDialog } from "./logsDialog";
import { AddModelSheet } from "./addModelSheet";
import { ModelDetailDialog } from "./modelDetailDialog";

export const ModelsTable: React.FC = () => {
  const { models, modelsLoading } = useGetModels();
  const { models: modelList } = useGetModelList();
  const { updateModel, updateModelLoading } = useUpdateModel();
  const [searchTerm, setSearchTerm] = useState("");

  type ModelInfo = { cruncher_name: string; model_name: string };
  const modelIdToInfo = useMemo((): Record<string, ModelInfo> => {
    if (!modelList) return {};
    const result: Record<string, ModelInfo> = {};
    for (const model of modelList) {
      if (model.model_id) {
        result[String(model.model_id)] = {
          cruncher_name: model.cruncher_name,
          model_name: model.model_name,
        };
      }
    }
    return result;
  }, [modelList]);

  const enrichedModels = useMemo(() => {
    if (!models) return [];
    return models.map((model) => {
      const modelInfo = modelIdToInfo[String(model.id)];
      return {
        ...model,
        model_name: modelInfo?.model_name || model.model_name || "",
        cruncher_name: modelInfo?.cruncher_name || model.cruncher_name || "",
      };
    });
  }, [models, modelIdToInfo]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return enrichedModels;

    return enrichedModels.filter((model) => {
      return Object.values(model).some((value) => {
        if (value === null || value === undefined) return false;
        return value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    });
  }, [enrichedModels, searchTerm]);

  return (
    <Card displayCorners>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Models</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search models..."
                className="max-w-md"
                clearable
                rightSlot={<Search className="text-muted-foreground" />}
              />
            </div>
            <AddModelSheet />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Model Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Desired State</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modelsLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Spinner />
                    <span>Loading models...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData && filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <p className="text-sm font-medium">No models found</p>
                    {searchTerm && (
                      <p className="body-sm">
                        Try adjusting your search criteria
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData?.map((model) => (
                <TableRow
                  key={model.id}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell>{model.id}</TableCell>
                  <TableCell>{model.model_name}</TableCell>
                  <TableCell>{model.cruncher_name}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        {model.status}{" "}
                        {model.statusMessage && (
                          <InfoCircle className="inline-block ml-1 mb-1 body-sm" />
                        )}
                      </TooltipTrigger>
                      {model.statusMessage && (
                        <TooltipContent>{model.statusMessage}</TooltipContent>
                      )}
                    </Tooltip>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Switch
                      checked={model.desired_state === DesiredState.RUNNING}
                      disabled={updateModelLoading}
                      onCheckedChange={(checked) => {
                        updateModel({
                          modelId: model.id,
                          data: {
                            desired_state: checked
                              ? DesiredState.RUNNING
                              : DesiredState.STOPPED,
                          },
                        });
                      }}
                    />
                    <p className="body-xs text-muted-foreground inline-block">
                      {model.desired_state}
                    </p>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <LogsDialog model={model} />
                      <ModelDetailDialog model={model} />
                      <UpdateModelSheet model={model} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
