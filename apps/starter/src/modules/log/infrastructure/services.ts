import configApiClient from "@coordinator/utils/src/config-api";
import { LogEntry } from "../domain/types";
import { logEndpoints } from "./endpoints";

export function createLogStream(
  containerName: string,
  onMessage: (log: LogEntry) => void,
  onError?: (error: Event) => void
): EventSource {
  const baseURL = configApiClient.defaults.baseURL || "";
  const url = `${baseURL}${logEndpoints.streamLogs(containerName)}`;

  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const log = JSON.parse(event.data);
      onMessage(log);
    } catch (error) {
      console.error("Failed to parse log entry:", error);
    }
  };

  eventSource.onerror = (error) => {
    console.error("EventSource error:", error);
    onError?.(error);
  };

  return eventSource;
}
