import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const returnRequestSchema = z.object({
    borrowing_id: z.coerce.number(),
    returned_quantity: z.coerce.number(),
    return_evidence_file: z.any().refine((file) => !file || file.size <= MAX_FILE_SIZE, "Ukuran maksimal 5MB").refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), "Format file harus .jpg, .jpeg, .png atau .webp").optional().nullable(),
});

export type ReturnRequestType = z.infer<typeof returnRequestSchema>;