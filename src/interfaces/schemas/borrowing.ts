import { z } from "zod";

export const borrowRequestSchema = z.object({
  item_id: z.coerce.number().min(1, "Item tidak valid"),
  item_variant_id: z.coerce.number().min(1, "Varian tidak valid"),
  warehouse_id: z.coerce.number().min(1, "Gudang harus dipilih"),
  quantity: z.coerce.number().min(1, "Minimal pinjam 1 barang"),
  notes: z.string().optional(),
  payment_type: z.enum(["full_payment", "deposit_payment"], {
    errorMap: () => ({ message: "Pilih tipe pembayaran" }),
  }),
  due_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Format tanggal tidak valid",
  }),
});

export type BorrowRequestType = z.infer<typeof borrowRequestSchema>;