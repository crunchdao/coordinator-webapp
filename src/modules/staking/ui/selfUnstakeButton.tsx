"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@crunch-ui/core";
import { SelfUnstakeForm } from "./selfUnstakeForm";

interface SelfUnstakeButtonProps {
  poolAddress: string;
  stakedAmount: number;
  loading?: boolean;
}

export const SelfUnstakeButton: React.FC<SelfUnstakeButtonProps> = ({
  poolAddress,
  stakedAmount,
  loading,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={loading || stakedAmount === 0}
          size="sm"
          variant="secondary"
        >
          Unstake
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unstake from Pool</DialogTitle>
          <DialogDescription>
            Unstake tokens from your coordinator pool
          </DialogDescription>
        </DialogHeader>
        <SelfUnstakeForm
          poolAddress={poolAddress}
          stakedAmount={stakedAmount}
          handlers={{ onSuccess: () => setOpen(false) }}
        />
      </DialogContent>
    </Dialog>
  );
};
