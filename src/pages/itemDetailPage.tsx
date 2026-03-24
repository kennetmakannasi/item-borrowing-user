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
import { useQuery } from '@tanstack/react-query'; // Import Query
import { favoriteApi, getItemDetailApi, removeFavoriteApi } from '../api/item';
import { useToast } from '../context/toastContext';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestBorrowingApi } from '../api/borrowing';
import type { BorrowRequestType } from '../interfaces/schemas/borrowing';
import type { PaymentType } from '../interfaces/borrowing';

export default function ItemDetailPage() {
    const { showToast } = useToast();
    const { history } = useRouter();
    const location = useLocation();
    const itemId = (location.state as { id: number })?.id;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [value, setValue] = useState(1);
    const { data, isLoading, refetch, isError } = useQuery({
        queryKey: ['itemDetail', itemId],
        queryFn: () => getItemDetailApi(itemId),
        enabled: !!itemId,
    });

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    const increase = () => setValue(prev => prev + 1);
    const decrease = () => setValue(prev => (prev - 1 < 1 ? 1 : prev - 1));

    async function handleFavorite() {
        try {
            if (data?.data?.is_favorite) {
                const res = await removeFavoriteApi(data?.data?.id)
                if (res?.success) {
                    showToast(res?.message);
                } else {
                    console.error(res?.message);
                    showToast(res?.message);
                }
            } else {
                const res = await favoriteApi({
                    item_id: data?.data.id ?? 0
                });
                if (res?.success) {
                    showToast(res?.message);
                } else {
                    console.error(res?.message);
                    showToast(res?.message);
                }
            }
            refetch();
        } catch (error: any) {
            console.error(error)
        }
    }
    const queryClient = useQueryClient();
    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
    const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | null>(null);

    const mutation = useMutation({
        mutationFn: requestBorrowingApi,
        onSuccess: (res) => {
            showToast("Berhasil mengirim permintaan pinjam");
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['itemDetail', itemId] });
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || "Terjadi kesalahan", "error");
        }
    });

    const handleConfirmBorrow = () => {
        if (!selectedVariantId) {
            showToast("Silakan pilih varian terlebih dahulu", "error");
            return;
        }

        const payload: BorrowRequestType = {
            item_id: item?.id ?? 0,
            item_variant_id: selectedVariantId,
            warehouse_id: item.warehouse_id || 1,
            quantity: value,
            payment_type: selectedPaymentType ?? 'full_payment',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            notes: "",
        };

        mutation.mutate(payload);
    };

    const item = data?.data;

    if (isLoading) return <Page><Block className="text-center">Memuat detail barang...</Block></Page>;

    if (isError || !item) return <Page><Block className="text-center text-red-500">Gagal mengambil data atau barang tidak ditemukan.</Block></Page>;

    return (
        <Page>
            <Navbar
                className="top-0 sticky"
                left={<NavbarBackLink onClick={() => history.go(-1)} />}
                title={item.name}
            />

            {/* Carousel Gambar */}
            <div className="overflow-hidden bg-white dark:bg-black" ref={emblaRef}>
                <div className="flex">
                    {item.images.map((img, index) => (
                        <div key={img.id} className="flex-[0_0_100%] min-w-0 relative h-80">
                            <img
                                src={img.url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-x-3 m-4 overflow-x-auto">
                {item.images.map((img, index) => (
                    <button key={img.id} onClick={() => emblaApi && emblaApi.scrollTo(index)}>
                        <img
                            src={img.url}
                            className="size-16 rounded-lg object-cover border-2 border-transparent focus:border-primary"
                        />
                    </button>
                ))}
            </div>

            <div className='px-5 py-2 mb-24'>
                <div className='flex justify-between items-center'>
                    <div>
                        <h1 className="text-xl font-bold">{item.name}</h1>
                        <p className="text-gray-500 mt-1">Total Stok: {item.total_available_stock}</p>
                    </div>
                    <button className='text-red-400' onClick={handleFavorite}>{
                        item.is_favorite ?
                            <Icon height={30} icon={'material-symbols:favorite-rounded'} /> :
                            <Icon height={30} icon={'material-symbols:favorite-outline-rounded'} />
                    }</button>
                </div>


                <div className='mt-4'>
                    <h1 className="text-lg font-bold">Detail Barang</h1>
                    <div className='flex justify-between items-center'>
                        <p>Kategori :</p>
                        <div className="flex gap-1">
                            {item.categories.map((cat) => (
                                <Badge key={cat.id} className='py-1'>{cat.name}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='mt-4'>
                    <h1 className="text-lg font-bold">Deskripsi</h1>
                    <p className="text-gray-600 leading-relaxed">
                        {item.description || 'Deskripsi Tidak Tersedia'}
                    </p>
                </div>
            </div>

            <div className='bg-white dark:bg-zinc-900 w-full bottom-0 left-0 fixed rounded-t-xl p-5 shadow-2xl border-t'>
                <Button onClick={() => setIsModalOpen(true)} className='rounded-full h-12'>Pinjam Sekarang</Button>
            </div>

            <Sheet
                opened={isModalOpen}
                onBackdropClick={() => setIsModalOpen(false)}
            >
                <Block className="ios:mt-4">
                    <h1 className='font-bold text-xl mb-4'>Pilih Varian</h1>
                    <div className='grid grid-cols-2 gap-2 mb-4'>
                        {item.variants.map((v) => (
                            <Card
                                key={v.id}
                                className={`m-0 cursor-pointer transition-all border-2 ${selectedVariantId === v.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-transparent'
                                    }`}
                                onClick={() => setSelectedVariantId(v.id)}
                            >
                                <p className="font-semibold">{v.name}</p>
                                <p className="text-xs text-gray-500">Stok: {v.availableStock}</p>
                            </Card>
                        ))}
                    </div>

                    <div className='w-full flex justify-between items-center px-2 mb-6'>
                        <div>
                            <p className='text-md font-medium'>Jumlah Pinjam</p>
                            <p className='text-xs text-gray-400'>Maksimal: {item.variants.find(v => v.id === selectedVariantId)?.availableStock || 0}</p>
                        </div>
                        <Stepper
                            value={value}
                            onPlus={increase}
                            onMinus={decrease}
                        />
                    </div>

                    <h1 className='font-bold text-xl mb-4'>Pilih Pembayaran</h1>
                    <div className='grid grid-cols-2 gap-2 mb-4'>

                        <Card
                            className={`m-0 cursor-pointer transition-all border-2 ${selectedPaymentType === "full_payment"
                                ? 'border-primary bg-primary/5'
                                : 'border-transparent'
                                }`}
                            onClick={() => setSelectedPaymentType("full_payment")}
                        >
                            <p className="font-semibold">Full</p>
                        </Card>
                        <Card
                            className={`m-0 cursor-pointer transition-all border-2 ${selectedPaymentType === "deposit_payment"
                                ? 'border-primary bg-primary/5'
                                : 'border-transparent'
                                }`}
                            onClick={() => setSelectedPaymentType("deposit_payment")}
                        >
                            <p className="font-semibold">DP</p>
                        </Card>
                    </div>

                    <div className="flex gap-x-3">
                        <Button outline rounded onClick={() => setIsModalOpen(false)}>
                            Batal
                        </Button>
                        <Button
                            rounded
                            onClick={handleConfirmBorrow}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Memproses..." : "Konfirmasi"}
                        </Button>
                    </div>
                </Block>
            </Sheet>
        </Page>
    );
}