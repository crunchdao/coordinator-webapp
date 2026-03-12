import { PaginatedRequestParams } from "@/modules/common/domain/pagination";
import {
  GetOrganizerMemberResponse,
  GetOrganizerMembersResponse,
  GetOrganizersParams,
  GetOrganizersResponse,
  Organizer,
  OrganizerMemberCreateForm,
  OrganizerMemberUpdateForm,
  OrganizerUpdateForm,
} from "../domain/types";
import { organizerEndpoints } from "./endpoints";
import hubApiClient from "@/utils/api/hubApiClient";

export const getOrganizers = async (
  params: GetOrganizersParams
): Promise<GetOrganizersResponse> => {
  const response = await hubApiClient.get(organizerEndpoints.getOrganizers(), {
    params,
  });
  return response.data;
};

export const getOrganizer = async (
  organizerIdentifier: string
): Promise<Organizer> => {
  const response = await hubApiClient.get(
    organizerEndpoints.getOrganizer(organizerIdentifier)
  );
  return response.data;
};

export const updateOrganizer = async (
  organizerIdentifier: string,
  payload: OrganizerUpdateForm
): Promise<Organizer> => {
  const response = await hubApiClient.patch(
    organizerEndpoints.updateOrganizer(organizerIdentifier),
    payload
  );
  return response.data;
};

export const getOrganizerMembers = async (
  organizerIdentifier: string,
  params: PaginatedRequestParams
): Promise<GetOrganizerMembersResponse> => {
  const response = await hubApiClient.get(
    organizerEndpoints.getMembers(organizerIdentifier),
    { params }
  );
  return response.data;
};

export const getOrganizerMember = async (
  organizerIdentifier: string,
  userLogin: string
): Promise<GetOrganizerMemberResponse> => {
  const response = await hubApiClient.get(
    organizerEndpoints.getMember(organizerIdentifier, userLogin)
  );
  return response.data;
};

export const addOrganizerMember = async (
  organizerIdentifier: string,
  payload: OrganizerMemberCreateForm
): Promise<GetOrganizerMemberResponse> => {
  const response = await hubApiClient.post(
    organizerEndpoints.addMember(organizerIdentifier),
    payload
  );
  return response.data;
};

export const deleteOrganizerMember = async (
  organizerIdentifier: string,
  userLogin: string
): Promise<void> => {
  await hubApiClient.delete(
    organizerEndpoints.deleteMember(organizerIdentifier, userLogin)
  );
};

export const updateOrganizerMember = async (
  organizerIdentifier: string,
  userLogin: string,
  payload: OrganizerMemberUpdateForm
): Promise<GetOrganizerMemberResponse> => {
  const response = await hubApiClient.patch(
    organizerEndpoints.updateMember(organizerIdentifier, userLogin),
    payload
  );
  return response.data;
};
