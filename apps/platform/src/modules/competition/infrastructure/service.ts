import hubApiClient from "@/utils/api/hubApiClient";
import { hubRequestConfig } from "@/utils/api/hubRequestConfig";
import type { Environment } from "@/config";
import { UpdateCompetitionFormData } from "../application/schemas/updateCompetition";
import { Competition } from "../domain/types";
import { competitionEndpoints } from "./endpoints";

export const getCompetition = async (
  competitionIdentifier: string,
  hubBaseUrl?: string,
  hubEnv?: Environment
): Promise<Competition> => {
  const config =
    hubBaseUrl && hubEnv ? hubRequestConfig(hubBaseUrl, hubEnv) : {};
  const response = await hubApiClient.get(
    competitionEndpoints.getCompetition(competitionIdentifier),
    config
  );
  return response.data;
};

export const updateCompetition = async (
  competitionIdentifier: string,
  data: UpdateCompetitionFormData,
  hubBaseUrl?: string,
  hubEnv?: Environment
): Promise<Competition> => {
  const config =
    hubBaseUrl && hubEnv ? hubRequestConfig(hubBaseUrl, hubEnv) : {};
  const response = await hubApiClient.patch(
    competitionEndpoints.updateCompetition(competitionIdentifier),
    data,
    config
  );
  return response.data;
};
