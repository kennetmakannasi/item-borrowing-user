import type { BorrowHistoryResponse } from "../interfaces/borrowing";
import type { BorrowRequestType } from "../interfaces/schemas/borrowing";
import { api } from "../utils/api";
import useError from "../utils/useError";

export const requestBorrowingApi = async (data: BorrowRequestType): Promise<LoginResponse> => {
    try {
        const response = await api.post<LoginResponse>('/api/borrow/request', data);

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