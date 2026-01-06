import { ReactElement } from "react";
import { AuthWrapper } from "@/modules/auth/ui/authWrapper";
import { PendingStatusBanner } from "@/modules/auth/ui/pendingStatusBanner";
import { ReadOnlyWrapper } from "@/modules/auth/ui/readOnlyWrapper";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <AuthWrapper>
      <PendingStatusBanner />
      <ReadOnlyWrapper>{children}</ReadOnlyWrapper>
    </AuthWrapper>
  );
}
