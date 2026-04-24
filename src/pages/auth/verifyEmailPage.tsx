import React, { useState, useEffect } from 'react';
import { Page, Block, Button, } from 'konsta/react';
import * as z from 'zod';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useToast } from '../../context/toastContext';
import { verifyEmailApi, resendOTP } from '../../api/auth'; // Pastikan sudah dibuat
import OtpInput from '../../components/custom/otpInput';

export default function VerifyEmailPage() {
    const [otpValue, setOtpValue] = useState("");
    const [countdown, setCountdown] = useState(0);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { history } = useRouter();
    const email = localStorage.getItem('unverified-email');
    const userId = localStorage.getItem("unverified-user-id");

    useEffect(() => {

        if (!email || !userId) {
            history.go(-1)
        }
    }, [])

    // Countdown timer effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResendOTP = async () => {
        try {
            const res = await resendOTP('register',Number(userId), email);
            if (res.success) {
                showToast("Kode OTP baru telah dikirim", "success");
                setCountdown(60); // Start 60 second countdown
            } else {
                showToast(res.message || "Gagal mengirim ulang OTP", "error");
            }
        } catch (error) {
            showToast("Terjadi kesalahan saat mengirim ulang OTP", "error");
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otpValue.length < 6) {
            return showToast("Masukkan 6 digit OTP", "error");
        }
        const userId = localStorage.getItem("unverified-user-id");
        const res = await verifyEmailApi({
            user_id: Number(userId),
            otp_code: otpValue
        });
        if (res.success) {
            showToast("Berhasil! Silakan Login", "success");
            localStorage.removeItem('unverified-email');
            localStorage.removeItem("unverified-user-id");
            navigate({ to: '/auth/login' });
        } else {
            showToast(res.message, "error");
        }
    };

    return (
        <>
            <Block className="text-center">
                <Block className="text-center mt-10">
                    <h1 className="text-2xl font-semibold">Verifikasi Email</h1>
                    <p>kami telah mengirim kode verifikasi email ke <span>{localStorage.getItem('unverified-email')}</span></p>
                </Block>
                <OtpInput onChange={(val) => setOtpValue(val)} />

                <Button
                    large
                    rounded
                    className="mt-10 bg-primary"
                    onClick={handleVerify}
                >
                    Konfirmasi
                </Button>
            </Block>
            <Block className="text-center mt-4">
                <p className="text-sm text-gray-600 mb-2">
                    Tidak menerima kode?
                </p>
                <Button
                    rounded
                    outline
                    disabled={countdown > 0}
                    onClick={handleResendOTP}
                    className="text-primary border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {countdown > 0 ? `Kirim Ulang OTP (${countdown}s)` : 'Kirim Ulang OTP'}
                </Button>
            </Block>
        </>
    );
}