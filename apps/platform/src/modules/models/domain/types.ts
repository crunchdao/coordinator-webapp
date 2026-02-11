export type DesiredState = "START" | "STOP";
export type HardwareType = "CPU" | "GPU";
export type ModelHost = "PHALA" | "AWSECS";

export interface CoordinatorCertificate {
  address: string;
  certHash: string;
  certHashSecondary: string | null;
  primaryUpdatedAt: string | null;
  secondaryUpdatedAt: string | null;
}

export interface Model {
  id: string;
  modelId: string;
  address: string;
  submissionId: string;
  resourceId: string;
  hardwareType: HardwareType;
  modelHost: ModelHost;
  metadata: Record<string, unknown>;
  signature: string;
  owner: string;
}

export interface ModelState {
  desiredState: DesiredState;
  crunchPubKey: string;
  crunchName: string;
  model: Model;
  cruncherPubKey: string;
  cruncherSmpHotkey: string | null;
  coordinatorSmpHotkey: string | null;
  cruncherWalletPubkey: string | null;
  coordinatorWalletPubkey: string | null;
  coordinatorCertificate: CoordinatorCertificate | null;
}

export interface GetModelStatesParams {
  crunchNames?: string[];
}
