import { Page, Navbar, Block, Button } from 'konsta/react';

export default function ItemDetailSkeleton() {
    return (
        <Page>
            <Navbar
                className="top-0 fixed"
                colors={{ bgMaterial: 'bg-transparent' }}
                left={<div className="bg-gray-200 animate-pulse size-10 rounded-full" />}
                right={<div className="bg-gray-200 animate-pulse size-10 rounded-full" />}
            />

            <div className="w-full h-[400px] bg-gray-200 animate-pulse" />

            <div className="flex gap-x-3 m-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="size-16 rounded-lg bg-gray-200 animate-pulse" />
                ))}
            </div>

            <div className="px-5 py-2">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 space-y-2">
                        <div className="h-7 bg-gray-200 animate-pulse rounded-md w-3/4" />
                        <div className="h-4 bg-gray-200 animate-pulse rounded-md w-1/2" />
                        <div className="h-6 bg-gray-200 animate-pulse rounded-md w-1/3" />
                    </div>
                    <div className="size-8 bg-gray-200 animate-pulse rounded-full ml-4" />
                </div>

                <div className="flex gap-2 mb-6">
                    <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full" />
                    <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full" />
                </div>

                <div className="space-y-2">
                    <div className="h-5 bg-gray-200 animate-pulse rounded-md w-full" />
                    <div className="h-5 bg-gray-200 animate-pulse rounded-md w-full" />
                    <div className="h-5 bg-gray-200 animate-pulse rounded-md w-2/3" />
                </div>
            </div>

            <div className="w-full bg-white bottom-0 left-0 fixed p-5">
                <div className="h-12 bg-gray-200 animate-pulse rounded-full w-full" />
            </div>
        </Page>
    );
}