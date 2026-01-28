import { ReactNode } from "react";
import { AuthWrapper } from "@coordinator/auth/src/ui/authWrapper";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthWrapper>{children}</AuthWrapper>;
}
