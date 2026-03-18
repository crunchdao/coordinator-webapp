"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";
import type { Environment } from "../domain/types";

interface EnvironmentSelectorProps {
  environments: Environment[];
  value?: string;
  onChange: (name: string) => void;
}

export function EnvironmentSelector({
  environments,
  value,
  onChange,
}: EnvironmentSelectorProps) {
  if (environments.length === 0) return null;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select environment" />
      </SelectTrigger>
      <SelectContent>
        {environments.map((env) => (
          <SelectItem key={env.name} value={env.name}>
            {env.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
