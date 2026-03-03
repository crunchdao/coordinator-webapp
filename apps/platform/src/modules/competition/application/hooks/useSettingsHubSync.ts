import { useState } from "react";
import { Competition } from "../../domain/types";
import { getCompetition, updateCompetition } from "../../infrastructure/service";

export const useSettingsHubSync = () => {
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const pullFromHub = async (address: string, hubBaseUrl: string) => {
    setIsPulling(true);
    try {
      return await getCompetition(address, hubBaseUrl);
    } finally {
      setIsPulling(false);
    }
  };

  const pushToHub = async (
    address: string,
    hubBaseUrl: string,
    data: Competition
  ) => {
    setIsPushing(true);
    try {
      const { url, ...body } = data;
      await updateCompetition(`onchain:${address}`, body, hubBaseUrl);
    } finally {
      setIsPushing(false);
    }
  };

  return { pullFromHub, pushToHub, isPulling, isPushing };
};
