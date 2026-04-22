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
import ItemDetailSkeleton from '../components/custom/skeletons/itemDetailSkeleton';

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

    const handlePresetDays = (days: number) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        setDueDate(targetDate.toISOString().split('T')[0]);
    };
    if (isLoading) return <ItemDetailSkeleton />;

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
                right={
                    <button onClick={
                        () => navigate({
                            to: '/search',
                            replace: true
                        })
                    } className='bg-white size-10 flex justify-center items-center rounded-full '>
                        <Icon height={24} icon={'material-symbols:search-rounded'} />
                    </button>
                }
                colors={{
                    bgMaterial: 'bg-transparent'
                }}
            />

            {/* Carousel Gambar */}
            <div className="overflow-hidden bg-white dark:bg-black" ref={emblaRef}>
                <div className="flex">
                    {/* Cek jika item.images kosong, tampilkan placeholder */}
                    {item.images.length === 0 ? (
                        <div className="flex-[0_0_100%] min-w-0 h-[400px]">
                            <img
                                src="placeholders/item.png"
                                className="w-full h-full object-cover"
                                alt="placeholder"
                            />
                        </div>
                    ) : (
                        item.images.map((img) => (
                            <div key={img.id} className="flex-[0_0_100%] min-w-0 relative h-[400px]">
                                <img
                                    src={img.url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    // Handle jika link gambar mati (broken link)
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'placeholders/item.png';
                                    }}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-x-3 m-4 overflow-x-auto">
                {item.images.map((img, index) => (
                    <button key={img.id} onClick={() => emblaApi && emblaApi.scrollTo(index)}>
                        <img
                            src={img.url}
                            className="size-16 rounded-lg object-cover border-2 border-transparent focus:border-primary"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'placeholders/item.png';
                            }}
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
                <Button onClick={() => setIsModalOpen(true)} className='rounded-full bg-primary h-12'>Pinjam Sekarang</Button>
            </div>

            <Sheet className='bg-white' opened={isModalOpen} onBackdropClick={() => setIsModalOpen(false)}>
                <Block >
                    <div className="flex justify-between items-center mb-6">
                        <h1 className='font-bold text-2xl'>Detail Peminjaman</h1>
                    </div>

                    {/* Seksi Varian */}
                    <section className="mb-6">
                        <p className='text-sm text-gray-500 tracking-wider mb-3'>Pilih Varian</p>
                        <div className='grid grid-cols-2 gap-3'>
                            {item.variants.map((v) => (
                                <div
                                    key={v.id}
                                    className={`p-3 rounded-xl border-2 transition-all shadow-md cursor-pointer ${selectedVariantId === v.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-100 dark:border-zinc-800'
                                        }`}
                                    onClick={() => setSelectedVariantId(v.id)}
                                >
                                    <p className="font-bold text-sm">{v.name}</p>
                                    <p className="text-sm text-gray-500 tracking-tight">Tersedia: {v.availableStock}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Seksi Jumlah & Durasi */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className='flex justify-between w-full'>
                            <p className='text-sm text-gray-500 mb-3'>Jumlah</p>
                            <Stepper
                                value={value}
                                small
                                rounded
                                onPlus={increase}
                                onMinus={decrease}
                                colors={{
                                    fillBgMaterial: 'bg-primary',
                                    textMaterial: 'text-gray-500'
                                }}
                            />
                        </div>
                        <div>
                            <p className='text-sm text-gray-500 tracking-wider mb-3'>Pembayaran</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelectedPaymentType('full_payment')}
                                    className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium border transition-all ${selectedPaymentType === 'full_payment'
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-transparent border-gray-200 dark:border-zinc-700 text-gray-600'
                                        }`}
                                >
                                    Full
                                </button>
                                <button
                                    onClick={() => setSelectedPaymentType('deposit_payment')}
                                    className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium border transition-all ${selectedPaymentType === 'deposit_payment'
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-transparent border-gray-200 dark:border-zinc-700 text-gray-600'
                                        }`}
                                >
                                    DP
                                </button>
                            </div>
                        </div>
                        <section>
                            <p className='text-sm text-gray-500 mb-3'>Durasi Pengembalian</p>

                            {/* Preset Buttons */}
                            <div className="flex gap-2 mb-3">
                                {[3, 5, 7].map((days) => (
                                    <button
                                        key={days}
                                        onClick={() => handlePresetDays(days)}
                                        className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium border transition-all ${rentalDays === days + 1
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-transparent border-gray-200 dark:border-zinc-700 text-gray-600'
                                            }`}
                                    >
                                        {days} Hari
                                    </button>
                                ))}
                            </div>

                            <input
                                type="date"
                                value={dueDate}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 focus:border-primary outline-none transition-all"
                            />
                        </section>
                    </div>

                    {/* Seksi Tanggal & Preset */}


                    {/* Ringkasan Biaya */}
                    <div className='w-full h-0.5 bg-gray-200 my-4'></div>
                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-4">
                        <div className="flex justify-between items-center mb-1 text-gray-500 text-sm">
                            <span>Total Durasi</span>
                            <span className="font-medium text-foreground">{rentalDays} Hari</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total Bayar</span>
                            <span>{useFormatRupiah(totalPayment)}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            large
                            outline
                            className="flex-1 text-primary rounded-full border-primary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            large
                            rounded
                            className="bg-primary"
                            onClick={handleConfirmBorrow}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Memproses..." : "Konfirmasi Pinjam"}
                        </Button>
                    </div>
                </Block>
            </Sheet>
        </>
    );
}