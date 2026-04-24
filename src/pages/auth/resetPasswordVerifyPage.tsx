import { useState, useEffect } from 'react';
import { Block, Button } from 'konsta/react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useToast } from '../../context/toastContext';
import { verifyAndResetPasswordApi, resendOTP } from '../../api/auth';
import OtpInput from '../../components/custom/otpInput';
import { Icon } from '@iconify/react';

export default function ResetPasswordVerifyPage() {
    const [otpValue, setOtpValue] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const { showToast } = useToast();
    const navigate = useNavigate();
    const { history } = useRouter();

    const userId = localStorage.getItem("reset-user-id");
    const email = localStorage.getItem("reset-email");

    useEffect(() => {
        const userId = localStorage.getItem("reset-user-id");
        if (!userId) history.go(-1);
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResendOTP = async () => {
        try {
            const res = await resendOTP('password_reset', Number(userId), email);
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

    const handleReset = async () => {
        if (otpValue.length < 6) return showToast("Masukkan 6 digit OTP", "error");
        if (newPassword.length < 8) return showToast("Password minimal 8 karakter", "error");

        setLoading(true);
        const userId = localStorage.getItem("reset-user-id");

        const res = await verifyAndResetPasswordApi({
            user_id: Number(userId),
            otp_code: otpValue,
            new_password: newPassword
        });

        setLoading(false);
        if (res.success) {
            showToast("Password berhasil diganti!", "success");
            localStorage.removeItem('reset-email');
            localStorage.removeItem("reset-user-id");
            navigate({ to: '/auth/login' });
        } else {
            showToast(res.message, "error");
        }
    };
    return (
        <>
            <Block className="space-y-6">
                <Block className="text-center mt-10">
                    <h1 className="text-2xl font-semibold">Atur Ulang Password</h1>
                    <p>Masukkan kode OTP yang dikirim ke <br /><b>{localStorage.getItem('reset-email')}</b></p>
                </Block>

                <div className="flex justify-center">
                    <OtpInput onChange={(val) => setOtpValue(val)} />
                </div>

                <div className="space-y-1 px-4 mt-6">
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password Baru"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-5 py-3 pr-14 rounded-full border-2 border-gray-200 transition-all outline-none focus:border-primary"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                        >
                            <Icon icon={showPassword ? 'material-symbols:visibility-off-outline' : 'material-symbols:visibility-outline'} className="text-xl" />
                        </button>
                    </div>
                </div>

                <Block className="px-4">
                    <Button
                        large rounded
                        className="bg-primary"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : 'Ganti Password'}
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
            </Block>
        </>
    )
}