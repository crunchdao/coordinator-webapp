"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@crunch-ui/core";
import { cn } from "@crunch-ui/utils";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@coordinator/utils/src/api";
import { useGetEventsOverview } from "../application/hooks/useGetEventsOverview";
import type { EventOverview, ModelPrediction } from "../domain/types";

type Filter = "all" | "resolved" | "pending";

type ModelInfo = {
  model_id: string;
  model_name: string;
  cruncher_name: string;
};

function useModelList() {
  return useQuery<ModelInfo[]>({
    queryKey: ["modelList", "/reports/models"],
    queryFn: async () => {
      const res = await apiClient.get("/reports/models");
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export const EventsOverviewPage: React.FC = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { events, total, resolvedCount, pendingCount, loading, refetching } =
    useGetEventsOverview({
      limit: 200,
      resolved_only: filter === "resolved",
      pending_only: filter === "pending",
    });

  // Fetch model list (model_id → cruncher_name mapping)
  const { data: modelList } = useModelList();
  const modelToUser = useMemo(() => {
    const map = new Map<string, string>();
    if (modelList) {
      for (const m of modelList) {
        map.set(String(m.model_id), m.cruncher_name || "");
      }
    }
    return map;
  }, [modelList]);

  // Collect all unique models across events
  const allModels = useMemo(() => {
    const models = new Map<string, string>();
    for (const event of events) {
      for (const pred of event.predictions) {
        if (!models.has(pred.model_id)) {
          models.set(pred.model_id, pred.model_name);
        }
      }
    }
    return Array.from(models.entries())
      .sort(([, a], [, b]) => a.localeCompare(b))
      .map(([id, name]) => ({ id, name }));
  }, [events]);

  // Collect all unique usernames
  const allUsers = useMemo(() => {
    const users = new Set<string>();
    for (const m of allModels) {
      const user = modelToUser.get(m.id);
      if (user) users.add(user);
    }
    return Array.from(users).sort((a, b) => a.localeCompare(b));
  }, [allModels, modelToUser]);

  // Determine which model_ids pass the user filter
  const modelIdsForSelectedUsers = useMemo(() => {
    if (selectedUsers.size === 0) return null; // no user filter active
    const ids = new Set<string>();
    for (const m of allModels) {
      const user = modelToUser.get(m.id);
      if (user && selectedUsers.has(user)) {
        ids.add(m.id);
      }
    }
    return ids;
  }, [allModels, modelToUser, selectedUsers]);

  // Show selected models, or all if none selected — intersect with user filter
  const visibleModels = useMemo(() => {
    let models = allModels;

    // Apply model filter
    if (selectedModels.size > 0) {
      models = models.filter((m) => selectedModels.has(m.id));
    }

    // Apply user filter
    if (modelIdsForSelectedUsers) {
      models = models.filter((m) => modelIdsForSelectedUsers.has(m.id));
    }

    return models;
  }, [allModels, selectedModels, modelIdsForSelectedUsers]);

  const toggleModel = useCallback((modelId: string) => {
    setSelectedModels((prev) => {
      const next = new Set(prev);
      if (next.has(modelId)) next.delete(modelId);
      else next.add(modelId);
      return next;
    });
  }, []);

  const toggleUser = useCallback((username: string) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  }, []);

  return (
    <div className="grid gap-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="Total Events" value={total} loading={loading} />
        <SummaryCard
          label="Resolved"
          value={resolvedCount}
          loading={loading}
          accent="green"
        />
        <SummaryCard
          label="Pending"
          value={pendingCount}
          loading={loading}
          accent="yellow"
        />
      </div>

      {/* Main table */}
      <Card displayCorners>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Event Forecasts</CardTitle>
              {refetching && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Updating…</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* User filter */}
              {allUsers.length > 0 && (
                <CheckboxFilterDropdown
                  label="Users"
                  items={allUsers.map((u) => ({ id: u, name: u }))}
                  selected={selectedUsers}
                  onToggle={toggleUser}
                  onClear={() => setSelectedUsers(new Set())}
                  open={userDropdownOpen}
                  setOpen={(v) => {
                    setUserDropdownOpen(v);
                    if (v) setModelDropdownOpen(false);
                  }}
                  icon="user"
                />
              )}

              {/* Model filter */}
              {allModels.length > 0 && (
                <CheckboxFilterDropdown
                  label="Models"
                  items={allModels}
                  selected={selectedModels}
                  onToggle={toggleModel}
                  onClear={() => setSelectedModels(new Set())}
                  open={modelDropdownOpen}
                  setOpen={(v) => {
                    setModelDropdownOpen(v);
                    if (v) setUserDropdownOpen(false);
                  }}
                  icon="filter"
                />
              )}

              {/* Status filter */}
              <div className="flex items-center gap-1">
                <FilterButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                >
                  All
                </FilterButton>
                <FilterButton
                  active={filter === "resolved"}
                  onClick={() => setFilter("resolved")}
                >
                  Resolved
                </FilterButton>
                <FilterButton
                  active={filter === "pending"}
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </FilterButton>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-48 gap-2 text-muted-foreground">
              <Spinner />
              <span>Loading events…</span>
            </div>
          ) : events.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              No events found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[320px]">Question</TableHead>
                    <TableHead className="text-center w-[80px]">
                      Market
                    </TableHead>
                    {visibleModels.map((col) => (
                      <TableHead
                        key={col.id}
                        className="text-center w-[100px]"
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs">{col.name}</span>
                          {modelToUser.get(col.id) && (
                            <span className="text-[10px] text-muted-foreground">
                              {modelToUser.get(col.id)}
                            </span>
                          )}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-center w-[90px]">
                      Outcome
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <EventRow
                      key={event.event_id}
                      event={event}
                      modelColumns={visibleModels}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ── Reusable Checkbox Filter Dropdown ───────────────────────────────

function CheckboxFilterDropdown({
  label,
  items,
  selected,
  onToggle,
  onClear,
  open,
  setOpen,
  icon,
}: {
  label: string;
  items: { id: string; name: string }[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onClear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  icon: "filter" | "user";
}) {
  return (
    <div className="relative">
      <Button
        variant={selected.size > 0 ? "primary" : "outline"}
        size="sm"
        onClick={() => setOpen(!open)}
        className="text-xs gap-1.5"
      >
        {icon === "filter" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
        {label}
        {selected.size > 0 && (
          <Badge
            variant="secondary"
            size="sm"
            className="ml-0.5 text-[10px] px-1.5 py-0"
          >
            {selected.size}
          </Badge>
        )}
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-full mt-1 z-40 bg-popover border border-border rounded-lg shadow-xl py-1 min-w-[220px] max-h-80 overflow-y-auto">
            {selected.size > 0 && (
              <button
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent/50 border-b border-border"
              >
                Clear filter
              </button>
            )}
            {items.map((item) => {
              const checked = selected.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onToggle(item.id)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent/50 flex items-center gap-2.5 transition-colors"
                >
                  <span
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                      checked
                        ? "bg-primary border-primary"
                        : "border-muted"
                    )}
                  >
                    {checked && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary-foreground"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      checked
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── Event Row ───────────────────────────────────────────────────────

function EventRow({
  event,
  modelColumns,
}: {
  event: EventOverview;
  modelColumns: { id: string; name: string }[];
}) {
  const predByModel = useMemo(() => {
    const map = new Map<string, ModelPrediction>();
    for (const pred of event.predictions) {
      map.set(pred.model_id, pred);
    }
    return map;
  }, [event.predictions]);

  return (
    <TableRow className="group">
      {/* Question */}
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-sm leading-tight">
            {event.title || `Event ${event.event_id}`}
          </span>
          {event.cutoff && (
            <span className="text-xs text-muted-foreground">
              Cutoff: {formatCutoff(event.cutoff)}
            </span>
          )}
        </div>
      </TableCell>

      {/* Market price */}
      <TableCell className="text-center">
        {event.yes_price != null ? (
          <ProbabilityBadge value={event.yes_price} muted />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Model predictions */}
      {modelColumns.map((col) => {
        const pred = predByModel.get(col.id);
        if (!pred || pred.prediction == null) {
          return (
            <TableCell key={col.id} className="text-center">
              <span className="text-muted-foreground text-xs">—</span>
            </TableCell>
          );
        }

        return (
          <TableCell key={col.id} className="text-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-block">
                  <ProbabilityBadge
                    value={pred.prediction}
                    brierScore={pred.brier_score}
                    scored={pred.scored}
                    outcome={event.outcome}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <div className="grid gap-1">
                  <div>
                    <span className="text-muted-foreground">Prediction: </span>
                    <span className="font-mono">
                      {(pred.prediction * 100).toFixed(1)}%
                    </span>
                  </div>
                  {pred.scored && pred.brier_score != null && (
                    <div>
                      <span className="text-muted-foreground">
                        Brier score:{" "}
                      </span>
                      <span className="font-mono">
                        {pred.brier_score.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TableCell>
        );
      })}

      {/* Outcome */}
      <TableCell className="text-center">
        {event.resolved ? (
          <OutcomeBadge outcome={event.outcome} />
        ) : (
          <Badge
            variant="secondary"
            size="sm"
            className="text-yellow-600 dark:text-yellow-400"
          >
            Pending
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
}

// ── Sub-components ──────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  loading,
  accent,
}: {
  label: string;
  value: number;
  loading: boolean;
  accent?: "green" | "yellow";
}) {
  const accentClass =
    accent === "green"
      ? "text-green-600 dark:text-green-400"
      : accent === "yellow"
        ? "text-yellow-600 dark:text-yellow-400"
        : "";

  return (
    <Card displayCorners>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          {loading ? (
            <Spinner />
          ) : (
            <span className={cn("text-2xl font-bold font-mono", accentClass)}>
              {value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant={active ? "primary" : "outline"}
      size="sm"
      onClick={onClick}
      className="text-xs"
    >
      {children}
    </Button>
  );
}

function ProbabilityBadge({
  value,
  muted,
  brierScore,
  scored,
  outcome,
}: {
  value: number;
  muted?: boolean;
  brierScore?: number | null;
  scored?: boolean;
  outcome?: number | null;
}) {
  const pct = (value * 100).toFixed(0);

  let colorClass = "text-foreground";
  if (muted) {
    colorClass = "text-muted-foreground";
  } else if (scored && brierScore != null) {
    if (brierScore <= 0.1) {
      colorClass = "text-green-600 dark:text-green-400";
    } else if (brierScore <= 0.25) {
      colorClass = "text-foreground";
    } else {
      colorClass = "text-red-600 dark:text-red-400";
    }
  } else if (outcome != null) {
    const correct =
      (outcome === 1 && value > 0.5) || (outcome === 0 && value < 0.5);
    colorClass = correct
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-xs font-medium tabular-nums",
        colorClass
      )}
    >
      {pct}%
    </span>
  );
}

function OutcomeBadge({ outcome }: { outcome: number | null }) {
  if (outcome === 1) {
    return (
      <Badge
        variant="secondary"
        size="sm"
        className="text-green-600 dark:text-green-400 font-semibold"
      >
        Yes
      </Badge>
    );
  }
  if (outcome === 0) {
    return (
      <Badge
        variant="secondary"
        size="sm"
        className="text-red-600 dark:text-red-400 font-semibold"
      >
        No
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" size="sm" className="text-muted-foreground">
      Unknown
    </Badge>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────

function formatCutoff(cutoff: string): string {
  if (!cutoff) return "";
  try {
    const date = new Date(cutoff);
    if (Number.isNaN(date.getTime())) return cutoff;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return cutoff;
  }
}
