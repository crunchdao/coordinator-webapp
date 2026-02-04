"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Spinner,
  Badge,
  toast,
} from "@crunch-ui/core";
import {
  useMultisigProposalTracker,
  ProposalStatusKind,
} from "../application/context/multisigProposalTrackerContext";

const STEPS: { key: ProposalStatusKind; label: string }[] = [
  { key: "Active", label: "Proposed" },
  { key: "Approved", label: "Approved" },
  { key: "Executed", label: "Executed" },
];

function getStepState(
  stepKey: ProposalStatusKind,
  currentStatus: ProposalStatusKind | "loading" | "not_found"
): "done" | "active" | "pending" {
  const order: Record<string, number> = {
    Draft: 0,
    Active: 1,
    Approved: 2,
    Executing: 3,
    Executed: 4,
  };

  const currentOrder =
    currentStatus === "loading" || currentStatus === "not_found"
      ? 0
      : (order[currentStatus] ?? 0);
  const stepOrder = order[stepKey] ?? 0;

  if (currentOrder > stepOrder) return "done";
  if (currentOrder === stepOrder) return "active";
  if (stepKey === "Approved" && currentStatus === "Executing") return "done";
  if (stepKey === "Executed" && currentStatus === "Executing") return "active";
  return "pending";
}

function StepIndicator({ state }: { state: "done" | "active" | "pending" }) {
  if (state === "done") {
    return (
      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
        ✓
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
        <Spinner className="w-3.5 h-3.5 text-primary-foreground" />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30" />
  );
}

function StatusBadge({
  status,
}: {
  status: ProposalStatusKind | "loading" | "not_found";
}) {
  const variants: Record<string, "primary" | "secondary" | "destructive"> = {
    Executed: "primary",
    Approved: "primary",
    Active: "secondary",
    Draft: "secondary",
    Rejected: "destructive",
    Cancelled: "destructive",
  };

  if (status === "loading" || status === "not_found") {
    return <Badge variant="secondary">Loading...</Badge>;
  }

  return <Badge variant={variants[status] ?? "secondary"}>{status}</Badge>;
}

function ApprovalCountdown({
  approvals,
  threshold,
  status,
}: {
  approvals: number;
  threshold: number;
  status: ProposalStatusKind | "loading" | "not_found";
}) {
  if (threshold === 0) return null;

  const remaining = Math.max(0, threshold - approvals);
  const isApproved =
    status === "Approved" ||
    status === "Executing" ||
    status === "Executed";

  if (isApproved) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2">
        <span className="text-2xl font-bold text-green-500">✓</span>
        <span className="text-sm text-green-600 font-medium">
          All approvals received
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
      <span className="text-3xl font-bold tabular-nums text-foreground">
        {remaining}
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          approval{remaining !== 1 ? "s" : ""} remaining
        </span>
        <span className="text-xs text-muted-foreground">
          {approvals} of {threshold} received
        </span>
      </div>
    </div>
  );
}

export const MultisigProposalTrackerDialog: React.FC = () => {
  const {
    trackingState,
    dismiss,
    isTracking,
    approveProposal,
    executeProposal,
    isActing,
    hasApproved,
    isMember,
  } = useMultisigProposalTracker();
  const { proposal, status, approvals, threshold, error } = trackingState;
  const [actionError, setActionError] = useState<string | null>(null);

  console.log(
    `[ProposalTrackerDialog] render: isTracking=${isTracking}, status=${status}, approvals=${approvals.length}, threshold=${threshold}, isMember=${isMember}, hasApproved=${hasApproved}`
  );

  const isTerminal =
    status === "Executed" || status === "Rejected" || status === "Cancelled";
  const isError = status === "Rejected" || status === "Cancelled";

  const canApprove =
    isMember &&
    !hasApproved &&
    (status === "Active" || status === "Draft") &&
    !isActing;

  const canExecute =
    isMember && status === "Approved" && !isActing;

  const handleApprove = async () => {
    setActionError(null);
    try {
      await approveProposal();
      toast({
        title: "Proposal approved",
        description: "Your approval has been recorded on-chain.",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Approve failed";
      setActionError(msg);
      toast({
        title: "Approval failed",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const handleExecute = async () => {
    setActionError(null);
    try {
      await executeProposal();
      toast({
        title: "Proposal executed",
        description: "The transaction has been executed on-chain.",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Execute failed";
      setActionError(msg);
      toast({
        title: "Execution failed",
        description: msg,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isTracking} onOpenChange={(open) => !open && dismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Multisig Proposal
            {proposal && <StatusBadge status={status} />}
          </DialogTitle>
          <DialogDescription>
            {proposal?.memo || "Waiting for multisig approval and execution."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isError ? (
            <div className="text-center py-4">
              <p className="text-destructive font-medium text-lg mb-1">
                Proposal {status}
              </p>
              <p className="text-sm text-muted-foreground">
                This proposal was {status.toLowerCase()} and will not be
                executed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Approval countdown */}
              <ApprovalCountdown
                approvals={approvals.length}
                threshold={threshold}
                status={status}
              />

              {/* Stepper */}
              <div className="space-y-3">
                {STEPS.map((step) => {
                  const state = getStepState(step.key, status);
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <StepIndicator state={state} />
                      <p
                        className={`text-sm font-medium ${
                          state === "pending"
                            ? "text-muted-foreground/50"
                            : ""
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action buttons */}
              {!isTerminal && isMember && (
                <div className="flex gap-2 pt-2">
                  {canApprove && (
                    <Button
                      onClick={handleApprove}
                      disabled={isActing}
                      loading={isActing}
                      size="sm"
                    >
                      Approve
                    </Button>
                  )}
                  {hasApproved && status === "Active" && (
                    <p className="text-xs text-muted-foreground self-center">
                      ✓ You approved — waiting for others
                    </p>
                  )}
                  {canExecute && (
                    <Button
                      onClick={handleExecute}
                      disabled={isActing}
                      loading={isActing}
                      size="sm"
                      variant="primary"
                    >
                      Execute
                    </Button>
                  )}
                </div>
              )}

              {/* Error display */}
              {(error || actionError) && (
                <p className="text-xs text-destructive">
                  {actionError || error}
                </p>
              )}

              {/* Info text */}
              {!isTerminal && !isMember && (
                <p className="text-xs text-muted-foreground text-center">
                  Approve and execute this proposal in your Squads multisig to
                  continue.
                </p>
              )}

              {status === "Executed" && (
                <p className="text-xs text-green-600 text-center font-medium">
                  Transaction executed successfully!
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between gap-2">
          {proposal?.proposalUrl && (
            <a
              href={proposal.proposalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                View on Squads
              </Button>
            </a>
          )}
          <Button
            variant={isTerminal ? "primary" : "ghost"}
            size="sm"
            onClick={dismiss}
            className="ml-auto"
          >
            {isTerminal ? "Close" : "Dismiss"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
