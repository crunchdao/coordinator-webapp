"use client";
import { useMemo } from "react";
import { Card, Skeleton } from "@crunch-ui/core";
import { useIsMutating } from "@tanstack/react-query";
import { cn } from "@crunch-ui/utils";
import { CircleToken, Trophy } from "@crunch-ui/icons";
import { CrunchValue } from "@crunchdao/solana-utils";
import {
  useAmountChangeIndicator,
  useGetStakingPositions,
} from "@crunchdao/staking";
import { useWallet } from "@coordinator/wallet/src/application/context/walletContext";
import { SelfStakeButton } from "./selfStakeButton";
import { SelfUnstakeButton } from "./selfUnstakeButton";

export const SelfStakeCard = () => {
  const { publicKey } = useWallet();
  const { stakingPositions, stakingPositionsLoading } =
    useGetStakingPositions();
  const isMutating = useIsMutating();

  const stakedAmount = useMemo(() => {
    if (!publicKey || !stakingPositions) return 0;
    const position = stakingPositions.find(
      (p) => p.coordinatorStakeAddress === publicKey.toString()
    );
    return position?.userStake ?? 0;
  }, [publicKey, stakingPositions]);

  const changeType = useAmountChangeIndicator(stakedAmount, 3_000);
  const loading = stakingPositionsLoading || isMutating > 0;

  return (
    <Card className="p-6">
      <div>
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <p className="title-2xs uppercase w-full text-muted-foreground">
            Self Stake
            <span className="inline-block float-right pt-0.5 ml-auto">
              <Trophy />
            </span>
          </p>
        </div>
      </div>
      <div className="gap-3 flex flex-col">
        <div
          className={cn(
            "transition-colors duration-300 title-lg flex items-center gap-3",
            changeType === "increase" && "text-success",
            changeType === "decrease" && "text-destructive",
            isMutating && "animate-pulse"
          )}
        >
          <CircleToken className="inline" />
          {stakingPositionsLoading ? (
            <Skeleton className="w-32 h-10" />
          ) : (
            <CrunchValue amount={stakedAmount} />
          )}
        </div>
        {publicKey && (
          <div className="flex gap-2">
            <SelfStakeButton
              poolAddress={publicKey.toString()}
              loading={loading}
            />
            <SelfUnstakeButton
              poolAddress={publicKey.toString()}
              stakedAmount={stakedAmount}
              loading={loading}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
