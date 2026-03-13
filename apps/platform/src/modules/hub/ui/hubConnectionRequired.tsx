"use client";

import { ReactNode } from "react";
import { Card, CardContent, Spinner } from "@crunch-ui/core";
import { useHubAuth } from "../application/context/hubAuthContext";
import { HubLoginButton } from "./hubLoginButton";

interface HubConnectionRequiredProps {
  children: ReactNode;
}

export function HubConnectionRequired({
  children,
}: HubConnectionRequiredProps) {
  const { isAuthenticated, isLoading } = useHubAuth();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="py-8 flex flex-col items-center gap-4">
          <p className="text-muted-foreground">
            Connect to the Hub to access this section.
          </p>
          <HubLoginButton />
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
