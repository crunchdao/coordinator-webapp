import { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "@crunch-ui/icons";
import { ApplicationForm } from "@coordinator/crunch/src/ui/applicationForm";

export const metadata: Metadata = {
  title: "Organizers Application",
  description: "Apply to become an organizer on the platform.",
};

export default async function OrganizersApplyPage() {
  return (
    <section className="w-fit px-6 mx-auto">
      <div className="max-w-2xl mx-auto py-6 space-y-3 text-center">
        <h2 className="text-foreground body-lg">Become a Coordinator</h2>
        <p className="text-muted-foreground body-sm">
          Launch your own predictive challenges and tap into 10,000+ ML
          engineers and 1,200+ PhDs.
          <br />
          You define the problem and set the rewards. Crunch handles everything
          else.
        </p>
        <Link
          href="https://protocol.crunchdao.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline body-sm"
        >
          Explore the Coordinator role
          <ExternalLink className="inline ml-1 mb-1" />
        </Link>
      </div>
      <ApplicationForm />
    </section>
  );
}
