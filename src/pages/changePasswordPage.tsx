import { useState } from 'react';
import { Page, Block, Button } from 'konsta/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { useToast } from '../context/toastContext';
import { Icon } from '@iconify/react';
import { requestChangePasswordApi } from '../api/profile';
import { changePasswordSchema, type ChangePasswordRequestType } from '../interfaces/schemas/profile';
import * as z from 'zod';

// Extend the schema to include password confirmation validation
const changePasswordFormSchema = changePasswordSchema.extend({
    confirm_new_password: z.string().min(8, "Panjang password minimal 8 huruf!")
}).refine((data) => data.new_password === data.confirm_new_password, {
    message: "Password baru dan konfirmasi password tidak cocok",
    path: ["confirm_new_password"],
});

type ChangePasswordFormInputs = z.infer<typeof changePasswordFormSchema>;

export default function ChangePasswordPage() {
    const { showToast } = useToast();
    const { history } = useRouter();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormInputs>({
        resolver: zodResolver(changePasswordFormSchema),
    });

    async function onSubmit(data: ChangePasswordFormInputs) {
        try {
            const payload: ChangePasswordRequestType = {
                current_password: data.current_password,
                new_password: data.new_password,
                confirm_new_password: data.confirm_new_password,
            };

            const res = await requestChangePasswordApi(payload);

            if (res?.success) {
                showToast(res?.message);
                setTimeout(() => {
                    history.go(-1);
                }, 1500);
            } else {
                showToast(res?.message, 'error');
            }
        } catch (error: any) {
            console.error(error);
            showToast('Terjadi kesalahan', 'error');
        }
    }

    return (
        <Page>
            <Block className="text-center mt-10">
                <h1 className="text-3xl font-bold text-primary">Ubah Password</h1>
            </Block>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                {/* Current Password */}
                <div className="space-y-1 px-4">
                    <div className="relative">
                        <input
                            {...register('current_password')}
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Password Saat Ini"
                            className={`w-full px-5 py-3 pr-14 rounded-full border-2 transition-all outline-none 
              ${errors.current_password ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-primary'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword((current) => !current)}
                            aria-label={showCurrentPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                        >
                            <Icon
                                icon={showCurrentPassword ? 'material-symbols:visibility-off-outline' : 'material-symbols:visibility-outline'}
                                className="text-xl"
                            />
                        </button>
                    </div>
                    {errors.current_password && (
                        <p className="text-xs text-red-500 ml-4 font-medium">{errors.current_password.message}</p>
                    )}
                </div>

                {/* New Password */}
                <div className="space-y-1 px-4">
                    <div className="relative">
                        <input
                            {...register('new_password')}
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Password Baru"
                            className={`w-full px-5 py-3 pr-14 rounded-full border-2 transition-all outline-none 
              ${errors.new_password ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-primary'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword((current) => !current)}
                            aria-label={showNewPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                        >
                            <Icon
                                icon={showNewPassword ? 'material-symbols:visibility-off-outline' : 'material-symbols:visibility-outline'}
                                className="text-xl"
                            />
                        </button>
                    </div>
                    {errors.new_password && (
                        <p className="text-xs text-red-500 ml-4 font-medium">{errors.new_password.message}</p>
                    )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1 px-4">
                    <div className="relative">
                        <input
                            {...register('confirm_new_password')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Konfirmasi Password Baru"
                            className={`w-full px-5 py-3 pr-14 rounded-full border-2 transition-all outline-none 
              ${errors.confirm_new_password ? 'border-red-500 focus:border-red-600' : 'border-gray-200 focus:border-primary'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((current) => !current)}
                            aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                        >
                            <Icon
                                icon={showConfirmPassword ? 'material-symbols:visibility-off-outline' : 'material-symbols:visibility-outline'}
                                className="text-xl"
                            />
                        </button>
                    </div>
                    {errors.confirm_new_password && (
                        <p className="text-xs text-red-500 ml-4 font-medium">{errors.confirm_new_password.message}</p>
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
                        {isSubmitting ? 'Memproses...' : 'Ubah Password'}
                    </Button>
                    <button
                        type="button"
                        onClick={() => history.go(-1)}
                        className='text-sm text-gray-500 hover:text-gray-700'
                    >
                        Kembali
                    </button>
                </Block>
            </form>
        </Page>
    );
}
