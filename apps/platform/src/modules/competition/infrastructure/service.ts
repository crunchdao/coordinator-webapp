import hubApiClient from "@/utils/api/hubApiClient";
import { UpdateCompetitionFormData } from "../application/schemas/updateCompetition";
import { Competition } from "../domain/types";
import { competitionEndpoints } from "./endpoints";

export const getCompetition = async (
  competitionIdentifier: string,
  hubBaseUrl?: string
): Promise<Competition> => {
  const response = await hubApiClient.get(
    competitionEndpoints.getCompetition(competitionIdentifier),
    { ...(hubBaseUrl && { baseURL: hubBaseUrl }) }
  );
  return response.data;
};

export const updateCompetition = async (
  competitionIdentifier: string,
  data: UpdateCompetitionFormData,
  hubBaseUrl?: string
): Promise<Competition> => {
  const response = await hubApiClient.patch(
    competitionEndpoints.updateCompetition(competitionIdentifier),
    data,
    { ...(hubBaseUrl && { baseURL: hubBaseUrl }) }
  );
  return response.data;
};
