"use client";
import axios from "axios";
import { toast } from "@crunch-ui/core";

const apiClient = axios.create({
  timeout: 15000,
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Enrich the error message for logging/debugging — but never show a toast.
    // Callers (mutation hooks) should handle their own user-facing error UI.
    if (error.message) {
      error.message = `API Error (${error.response?.status}): ${
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
 * Show a destructive toast for an API error.
 * Use this in mutation `onError` handlers for user-initiated actions.
 * Do NOT use for background polling queries — those should fail silently
 * or show inline staleness indicators.
 */
export function showApiErrorToast(
  error: unknown,
  fallbackTitle = "Something went wrong"
) {
  const axiosError = error as any;
  const fieldErrors = axiosError?.response?.data?.fieldErrors;
  let description =
    axiosError?.response?.data?.message || fallbackTitle;

  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    description = fieldErrors
      .map(
        (fieldError: { property: string; message: string }) =>
          `${fieldError.property}: ${fieldError.message}`
      )
      .join(", ");
  }

  toast?.({
    title: fallbackTitle,
    description,
    variant: "destructive",
    duration: 5000,
  });
}

export default apiClient;
