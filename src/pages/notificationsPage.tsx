import { Page, Navbar, NavbarBackLink, Card, Block } from "konsta/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotificationsApi, readNotificationApi, ReadAllNotificationApi } from "../api/notifications";
import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router"; // Pastikan import router
import { useInView } from 'react-intersection-observer';
import NotificationCardSkeleton from '../components/custom/skeletons/notificationCardSkeleton';
import type { NotificationItem } from '../interfaces/notifications';
import type { Pagination } from '../interfaces/generalResponse';
import useFormatDate from "../utils/dateFormatter";

export default function NotificationsPage() {
    const { history } = useRouter();
    const queryClient = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [pageInfo, setPageInfo] = useState<Pagination | null>(null);
    const { ref, inView } = useInView({ threshold: 0 });

    const { data: queryData, isLoading, isError } = useQuery({
        queryKey: ['notifications', currentPage],
        queryFn: () => getNotificationsApi(currentPage),
    });

    useEffect(() => {
        if (!queryData) return;

        if (currentPage === 1) {
            setNotifications(queryData.data ?? []);
        } else {
            setNotifications((prev) => [
                ...prev,
                ...(queryData.data ?? []),
            ]);
        }
        setPageInfo(queryData.pagination);
    }, [queryData, currentPage]);

    useEffect(() => {
        if (inView && pageInfo?.has_next_page) {
            setCurrentPage((prev) => prev + 1);
        }
    }, [inView, pageInfo]);

    const readMutation = useMutation({
        mutationFn: (id: number) => readNotificationApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const readAllMutation = useMutation({
        mutationFn: ReadAllNotificationApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const handleNotificationClick = (item: NotificationItem) => {
        if (!item.isRead) {
            readMutation.mutate(item.id);
        }
    };

    if (isError && notifications.length === 0) return <Page><Block className="text-center text-red-500">Gagal mengambil notifikasi.</Block></Page>;

    return (
        <>
            <Navbar
                bgClassName='border-t border-2 border-gray-200 dark:border-gray-700'
                colors={{
                    bgMaterial: 'bg-white'
                }}
                className="top-0 sticky"
                left={<NavbarBackLink onClick={() => history.go(-1)} />}
                title="Notifikasi"
                right={
                    <button
                        onClick={() => readAllMutation.mutate()}
                        className="text-primary text-sm font-medium mr-4 disabled:opacity-50"
                        disabled={readAllMutation.isPending}
                    >
                        Baca Semua
                    </button>
                }
            />

            {notifications.length === 0 ? (
                isLoading ? (
                    <div className='grid grid-cols-1 gap-3 px-5 mt-5'>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <NotificationCardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-10">Tidak ada notifikasi</div>
                )
            ) : (
                notifications.map((item) => (
                    <Card
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`m-0 mb-3 cursor-pointer transition-colors ${item.isRead ? 'bg-white opacity-70' : 'bg-white shadow-md'}`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    {!item.isRead && (
                                        <span className="size-2 bg-primary rounded-full animate-pulse" />
                                    )}
                                    <p className={`text-sm ${item.isRead ? 'text-gray-600' : 'font-bold text-black'}`}>
                                        {item.message}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400">
                                   {useFormatDate(item.createdAt)}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))
            )}

            {pageInfo?.has_next_page && (
                <div ref={ref} className="mb-20 text-center text-sm text-gray-500">
                    {isLoading ? 'Memuat lebih banyak notifikasi...' : 'Scroll untuk memuat lebih banyak'}
                </div>
            )}
        </>
    );
}