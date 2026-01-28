import { useMutation } from "@tanstack/react-query";
import { toast } from "@crunch-ui/core";
import { useWallet } from "@/modules/wallet/application/context/walletContext";
import {
  CertificateData,
  SignedMessage,
  EnrollmentResult,
} from "../../domain/types";
import {
  createCertificateZip,
  downloadBlob,
} from "../utils/createZip";

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

type EnrollmentStep =
  | "idle"
  | "generating"
  | "fetching_hotkey"
  | "signing"
  | "downloading"
  | "complete";

export const useEnrollCertificate = () => {
  const { publicKey, signMessage } = useWallet();

  const mutation = useMutation({
    mutationFn: async (): Promise<EnrollmentResult> => {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }

      if (!signMessage) {
        throw new Error("Wallet does not support message signing");
      }

      const certResponse = await fetch("/api/certificate/generate", {
        method: "POST",
      });

      if (!certResponse.ok) {
        const error = await certResponse.json();
        throw new Error(error.error || "Failed to generate certificate");
      }

      const certificateData: CertificateData = await certResponse.json();

      const walletAddress = publicKey.toBase58();
      const hotkeyResponse = await fetch(
        `/api/certificate/hotkey?wallet=${encodeURIComponent(walletAddress)}`
      );

      if (!hotkeyResponse.ok) {
        const error = await hotkeyResponse.json();
        throw new Error(error.error || "Failed to fetch hotkey");
      }

      const { hotkey } = await hotkeyResponse.json();

      const message = JSON.stringify({
        cert_pub: certificateData.certPub,
        hotkey: hotkey,
      });
      const messageBytes = new TextEncoder().encode(message);

      const signature = await signMessage(messageBytes);

      const signedMessage: SignedMessage = {
        message_b64: uint8ArrayToBase64(messageBytes),
        wallet_pubkey_b58: walletAddress,
        signature_b64: uint8ArrayToBase64(signature),
      };

      const zipBlob = await createCertificateZip(certificateData, signedMessage);
      downloadBlob(zipBlob, "issued-certificate.zip");

      return {
        certificateData,
        signedMessage,
      };
    },
    onSuccess: () => {
      toast({
        title: "Certificate enrolled successfully",
        description: "Your certificate files have been downloaded.",
      });
    },
    onError: (error) => {
      console.error("Certificate enrollment error:", error);
      toast({
        title: "Failed to enroll certificate",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const getStep = (): EnrollmentStep => {
    if (!mutation.isPending) {
      return mutation.isSuccess ? "complete" : "idle";
    }
    return "generating";
  };

  return {
    enroll: mutation.mutate,
    enrollAsync: mutation.mutateAsync,
    isEnrolling: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    step: getStep(),
    reset: mutation.reset,
  };
};
