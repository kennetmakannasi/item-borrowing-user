import { useNavigate } from '@tanstack/react-router';
import {
    Navbar,
    BlockTitle,
    Page,
    Block,
} from 'konsta/react';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getItemsApi } from '../api/item';
import ItemCard from '../components/custom/itemCard';
import CategoryList from '../components/custom/categoryList';
import { Icon } from '@iconify/react';
import { useInView } from "react-intersection-observer";
import type { Item } from '../interfaces/item';
import type { Pagination } from '../interfaces/generalResponse';

export default function MainPage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const [pageInfo, setPageInfo] = useState<Pagination>();
    const [data, setData] = useState<Item[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const { ref, inView } = useInView({
        threshold: 0,
    });

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
        <Page>
            <Navbar
                colors={{
                    bgMaterial: 'bg-white shadow-md'
                }}
            >
                <div className='px-4 w-full flex justify-between gap-x-3'>
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

            <div className='w-full px-5 pt-2'>
                <div className='bg-white shadow-md w-full rounded-xl p-4'>
                    <button onClick={() => navigate({
                        to: '/qr-scan',
                        replace: true
                    })}>
                        Scan Qr Barang
                    </button>
                </div>
            </div>
            <CategoryList onClick={handleCategory} selectedCategoryId={selectedCategoryId} />
            {isError ? (
                <Block className="text-center text-red-500">Gagal mengambil data.</Block>
            ) : (
                <div className='grid grid-cols-2 gap-5 px-5'>
                    {data?.map((item, index) => (
                        <ItemCard key={index} item={item} />
                    ))}
                </div>
            )}
            {!isLoading && pageInfo?.has_next_page &&
                <div className='mb-20' ref={ref}>load</div>
            }
        </Page>
    )
}