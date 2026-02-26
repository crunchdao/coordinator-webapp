"use client";

import { useState } from "react";
import { Button, Card, Spinner, toast } from "@crunch-ui/core";
import { SliceManager, type Slice } from "@crunchdao/slices";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { Locale } from "../domain/types";
import { useGetOverviewSlices } from "../application/hooks/useGetOverviewSlices";
import { useCreateOverviewSlice } from "../application/hooks/useCreateOverviewSlice";
import { useUpdateOverviewSlice } from "../application/hooks/useUpdateOverviewSlice";
import { useDeleteOverviewSlice } from "../application/hooks/useDeleteOverviewSlice";
import { useLocalSlices } from "../application/hooks/useLocalSlices";
import { OverviewSliceHeader } from "./overviewSliceHeader";

export const OverviewSlicesView: React.FC = () => {
  const { crunchData, isLoading: crunchLoading } = useCrunchContext();
  const crunchAddress = crunchData?.address;

  const [locale, setLocale] = useState<Locale>(Locale.ENGLISH);
  const [isSaving, setIsSaving] = useState(false);

  const { slices: serverSlices, slicesLoading } = useGetOverviewSlices(
    crunchAddress,
    locale
  );

  const {
    slices,
    isDirty,
    handleCreate,
    handleUpdate,
    handleDelete,
    getChanges,
    resetChanges,
    markAsSaved,
  } = useLocalSlices(serverSlices);

  const { createSliceAsync } = useCreateOverviewSlice(
    crunchAddress || "",
    locale
  );
  const { updateSliceAsync } = useUpdateOverviewSlice(
    crunchAddress || "",
    locale
  );
  const { deleteSlice } = useDeleteOverviewSlice(crunchAddress || "", locale);

  const handleSaveChanges = async () => {
    const { toCreate, toUpdate, toDelete } = getChanges();

    if (
      toCreate.length === 0 &&
      toUpdate.length === 0 &&
      toDelete.length === 0
    ) {
      return;
    }

    setIsSaving(true);

    try {
      for (const slice of toDelete) {
        await deleteSlice(slice.name);
      }

      for (const { slice, originalName } of toUpdate) {
        await updateSliceAsync({
          sliceName: originalName,
          body: {
            name: slice.name,
            displayName: slice.displayName || "",
            type: slice.type,
            nativeConfiguration: slice.nativeConfiguration as unknown as Record<
              string,
              unknown
            >,
            order: slice.order,
          },
          locale,
        });
      }

      for (const slice of toCreate) {
        await createSliceAsync({
          name: slice.name,
          displayName: slice.displayName || "",
          type: slice.type,
          nativeConfiguration: slice.nativeConfiguration as unknown as Record<
            string,
            unknown
          >,
          order: slice.order,
        });
      }

      markAsSaved();
      toast({
        title: "Changes saved successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to save changes",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (crunchLoading || slicesLoading) {
    return <Spinner className="mx-auto" />;
  }

  return (
    <Card className="p-8">
      <OverviewSliceHeader locale={locale} setLocale={setLocale} />
      <SliceManager
        slices={slices}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        saving={isSaving}
      />
      {isDirty && (
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={resetChanges} disabled={isSaving}>
            Reset
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            Save Changes
          </Button>
        </div>
      )}
    </Card>
  );
};
