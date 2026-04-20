import { useNavigate } from '@tanstack/react-router';
import {
    Navbar,
    BlockTitle,
    Page,
    Block,
} from 'konsta/react';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from 'framer-motion';
import { getItemsApi, getPopularItemsApi } from '../api/item';
import ItemCard from '../components/custom/itemCard';
import CategoryList from '../components/custom/categoryList';
import { Icon } from '@iconify/react';
import { useInView } from "react-intersection-observer";
import type { Item } from '../interfaces/item';
import type { Pagination } from '../interfaces/generalResponse';
import PopularCard from '../components/custom/popularCard';
import ItemCardSkeleton from '../components/custom/itemCardSkeleton';

export default function MainPage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const [pageInfo, setPageInfo] = useState<Pagination>();
    const [data, setData] = useState<Item[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const popularData = useQuery({
        queryKey: ['popularItems'],
        queryFn: () => getPopularItemsApi(),
    });

    useEffect(() => {
        if (!popularData.data?.data || popularData.data.data.length === 0) return;

        const timer = setInterval(() => {
            setCarouselIndex((prev) => (prev + 1) % popularData.data.data.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [popularData.data?.data]);

    const { data: queryData, isLoading, isError } = useQuery({
        queryKey: ['items', currentPage, selectedCategoryId],
        queryFn: () => getItemsApi({
            page: currentPage,
            categoryId: selectedCategoryId
        }),
    });

    const handleCategory = (data: number | null) => {
        setSelectedCategoryId(data);
        setCurrentPage(1);
    }

    useEffect(() => {
        setCurrentPage(1);
        setData(queryData?.data);
    }, [])

    useEffect(() => {
        if (queryData?.data && Array.isArray(queryData.data)) {
            setData((prev) => {
                const safePrev = Array.isArray(prev) ? prev : [];
                return [...safePrev, ...queryData.data];
            });
        }
        setPageInfo(queryData?.pagination);
    }, [queryData]);

    useEffect(() => {
        if (inView) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [inView]);


    return (
        <>
            <Navbar
                bgClassName='border-t border-2 border-gray-200 dark:border-gray-700'
                colors={{
                    bgMaterial: 'bg-white'
                }}
            >

                <div className='px-4 w-full flex justify-between gap-x-3'>
                    <button onClick={() => navigate({
                        to: '/qr-scan',
                        replace: true
                    })} className='w-10 flex items-center justify-center text-gray-500'>
                        <Icon height={30} icon={'boxicons:qr'} />
                    </button>
                    <button onClick={() => navigate({
                        to: '/search',
                        replace: true
                    })} className='w-full px-5 py-3 text-start rounded-full border-2 border-gray-200 transition-all outline-none '
                    >
                        <p className='text-gray-400'>Cari</p>
                    </button>
                    <button onClick={() => navigate({
                        to: '/notifications',
                        replace: true
                    })} className='w-10 flex items-center justify-center text-gray-500'>
                        <Icon height={30} icon={'ion:notifications-outline'} />
                    </button>
                </div>
            </Navbar>
            {/* <p>Populer</p>
            // {popularData.isError ? (
            //     <Block className="text-center text-red-500">Gagal mengambil data.</Block>
            // ) : (
            //     <div className='grid grid-cols-1 gap-5 px-5'>
            //         {popularData.data?.data?.map((item, index) => (
            //             <PopularCard key={index} item={item} />
            //         ))}
            //     </div>
            // )} */}

            <div className='px-3'>
                {/* Popular Items Carousel */}
                <div className='relative overflow-hidden rounded-3xl h-40'>
                    <AnimatePresence mode='wait'>
                        {popularData.data?.data?.[carouselIndex] && (
                            <motion.div
                                key={carouselIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className='absolute inset-0'
                            >
                                <img
                                    className='w-full h-full object-cover rounded-3xl'
                                    src={popularData.data.data[carouselIndex].image_url}
                                    alt={popularData.data.data[carouselIndex].name}
                                />
                                <div className='bg-black/40 inset-0 absolute rounded-3xl flex items-end p-5'>
                                    <div>
                                        <h1 className='text-white text-2xl font-bold'>{popularData.data.data[carouselIndex].name}</h1>
                                        <p className='text-white text-sm w-40'>
                                            {popularData.data.data[carouselIndex].description.length > 30 ? popularData.data.data[carouselIndex].description.substring(0, 30) + '...' : popularData.data.data[carouselIndex].description}
                                        </p>
                                        <button onClick={() => navigate({
                                            to: '/item',
                                            state: (prev) => ({
                                                ...prev,
                                                id: popularData.data.data[carouselIndex].id
                                            })
                                        })} className='mt-3 px-4 py-2 bg-primary text-white rounded-full text-sm'>Pinjam Sekarang</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Popular Items Thumbnail Navigation */}
                <div className='flex gap-x-2 my-3 justify-center'>
                    {popularData.data?.data?.map((item, index) => (
                        <button
                            key={item.id}
                            onClick={() => setCarouselIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === carouselIndex ? 'bg-primary w-8' : 'bg-gray-300 w-2'
                            } hover:bg-primary`}
                        />
                    ))}
                </div>
            </div>
            <CategoryList onClick={handleCategory} selectedCategoryId={selectedCategoryId} />
            {isError ? (
                <Block className="text-center text-red-500">Gagal mengambil data.</Block>
            ) : (
                <div className='grid grid-cols-2 gap-5 px-5'>
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <ItemCardSkeleton key={`skeleton-${index}`} />
                        ))
                    ) : (
                        data?.map((item, index) => (
                            <ItemCard key={index} item={item} />
                        ))
                    )}
                </div>
            )}
            {!isLoading && pageInfo?.has_next_page &&
                <div className='mb-20' ref={ref}>load</div>
            }
        </>
    )
}