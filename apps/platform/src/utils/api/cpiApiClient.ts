"use client";

import axios from "axios";
import { toast } from "@crunch-ui/core";
import { getConfig } from "@/config";

const cpiApiClient = axios.create({
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

cpiApiClient.interceptors.request.use((config) => {
  const env = getConfig().env;
  config.baseURL = env === "production" ? "/cpi-prod" : "/cpi-staging";
  return config;
});

cpiApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message) {
      error.message = `CPI API Error (${error.response?.status}): ${
        error.config?.method
      } ${error.config?.url} - ${
        error.response?.data?.message || "Unknown error"
      }`;
    }

    if (typeof window !== "undefined") {
      const description =
        error?.response?.data?.message ||
        "An error occurred. Please try again.";

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

export default cpiApiClient;
