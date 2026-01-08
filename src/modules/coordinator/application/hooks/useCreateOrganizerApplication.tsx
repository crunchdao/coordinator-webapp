import { useMutation } from "@tanstack/react-query";
import { createOrganizerApplication } from "../../infrastructure/service";
import { OrganizerApplicationPayload } from "../../domain/types";

interface CreateApplicationParams {
  payload: OrganizerApplicationPayload;
  reCaptchaResponse: string;
}

export const useCreateOrganizerApplication = () => {
  const mutation = useMutation({
    mutationFn: ({ payload, reCaptchaResponse }: CreateApplicationParams) =>
      createOrganizerApplication(payload, reCaptchaResponse),
  });

  return {
    createOrganizerApplication: mutation.mutate,
    createOrganizerApplicationAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
};
