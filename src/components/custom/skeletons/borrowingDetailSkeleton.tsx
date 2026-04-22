import { Block, Navbar, NavbarBackLink, Page } from "konsta/react";

export default function BorrowingDetailSkeleton() {
    return (
        <Page>
            <Navbar
                className="top-0 sticky"
                left={<NavbarBackLink onClick={() => history.go(-1)} />}
                title="Detail Peminjaman"
            />
            <Block className="animate-pulse space-y-6">
                {/* Skeleton Header Detil */}
                <div className="space-y-4">
                    <div className="h-7 bg-gray-200 dark:bg-zinc-800 rounded-md w-1/2 mb-6"></div>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex justify-between">
                            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded w-1/3"></div>
                        </div>
                    ))}
                    <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-full w-full mt-4"></div>
                </div>

                <div className="h-0.5 bg-gray-100 dark:bg-zinc-800 w-full"></div>

                {/* Skeleton Barang */}
                <div className="space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/4"></div>
                    <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl p-4 flex gap-4">
                        <div className="size-16 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/3"></div>
                        </div>
                    </div>
                </div>

                <div className="h-0.5 bg-gray-100 dark:bg-zinc-800 w-full"></div>

                {/* Skeleton Pembayaran */}
                <div className="space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded w-1/3"></div>
                    <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-xl p-4 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex justify-between">
                                <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/4"></div>
                                <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </Block>
        </Page>
    )
}