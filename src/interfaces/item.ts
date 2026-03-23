import type { GeneralResponse } from "./generalResponse";
import type { Category } from "./categories";

export interface Variant {
  id: number;
  slug: string;
  name: string;
  availableStock: number;
  itemId: number;
}

export interface ItemImage {
  id: number;
  url: string;
  slug: string;
}

export interface Item {
  id: number;
  code: string;
  name: string;
  description: string;
  borrow_price: string;
  borrow_count: number;
  total_stock: number;
  image_url: string;
  categories: Category[];
  variants: Variant[];
}

export interface ItemDetail {
  is_favorite: boolean;
  id: number;
  code: string;
  name: string;
  description: string;
  borrow_price: string;
  total_available_stock: number; 
  categories: Category[];
  images: ItemImage[];          
  variants: Variant[];
}

export interface FavoriteItemRequest {
  item_id: number;
}

export type ItemListResponse = GeneralResponse<Item[]>;
export type ItemDetailResponse = GeneralResponse<ItemDetail>;
export type FavoriteItemResponse = GeneralResponse<FavoriteItemRequest>;