export const HUB_TOKEN_COOKIE = "hub-access-token";

export interface HubUser {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
}
