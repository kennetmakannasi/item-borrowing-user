import { Badge } from "konsta/react";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../../api/categories";

interface CategoryListProps {
    onClick: (id: number | null) => void;
    selectedCategoryId?: number | null
}

export default function CategoryList({ onClick, selectedCategoryId }: CategoryListProps) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategoriesApi(1),
    });

    if (isLoading) return <div className="h-10 animate-pulse bg-gray-200 rounded-lg m-4" />;

    const active = { bg: 'bg-primary', text: 'text-white' }
    const inActive = { bg: 'bg-white', text: 'text-gray-700' }

    return (
        <div className="relative">
            <div className="flex gap-x-2 overflow-x-auto py-4 px-4 no-scrollbar scroll-smooth snap-x">
                <button onClick={() => onClick(null)}>
                    <Badge
                        className="py-2 px-4 cursor-pointer snap-start flex-shrink-0"
                        colors={selectedCategoryId ? inActive : active}
                    >
                        Semua
                    </Badge>
                </button>


                {data?.data?.map((item) => (
                    <button onClick={() => onClick(item.id)}>
                        <Badge
                            key={item.id}
                            className="py-2 px-4 cursor-pointer snap-start flex-shrink-0 border border-gray-200"
                            colors={selectedCategoryId === item.id ? active : inActive}
                        >
                            {item.name}
                        </Badge>
                    </button>

                ))}
            </div>
        </div>
    );
}