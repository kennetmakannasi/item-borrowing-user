import type { ActivationRequest, InvitationProfile, LoginRequest, LoginResponse, ProfileResponse, RegisterRequest, RegisterResponse, ResetPasswordRequest, ResetPasswordResponse, UserProfile, VerifyEmailRequest, VerifyEmailResponse, VerifyResetPasswordRequest } from "../interfaces/auth";
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

export const activateAccountApi = async (data: ActivationRequest): Promise<GeneralResponse<void>> => {
    try {
        const response = await api.post<GeneralResponse<void>>(`auth/register/activation`, data);
        return response.data;
    } catch (error: any) {
        console.error('Activation Error:', error);
        return useError({
            code: error.response?.status ?? 500,
            message: error.response?.data?.message ?? error.message ?? "Aktivasi Gagal",
            data: null
        });
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

export const getInvitationData = async (jwt: string): Promise<GeneralResponse<InvitationProfile>> => {
    const response = await api.get<GeneralResponse<InvitationProfile>>(`/auth/register/activation/${jwt}`);
    return response.data;
};

export const getProfileApi = async (): Promise<ProfileResponse> => {
    const response = await api.get<GeneralResponse<UserProfile>>('/api/profile/me');
    return response.data;
};

export const logoutApi = async (): Promise<GeneralResponse<void>> => {
    try {
        const response = await api.post<GeneralResponse<void>>(`auth/logout` ,{});

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

export const requestResetPasswordApi = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    try {
        const response = await api.post<ResetPasswordResponse>(`auth/reset-password/request`, data);
        return response.data;
    } catch (error: any) {
        console.error('Reset Password Request Error:', error);
        return useError({
            code: error.response?.status ?? 500,
            message: error.response?.data?.message ?? error.message ?? "Permintaan Reset Password Gagal",
            data: null
        });
    }
};

export const verifyAndResetPasswordApi = async (data: VerifyResetPasswordRequest): Promise<GeneralResponse<void>> => {
    try {
        const response = await api.post<GeneralResponse<void>>(`auth/reset-password/verify`, data);
        return response.data;
    } catch (error: any) {
        console.error('Verify Reset Password Error:', error);
        return useError({
            code: error.response?.status ?? 500,
            message: error.response?.data?.message ?? error.message ?? "Verifikasi dan Reset Password Gagal",
            data: null
        });
    }
};

export const resendOTP = async (purpose: 'password_reset' | 'register', user_id: number, email: string): Promise<GeneralResponse<void>> => {
    try {
        const response = await api.post<GeneralResponse<void>>(`auth/verify-email/resend-otp?purpose=${purpose}`, {
            user_id: user_id,
            email: email
        });
        return response.data;
    } catch (error: any) {
        console.error('Verify Reset Password Error:', error);
        return useError({
            code: error.response?.status ?? 500,
            message: error.response?.data?.message ?? error.message ?? "Verifikasi dan Reset Password Gagal",
            data: null
        });
    }
};