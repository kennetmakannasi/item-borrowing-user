import {
    BlockTitle,
    Navbar,
} from 'konsta/react';
import { useQuery } from "@tanstack/react-query";
import ItemCard from '../components/custom/itemCard';
import { getFavoriteItemsApi } from '../api/item';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { useInView } from 'react-intersection-observer';
import { Icon } from '@iconify/react';
import ItemCardSkeleton from '../components/custom/itemCardSkeleton';
import type { ItemListResponse, Item } from '../interfaces/item';
import type { Pagination } from '../interfaces/generalResponse';
import ItemCardRow from '../components/custom/itemCardRow';

export default function FavoritePage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState<Item[]>([]);
    const [pageInfo, setPageInfo] = useState<Pagination | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState("");
    const { ref, inView } = useInView({ threshold: 0 });

    // Tambahkan searchQuery ke queryKey agar otomatis trigger saat refetch atau queryFn dipanggil
    const { data, isLoading, isError, refetch } = useQuery<ItemListResponse>({
        queryKey: ['favorites', currentPage], 
        queryFn: () => getFavoriteItemsApi(currentPage, searchQuery),
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

    // Handler pencarian saat menekan Enter
    function handleSearch(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            setFavorites([]); // Kosongkan list lama
            setCurrentPage(1); // Reset ke halaman pertama
            refetch(); // Trigger fetch ulang
        }
    }

    // Handler untuk membersihkan pencarian
    function clearSearch() {
        setSearchQuery("");
        setFavorites([]);
        setCurrentPage(1);
        // Timeout sedikit agar state searchQuery terupdate sebelum refetch
        setTimeout(() => refetch(), 10);
    }

    return (
        <>
            {/* Terapkan Navbar Search yang sama dengan HistoryPage */}
            <Navbar
                colors={{ bgMaterial: 'bg-white shadow-md' }}
            >
                <div className='px-4 w-full flex justify-between gap-x-3'>
                    <div className='w-10 flex items-center justify-center text-gray-500'>
                         <Icon height={24} icon={'material-symbols:favorite-outline'} />
                    </div>
                    <div className='w-full relative flex items-center'>
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='Cari item favorit...'
                            onKeyDown={handleSearch}
                            className='w-full px-5 py-3 rounded-full border-2 border-gray-200 transition-all outline-none focus:border-primary'
                        />
                        {searchQuery && (
                            <button onClick={clearSearch} className='absolute right-4 text-gray-400'>
                                <Icon height={20} icon={'material-symbols:cancel-outline-rounded'} />
                            </button>
                        )}
                    </div>
                </div>
            </Navbar>

            <div className='flex justify-between items-center px-5 my-4'>
                <div className='flex gap-2'>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        <Icon height={20} icon='material-symbols:grid-3x3' />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                            }`}
                    >
                        <Icon height={20} icon='material-symbols:list' />
                    </button>
                </div>
            </div>

            <div className={`${viewMode === 'grid'
                    ? 'grid grid-cols-2 gap-5 px-5'
                    : 'grid grid-cols-1 gap-3 px-5'
                }`}>
                {favorites.length === 0 && isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
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

            {/* Empty State jika pencarian tidak ditemukan */}
            {!isLoading && favorites.length === 0 && (
                <div className='text-center text-gray-500 mt-10'>
                    Item tidak ditemukan.
                </div>
            )}

            {pageInfo?.has_next_page && (
                <div ref={ref} className='mb-20 text-center text-sm text-gray-500'>
                    {isLoading ? 'Memuat...' : 'Scroll untuk memuat lebih banyak'}
                </div>
            )}

            {isError && favorites.length === 0 && (
                <div className='text-center text-red-500 mt-10'>Gagal mengambil favorit.</div>
            )}
            
            <div className='h-20' />
        </>
    )
}