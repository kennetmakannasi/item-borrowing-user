import { Badge } from "konsta/react";
import type { BorrowHistoryItem } from "../../interfaces/borrowing";
import useSubstring from "../../utils/textFormatter";
import { useNavigate } from "@tanstack/react-router";

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
            <div className="bg-white shadow-md rounded-xl p-3 text-start flex items-center gap-x-4">
                <img className="size-30 rounded-xl object-cover" src={item.item.image_url} alt="" />
                <div>
                    <p className="text-lg">{useSubstring(item.item.name)}</p>
                    <p className="text-lg font-semibold">Rp. {Number(item.item.borrow_price).toLocaleString('id-ID')}</p>
                    <Badge className="p-1">{item?.status}</Badge>
                </div>
            </div>
        </button>
    )
}