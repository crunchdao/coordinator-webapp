"use client";
import React from "react";
import { Spinner } from "@crunch-ui/core";

interface LoadingOverlayProps {
  title?: string | undefined;
  subtitle?: string | undefined;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ title, subtitle }) => {
  return (
    <div className="absolute inset-0 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 px-3 text-center">
      <Spinner />
      {title && (
        <div className="flex items-center flex-col gap-1 label-xs text-foreground">
          <p>{title}</p>
          {subtitle && (
            <span className="body-xs font-bold! text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
