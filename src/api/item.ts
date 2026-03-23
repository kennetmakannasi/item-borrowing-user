import type { ItemListResponse } from "../interfaces/item";
import { api } from "../utils/api";

export async function getItemsApi(page: number): Promise<ItemListResponse> {
    const pageNumber = page ? page : 1;
    const response = await api.get<ItemListResponse>(`/api/items?page=${pageNumber}`);
    return response.data;
};  

export async function getPopularItemsApi(): Promise<ItemListResponse> {
    const response = await api.get<ItemListResponse>('/api/items/popular');
    return response.data;
};  

export async function getItemDetailApi(id:number): Promise<ItemListResponse> {
    const response = await api.get<ItemListResponse>(`/api/items/${id}`);
    return response.data;
};  

export async function searchItemApi(keyword: string): Promise<ItemListResponse> {
    const response = await api.get<ItemListResponse>(`/api/items/search?q=${keyword}`);
    return response.data;
};

