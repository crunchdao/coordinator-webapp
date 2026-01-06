import { ReactElement } from "react";
import { AuthWrapper } from "@/modules/auth/ui/authWrapper";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactElement;
}) {
  return <AuthWrapper>{children}</AuthWrapper>;
}
