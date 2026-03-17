"use client";

import axios from "axios";
import { toast } from "@crunch-ui/core";
import { getConfig, getEnvironment } from "@/config";
import { getHubToken } from "@/modules/hub/domain/types";

const hubApiClient = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

hubApiClient.interceptors.request.use((config) => {
  if (!config.baseURL) {
    const env = getConfig().env;
    config.baseURL = env === "production" ? "/hub-prod" : "/hub-staging";
  }

  // If Authorization is already set (e.g. by hub sync services), don't override
  if (!config.headers.Authorization) {
    const token = getHubToken(getEnvironment());
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

hubApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message) {
      error.message = `Hub API Error (${error.response?.status}): ${
        error.config?.method
      } ${error.config?.url} - ${
        error.response?.data?.message || "Unknown error"
      }`;
    }

    const status = error.response?.status;
    if (status === 404) {
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
        description,
        variant: "destructive",
        duration: 5000,
      });
    }

    return Promise.reject(error);
  }
);

export default hubApiClient;
