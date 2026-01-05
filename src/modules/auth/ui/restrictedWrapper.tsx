"use client";

import { ReactNode } from "react";
import { useCanAccess } from "../application/hooks/useCanAccess";

interface RestrictedWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function RestrictedWrapper({ children, fallback = null }: RestrictedWrapperProps) {
  const { canAccess } = useCanAccess();

  if (!canAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}