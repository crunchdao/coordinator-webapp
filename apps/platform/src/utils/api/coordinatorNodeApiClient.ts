"use client";

import axios from "axios";

const DEFAULT_BASE_URL = "/api/coordinator-node";

const coordinatorNodeApiClient = axios.create({
  timeout: 15000,
  baseURL: DEFAULT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

coordinatorNodeApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message) {
      error.message = `Coordinator Node Error (${error.response?.status}): ${
        error.config?.method
      } ${error.config?.url} - ${
        error.response?.data?.message || "Unknown error"
      }`;
    }
    return Promise.reject(error);
  }
);

export default coordinatorNodeApiClient;
