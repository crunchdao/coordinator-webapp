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
} from "@crunch-ui/core";
import { Search } from "@crunch-ui/icons";
import { useGetModels } from "../application/hooks/useGetModels";
import { useUpdateModel } from "../application/hooks/useUpdateModel";
import { DesiredState } from "../domain/types";
import { UpdateModelSheet } from "./updateModelSheet";

export const ModelsTable: React.FC = () => {
  const { models, modelsLoading } = useGetModels();
  const { updateModel, updateModelLoading } = useUpdateModel();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm || !models) return models || [];

    return models.filter((model) => {
      return Object.values(model).some((value) => {
        if (value === null || value === undefined) return false;
        return value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    });
  }, [models, searchTerm]);

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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Desired State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modelsLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
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
                <TableCell colSpan={5} className="h-32 text-center">
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
                  <TableCell>
                    <Switch
                      checked={model.desired_state === DesiredState.RUNNING}
                      disabled={updateModelLoading}
                      onCheckedChange={(checked) => {
                        updateModel({
                          modelId: model.id,
                          data: {
                            desiredState: checked
                              ? DesiredState.RUNNING
                              : DesiredState.STOPPED,
                          },
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <UpdateModelSheet model={model} />
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
