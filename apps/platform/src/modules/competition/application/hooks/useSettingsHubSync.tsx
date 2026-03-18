import { useState } from "react";
import type { Environment } from "@/config";
import { Competition } from "../../domain/types";
import {
  getCompetition,
  updateCompetition,
} from "../../infrastructure/service";

export const useSettingsHubSync = () => {
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const pullFromHub = async (
    address: string,
    hubBaseUrl: string,
    hubEnv: Environment
  ) => {
    const competitionIdentifier = `onchain:${address}`;
    setIsPulling(true);
    try {
      return await getCompetition(competitionIdentifier, hubBaseUrl, hubEnv);
    } finally {
      setIsPulling(false);
    }
  };

  const pushToHub = async (
    address: string,
    hubBaseUrl: string,
    hubEnv: Environment,
    data: Competition
  ) => {
    setIsPushing(true);
    try {
      const { url: _url, ...body } = data;
      await updateCompetition(`onchain:${address}`, body, hubBaseUrl, hubEnv);
    } finally {
      setIsPushing(false);
    }
  };

  return { pullFromHub, pushToHub, isPulling, isPushing };
};
