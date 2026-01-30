"use client";
import axios from "axios";
import { toast } from "@crunch-ui/core";

const IGNORED_ERROR_CODES: string[] = [];

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
    const errorCode = error?.response?.data.code;

    if (error.message) {
      error.message = `API Error (${error.response?.status}): ${
        error.config?.method
      } ${error.config?.url} - ${
        error.response?.data?.message || "Unknown error"
      }`;
    }

    if (errorCode && IGNORED_ERROR_CODES.includes(errorCode)) {
      return Promise.reject(error);
    }

    if (typeof window !== "undefined") {
      const fieldErrors = error?.response?.data?.fieldErrors;
      let description =
        error?.response?.data?.message ||
        "An error occurred. Please try again.";

      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        description = fieldErrors
          .map(
            (fieldError: { property: string; message: string }) =>
              `${fieldError.property} ${fieldError.message}`
          )
          .join(", ");
      }

      toast?.({
        title: "Oops!",
        description: description,
        variant: "destructive",
        duration: 5000,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
