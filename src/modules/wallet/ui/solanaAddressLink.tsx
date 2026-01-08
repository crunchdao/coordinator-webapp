import Link from "next/link";
import { truncateAddress } from "@/utils/solana";
import { PublicKey } from "@solana/web3.js";
import { cn } from "@crunch-ui/utils";
import { ExternalLink } from "@crunch-ui/icons";

interface SolanaAddressLinkProps {
  address: PublicKey | string;
  className?: string;
  showIcon?: boolean;
  truncate?: boolean;
}

export function SolanaAddressLink({
  address,
  className,
  showIcon = true,
  truncate = true,
}: SolanaAddressLinkProps) {
  const addressString =
    typeof address === "string" ? address : address.toString();
  const displayAddress = truncate
    ? truncateAddress(addressString)
    : addressString;

  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta";
  const explorerUrl = `https://explorer.solana.com/address/${addressString}${
    network !== "mainnet-beta" ? `?cluster=${network}` : ""
  }`;

  return (
    <Link
      href={explorerUrl}
      target="_blank"
      className={cn(
        "inline-flex items-center gap-1 hover:underline",
        className
      )}
    >
      {displayAddress}
      {showIcon && <ExternalLink className="inline-block h-3 w-3" />}
    </Link>
  );
}
