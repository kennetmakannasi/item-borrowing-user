import { Badge } from "konsta/react";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../../api/categories";

export default function CategoryList() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: () => getCategoriesApi(1),
    });

    if (isLoading) return <div className="h-10 animate-pulse bg-gray-200 rounded-lg m-4" />;

    return (
        <div className="relative">
            <div className="flex gap-x-2 overflow-x-auto py-4 px-4 no-scrollbar scroll-smooth snap-x">
                <Badge 
                    className="py-2 px-4 cursor-pointer snap-start flex-shrink-0" 
                    colors={{ bg: 'bg-primary', text: 'text-white' }}
                >
                    Semua
                </Badge>

                {data?.data?.map((item) => (
                    <Badge 
                        key={item.id} 
                        className="py-2 px-4 cursor-pointer snap-start flex-shrink-0 border border-gray-200"
                        colors={{ bg: 'bg-white', text: 'text-gray-700' }}
                    >
                        {item.name}
                    </Badge>
                ))}
            </div>
        </div>
    );
}