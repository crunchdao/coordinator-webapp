"use client";
import { useEffect } from "react";
import { Button } from "@crunch-ui/core";
import { Cereal, House, Refresh } from "@crunch-ui/icons";
import Link from "next/link";
import { INTERNAL_LINKS } from "@coordinator/utils/src/routes";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRefresh = () => {
    reset();
  };

  return (
    <main className="flex items-center justify-center min-h-dvh w-full">
      <section className="container h-full flex flex-col items-center justify-center text-center gap-4">
        <div className="flex items-center gap-2 text-3xl">
          <Cereal />
        </div>
        <p className="body text-muted-foreground max-w-80">
          It seems that there is an error. Please try again later or contact our
          support team.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary" onClick={handleRefresh}>
            <Refresh /> Refresh
          </Button>
          <Link href={INTERNAL_LINKS.ROOT}>
            <Button className="gap-2">
              <House /> Return Home
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
