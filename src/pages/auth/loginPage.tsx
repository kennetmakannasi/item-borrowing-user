import React from 'react';
import { Page, Block, Button } from 'konsta/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { loginApi } from '../../api/auth';
import { useToast } from '../../context/toastContext';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../context/authContext';

const loginSchema = z.object({
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { showToast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: LoginFormInputs) {
        try {
            console.log('Data Login:', data);
            const res = await loginApi(data);

            if (res?.success) {
                const token = res?.data?.token;
                login(token);
                showToast(res?.message);

                navigate({
                    to: "/",
                    replace: true
                })
            } else {
                console.error(res?.message);
                showToast(res?.message);
                if (res.message === 'Verifikasi Email terlebih dahulu') {
                    localStorage.setItem("unverified-user-id", res.data.user.id.toString());
                    localStorage.setItem("unverified-email", data.email);
                    navigate({
                        to: '/auth/verify-email',
                        replace: true
                    })
                }
            }
        } catch (error: any) {
            console.error(error)
        }
    }

    return (
        <Page>
            <Block className="text-center mt-10">
                <h1 className="text-3xl font-bold text-primary">Masuk</h1>
            </Block>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                {/* Input Email */}
                <div className="space-y-1 px-4">
                    <input
                        {...register('email')}
                        type="email"
                        placeholder="Email"
                        className={`w-full px-5 py-3 rounded-full border-2 transition-all outline-none 
              ${errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-primary'}`}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500 ml-4 font-medium">{errors.email.message}</p>
                    )}
                </div>

                {/* Input Password */}
                <div className="space-y-1 px-4">
                    <input
                        {...register('password')}
                        type="password"
                        placeholder="Kata Sandi"
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
                        {isSubmitting ? 'Memproses...' : 'Masuk'}
                    </Button>
                    <Link to='/auth/register'>
                        <p>Belum punya akun? <span className='text-blue-400'>Daftar</span></p>
                    </Link>
                </Block>
            </form>
        </Page>
    );
}