import {
    BlockTitle,
    Page,
    Sheet,
    Block,
    Badge,
    Navbar,
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
import { Icon } from '@iconify/react';

export default function HistoryPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<BorrowHistoryItem | null>();
    const [historyItems, setHistoryItems] = useState<BorrowHistoryItem[]>([]);
    const [pageInfo, setPageInfo] = useState<Pagination | null>(null);
    const { ref, inView } = useInView({ threshold: 0 });
    const [selectedStatus, setSelectedStatus] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const status = [
        { value: "", label: "Semua Status" },
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
        { value: "overdue", label: "Overdue" },
        { value: "returned", label: "Returned" },
    ];

    const { data, isLoading, refetch } = useQuery<BorrowHistoryResponse>({
        queryKey: ['borrowings', currentPage, selectedStatus],
        queryFn: () => getBorrowingHistoryApi(currentPage, searchQuery, selectedStatus),
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


    function handleSearch(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            setHistoryItems([]);
            refetch();
            setCurrentPage(1);
        }
    }

    useEffect(() => {
        setHistoryItems(data?.data ?? []);
        setCurrentPage(1);
    }, [selectedStatus])

    return (
        <>
            <Navbar
                colors={{
                    bgMaterial: 'bg-white shadow-md'
                }}
            >
                <div className='px-4 w-full flex justify-between gap-x-3'>
                    <button
                        // onClick={() => navigate({
                        //     to: '/qr-scan',
                        //     replace: true
                        // })} 
                        className='w-10 flex items-center justify-center text-gray-500'>
                        <Icon height={30} icon={'boxicons:qr'} />
                    </button>
                    <div className='w-full relative flex items-center'>
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='Cari'
                            onKeyDown={handleSearch}
                            className='w-full px-5 py-3 rounded-full border-2 border-gray-200 transition-all outline-none '
                        />
                        {searchQuery && (
                            <button onClick={
                                () => {
                                    setCurrentPage(1);
                                    setSearchQuery("");
                                    setHistoryItems(data?.data ?? []);
                                }
                            } className='absolute right-4 text-gray-400'>
                                <Icon height={20} icon={'material-symbols:cancel-outline-rounded'} />
                            </button>
                        )}
                    </div>

                </div>
            </Navbar>
            <button onClick={() => setIsStatusModalOpen(true)} className='border border-gray-500 text-gray-500 rounded-full px-3 py-1 bg-white m-4'>
                {selectedStatus ?
                    selectedStatus : 'Semua Status'
                }
            </button>
            <div className='grid grid-cols-1 gap-5 px-5'>
                {historyItems.length === 0 ? (

                    Array.from({ length: 3 }).map((_, index) => (
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
            <div className='h-20' />
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
            <Sheet
                opened={isStatusModalOpen}
                onBackdropClick={() => setIsStatusModalOpen(false)}
            >
                <Block className='grid grid-cols-1 gap-2'>
                    <h1 className='text-2xl font-semibold'>Pilih Status</h1>
                    {status.map((item) => (
                        <button className='text-start' onClick={() => {
                            setSelectedStatus(item.value);
                            setIsStatusModalOpen(false)
                        }}>{item.label}</button>
                    ))}
                </Block>

            </Sheet>
        </>
    )
}