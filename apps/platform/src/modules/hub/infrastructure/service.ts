import hubApiClient from "@/utils/api/hubApiClient";
import { HubUser } from "../domain/types";
import { hubEndpoints } from "./endpoints";

export const getHubMe = async (): Promise<HubUser> => {
  const response = await hubApiClient.get(hubEndpoints.me());
  return response.data;
};

export const getUsersMapping = async (): Promise<Record<string, string>> => {
  const response = await hubApiClient.get(hubEndpoints.usersMapping());
  return response.data;
};
