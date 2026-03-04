"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { InfoCircle } from "@crunch-ui/icons";
import { useWallet } from "../application/context/walletContext";

interface MultisigFormProps {
  onSuccess?: () => void;
  showSkip?: boolean;
  onSkip?: () => void;
}

export function MultisigForm({
  onSuccess,
  showSkip,
  onSkip,
}: MultisigFormProps) {
  const {
    multisigAddress,
    setMultisigAddress,
    clearMultisigAddress,
    isMultisigMode,
  } = useWallet();
  const [address, setAddress] = useState(multisigAddress);
  const [error, setError] = useState("");

  useEffect(() => {
    setAddress(multisigAddress);
  }, [multisigAddress]);

  const handleSave = () => {
    setError("");
    if (!address) {
      clearMultisigAddress();
      onSuccess?.();
      return;
    }
    const success = setMultisigAddress(address);
    if (success) {
      onSuccess?.();
    } else {
      setError("Invalid Solana public key");
    }
  };

  const handleClear = () => {
    clearMultisigAddress();
    onSuccess?.();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-1">
          Multisig Address
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoCircle className="min-w-4 inline-block pl-1 mb-1 body-xs" />
            </TooltipTrigger>
            <TooltipContent>
              When set, all transactions will be proposed to this Squads
              multisig instead of being executed directly.
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
      <div className="flex gap-2">
        {isMultisigMode && (
          <Button variant="destructive" onClick={handleClear}>
            Disable Multisig
          </Button>
        )}
        <Button onClick={handleSave}>Save</Button>
      </div>

      {showSkip && !isMultisigMode && (
        <button
          type="button"
          onClick={onSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Don&apos;t need multisig? Skip this step →
        </button>
      )}
    </div>
  );
}
