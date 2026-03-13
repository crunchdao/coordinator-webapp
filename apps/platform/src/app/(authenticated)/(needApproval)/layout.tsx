import { ReactNode } from "react";
import { PendingStatusBanner } from "@/modules/coordinator/ui/pendingStatusBanner";
import { ReadOnlyWrapper } from "@/modules/coordinator/ui/readOnlyWrapper";
import { HubAuthProvider } from "@/modules/hub/application/context/hubAuthContext";

export default function ApprovedLayout({ children }: { children: ReactNode }) {
  return (
    <HubAuthProvider>
      <PendingStatusBanner />
      <ReadOnlyWrapper>{children}</ReadOnlyWrapper>
    </HubAuthProvider>
  );
}
