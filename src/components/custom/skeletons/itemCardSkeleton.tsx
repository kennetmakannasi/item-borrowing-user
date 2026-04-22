export default function ItemCardSkeleton() {
    return (
        <div className="bg-white shadow-md rounded-xl p-3 text-start animate-pulse">
            <div className="w-full h-40 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mt-3 mb-2"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
    )
}