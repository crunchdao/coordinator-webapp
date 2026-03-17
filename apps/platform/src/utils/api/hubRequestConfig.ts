import type { AxiosRequestConfig } from "axios";
import type { Environment } from "@/config";
import { getHubToken } from "@/modules/hub/domain/types";

export function hubRequestConfig(
  hubBaseUrl: string,
  hubEnv: Environment,
  extra?: AxiosRequestConfig
): AxiosRequestConfig {
  const token = getHubToken(hubEnv);
  return {
    ...extra,
    baseURL: hubBaseUrl,
    ...(token && {
      headers: { ...extra?.headers, Authorization: `Bearer ${token}` },
    }),
  };
}
