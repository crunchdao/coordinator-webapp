import apiClient from "@/utils/api";
import { endpoints } from "./endpoints";
import { Model, AddModelBody, UpdateModelBody } from "../domain/types";

export const addModel = async (data: AddModelBody): Promise<Model> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("file", data.file);
  formData.append("desiredState", data.desiredState);

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
  modelId: number,
  data: UpdateModelBody
): Promise<Model> => {
  const response = await apiClient.patch(endpoints.updateModel(modelId), data);
  return response.data;
};

export const deleteModel = async (modelId: number): Promise<void> => {
  await apiClient.delete(endpoints.deleteModel(modelId));
};
