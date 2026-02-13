"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import {
  getNodeUrl,
  setNodeUrl as persistNodeUrl,
} from "../../infrastructure/nodeConfig";

interface NodeConnectionContextValue {
  nodeUrl: string;
  setNodeUrl: (url: string) => void;
  isDefault: boolean;
}

const NodeConnectionContext = createContext<NodeConnectionContextValue | null>(
  null
);

export const NodeConnectionProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { crunchName } = useCrunchContext();
  const [nodeUrl, setNodeUrlState] = useState<string>(() =>
    getNodeUrl(crunchName)
  );
  const queryClient = useQueryClient();

  const setNodeUrl = useCallback(
    (url: string) => {
      persistNodeUrl(crunchName, url);
      setNodeUrlState(url || getNodeUrl(crunchName));
      // Clear all node queries so they refetch with the new URL
      queryClient.invalidateQueries({ queryKey: ["node-health"] });
      queryClient.invalidateQueries({ queryKey: ["node-models"] });
      queryClient.invalidateQueries({ queryKey: ["node-feeds"] });
      queryClient.invalidateQueries({ queryKey: ["node-feed-tail"] });
      queryClient.invalidateQueries({ queryKey: ["node-snapshots"] });
      queryClient.invalidateQueries({ queryKey: ["node-checkpoints"] });
      queryClient.invalidateQueries({ queryKey: ["node-checkpoints-recent"] });
    },
    [crunchName, queryClient]
  );

  const value = useMemo<NodeConnectionContextValue>(
    () => ({
      nodeUrl,
      setNodeUrl,
      isDefault: nodeUrl === "http://localhost:8000",
    }),
    [nodeUrl, setNodeUrl]
  );

  return (
    <NodeConnectionContext.Provider value={value}>
      {children}
    </NodeConnectionContext.Provider>
  );
};

export const useNodeConnection = (): NodeConnectionContextValue => {
  const context = useContext(NodeConnectionContext);
  if (!context) {
    throw new Error(
      "useNodeConnection must be used within NodeConnectionProvider"
    );
  }
  return context;
};
