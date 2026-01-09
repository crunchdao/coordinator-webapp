import { getCrunchDecimals } from "@crunchdao/sdk";

export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export const CRUNCH_DECIMALS = getCrunchDecimals();

export const convertToCrunch = (amount: number) => {
  return amount / Math.pow(10, CRUNCH_DECIMALS);
};

export const convertFromCrunch = (amount: number) => {
  return BigInt(Math.floor(amount * Math.pow(10, CRUNCH_DECIMALS)));
};

export const formatCrunchValue = (
  value: number | undefined | null,
  showCurrency = false
): string => {
  const formattedValue = (value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return showCurrency ? `${formattedValue} CRNCH` : formattedValue;
};
