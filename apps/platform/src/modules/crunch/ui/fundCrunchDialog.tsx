"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@crunch-ui/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PublicKey } from "@solana/web3.js";
import { useFundCrunch } from "../application/hooks/useFundCrunch";
import { useGetUsdcBalance } from "../application/hooks/useGetUsdcBalance";
import {
  fundCrunchSchema,
  FundCrunchFormData,
} from "../application/schemas/fundCrunch";
import LoadingOverlay from "@coordinator/ui/src/loading-overlay";

interface FundCrunchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  crunchName: string;
  crunchAddress: PublicKey;
  currentRewardVaultBalance?: number;
}

export function FundCrunchDialog({
  open,
  onOpenChange,
  crunchName,
  crunchAddress,
  currentRewardVaultBalance,
}: FundCrunchDialogProps) {
  const { fundCrunch, fundCrunchLoading } = useFundCrunch();
  const { usdcBalance, usdcBalanceLoading } = useGetUsdcBalance();

  const form = useForm<FundCrunchFormData>({
    resolver: zodResolver(fundCrunchSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const amount = form.watch("amount");

  const onSubmit = async (values: FundCrunchFormData) => {
    fundCrunch(
      { crunchAddress, amount: values.amount },
      {
        onSuccess: () => {
          form.reset({ amount: 0 });
          onOpenChange(false);
        },
      }
    );
  };

  const setMaxAmount = () => {
    if (usdcBalance > 0) {
      form.setValue("amount", usdcBalance);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {fundCrunchLoading && (
          <LoadingOverlay
            title="Funding Crunch"
            subtitle="Processing your deposit..."
          />
        )}
        <DialogHeader>
          <DialogTitle>Fund Crunch</DialogTitle>
          <DialogDescription>
            Add USDC to the reward vault for "{crunchName}"
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (USDC)</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        {...field}
                        value={field.value || ""}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value ? Number(event.target.value) : 0
                          )
                        }
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={setMaxAmount}
                        disabled={usdcBalanceLoading || usdcBalance <= 0}
                      >
                        Max
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <div className="pt-2 space-y-1 text-sm text-muted-foreground">
                    <p className="flex justify-between">
                      <span>Your USDC Balance:</span>
                      <span>
                        {usdcBalanceLoading
                          ? "Loading..."
                          : `${usdcBalance.toLocaleString()} USDC`}
                      </span>
                    </p>
                    {currentRewardVaultBalance !== undefined && (
                      <p className="flex justify-between">
                        <span>Current Vault Balance:</span>
                        <span>{currentRewardVaultBalance.toLocaleString()} USDC</span>
                      </p>
                    )}
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  fundCrunchLoading ||
                  usdcBalanceLoading ||
                  amount <= 0 ||
                  amount > usdcBalance
                }
                loading={fundCrunchLoading}
              >
                Fund Crunch
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
