"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import LogList from "@/ui/logs-list";
import { useGlobalSettings } from "@/modules/settings/application/hooks/useGlobalSettings";
import { createLogStream } from "../infrastructure/services";
import { LogEntry } from "../domain/types";
import { Badge, PulseRing } from "@crunch-ui/core";

export const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const { settings } = useGlobalSettings();

  useEffect(() => {
    if (!settings?.container?.name) return;

    const eventSource = createLogStream(
      settings.container.name,
      (log) => {
        setError(null);
        setLogs((prev) => [...prev, log]);
      },
      () => {
        setIsConnected(false);
        setError("Connection lost. Attempting to reconnect...");
      }
    );

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    eventSourceRef.current = eventSource;

    return () => {
      eventSource.close();
    };
  }, [settings?.container?.name]);

  const formattedLogs = useMemo(
    () =>
      logs.map((log, index) => ({
        id: index,
        createdAt: log.timestamp,
        content: log.message,
        emitter: log.level,
      })),
    [logs]
  );

  if (!settings?.container?.name) {
    return (
      <div className="p-6 text-muted-foreground">
        Please configure a container name in settings to view logs.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <Badge>Container: {settings.container.name}</Badge>
        <div className="flex items-center gap-2">
          <PulseRing active={isConnected} />
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>
      {error && (
        <div className="px-4 py-2 text-sm text-red-500 border-b">{error}</div>
      )}
      {logs.length === 0 ? (
        <div className="p-4 text-muted-foreground">Waiting for logs...</div>
      ) : (
        <LogList logs={formattedLogs} autoscroll={true} />
      )}
    </div>
  );
};
