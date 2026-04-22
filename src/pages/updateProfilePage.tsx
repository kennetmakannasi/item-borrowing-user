import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/authContext';
import { useToast } from '../context/toastContext';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { updateProfileSchema, type UpdateProfileType } from '../interfaces/schemas/profile';
import { updateProfileApi } from '../api/profile';
import { Icon } from '@iconify/react';

import {
    Page,
    Navbar,
    NavbarBackLink,
    Block,
    Button,
    Sheet, // Tambahkan ini
} from 'konsta/react';

export default function UpdateProfilePage() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const { history } = useRouter();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [previewUrl, setPreviewUrl] = useState<string | null>(user?.avatar || null);
    
    // State untuk Sheet konfirmasi
    const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfileType>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            user_name: user?.user_name || '',
            display_name: user?.display_name || '',
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('avatar', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Fungsi submit yang akan dipanggil setelah konfirmasi di Sheet
    const onActualSubmit = async (data: UpdateProfileType) => {
        try {
            setIsConfirmSheetOpen(false); // Tutup sheet dulu
            const res = await updateProfileApi(data);
            if (res.success) {
                showToast('Profil berhasil diperbarui', 'success');
                queryClient.invalidateQueries({ queryKey: ['authUser'] });
                history.go(-1);
            } else {
                showToast(res.message, 'error');
            }
        } catch (error) {
            showToast('Terjadi kesalahan server', 'error');
        }
    };

    return (
        <>
            <Navbar
                title="Edit Profil"
                centerTitle={true}
                left={<NavbarBackLink onClick={() => history.go(-1)} />}
                colors={{ bgMaterial: 'bg-white' }}
            />

            {/* Form tetap menggunakan styling lama, hanya ganti onSubmit-nya */}
            <form onSubmit={handleSubmit(() => setIsConfirmSheetOpen(true))} className='space-y-5'>
                <Block className="flex flex-col items-center mt-8">
                    <div
                        className="size-40 rounded-full overflow-hidden mb-4 relative cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <img
                            src={previewUrl || '/placeholders/profile.png'}
                            className="w-full h-full object-cover"
                            alt="Avatar"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                            <Icon height={50} icon={"mdi-light:pencil"} />
                        </div>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    {errors.avatar && (
                        <span className="text-red-500 text-xs">{errors.avatar.message as string}</span>
                    )}
                </Block>

                <div className="space-y-1 px-4">
                    <p className='ml-2'>Nama</p>
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

                <div className="space-y-1 px-4">
                    <p className='ml-2'>Nama Pengguna</p>
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

                <Block className="mt-8">
                    <Button
                        large
                        rounded
                        type="submit"
                        className='bg-primary'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                </Block>
            </form>

            {/* Sheet Konfirmasi */}
            <Sheet
                opened={isConfirmSheetOpen}
                onBackdropClick={() => setIsConfirmSheetOpen(false)}
            >
                <Block className="space-y-4">
                    <div className="text-center py-2">
                        <h2 className="text-xl font-bold mb-2">Simpan Perubahan?</h2>
                        <p className="text-gray-500">Pastikan data yang Anda masukkan sudah benar sebelum disimpan.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            large
                            clear
                            rounded
                            outline
                            className="border-primary text-primary"
                            onClick={() => setIsConfirmSheetOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            large
                            rounded
                            className="bg-primary"
                            
                            onClick={handleSubmit(onActualSubmit)}
                        >
                            Ya, Simpan
                        </Button>
                    </div>
                </Block>
            </Sheet>
        </>
    );
}