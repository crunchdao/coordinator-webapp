import Cookies from "js-cookie";
import type { Environment } from "@/config";

export function getHubToken(env: Environment): string | undefined {
  return Cookies.get(`hub-access-token-${env}`);
}

export function setHubToken(env: Environment, token: string): void {
  Cookies.set(`hub-access-token-${env}`, token, {
    sameSite: "strict",
    secure:
      typeof window !== "undefined" && window.location.protocol === "https:",
    path: "/",
    expires: 1,
  });
}

export function removeHubToken(env: Environment): void {
  Cookies.remove(`hub-access-token-${env}`);
}

export interface HubUser {
  id: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
}
