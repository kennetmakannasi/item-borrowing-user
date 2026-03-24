import type { PostPaymentResponse } from "../interfaces/transactions";
import { api } from "../utils/api";
import useError from "../utils/useError";

export async function PaymentRequestApi(transactionId: number): Promise<PostPaymentResponse> {
    try {
        const response = await api.post<PostPaymentResponse>(`/api/payment/initiate/${transactionId}`, {});

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