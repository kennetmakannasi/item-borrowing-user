import { useNavigate } from '@tanstack/react-router';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from 'konsta/react';
import { useEffect, useRef } from 'react';

export default function ScanQrPage() {
    const navigate = useNavigate();

    const Html5QrcodePlugin = () => {
        const scannerRef = useRef<Html5Qrcode | null>(null);
        const containerId = "qr-reader";

        useEffect(() => {
            if (!scannerRef.current) {
                scannerRef.current = new Html5Qrcode(containerId);
            }

            const startScanner = async () => {
                try {
                    if (scannerRef.current?.isScanning) {
                        await scannerRef.current.stop();
                    }

                    await scannerRef.current?.start(
                        { facingMode: "environment" },
                        {
                            fps: 10,
                            qrbox: { width: 250, height: 250 },
                            aspectRatio: 1.0
                        },
                        (decodedText) => {
                            const parsedString = JSON.parse(decodedText);
                            console.log(`QR Code detected: ${parsedString.item_id}`);
                            navigate({
                                to: '/item',
                                state: (prev) => ({
                                    ...prev,
                                    id: parsedString.item_id
                                })
                            })
                        },
                        () => { }
                    );
                } catch (err) {
                    console.error("Gagal memulai kamera:", err);
                }
            };

            startScanner();

            return () => {
                const stopAndClear = async () => {
                    if (scannerRef.current?.isScanning) {
                        await scannerRef.current.stop();
                    }
                };
                stopAndClear();
            };
        }, []);

        return (
            <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-xl bg-black">
                <div id={containerId} className="w-full"></div>
            </div>
        );
    };

    return (
        <div className="bg-black h-screen flex relative items-center">
            <Html5QrcodePlugin />
            <div className='absolute bottom-10 px-4 w-full'>
                <Button rounded onClick={ () => navigate({
                    to: '/',
                    replace: true
                }) }>Batal</Button>
            </div>
        </div>
    );
}