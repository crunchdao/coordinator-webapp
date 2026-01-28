"use client";

import { ReactNode } from "react";
import { useSettings } from "@coordinator/settings/src/application/context/settingsContext";

interface LocalRestrictedWrapperProps {
  children: ReactNode;
  message?: string;
}

export function LocalRestrictedWrapper({
  children,
  message = "Not available in local mode",
}: LocalRestrictedWrapperProps) {
  const { isLocal } = useSettings();

  if (!isLocal) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-50">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-background/80 text-muted-foreground text-sm px-3 py-1.5 rounded-md border">
          {message}
        </span>
      </div>
    </div>
  );
}
