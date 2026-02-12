import { NextResponse } from "next/server";
import * as crypto from "crypto";
import { cookies } from "next/headers";
import { getConfigFor, type Environment } from "@/config";

const DEFAULT_DAYS_VALID = 99 * 365;

interface TlsIssueResponse {
  authorityCertificatePemString: string;
  tlsCertificatePemString: string;
}

export async function POST() {
  try {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });

    const publicKeyPem = publicKey.export({
      type: "spki",
      format: "pem",
    }) as string;

    const cookieStore = await cookies();
    const env = (cookieStore.get("coordinator-environment")?.value ?? "staging") as Environment;
    const { hubApiBaseUrl } = getConfigFor(env);
    const response = await fetch(
      `${hubApiBaseUrl}/v1/security-credentials/tls/issue-certificate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tlsPublicKeyPemString: publicKeyPem,
          commonName: "coordinator",
          isClient: true,
          isServer: false,
          sanDns: null,
          daysValid: DEFAULT_DAYS_VALID,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TLS issue error:", errorText);
      return NextResponse.json(
        { error: "Failed to issue TLS certificate", details: errorText },
        { status: response.status }
      );
    }

    const data: TlsIssueResponse = await response.json();

    const tlsKeyPem = privateKey.export({
      type: "pkcs8",
      format: "pem",
    }) as string;

    const cert = new crypto.X509Certificate(data.tlsCertificatePemString);
    const certPubDer = cert.publicKey.export({ type: "spki", format: "der" });
    const certPubB64 = (certPubDer as Buffer).toString("base64");

    return NextResponse.json({
      caCert: data.authorityCertificatePemString,
      tlsKey: tlsKeyPem,
      tlsCert: data.tlsCertificatePemString,
      certPub: certPubB64,
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}
