import Image from "next/image";
import Link from "next/link";
import { cn } from "@crunch-ui/utils";
import { INTERNAL_LINKS } from "@/utils/routes";

export const BasicNavbar: React.FC = () => {
  const linkClassName =
    "body-sm text-muted-foreground inline-flex items-center gap-1.5 uppercase hover:underline";
  return (
    <nav className="sticky top-0 left-0 right-0 z-40 w-full">
      <div className="py-3 border-b mb-3 z-40 w-full backdrop-blur-sm bg-background/70">
        <div className="container mx-auto flex justify-between">
          <Link href={INTERNAL_LINKS.ROOT}>
            <Image
              priority
              src="/images/crunch-lab-logo.svg"
              alt="Crunch Lab logo"
              width={107}
              height={20}
            />
          </Link>
          <div className="ml-auto flex gap-6">
            <Link
              className={cn(linkClassName)}
              href={INTERNAL_LINKS.LEADERBOARD}
            >
              Leaderboard
            </Link>
            <Link className={cn(linkClassName)} href={INTERNAL_LINKS.METRICS}>
              Metrics
            </Link>
            <Link className={cn(linkClassName)} href={INTERNAL_LINKS.SETTINGS}>
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
