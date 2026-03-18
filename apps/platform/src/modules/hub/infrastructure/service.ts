import type { Environment } from "@/config";
import hubApiClient from "@/utils/api/hubApiClient";
import { HubUser, getHubToken } from "../domain/types";
import { hubEndpoints } from "./endpoints";

export const getHubMe = async (env: Environment): Promise<HubUser> => {
  const baseURL = env === "production" ? "/hub-prod" : "/hub-staging";
  const token = getHubToken(env);
  const response = await hubApiClient.get(hubEndpoints.me(), {
    baseURL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};

export const getUsersMapping = async (): Promise<Record<string, string>> => {
  const response = await hubApiClient.get(hubEndpoints.usersMapping());
  return response.data;
};
