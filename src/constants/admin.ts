import type { ReqAdicionarRoleDTO, ResCadastrarPersonalDTO, ResNeedDataDTO, ResUsuarioWithRolesResponseDTO } from "../models/admin";
import { api } from "../system";

export function getUsers(page: number = 0, size: number = 10, nome?: string, email?: string, role?: string): Promise<ResUsuarioWithRolesResponseDTO[]> {
    return api.get("/admin/usuarios", { params: { page, size, nome, email, role } });
}

export function deleteUser(id: number) {
    return api.put(`/admin/usuarios/${id}/deletar`);
}

export function getVerifyNeedDataToAddRole(id: number, role: string): Promise<ResNeedDataDTO> {
    return api.get(`/admin/usuarios/${id}/roles/perfil?role=${role}`);
}

export function addRoleToUser(id: number, role: string, extraData?: ReqAdicionarRoleDTO) {
    return api.put(`/admin/usuarios/${id}/roles?role=${role}`, { data: extraData });
}

export function removeRoleFromUser(id: number, role: string) {
    return api.delete(`/admin/usuarios/${id}/roles?role=${role}`);
}

export function createPersonal(data: ResCadastrarPersonalDTO): Promise<ResCadastrarPersonalDTO> {
    return api.post("/admin/usuarios/personal", data);
}