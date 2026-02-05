export interface CertificateData {
  caCert: string;
  tlsKey: string;
  tlsCert: string;
  certPub: string;
}

export interface EnrollmentResult {
  certificateData: CertificateData;
}
