import type { GeneralResponse } from "./generalResponse";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    user_name: string;
    display_name: string;
    password: string;
}

export interface VerifyEmailRequest {
    user_id: number;
    otp_code: string;
}

export interface User {
    id: number;
    user_name: string;
    display_name: string;
    email: string;role: string;
}

export interface LoginData {
    token: string;
    user: User;
}

export interface RegisterData {
    id: number;
}

export interface UserProfile {
    id: number;
    code: string;
    email: string;
    user_name: string;
    display_name: string;
    status: 'active' | 'inactive'; 
    warehouse_id: number | null;   
    avatar: string | null;         
}

export type LoginResponse = GeneralResponse<LoginData>;
export type RegisterResponse = GeneralResponse<RegisterData>;
export type VerifyEmailResponse = GeneralResponse<any>;
export type ProfileResponse = GeneralResponse<UserProfile>;