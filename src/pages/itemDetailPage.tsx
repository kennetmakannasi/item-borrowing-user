import { Icon } from '@iconify/react';
import { useLocation, useRouter } from '@tanstack/react-router';
import {
    Navbar,
    Page,
    Card,
    Badge,
    Button,
    Sheet,
    Block,
    Stepper,
    NavbarBackLink,
} from 'konsta/react';
import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

export default function ItemDetailPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { history } = useRouter();
    const [size] = useState('Default');

    const [value, setValue] = useState(1);
    const increase = () => {
        setValue(value + 1);
    };
    const decrease = () => {
        setValue(value - 1 < 0 ? 0 : value - 1);
    };

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    const dummyData = { id: 14, code: null, name: "magsgsfga", description: null, borrow_price: null, total_available_stock: 2, categories: [{ id: 1, name: "mgfsgs" }], images: [{ id: 10, url: "https://uzdxmohwhhtcxagqpuct.supabase.co/storage/v1/object/public/UKK-local/images/67dd859f-578e-40f0-ad04-71c5bfd7e385.jpg", slug: "67dd859f-578e-40f0-ad04-71c5bfd7e385" }, { id: 11, url: "https://uzdxmohwhhtcxagqpuct.supabase.co/storage/v1/object/public/UKK-local/images/a0ae0c47-c7f3-4935-9fb7-8e0ca42967cb.jpg", slug: "a0ae0c47-c7f3-4935-9fb7-8e0ca42967cb" }], variants: [{ id: 16, slug: null, name: "cfsfgsfo", availableStock: 1, itemId: 14 }, { id: 14, slug: null, name: "mafsgfh", availableStock: 1, itemId: 14 }], created_at: "2026-02-28T14:00:15.981Z" }

    return (
        <Page>
            <Navbar
                className="top-0 sticky"
                medium={size === 'Medium'}
                large={size === 'Large'}
                left={<NavbarBackLink onClick={() => history.go(-1)} />}
            />
            <div className="overflow-hidden bg-white dark:bg-black" ref={emblaRef}>
                <div className="flex">
                    {dummyData.images.map((src, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 relative h-80">
                            <img
                                src={src.url}
                                alt={`Item ${index}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex gap-x-3 m-4">
                {dummyData.images.map((src, index) => (
                    <button onClick={() => emblaApi && emblaApi.scrollTo(index)}>
                        <img
                            src={src.url}
                            alt={`Item ${index}`}
                            className="size-16 rounded-lg object-cover"
                        />
                    </button>

                ))}
            </div>
            <div className='px-5 py-2'>
                <div>
                    <h1 className="text-xl font-bold">{dummyData.name}</h1>
                    <p className="text-gray-500 mt-1">Total Stok: {dummyData.total_available_stock}</p>
                    <div className='mt-4'>
                        <h1 className="text-lg font-bold">Detail Barang</h1>
                        <div className='flex justify-between'>
                            <p>Kategori :</p>
                            <div>{dummyData.categories.map((item) => (
                                <Badge className='py-1'>
                                    {item.name}
                                </Badge>
                            ))}</div>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <h1 className="text-lg font-bold">Deskripsi</h1>
                        <p>{dummyData?.description || 'Deskripsi Tidak Tersedia'}</p>
                    </div>
                </div>
            </div>
            <div className='bg-white w-full bottom-0 left-0 fixed rounded-t-xl p-5'>
                <Button onClick={() => setIsModalOpen(true)} className='rounded-full'>Pinjam</Button>
            </div>
            <Sheet
                opened={isModalOpen}
                onBackdropClick={() => setIsModalOpen(false)}
            >

                <Block className="ios:mt-4">
                    <h1 className='font-bold text-xl'>Varian</h1>
                    <div className='grid grid-cols-2'>
                        {dummyData.variants.map((item) => (
                            <Card>
                                <p>{item.name}</p>
                                <p>Stok: {item.availableStock}</p>
                            </Card>
                        ))}
                    </div>
                    <div className='w-full flex justify-between items-center px-2'>
                        <p className='text-md'>Jumlah</p>
                        <Stepper small value={value} onPlus={increase} onMinus={decrease} />
                    </div>
                    <div className='w-full flex justify-between items-center mt-4 px-2'>
                        <p className='text-md'>Jumlah</p>
                        <p className='font-semibold'>Rp. 0</p>
                    </div>
                    <div className="mt-8 flex gap-x-3">
                        <Button outline rounded onClick={() => setIsModalOpen(false)}>
                            Batal
                        </Button>
                        <Button rounded onClick={() => setIsModalOpen(false)}>
                            Pinjam
                        </Button>
                    </div>
                </Block>
            </Sheet>
        </Page>
    );
}