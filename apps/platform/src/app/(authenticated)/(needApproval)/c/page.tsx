import { Metadata } from "next";
import { CompetitionsContent } from "./content";

export const metadata: Metadata = {
  title: "Crunches",
};

export default function CompetitionsPage() {
  return <CompetitionsContent />;
}
