"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
  Spinner,
  Badge,
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
  // "Executing" counts as active for "Approved" step
  if (stepKey === "Approved" && currentStatus === "Executing") return "done";
  if (stepKey === "Executed" && currentStatus === "Executing") return "active";
  return "pending";
}

function StepIndicator({
  state,
}: {
  state: "done" | "active" | "pending";
}) {
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

export const MultisigProposalTrackerDialog: React.FC = () => {
  const { trackingState, dismiss, isTracking } = useMultisigProposalTracker();
  const { proposal, status, approvals, threshold } = trackingState;

  const isTerminal =
    status === "Executed" ||
    status === "Rejected" ||
    status === "Cancelled";
  const isError = status === "Rejected" || status === "Cancelled";

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
              {/* Stepper */}
              <div className="space-y-3">
                {STEPS.map((step, index) => {
                  const state = getStepState(step.key, status);
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <StepIndicator state={state} />
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            state === "pending"
                              ? "text-muted-foreground/50"
                              : ""
                          }`}
                        >
                          {step.label}
                        </p>
                        {step.key === "Active" && threshold > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {approvals.length} of {threshold} approval
                            {threshold !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className="hidden" /> 
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Info text */}
              {!isTerminal && (
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
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={proposal.proposalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Squads
              </a>
            </Button>
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
