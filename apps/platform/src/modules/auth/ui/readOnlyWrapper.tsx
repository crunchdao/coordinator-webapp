"use client";
import { ReactNode } from "react";
import { useAuth } from "../application/context/authContext";

interface ReadOnlyWrapperProps {
  children: ReactNode;
}

export function ReadOnlyWrapper({ children }: ReadOnlyWrapperProps) {
  const { isReadOnly } = useAuth();

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
