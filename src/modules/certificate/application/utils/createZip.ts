import JSZip from "jszip";
import { CertificateData, SignedMessage } from "../../domain/types";

export async function createCertificateZip(
  certificateData: CertificateData,
  signedMessage: SignedMessage
): Promise<Blob> {
  const zip = new JSZip();

  zip.file("ca.crt", certificateData.caCert);
  zip.file("tls.key", certificateData.tlsKey);
  zip.file("tls.crt", certificateData.tlsCert);
  zip.file("coordinator_msg.json", JSON.stringify(signedMessage, null, 2));

  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
