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
            <div className="flex gap-x-10 overflow-x-auto py-4 px-4 no-scrollbar scroll-smooth snap-x">
                <button className={`text-gray-500 ${selectedCategoryId ? '' : 'text-primary font-semibold'}`} onClick={() => onClick(null)}>
                    Semua
                    {selectedCategoryId === null &&
                        <div className="w-full bg-primary h-1 rounded-full"></div>
                    }
                </button>


                {data?.data?.map((item) => (
                    <button className={`text-gray-500 ${selectedCategoryId === item.id ? 'text-primary font-semibold ' : ''}`} onClick={() => onClick(item.id)}>
                        {item.name.length > 10 ? item.name.slice(0, 7) + '...' : item.name}
                        {selectedCategoryId === item.id &&
                            <div className="w-full bg-primary h-1 rounded-full"></div>
                        }
                    </button>

                ))}
            </div>
        </div>
    );
}