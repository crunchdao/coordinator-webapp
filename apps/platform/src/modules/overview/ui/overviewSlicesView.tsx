"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Spinner,
  toast,
} from "@crunch-ui/core";
import { SliceManager, useSlicesBatch } from "@crunchdao/slices";
import type { Slice } from "@crunchdao/slices";
import { Download, Export } from "@crunch-ui/icons";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useCompetitionEnvironments } from "@/modules/config/application/hooks/useCompetitionEnvironments";
import {
  useConfigFile,
  useSaveConfigFile,
} from "@/modules/config/application/hooks/useConfigFile";
import { Locale } from "../domain/types";
import {
  getOverviewSlices as getHubSlices,
  createOverviewSlice,
  updateOverviewSlice,
  deleteOverviewSlice,
} from "../infrastructure/service";
import { OverviewSliceHeader } from "./overviewSliceHeader";

export const OverviewSlicesView: React.FC = () => {
  const { crunchName } = useCrunchContext();
  const { environments } = useCompetitionEnvironments(crunchName);
  const [locale, setLocale] = useState<Locale>(Locale.ENGLISH);
  const [isPulling, setIsPulling] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  const configPath = `crunches/${crunchName}/slices.json`;

  const { data: savedSlices, isLoading: slicesLoading } = useConfigFile<
    Slice[]
  >(configPath, { defaultValue: [] });

  const { saveAsync, isSaving: isSavingFile } = useSaveConfigFile<Slice[]>(
    configPath,
    { successMessage: "Slices saved successfully" }
  );

  const {
    slices,
    isDirty,
    isSaving: isBatchSaving,
    handleCreate,
    handleUpdate,
    handleDelete,
    saveChanges,
    resetChanges,
  } = useSlicesBatch({
    serverSlices: savedSlices,
    onCreate: async () => {},
    onUpdate: async () => {},
    onDelete: async () => {},
    onSuccess: () => {},
  });

  const saving = isSavingFile || isBatchSaving;

  const handleSaveChanges = async () => {
    try {
      await saveAsync(slices);
      await saveChanges();
    } catch {
      // Error already handled by useSaveConfigFile
    }
  };

  const handlePullFromHub = async (
    envName: string,
    address: string,
    hubUrl: string
  ) => {
    setIsPulling(true);
    try {
      console.log(hubUrl);
      const hubSlices = await getHubSlices(address, locale, hubUrl);
      await saveAsync(hubSlices);
      resetChanges();
      toast({ title: `Slices pulled from "${envName}" successfully` });
    } catch (error) {
      toast({
        title: "Failed to pull slices",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsPulling(false);
    }
  };

  const handlePushToHub = async (
    envName: string,
    address: string,
    hubUrl: string
  ) => {
    setIsPushing(true);
    try {
      const hubSlices = await getHubSlices(address, locale, hubUrl);
      const hubByName = new Map(hubSlices.map((s) => [s.name, s]));
      const localByName = new Map(slices.map((s) => [s.name, s]));

      for (const slice of slices) {
        const { id, updatedAt, createdAt, ...body } = slice;
        if (hubByName.has(slice.name)) {
          await updateOverviewSlice(address, slice.name, body, locale, hubUrl);
        } else {
          await createOverviewSlice(address, body, locale, hubUrl);
        }
      }

      for (const hubSlice of hubSlices) {
        if (!localByName.has(hubSlice.name)) {
          await deleteOverviewSlice(address, hubSlice.name, locale, hubUrl);
        }
      }

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
    } finally {
      setIsPushing(false);
    }
  };

  const pullableEnvs = environments
    ? Object.entries(environments).filter(
        ([, env]) => env.hubUrl && env.address
      )
    : [];

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
          {pullableEnvs.length > 0 && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={isPulling}>
                    <Download />
                    Pull from Hub
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {pullableEnvs.map(([name, env]) => (
                    <DropdownMenuItem
                      key={name}
                      onClick={() =>
                        handlePullFromHub(name, env.address, env.hubUrl!)
                      }
                    >
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" disabled={isPushing}>
                    <Export />
                    Push to Hub
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {pullableEnvs.map(([name, env]) => (
                    <DropdownMenuItem
                      key={name}
                      onClick={() =>
                        handlePushToHub(name, env.address, env.hubUrl!)
                      }
                    >
                      {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <Button
            onClick={handleSaveChanges}
            disabled={isDirty}
            loading={saving}
          >
            Save Local
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
