import { api } from "../system";

export type NoCodeResponse = {
  id: string;
  content: string;
  modificationName: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateNoCodeRequest = {
  content: string;
  modificationName: string;
  description: string;
};

export const getNoCodeContent = async (): Promise<NoCodeResponse> => {
  const response = await api.get("/no-code");
  return response.data;
};

export const createNoCodeContent = async (body: CreateNoCodeRequest): Promise<NoCodeResponse> => {
  const response = await api.post("/no-code", body);
  return response.data;
};
