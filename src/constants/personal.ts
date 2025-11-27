import type { PersonalDTO } from "../models/personal";
import { api } from "../system";

export function listStudents() {
    return api.get(`/alunos`);
}

export function editPersonalProfile(data: PersonalDTO) {
    return api.put(`/personais/me`, data);
}

export function appoitmentsCount(payload?: { status: string; data?: string; }) {
    return api.post(`/agendamentos/contagem-status-data`, payload);
}

