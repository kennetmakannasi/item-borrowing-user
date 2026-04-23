import { Badge } from "konsta/react";
import type { BorrowHistoryItem } from "../../interfaces/borrowing";
import useSubstring from "../../utils/textFormatter";
import { useNavigate } from "@tanstack/react-router";
import useFormatRupiah from "../../utils/rupiahFormatter";
import { borrowingStatusMapper } from "../../utils/statusMappers";
import useFormatDate from "../../utils/dateFormatter";
import StatusBadge from "./statusBadge";

export default function BorrowingHistoryCard({ item }: { item: BorrowHistoryItem }) {
    const navigate = useNavigate();

    function navigateToDetail() {
        navigate({
            to: '/borrowing-details',
            state: (prev) => ({
                ...prev,
                id: item.id
            })
        })
    }

    return (
        <button onClick={navigateToDetail}>
            <div className="bg-white shadow-md rounded-xl p-4 text-start">
                <div className="flex w-full justify-between items-center mb-2">
                    <p className="text-gray-500 text-sm">Tanggal Peminjaman</p>
                    <p className="text-gray-500 text-sm">
                       {useFormatDate(item?.borrow_date || '-')}
                    </p>
                </div>
                <div className="flex gap-x-4 h-full w-full items-center">
                    <img className="size-16 rounded-xl object-cover" src={item?.item?.image_url || 'placeholders/item.png'} alt="" />
                    <div>
                        <p className="text-lg font-semibold">{useSubstring(item.item.name)}</p>
                        <p className="text-gray-500 text-sm">Varian {item.selected_variant.name}</p>
                        <p className="text-gray-500 text-sm">Total Jumlah Pinjam: {item.quantity}</p>
                    </div>
                </div>
                <div className="flex w-full justify-between items-center mt-2">
                    <p className="text-gray-500 text-sm">Status</p>
                    <StatusBadge
                        status={item.status}
                    />
                </div>
                <div className="flex w-full justify-between items-center mt-2">
                    <p className="text-gray-500 text-sm">Harga Pinjam per Barang</p>
                    <p className="text-gray-500 text-sm">
                        {useFormatRupiah(Number(item.item.borrow_price))}
                    </p>
                </div>
            </div>
        </button>
    )
}