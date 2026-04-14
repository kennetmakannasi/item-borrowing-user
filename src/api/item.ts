import type { FavoriteItemRequest, FavoriteItemResponse, ItemDetailResponse, ItemListResponse } from "../interfaces/item";
import { api } from "../utils/api";
import useError from "../utils/useError";

export async function getItemsApi({ page, categoryId }: { page: number, categoryId: number }): Promise<ItemListResponse> {
    const pageNumber = page ? page : 1;

    const searchParams = new URLSearchParams();
    searchParams.append('page', String(pageNumber));
    if (categoryId) {
        searchParams.append('category_id', String(categoryId));

    }
    const queryString = searchParams.toString();
    const response = await api.get<ItemListResponse>(`/api/items?${queryString}`);
    return response.data;
};

export async function getPopularItemsApi(): Promise<ItemListResponse> {
    const response = await api.get<ItemListResponse>('/api/items/popular');
    return response.data;
};

export async function getItemDetailApi(id: number): Promise<ItemDetailResponse> {
    const response = await api.get<ItemDetailResponse>(`/api/items/${id}`);
    return response.data;
};

export async function searchItemApi(keyword: string, page: number): Promise<ItemListResponse> {
    const response = await api.get<ItemListResponse>(`/api/items?q=${keyword}&page=${page}`);
    return response.data;
};

export async function getFavoriteItemsApi(page: number): Promise<ItemListResponse> {
    const pageNumber = page ? page : 1;
    const response = await api.get<ItemListResponse>(`/api/favorites?page=${pageNumber}`);
    return response.data;
};

export const favoriteApi = async (data: FavoriteItemRequest): Promise<FavoriteItemResponse> => {
    try {
        const response = await api.post<FavoriteItemResponse>(`/api/favorites`, data);

        return response.data;

    } catch (error: any) {
        console.error(error)
        return useError({
            code: error.response?.status ?? 500,
            message: error.response?.data?.message ?? error.message ?? "Login Failed",
            data: error?.response?.data?.data ?? null
        })
    }
};

export const removeFavoriteApi = async (id: number): Promise<FavoriteItemResponse> => {
    try {
        const response = await api.delete<FavoriteItemResponse>(`/api/favorites/${id}`);

        return response.data;

    } catch (error: any) {
        console.error(error)
        return useError({
            code: error.response?.status ?? 500,
            message: error.response?.data?.message ?? error.message ?? "Login Failed",
            data: error?.response?.data?.data ?? null
        })
    }
};