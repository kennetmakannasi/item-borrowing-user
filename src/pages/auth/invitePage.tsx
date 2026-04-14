import { Page, Block, Button } from 'konsta/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router'; // Asumsi menggunakan TanStack Router sesuai kode awal
import { useToast } from '../../context/toastContext';
import { Route } from '../../routes/auth/invite';
import { activateAccountApi, getInvitationData } from '../../api/auth';

// Schema khusus untuk aktivasi sesuai permintaan Anda
export const activationSchema = z.object({
    jwt: z.string().min(1),
    password: z.string().min(8, "Panjang password minimal 8 huruf!"),
    email: z.string().optional(),
    user_name: z.string().optional(),
    display_name: z.string().optional(),
});

type ActivationInputs = z.infer<typeof activationSchema>;

export default function ActivationPage() {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { jwt } = Route.useSearch();
    const [isLoadingData, setIsLoadingData] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ActivationInputs>({
        resolver: zodResolver(activationSchema),
        defaultValues: {
            jwt: jwt
        }
    });

    useEffect(() => {
        if (!jwt) {
            navigate({
                to: '/auth/register',
                replace: true
            })
        }
    }, [])

    useEffect(() => {
        async function fetchPreFillData() {
            try {
                const res = await getInvitationData(jwt);
                if (res.success) {
                    const userData = res.data;
                    setValue('email', userData.email);
                    setValue('user_name', userData.user_name);
                    setValue('display_name', userData.display_name);
                }
                if (!res.success) {
                    navigate({
                        to: '/auth/register',
                        replace: true
                    })
                }
            } catch (error: any) {
                showToast("Token tidak valid atau sudah kadaluarsa");
                navigate({
                    to: '/auth/register',
                    replace: true
                })
                console.error(error);
            } finally {
                setIsLoadingData(false);
            }
        }
        fetchPreFillData();
    }, [jwt, setValue]);

    async function onSubmit(data: ActivationInputs) {
        try {
            const payload = {
                jwt: data.jwt,
                password: data.password
            };

            const res = await activateAccountApi(payload);

            if (res?.success) {
                showToast("Akun berhasil diaktivasi!");
                navigate({ to: '/auth/login', replace: true });
            } else {
                showToast(res?.message || "Gagal aktivasi");
            }
        } catch (error: any) {
            showToast(error.response?.data?.message || "Terjadi kesalahan server");
        }
    }

    if (isLoadingData) return <Page><Block>Memuat data...</Block></Page>;

    return (
        <Page>
            <Block className="text-center mt-10">
                <h1 className="text-3xl font-bold text-primary">Aktivasi Akun</h1>
                <p className="text-gray-500 mt-2">Lengkapi kata sandi untuk mengaktifkan akun Anda</p>
            </Block>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                <input type="hidden" {...register('jwt')} />

                <div className="space-y-1 px-4 opacity-70">
                    <label className="text-xs ml-4 text-gray-400">Email</label>
                    <input
                        {...register('email')}
                        type="email"
                        disabled
                        className="w-full px-5 py-3 rounded-full border-2 border-gray-200 bg-gray-100 outline-none"
                    />
                </div>

                <div className="space-y-1 px-4 opacity-70">
                    <label className="text-xs ml-4 text-gray-400">Username</label>
                    <input
                        {...register('user_name')}
                        type="text"
                        disabled
                        className="w-full px-5 py-3 rounded-full border-2 border-gray-200 bg-gray-100 outline-none"
                    />
                </div>
                <div className="space-y-1 px-4 opacity-70">
                    <label className="text-xs ml-4 text-gray-400">Nama</label>
                    <input
                        {...register('display_name')}
                        type="text"
                        disabled
                        className="w-full px-5 py-3 rounded-full border-2 border-gray-200 bg-gray-100 outline-none"
                    />
                </div>

                <div className="space-y-1 px-4">
                    <label className="text-xs ml-4 text-primary font-bold">Buat Kata Sandi Baru</label>
                    <input
                        {...register('password')}
                        type="password"
                        placeholder="Minimal 8 karakter"
                        className={`w-full px-5 py-3 rounded-full border-2 transition-all outline-none 
                        ${errors.password ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-primary'}`}
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500 ml-4 font-medium">{errors.password.message}</p>
                    )}
                </div>

                <Block className="p-0 !m-0 pt-4 space-y-3 text-center">
                    <Button
                        rounded
                        large
                        type="submit"
                        disabled={isSubmitting}
                        className={isSubmitting ? 'opacity-50' : ''}
                    >
                        {isSubmitting ? 'Mengaktifkan...' : 'Aktifkan Sekarang'}
                    </Button>
                </Block>
            </form>
        </Page>
    );
}