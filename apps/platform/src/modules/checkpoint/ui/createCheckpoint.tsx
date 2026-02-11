"use client";

import { useState } from "react";
import { Button } from "@crunch-ui/core";
import { PreparedPrize } from "@crunchdao/sdk";
import { useCreateCheckpoint } from "../application/hooks/useCreateCheckpoint";
import { PrizesInput } from "./prizesInput";

export function CreateCheckpoint() {
  const { createCheckpoint, createCheckpointLoading } = useCreateCheckpoint();
  const [preparedPrizes, setPreparedPrizes] = useState<PreparedPrize[] | null>(
    null
  );
  const [rawPrizes, setRawPrizes] = useState("");

  const handleCreateCheckpoint = async () => {
    if (!preparedPrizes) return;
    await createCheckpoint(preparedPrizes);
  };

  return (
    <PrizesInput
      rawText={rawPrizes}
      onRawTextChange={setRawPrizes}
      onPrizesPrepared={setPreparedPrizes}
      createCheckpointLoading={createCheckpointLoading}
      createCheckpointButton={
        <Button
          onClick={handleCreateCheckpoint}
          loading={createCheckpointLoading}
          disabled={createCheckpointLoading || !preparedPrizes}
        >
          Create Checkpoint
        </Button>
      }
    />
  );
}
