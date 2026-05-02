import { api } from "../system";

export async function isAuthenticated() {
    return await api.get(`/usuarios/auth`);
}