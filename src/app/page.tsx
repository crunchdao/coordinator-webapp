"use client";
import { INTERNAL_LINKS } from "@/utils/routes";
import { Spinner } from "@crunch-ui/core";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/modules/auth/application/context/authContext";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        redirect(INTERNAL_LINKS.DASHBOARD);
      } else {
        redirect(INTERNAL_LINKS.LOGIN);
      }
    }
  }, [isAuthenticated, isLoading]);

  return <Spinner />;
}
