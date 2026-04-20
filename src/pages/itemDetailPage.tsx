import { Icon } from '@iconify/react';
import { useLocation, useNavigate, useRouter } from '@tanstack/react-router';
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
import useFormatRupiah from '../utils/rupiahFormatter';

export default function ItemDetailPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { history } = useRouter();
    const location = useLocation();
    const itemId = (location.state as { id: number })?.id;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTextTruncated, setIsTextTruncated] = useState(true);
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
    const [dueDate, setDueDate] = useState('');
    const item = data?.data;

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const parseDateOnly = (dateString: string) => {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const rentalDays = dueDate
        ? Math.max(
            1,
            Math.floor(
                (parseDateOnly(dueDate).getTime() -
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()) /
                millisecondsPerDay,
            ) + 1,
        )
        : 1;

    const totalPayment = Number(item?.borrow_price ?? 0) * value * rentalDays;

    const mutation = useMutation({
        mutationFn: requestBorrowingApi,
        onSuccess: (res) => {
            if (res.success) {
                showToast("Berhasil mengirim permintaan pinjam");
                setIsModalOpen(false);
                navigate({
                    to: '/history',
                    replace: true
                })
            } else if (res.message.includes("tidak mencukupi")) {
                showToast("Stok Barang tidak mencukupi");
            }
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

        if (!dueDate) {
            showToast("Silakan pilih tanggal pengembalian", "error");
            return;
        }

        const payload: BorrowRequestType = {
            item_id: item?.id ?? 0,
            item_variant_id: selectedVariantId,
            warehouse_id: item.warehouse_id || 1,
            quantity: value,
            payment_type: selectedPaymentType ?? 'full_payment',
            due_date: new Date(`${dueDate}T23:59:59`).toISOString(),
            notes: "",
        };

        mutation.mutate(payload);
    };

    if (isLoading) return <Page><Block className="text-center">Memuat detail barang...</Block></Page>;

    if (isError || !item) return <Page><Block className="text-center text-red-500">Gagal mengambil data atau barang tidak ditemukan.</Block></Page>;

    return (
        <>
            <Navbar
                className="top-0 fixed"
                left={
                    <div className='bg-white size-10 flex justify-center items-center rounded-full '>
                        <NavbarBackLink onClick={() => history.go(-1)} />
                    </div>
                }
                colors={{
                    bgMaterial: 'bg-transparent'
                }}
            />

            {/* Carousel Gambar */}
            <div className="overflow-hidden bg-white dark:bg-black" ref={emblaRef}>
                <div className="flex">
                    {item.images.map((img) => (
                        <div key={img.id} className="flex-[0_0_100%] min-w-0 relative h-[400px]">
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
                <div className='flex justify-between items-start mb-4'>
                    <div className='flex-1'>
                        <h1 className="text-2xl font-semibold mb-1">{item.name}</h1>
                        {/* <p className="text-lg font-semibold text-primary mb-1">Rp. {Number(item.borrow_price).toLocaleString('id-ID')}</p> */}
                        <p className="text-gray-500 text-sm mb-1">Total Stok Tersedia: {item.total_available_stock}</p>
                        <p className="text-lg font-semibold ">{useFormatRupiah(Number(item.borrow_price))}</p>
                    </div>
                    <button className='text-red-400 ml-4' onClick={handleFavorite}>
                        <Icon height={30} icon={item.is_favorite ? 'material-symbols:favorite-rounded' : 'material-symbols:favorite-outline-rounded'} />
                    </button>
                </div>

                <div className='mb-4'>
                    <div className="flex gap-1 flex-wrap">
                        {item.categories.map((cat) => (
                            <Badge key={cat.id} className='py-1'>{cat.name}</Badge>
                        ))}
                    </div>
                </div>

                <div className='mb-4'>
                    <h2 className="text-lg font-bold mb-2">Deskripsi</h2>
                    <p className="text-gray-500 leading-relaxed">
                        {isTextTruncated ? `${item.description.slice(0, 100)} ${item.description.length > 100 ? '...' : ''}` :
                            item.description}
                    </p>
                    {item.description.length > 100 && (
                        <button
                            onClick={() => setIsTextTruncated(!isTextTruncated)}
                            className="text-primary"
                        >
                            {isTextTruncated ? "Baca Selengkapnya" : "Sembunyikan"}
                        </button>
                    )}
                </div>
            </div>

            <div className='w-full bg-white/60 dark:bg-black/60 backdrop-blur-md bottom-0 left-0 fixed rounded-t-xl p-5'>
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

                    <div className='mb-4'>
                        <h1 className='font-bold text-xl mb-2'>Tanggal Pengembalian</h1>
                        <input
                            type="date"
                            value={dueDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                        />
                    </div>
                    <p>Total Bayar</p>
                    <p className='text-xs text-gray-500'>Durasi: {rentalDays} hari</p>
                    <p className='my-2'>Rp. {totalPayment.toLocaleString('id-ID')}</p>

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
        </>
    );
}