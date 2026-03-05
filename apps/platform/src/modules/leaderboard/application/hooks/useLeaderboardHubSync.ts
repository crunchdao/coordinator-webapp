import { useState } from "react";
import type { LeaderboardColumn } from "@coordinator/leaderboard/src/domain/types";
import {
  getLeaderboardDefinitions,
  updateLeaderboardDefinition,
} from "../../infrastructure/services";

export const useLeaderboardHubSync = () => {
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const pullFromHub = async (address: string, hubBaseUrl: string) => {
    setIsPulling(true);
    try {
      const definitions = await getLeaderboardDefinitions(
        `onchain:${address}`,
        hubBaseUrl
      );
      if (definitions.length === 0) {
        throw new Error("No leaderboard definitions found");
      }
      return definitions[0].columns;
    } finally {
      setIsPulling(false);
    }
  };

  const pushToHub = async (
    address: string,
    hubBaseUrl: string,
    columns: LeaderboardColumn[]
  ) => {
    setIsPushing(true);
    try {
      const definitions = await getLeaderboardDefinitions(
        `onchain:${address}`,
        hubBaseUrl
      );
      if (definitions.length === 0) {
        throw new Error("No leaderboard definitions found");
      }
      const definition = definitions[0];
      await updateLeaderboardDefinition(
        `onchain:${address}`,
        String(definition.id),
        {
          columns: columns.map(({ id, ...rest }) => ({
            ...rest,
            nativeConfiguration: rest.nativeConfiguration
              ? JSON.stringify(rest.nativeConfiguration)
              : null,
          })),
        },
        hubBaseUrl
      );
    } finally {
      setIsPushing(false);
    }
  };

  return { pullFromHub, pushToHub, isPulling, isPushing };
};
