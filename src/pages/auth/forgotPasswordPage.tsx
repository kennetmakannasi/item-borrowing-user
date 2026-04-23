import { Block, Button } from 'konsta/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { requestResetPasswordApi } from '../../api/auth';
import { useNavigate } from '@tanstack/react-router';
import { useToast } from '../../context/toastContext';

const schema = z.object({
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
});

export default function ForgotPasswordPage() {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    async function onSubmit(data: { email: string }) {
        const res = await requestResetPasswordApi(data);
        if (res.success) {
            showToast(res.message, "success");
            // Simpan data sementara untuk tahap verifikasi
            localStorage.setItem("reset-user-id", res.data.user_id.toString());
            localStorage.setItem("reset-email", data.email);
            navigate({ to: '/auth/reset-password-verify' });
        } else {
            showToast(res.message, "error");
        }
    }

    return (
        <>
            <Block className="text-center mt-10">
                <h1 className="text-2xl font-semibold">Lupa Kata Sandi</h1>
                <p className="text-gray-500 mt-2 px-4">Masukkan email terdaftar untuk menerima kode OTP.</p>
            </Block>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5 px-4">
                <div className="space-y-1">
                    <input
                        {...register('email')}
                        type="email"
                        placeholder="Email Anda"
                        className={`w-full px-5 py-3 rounded-full border-2 transition-all outline-none 
                        ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 ml-4">{errors.email.message}</p>}
                </div>

                <Button
                    rounded large type="submit"
                    disabled={isSubmitting}
                    className="bg-primary"
                >
                    {isSubmitting ? 'Mengirim...' : 'Kirim OTP'}
                </Button>
            </form>
        </>
    );
}