import { api } from "../system";

export type NoCodeResponse = {
  id: string;
  content: string;
  modificationName: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  restoredFromId: string | null;
};

export type CreateNoCodeRequest = {
  content: string;
  modificationName: string;
  description: string;
};

export type NoCodeHistoryPage = {
  content: NoCodeResponse[];
  page: {
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
};

export const getNoCodeContent = async (): Promise<NoCodeResponse> => {
  const response = await api.get("/no-code");
  return response.data;
};

export const createNoCodeContent = async (body: CreateNoCodeRequest): Promise<NoCodeResponse> => {
  const response = await api.post("/no-code", body);
  return response.data;
};

export const getNoCodeHistory = async (
  page = 0,
  size = 10,
): Promise<NoCodeHistoryPage> => {
  const response = await api.get("/no-code/history", { params: { page, size } });
  return response.data;
};

export const restoreNoCodeContent = async (id: string): Promise<NoCodeResponse> => {
  const response = await api.post(`/no-code/restore/${id}`);
  return response.data;
};

export const deleteNoCodeContent = async (id: string): Promise<void> => {
  await api.delete(`/no-code/${id}`);
};

export const renameNoCodeContent = async (
  id: string,
  modificationName: string,
): Promise<NoCodeResponse> => {
  const response = await api.patch(`/no-code/${id}`, { modificationName });
  return response.data;
};
