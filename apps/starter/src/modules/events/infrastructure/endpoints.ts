export const endpoints = {
  getEventsOverview: (params?: {
    limit?: number;
    resolved_only?: boolean;
    pending_only?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", String(params.limit));
    if (params?.resolved_only) searchParams.set("resolved_only", "true");
    if (params?.pending_only) searchParams.set("pending_only", "true");
    const qs = searchParams.toString();
    return `/events/overview${qs ? `?${qs}` : ""}`;
  },
};
