"use client";
import { INTERNAL_LINKS } from "@/utils/routes";
import { Spinner } from "@crunch-ui/core";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    redirect(INTERNAL_LINKS.LEADERBOARD);
  });
  return <Spinner />;
}
