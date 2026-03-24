import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const updateProfileSchema = z.object({
  user_name: z.string().min(3, "Username minimal 3 karakter").optional(),
  display_name: z.string().optional().nullable(),
  avatar: z
    .any()
    .refine((file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE), "Ukuran maksimal 5MB")
    .refine(
      (file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Format file harus .jpg, .jpeg, .png atau .webp"
    )
    .optional()
    .nullable(),
});

export type UpdateProfileType = z.infer<typeof updateProfileSchema>;