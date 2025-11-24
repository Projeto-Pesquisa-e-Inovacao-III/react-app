import type { PersonalDTO } from "../models/personal";
import { api } from "../system";

export function listStudents() {
    return api.get(`/alunos`);
}

export function editPersonalProfile(data: PersonalDTO) {
    return api.put(`/personais/me`, data);
}