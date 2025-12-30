import apiClient from "@/utils/api";
import { endpoints } from "./endpoints";
import { Model, AddModelBody, UpdateModelBody } from "../domain/types";

export const addModel = async (data: AddModelBody): Promise<Model> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === "files" && Array.isArray(value)) {
        (value as File[]).forEach((file) => formData.append("files", file));
      } else {
        formData.append(key, value as string);
      }
    }
  });

  const response = await apiClient.post(endpoints.addModel(), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getModels = async (): Promise<Model[]> => {
  const response = await apiClient.get(endpoints.getModels());
  return response.data;
};

export const updateModel = async (
  modelId: string,
  data: UpdateModelBody
): Promise<Model> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (key === "files" && Array.isArray(value)) {
        if (value.length > 0) {
          (value as File[]).forEach((file) => formData.append("files", file));
        }
      } else {
        formData.append(key, value as string);
      }
    }
  });

  const response = await apiClient.patch(
    endpoints.updateModel(modelId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteModel = async (modelId: string): Promise<void> => {
  await apiClient.delete(endpoints.deleteModel(modelId));
};
