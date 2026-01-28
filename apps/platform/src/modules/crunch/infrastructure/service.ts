import apiClient from "@coordinator/utils/src/api";
import {
  GetOrganizerApplicationResponse,
  OrganizerApplicationPayload,
  UpdateOrganizerApplicationPayload,
} from "../domain/types";

export const organizerEndpoints = {
  postApplications: (reCaptchaResponse: string) =>
    `/v1/organizer-applications?reCaptchaResponse=${reCaptchaResponse}`,
  getApplications: () => `/v1/organizer-applications`,
  getApplication: (id: number | string) => `/v1/organizer-applications/${id}`,
  updateApplication: (id: number | string) =>
    `/v1/organizer-applications/${id}`,
};

export const getOrganizerApplication = async (
  id: number | string
): Promise<GetOrganizerApplicationResponse> => {
  const response = await apiClient.get(organizerEndpoints.getApplication(id));
  return response.data;
};

export const createOrganizerApplication = async (
  payload: OrganizerApplicationPayload,
  reCaptchaResponse: string
): Promise<void> => {
  const response = await apiClient.post(
    organizerEndpoints.postApplications(reCaptchaResponse),
    payload
  );
  return response.data;
};

export const updateOrganizerApplication = async (
  applicationId: number | string,
  payload: UpdateOrganizerApplicationPayload
): Promise<void> => {
  const response = await apiClient.patch(
    organizerEndpoints.updateApplication(applicationId),
    payload
  );

  return response.data;
};
