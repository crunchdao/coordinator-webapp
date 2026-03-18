export const organizerEndpoints = {
  getOrganizers: () => `/v1/organizers`,
  getOrganizer: (organizerIdentifier: string) =>
    `/v1/organizers/${organizerIdentifier}`,
  updateOrganizer: (organizerIdentifier: string) =>
    `/v1/organizers/${organizerIdentifier}`,
  getMembers: (organizerIdentifier: string) =>
    `/v1/organizers/${organizerIdentifier}/members`,
  addMember: (organizerIdentifier: string) =>
    `/v1/organizers/${organizerIdentifier}/members`,
  getMember: (organizerIdentifier: string, userLogin: string) =>
    `/v1/organizers/${organizerIdentifier}/members/${userLogin}`,
  deleteMember: (organizerIdentifier: string, userLogin: string) =>
    `/v1/organizers/${organizerIdentifier}/members/${userLogin}`,
  updateMember: (organizerIdentifier: string, userLogin: string) =>
    `/v1/organizers/${organizerIdentifier}/members/${userLogin}`,
};
