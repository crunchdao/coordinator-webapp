"use client";

import { useState } from "react";
import { Button, Card, CardContent, Spinner, toast } from "@crunch-ui/core";
import { SliceManager, useSlicesBatch } from "@crunchdao/slices";
import type { Slice } from "@crunchdao/slices";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import {
  useConfigFile,
  useSaveConfigFile,
} from "@/modules/config/application/hooks/useConfigFile";
import { HubSyncButtons } from "@/modules/hub/ui/hubSyncButtons";
import { Locale } from "@/modules/common/types";
import { useOverviewHubSync } from "../application/hooks/useOverviewHubSync";
import { OverviewSliceHeader } from "./overviewSliceHeader";

export const OverviewSlicesView: React.FC = () => {
  const { crunchName } = useCrunchContext();
  const [locale, setLocale] = useState<Locale>(Locale.ENGLISH);
  const { pullFromHub, pushToHub, isPulling, isPushing } =
    useOverviewHubSync(locale);

  const configPath = `crunches/${crunchName}/overview-slices.json`;

  const { data: savedSlices, isLoading: slicesLoading } = useConfigFile<
    Slice[]
  >(configPath, { defaultValue: [] });

  const { saveAsync, isSaving: isSavingFile } = useSaveConfigFile<Slice[]>(
    configPath,
    { successMessage: "Slices saved successfully" }
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
    hubUrl: string
  ) => {
    try {
      const hubSlices = await pullFromHub(address, hubUrl);
      await saveAsync(hubSlices);
      toast({ title: `Slices pulled from "${envName}" successfully` });
    } catch (error) {
      toast({
        title: "Failed to pull slices",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePushToHub = async (
    envName: string,
    address: string,
    hubUrl: string
  ) => {
    try {
      await pushToHub(address, hubUrl, slices);
      await saveAsync(slices);
      await saveChanges();
      toast({ title: `Slices pushed to "${envName}" successfully` });
    } catch (error) {
      toast({
        title: "Failed to push slices",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (slicesLoading) {
    return <Spinner className="mx-auto" />;
  }

  return (
    <Card>
      <OverviewSliceHeader locale={locale} setLocale={setLocale} />
      <CardContent>
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
      </CardContent>
    </Card>
  );
};
