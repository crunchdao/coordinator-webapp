import { describe, it, expect } from "vitest";
import { buildCspValue } from "./csp";

describe("buildCspValue", () => {
  it("returns correct header name for non-report-only mode", () => {
    const { headerName } = buildCspValue("production", false);
    expect(headerName).toBe("Content-Security-Policy");
  });

  it("returns report-only header name when reportOnly is true", () => {
    const { headerName } = buildCspValue("production", true);
    expect(headerName).toBe("Content-Security-Policy-Report-Only");
  });

  it("includes default-src 'self'", () => {
    const { value } = buildCspValue("production", false);
    expect(value).toContain("default-src 'self'");
  });

  it("includes script-src directives", () => {
    const { value } = buildCspValue("production", false);
    expect(value).toContain("script-src");
    expect(value).toContain("'unsafe-inline'");
    expect(value).toContain("https://challenges.cloudflare.com");
  });

  it("includes frame-ancestors with privy", () => {
    const { value } = buildCspValue("production", false);
    expect(value).toContain("frame-ancestors 'self' https://auth.privy.io");
  });

  it("includes object-src 'none'", () => {
    const { value } = buildCspValue("production", false);
    expect(value).toContain("object-src 'none'");
  });

  it("includes blob: in worker-src for development", () => {
    const { value } = buildCspValue("development", false);
    expect(value).toMatch(/worker-src.*blob:/);
  });

  it("does not include blob: in worker-src for production", () => {
    const { value } = buildCspValue("production", false);
    const workerSrc = value
      .split(";")
      .find((d: string) => d.trim().startsWith("worker-src"));
    expect(workerSrc).not.toContain("blob:");
  });

  it("includes solana RPC endpoints in connect-src", () => {
    const { value } = buildCspValue("production", false);
    expect(value).toContain("https://api.mainnet-beta.solana.com");
    expect(value).toContain("https://api.devnet.solana.com");
  });

  it("value is semicolon-separated directives", () => {
    const { value } = buildCspValue("production", false);
    const directives = value.split(";").map((d: string) => d.trim());
    expect(directives.length).toBeGreaterThan(5);
    // Each directive should have a key and at least one value
    for (const directive of directives) {
      expect(directive.split(" ").length).toBeGreaterThanOrEqual(2);
    }
  });
});
