export default function BorrowingHistoryCardSkeleton() {
    return (
        <div className="bg-white shadow-md rounded-xl p-4 text-start animate-pulse">
            <div className="flex gap-x-4 h-full w-full items-center">
                <div className="size-16 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
            <div className="flex w-full justify-between items-center mt-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
            <div className="flex w-full justify-between items-center mt-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
        </div>
    )
}