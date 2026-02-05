"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@crunch-ui/core";
import { PublicKey } from "@solana/web3.js";
import { FundCrunchForm } from "./fundCrunchForm";

interface FundCrunchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crunchName: string;
  crunchAddress: PublicKey;
}

export function FundCrunchDialog({
  open,
  onOpenChange,
  crunchName,
  crunchAddress,
}: FundCrunchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fund Crunch</DialogTitle>
          <DialogDescription>
            Add USDC to the reward vault for "{crunchName}"
          </DialogDescription>
        </DialogHeader>
        <FundCrunchForm
          crunchName={crunchName}
          crunchAddress={crunchAddress}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
