export interface CertificateData {
  caCert: string;
  tlsKey: string;
  tlsCert: string;
  certPub: string;
}

export interface SignedMessage {
  message_b64: string;
  wallet_pubkey_b58: string;
  signature_b64: string;
}

export interface EnrollmentResult {
  certificateData: CertificateData;
  signedMessage: SignedMessage;
}
