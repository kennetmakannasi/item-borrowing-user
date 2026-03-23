import {
    Navbar,
    Card,
    BlockTitle,
    Page,
    Sheet,
    Block,
    Badge,
} from 'konsta/react';
import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { getBorrowingHistoryApi } from '../api/borrowing';
import BorrowingHistoryCard from '../components/custom/borrowingCard';
import type { BorrowHistoryItem } from '../interfaces/borrowing';

export default function HistoryPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<BorrowHistoryItem | null>();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['borrowings', currentPage],
        queryFn: () => getBorrowingHistoryApi(currentPage),
    });

    function handleOpenModal(data) {
        setSelectedData(data);
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setSelectedData(null);
        setIsModalOpen(false);
    }

    return (
        <Page>
            <BlockTitle>Histori</BlockTitle>
            <div className='grid grid-cols-1 gap-5 px-5'>
                {data?.data.map((item, index) => (
                    <BorrowingHistoryCard
                        item={item}
                        onClick={() => handleOpenModal(item)}
                    />
                ))}
            </div>
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
                        <p>{new Date(selectedData?.borrow_date).toLocaleString("id-ID")}</p>
                    </div>
                    <div className='flex justify-between'>
                        <p>Status Peminjaman:</p>
                        <Badge className='p-1'>{selectedData?.status}</Badge>
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