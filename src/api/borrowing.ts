import type { BorrowDetailResponse, BorrowHistoryResponse, CreateBorrowResponse } from "../interfaces/borrowing";
import type { BorrowRequestType } from "../interfaces/schemas/borrowing";
import { api } from "../utils/api";
import useError from "../utils/useError";

export const requestBorrowingApi = async (data: BorrowRequestType): Promise<CreateBorrowResponse> => {
    try {
        const response = await api.post<CreateBorrowResponse>('/api/borrow/request', data);

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

export async function getBorrowingHistoryApi(page: number): Promise<BorrowHistoryResponse> {
    const pageNumber = page ? page : 1;
    const response = await api.get<BorrowHistoryResponse>(`/api/borrow/me?page=${pageNumber}`);
    return response.data;
};  

export async function getBorrowingDetail(id: number): Promise<BorrowDetailResponse> {
    const response = await api.get<BorrowDetailResponse>(`/api/borrow/details/${id}`);
    return response.data;
};  