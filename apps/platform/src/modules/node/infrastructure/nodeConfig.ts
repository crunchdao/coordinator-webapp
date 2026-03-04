"use client";

const STORAGE_KEY_PREFIX = "coordinator-node-url:";
const DEFAULT_NODE_URL = "http://localhost:8000";

/**
 * Get the configured coordinator node URL for a specific crunch.
 */
export function getNodeUrl(crunchName: string): string {
  if (typeof window === "undefined") return DEFAULT_NODE_URL;
  return localStorage.getItem(STORAGE_KEY_PREFIX + crunchName) || DEFAULT_NODE_URL;
}

/**
 * Set the coordinator node URL for a specific crunch.
 */
export function setNodeUrl(crunchName: string, url: string): void {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (trimmed) {
    localStorage.setItem(STORAGE_KEY_PREFIX + crunchName, trimmed);
  } else {
    localStorage.removeItem(STORAGE_KEY_PREFIX + crunchName);
  }
}
