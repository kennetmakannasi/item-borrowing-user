export default function NotificationCardSkeleton() {
    return (
        <div className="bg-white shadow-md rounded-xl p-4 animate-pulse">
            <div className="flex items-start gap-3">
                <div className="size-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
            </div>
        </div>
    );
}