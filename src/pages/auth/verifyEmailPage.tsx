import React, { useState, useEffect } from 'react';
import { Page, Block, Button, } from 'konsta/react';
import * as z from 'zod';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useToast } from '../../context/toastContext';
import { verifyEmailApi } from '../../api/auth'; // Pastikan sudah dibuat
import OtpInput from '../../components/custom/otpInput';

export default function VerifyEmailPage() {
    const [otpValue, setOtpValue] = useState("");
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { history } = useRouter();

    useEffect(() => {
        const email = localStorage.getItem('unverified-email');
        const userId = localStorage.getItem("unverified-user-id");

        if (!email || !userId) {
            history.go(-1)
        }
    }, [])

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
        <Page>
            <Block className="text-center">
                <Block className="text-center mt-10">
                    <h1 className="text-3xl font-bold text-primary">Verifikasi Email</h1>
                    <p>kami telah mengirim kode verifikasi email ke <span>{localStorage.getItem('unverified-email')}</span></p>
                </Block>
                <OtpInput onChange={(val) => setOtpValue(val)} />

                <Button
                    large
                    rounded
                    className="mt-10"
                    onClick={handleVerify}
                >
                    Konfirmasi
                </Button>
            </Block>
        </Page>
    );
}