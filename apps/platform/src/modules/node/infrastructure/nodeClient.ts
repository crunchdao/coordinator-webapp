import axios from "axios";

/**
 * Axios instance for coordinator node API calls.
 * The baseURL is set per-request by the caller (from nodeConfig).
 */
const nodeClient = axios.create({
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default nodeClient;
