"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardContent, Spinner, toast } from "@crunch-ui/core";
import {
  SliceManager,
  useSlicesBatch,
  type CreateSliceData,
  type UpdateSliceData,
} from "@crunchdao/slices";
import { Download } from "@crunch-ui/icons";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { Locale } from "../domain/types";
import { useGetOverviewSlices } from "../application/hooks/useGetOverviewSlices";
import { useCreateOverviewSlice } from "../application/hooks/useCreateOverviewSlice";
import { useUpdateOverviewSlice } from "../application/hooks/useUpdateOverviewSlice";
import { useDeleteOverviewSlice } from "../application/hooks/useDeleteOverviewSlice";
import { OverviewSliceHeader } from "./overviewSliceHeader";

export const OverviewSlicesView: React.FC = () => {
  const queryClient = useQueryClient();
  const { crunchData, isLoading: crunchLoading } = useCrunchContext();
  const crunchAddress = crunchData?.address;

  const [locale, setLocale] = useState<Locale>(Locale.ENGLISH);

  const { slices: serverSlices, slicesLoading } = useGetOverviewSlices(
    crunchAddress,
    locale
  );

  const { createSliceAsync } = useCreateOverviewSlice(
    crunchAddress || "",
    locale
  );
  const { updateSliceAsync } = useUpdateOverviewSlice(
    crunchAddress || "",
    locale
  );
  const { deleteSlice } = useDeleteOverviewSlice(crunchAddress || "", locale);

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
      queryKey: ["overviewSlices", crunchAddress],
    });
    toast({ title: "Changes saved successfully" });
  }, [queryClient, crunchAddress]);

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
    a.download = `overview-${crunchData?.name || "slices"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (crunchLoading || slicesLoading) {
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
      </CardContent>
    </Card>
  );
};
