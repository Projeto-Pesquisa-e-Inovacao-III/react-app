import { api } from "../system";

export type NoCodeResponse = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export const getNoCodeContent = async (): Promise<NoCodeResponse> => {
  const response = await api.get("/no-code");
  return response.data;
};

export const createNoCodeContent = async (content: string, modificationName: string, description: string): Promise<NoCodeResponse> => {
  const response = await api.post("/no-code", { content, modificationName, description });
  return response.data;
};

export const updateNoCodeContent = async (id: string, content: string): Promise<NoCodeResponse> => {
  const response = await api.put("/no-code", { id, content });
  return response.data;
};
