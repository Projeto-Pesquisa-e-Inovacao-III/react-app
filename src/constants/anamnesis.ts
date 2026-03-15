import type { AnamnesisData } from "../models/anamnesis";
import { api } from "../system";


export function createAnamnesis(data: AnamnesisData) {
   return api.post(`/anamnesis`, data)
}