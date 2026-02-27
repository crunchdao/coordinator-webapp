import hubApiClient from "@/utils/api/hubApiClient";
import { Competition } from "../domain/types";
import { competitionEndpoints } from "./endpoints";

export const getCompetition = async (
  crunchAddress: string
): Promise<Competition> => {
  const response = await hubApiClient.get(
    competitionEndpoints.getCompetition(crunchAddress)
  );
  return response.data;
};
