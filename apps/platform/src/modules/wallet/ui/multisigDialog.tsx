"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@crunch-ui/core";
import { MultisigForm } from "./multisigForm";

interface MultisigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MultisigDialog: React.FC<MultisigDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Multisig Settings</DialogTitle>
          <DialogDescription>
            Configure a Squads multisig for transaction proposals.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-2">
          <MultisigForm onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
