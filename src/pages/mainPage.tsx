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

export default function MainPage() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    function handleSearch(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            navigate({
                to: '/search',
                state: (prev) => ({
                    ...prev,
                    keyword: inputValue
                })
            })
        }
    }

    const { data, isLoading, isError } = useQuery({
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

    return (
        <Page>
            <Navbar
                colors={{
                    bgMaterial: 'bg-white shadow-md'
                }}
            >
                <div className='px-4 w-full flex justify-between gap-x-3'>
                    <input
                        type='text'
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder='Cari'
                        onKeyDown={handleSearch}
                        className='w-full px-5 py-3 rounded-full border-2 border-gray-200 transition-all outline-none '
                    />
                    <button onClick={() => navigate({
                        to: '/notifications',
                        replace: true
                    })} className='w-10 flex items-center justify-center text-gray-500'>
                        <Icon height={30} icon={'ion:notifications-outline'} />
                    </button>
                </div>
            </Navbar>
            {isLoading && (
                <Block className="text-center">Memuat barang...</Block>
            )}

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
                    {data?.data.map((item, index) => (
                        <ItemCard key={index} item={item} />
                    ))}
                </div>
            )}
        </Page>
    )
}