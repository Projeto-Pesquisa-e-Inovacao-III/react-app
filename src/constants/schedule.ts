import type { Schedule } from "../models/schedule";
import { api } from "../system";

export function insertAppointment(data: Schedule) {
    return api.post("/agendamentos", data);
}

export function rescheduleAppointment(data: Schedule) {
    return api.put("/agendamentos/reagendar", data);
}

export function concludeAppointment(id: number) {
    return api.put(`/agendamentos/${id}/confirmar-conclusao`);
}

export function refuseAppointment(id: number) {
    return api.delete(`/agendamentos/${id}`);
}

export async function acceptUserAppointment(id: number) {
    return await api.put(`/agendamentos/${id}/aprovar`);
}

export async function reportAbsenceStudent(data: any) {
    return await api.put("/agendamentos/relatar-ausencia/aluno", data);
}

export function reportAbsencePersonal(data: any) {
    return api.put("/agendamentos/ausencia", data);
}

export function getAppointmentByStatus({ data }: { data: { status: string, data: string } }) {
    return api.post(`/agendamentos/contagem-status-data`, data);
}

export function findUserAppointments() {
    return api.get("/agendamentos/me");
}

export function findPersonalRequests(page = 0, size = 10) {
    return api.get(`/agendamentos/solicitacoes?page=${page}&size=${size}`);
}

export function findUserRescheduleRequests() {
    return api.get(`/agendamentos/solicitacoes`);
}

export function appointmentAtCalendar() {
    return api.get("/agendamentos/calendario");
}

export async function findAppointmentById(id: number) {
    return await api.get(`/agendamentos/${id}`);
}

export function getPersonalList() {
    return api.get(`/personais`);
}