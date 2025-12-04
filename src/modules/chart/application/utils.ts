import { theme } from "@crunch-ui/utils";

export const VIOLETS_COLORS = [
  theme.colors.violet[900],
  theme.colors.violet[800],
  theme.colors.violet[700],
  theme.colors.violet[600],
  theme.colors.violet[500],
];

export const ORANGE_COLORS = [
  theme.colors.orange[300],
  theme.colors.orange[500],
  theme.colors.orange[700],
  theme.colors.orange[800],
  theme.colors.orange[900],
];

export const RANDOM_COLORS = [
  theme.colors.blue[400],
  theme.colors.green[400],
  theme.colors.red[400],
  theme.colors.orange[400],
  theme.colors.yellow[400],
  theme.colors.lime[400],
  theme.colors.teal[300],
  theme.colors.sky[400],
  theme.colors.violet[400],
  theme.colors.blue[300],
  theme.colors.green[300],
  theme.colors.red[300],
  theme.colors.orange[300],
  theme.colors.yellow[300],
  theme.colors.lime[300],
  theme.colors.teal[200],
  theme.colors.sky[300],
  theme.colors.violet[300],
  theme.colors.blue[200],
  theme.colors.green[200],
  theme.colors.red[200],
];

export const RGBW_COLORS = {
  red: theme.colors.red[400],
  green: theme.colors.green[400],
  blue: theme.colors.blue[400],
  white: theme.colors.neutral[50],
};

export function formatYAxisValue(value: unknown, format?: string): string {
  if (!format || value === null || value === undefined) {
    return String(value);
  }

  const numValue = Number(value);
  if (isNaN(numValue)) {
    return String(value);
  }

  if (format === "percentage") {
    return `${numValue}%`;
  }

  if (format.startsWith("currency:")) {
    const symbol = format.substring(9);
    return `${symbol}${numValue.toLocaleString()}`;
  }

  if (format.startsWith("decimal:")) {
    const precision = parseInt(format.substring(8), 10);
    if (!isNaN(precision)) {
      return numValue.toFixed(precision);
    }
  }

  if (format === "number") {
    return numValue.toLocaleString();
  }

  return String(value);
}
