export interface GeneralResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  pagination: Pagination | null;
}

export interface Pagination {
  total_pages: number;
  current_page: number;
  page_size: number;
  has_prev_page: boolean;
  has_next_page: boolean;
}