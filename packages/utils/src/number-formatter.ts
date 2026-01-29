import { z } from "zod";

export const formatTypeSchema = z.union([
  z.literal("percentage"),
  z.literal("integer"),
  z.literal("compact"),
  z.literal("number"),
  z.string().regex(/^decimal-\d+$/),
]);

export type FormatType = z.infer<typeof formatTypeSchema>;

export function formatNumber(
  value: unknown,
  format: FormatType | null | undefined | string
): string | number {
  if (format === null || format === undefined || value === null || value === undefined) {
    return value as string | number;
  }

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return value as string;
  }

  if (format.startsWith("decimal:")) {
    const precision = parseInt(format.substring(8), 10);
    if (!isNaN(precision)) {
      format = `decimal-${precision}`;
    }
  }

  const locale = "en-US";

  switch (format) {
    case "percentage": {
      return `${(numValue * 100).toFixed(2)}%`;
    }

    case "integer": {
      return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(Math.round(numValue));
    }

    case "compact": {
      return new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
      }).format(numValue);
    }

    case "number": {
      return new Intl.NumberFormat(locale).format(numValue);
    }

    default: {
      const decimalMatch = format.match(/^decimal-(\d+)$/);
      if (decimalMatch) {
        const decimals = parseInt(decimalMatch[1], 10);
        return new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(numValue);
      }

      return value as string | number;
    }
  }
}