"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { INTERNAL_LINKS } from "@/utils/routes";

const HUB_TOKEN_COOKIE = "hub-access-token";

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
          expires: 1,
        });

        router.replace(state || INTERNAL_LINKS.DASHBOARD);
        return;
      }
    }

    router.replace(INTERNAL_LINKS.DASHBOARD);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Authenticating with Hub...</p>
    </div>
  );
}
