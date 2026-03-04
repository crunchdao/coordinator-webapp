"use client";
import axios from "axios";
import { toast } from "@crunch-ui/core";

const configApiClient = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

configApiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Enrich the error message for logging/debugging — but never show a toast.
    // Callers (mutation hooks) should handle their own user-facing error UI.
    if (error.message) {
      error.message = `Config API Error (${error.response?.status}): ${
        error.config?.method
      } ${error.config?.url} - ${
        error.response?.data?.message || "Unknown error"
      }`;
    }

    if (typeof window !== "undefined") {
      console.error(error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Show a destructive toast for a config API error.
 * Use this in mutation `onError` handlers for user-initiated actions.
 */
export function showConfigApiErrorToast(
  error: unknown,
  fallbackTitle = "Something went wrong"
) {
  const axiosError = error as any;
  const description =
    axiosError?.response?.data?.message || fallbackTitle;

  toast?.({
    title: fallbackTitle,
    description,
    variant: "destructive",
    duration: 5000,
  });
}

export default configApiClient;
