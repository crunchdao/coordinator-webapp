import hubApiClient from "@/utils/api/hubApiClient";
import { GetSeasonResponse, GetSeasonsResponse } from "../domain/types";
import { seasonEndpoints } from "./endpoints";

export const getSeasons = async (): Promise<GetSeasonsResponse> => {
  const response = await hubApiClient.get(seasonEndpoints.getSeasons(), {});
  return response.data;
};

export const getSeason = async (
  seasonNumber: number | string
): Promise<GetSeasonResponse> => {
  const response = await hubApiClient.get(
    seasonEndpoints.getSeason(seasonNumber),
    {}
  );
  return response.data;
};
