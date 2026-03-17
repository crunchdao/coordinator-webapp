import { useState } from "react";
import type { Environment } from "@/config";
import type { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types";
import {
  getLeaderboardDefinitions,
  updateLeaderboardDefinition,
} from "../../infrastructure/services";

export const useLeaderboardHubSync = () => {
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const pullFromHub = async (
    address: string,
    hubBaseUrl: string,
    hubEnv: Environment
  ) => {
    setIsPulling(true);
    try {
      const definitions = await getLeaderboardDefinitions(
        `onchain:${address}`,
        hubBaseUrl,
        hubEnv
      );
      if (!definitions?.length) {
        throw new Error("No leaderboard definitions found");
      }
      const definition = definitions[0];
      return {
        columns: definition.columns,
        externalUrl: definition.externalUrl,
      };
    } finally {
      setIsPulling(false);
    }
  };

  const pushToHub = async (
    address: string,
    hubBaseUrl: string,
    hubEnv: Environment,
    columns: LeaderboardColumn[],
    externalUrl?: string
  ) => {
    setIsPushing(true);
    try {
      const definitions = await getLeaderboardDefinitions(
        `onchain:${address}`,
        hubBaseUrl,
        hubEnv
      );
      if (!definitions?.length) {
        throw new Error("No leaderboard definitions found");
      }
      const definition = definitions[0];
      await updateLeaderboardDefinition(
        `onchain:${address}`,
        definition.name,
        {
          externalUrl,
          columns: columns.map(({ id: _id, ...rest }) => ({
            ...rest,
            nativeConfiguration: rest.nativeConfiguration,
          })),
        },
        hubBaseUrl,
        hubEnv
      );
    } finally {
      setIsPushing(false);
    }
  };

  return { pullFromHub, pushToHub, isPulling, isPushing };
};
