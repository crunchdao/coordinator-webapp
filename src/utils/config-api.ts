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
    if (error.message) {
      error.message = `Config API Error (${error.response?.status}): ${
        error.config?.method
      } ${error.config?.url} - ${
        error.response?.data?.message || "Unknown error"
      }`;
    }

    if (typeof window !== "undefined") {
      toast?.({
        title: "Oops!",
        description:
          error?.response?.data?.message ||
          "An error occurred. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }

    return Promise.reject(error);
  }
);

export default configApiClient;