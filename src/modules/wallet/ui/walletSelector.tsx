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
  ExternalLink,
} from "@crunch-ui/icons";
import { truncateAddress } from "@/utils/solana";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { CoordinatorStatus } from "@/modules/coordinator/domain/types";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useWallet } from "../application/context/walletContext";

export function WalletSelector() {
  const { publicKey, wallet, disconnect, connected, connect, connecting } =
    useWallet();
  const { setVisible, visible } = useWalletModal();
  const [isNewWalletFlow, setIsNewWalletFlow] = useState(false);
  const { coordinatorStatus, coordinator } = useAuth();

  useEffect(() => {
    if (!visible && wallet && !connected && !connecting && isNewWalletFlow) {
      setTimeout(() => {
        connect()
          .catch((err) => {
            console.error("Failed to connect:", err);
          })
          .finally(() => {
            setIsNewWalletFlow(false);
          });
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
          <Link href={INTERNAL_LINKS.REGISTER}>
            <DropdownMenuItem>
              <Coordinator className="h-4 w-4 mr-2" /> Registration
            </DropdownMenuItem>
          </Link>
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
              {truncateAddress(publicKey.toString())}
              <ExternalLink className="inline -mt-1 ml-1" />
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
