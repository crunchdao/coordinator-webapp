import { useState } from "react";
import type { Slice } from "@crunchdao/slices";
import { Locale } from "@/modules/common/types";
import {
  getOverviewSlices,
  createOverviewSlice,
  updateOverviewSlice,
  deleteOverviewSlice,
} from "../../infrastructure/service";

export const useOverviewHubSync = (locale: Locale) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const pullFromHub = async (address: string, hubBaseUrl: string) => {
    const competitionIdentifier = `onchain:${address}`;
    setIsPulling(true);
    try {
      const slices = await getOverviewSlices(competitionIdentifier, locale, hubBaseUrl);
      return slices.map((s, i) => ({ ...s, id: Date.now() + i }));
    } finally {
      setIsPulling(false);
    }
  };

  const pushToHub = async (
    address: string,
    hubBaseUrl: string,
    localSlices: Slice[]
  ) => {
    const competitionIdentifier = `onchain:${address}`;
    setIsPushing(true);
    try {
      const hubSlices = await getOverviewSlices(competitionIdentifier, locale, hubBaseUrl);
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
          await updateOverviewSlice(competitionIdentifier, slice.name, body, locale, hubBaseUrl);
        } else {
          await createOverviewSlice(competitionIdentifier, body, locale, hubBaseUrl);
        }
      }

      for (const hubSlice of hubSlices) {
        if (!localByName.has(hubSlice.name)) {
          await deleteOverviewSlice(competitionIdentifier, hubSlice.name, locale, hubBaseUrl);
        }
      }
    } finally {
      setIsPushing(false);
    }
  };

  return { pullFromHub, pushToHub, isPulling, isPushing };
};
