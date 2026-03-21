import {
    Card,
    Page,
} from 'konsta/react';
import { useAuth } from '../context/authContext';
import { Link } from '@tanstack/react-router';
import { Icon } from '@iconify/react';
import { useToast } from '../context/toastContext';

export default function ProfilePage() {
    const { showToast } = useToast();
    const { user, logout } = useAuth();

    function handleLogout() {
        logout()
        showToast("Berhasil Keluar")
    }

    return (
        <Page>
            <Card className='bg-white shadow-md'>
                <div className='flex gap-x-4 items-center'>
                    <img className='size-20 rounded-full object-cover' src={user?.avatar || '/placeholders/profile.png'} alt="" />
                    <div>
                        <p className='text-lg font-semibold'>{user?.display_name}</p>
                        <p>{user?.user_name}</p>
                        <p>{user?.email}</p>
                    </div>
                </div>
            </Card>
            <Card className='bg-white shadow-md'>
                <Link to='/update-profile'>
                    <button className='w-full flex gap-x-2 items-center'>
                        <Icon height={25} icon={"mdi-light:pencil"} />
                        <p>Edit Profil</p>
                    </button>
                </Link>
            </Card>

            <Card className='bg-white shadow-md'>
                <button onClick={handleLogout} className='w-full flex gap-x-2 items-center text-red-600'>
                    <Icon height={25} icon={"material-symbols:logout-rounded"} />
                    <p className='font-semibold'>Keluar</p>
                </button>
            </Card>
        </Page>
    )
}