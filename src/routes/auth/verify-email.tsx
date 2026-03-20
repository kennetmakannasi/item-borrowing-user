import { createFileRoute } from '@tanstack/react-router'
import VerifyEmailPage from '../../pages/auth/verifyEmailPage'

export const Route = createFileRoute('/auth/verify-email')({
  component: VerifyEmailPage,
})
