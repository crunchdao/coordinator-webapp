import { cn } from "@crunch-ui/utils";

export const PulseRing: React.FC<{
  active: boolean;
  className?: string | undefined;
}> = ({ active, className }) => {
  return (
    <span
      className={cn(
        "inline-block w-1.5 h-1.5 min-w-1.5 min-h-1.5 rounded-full animate-[pulse-ring_2s_ease-in-out_infinite]",
        active ? "bg-green-400 text-green-700" : "bg-red-400 text-red-700",
        className
      )}
    />
  );
};
