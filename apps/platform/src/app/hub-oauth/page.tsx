"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Spinner } from "@crunch-ui/core";
import { INTERNAL_LINKS } from "@/utils/routes";
import { HUB_TOKEN_COOKIE } from "@/modules/hub/domain/types";

const isValidRedirectPath = (path: string | null): path is string => {
  if (!path) return false;
  return path.startsWith("/") && !path.startsWith("//");
};

export default function HubOAuthPage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const state = params.get("state");

      if (accessToken) {
        Cookies.set(HUB_TOKEN_COOKIE, accessToken, {
          sameSite: "strict",
          secure: window.location.protocol === "https:",
          path: "/",
          expires: 1,
        });

        const redirectTo = isValidRedirectPath(state)
          ? state
          : INTERNAL_LINKS.DASHBOARD;
        router.replace(redirectTo);
        return;
      }
    }

    router.replace(INTERNAL_LINKS.DASHBOARD);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
}
