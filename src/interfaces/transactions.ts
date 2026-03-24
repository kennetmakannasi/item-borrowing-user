import type { GeneralResponse } from "./generalResponse";

export interface SnapTokenData {
  token: string;
  redirect_url: string;
}

export interface PaymentResponseData {
  snapToken: SnapTokenData;
}

export type PostPaymentResponse = GeneralResponse<PaymentResponseData>;

export interface PostPaymentPayload {
  transaction_id: number;
}