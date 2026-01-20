"use client";

import { ReactNode } from "react";
import { useCanAccess } from "../application/hooks/useCanAccess";
import { Card, CardContent, CardHeader, CardTitle } from "@crunch-ui/core";

interface RestrictedWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  showDefaultMessage?: boolean;
}

export function RestrictedWrapper({
  children,
  fallback = null,
  showDefaultMessage = true,
}: RestrictedWrapperProps) {
  const { canAccess } = useCanAccess();

  if (!canAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showDefaultMessage) {
      return (
        <div className="mx-auto w-full max-w-7xl">
          <Card>
            <CardHeader>
              <CardTitle>Access Restricted</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This content is only available to registered coordinators.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
}
