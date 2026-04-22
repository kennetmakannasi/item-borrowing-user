import {
    Card,
    Page,
    Sheet,
    Block,
    Button
} from 'konsta/react';
import { useAuth } from '../context/authContext';
import { Link } from '@tanstack/react-router';
import { Icon } from '@iconify/react';
import { useToast } from '../context/toastContext';
import { useState } from 'react';

export default function ProfilePage() {
    const { showToast } = useToast();
    const { user, logout } = useAuth();
    
    // State untuk kontrol Sheet Logout
    const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);

    function handleLogout() {
        logout();
        setIsLogoutSheetOpen(false);
        showToast("Berhasil Keluar");
    }

    return (
        <>
            {/* Profile Info Card */}
            <Card className='bg-white shadow-md'>
                <div className='flex gap-x-4 items-center'>
                    <img className='size-20 rounded-full object-cover' src={user?.avatar || '/placeholders/profile.png'} alt="" />
                    <div>
                        <p className='text-lg font-semibold'>{user?.display_name}</p>
                        <p className='text-gray-500 text-sm'>@{user?.user_name}</p>
                        <p className='text-gray-500 text-sm'>{user?.email}</p>
                    </div>
                </div>
            </Card>

            {/* Menu Cards */}
            <Card className='bg-white shadow-md p-0'>
                <Link to='/update-profile'>
                    <button className='w-full flex gap-x-3 items-center p-4 hover:bg-gray-50 transition-colors'>
                        <Icon height={24} icon={"mdi-light:pencil"} className="text-gray-600" />
                        <p className="font-medium">Edit Profil</p>
                    </button>
                </Link>
            </Card>

            <Card className='bg-white shadow-md p-0'>
                <Link to='/change-password'>
                    <button className='w-full flex gap-x-3 items-center p-4 hover:bg-gray-50 transition-colors'>
                        <Icon height={24} icon={"mdi-light:lock"} className="text-gray-600" />
                        <p className="font-medium">Ubah Password</p>
                    </button>
                </Link>
            </Card>

            <Card className='bg-white shadow-md p-0'>
                <button 
                    onClick={() => setIsLogoutSheetOpen(true)} 
                    className='w-full flex gap-x-3 items-center p-4 text-red-600 hover:bg-red-50 transition-colors'
                >
                    <Icon height={24} icon={"material-symbols:logout-rounded"} />
                    <p className='font-semibold'>Keluar</p>
                </button>
            </Card>

            {/* Logout Confirmation Sheet */}
            <Sheet className='bg-white'
                opened={isLogoutSheetOpen}
                onBackdropClick={() => setIsLogoutSheetOpen(false)}
            >
                <Block className="space-y-4">
                    <div className="text-center py-2">
                        <div className="bg-red-100 text-red-600 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon icon="material-symbols:logout-rounded" width="32" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Konfirmasi Keluar</h2>
                        <p className="text-gray-500">Apakah Anda yakin ingin keluar dari akun ini?</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            large
                            clear
                            rounded
                            className="border-primary text-primary"
                            outline
                            onClick={() => setIsLogoutSheetOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            large
                            rounded
                            className="bg-primary"
                            onClick={handleLogout}
                        >
                            Ya, Keluar
                        </Button>
                    </div>
                </Block>
            </Sheet>
        </>
    );
}