"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, Spinner } from "@crunch-ui/core";
import { SliceManager, type Slice } from "@crunchdao/slices";
import { Locale } from "../domain/types";
import { useGetOverviewSlices } from "../application/hooks/useGetOverviewSlices";
import { useCreateOverviewSlice } from "../application/hooks/useCreateOverviewSlice";
import { useUpdateOverviewSlice } from "../application/hooks/useUpdateOverviewSlice";
import { useDeleteOverviewSlice } from "../application/hooks/useDeleteOverviewSlice";
import { OverviewSliceHeader } from "./overviewSliceHeader";

export const OverviewSlicesView: React.FC = () => {
  const params = useParams<{ crunchname: string }>();
  const crunchName = params.crunchname;

  const [locale, setLocale] = useState<Locale>(Locale.ENGLISH);

  const { slices, slicesLoading } = useGetOverviewSlices(crunchName, locale);

  const { createSliceAsync, isCreating } = useCreateOverviewSlice(
    crunchName,
    locale
  );
  const { updateSliceAsync, isUpdating } = useUpdateOverviewSlice(
    crunchName,
    locale
  );
  const { deleteSlice, isDeleting } = useDeleteOverviewSlice(
    crunchName,
    locale
  );

  const isSaving = isCreating || isUpdating || isDeleting;

  const handleCreate = async (slice: Omit<Slice, "id">) => {
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
  };

  const handleUpdate = async (slice: Slice, originalName: string) => {
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
  };

  const handleDelete = async (slice: Slice) => {
    await deleteSlice(slice.name);
  };

  if (slicesLoading) {
    return <Spinner className="mx-auto" />;
  }

  return (
    <Card className="p-8">
      <OverviewSliceHeader locale={locale} setLocale={setLocale} />
      <SliceManager
        slices={slices || []}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        saving={isSaving}
      />
    </Card>
  );
};
