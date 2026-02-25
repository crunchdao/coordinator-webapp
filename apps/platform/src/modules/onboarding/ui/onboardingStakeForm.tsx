"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Skeleton,
  toast,
} from "@crunch-ui/core";
import {
  useDepositCrunch,
  useDelegate,
  useGetCrnchAccount,
  useGetDepositAccount,
  PercentageSelector,
} from "@crunchdao/staking";
import { CrunchValue } from "@crunchdao/solana-utils";
import { useEffectiveAuthority } from "@/modules/wallet/application/hooks/useEffectiveAuthority";
import { useOnboarding } from "../application/onboardingContext";
import LoadingOverlay from "@coordinator/ui/src/loading-overlay";

const schema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
});

type FormData = z.infer<typeof schema>;

export function OnboardingStakeForm() {
  const { authority } = useEffectiveAuthority();
  const { minStakeRequired, stakedAmount } = useOnboarding();
  const { crnchAccount, crnchAccountLoading } = useGetCrnchAccount();
  const { depositAccount, depositAccountLoading } = useGetDepositAccount();
  const { deposit, depositLoading } = useDepositCrunch();
  const { delegate, delegateLoading } = useDelegate();
  const [step, setStep] = useState<"idle" | "depositing" | "staking">("idle");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0 },
  });

  const amount = form.watch("amount");
  const walletBalance = crnchAccount?.amount ?? 0;
  const depositedBalance = depositAccount?.amount ?? 0;
  const remaining = Math.max(0, minStakeRequired - stakedAmount);
  const isLoading = depositLoading || delegateLoading;
  const hasDepositedFunds = depositedBalance > 0;

  if (!authority) {
    return (
      <p className="text-sm text-muted-foreground">Wallet not connected</p>
    );
  }

  const onSubmit = async (values: FormData) => {
    try {
      // If staking from deposited funds, skip deposit step
      if (!hasDepositedFunds) {
        setStep("depositing");
        await deposit({ amount: values.amount });
      }

      setStep("staking");
      await delegate({
        amount: values.amount,
        poolAddress: authority.toString(),
      });

      toast({
        title: "Success",
        description: hasDepositedFunds
          ? `Successfully staked ${values.amount} CRNCH`
          : `Successfully deposited and staked ${values.amount} CRNCH`,
      });
      form.reset({ amount: 0 });
    } catch (error) {
      console.error("Deposit & stake failed:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setStep("idle");
    }
  };

  const availableBalance = hasDepositedFunds ? depositedBalance : walletBalance;

  const setAmountPercentage = (percentage: number) => {
    if (availableBalance > 0) {
      const newAmount =
        percentage === 100
          ? availableBalance
          : parseFloat((availableBalance * (percentage / 100)).toFixed(6));
      form.setValue("amount", newAmount);
    }
  };

  return (
    <>
      {isLoading && (
        <LoadingOverlay
          title={step === "depositing" ? "Depositing" : "Staking"}
          subtitle={
            step === "depositing"
              ? "Depositing CRNCH..."
              : "Staking on yourself..."
          }
        />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="body-sm text-muted-foreground space-y-1">
            <p className="flex justify-between">
              <span>Minimum required</span>
              <span className="font-medium text-foreground">
                {minStakeRequired.toLocaleString()} CRNCH
              </span>
            </p>
            {remaining > 0 ? (
              <p className="flex justify-between">
                <span>Remaining to stake</span>
                <span className="font-medium text-foreground">
                  {remaining.toLocaleString()} CRNCH
                </span>
              </p>
            ) : (
              <p className="flex justify-between">
                <span>Currently staked</span>
                <span className="font-medium text-foreground">
                  {stakedAmount.toLocaleString()} CRNCH
                </span>
              </p>
            )}
          </div>

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="1"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : 0
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
                {crnchAccountLoading || depositAccountLoading || isLoading ? (
                  <div className="flex gap-2 mt-1">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="flex-1 h-8" />
                    ))}
                  </div>
                ) : (
                  <>
                    {availableBalance > 0 && (
                      <div className="pt-1 flex flex-col gap-2">
                        <PercentageSelector
                          onPercentageSelect={setAmountPercentage}
                          maxLabel="Max"
                        />
                        <p className="body-xs text-muted-foreground w-full flex justify-between">
                          {hasDepositedFunds ? "Deposited Balance" : "Wallet Balance"}
                          <CrunchValue
                            amount={availableBalance}
                            showCurrency
                            className="text-right"
                          />
                        </p>
                      </div>
                    )}
                    {availableBalance === 0 && (
                      <p className="body-xs text-muted-foreground">
                        No CRNCH available
                      </p>
                    )}
                  </>
                )}
              </FormItem>
            )}
          />
          <Button
            className="ml-auto block"
            type="submit"
            disabled={
              isLoading ||
              availableBalance === 0 ||
              amount <= 0 ||
              amount > availableBalance
            }
            loading={isLoading}
          >
            {hasDepositedFunds ? "Stake" : "Deposit & Stake"}
          </Button>
        </form>
      </Form>
    </>
  );
}
