"use client";
import axios from "axios";

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
    if (error.message) {
      error.message = `API Error (${error.response?.status}): ${
        error.config?.method
      } ${error.config?.url} - ${
        error.response?.data?.message || "Unknown error"
      }`;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
