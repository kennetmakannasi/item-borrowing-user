import {
    BlockTitle,
    Page,
} from 'konsta/react';
import { useQuery } from "@tanstack/react-query";
import ItemCard from '../components/custom/itemCard';
import { getFavoriteItemsApi } from '../api/item';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ItemCardSkeleton from '../components/custom/itemCardSkeleton';
import type { ItemListResponse } from '../interfaces/item';
import type { Item } from '../interfaces/item';
import type { Pagination } from '../interfaces/generalResponse';

export default function FavoritePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState<Item[]>([]);
    const [pageInfo, setPageInfo] = useState<Pagination | null>(null);
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, isLoading, isError } = useQuery<ItemListResponse>({
        queryKey: ['favorites', currentPage],
        queryFn: () => getFavoriteItemsApi(currentPage),
    });

    useEffect(() => {
        if (!data) return;

        if (currentPage === 1) {
            setFavorites(data.data ?? []);
        } else {
            setFavorites((prev) => [
                ...prev,
                ...(data.data ?? []),
            ]);
        }
        setPageInfo(data.pagination);
    }, [data, currentPage]);

    useEffect(() => {
        if (inView && pageInfo?.has_next_page) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [inView, pageInfo]);

    return (
        <Page>
            <BlockTitle>Favorite</BlockTitle>
            <div className='grid grid-cols-2 gap-5 px-5'>
                {favorites.length === 0 && isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <ItemCardSkeleton key={`skeleton-${index}`} />
                    ))
                ) : (
                    favorites.map((item, index) => (
                        <ItemCard key={index} item={item} />
                    ))
                )}
            </div>

            {pageInfo?.has_next_page && (
                <div ref={ref} className='mb-20 text-center text-sm text-gray-500'>
                    {isLoading ? 'Memuat lebih banyak favorit...' : 'Scroll untuk memuat lebih banyak'}
                </div>
            )}

            {isError && favorites.length === 0 && (
                <div className='text-center text-red-500 mt-10'>Gagal mengambil favorit.</div>
            )}
        </Page>
    )
}