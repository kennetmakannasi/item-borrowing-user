import type { GeneralResponse } from "./generalResponse";

export type NotificationType = 'reminder' | 'info' | 'alert';

export interface NotificationItem {
  id: number;
  userId: number;
  message: string;
  type: NotificationType;
  notifiedObjectId: number;
  isRead: boolean;
  createdAt: string; 
  updatedAt: string; 
}

export type ReadNotificationResponse = GeneralResponse<void>;
export type NotificationResponse = GeneralResponse<NotificationItem[]>;