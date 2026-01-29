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
import { SelfStakeForm } from "./selfStakeForm";

interface SelfStakeButtonProps {
  poolAddress: string;
  loading?: boolean;
}

export const SelfStakeButton: React.FC<SelfStakeButtonProps> = ({
  poolAddress,
  loading,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={loading} size="sm">
          Stake
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Self Stake</DialogTitle>
          <DialogDescription>
            Stake tokens to your own coordinator pool
          </DialogDescription>
        </DialogHeader>
        <SelfStakeForm
          poolAddress={poolAddress}
          handlers={{ onSuccess: () => setOpen(false) }}
        />
      </DialogContent>
    </Dialog>
  );
};
