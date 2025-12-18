"use client";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Spinner,
  Alert,
  AlertDescription,
} from "@crunch-ui/core";
import LogList from "@/ui/logs-list";
import { useGetLogsByUrl } from "../application/hooks/useGetLogsByUrl";

interface LogsDialogProps {
  logUrl: string;
  title: string;
  buttonLabel: string;
}

export const LogsDialog: React.FC<LogsDialogProps> = ({
  logUrl,
  title,
  buttonLabel,
}) => {
  const [open, setOpen] = useState(false);
  const { logs, logsLoading, logsError } = useGetLogsByUrl(
    logUrl,
    open && !!logUrl
  );

  const parsedLogs = useMemo(() => {
    if (!logs) return [];

    const lines = logs.split("\n").filter((line) => line.trim());

    return lines.map((line, index) => ({
      id: index,
      createdAt: new Date().toISOString(),
      content: line,
      error:
        line.toLowerCase().includes("error") ||
        line.toLowerCase().includes("failed"),
    }));
  }, [logs]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={!logUrl}>
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-auto">
          {logsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : logsError ? (
            <Alert variant="destructive">
              <AlertDescription>
                {logsError instanceof Error
                  ? logsError.message
                  : "Failed to fetch logs"}
              </AlertDescription>
            </Alert>
          ) : parsedLogs.length > 0 ? (
            <div className="h-[calc(100vh-256px)]">
              <LogList logs={parsedLogs} autoscroll={true} />
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No logs available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
