import { useQuery } from "@tanstack/react-query";
import { getPitches } from "../../infrastructure/service";

export const useGetPitches = (seasonNumber: number | undefined) => {
  const query = useQuery({
    queryKey: ["pitches", seasonNumber],
    queryFn: () => getPitches(seasonNumber as number),
    enabled: !!seasonNumber,
  });

  return {
    pitches: query.data,
    pitchesLoading: query.isLoading,
  };
};
