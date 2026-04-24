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

export interface BorrowingDetail {
  id: number;
  userId: number;
  itemId: number;
  itemVariantId: number;
  warehouseId: number;
  quantity: number;
  notes: string;
  borrowedCondition: string | null;
  borrowingPaymentType: PaymentType;
  status: BorrowStatus;
  approvedBy: number | null;
  approvedAt: string | null;
  dueDate: string; 
  createdAt: string; 
  updatedAt: string; 
}

export interface BorrowDetailItem {
  id: number;
  code: string;
  name: string;
  borrow_price: string;
  image_url: string;
}

export interface BorrowDetailVariant {
  id: number;
  name: string;
}

export interface TransactionInfo {
  id: number;
  amount: string;
  status: 'unpaid' | 'paid' | 'expired' | 'failed';
  payment_method: 'cash' | 'bank_transfer'
  type: PaymentType;
  snap_token: string | null; 
  created_at: string;
  expired_at: string;
  paid_at: string;
}

export interface ReturningInfo {
  id: number;
  returned_quantity: number;
  returned_condition: string;
  returned_date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface BorrowDetailData {
  id: number;
  status: BorrowStatus;
  total_amount: number;
  payment_type: PaymentType;
  borrow_date: string;
  return_date: string;
  quantity: number;
  item: BorrowDetailItem;
  selected_variant: BorrowDetailVariant;
  transactions: TransactionInfo[];
  returnings: ReturningInfo | null;
}

export interface CreateBorrowResponse extends GeneralResponse<{
  borrowing: BorrowingDetail;
}> {}
export type BorrowHistoryResponse = GeneralResponse<BorrowHistoryItem[]>;
export type BorrowDetailResponse = GeneralResponse<BorrowDetailData>;