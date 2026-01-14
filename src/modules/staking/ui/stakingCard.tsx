"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Skeleton,
} from "@crunch-ui/core";
import { Wallet } from "@crunch-ui/icons";
import { useGetStakingInfo } from "../application/hooks/useGetStakingInfo";
import {
  useDepositCrunch,
  useDelegate,
  useUnstakeFromCoordinator,
  useWithdrawCrunch
} from "@crunchdao/staking";
import { useWallet } from "@/modules/wallet/application/context/walletContext";

export function StakingCard() {
  const [depositAmount, setDepositAmount] = useState("");
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { publicKey } = useWallet();
  const { stakingInfo, stakingInfoLoading } = useGetStakingInfo();
  const { deposit, depositLoading } = useDepositCrunch();
  const { delegate, delegateLoading } = useDelegate();
  const { unstake, unstakeLoading } = useUnstakeFromCoordinator();
  const { withdraw, isLoading: withdrawLoading } = useWithdrawCrunch();

  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseAmount = (amount: string): bigint => {
    try {
      const parsed = parseFloat(amount) * 10 ** 9;
      return BigInt(Math.floor(parsed));
    } catch {
      return BigInt(0);
    }
  };

  const handleDepositAndStake = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0 || !publicKey) return;

    try {
      await deposit({ amount: parseFloat(depositAmount) });
      await delegate({
        amount: parseFloat(depositAmount),
        poolAddress: publicKey.toString()
      });
      setDepositAmount("");
      setStakeAmount("");
    } catch (error) {
      // Error handled by hooks
    }
  };

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0 || !publicKey) return;

    try {
      await delegate({
        amount: parseFloat(stakeAmount),
        poolAddress: publicKey.toString()
      });
      setStakeAmount("");
    } catch (error) {
      // Error handled by hooks
    }
  };

  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0 || !publicKey) return;

    try {
      await unstake({
        amount: parseFloat(unstakeAmount),
        poolAddress: publicKey.toString()
      });
      setUnstakeAmount("");
    } catch (error) {
      // Error handled by hooks
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;

    try {
      await withdraw({ amount: parseFloat(withdrawAmount) });
      setWithdrawAmount("");
    } catch (error) {
      // Error handled by hooks
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coordinator Staking</CardTitle>
        <CardDescription>
          Stake CRNCH tokens to activate your coordinator and create crunches
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stakingInfoLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <p className="body-sm text-muted-foreground">Self Staked</p>
                <p className="body-lg font-bold">
                  {stakingInfo ? formatAmount(stakingInfo.stakedAmount) : "0"}{" "}
                  CRNCH
                </p>
              </div>
              <div className="space-y-1">
                <p className="body-sm text-muted-foreground">
                  Available to Stake
                </p>
                <p className="body-lg font-bold">
                  {stakingInfo
                    ? formatAmount(stakingInfo.availableToStake)
                    : "0"}{" "}
                  CRNCH
                </p>
              </div>
            </div>

            <Tabs defaultValue="stake" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stake">Stake</TabsTrigger>
                <TabsTrigger value="unstake">Unstake</TabsTrigger>
              </TabsList>

              <TabsContent value="stake" className="space-y-4">
                {(!stakingInfo || stakingInfo.availableToStake === 0) && (
                  <div className="space-y-4">
                    <Label htmlFor="deposit-amount">
                      Deposit and Stake Amount
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="deposit-amount"
                        type="number"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        disabled={
                          depositLoading || delegateLoading
                        }
                      />
                      <Button
                        onClick={handleDepositAndStake}
                        disabled={
                          depositLoading ||
                          delegateLoading ||
                          !depositAmount
                        }
                        loading={
                          depositLoading || delegateLoading
                        }
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Deposit & Stake
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You need to deposit CRNCH tokens first before you can
                      stake them
                    </p>
                  </div>
                )}

                {stakingInfo && stakingInfo.availableToStake > 0 && (
                  <div className="space-y-4">
                    <Label htmlFor="stake-amount">Stake Amount</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="stake-amount"
                        type="number"
                        placeholder="0.00"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        disabled={delegateLoading}
                      />
                      <Button
                        onClick={handleStake}
                        disabled={delegateLoading || !stakeAmount}
                        loading={delegateLoading}
                      >
                        Stake
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="unstake" className="space-y-4">
                <div className="space-y-4">
                  <Label htmlFor="unstake-amount">Unstake Amount</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="unstake-amount"
                      type="number"
                      placeholder="0.00"
                      value={unstakeAmount}
                      onChange={(e) => setUnstakeAmount(e.target.value)}
                      disabled={unstakeLoading}
                    />
                    <Button
                      onClick={handleUnstake}
                      disabled={unstakeLoading || !unstakeAmount}
                      loading={unstakeLoading}
                    >
                      Unstake
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Unstaking may have a cooldown period before tokens become
                    available
                  </p>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <Label htmlFor="withdraw-amount">Withdraw Amount</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      disabled={withdrawLoading}
                    />
                    <Button
                      onClick={handleWithdraw}
                      disabled={withdrawLoading || !withdrawAmount}
                      loading={withdrawLoading}
                      variant="outline"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Withdraw
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}
