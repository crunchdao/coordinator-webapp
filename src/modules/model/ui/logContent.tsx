"use client";
import { Spinner, Alert, AlertDescription } from "@crunch-ui/core";
import LogList from "@/ui/logs-list";

interface LogContentProps {
  logs: any[];
  loading: boolean;
  error: unknown;
  hasUrl: boolean;
}

export const LogContent: React.FC<LogContentProps> = ({
  logs,
  loading,
  error,
  hasUrl,
}) => {
  if (!hasUrl) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No logs available
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error instanceof Error ? error.message : "Failed to fetch logs"}
        </AlertDescription>
      </Alert>
    );
  }

  if (logs.length > 0) {
    return <LogList logs={logs} autoscroll={true} />;
  }

  return (
    <div className="text-center text-muted-foreground py-8">
      No logs available
    </div>
  );
};