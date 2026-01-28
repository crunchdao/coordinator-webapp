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
import { config } from "@coordinator/utils/src/config";
import { useGetCoordinator } from "@/modules/crunch/application/hooks/useGetCoordinator";
import { CoordinatorStatus } from "@/modules/crunch/domain/types";
import { faucetRequestSchema } from "../application/schemas/faucet-request";
import { useRequestFaucet } from "../application/hooks/useRequestFaucet";
import { FaucetRequest } from "../domain/types";
import { useGetCrnchAccount } from "@crunchdao/staking";

export function FaucetCard() {
  const form = useForm<FaucetRequest>({
    resolver: zodResolver(faucetRequestSchema),
    defaultValues: {
      amount: 10,
    },
  });

  const { crnchAccount, crnchAccountLoading } = useGetCrnchAccount();

  const { requestFaucet, requestFaucetLoading } = useRequestFaucet();
  const { coordinator, coordinatorLoading } = useGetCoordinator();

  const isDevnet = config.solana.network !== "mainnet-beta";
  const isApprovedCoordinator =
    coordinator?.status === CoordinatorStatus.APPROVED;

  if (!isDevnet || coordinatorLoading) {
    return null;
  }

  const onSubmit = (data: FaucetRequest) => {
    requestFaucet(data.amount);
    form.reset();
  };

  const isDisabled = !isApprovedCoordinator;

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
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            {crnchAccountLoading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <p className="text-2xl font-bold">
                {crnchAccount?.amount || "0"} CRNCH
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
                <p className="body-sm text-destructive text-center">
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
