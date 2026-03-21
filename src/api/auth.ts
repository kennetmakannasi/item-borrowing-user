import type { LoginRequest, LoginResponse, ProfileResponse, RegisterRequest, RegisterResponse, User, UserProfile, VerifyEmailRequest, VerifyEmailResponse } from "../interfaces/auth";
import type { GeneralResponse } from "../interfaces/generalResponse";
import { api } from "../utils/api";
import useError from "../utils/useError";

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await api.post<LoginResponse>(`auth/login`, data);

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

export const registerApi = async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const response = await api.post<RegisterResponse>(`auth/register`, data);

        return response.data;

    } catch (error: any) {
        console.error(error)
        return useError({
            code: error.response?.status ?? 500,
            message: error.response?.data?.message ?? error.message ?? "Register Failed",
            data: null
        })
    }
};

export const verifyEmailApi = async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    try {
        const response = await api.post<VerifyEmailResponse>(`auth/verify-email`, data);

        return response.data;

    } catch (error: any) {
        console.error(error)
        return useError({
            code: error.response?.status ?? 500,
            message: error.response?.data?.message ?? error.message ?? "verify Failed",
            data: null
        })
    }
};

export const getProfileApi = async (): Promise<ProfileResponse> => {
    const response = await api.get<GeneralResponse<UserProfile>>('/api/profile/me');
    return response.data;
};