import { useNavigate } from "@tanstack/react-router";
import type { Item } from "../../interfaces/item";
import useSubstring from "../../utils/textFormatter";
import useFormatRupiah from "../../utils/rupiahFormatter";

export default function PopularCard({ item }: { item: Item }) {
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
            <div className="bg-white shadow-md rounded-xl text-start relative h-60">
                <img className="absolute inset-0 size-full rounded-xl object-cover" src={item.image_url} alt="" />
                <div className="absolute inset-0 size-full rounded-xl bg-black/50 flex items-center justify-center">
                    <div    >
                        p
                    </div>
                </div>
            </div>
        </button>
    )
}