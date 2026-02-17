"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";
import { BackfillFeed, StartBackfillRequest } from "../domain/types";

export function feedLabel(feed: {
  source: string;
  subject: string;
  kind: string;
  granularity: string;
}) {
  return [feed.source, feed.subject, feed.kind, feed.granularity]
    .filter(Boolean)
    .join(" / ");
}

export function feedKey(feed: BackfillFeed) {
  return `${feed.source}|${feed.subject}|${feed.kind}|${feed.granularity}`;
}

interface StartBackfillCardProps {
  feeds: BackfillFeed[];
  hasRunningJob: boolean;
  onStart: (request: StartBackfillRequest) => void;
  startLoading: boolean;
}

export function StartBackfillCard({
  feeds,
  hasRunningJob,
  onStart,
  startLoading,
}: StartBackfillCardProps) {
  const [selectedFeedKey, setSelectedFeedKey] = useState<string>("");

  const defaultEnd = new Date().toISOString().slice(0, 16);
  const defaultStart = new Date(Date.now() - 30 * 86400000)
    .toISOString()
    .slice(0, 16);
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const selectedFeed = useMemo(
    () => feeds.find((f) => feedKey(f) === selectedFeedKey),
    [feeds, selectedFeedKey]
  );

  const handleStart = () => {
    if (!selectedFeed) return;
    onStart({
      source: selectedFeed.source,
      subject: selectedFeed.subject,
      kind: selectedFeed.kind,
      granularity: selectedFeed.granularity,
      start: new Date(startDate).toISOString(),
      end: new Date(endDate).toISOString(),
    });
  };

  const disabled = hasRunningJob || startLoading || !selectedFeed;

  return (
    <Card displayCorners>
      <CardHeader>
        <CardTitle>Start Backfill</CardTitle>
        <CardDescription>
          Export historical feed data to Parquet files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Feed</Label>
            <Select value={selectedFeedKey} onValueChange={setSelectedFeedKey}>
              <SelectTrigger>
                <SelectValue placeholder="Select a feed..." />
              </SelectTrigger>
              <SelectContent>
                {feeds.map((feed) => {
                  const key = feedKey(feed);
                  return (
                    <SelectItem key={key} value={key}>
                      {feedLabel(feed)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>Start</Label>
              <Input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End</Label>
              <Input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Button
            onClick={handleStart}
            disabled={disabled}
            loading={startLoading}
          >
            Start Backfill
          </Button>
          {hasRunningJob && (
            <span className="text-sm text-muted-foreground">
              A backfill job is already running
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
