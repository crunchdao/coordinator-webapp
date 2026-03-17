"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@crunch-ui/core";
import { INTERNAL_LINKS } from "@/utils/routes";
import { setHubToken } from "@/modules/hub/domain/types";
import { getEnvironment, isValidEnvironment } from "@/config";

const isValidRedirectPath = (path: string | null): path is string => {
  if (!path) return false;
  return path.startsWith("/") && !path.startsWith("//");
};

export default function HubOAuthPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash.includes("access_token")) {
      router.replace(INTERNAL_LINKS.ONCHAIN_EXPLORER);
      return;
    }

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get("access_token");
    const state = params.get("state") ?? "";

    const separatorIndex = state.indexOf("|");
    const rawEnv =
      separatorIndex > 0 ? state.substring(0, separatorIndex) : null;
    const env = isValidEnvironment(rawEnv) ? rawEnv : getEnvironment();
    const returnUrl =
      separatorIndex > 0 ? state.substring(separatorIndex + 1) : state;

    if (accessToken) {
      setHubToken(env, accessToken);
    }

    const redirectTo = isValidRedirectPath(returnUrl)
      ? returnUrl
      : INTERNAL_LINKS.ONCHAIN_EXPLORER;
    router.replace(redirectTo);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
}
