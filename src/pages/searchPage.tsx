import { useLocation, useNavigate } from "@tanstack/react-router";
import { Page, Navbar, NavbarBackLink, Block, List, ListItem } from "konsta/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { searchItemApi } from "../api/item";
import ItemCard from "../components/custom/itemCard";

export default function SearchPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const keyword = (location.state as any)?.keyword;

    useEffect(() => {
        if (!keyword) {
            navigate({ to: '/', replace: true });
        }
    }, [keyword, navigate]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['items', 'search', keyword],
        queryFn: () => searchItemApi(keyword),
        enabled: !!keyword, 
    });

    return (
        <Page>
            <Navbar
                title="Hasil Pencarian"
                left={<NavbarBackLink onClick={() => history.go(-1)} />}
            />
            {isLoading && (
                <Block className="text-center">Memuat barang...</Block>
            )}

            {isError && (
                <Block className="text-center text-red-500">Gagal mengambil data.</Block>
            )}

            <div className='grid grid-cols-2 gap-5 px-5'>
                {data?.data.map((item, index) => (
                    <ItemCard key={index} item={item}/>
                ))}
            </div>

            {/* Empty State */}
            {data?.data.length === 0 && !isLoading && (
                <Block className="text-center text-gray-500">
                    Barang "{keyword}" tidak ditemukan.
                </Block>
            )}
        </Page>
    );
}