"use client";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@crunch-ui/core";
import { useGetLogsByUrl } from "../application/hooks/useGetLogsByUrl";
import { Model } from "../domain/types";
import { LogContent } from "./logContent";
import { List } from "@crunch-ui/icons";

interface LogsDialogProps {
  model: Model;
}

export const LogsDialog: React.FC<LogsDialogProps> = ({ model }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("builder");

  const {
    logs: builderLogs,
    logsLoading: builderLoading,
    logsError: builderError,
  } = useGetLogsByUrl(
    model.builder_log_uri || "",
    open && activeTab === "builder" && !!model.builder_log_uri
  );

  const {
    logs: runnerLogs,
    logsLoading: runnerLoading,
    logsError: runnerError,
  } = useGetLogsByUrl(
    model.runner_log_uri || "",
    open && activeTab === "runner" && !!model.runner_log_uri
  );

  const parseLogs = (logs: string | undefined) => {
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
  };

  const parsedBuilderLogs = useMemo(
    () => parseLogs(builderLogs),
    [builderLogs]
  );
  const parsedRunnerLogs = useMemo(() => parseLogs(runnerLogs), [runnerLogs]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Logs <List />
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Model Logs</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList>
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="runner">Runner</TabsTrigger>
          </TabsList>
          <TabsContent value="builder" className="flex-1 min-h-0 overflow-auto">
            <div className="overflow-x-auto">
              <LogContent
                logs={parsedBuilderLogs}
                loading={builderLoading}
                error={builderError}
                hasUrl={!!model.builder_log_uri}
              />
            </div>
          </TabsContent>
          <TabsContent value="runner" className="flex-1 min-h-0 overflow-auto">
            <div className="overflow-x-auto">
              <LogContent
                logs={parsedRunnerLogs}
                loading={runnerLoading}
                error={runnerError}
                hasUrl={!!model.runner_log_uri}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
