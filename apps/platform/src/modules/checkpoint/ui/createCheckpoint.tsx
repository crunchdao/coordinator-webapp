"use client";

import { useState } from "react";
import { Button, toast } from "@crunch-ui/core";
import { Prize } from "@crunchdao/sdk";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { generateLink } from "@crunch-ui/utils";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { INTERNAL_LINKS } from "@/utils/routes";
import { createNodeCheckpoint } from "../infrastructure/nodeService";
import { PrizesInput } from "./prizesInput";

/**
 * Create checkpoint flow:
 * 1. Enter prizes JSON (manually or from models)
 * 2. Click "Save Checkpoint" → POST to node DB as PENDING
 * 3. Redirect to checkpoints page where it can be reviewed & submitted on-chain
 */
export function CreateCheckpoint() {
  const { crunchName } = useCrunchContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [rawPrizes, setRawPrizes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveCheckpoint = async () => {
    setSaving(true);
    try {
      const parsed: Prize[] = JSON.parse(rawPrizes);
      const prizes = parsed.map((p) => ({
        model: p.model,
        prize: p.prize,
      }));

      await createNodeCheckpoint(crunchName, prizes);

      queryClient.invalidateQueries({
        queryKey: ["node-checkpoints", crunchName],
      });

      toast({
        title: "Checkpoint saved",
        description:
          "Checkpoint saved as pending. You can now review and submit it on-chain.",
      });

      router.push(
        generateLink(INTERNAL_LINKS.CHECKPOINTS, { crunchname: crunchName })
      );
    } catch (e) {
      const message = e instanceof Error ? e.message : "Please try again.";
      toast({
        title: "Failed to save checkpoint",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PrizesInput
      rawText={rawPrizes}
      onRawTextChange={setRawPrizes}
      onPrizesPrepared={() => {}}
      createCheckpointLoading={saving}
      createCheckpointButton={
        <Button
          onClick={handleSaveCheckpoint}
          loading={saving}
          disabled={saving || !rawPrizes.trim()}
        >
          Save Checkpoint
        </Button>
      }
    />
  );
}
