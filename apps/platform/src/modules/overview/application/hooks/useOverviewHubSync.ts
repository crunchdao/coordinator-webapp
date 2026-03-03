import { useState } from "react";
import type { Slice } from "@crunchdao/slices";
import { Locale } from "../../domain/types";
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
    setIsPulling(true);
    try {
      const slices = await getOverviewSlices(address, locale, hubBaseUrl);
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
    setIsPushing(true);
    try {
      const hubSlices = await getOverviewSlices(address, locale, hubBaseUrl);
      const hubByName = new Map(hubSlices.map((s) => [s.name, s]));
      const localByName = new Map(localSlices.map((s) => [s.name, s]));

      for (const slice of localSlices) {
        const {
          id,
          updatedAt,
          createdAt,
          displayName,
          ...rest
        } = slice as Slice & { updatedAt?: string; createdAt?: string };
        const body = { ...rest, displayName: displayName ?? undefined };
        if (hubByName.has(slice.name)) {
          await updateOverviewSlice(address, slice.name, body, locale, hubBaseUrl);
        } else {
          await createOverviewSlice(address, body, locale, hubBaseUrl);
        }
      }

      for (const hubSlice of hubSlices) {
        if (!localByName.has(hubSlice.name)) {
          await deleteOverviewSlice(address, hubSlice.name, locale, hubBaseUrl);
        }
      }
    } finally {
      setIsPushing(false);
    }
  };

  return { pullFromHub, pushToHub, isPulling, isPushing };
};
