type Env = "development" | "production" | "test";

function directivesToString(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([k, v]) => `${k} ${v.join(" ")}`)
    .join("; ");
}

const CUSTOM_RPC_URL = (process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string) || "";

export function buildCspValue(env: Env, reportOnly: boolean) {
  const isDev = env !== "production";

  const d: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'unsafe-inline'",
      "'self'",
      "https://challenges.cloudflare.com",
      "https://*.nr-data.net",
      "https://*.amplitude.com",
      "https://vercel.live",
      "https://snap.licdn.com",
      "https://www.googletagmanager.com",
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": [
      "'self'",
      "https://*.gitbook.io",
      "https://crunchdao--account--staging.s3-accelerate.amazonaws.com/",
      "https://crunchdao--account--production.s3-accelerate.amazonaws.com/",
      "https://crunchdao--account--development.s3-accelerate.amazonaws.com/",
      "https://crunchdao--competition--staging.s3-accelerate.amazonaws.com/",
      "https://crunchdao--competition--development.s3-accelerate.amazonaws.com/",
      "https://crunchdao--competition--production.s3-accelerate.amazonaws.com/",
      "https://wikimedia.org/api/rest_v1/media/math/",
      "https://www.linkedin.com/px",
      "https://px.ads.linkedin.com",
      "https://www.googletagmanager.com",
      "data:",
      "blob:",
    ],
    "font-src": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'self'", "https://auth.privy.io"],
    "child-src": [
      "https://auth.privy.io",
      "https://verify.walletconnect.com",
      "https://verify.walletconnect.org",
    ],
    "frame-src": [
      "https://vercel.live",
      "https://auth.privy.io",
      "https://verify.walletconnect.com",
      "https://verify.walletconnect.org",
      "https://challenges.cloudflare.com",
    ],
    "connect-src": [
      "'self'",
      "https://api.privy.io",
      "https://auth.privy.io",
      "wss://relay.walletconnect.com",
      "wss://relay.walletconnect.org",
      "wss://www.walletlink.org",
      "https://*.rpc.privy.systems",
      "https://explorer-api.walletconnect.com",
      "https://api.mainnet-beta.solana.com",
      "https://api.devnet.solana.com",
      "https://api.testnet.solana.com",
      "wss://api.mainnet-beta.solana.com",
      "wss://api.devnet.solana.com",
      "wss://api.testnet.solana.com",
      "https://*.nr-data.net",
      "https://*.amplitude.com",
      "https://px.ads.linkedin.com",
      "https://crunchdao--account--staging.s3-accelerate.amazonaws.com/",
      "https://crunchdao--account--production.s3-accelerate.amazonaws.com/",
      "https://crunchdao--account--development.s3-accelerate.amazonaws.com/",
      "https://crunchdao--competition--staging.s3-accelerate.amazonaws.com/",
      "https://crunchdao--competition--development.s3-accelerate.amazonaws.com/",
      "https://crunchdao--competition--production.s3-accelerate.amazonaws.com/",
      "https://www.googletagmanager.com",
      "wss://deni-o6ejfm-fast-devnet.helius-rpc.com",
      "wss://jessica-ana80z-fast-mainnet.helius-rpc.com",
      CUSTOM_RPC_URL,
    ],
    "worker-src": ["'self'", ...(isDev ? ["blob:"] : [])],
    "manifest-src": ["'self'"],
  };

  const value = directivesToString(d);
  const headerName = reportOnly
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";
  return { headerName, value };
}
