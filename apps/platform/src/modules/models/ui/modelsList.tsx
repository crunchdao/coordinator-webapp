"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@crunch-ui/core";
import { useCrunchContext } from "@/modules/crunch/application/context/crunchContext";
import { useGetModelStates } from "../application/hooks/useGetModelStates";
import { ModelStatesTable } from "./modelStatesTable";

export function ModelsList() {
  const { crunchName } = useCrunchContext();
  const { modelStates, modelStatesLoading } = useGetModelStates({
    crunchNames: [crunchName],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Models</CardTitle>
        <CardDescription>
          {modelStates.length} model(s) deployed on the Crunch Protocol
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ModelStatesTable data={modelStates} loading={modelStatesLoading} />
      </CardContent>
    </Card>
  );
}
