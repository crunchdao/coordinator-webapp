"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { InfoCircle } from "@crunch-ui/icons";
import { useWallet } from "../application/context/walletContext";

interface MultisigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MultisigDialog: React.FC<MultisigDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { multisigAddress, setMultisigAddress, clearMultisigAddress } =
    useWallet();
  const [address, setAddress] = useState(multisigAddress);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setAddress(multisigAddress);
      setError("");
    }
  }, [open, multisigAddress]);

  const handleSave = () => {
    setError("");
    if (!address) {
      clearMultisigAddress();
      onOpenChange(false);
      return;
    }
    const success = setMultisigAddress(address);
    if (success) {
      onOpenChange(false);
    } else {
      setError("Invalid Solana public key");
    }
  };

  const handleClear = () => {
    clearMultisigAddress();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Multisig Settings</DialogTitle>
          <DialogDescription>
            Configure a Squads multisig for transaction proposals.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              Multisig Address
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
                </TooltipTrigger>
                <TooltipContent>
                  When set, all transactions will be proposed to this Squads
                  multisig instead of being executed directly. Leave empty for
                  direct execution.
                </TooltipContent>
              </Tooltip>
            </label>
            <Input
              placeholder="Multisig address (e.g., SQDS...)"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setError("");
              }}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            {multisigAddress && (
              <Button variant="destructive" onClick={handleClear}>
                Disable Multisig
              </Button>
            )}
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
