"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { showApiErrorToast } from "@coordinator/utils/src/api";
import { readConfigFile, writeConfigFile } from "../../infrastructure/service";

interface UseConfigFileOptions<T> {
  defaultValue?: T;
  enabled?: boolean;
}

export function useConfigFile<T>(
  path: string,
  options?: UseConfigFileOptions<T>
) {
  const query = useQuery({
    queryKey: ["configFile", path],
    queryFn: async () => {
      try {
        return await readConfigFile<T>(path);
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status === 404 && options?.defaultValue !== undefined) {
          return options.defaultValue;
        }
        throw error;
      }
    },
    enabled: options?.enabled ?? !!path,
    retry: false,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

interface UseSaveConfigFileOptions {
  successMessage?: string;
  errorMessage?: string;
}

export function useSaveConfigFile<T>(
  path: string,
  options?: UseSaveConfigFileOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: T) => {
      await writeConfigFile<T>(path, data);
      await queryClient.invalidateQueries({
        queryKey: ["configFile", path],
      });
    },
    onSuccess: () => {
      toast({ title: options?.successMessage ?? "Saved successfully" });
    },
    onError: (error) => {
      showApiErrorToast(
        error,
        options?.errorMessage ?? "Failed to save"
      );
    },
  });

  return {
    save: mutation.mutate,
    saveAsync: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}
