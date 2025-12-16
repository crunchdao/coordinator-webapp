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
  Badge,
} from "@crunch-ui/core";
import { Search } from "@crunch-ui/icons";
import { useGetModels } from "../application/hooks/useGetModels";

export const ModelsTable: React.FC = () => {
  const { models, modelsLoading } = useGetModels();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm || !models) return models || [];
    
    return models.filter((model) => {
      return Object.values(model).some((value) => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
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
              <TableHead>Path</TableHead>
              <TableHead>Desired State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modelsLoading ? (
              <TableRow>
                <TableCell
                  colSpan={4}
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
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <p className="text-sm font-medium">
                      No models found
                    </p>
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
                  <TableCell>
                    <span className="font-medium text-sm tabular-nums">
                      {model.id}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-sm">
                      {model.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {model.path}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" size="sm">
                      {model.desiredState}
                    </Badge>
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