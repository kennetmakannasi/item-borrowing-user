import { useLocation, useNavigate } from "@tanstack/react-router";
import { Page, Navbar, NavbarBackLink, Block, List, ListItem } from "konsta/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { searchItemApi } from "../api/item";
import { useInView } from "react-intersection-observer";
import ItemCard from "../components/custom/itemCard";
import type { Item } from "../interfaces/item";
import type { Pagination } from "../interfaces/generalResponse";

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
        if (!keyword) {
            navigate({ to: '/', replace: true });
        }
    }, [keyword, navigate]);

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
                title="Hasil Pencarian"
                left={<NavbarBackLink onClick={() => history.go(-1)} />}
                colors={{ 
                    bgMaterial: 'bg-white'
                 }}
            />
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