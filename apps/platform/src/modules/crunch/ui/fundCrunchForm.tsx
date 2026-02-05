"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicKey } from "@solana/web3.js";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@crunch-ui/core";
import { SolanaAddressLink } from "@crunchdao/solana-utils";
import { PercentageSelector } from "@crunchdao/staking";
import { useFundCrunch } from "../application/hooks/useFundCrunch";
import { useGetUsdcBalance } from "../application/hooks/useGetUsdcBalance";
import { useGetRewardVaultBalance } from "../application/hooks/useGetRewardVaultBalance";
import {
  fundCrunchSchema,
  FundCrunchFormData,
} from "../application/schemas/fundCrunch";
import LoadingOverlay from "@coordinator/ui/src/loading-overlay";

interface FundCrunchFormProps {
  crunchName: string;
  crunchAddress: PublicKey;
  rewardVault?: PublicKey;
  onSuccess?: () => void;
  showCrunchInfo?: boolean;
}

export function FundCrunchForm({
  crunchName,
  crunchAddress,
  rewardVault,
  onSuccess,
  showCrunchInfo = false,
}: FundCrunchFormProps) {
  const { fundCrunch, fundCrunchLoading } = useFundCrunch(onSuccess);
  const { usdcBalance, usdcBalanceLoading } = useGetUsdcBalance();
  const { vaultBalance } = useGetRewardVaultBalance(rewardVault);

  const form = useForm<FundCrunchFormData>({
    resolver: zodResolver(fundCrunchSchema),
    defaultValues: { amount: 0 },
  });

  const amount = form.watch("amount");

  const onSubmit = (values: FundCrunchFormData) => {
    fundCrunch({ crunchAddress, amount: values.amount });
  };

  const setAmountPercentage = (percentage: number) => {
    if (usdcBalance > 0) {
      const newAmount =
        percentage === 100
          ? usdcBalance
          : parseFloat((usdcBalance * (percentage / 100)).toFixed(2));
      form.setValue("amount", newAmount);
    }
  };

  return (
    <>
      {fundCrunchLoading && (
        <LoadingOverlay
          title="Funding Crunch"
          subtitle="Processing your deposit..."
        />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {showCrunchInfo && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="flex justify-between">
                <span>Crunch</span>
                <span className="font-medium text-foreground">{crunchName}</span>
              </p>
              <p className="flex justify-between">
                <span>Address</span>
                <SolanaAddressLink address={crunchAddress.toString()} />
              </p>
              {rewardVault && vaultBalance > 0 && (
                <p className="flex justify-between">
                  <span>Current Vault Balance</span>
                  <span className="font-medium text-foreground">{vaultBalance.toLocaleString()} USDC</span>
                </p>
              )}
            </div>
          )}

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (USDC)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(e.target.value ? Number(e.target.value) : 0)
                    }
                  />
                </FormControl>
                <FormMessage />
                {usdcBalance > 0 && (
                  <div className="pt-1 flex flex-col gap-2">
                    <PercentageSelector
                      onPercentageSelect={setAmountPercentage}
                      maxLabel="Max"
                    />
                    <p className="body-xs text-muted-foreground flex justify-between">
                      <span>Your USDC Balance</span>
                      <span>{usdcBalance.toLocaleString()} USDC</span>
                    </p>
                  </div>
                )}
                {usdcBalance === 0 && !usdcBalanceLoading && (
                  <p className="body-xs text-muted-foreground pt-1">
                    No USDC balance
                  </p>
                )}
              </FormItem>
            )}
          />

          <Button
            className="ml-auto block"
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
        </form>
      </Form>
    </>
  );
}
