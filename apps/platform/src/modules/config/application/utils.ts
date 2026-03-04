import { EnvironmentsEditorFormData } from "../domain/schemas";
import { CompetitionEnvironments } from "../domain/types";

export function toRecord(
  data: EnvironmentsEditorFormData
): CompetitionEnvironments {
  const record: CompetitionEnvironments = {};
  for (const entry of data.environments) {
    if (entry.name) {
      record[entry.name] = {
        address: entry.target.address,
        network: entry.target.network,
        rpcUrl: entry.target.rpcUrl || undefined,
        hubUrl: entry.target.hubUrl || undefined,
      };
    }
  }
  return record;
}
