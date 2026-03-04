import { ReactNode } from "react";
import { AuthWrapper } from "@/modules/coordinator/ui/authWrapper";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthWrapper>{children}</AuthWrapper>;
}
