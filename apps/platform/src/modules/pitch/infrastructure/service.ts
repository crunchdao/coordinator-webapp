import hubApiClient from "@/utils/api/hubApiClient";
import {
  PitchSlicesListResponse,
  PitchSlice,
  CreatePitchSliceBody,
  UpdatePitchSliceBody,
  Locale,
} from "../domain/types";
import { pitchEndpoints } from "./endpoints";

export const getPitchSlices = async (
  seasonNumber: number,
  crunchAddress: string,
  locale?: Locale
): Promise<PitchSlicesListResponse> => {
  const response = await hubApiClient.get(
    pitchEndpoints.slices(seasonNumber, crunchAddress),
    { params: { locale } }
  );
  return response.data;
};

export const createPitchSlice = async (
  seasonNumber: number,
  crunchAddress: string,
  body: CreatePitchSliceBody,
  locale?: Locale
): Promise<PitchSlice> => {
  const response = await hubApiClient.post(
    pitchEndpoints.slices(seasonNumber, crunchAddress),
    body,
    { params: { locale } }
  );
  return response.data;
};

export const updatePitchSlice = async (
  seasonNumber: number,
  crunchAddress: string,
  sliceName: string,
  body: UpdatePitchSliceBody,
  locale?: Locale
): Promise<PitchSlice> => {
  const response = await hubApiClient.patch(
    pitchEndpoints.slice(seasonNumber, crunchAddress, sliceName),
    body,
    { params: { locale } }
  );
  return response.data;
};

export const deletePitchSlice = async (
  seasonNumber: number,
  crunchAddress: string,
  sliceName: string,
  locale?: Locale
): Promise<void> => {
  await hubApiClient.delete(
    pitchEndpoints.slice(seasonNumber, crunchAddress, sliceName),
    { params: { locale } }
  );
};
