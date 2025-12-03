import { FormatType } from "../../domain/types";

export const formatValue = (
  value: unknown,
  format: FormatType | null
): string | number => {
  if (format === null || value === null || value === undefined) {
    return value as string | number;
  }

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return value as string;
  }

  switch (format) {
    case "percentage":
      return `${(numValue * 100).toFixed(2)}%`;

    case "integer":
      return Math.round(numValue).toString();

    case "compact":
      return new Intl.NumberFormat("en-US", {
        notation: "compact",
        compactDisplay: "short",
      }).format(numValue);

    default:
      const decimalMatch = format.match(/^decimal-(\d+)$/);
      if (decimalMatch) {
        const decimals = parseInt(decimalMatch[1]);
        return numValue.toFixed(decimals);
      }

      return value as string | number;
  }
};
