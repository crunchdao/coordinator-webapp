import axios from "axios";

/**
 * Node API client that proxies through /api/node-proxy to avoid CORS.
 * All requests go: browser → Next.js server → coordinator node.
 */
const nodeClient = {
  async get(url: string, config?: { params?: Record<string, unknown> }) {
    // Parse nodeUrl + path from the full URL
    const parsed = new URL(url);
    const nodeUrl = parsed.origin;
    let path = parsed.pathname;
    if (config?.params) {
      const searchParams = new URLSearchParams();
      for (const [k, v] of Object.entries(config.params)) {
        if (v !== undefined && v !== null) searchParams.set(k, String(v));
      }
      const qs = searchParams.toString();
      if (qs) path += `?${qs}`;
    }

    const response = await axios.post("/api/node-proxy", {
      nodeUrl,
      path,
      method: "GET",
    });
    return response;
  },

  async post(url: string, body?: unknown) {
    const parsed = new URL(url);
    return axios.post("/api/node-proxy", {
      nodeUrl: parsed.origin,
      path: parsed.pathname,
      method: "POST",
      body,
    });
  },

  async patch(url: string, body?: unknown) {
    const parsed = new URL(url);
    return axios.post("/api/node-proxy", {
      nodeUrl: parsed.origin,
      path: parsed.pathname,
      method: "PATCH",
      body,
    });
  },
};

export default nodeClient;
