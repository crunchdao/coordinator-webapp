import { Cereal } from "@crunch-ui/icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maintenance",
  description:
    "We are currently undergoing maintenance. Please check back later.",
};

export default function Maintenance() {
  return (
    <main className="w-full flex items-center justify-center min-h-dvh">
      <section className="container h-full flex flex-col items-center justify-center text-center gap-4">
        <div className="flex items-center gap-2 text-3xl">
          <Cereal />
        </div>
        <p className="body text-muted-foreground max-w-80">
          We are currently undergoing maintenance. Please check back later.
        </p>
      </section>
    </main>
  );
}
