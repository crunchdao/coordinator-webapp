import { Metadata } from "next";
import { PitchForm } from "@/modules/pitch/ui/pitchForm";

export const metadata: Metadata = {
  title: "Pitch",
  description: "Create and manage your pitch presentation",
};

export default function PitchPage() {
  return <PitchForm />;
}
