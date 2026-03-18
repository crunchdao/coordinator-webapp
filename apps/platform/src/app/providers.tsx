"use client";

import { ReactNode } from "react";
import { TooltipProvider } from "@crunch-ui/core";
import { WalletProvider } from "@/modules/wallet/application/context/walletContext";
import { CoordinatorAuthProvider } from "@/modules/coordinator/application/context/coordinatorAuthContext";
import { MultisigProposalTrackerProvider } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import { MultisigProposalTrackerDialog } from "@/modules/wallet/ui/multisigProposalTrackerDialog";
import {
  EnvironmentProvider,
  useEnvironment,
} from "@/modules/environment/application/context/environmentContext";

function InnerProviders({ children }: { children: ReactNode }) {
  const { environment } = useEnvironment();

  return (
    <WalletProvider key={environment}>
      <CoordinatorAuthProvider>
        <MultisigProposalTrackerProvider>
          <TooltipProvider delayDuration={50}>
            {children}
            <MultisigProposalTrackerDialog />
          </TooltipProvider>
        </MultisigProposalTrackerProvider>
      </CoordinatorAuthProvider>
    </WalletProvider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <EnvironmentProvider>
      <InnerProviders>{children}</InnerProviders>
    </EnvironmentProvider>
  );
}
