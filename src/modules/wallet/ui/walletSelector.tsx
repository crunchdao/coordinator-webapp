"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
  Button,
} from "@crunch-ui/core";
import { useWallet } from "../application/context/walletContext";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, Plus, SmallCross } from "@crunch-ui/icons";
import { truncateAddress } from "@/utils/solana";

export function WalletSelector() {
  const {
    publicKey,
    wallet,
    disconnect,
    connected,
    connect,
    connecting,
    wallets,
    select,
  } = useWallet();
  const { setVisible, visible } = useWalletModal();
  const [isNewWalletFlow, setIsNewWalletFlow] = useState(false);

  useEffect(() => {
    if (!visible && wallet && !connected && !connecting && isNewWalletFlow) {
      // Small delay to ensure modal is fully closed
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

  // First connection - show button
  if (!connected || !publicKey) {
    return (
      <Button
        onClick={() => {
          setIsNewWalletFlow(true);
          setVisible(true);
        }}
        variant="outline"
        className="flex items-center gap-2"
        disabled={connecting}
      >
        <Wallet className="h-4 w-4" />
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    );
  }

  // Connected - show select
  return (
    <Select value={publicKey.toString()} onValueChange={handleSelectChange}>
      <SelectTrigger className="w-[220px]">
        <div className="flex items-center gap-2 w-full">
          <Wallet className="h-4 w-4 flex-shrink-0" />
          <SelectValue>
            <div className="flex items-center gap-2">
              <span className="text-sm">
                {truncateAddress(publicKey.toString())}
              </span>
              <span className="text-xs text-muted-foreground">
                {wallet?.adapter.name}
              </span>
            </div>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={publicKey.toString()} disabled>
          <div className="flex items-center justify-between gap-3 w-full">
            <span>{truncateAddress(publicKey.toString())}</span>
            <span className="text-xs text-muted-foreground">
              {wallet?.adapter.name}
            </span>
          </div>
        </SelectItem>
        <SelectSeparator />
        <SelectItem value="connect-new">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Connect Another Wallet</span>
          </div>
        </SelectItem>
        <SelectSeparator />
        <SelectItem value="disconnect">
          <div className="flex items-center gap-2 text-destructive">
            <SmallCross className="h-4 w-4" />
            <span>Disconnect</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
