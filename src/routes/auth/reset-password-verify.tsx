import { createFileRoute } from '@tanstack/react-router';
import ResetPasswordVerifyPage from '../../pages/auth/resetPasswordVerifyPage';

export const Route = createFileRoute('/auth/reset-password-verify')({
  component: ResetPasswordVerifyPage,
});
