import type { ProductExhibition } from "../models/products";
import { api } from "../system";

export function getProductsExhibitions() {
    return api.get(`/produtos-exibicoes`)
}

export function newProductExhibition(data: ProductExhibition) {
    return api.post(`/produtos-exibicoes`, data)
}