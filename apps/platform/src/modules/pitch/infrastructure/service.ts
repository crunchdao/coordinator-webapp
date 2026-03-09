import hubApiClient from "@/utils/api/hubApiClient";
import { PaginatedResponse } from "@/modules/common/domain/pagination";
import {
  Pitch,
  PitchSlicesListResponse,
  PitchSlice,
  CreatePitchSliceBody,
  UpdatePitchSliceBody,
  Locale,
} from "../domain/types";
import { pitchEndpoints } from "./endpoints";

export const getPitches = async (
  seasonNumber: number,
  hubBaseUrl?: string
): Promise<PaginatedResponse<Pitch>> => {
  const response = await hubApiClient.get(
    pitchEndpoints.pitches(seasonNumber),
    {
      ...(hubBaseUrl && { baseURL: hubBaseUrl }),
    }
  );
  return response.data;
};

export const getPitch = async (
  seasonNumber: number,
  pitchName: string,
  hubBaseUrl?: string
): Promise<Pitch> => {
  const response = await hubApiClient.get(
    pitchEndpoints.pitch(seasonNumber, pitchName),
    {
      ...(hubBaseUrl && { baseURL: hubBaseUrl }),
    }
  );
  return response.data;
};

export const getPitchSlices = async (
  seasonNumber: number,
  competitionIdentifier: string,
  locale?: Locale,
  hubBaseUrl?: string
): Promise<PitchSlicesListResponse> => {
  const response = await hubApiClient.get(
    pitchEndpoints.slices(seasonNumber, competitionIdentifier),
    {
      params: { locale },
      ...(hubBaseUrl && { baseURL: hubBaseUrl }),
    }
  );
  return response.data;
};

export const createPitchSlice = async (
  seasonNumber: number,
  competitionIdentifier: string,
  body: CreatePitchSliceBody,
  locale?: Locale,
  hubBaseUrl?: string
): Promise<PitchSlice> => {
  const response = await hubApiClient.post(
    pitchEndpoints.slices(seasonNumber, competitionIdentifier),
    body,
    {
      params: { locale },
      ...(hubBaseUrl && { baseURL: hubBaseUrl }),
    }
  );
  return response.data;
};

export const updatePitchSlice = async (
  seasonNumber: number,
  competitionIdentifier: string,
  sliceName: string,
  body: UpdatePitchSliceBody,
  locale?: Locale,
  hubBaseUrl?: string
): Promise<PitchSlice> => {
  const response = await hubApiClient.patch(
    pitchEndpoints.slice(seasonNumber, competitionIdentifier, sliceName),
    body,
    {
      params: { locale },
      ...(hubBaseUrl && { baseURL: hubBaseUrl }),
    }
  );
  return response.data;
};

export const deletePitchSlice = async (
  seasonNumber: number,
  competitionIdentifier: string,
  sliceName: string,
  locale?: Locale,
  hubBaseUrl?: string
): Promise<void> => {
  await hubApiClient.delete(
    pitchEndpoints.slice(seasonNumber, competitionIdentifier, sliceName),
    {
      params: { locale },
      ...(hubBaseUrl && { baseURL: hubBaseUrl }),
    }
  );
};
