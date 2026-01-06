import { Metadata } from "next";
import { PitchForm } from "@/modules/pitch/ui/pitchForm";

export const metadata: Metadata = {
  title: "Pitch",
  description: "Create and manage your pitch presentation",
};

export default function PitchPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <PitchForm />
    </div>
  );
}
