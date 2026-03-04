"use client";
import { ReactNode } from "react";
import { useCoordinatorAuth } from "../application/context/coordinatorAuthContext";

interface ReadOnlyWrapperProps {
  children: ReactNode;
}

export function ReadOnlyWrapper({ children }: ReadOnlyWrapperProps) {
  const { isReadOnly } = useCoordinatorAuth();

  if (!isReadOnly) return <>{children}</>;

  return (
    <div
      inert={true}
      aria-disabled
      className="pointer-events-none select-auto opacity-75 blur-[1px]"
    >
      {children}
    </div>
  );
}
