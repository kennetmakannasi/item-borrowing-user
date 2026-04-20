import { useState, useEffect, type KeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Page, Navbar, NavbarBackLink, Block, List, ListItem, Searchbar } from "konsta/react";
import { searchItemApi } from "../api/item";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";

export default function SearchPage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    function handleSearch(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            navigate({
                to: '/search-result',
                state: (prev) => ({
                    ...prev,
                    keyword: searchQuery
                })
            })
        }
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const { data: suggestions, isLoading } = useQuery({
        queryKey: ['items', 'suggestion', debouncedQuery],
        queryFn: () => searchItemApi(debouncedQuery),
        enabled: debouncedQuery.length > 2,
    });

    const handleSearchSubmit = (value: string) => {
        if (!value.trim()) return;
        navigate({
            to: '/search-result', // Arahkan ke halaman hasil
            state: { keyword: value }
        });
    };

    return (
        <Page>
            <Navbar
                colors={{
                    bgMaterial: 'bg-white shadow-md'
                }}
            >
                <div className='px-4 w-full flex justify-between gap-x-3'>
                    <button onClick={() => navigate({
                        to: '/qr-scan',
                        replace: true
                    })} className='w-10 flex items-center justify-center text-gray-500'>
                        <Icon height={30} icon={'boxicons:qr'} />
                    </button>
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Cari'
                        onKeyDown={handleSearch}
                        className='w-full px-5 py-3 rounded-full border-2 border-gray-200 transition-all outline-none '
                    />
                </div>
            </Navbar>

            <div className="p-4">
                {isLoading && searchQuery.length > 2 && (
                    <ListItem title="Mencari saran..." />
                )}

                {suggestions?.data && suggestions.data.length > 0 ? (
                    suggestions.data.map((item: any) => (
                        <button
                            onClick={() => handleSearchSubmit(item.name)}
                            className="flex px-2 py-3 space-x-2 items-center"
                            key={item.id}
                        >
                            <Icon height={20} icon={"material-symbols:search-rounded"} />
                            <p>{item.name}</p>
                        </button>
                        // <ListItem
                        //     key={item.id}
                        //     link
                        //     title={item.name}
                        //     after={<span className="text-xs text-gray-400">Pilih</span>}
                        //     onClick={() => handleSearchSubmit(item.name)}
                        // />
                    ))
                ) : (
                    debouncedQuery.length > 2 && !isLoading && (
                        <ListItem
                            title={`Cari "${searchQuery}"`}
                            link
                            onClick={() => handleSearchSubmit(searchQuery)}
                        />
                    )
                )}
            </div>

            {!searchQuery && (
                <Block className="text-gray-500 pt-20">
                    <div className="size-full flex items-center justify-center">
                        <Icon height={80} icon={"material-symbols:search-rounded"} />
                    </div>
                    <p className="text-center">Mulai masukan kata pencarian</p>
                </Block>
            )}
        </Page>
    );
}