import { Spinner } from "@crunch-ui/core";

export default function Loading() {
  return (
    <div className="w-screen h-screen bg-background flex items-center justify-center">
      <Spinner />
    </div>
  );
}
