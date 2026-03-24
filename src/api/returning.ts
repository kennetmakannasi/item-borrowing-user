import type { GeneralResponse } from "../interfaces/generalResponse";
import type { ReturnResponseData } from "../interfaces/returning";
import type { ReturnRequestType } from "../interfaces/schemas/returning";
import { api } from "../utils/api";

export const returnRequestApi = async (data: ReturnRequestType): Promise<GeneralResponse<ReturnResponseData>> => {
  const formData = new FormData();
  formData.append("borrowing_id", String(data.borrowing_id));
  formData.append("item_id", String(data.item_id));
  formData.append("item_variant_id", String(data.item_variant_id));
  formData.append("warehouse_id", String(data.warehouse_id));
  formData.append("returned_quantity", String(data.returned_quantity));
  formData.append("returned_condition", data.returned_condition);

  if (data.return_evidence_file instanceof File) {
    formData.append("return_evidence_file", data.return_evidence_file);
  }

  const response = await api.post<GeneralResponse<ReturnResponseData>>("/api/return/request", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};