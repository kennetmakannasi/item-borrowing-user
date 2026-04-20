import { useNavigate } from "@tanstack/react-router";
import type { Item } from "../../interfaces/item";
import useSubstring from "../../utils/textFormatter";
import useFormatRupiah from "../../utils/rupiahFormatter";

export default function ItemCard({ item }: { item: Item }) {
    const navigate = useNavigate();

    function navigateToDetail() {
        navigate({
            to: '/item',
            state: (prev) => ({
                ...prev,
                id: item.id
            })
        })
    }

    return (
        <button onClick={navigateToDetail}>
            <div className="bg-white shadow-md rounded-xl p-3 text-start">
                <img className="w-full h-40 rounded-xl object-cover" src={item.image_url} alt="" />
                <p className="text-lg">{useSubstring(item.name)}</p>
                <p className="text-lg font-semibold">{useFormatRupiah(Number(item.borrow_price))}</p>
                <p className="text-sm text-gray-500">Stok: {item.total_stock}</p>
                <p className="text-sm text-gray-500">{
                    item.borrow_count === 0 ? 'Belum pernah dipinjam' :
                        `${item.borrow_count}x dipinjam`
                }</p>
            </div>
        </button>
    )
}