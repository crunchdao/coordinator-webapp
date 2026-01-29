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
  useDelegate,
  useGetDepositAccount,
} from "@crunchdao/staking";
import {
  SelfStakeFormData,
  selfStakeSchema,
} from "../application/schemas/selfStake";
import LoadingOverlay from "@coordinator/ui/src/loading-overlay";

interface SelfStakeFormProps {
  poolAddress: string;
  handlers?: FormHandlers;
}

export const SelfStakeForm: React.FC<SelfStakeFormProps> = ({
  poolAddress,
  handlers,
}) => {
  const { depositAccount, depositAccountLoading } = useGetDepositAccount();
  const { delegate, delegateLoading } = useDelegate();

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
        await delegate({ amount: values.amount, poolAddress });
        toast({
          title: "Success",
          description: `Successfully staked ${values.amount} CRNCH`,
        });
        form.reset({ amount: 0 });
        handlers?.onSuccess?.();
      };

      if (handlers?.beforeSubmit) {
        await handlers.beforeSubmit(action);
      } else {
        await action();
      }
    } catch (error) {
      console.error("Staking failed:", error);

      if (handlers?.onError) {
        handlers.onError(error as Error);
      } else {
        toast({
          title: "Error",
          description: "Staking failed",
          variant: "destructive",
        });
      }
    }
  };

  const setAmountPercentage = (percentage: number) => {
    if (depositAccount && depositAccount.amount > 0) {
      const newAmount =
        percentage === 100
          ? depositAccount.amount
          : parseFloat((depositAccount.amount * (percentage / 100)).toFixed(6));

      form.setValue("amount", newAmount);
    }
  };

  return (
    <>
      {delegateLoading && (
        <LoadingOverlay title="Staking" subtitle="Processing your stake..." />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stake Amount</FormLabel>
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
                {depositAccountLoading || delegateLoading ? (
                  <div className="flex gap-2 mt-1">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="flex-1 h-8" />
                    ))}
                  </div>
                ) : (
                  <>
                    {depositAccount && depositAccount.amount > 0 && (
                      <div className="pt-1 flex flex-col gap-2">
                        <PercentageSelector
                          onPercentageSelect={setAmountPercentage}
                          maxLabel="Max"
                        />
                        <p className="body-xs text-muted-foreground w-full flex justify-between">
                          Available Balance
                          <CrunchValue
                            amount={depositAccount.amount}
                            showCurrency={true}
                            className="text-right"
                          />
                        </p>
                      </div>
                    )}
                    {!depositAccount || depositAccount.amount === 0 ? (
                      <p className="body-xs text-muted-foreground">
                        No deposited balance
                      </p>
                    ) : null}
                  </>
                )}
              </FormItem>
            )}
          />
          <Button
            className="ml-auto block"
            type="submit"
            disabled={
              delegateLoading ||
              !depositAccount ||
              depositAccount.amount <= 0 ||
              amount <= 0 ||
              amount > depositAccount.amount
            }
            loading={delegateLoading}
          >
            Stake
          </Button>
        </form>
      </Form>
    </>
  );
};
