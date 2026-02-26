import { useState, useEffect, useCallback, useMemo } from "react";
import type { Slice } from "@crunchdao/slices";

interface SliceChanges {
  toCreate: Slice[];
  toUpdate: { slice: Slice; originalName: string }[];
  toDelete: Slice[];
}

export const useLocalSlices = (serverSlices: Slice[] | undefined) => {
  const [localSlices, setLocalSlices] = useState<Slice[]>([]);
  const [originalSlices, setOriginalSlices] = useState<Slice[]>([]);

  useEffect(() => {
    if (serverSlices) {
      setLocalSlices(serverSlices);
      setOriginalSlices(serverSlices);
    }
  }, [serverSlices]);

  const handleCreate = useCallback((slice: Omit<Slice, "id">) => {
    const newSlice = { ...slice, id: Date.now() } as Slice;
    setLocalSlices((prev) => [...prev, newSlice]);
  }, []);

  const handleUpdate = useCallback((slice: Slice, originalName: string) => {
    setLocalSlices((prev) =>
      prev.map((s) => (s.name === originalName ? slice : s))
    );
  }, []);

  const handleDelete = useCallback((slice: Slice) => {
    setLocalSlices((prev) => prev.filter((s) => s.id !== slice.id));
  }, []);

  const getChanges = useCallback((): SliceChanges => {
    const toCreate = localSlices.filter(
      (local) => !originalSlices.find((original) => original.id === local.id)
    );

    const toDelete = originalSlices.filter(
      (original) => !localSlices.find((local) => local.id === original.id)
    );

    const toUpdate: { slice: Slice; originalName: string }[] = [];
    for (const local of localSlices) {
      const original = originalSlices.find((o) => o.id === local.id);
      if (original && JSON.stringify(original) !== JSON.stringify(local)) {
        toUpdate.push({ slice: local, originalName: original.name });
      }
    }

    return { toCreate, toUpdate, toDelete };
  }, [localSlices, originalSlices]);

  const isDirty = useMemo(() => {
    const { toCreate, toUpdate, toDelete } = getChanges();
    return toCreate.length > 0 || toUpdate.length > 0 || toDelete.length > 0;
  }, [getChanges]);

  const resetChanges = useCallback(() => {
    setLocalSlices(originalSlices);
  }, [originalSlices]);

  const markAsSaved = useCallback(() => {
    setOriginalSlices(localSlices);
  }, [localSlices]);

  return {
    slices: localSlices,
    isDirty,
    handleCreate,
    handleUpdate,
    handleDelete,
    getChanges,
    resetChanges,
    markAsSaved,
  };
};
