import { Icon } from '@iconify/react';
import { useLocation, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation } from '@tanstack/react-query';
import { getBorrowingDetail } from "../api/borrowing";
import { PaymentRequestApi } from "../api/transactions";
import { returnRequestApi } from '../api/returning';// Import API yang sudah kita update
import {
    Navbar,
    Page,
    Badge,
    Button,
    Sheet,
    Block,
    NavbarBackLink,
    Card
} from 'konsta/react';
import { useToast } from "../context/toastContext";
import { useState } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../context/authContext';
import useSubstring from '../utils/textFormatter';
import { useNavigate } from '@tanstack/react-router';
import { borrowingStatusMapper, returningConditonStatusMapper, returningStatusMapper, transactionStatusMapper } from '../utils/statusMappers';
import useFormatDate from '../utils/dateFormatter';
import Divider from '../components/custom/divider';
import { transactionTypeMapper } from '../utils/transactionTypeMapper';
import BorrowingDetailSkeleton from '../components/custom/skeletons/borrowingDetailSkeleton';
import StatusBadge from '../components/custom/statusBadge';

export default function BorrowingDetailPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { history } = useRouter();
    const location = useLocation();
    const borrowingId = (location.state as { id: number })?.id;
    const { user } = useAuth()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [returnedCondition, setReturnedCondition] = useState(null);
    const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const conditonOption = [
        {
            name: "good",
            label: "Bagus"
        },
        {
            name: "bad",
            label: "Rusak"
        },
        {
            name: "lost",
            label: "Hilang"
        }
    ]

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['borrowingDetail', borrowingId],
        queryFn: () => getBorrowingDetail(borrowingId),
        enabled: !!borrowingId,
    });

    const borrowingData = data?.data;
    const transactionData = borrowingData?.transactions?.length > 0 ? borrowingData?.transactions : null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEvidenceFile(file);
            // Buat URL preview
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const paymentMutation = useMutation({
        mutationFn: (transactionId: number) => PaymentRequestApi(transactionId),
        onSuccess: (res) => {
            if (res.success && res.data.snapToken) {
                window.snap.pay(res.data.snapToken.token, {
                    onSuccess: () => {
                        showToast("Pembayaran Berhasil!");
                        refetch();
                    },
                    onError: () => showToast("Pembayaran Gagal", "error"),
                });
            }
        }
    });

    const returnMutation = useMutation({
        mutationFn: returnRequestApi,
        onSuccess: () => {
            showToast("Berhasil mengirim permintaan pengembalian");
            setIsModalOpen(false);
            refetch();
        },
        onError: (err: any) => {
            showToast(err.response?.data?.message || "Gagal mengirim permintaan", "error");
        }
    });

    const handleConfirmReturn = () => {
        if (!borrowingData) return;

        if (!returnedCondition) {
            showToast("Pilih kondisi barang", "error");
            return;
        }
        returnMutation.mutate({
            borrowing_id: borrowingData.id,
            item_id: borrowingData.item.id,
            item_variant_id: borrowingData.selected_variant.id,
            warehouse_id: 1,
            returned_quantity: borrowingData.quantity,
            returned_condition: returnedCondition,
            return_evidence_file: evidenceFile,
        });
    };

    const hasPaid = transactionData?.some(t => t.status === 'paid');
    const isReturned = !!borrowingData?.returnings;

    if (isLoading) return <BorrowingDetailSkeleton/>;

    const qrDataRaw = borrowingData ? {
        borrowing_id: borrowingData.id,
        user_id: user?.id
    } : null

    const qrData = JSON.stringify(qrDataRaw)

    return (
        <>
            <Navbar
                className="top-0 sticky"
                left={<NavbarBackLink onClick={() => history.go(-1)} />}
                title="Detail Peminjaman"
                colors={{
                    bgMaterial: 'bg-white'
                }}
            />

            <Block className='grid grid-cols-1 gap-4 pb-10'>
                <div className='flex justify-between'>
                    <p className='text-gray-500'>ID Peminjaman</p>
                    <p className='font-medium'>{borrowingData?.id}</p>
                </div>
                <div className='flex justify-between'>
                    <p className='text-gray-500'>Tipe Pembayaran</p>
                    <p className='font-medium'>{transactionTypeMapper(borrowingData?.payment_type)}</p>
                </div>
                <div className='flex justify-between'>
                    <p className='text-gray-500'>Status Pinjam</p>
                    <StatusBadge
                        status={borrowingData?.status}
                    />
                </div>
                <div className='flex justify-between'>
                    <p className='text-gray-500'>Tgl Pinjam</p>
                    <p>{useFormatDate(borrowingData?.borrow_date || '-')}</p>
                </div>
                <div className='flex justify-between'>
                    <p className='text-gray-500'>Batas Kembali</p>
                    <p>{useFormatDate(borrowingData?.return_date || '-')}</p>
                </div>
                <Button rounded className='mt-2 bg-primary' onClick={() => setIsQRModalOpen(!isQRModalOpen)}>Tampilkan QR Peminjaman</Button>

                <Divider />
                <h1 className='font-semibold text-xl'>Barang</h1>
                <button onClick={() => navigate({
                    to: '/item',
                    state: (prev) => ({ ...prev, id: borrowingData?.item.id })
                })}>
                    <div className="bg-white shadow-md rounded-xl p-4 text-start border-gray-200 border-2">
                        <div className="flex gap-x-4 h-full w-full items-center">
                            <img className="size-16 rounded-xl object-cover" src={borrowingData?.item.image_url || 'placeholders/item.png'} alt="" />
                            <div>
                                <p className="text-lg font-semibold">{useSubstring(borrowingData?.item.name)}</p>
                                <p className="text-gray-500 text-sm">Varian {borrowingData?.selected_variant.name}</p>
                                <p className="text-gray-500 text-sm">Total Jumlah Pinjam {borrowingData?.quantity}</p>
                            </div>
                        </div>
                    </div>
                </button>



                {transactionData && (
                    <>
                        <Divider />
                        <h1 className='font-semibold text-xl mb-5'>Pembayaran</h1>
                        {transactionData.map((t) => (
                            <div key={t.id} className="bg-white shadow-md rounded-xl p-4 text-start border-gray-200 border-2">
                                <div className='flex justify-between mb-4'>
                                    <p className="text-gray-500 text-sm">ID Pembayaran</p>
                                    <p className="font-bold">{t.id}</p>
                                </div>
                                <div className='flex justify-between mb-4'>
                                    <p className="text-gray-500 text-sm">Status Bayar</p>
                                    <StatusBadge
                                        status={t.status}
                                    />
                                </div>
                                <div className='flex justify-between mb-4'>
                                    <p className="text-gray-500 text-sm">Tipe Pembayaran</p>
                                    <p className="font-bold">{transactionTypeMapper(t.type)}</p>
                                </div>
                                <div className='flex justify-between mb-4'>
                                    <p className="text-gray-500 text-sm">Total</p>
                                    <p className="font-bold">Rp {Number(t.amount).toLocaleString('id-ID')}</p>
                                </div>
                                <div className='flex justify-between mb-4'>
                                    <p className="text-gray-500 text-sm">Dibayarkan Pada</p>
                                    <p className="font-bold">{
                                        useFormatDate(t?.paid_at || '-')
                                    }</p>
                                </div>
                                {t.status === 'unpaid' && (
                                    <Button
                                        rounded
                                        onClick={() => paymentMutation.mutate(t.id)}
                                        disabled={paymentMutation.isPending}
                                        className='bg-primary'
                                    >
                                        {paymentMutation.isPending ? 'Menghubungkan...' : 'Bayar Sekarang'}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </>
                )}

                {isReturned && (
                    <>
                        <Divider />
                        <h1 className='font-semibold text-xl mb-5'>Pengembalian</h1>
                        <div className="bg-white shadow-md rounded-xl p-4 text-start border-gray-200 border-2">
                            <div className='flex justify-between mb-4'>
                                <p className="text-gray-500 text-sm">Kondisi Barang</p>
                                <p className="font-bold">{returningConditonStatusMapper(borrowingData?.returnings?.returned_condition || '-')}</p>
                            </div>
                            <div className='flex justify-between mb-4'>
                                <p className="text-gray-500 text-sm">Verifikasi Admin</p>
                                <StatusBadge
                                    status={borrowingData?.returnings?.status || '-'}
                                />
                            </div>
                            <div className='flex justify-between mb-4'>
                                <p className="text-gray-500 text-sm">Tanggal Pengembalian</p>
                                <p className="font-bold">{useFormatDate(borrowingData?.returnings?.returned_date || '-')}</p>
                            </div>
                        </div>
                    </>

                )}
                {hasPaid && !isReturned && borrowingData?.status !== 'pending' && (
                    <Button
                        large rounded
                        onClick={() => setIsModalOpen(true)}
                        className="w-full mt-5 bg-primary"
                    >
                        Ajukan Pengembalian
                    </Button>
                )}
            </Block>
            <Sheet className='bg-white' opened={isModalOpen} onBackdropClick={() => setIsModalOpen(false)}>
                <Block>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className='font-bold text-2xl'>Konfirmasi Pengembalian</h1>
                    </div>

                    {/* Seksi Kondisi Barang */}
                    <section className="mb-6">
                        <p className='text-sm text-gray-500 tracking-wider mb-3'>Kondisi Barang</p>
                        <div className='grid grid-cols-2 gap-3'>
                            {conditonOption.map((item, index) => (
                                <div
                                    key={index}
                                    className={`p-3 rounded-xl border-2 transition-all shadow-md cursor-pointer ${returnedCondition === item.name
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-100 dark:border-zinc-800'
                                        }`}
                                    onClick={() => setReturnedCondition(item.name)}
                                >
                                    <p className="font-bold text-sm">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Seksi Upload Foto */}
                    <section className="mb-6">
                        <p className='text-sm text-gray-500 tracking-wider mb-3'>Bukti Foto</p>
                        <div className="space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-opacity-80 cursor-pointer"
                            />
                            <p className="text-xs text-gray-400">Format: JPG, PNG, WEBP (Maks 5MB)</p>

                            {previewUrl && (
                                <div className="mt-4 relative inline-block w-full">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full max-h-48 object-cover rounded-xl border-2 border-primary/20 shadow-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            setEvidenceFile(null);
                                            setPreviewUrl(null);
                                        }}
                                        className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full p-1 shadow-lg"
                                    >
                                        <Icon icon="material-symbols:close-rounded" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className='w-full h-0.5 bg-gray-100 dark:bg-zinc-800 mt-8 mb-6'></div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            large
                            clear
                            outline
                            rounded
                            className="flex-1 text-primary border-primary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            large
                            rounded
                            className="bg-primary"
                            onClick={handleConfirmReturn}
                            disabled={returnMutation.isPending}
                        >
                            {returnMutation.isPending ? 'Memproses...' : 'Konfirmasi Kembali'}
                        </Button>
                    </div>
                </Block>
            </Sheet>
            <Sheet className='bg-white' opened={isQRModalOpen} onBackdropClick={() => setIsQRModalOpen(false)}>
                <Block>
                    <div className="flex flex-col items-center">
                        <h1 className="font-bold text-2xl mb-2">Kode QR Peminjaman</h1>
                        <p className="text-center text-gray-500 text-sm leading-relaxed mb-6 px-4">
                            QR ini dapat dipakai oleh staff untuk menyetujui permintaan peminjaman atau pengembalian barang Anda.
                        </p>

                        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800 mb-8">
                            <QRCodeSVG
                                className="mx-auto"
                                value={qrData}
                                level="H"
                                includeMargin={false} 
                                style={{ width: '200px', height: '200px' }} 
                            />
                        </div>

                        <Divider/>

                        <Button
                            large
                            rounded
                            className="w-full bg-primary"
                            onClick={() => setIsQRModalOpen(false)}
                        >
                            Tutup
                        </Button>
                    </div>
                </Block>
            </Sheet>
        </>
    );
}