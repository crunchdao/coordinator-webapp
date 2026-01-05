"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Button,
  DropdownMenuLabel,
  PulseRing,
} from "@crunch-ui/core";
import { useWallet } from "../application/context/walletContext";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, Plus, SmallCross, Selector } from "@crunch-ui/icons";
import { truncateAddress } from "@/utils/solana";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { CoordinatorStatus } from "@/modules/coordinator/domain/types";

export function WalletSelector() {
  const { publicKey, wallet, disconnect, connected, connect, connecting } =
    useWallet();
  const { setVisible, visible } = useWalletModal();
  const [isNewWalletFlow, setIsNewWalletFlow] = useState(false);
  const { coordinatorStatus, coordinator } = useAuth();

  useEffect(() => {
    if (!visible && wallet && !connected && !connecting && isNewWalletFlow) {
      setTimeout(() => {
        connect().catch((err) => {
          console.error("Failed to connect:", err);
        });
        setIsNewWalletFlow(false);
      }, 100);
    }
  }, [visible, wallet, connected, connecting, connect, isNewWalletFlow]);

  const handleSelectChange = (value: string) => {
    if (value === "connect-new") {
      setIsNewWalletFlow(true);
      setVisible(true);
    } else if (value === "disconnect") {
      disconnect();
    }
  };

  if (!connected || !publicKey) {
    return (
      <Button
        onClick={() => {
          setIsNewWalletFlow(true);
          setVisible(true);
        }}
        size="sm"
        className="flex items-center gap-2"
        disabled={connecting}
      >
        <Wallet className="h-4 w-4" />
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="w-56 justify-start">
          <div className="flex items-center gap-2 w-full">
            <Wallet className="h-4 w-4 shrink-0" />
            <div className="flex items-center gap-2 body-xs">
              <span>{truncateAddress(publicKey.toString())}</span>
              <span className="text-muted-foreground">
                {wallet?.adapter.name}
              </span>
            </div>
            <Selector className="ml-auto" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="gap-2 flex items-center">
          {coordinatorStatus === CoordinatorStatus.APPROVED && (
            <>
              <PulseRing active={true} /> {coordinator?.name}
            </>
          )}
          {coordinatorStatus === CoordinatorStatus.PENDING && (
            <>
              <PulseRing active={false} /> {coordinator?.name}
            </>
          )}
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => handleSelectChange("connect-new")}>
          <Plus className="h-4 w-4 mr-2" />
          <span>Connect Another Wallet</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleSelectChange("disconnect")}>
          <SmallCross className="h-4 w-4 mr-2" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
