import { Metadata } from "next";
import { PitchForm } from "@coordinator/pitch/src/ui/pitchForm";

export const metadata: Metadata = {
  title: "Pitch",
  description: "Create and manage your pitch presentation",
};

export default function PitchPage() {
  return <PitchForm />;
}
