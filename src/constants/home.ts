import { api } from "../system";

export function getPackages() {
   return api.get(`/produtos-exibicoes/ativos`)
}