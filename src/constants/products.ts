import type { ProductExhibition } from "../models/products";
import { api } from "../system";

export function getProductsExhibitions() {
    return api.get(`/produtos-exibicoes`)
}

export function newProductExhibition(data: ProductExhibition) {
    return api.post(`/produtos-exibicoes`, data)
}

export function desactivateProductExhibition(id: number) {
    return api.patch(`/produtos-exibicoes/desativar/${id}`)
}

export function updateProductExhibition(id: number, data: Partial<ProductExhibition>) {
    return api.post(`/produtos-exibicoes/editar/${id}`, data);
}

export function buyProductExhibition(id: number) {
    return api.post(`/comprar/${id}`);
}

export function actualPlan() {
    return api.get(`/produtos-contratados/ativo`)
}

export function getUserPlansHistory() {
    return api.get(`/produtos-contratados/aluno`)
}

export function BoughtPlanDetails(id: number) {
    return api.get(`/produtos-contratados/detalhado/${id}`)
}