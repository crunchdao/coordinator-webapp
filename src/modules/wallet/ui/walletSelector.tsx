"use client";
import { useState } from "react";
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
  Badge,
} from "@crunch-ui/core";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  Wallet,
  SmallCross,
  Coordinator,
  Switch,
  QuestionMark,
  Lock,
} from "@crunch-ui/icons";
import { useAuth } from "@/modules/auth/application/context/authContext";
import { CoordinatorStatus } from "@/modules/coordinator/domain/types";
import { INTERNAL_LINKS } from "@/utils/routes";
import { useWallet } from "../application/context/walletContext";
import { useEffectiveAuthority } from "../application/hooks/useEffectiveAuthority";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { MultisigDialog } from "./multisigDialog";

export function WalletSelector() {
  const { publicKey, disconnect, connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const { coordinatorStatus, coordinator } = useAuth();
  const { authority, isMultisigMode } = useEffectiveAuthority();
  const [multisigDialogOpen, setMultisigDialogOpen] = useState(false);

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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            {isMultisigMode && <Badge variant="outline">Multisig</Badge>}
            <Avatar>
              <AvatarFallback>
                {coordinatorStatus === CoordinatorStatus.UNREGISTERED ? (
                  <QuestionMark />
                ) : (
                  <span>{coordinator?.name.charAt(0).toUpperCase()}</span>
                )}
              </AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          {isMultisigMode && authority && (
            <>
              <DropdownMenuLabel className="body-xs flex items-center gap-2 text-muted-foreground">
                <PulseRing active={isMultisigMode} /> Multisig Mode Active
              </DropdownMenuLabel>
              <DropdownMenuItem className="flex justify-between gap-1">
                <span className="body-xs text-muted-foreground">
                  Vault (authority)
                </span>
                <SolanaAddressLink
                  copyable={false}
                  address={authority.toString()}
                />
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onSelect={() => setMultisigDialogOpen(true)}>
            <Lock className="h-4 w-4 mr-2" />
            <span>Multisig Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {coordinatorStatus === CoordinatorStatus.UNREGISTERED ? (
            <DropdownMenuItem>
              <Link
                className="flex items-center mr-auto"
                href={INTERNAL_LINKS.REGISTER}
              >
                <Coordinator className="h-4 w-4 mr-2" /> Registration
              </Link>
              <SolanaAddressLink
                copyable={false}
                address={publicKey.toString()}
              />
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
              <span className="ml-auto body-xs">
                <SolanaAddressLink
                  copyable={false}
                  address={publicKey.toString()}
                />
              </span>
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
      <MultisigDialog
        open={multisigDialogOpen}
        onOpenChange={setMultisigDialogOpen}
      />
    </>
  );
}
