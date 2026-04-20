import {
    BlockTitle,
    Page,
    Sheet,
    Block,
    Badge,
} from 'konsta/react';
import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { useInView } from 'react-intersection-observer';
import { getBorrowingHistoryApi } from '../api/borrowing';
import BorrowingHistoryCard from '../components/custom/borrowingCard';
import type { BorrowHistoryItem, BorrowHistoryResponse } from '../interfaces/borrowing';
import type { Pagination } from '../interfaces/generalResponse';
import BorrowingHistoryCardSkeleton from '../components/custom/borrowingHistoryCardSkeleton';
import { borrowingStatusMapper } from '../utils/statusMappers';

export default function HistoryPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<BorrowHistoryItem | null>();
    const [historyItems, setHistoryItems] = useState<BorrowHistoryItem[]>([]);
    const [pageInfo, setPageInfo] = useState<Pagination | null>(null);
    const { ref, inView } = useInView({ threshold: 0 });

    const { data, isLoading } = useQuery<BorrowHistoryResponse>({
        queryKey: ['borrowings', currentPage],
        queryFn: () => getBorrowingHistoryApi(currentPage),
    });

    useEffect(() => {
        if (!data) return;

        if (currentPage === 1) {
            setHistoryItems(data.data ?? []);
        } else {
            setHistoryItems((prev) => [
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

    function handleCloseModal() {
        setSelectedData(null);
        setIsModalOpen(false);
    }

    return (
        <Page>
            <BlockTitle>Histori</BlockTitle>
            <div className='grid grid-cols-1 gap-5 px-5'>
                {historyItems.length === 0 && isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <BorrowingHistoryCardSkeleton key={`skeleton-${index}`} />
                    ))
                ) : (
                    historyItems.map((item, index) => (
                        <BorrowingHistoryCard
                            key={index}
                            item={item}
                        />
                    ))
                )}
            </div>
            {pageInfo?.has_next_page && (
                <div ref={ref} className='mb-20 text-center text-sm text-gray-500'>
                    {isLoading ? 'Memuat lebih banyak histori...' : 'Scroll untuk memuat lebih banyak'}
                </div>
            )}
            <div className='h-20'/>
            <Sheet
                opened={isModalOpen}
                onBackdropClick={handleCloseModal}
            >
                <Block className='grid grid-cols-1 gap-2'>
                    <h1 className='font-semibold text-xl text-center mb-5'>Detil Peminjaman</h1>
                    <div className='flex justify-between'>
                        <p>ID Peminjaman:</p>
                        <p>{selectedData?.id}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Pembayaran:</p>
                        <p>{selectedData?.payment_type}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Qty:</p>
                        <p>{selectedData?.quantity}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Tanggal Peminjaman:</p>
                        <p>{selectedData?.borrow_date ? new Date(selectedData.borrow_date).toLocaleString("id-ID") : '-'}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Status Peminjaman:</p>
                        <Badge className='p-1'>{borrowingStatusMapper(selectedData?.status || '-')}</Badge>
                    </div>

                    <h1 className='font-semibold text-xl text-center my-5'>Detil Barang</h1>
                    <div className='flex justify-between'>
                        <p>ID Barang:</p>
                        <p>{selectedData?.item.id}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Barang:</p>
                        <p>{selectedData?.item.name}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Varian:</p>
                        <p>{selectedData?.selected_variant.name}</p>
                    </div>
                </Block>
            </Sheet>
        </Page>
    )
}