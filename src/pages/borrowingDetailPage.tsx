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
import { borrowingStatusMapper, returningStatusMapper, transactionStatusMapper } from '../utils/statusMappers';

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

    if (isLoading) return <Page><Block className="text-center">Memuat...</Block></Page>;

    const qrDataRaw = borrowingData ? {
        borrowing_id: borrowingData.id,
        user_id: user?.id
    } : null

    const qrData = JSON.stringify(qrDataRaw)

    return (
        <Page>
            <Navbar
                className="top-0 sticky"
                left={<NavbarBackLink onClick={() => history.go(-1)} />}
                title="Detail Peminjaman"
            />

            <Block className='grid grid-cols-1 gap-2 pb-20'>
                <h1 className='font-semibold text-xl mb-5'>Detil Peminjaman</h1>
                <div className='flex justify-between'>
                    <p className='text-gray-500'>ID Peminjaman:</p>
                    <p className='font-medium'>{borrowingData?.id}</p>
                </div>
                <div className='flex justify-between'>
                    <p className='text-gray-500'>Tipe Pembayaran:</p>
                    <p className='font-medium'>{borrowingData?.payment_type}</p>
                </div>
                <div className='flex justify-between'>
                    <p className='text-gray-500'>Status Pinjam:</p>
                    <Badge className='capitalize'>{borrowingStatusMapper(borrowingData?.status)}</Badge>
                </div>
                <div className='flex justify-between'>
                    <p className='text-gray-500'>Tgl Pinjam:</p>
                    <p>{new Date(borrowingData?.borrow_date!).toLocaleString("id-ID")}</p>
                </div>
                <Button rounded className='mt-2' onClick={() => setIsQRModalOpen(!isQRModalOpen)}>Tampilkan QR Peminjaman</Button>

                <h1 className='font-semibold text-xl my-5'>Barang</h1>
                <button onClick={() => navigate({
                    to: '/item',
                    state: (prev) => ({ ...prev, id: borrowingData?.item.id })
                })}>
                    <div className="bg-white shadow-md rounded-xl p-4 text-start">
                        <div className="flex gap-x-4 h-full w-full items-center">
                            <img className="size-16 rounded-xl object-cover" src={borrowingData?.item.image_url} alt="" />
                            <div>
                                <p className="text-lg font-semibold">{useSubstring(borrowingData?.item.name)}</p>
                                <p className="text-gray-500 text-sm">Varian: {borrowingData?.selected_variant.name}</p>
                                <p className="text-gray-500 text-sm">Total Jumlah Pinjam: {borrowingData?.quantity}</p>
                            </div>
                        </div>
                    </div>
                </button>



                {transactionData && (
                    <>
                        <h1 className='font-semibold text-xl my-5'>Pembayaran</h1>
                        {transactionData.map((t) => (
                            <div key={t.id} className="bg-white shadow-md rounded-xl p-4 text-start">
                                <div className='flex justify-between mb-4'>
                                    <p className="text-gray-500 text-sm">ID Pembayaran:</p>
                                    <p className="font-bold">{t.id}</p>
                                </div>
                                <div className='flex justify-between mb-4'>
                                    <p className="text-gray-500 text-sm">Status Bayar</p>
                                    <Badge colors={{ bg: t.status === 'paid' ? 'bg-green-500' : 'bg-red-500' }}>
                                        {transactionStatusMapper(t.status)}
                                    </Badge>
                                </div>
                                <div className='flex justify-between mb-4'>
                                    <p className="text-gray-500 text-sm">Tipe Pembayaran:</p>
                                    <p className="font-bold">{t.type}</p>
                                </div>
                                <div className='flex justify-between mb-4'>
                                    <p className="text-gray-500 text-sm">Total</p>
                                    <p className="font-bold">Rp {Number(t.amount).toLocaleString('id-ID')}</p>
                                </div>
                                <div className='flex justify-between mb-4'>
                                    <p className="text-gray-500 text-sm">Dibayarkan Pada:</p>
                                    <p className="font-bold">{t.paid_at ?
                                        new Date(t.paid_at!).toLocaleString("id-ID") :
                                        '-'
                                    }</p>
                                </div>
                                {t.status === 'unpaid' && (
                                    <Button
                                        rounded
                                        onClick={() => paymentMutation.mutate(t.id)}
                                        disabled={paymentMutation.isPending}
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
                        <div className="bg-white shadow-md rounded-xl p-4 text-start">
                            <div className='flex justify-between mb-4'>
                                <p className="text-gray-500 text-sm">Kondisi Barang:</p>
                                <p className="font-bold">{borrowingData?.returnings?.returned_condition}</p>
                            </div>
                            <div className='flex justify-between mb-4'>
                                <p className="text-gray-500 text-sm">Verifikasi Admin:</p>
                                <Badge className="capitalize">{returningStatusMapper(borrowingData?.returnings?.status || '-')}</Badge>
                            </div>
                            <div className='flex justify-between mb-4'>
                                <p className="text-gray-500 text-sm">Tanggal Pengembalian:</p>
                                <p className="font-bold">{new Date(borrowingData?.returnings?.returned_date!).toLocaleString("id-ID")}</p>
                            </div>
                        </div>
                    </>

                )}
                {hasPaid && !isReturned && borrowingData?.status !== 'pending' && (
                    <Button
                        large rounded
                        onClick={() => setIsModalOpen(true)}
                        className="w-full h-12 mt-5"
                    >
                        Ajukan Pengembalian
                    </Button>
                )}
            </Block>

            <Sheet
                opened={isModalOpen}
                onBackdropClick={() => setIsModalOpen(false)}
            >
                <div className="p-4 pb-10 bg-white dark:bg-zinc-950 rounded-t-2xl">
                    <h1 className='font-bold text-xl mb-4'>Kondisi Barang</h1>
                    <div className='grid grid-cols-2 gap-2 mb-4'>
                        {conditonOption.map((item, index) => (
                            <Card
                                key={index}
                                className={`m-0 cursor-pointer transition-all border-2 ${returnedCondition === item.name
                                    ? 'border-primary bg-primary/5'
                                    : 'border-transparent'
                                    }`}
                                onClick={() => setReturnedCondition(item.name)}
                            >
                                <p className="font-semibold">{item.label}</p>
                            </Card>
                        ))}
                    </div>
                    <Block>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Upload Bukti Foto
                        </label>
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
                        <p className="text-xs text-gray-400 mt-2">Format: JPG, PNG, WEBP (Maks 5MB)</p>

                        {previewUrl && (
                            <div className="mt-4 relative inline-block">
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
                                    className="absolute -top-2 -right-2 bg-black/50 text-white rounded-full p-1 shadow-lg"
                                >
                                    <Icon icon="material-symbols:close-rounded" />
                                </button>
                            </div>
                        )}
                    </Block>

                    <Block className="mt-8">
                        <Button
                            large
                            rounded
                            onClick={handleConfirmReturn}
                            disabled={returnMutation.isPending}
                        >
                            {returnMutation.isPending ? 'Mengirim Data...' : 'Konfirmasi Pengembalian'}
                        </Button>
                    </Block>
                </div>
            </Sheet>
            <Sheet
                opened={isQRModalOpen}
                onBackdropClick={() => setIsQRModalOpen(false)}
            >
                <p className='text-center pt-4 font-semibold text-xl'>Kode QR Peminjaman</p>
                <p className='text-center mt-2'>QR ini dapat dipakai untuk staff menyetujui peminjaman atau pengembalian</p>
                <QRCodeSVG className='mx-auto'
                    value={qrData}
                    level="H"
                    includeMargin={true}
                    style={{ width: '100%', height: 'auto' }}
                    imageSettings={{
                        src: '',
                        x: undefined,
                        y: undefined,
                        height: 0,
                        width: 0,
                        excavate: true,
                    }}
                />
            </Sheet>
        </Page>
    );
}