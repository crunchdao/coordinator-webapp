export const HUB_TOKEN_COOKIE = "hub-access-token";

export interface HubUser {
  id: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
}
