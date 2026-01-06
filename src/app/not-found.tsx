import Link from "next/link";
import { Cereal, Four, House, Zero } from "@crunch-ui/icons";
import { Button } from "@crunch-ui/core";
import { INTERNAL_LINKS } from "@/utils/routes";

export default async function NotFound() {
  return (
    <div className="justify-center min-h-dvh">
      <section className="container h-full flex flex-col items-center justify-center text-center gap-4">
        <div className="flex items-center gap-2 text-3xl">
          <Cereal />
          <div className="flex items-center -space-x-4">
            <Four />
            <Zero />
            <Four />
          </div>
        </div>
        <p className="body text-muted-foreground max-w-80">
          Sorry, we couldn't find the page you were looking for.
        </p>
        <Link href={INTERNAL_LINKS.ROOT}>
          <Button className="gap-2">
            <House /> Return Home
          </Button>
        </Link>
      </section>
    </div>
  );
}
