import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../../api/categories";

interface CategoryListProps {
    onClick: (id: number | null) => void;
    selectedCategoryId?: number | null
}

export default function CategoryList({ onClick, selectedCategoryId }: CategoryListProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategoriesApi(1),
    });

    if (isLoading) return <div className="h-12 animate-pulse bg-gray-200 rounded-full m-4" />;

    return (
        <div className="relative bg-linear-to-r from-transparent via-white/50 to-transparent dark:via-zinc-900/50">
            <div className="flex gap-x-3 overflow-x-auto py-4 px-4 no-scrollbar scroll-smooth snap-x">
                <button 
                    onClick={() => onClick(null)}
                    className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 shrink-0 ${
                        selectedCategoryId === null
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
                >
                    Semua
                </button>

                {data?.data?.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onClick(item.id)}
                        className={`px-5 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-200 shrink-0 ${
                            selectedCategoryId === item.id
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                        }`}
                    >
                        {item.name.length > 12 ? item.name.slice(0, 10) + '...' : item.name}
                    </button>
                ))}
            </div>
        </div>
    );
}