import hubApiClient from "@/utils/api/hubApiClient";
import { UpdateCompetitionFormData } from "../application/schemas/updateCompetition";
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

export const updateCompetition = async (
  competitionIdentifier: string,
  data: UpdateCompetitionFormData
): Promise<Competition> => {
  const response = await hubApiClient.patch(
    competitionEndpoints.updateCompetition(competitionIdentifier),
    data
  );
  return response.data;
};
