import type { GeneralResponse } from "./generalResponse";

export interface ReturnResponseData {
  id: number;
  borrowingId: number;
  returnedQuantity: number;
  returnedCondition: string;
  status: string;
  returnEvidenceFile: string | null;
  handledBy: string;
  createdAt: string;
}

export type ReturnResponse = GeneralResponse<ReturnResponseData>;