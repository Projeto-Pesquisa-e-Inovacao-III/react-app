import type { PersonalDTO } from "../models/personal";
import type { TimeSlot } from "../routes/Personal/SetAvailability/SetAvailability";
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

export function getPersonalHours(personalId: number, date: string, classType: string) {
    return api.get(`/personais/${personalId}/horarios-disponiveis`, { params: {data: date, tipoAula: classType} });
}

export async function getPersonalCronogram() {
    return await api.get(`/personais/me/cronograma`);
}

export function updatePersonalCronogram(data: TimeSlot, id: string) {
    return api.put(`/personais/horarios/${id}`, data);
}

export function updateBuffer(buffer: string) {
    return api.put(`personais/me/buffer`,  { bufferMinutos: buffer });
}

export function getPersonalBuffer() {
    return api.get(`personais/me/buffer`);
}