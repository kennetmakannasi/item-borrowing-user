import { useState } from 'react';
import { Page, Block, Button } from 'konsta/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { registerApi } from '../../api/auth';
import { Link, useNavigate } from '@tanstack/react-router';
import { useToast } from '../../context/toastContext';
import { Icon } from '@iconify/react';

export const registerSchema = z.object({
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    user_name: z.string().min(3, 'Username minimal 3 karakter').max(20, 'Username maksimal 20 karakter').regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh berisi huruf, angka, dan underscore'),
    display_name: z.string().min(1, 'Nama tampilan wajib diisi').max(50, 'Nama tampilan terlalu panjang'),
    password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(data: RegisterFormInputs) {
        try {
            console.log('Data register:', data);
            const res = await registerApi(data);
            
            if (res?.success) {
                showToast(res?.message);
                localStorage.setItem("unverified-user-id", res.data.id.toString());
                localStorage.setItem("unverified-email", data.email);
                navigate({
                    to: '/auth/verify-email',
                    replace: true
                })
            } else {
                console.error(res?.message);
                showToast(res?.message);
            }
        } catch (error: any) {
            console.error(error)
        }
    }

    return (
        <Page>
            <Block className="text-center mt-10">
                <h1 className="text-3xl font-bold text-primary">Daftar</h1>
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

                <div className="space-y-1 px-4">
                    <input
                        {...register('user_name')}
                        type="text"
                        placeholder="Nama Pengguna"
                        className={`w-full px-5 py-3 rounded-full border-2 transition-all outline-none 
              ${errors.user_name ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-primary'}`}
                    />
                    {errors.user_name && (
                        <p className="text-xs text-red-500 ml-4 font-medium">{errors.user_name.message}</p>
                    )}
                </div>

                <div className="space-y-1 px-4">
                    <input
                        {...register('display_name')}
                        type="text"
                        placeholder="Nama"
                        className={`w-full px-5 py-3 rounded-full border-2 transition-all outline-none 
              ${errors.display_name ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-primary'}`}
                    />
                    {errors.display_name && (
                        <p className="text-xs text-red-500 ml-4 font-medium">{errors.display_name.message}</p>
                    )}
                </div>

                {/* Input Password */}
                <div className="space-y-1 px-4">
                    <div className="relative">
                        <input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Kata Sandi"
                            className={`w-full px-5 py-3 pr-14 rounded-full border-2 transition-all outline-none 
              ${errors.password ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-primary'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                        >
                            <Icon
                                icon={showPassword ? 'material-symbols:visibility-off-outline' : 'material-symbols:visibility-outline'}
                                className="text-xl"
                            />
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-500 ml-4 font-medium">{errors.password.message}</p>
                    )}
                </div>

                <Block className="p-0 mt-4 space-y-3 text-center">
                    <Button
                        rounded
                        large
                        type="submit"
                        disabled={isSubmitting}
                        className={isSubmitting ? 'opacity-50' : ''}
                    >
                        {isSubmitting ? 'Memproses...' : 'Daftar'}
                    </Button>
                    <Link to='/auth/login'>
                        <p>Sudah punya akun? <span className='text-blue-400'>Masuk</span></p>
                    </Link>
                </Block>
            </form>
        </Page>
    );
}