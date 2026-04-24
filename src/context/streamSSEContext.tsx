import { createContext, useEffect } from "react";
import Cookies from 'js-cookie';
import { useToast } from "./toastContext";

const SSEContext = createContext<null | undefined>(undefined);

export const SSEProvider = ({ children }: { children: React.ReactNode }) => {
    const token = Cookies.get('auth_token');
    const { showToast } = useToast();
    
    useEffect(() => {
        if (!token) return;

        const eventSource = new EventSource(
            `${import.meta.env.VITE_API_URL}/notifications/stream?token=${token}`
        );
        eventSource.addEventListener("notification", (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Notifikasi  Baru:", data);
                showToast("notif");
            } catch (e) {
                console.log("Data bukan JSON:", event.data);
            }
        });

        eventSource.onerror = (err) => {
            console.error("EventSource failed:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [token]);
    return (
        <SSEContext.Provider value={null}>
            {children}
        </SSEContext.Provider>
    );
}