"use client";

import { ReactNode } from "react";
import { TooltipProvider } from "@crunch-ui/core";
import { MultisigProvider } from "@crunchdao/solana-utils";
import { WalletProvider } from "@/modules/wallet/application/context/walletContext";
import { CoordinatorAuthProvider } from "@/modules/coordinator/application/context/coordinatorAuthContext";
import { useEnvironment } from "@/modules/environment/application/context/environmentContext";
import { useWalletAdapter } from "@/modules/wallet/application/hooks/useWalletAdapter";

function MultisigWrapper({ children }: { children: ReactNode }) {
  const { walletAdapter, connection } = useWalletAdapter();

  return (
    <MultisigProvider
      connection={connection}
      publicKey={walletAdapter?.publicKey ?? null}
      signTransaction={walletAdapter?.signTransaction ?? null}
      signAllTransactions={walletAdapter?.signAllTransactions ?? null}
    >
      {children}
    </MultisigProvider>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  const { environment } = useEnvironment();

  return (
    <WalletProvider key={environment}>
      <MultisigWrapper>
        <CoordinatorAuthProvider>
          <TooltipProvider delayDuration={50}>
            {children}
          </TooltipProvider>
        </CoordinatorAuthProvider>
      </MultisigWrapper>
    </WalletProvider>
  );
}
