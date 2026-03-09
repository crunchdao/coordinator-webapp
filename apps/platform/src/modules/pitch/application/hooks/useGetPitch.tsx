import { useQuery } from "@tanstack/react-query";
import { getPitch } from "../../infrastructure/service";

export const useGetPitch = (
  seasonNumber: number | undefined,
  pitchName: string | undefined
) => {
  const query = useQuery({
    queryKey: ["pitch", seasonNumber, pitchName],
    queryFn: () => getPitch(seasonNumber as number, pitchName as string),
    enabled: !!seasonNumber && !!pitchName,
  });

  return {
    pitch: query.data,
    pitchLoading: query.isLoading,
  };
};
