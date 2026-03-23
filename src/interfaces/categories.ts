import type { GeneralResponse } from "./generalResponse";

export interface Category {
  id: number;
  name: string;
}

export type CategoryListResponse = GeneralResponse<Category[]>;