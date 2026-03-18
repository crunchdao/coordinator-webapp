"use client";

import { ReactNode } from "react";
import { TooltipProvider } from "@crunch-ui/core";
import { WalletProvider } from "@/modules/wallet/application/context/walletContext";
import { CoordinatorAuthProvider } from "@/modules/coordinator/application/context/coordinatorAuthContext";
import { MultisigProposalTrackerProvider } from "@/modules/wallet/application/context/multisigProposalTrackerContext";
import { useEnvironment } from "@/modules/environment/application/context/environmentContext";

export default function Providers({ children }: { children: ReactNode }) {
  const { environment } = useEnvironment();

  return (
    <WalletProvider key={environment}>
      <CoordinatorAuthProvider>
        <MultisigProposalTrackerProvider>
          <TooltipProvider delayDuration={50}>
            {children}
          </TooltipProvider>
        </MultisigProposalTrackerProvider>
      </CoordinatorAuthProvider>
    </WalletProvider>
  );
}
