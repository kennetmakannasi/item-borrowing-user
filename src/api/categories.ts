import type { CategoryListResponse } from "../interfaces/categories";
import { api } from "../utils/api";

export async function getCategoriesApi(page: number): Promise<CategoryListResponse> {
    const pageNumber = page ? page : 1;
    const response = await api.get<CategoryListResponse>(`/api/categories?page=${pageNumber}`);
    return response.data;
};  
