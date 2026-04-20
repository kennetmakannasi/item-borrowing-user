import { Badge } from "konsta/react";
import type { BorrowHistoryItem } from "../../interfaces/borrowing";
import useSubstring from "../../utils/textFormatter";
import { useNavigate } from "@tanstack/react-router";
import useFormatRupiah from "../../utils/rupiahFormatter";
import { borrowingStatusMapper } from "../../utils/statusMappers";

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

                <div className="flex gap-x-4 h-full w-full items-center">
                    <img className="size-16 rounded-xl object-cover" src={item.item.image_url} alt="" />
                    <div>
                        <p className="text-lg font-semibold">{useSubstring(item.item.name)}</p>
                        <p className="text-gray-500 text-sm">Varian: {item.selected_variant.name}</p>
                        <p className="text-gray-500 text-sm">Total Jumlah Pinjam: {item.quantity}</p>
                    </div>
                </div>
                <div className="flex w-full justify-between items-center mt-2">
                    <p className="text-gray-500 text-sm">Status:</p>
                    <Badge className="text-sm">{borrowingStatusMapper(item.status)}</Badge>
                </div>
                <div className="flex w-full justify-between items-center mt-2">
                    <p className="text-gray-500 text-sm">Total Harga:</p>
                    <p className="text-gray-500 text-sm">
                        {useFormatRupiah(Number(item.item.borrow_price * item.quantity))}
                    </p>
                </div>
            </div>
        </button>
    )
}