import { useQuery } from "@tanstack/react-query";
import { getGlobalSettings } from "../../infrastructure/services";

export const useGlobalSettings = () => {
  const query = useQuery({
    queryKey: ["globalSettings"],
    queryFn: getGlobalSettings,
  });

  return { settings: query.data, settingsLoading: query.isLoading };
};
