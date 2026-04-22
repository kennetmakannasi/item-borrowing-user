import { useLocation, useNavigate } from "@tanstack/react-router";
import { Page, Navbar, NavbarBackLink, Block, List, ListItem } from "konsta/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { searchItemApi } from "../api/item";
import { useInView } from "react-intersection-observer";
import ItemCard from "../components/custom/itemCard";
import type { Item } from "../interfaces/item";
import type { Pagination } from "../interfaces/generalResponse";
import { Icon } from "@iconify/react";

export default function SearchResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const [pageInfo, setPageInfo] = useState<Pagination>();
    const [data, setData] = useState<Item[]>([]);

    const keyword = (location.state as any)?.keyword;

    const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (keyword === undefined || keyword === null) {
            navigate({ to: '/', replace: true });
        }
    }, []); 

    const { data: queryData, isLoading, isError } = useQuery({
        queryKey: ['items', 'search', keyword, currentPage],
        queryFn: () => searchItemApi(keyword, currentPage),
    });

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
                    <div className='w-5 flex items-center justify-center text-gray-500'>
                        <NavbarBackLink onClick={() => history.go(-1)} />                            </div>
                    <button onClick={() => navigate({
                        to: '/search',
                        replace: true
                    })} className='w-full px-5 py-3 text-start rounded-full border-2 border-gray-200 transition-all outline-none '
                    >
                        <p className='text-gray-400'>Cari</p>
                    </button>
                </div>
            </Navbar>
            {isLoading && (
                <Block className="text-center">Memuat barang...</Block>
            )}

            {isError && (
                <Block className="text-center text-red-500">Gagal mengambil data.</Block>
            )}

            <div className='grid grid-cols-2 gap-5 px-5'>
                {data?.map((item, index) => (
                    <ItemCard key={index} item={item} />
                ))}
            </div>

            {/* Empty State */}
            {data?.length === 0 && !isLoading && (
                <Block className="text-center text-gray-500">
                    Barang "{keyword}" tidak ditemukan.
                </Block>
            )}

            {!isLoading && pageInfo?.has_next_page &&
                <div className='mb-20' ref={ref}>load</div>
            }
        </>
    );
}