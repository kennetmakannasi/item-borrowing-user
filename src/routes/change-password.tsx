import { createFileRoute } from '@tanstack/react-router'
import ChangePasswordPage from '../pages/changePasswordPage'

export const Route = createFileRoute('/change-password')({
  component: ChangePasswordPage,
})
