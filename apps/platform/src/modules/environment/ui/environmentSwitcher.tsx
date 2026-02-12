"use client";

import { useEnvironment } from "../application/context/environmentContext";
import type { Environment } from "@/config";

const environments: { value: Environment; label: string }[] = [
  { value: "staging", label: "Staging" },
  { value: "production", label: "Production" },
];

export const EnvironmentSwitcher: React.FC = () => {
  const { environment, switchEnvironment } = useEnvironment();

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-muted p-0.5 text-xs">
      {environments.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => switchEnvironment(value)}
          className={`rounded px-2.5 py-1 font-medium transition-colors cursor-pointer ${
            environment === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
