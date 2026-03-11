"use client";

import { useMemo } from "react";
import { Combobox } from "@crunch-ui/core";
import type { MetricsModelItem } from "../domain/types";

interface ModelSelectorProps {
  models: MetricsModelItem[];
  value: string | undefined;
  onChange: (value: string) => void;
}

export function ModelSelector({ models, value, onChange }: ModelSelectorProps) {
  const options = useMemo(
    () =>
      models.map((model) => ({
        value: String(model.model_id),
        label: `${model.cruncher_name}/${model.model_name}`,
      })),
    [models]
  );

  return (
    <Combobox
      options={options}
      value={value}
      onChange={onChange}
      messages={{
        noOptions: "No models found",
        selectOption: "Select a model",
        search: "Search models...",
      }}
      width="280px"
    />
  );
}
