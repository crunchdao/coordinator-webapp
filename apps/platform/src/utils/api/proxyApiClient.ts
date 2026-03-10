"use client";

import axios from "axios";
import { toast } from "@crunch-ui/core";

const proxyApiClient = axios.create({
  baseURL: "/api/proxy",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

proxyApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const description =
        error?.response?.data?.error ||
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

/**
 * Fetch a remote URL through the Next.js proxy to bypass CORS.
 */
export async function proxyGet<T>(url: string): Promise<T> {
  const response = await proxyApiClient.get("", { params: { url } });
  return response.data;
}

export default proxyApiClient;
