"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardContent,
  Spinner,
  toast,
} from "@crunch-ui/core";
import {
  SliceManager,
  useSlicesBatch,
  type CreateSliceData,
  type UpdateSliceData,
} from "@crunchdao/slices";
import { Download } from "@crunch-ui/icons";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetSeasons } from "@/modules/season/application/hooks/useGetSeasons";
import { Locale } from "../domain/types";
import { useGetPitchSlices } from "../application/hooks/useGetPitchSlices";
import { useCreatePitchSlice } from "../application/hooks/useCreatePitchSlice";
import { useUpdatePitchSlice } from "../application/hooks/useUpdatePitchSlice";
import { useDeletePitchSlice } from "../application/hooks/useDeletePitchSlice";
import { PitchSliceHeader } from "./pitchSliceHeader";

export function PitchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const { crunchData, isLoading: crunchLoading } = useCrunchContext();
  const crunchAddress = crunchData?.address;

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

  const { slices: serverSlices, slicesLoading } = useGetPitchSlices(
    selectedSeasonNumber,
    crunchAddress,
    locale
  );

  const { createSliceAsync } = useCreatePitchSlice(
    selectedSeasonNumber || 0,
    crunchAddress || "",
    locale
  );
  const { updateSliceAsync } = useUpdatePitchSlice(
    selectedSeasonNumber || 0,
    crunchAddress || "",
    locale
  );
  const { deleteSlice } = useDeletePitchSlice(
    selectedSeasonNumber || 0,
    crunchAddress || "",
    locale
  );

  const onCreate = useCallback(
    async (data: CreateSliceData) => {
      await createSliceAsync(data);
    },
    [createSliceAsync]
  );

  const onUpdate = useCallback(
    async (data: UpdateSliceData) => {
      await updateSliceAsync({
        sliceName: data.sliceName,
        body: data.body,
        locale,
      });
    },
    [updateSliceAsync, locale]
  );

  const onDeleteSlice = useCallback(
    async (name: string) => {
      await deleteSlice(name);
    },
    [deleteSlice]
  );

  const onBatchSuccess = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["pitchSlices", selectedSeasonNumber, crunchAddress],
    });
    toast({ title: "Changes saved successfully" });
  }, [queryClient, selectedSeasonNumber, crunchAddress]);

  const {
    slices,
    isDirty,
    isSaving,
    handleCreate,
    handleUpdate,
    handleDelete,
    saveChanges,
    resetChanges,
  } = useSlicesBatch({
    serverSlices,
    onCreate,
    onUpdate,
    onDelete: onDeleteSlice,
    onSuccess: onBatchSuccess,
  });

  const handleSaveChanges = async () => {
    try {
      await saveChanges();
    } catch (error) {
      toast({
        title: "Failed to save changes",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDownloadJson = () => {
    const json = JSON.stringify(slices, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pitch-${crunchData?.name || "slices"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              <Button variant="outline" onClick={handleDownloadJson}>
                <Download />
                Export JSON
              </Button>
              {isDirty && (
                <>
                  <Button
                    variant="outline"
                    onClick={resetChanges}
                    disabled={isSaving}
                  >
                    Reset
                  </Button>
                  <Button onClick={handleSaveChanges} disabled={isSaving}>
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
