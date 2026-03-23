import type { AnamnesisData } from "../models/anamnesis";
import { api } from "../system";


export function createAnamnesis(data: AnamnesisData) {
   return api.post(`/anamnese`, data)
}

export function updateAnamnesis(data: AnamnesisData) {
   return api.put(`/anamnese`, data)
}

export function getAnamnesis() {
   return api.get(`/anamnese`);
}