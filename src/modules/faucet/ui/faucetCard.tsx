"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Skeleton,
} from "@crunch-ui/core";
import { useGetCrnchBalance } from "../application/hooks/useGetCrnchBalance";
import { useRequestFaucet } from "../application/hooks/useRequestFaucet";
import { useGetCoordinator } from "@/modules/coordinator/application/hooks/useGetCoordinator";
import { CoordinatorStatus } from "@/modules/coordinator/domain/types";
import { faucetRequestSchema } from "../application/schemas/faucet-request.schema";
import { FaucetRequest } from "../domain/types";

export function FaucetCard() {
  const form = useForm<FaucetRequest>({
    resolver: zodResolver(faucetRequestSchema),
    defaultValues: {
      amount: 10,
    },
  });

  const { crnchBalance, crnchBalanceLoading } = useGetCrnchBalance();
  console.log(crnchBalance);
  const { requestFaucet, requestFaucetLoading } = useRequestFaucet();
  const { coordinator, coordinatorLoading } = useGetCoordinator();

  const isDevnet = process.env.NEXT_PUBLIC_SOLANA_NETWORK !== "mainnet-beta";
  const isApprovedCoordinator =
    coordinator?.status === CoordinatorStatus.APPROVED;

  if (!isDevnet || coordinatorLoading) {
    return null;
  }

  const onSubmit = async (data: FaucetRequest) => {
    await requestFaucet(data.amount);
    form.reset();
  };

  const isDisabled = !isApprovedCoordinator || requestFaucetLoading;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">CRNCH Faucet</CardTitle>
        <CardDescription>
          Request CRNCH tokens for testing on devnet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Current Balance</p>
            {crnchBalanceLoading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <p className="text-2xl font-bold">
                {crnchBalance?.formatted || "0"} CRNCH
              </p>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        disabled={isDisabled}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isDisabled}
                loading={requestFaucetLoading}
                className="w-full"
              >
                Request CRNCH
              </Button>

              {!isApprovedCoordinator && (
                <p className="text-sm text-muted-foreground text-center">
                  Only approved coordinators can request tokens
                </p>
              )}
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
