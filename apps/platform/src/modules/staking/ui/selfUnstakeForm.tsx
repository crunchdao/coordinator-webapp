"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CrunchValue } from "@crunchdao/solana-utils";
import {
  FormHandlers,
  PercentageSelector,
  useUnstakeFromCoordinator,
} from "@crunchdao/staking";
import {
  SelfStakeFormData,
  selfStakeSchema,
} from "../application/schemas/selfStake";
import LoadingOverlay from "@coordinator/ui/src/loading-overlay";

interface SelfUnstakeFormProps {
  poolAddress: string;
  stakedAmount: number;
  handlers?: FormHandlers;
}

export const SelfUnstakeForm: React.FC<SelfUnstakeFormProps> = ({
  poolAddress,
  stakedAmount,
  handlers,
}) => {
  const { unstake, unstakeLoading } = useUnstakeFromCoordinator();

  const form = useForm<SelfStakeFormData>({
    resolver: zodResolver(selfStakeSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const amount = form.watch("amount");

  const onSubmit = async (values: SelfStakeFormData) => {
    try {
      const action = async () => {
        const result = await unstake({
          amount: values.amount,
          poolAddress,
        });

        // In multisig mode, the transactionExecutor already triggers
        // the proposal tracker — skip the immediate success feedback.
        const isMultisig =
          typeof result === "object" &&
          result !== null &&
          "isMultisig" in result &&
          result.isMultisig;

        if (!isMultisig) {
          toast({
            title: "Success",
            description: `Successfully unstaked ${values.amount} CRNCH`,
          });
        }

        form.reset({ amount: 0 });
        handlers?.onSuccess?.();
      };

      if (handlers?.beforeSubmit) {
        await handlers.beforeSubmit(action);
      } else {
        await action();
      }
    } catch (error) {
      console.error("Unstaking failed:", error);

      if (handlers?.onError) {
        handlers.onError(error as Error);
      } else {
        toast({
          title: "Error",
          description: "Unstaking failed",
          variant: "destructive",
        });
      }
    }
  };

  const setAmountPercentage = (percentage: number) => {
    if (stakedAmount > 0) {
      const newAmount =
        percentage === 100
          ? stakedAmount
          : parseFloat((stakedAmount * (percentage / 100)).toFixed(6));

      form.setValue("amount", newAmount);
    }
  };

  return (
    <>
      {unstakeLoading && (
        <LoadingOverlay
          title="Unstaking"
          subtitle="Processing your unstake..."
        />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unstake Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="1"
                    {...field}
                    value={field.value || ""}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value ? Number(event.target.value) : 0
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
                {unstakeLoading ? (
                  <div className="flex gap-2 mt-1">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="flex-1 h-8" />
                    ))}
                  </div>
                ) : (
                  <>
                    {stakedAmount > 0 && (
                      <div className="pt-1 flex flex-col gap-2">
                        <PercentageSelector
                          onPercentageSelect={setAmountPercentage}
                          maxLabel="Max"
                        />
                        <p className="body-xs text-muted-foreground w-full flex justify-between">
                          Staked Balance
                          <CrunchValue
                            amount={stakedAmount}
                            showCurrency={true}
                            className="text-right"
                          />
                        </p>
                      </div>
                    )}
                    {stakedAmount === 0 && (
                      <p className="body-xs text-muted-foreground">
                        No staked balance
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
              unstakeLoading ||
              stakedAmount <= 0 ||
              amount <= 0 ||
              amount > stakedAmount
            }
            loading={unstakeLoading}
          >
            Unstake
          </Button>
        </form>
      </Form>
    </>
  );
};
