import {
    Navbar,
    Card,
    BlockTitle,
    Page,
} from 'konsta/react';
import { useQuery } from "@tanstack/react-query";
import ItemCard from '../components/custom/itemCard';
import { getFavoriteItemsApi } from '../api/item';
import { useState } from 'react';
import ItemCardSkeleton from '../components/custom/itemCardSkeleton';

export default function FavoritePage() {
    const [currentPage, setCurrentPage] = useState(1)
    const { data, isLoading, isError } = useQuery({
        queryKey: ['items', currentPage],
        queryFn: () => getFavoriteItemsApi(currentPage),
    });

    return (
        <Page>
            <BlockTitle>Favorite</BlockTitle>
            <div className='grid grid-cols-2 gap-5 px-5'>
                {isLoading ? (

                    // Show skeleton loading cards
                    Array.from({ length: 6 }).map((_, index) => (
                        <ItemCardSkeleton key={`skeleton-${index}`} />
                    ))
                ) : (
                    // Show actual items
                    data?.data?.map((item, index) => (
                        <ItemCard key={index} item={item} />
                    ))
                )}
            </div>
        </Page>
    )
}