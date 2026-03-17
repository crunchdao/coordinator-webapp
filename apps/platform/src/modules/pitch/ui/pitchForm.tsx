"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button, Card, CardContent, Spinner, toast } from "@crunch-ui/core";
import { SliceManager, useSlicesBatch } from "@crunchdao/slices";
import type { Slice } from "@crunchdao/slices";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetSeasons } from "@/modules/season/application/hooks/useGetSeasons";
import {
  useConfigFile,
  useSaveConfigFile,
} from "@/modules/config/application/hooks/useConfigFile";
import { HubSyncButtons } from "@/modules/hub/ui/hubSyncButtons";
import { Locale } from "@/modules/common/types";
import type { Environment } from "@/config";
import { usePitchHubSync } from "../application/hooks/usePitchHubSync";
import { PitchSliceHeader } from "./pitchSliceHeader";

export function PitchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { crunchName, isLoading: crunchLoading } = useCrunchContext();

  const { seasons: seasonsResponse, seasonsLoading } = useGetSeasons();
  const seasons = useMemo(
    () => seasonsResponse?.content ?? [],
    [seasonsResponse]
  );

  const latestSeason = useMemo(() => {
    if (!seasons.length) return undefined;
    return seasons.reduce((latest, season) =>
      season.number > latest.number ? season : latest
    );
  }, [seasons]);

  const seasonFromUrl = searchParams.get("season");
  const selectedSeasonNumber = useMemo(() => {
    if (seasonFromUrl) {
      const num = Number(seasonFromUrl);
      if (seasons.some((s) => s.number === num)) {
        return num;
      }
    }
    return latestSeason?.number;
  }, [seasonFromUrl, seasons, latestSeason]);

  const handleSeasonChange = useCallback(
    (seasonNumber: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("season", String(seasonNumber));
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const [locale, setLocale] = useState<Locale>(Locale.ENGLISH);

  const configPath = `crunches/${crunchName}/pitch-slices.json`;

  const { data: savedSlices, isLoading: slicesLoading } = useConfigFile<
    Slice[]
  >(configPath, { defaultValue: [] });

  const { saveAsync, isSaving: isSavingFile } = useSaveConfigFile<Slice[]>(
    configPath,
    { successMessage: "Pitch slices saved successfully" }
  );

  const { pullFromHub, pushToHub, isPulling, isPushing } = usePitchHubSync(
    selectedSeasonNumber,
    locale
  );

  const {
    slices,
    isSaving: isBatchSaving,
    handleCreate,
    handleUpdate,
    handleDelete,
    saveChanges,
  } = useSlicesBatch({
    serverSlices: savedSlices,
  });

  const saving = isSavingFile || isBatchSaving;

  const handleSaveChanges = async () => {
    await saveAsync(slices);
    await saveChanges();
  };

  const handlePullFromHub = async (
    envName: string,
    address: string,
    hubUrl: string,
    hubEnv: Environment
  ) => {
    try {
      const hubSlices = await pullFromHub(address, hubUrl, hubEnv);
      await saveAsync(hubSlices);
      toast({ title: `Pitch slices pulled from "${envName}" successfully` });
    } catch (error) {
      toast({
        title: "Failed to pull pitch slices",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePushToHub = async (
    envName: string,
    address: string,
    hubUrl: string,
    hubEnv: Environment
  ) => {
    try {
      await pushToHub(address, hubUrl, hubEnv, slices);
      await saveAsync(slices);
      await saveChanges();
      toast({ title: `Pitch slices pushed to "${envName}" successfully` });
    } catch (error) {
      toast({
        title: "Failed to push pitch slices",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (crunchLoading || seasonsLoading) {
    return <Spinner className="mx-auto" />;
  }

  return (
    <Card>
      <PitchSliceHeader
        locale={locale}
        setLocale={setLocale}
        seasons={seasons}
        selectedSeasonNumber={selectedSeasonNumber}
        onSeasonChange={handleSeasonChange}
      />
      <CardContent>
        {!seasons.length || !selectedSeasonNumber ? (
          <p className="text-center text-muted-foreground py-6">
            No active season found.
          </p>
        ) : slicesLoading ? (
          <Spinner className="mx-auto py-6" />
        ) : (
          <>
            <SliceManager
              slices={slices}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
            <div className="mt-6 flex justify-end gap-2">
              <HubSyncButtons
                isPulling={isPulling}
                isPushing={isPushing}
                onPull={handlePullFromHub}
                onPush={handlePushToHub}
              />
              <Button onClick={handleSaveChanges} loading={saving}>
                Save Local
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
