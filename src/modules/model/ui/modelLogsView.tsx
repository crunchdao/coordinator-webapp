"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
  Alert,
  AlertDescription,
} from "@crunch-ui/core";
import { useGetLogsByType } from "../application/hooks/useGetLogsByType";
import { JobLogType } from "../domain/types";

interface ModelLogsViewProps {
  jobId: string;
}

export const ModelLogsView: React.FC<ModelLogsViewProps> = ({ jobId }) => {
  const [logType, setLogType] = useState<JobLogType>(JobLogType.BUILDER);
  const { logs, logsLoading, logsError } = useGetLogsByType({
    jobId,
    type: logType,
  });

  return (
    <Card displayCorners>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Model Logs - {jobId}</CardTitle>
          <Select
            value={logType}
            onValueChange={(value) => setLogType(value as JobLogType)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select log type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={JobLogType.BUILDER}>Builder Logs</SelectItem>
              <SelectItem value={JobLogType.RUNNER}>Runner Logs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {logsLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8">
            <Spinner />
            <span>Loading logs...</span>
          </div>
        ) : logsError ? (
          <Alert variant="destructive">
            <AlertDescription>
              Error loading logs: {(logsError as Error).message}
            </AlertDescription>
          </Alert>
        ) : logs?.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No logs available for this model
          </div>
        ) : (
          <div className="bg-black text-white font-mono text-sm p-4 rounded-md overflow-auto max-h-[600px]">
            <pre>{JSON.stringify(logs, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
