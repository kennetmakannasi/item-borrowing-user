import { Page, Navbar, NavbarBackLink, Card, Block, Button } from "konsta/react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotificationsApi, readNotificationApi, ReadAllNotificationApi } from "../api/notifications";
import { useState } from "react";
import { useRouter } from "@tanstack/react-router"; // Pastikan import router
import { Icon } from "@iconify/react";

export default function NotificationsPage() {
    const { history } = useRouter();
    const queryClient = useQueryClient();
    const [currentPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['notifications', currentPage],
        queryFn: () => getNotificationsApi(currentPage),
    });

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

    const handleNotificationClick = (item: any) => {
        if (!item.isRead) {
            readMutation.mutate(item.id);
        }
    };

    if (isLoading) return <Page><Block className="text-center">Memuat notifikasi...</Block></Page>;

    return (
        <Page>
            <Navbar
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

            {data?.data.length === 0 && (
                <div className="text-center text-gray-500 mt-10">Tidak ada notifikasi</div>
            )}

            {data?.data.map((item) => (
                <Card
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`m-0 mb-3 cursor-pointer transition-colors ${item.isRead ? 'bg-white opacity-70' : 'bg-white shadow-md   '}`}
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
                                {new Date(item.createdAt).toLocaleString('id-ID', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                })}
                            </p>
                        </div>
                    </div>
                </Card>
            ))}
        </Page>
    );
}