"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Button,
  DropdownMenuLabel,
  PulseRing,
  Avatar,
  AvatarFallback,
} from "@crunch-ui/core";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  Wallet,
  SmallCross,
  Coordinator,
  Switch,
  QuestionMark,
} from "@crunch-ui/icons";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { CoordinatorStatus } from "@/modules/coordinator/domain/types";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useWallet } from "../application/context/walletContext";
import { SolanaAddressLink } from "./solanaAddressLink";

export function WalletSelector() {
  const { publicKey, wallet, disconnect, connected, connect, connecting } =
    useWallet();
  const { setVisible, visible } = useWalletModal();
  const { coordinatorStatus, coordinator } = useAuth();

  const handleSelectChange = (value: string) => {
    if (value === "connect-new") {
      setVisible(true);
    } else if (value === "disconnect") {
      disconnect();
    }
  };

  if (!connected || !publicKey) {
    return (
      <Button
        onClick={() => {
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
        <Avatar className="cursor-pointer">
          <AvatarFallback>
            {coordinatorStatus === CoordinatorStatus.UNREGISTERED ? (
              <QuestionMark />
            ) : (
              <span>{coordinator?.name.charAt(0).toUpperCase()}</span>
            )}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {coordinatorStatus === CoordinatorStatus.UNREGISTERED ? (
          <DropdownMenuItem>
            <Link
              className="flex items-center mr-auto"
              href={INTERNAL_LINKS.REGISTER}
            >
              <Coordinator className="h-4 w-4 mr-2" /> Registration
            </Link>
            <SolanaAddressLink address={publicKey.toString()} />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuLabel className="gap-3 [&>span]:ml-1 flex items-center">
            {coordinatorStatus === CoordinatorStatus.APPROVED && (
              <>
                <PulseRing active={true} /> {coordinator?.name}
              </>
            )}
            {coordinatorStatus === CoordinatorStatus.PENDING && (
              <>
                <PulseRing
                  className={"bg-primary text-primary/50"}
                  active={false}
                />{" "}
                {coordinator?.name}
              </>
            )}
            {coordinatorStatus === CoordinatorStatus.REJECTED && (
              <>
                <PulseRing active={false} /> {coordinator?.name}
              </>
            )}
            <Link
              href={`https://solscan.io/account/${publicKey.toString()}`}
              target="_blank"
              className="ml-auto body-xs"
            >
              <SolanaAddressLink address={publicKey.toString()} />
            </Link>
          </DropdownMenuLabel>
        )}
        <DropdownMenuItem onSelect={() => handleSelectChange("connect-new")}>
          <Switch className="h-4 w-4 mr-2" />
          <span>Connect Another Wallet</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onSelect={() => handleSelectChange("disconnect")}
        >
          <SmallCross className="h-4 w-4 mr-2" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
