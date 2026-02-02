import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@crunch-ui/core";

interface FormatSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export const FormatSelect: React.FC<FormatSelectProps> = ({
  value,
  onValueChange,
  placeholder = "Select format...",
}) => {
  return (
    <Select onValueChange={onValueChange} value={value || undefined}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="percentage">Percentage (50.00%)</SelectItem>
        <SelectItem value="integer">Integer (1,000,000)</SelectItem>
        <SelectItem value="compact">Compact (1M)</SelectItem>
        <SelectItem value="decimal-1">1 Decimal (1.0)</SelectItem>
        <SelectItem value="decimal-2">2 Decimals (1.00)</SelectItem>
        <SelectItem value="decimal-3">3 Decimals (1.000)</SelectItem>
        <SelectItem value="decimal-4">4 Decimals (1.0000)</SelectItem>
      </SelectContent>
    </Select>
  );
};
