import {
    BlockTitle,
    Page,
} from 'konsta/react';
import { useQuery } from "@tanstack/react-query";
import ItemCard from '../components/custom/itemCard';
import { getFavoriteItemsApi } from '../api/item';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';
import ItemCardSkeleton from '../components/custom/itemCardSkeleton';
import type { ItemListResponse } from '../interfaces/item';
import type { Item } from '../interfaces/item';
import type { Pagination } from '../interfaces/generalResponse';
import ItemCardRow from '../components/custom/itemCardRow';

export default function FavoritePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState<Item[]>([]);
    const [pageInfo, setPageInfo] = useState<Pagination | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
            <div className='flex justify-between items-center px-5 my-4'>
                <BlockTitle>Favorite</BlockTitle>
                <div className='flex gap-2'>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${
                            viewMode === 'grid'
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                        title='Grid view'
                    >
                        <Icon height={20} icon='material-symbols:grid-3x3' />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${
                            viewMode === 'list'
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                        }`}
                        title='List view'
                    >
                        <Icon height={20} icon='material-symbols:list' />
                    </button>
                </div>
            </div>
            <div className={`${
                viewMode === 'grid'
                    ? 'grid grid-cols-2 gap-5 px-5'
                    : 'grid grid-cols-1 gap-3 px-5'
            }`}>
                {favorites.length === 0 && isLoading ? (
                    Array.from({ length: viewMode === 'grid' ? 6 : 5 }).map((_, index) => (
                        <ItemCardSkeleton key={`skeleton-${index}`} />
                    ))
                ) : (
                    favorites.map((item, index) => (
                        viewMode === 'grid' ? (
                            <ItemCard key={index} item={item} />
                        ) : (
                            <ItemCardRow key={index} item={item} />
                        )
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