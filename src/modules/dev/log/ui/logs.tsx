"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  PulseRing,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@crunch-ui/core";
import LogList from "@/ui/logs-list";
import { useGlobalSettings } from "@/modules/settings/application/hooks/useGlobalSettings";
import { createLogStream } from "../infrastructure/services";
import { LogEntry } from "../domain/types";

interface ContainerLogs {
  [containerName: string]: {
    logs: LogEntry[];
    isConnected: boolean;
    error: string | null;
  };
}

const MAX_LOGS_PER_CONTAINER = 1_000;

export const Logs = () => {
  const { settings } = useGlobalSettings();
  const containerNames = useMemo(
    () => settings?.logs?.containerNames || [],
    [settings?.logs?.containerNames]
  );

  const [containerLogs, setContainerLogs] = useState<ContainerLogs>({});
  const [activeContainer, setActiveContainer] = useState<string>("");
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (containerNames.length > 0 && !activeContainer) {
      // eslint-disable-next-line
      setActiveContainer(containerNames[0]);
    }
  }, [containerNames, activeContainer]);

  useEffect(() => {
    containerNames.forEach((containerName) => {
      if (!containerLogs[containerName]) {
        setContainerLogs((prev) => ({
          ...prev,
          [containerName]: {
            logs: [],
            isConnected: false,
            error: null,
          },
        }));
      }
    });
    // eslint-disable-next-line
  }, [containerNames]);

  useEffect(() => {
    if (!activeContainer || containerNames.length === 0) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = createLogStream(
      activeContainer,
      (log) => {
        setContainerLogs((prev) => {
          const currentLogs = prev[activeContainer]?.logs || [];
          const newLogs = [...currentLogs, log];
          console.log(newLogs);
          const trimmedLogs = newLogs.slice(-MAX_LOGS_PER_CONTAINER);

          return {
            ...prev,
            [activeContainer]: {
              ...prev[activeContainer],
              logs: trimmedLogs,
              error: null,
            },
          };
        });
      },
      () => {
        setContainerLogs((prev) => ({
          ...prev,
          [activeContainer]: {
            ...prev[activeContainer],
            isConnected: false,
            error: "Connection lost. Attempting to reconnect...",
          },
        }));
      }
    );

    eventSource.onopen = () => {
      setContainerLogs((prev) => ({
        ...prev,
        [activeContainer]: {
          ...prev[activeContainer],
          isConnected: true,
          error: null,
        },
      }));
    };

    eventSourceRef.current = eventSource;

    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [activeContainer, containerNames]);

  console.log(containerLogs);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const formattedLogs = useMemo(() => {
    const currentContainer = containerLogs[activeContainer];
    if (!currentContainer) return [];

    return currentContainer.logs.map((log, index) => ({
      id: `${activeContainer}-${log.timestamp}-${index}`,
      createdAt: log.timestamp,
      content: log.message,
      emitter: log.level,
    }));
  }, [containerLogs, activeContainer]);

  const currentContainer = containerLogs[activeContainer];

  return (
    <div className="h-full flex flex-col">
      {currentContainer && (
        <div className="flex items-center gap-2">
          <PulseRing active={currentContainer.isConnected} />
          {currentContainer.isConnected ? "Connected" : "Disconnected"}
        </div>
      )}
      <Tabs value={activeContainer} onValueChange={setActiveContainer}>
        <TabsList size="sm">
          {containerNames.map((name) => (
            <TabsTrigger key={name} value={name}>
              {name}
            </TabsTrigger>
          ))}
        </TabsList>

        {containerNames.map((name) => (
          <TabsContent key={name} value={name} className="flex-1">
            {containerLogs[name]?.error && (
              <div className="px-4 py-2 text-sm text-red-500 border-b">
                {containerLogs[name].error}
              </div>
            )}
            {containerLogs[name]?.logs === undefined ? (
              <div className="p-4 text-muted-foreground">
                Waiting for logs...
              </div>
            ) : (
              <div className="relative">
                <LogList
                  autoscroll
                  logs={name === activeContainer ? formattedLogs : []}
                />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};