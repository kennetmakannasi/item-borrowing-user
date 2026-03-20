import {
    Navbar,
    Card,
    BlockTitle,
    Page,
} from 'konsta/react';

export default function ProfilePage() {
    return (
        <Page>
            <Card className='bg-white shadow-lg'>
                <div className='flex gap-x-4 items-center'>
                    <div className='size-20 bg-red-500 rounded-full'></div>
                    <div>
                        <p className='text-lg font-semibold'>USERNAME</p>
                        <p>email@email.com</p>
                    </div>
                </div>
            </Card>
        </Page>
    )
}