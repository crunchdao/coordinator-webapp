import { useState } from "react";
import type { Environment } from "@/config";
import type { Slice } from "@crunchdao/slices";
import { Locale } from "@/modules/common/types";
import {
  getPitchSlices,
  createPitchSlice,
  updatePitchSlice,
  deletePitchSlice,
} from "../../infrastructure/service";

export const usePitchHubSync = (
  seasonNumber: number | undefined,
  locale: Locale
) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const pullFromHub = async (
    address: string,
    hubBaseUrl: string,
    hubEnv: Environment
  ) => {
    if (!seasonNumber) {
      throw new Error("No season selected");
    }

    const competitionIdentifier = `onchain:${address}`;
    setIsPulling(true);
    try {
      const slices = await getPitchSlices(
        seasonNumber,
        competitionIdentifier,
        locale,
        hubBaseUrl,
        hubEnv
      );
      return slices.map((s, i) => ({ ...s, id: Date.now() + i }));
    } finally {
      setIsPulling(false);
    }
  };

  const pushToHub = async (
    address: string,
    hubBaseUrl: string,
    hubEnv: Environment,
    localSlices: Slice[]
  ) => {
    if (!seasonNumber) {
      throw new Error("No season selected");
    }

    const competitionIdentifier = `onchain:${address}`;
    setIsPushing(true);
    try {
      const hubSlices = await getPitchSlices(
        seasonNumber,
        competitionIdentifier,
        locale,
        hubBaseUrl,
        hubEnv
      );
      const hubByName = new Map(hubSlices.map((s) => [s.name, s]));
      const localByName = new Map(localSlices.map((s) => [s.name, s]));

      for (const slice of localSlices) {
        const body = {
          name: slice.name,
          displayName: slice.displayName ?? undefined,
          type: slice.type,
          nativeConfiguration: slice.nativeConfiguration,
          order: slice.order,
        };
        if (hubByName.has(slice.name)) {
          await updatePitchSlice(
            seasonNumber,
            competitionIdentifier,
            slice.name,
            body,
            locale,
            hubBaseUrl,
            hubEnv
          );
        } else {
          await createPitchSlice(
            seasonNumber,
            competitionIdentifier,
            body,
            locale,
            hubBaseUrl,
            hubEnv
          );
        }
      }

      for (const hubSlice of hubSlices) {
        if (!localByName.has(hubSlice.name)) {
          await deletePitchSlice(
            seasonNumber,
            competitionIdentifier,
            hubSlice.name,
            locale,
            hubBaseUrl,
            hubEnv
          );
        }
      }
    } finally {
      setIsPushing(false);
    }
  };

  return { pullFromHub, pushToHub, isPulling, isPushing };
};
