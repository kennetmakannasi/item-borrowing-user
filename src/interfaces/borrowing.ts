import type { GeneralResponse } from "./generalResponse";

export type BorrowStatus = 'pending' | 'approved' | 'rejected' | 'borrowed' | 'returned' | 'late';
export type PaymentType = 'full_payment' | 'deposit_payment';

export interface HistoryItemInfo {
  id: number;
  code: string;
  name: string;
  description: string;
  borrow_price: string; 
  image_url: string;
}

export interface SelectedVariantInfo {
  id: number;
  name: string;
}

export interface BorrowHistoryItem {
  id: number;
  payment_type: PaymentType;
  status: BorrowStatus;
  borrow_date: string; 
  quantity: number;
  selected_variant: SelectedVariantInfo;
  item: HistoryItemInfo;
}

export type BorrowHistoryResponse = GeneralResponse<BorrowHistoryItem[]>;