import axios from "axios";

/**
 * Axios instance for coordinator node API calls.
 * Each call passes the full URL (nodeUrl + path) directly.
 */
const nodeClient = axios.create({
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default nodeClient;
