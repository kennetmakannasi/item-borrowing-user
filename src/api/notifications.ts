import type { NotificationResponse } from "../interfaces/notifications";
import type { GeneralResponse } from "../interfaces/generalResponse";
import { api } from "../utils/api";

export async function getNotificationsApi(page: number): Promise<NotificationResponse> {
    const pageNumber = page ? page : 1;
    const response = await api.get<NotificationResponse>(`/api/notifications?page=${pageNumber}`);
    return response.data;
};

export async function readNotificationApi(id: number): Promise<GeneralResponse<void>> {
    const response = await api.patch<GeneralResponse<void>>(`/api/notifications/read/${id}`);
    return response.data;
};

export async function ReadAllNotificationApi(): Promise<GeneralResponse<void>> {
    const response = await api.patch<GeneralResponse<void>>('/api/notifications/read-all');
    return response.data;
};